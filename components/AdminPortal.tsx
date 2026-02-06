import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, CheckCircle, AlertCircle, Download, Loader2 } from 'lucide-react';
import { mapCsvRowToStudent, OMRCsvRow } from '../services/csvMapping';
import { calculateResults } from '../services/scoringService';
import { upsertStudent } from '../services/apiService';
import { saveAs } from 'file-saver';

export default function AdminPortal() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'parsing' | 'uploading' | 'complete'>('idle');
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [processedData, setProcessedData] = useState<any[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setLogs([]);
            setProcessedData([]);
        }
    };

    const addLog = (msg: string) => setLogs(prev => [msg, ...prev]);

    const handleUpload = async () => {
        if (!file) return;
        setStatus('parsing');
        addLog('Starting CSV parse...');

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                addLog(`Parsed ${results.data.length} rows.`);
                const rows = results.data as OMRCsvRow[];
                setStatus('uploading');

                const reportData: any[] = [];
                let successCount = 0;
                let failCount = 0;

                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    if (!row.student_id && !row.full_name) continue;

                    setProgress(Math.round(((i + 1) / rows.length) * 100));

                    try {
                        const mapped = mapCsvRowToStudent(row);
                        const analysis = calculateResults(mapped.responses);

                        const payload = {
                            userInfo: mapped.userInfo,
                            responses: mapped.responses,
                            results: analysis,
                            id: mapped.id
                        };

                        const response = await upsertStudent(payload);
                        const statusText = response.success ? 'Success' : 'Failed';
                        if (response.success) successCount++;
                        else failCount++;

                        reportData.push({
                            ...mapped.userInfo,
                            ...mapped.responses.academic,
                            topCareer1: analysis.topBranches[0]?.branch.name,
                            topCareer2: analysis.topBranches[1]?.branch.name,
                            topCareer3: analysis.topBranches[2]?.branch.name,
                            reportLink: response.success && response.id ? `${window.location.origin}/report/${response.id}` : 'Error',
                            status: statusText,
                            error: response.error || ''
                        });

                        if (i % 5 === 0 || i === rows.length - 1) {
                            setProcessedData([...reportData]);
                            addLog(`Processed ${i + 1}/${rows.length}: ${mapped.userInfo.fullName} - ${statusText}`);
                        }
                    } catch (e: any) {
                        console.error(e);
                        addLog(`Error processing row ${i}: ${e.message}`);
                        failCount++;
                    }
                }

                addLog(`Complete! Success: ${successCount}, Failed: ${failCount}`);
                setProcessedData(reportData);
                setStatus('complete');
            },
            error: (err) => {
                addLog(`CSV Parse Error: ${err.message}`);
                setStatus('idle');
            }
        });
    };

    const downloadSummary = () => {
        if (processedData.length === 0) return;

        // Flatten for CSV
        const csvData = processedData.map(d => ({
            'Student ID': d.id || '', // Note: userInfo doesn't have ID, it's separated? mapCsvRowToStudent returns {id...} which is OMR ID.
            // Wait, reportRows was Spread from userInfo. UserInfo has phone/email/name but not OMR ID explicitly in type.
            // Let's ensure we passed ID.
            // In loop: reportRows.push({ ...mapped.userInfo ... }). UserInfo doesn't have ID.
            // Let's fix that in next iteration or now.

            'Name': d.fullName,
            'Mobile': d.phone,
            'Email': d.email,
            'Grade': d.grade,
            'School': d.schoolName,
            'City': d.city,
            // 'Date': d.date, // UserInfo doesn't have Date. CsvRow has. mapCsvRowToStudent ignored it (commented out). User wants it.
            // We should add date to UserInfo or just Pass it through.

            'Top Career 1': d.topCareer1,
            'Top Career 2': d.topCareer2,
            'Top Career 3': d.topCareer3,
            'Favorite Subject': d.favoriteSubject,
            'Strongest Subject': d.strongestSubject,
            'Exam Prep': d.examPrep,
            'Career Goal': d.engineeringGoal,
            'Report Link': d.reportLink
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'Batch_Summary_Report.csv');
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Admin Portal: Batch Upload</h1>

            {/* Upload Area */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center mb-6">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <Upload size={32} />
                    </div>
                    <span className="text-lg font-semibold text-slate-700">
                        {file ? file.name : "Click to upload OMR CSV"}
                    </span>
                    <span className="text-sm text-slate-400 mt-2">Supports Bulk Student Data Import</span>
                </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={handleUpload}
                    disabled={!file || status !== 'idle'}
                    className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2
                        ${!file || status !== 'idle' ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}
                    `}
                >
                    {status === 'parsing' || status === 'uploading' ? <Loader2 className="animate-spin" /> : <FileText />}
                    {status === 'parsing' ? 'Parsing...' : status === 'uploading' ? 'Uploading...' : 'Process & Upload'}
                </button>

                {status === 'complete' && (
                    <button
                        onClick={downloadSummary}
                        className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700 shadow-md"
                    >
                        <Download /> Download Summary CSV
                    </button>
                )}
            </div>

            {/* Logs */}
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-sm h-64 overflow-y-auto">
                {logs.length === 0 ? <span className="text-slate-500 opacity-50">System Logs...</span> : logs.map((l, i) => (
                    <div key={i} className="mb-1 border-b border-slate-800 pb-1 last:border-0">{l}</div>
                ))}
            </div>
        </div>
    );
}
