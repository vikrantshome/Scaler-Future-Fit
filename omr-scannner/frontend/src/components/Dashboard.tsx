import { useState, useRef, useEffect, useCallback } from 'react';
import { FileUploader } from './FileUploader';
import { loadPDF, renderPageToImage } from '../lib/pdf-service';
import { GeminiService } from '../lib/gemini-service';
import { OMR_PROMPTS } from '../lib/prompts';
import { DataProcessor } from '../lib/data-processor';
import type { StudentRecord } from '../lib/types';
import { CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

interface DashboardProps {
    apiKey: string;
    modelName: string;
}

export function Dashboard({ apiKey, modelName }: DashboardProps) {
    const [status, setStatus] = useState<'idle' | 'processing' | 'complete'>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [records, setRecords] = useState<Map<string, Partial<StudentRecord>>>(new Map());
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    // Initialize service
    const gemini = useRef(new GeminiService(apiKey, modelName));

    // Update service instance if model or key changes (though key unlikely to change without remount)
    if (gemini.current['model'].model !== `models/${modelName}` && gemini.current['model'].model !== modelName) {
        // Note: The internal model property might look like 'models/gemini-1.5-flash' vs input 'gemini-1.5-flash'.
        // Simpler check: just recreate if props change significantly, or trust the ref mount logic.
        // Actually, since Dashboard is re-mounted when apiKey changes (in parent), we just need to handle modelName changes if they could happen.
        // But modelName only changes when apiKey is cleared in App.tsx. 
        // So a simple useRef init is mostly fine, BUT React Strict Mode might invoke render twice.
        // Let's just create a new instance if the stored one doesn't match the prop.
        gemini.current = new GeminiService(apiKey, modelName);
    }

    // Helper for logs
    const addLog = useCallback((msg: string) => {
        setLogs(prev => [msg, ...prev].slice(0, 50));
    }, []);

    // Wake Lock Ref
    const wakeLock = useRef<any>(null);

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedRecords = localStorage.getItem('omr_records');
        if (savedRecords) {
            try {
                const parsed = JSON.parse(savedRecords);
                setRecords(new Map(parsed));
                addLog('Restored previous session data.');
            } catch (e) {
                console.error('Failed to parse saved records', e);
            }
        }
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        if (records.size > 0) {
            localStorage.setItem('omr_records', JSON.stringify(Array.from(records.entries())));
        }
    }, [records]);

    const requestWakeLock = async () => {
        try {
            if ('wakeLock' in navigator) {
                // @ts-ignore
                wakeLock.current = await navigator.wakeLock.request('screen');
                addLog('Screen Wake Lock active.');
            }
        } catch (err: any) {
            console.warn(`Wake Lock blocked: ${err.name}, ${err.message}`);
        }
    };

    const releaseWakeLock = async () => {
        if (wakeLock.current) {
            try {
                await wakeLock.current.release();
                wakeLock.current = null;
            } catch (err) {
                console.error(err);
            }
        }
    };

    const processFile = async (file: File) => {
        setStatus('processing');
        setLogs([]);
        setRecords(new Map());
        setProgress(0);

        // Clear previous storage when starting new
        localStorage.removeItem('omr_records');

        await requestWakeLock();

        try {
            addLog(`Loading PDF: ${file.name}`);
            const pdf = await loadPDF(file);
            const totalPages = pdf.numPages;
            addLog(`PDF Loaded. Total pages: ${totalPages}`);

            let currentStudentId: string | null = null;
            for (let i = 1; i <= totalPages; i++) {
                // Check if user cancelled or closed? (Implicit via component unmount)

                setProgress(Math.round(((i - 1) / totalPages) * 100));
                addLog(`Rendering Page ${i}...`);

                // 1. Render Page
                const imageData = await renderPageToImage(pdf, i);
                setCurrentImage(imageData);

                try {
                    addLog(`Classifying Page ${i}...`);
                    // 1. Classification Step
                    const classification = await gemini.current.analyzeOMR(imageData, OMR_PROMPTS.CLASSIFY_PAGE);
                    const detectedType = classification.page_type || 0;

                    if (detectedType === 0) {
                        addLog(`Warning: Could not classify Page ${i}. Skipping...`);
                        continue;
                    }

                    addLog(`Detected Page Type: ${detectedType}`);

                    // 2. Select Prompt based on Detected Type
                    let prompt = '';
                    switch (detectedType) {
                        case 1: prompt = OMR_PROMPTS.PAGE_1_DETAILS; break;
                        case 2: prompt = OMR_PROMPTS.PAGE_2_PERSONALITY; break;
                        case 3: prompt = OMR_PROMPTS.PAGE_3_ACADEMIC; break;
                        case 4: prompt = OMR_PROMPTS.PAGE_4_CONSENT; break;
                        default:
                            addLog(`Unknown page type ${detectedType}. Skipping extraction.`);
                            continue;
                    }

                    // 3. Extract Data
                    addLog(`Extracting data for Page ${i} (Type ${detectedType}) using ${modelName}...`);
                    const result = await gemini.current.analyzeOMR(imageData, prompt);

                    // --- CUSTOM LOGIC: Student ID Persistence ---
                    if (detectedType === 1) {
                        if (result.student_id) {
                            currentStudentId = result.student_id;
                            addLog(`Identified Student ID: ${currentStudentId}`);
                        } else {
                            addLog(`Warning: No Student ID found on Page 1 (Page ${i})`);
                            // Keep previous ID if we assume pages are mixed but belong to same batch? 
                            // Or reset? User asked to "take student id from latest preceeding page 1".
                            // So if P1 has no ID, we technically don't have a new ID.
                            // But usually P1 defines the ID. Let's keep strictness unless requested otherwise.
                            // Actually, if P1 fails to read ID, we shouldn't carry over OLD ID from previous P1, that would mix students.
                            currentStudentId = null;
                        }
                    } else {
                        // For Pages 2, 3, 4 -> Inject stored ID
                        if (!result.student_id && currentStudentId) {
                            result.student_id = currentStudentId;
                            addLog(`Injected Student ID ${currentStudentId} into Page ${i}`);
                        }
                    }
                    // ---------------------------------------------

                    // Log simplified result
                    const preview = JSON.stringify(result);
                    addLog(`Extracted: ${preview.length > 50 ? preview.slice(0, 50) + '...' : preview}`);

                    // 4. Merge Data
                    setRecords(prev => {
                        const next = DataProcessor.mergeRecord(prev, detectedType, result);
                        return next;
                    });
                } catch (pageError: any) {
                    console.error(`Error processing Page ${i}:`, pageError);
                    addLog(`Error on Page ${i}: ${pageError.message || 'Unknown error'}. Skipping...`);
                }

                // Small delay to allow UI updates
                await new Promise(r => setTimeout(r, 100));
            }

            setStatus('complete');
            setProgress(100);
            addLog('Processing Complete!');

        } catch (error: any) {
            console.error(error);
            addLog(`Error: ${error.message}`);
            setStatus('idle'); // Allow retry
        } finally {
            await releaseWakeLock();
        }
    };

    const downloadCSV = useCallback(() => {
        const data = Array.from(records.values());
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'omr_results.csv');
    }, [records]);

    // Auto-download when processing is complete
    useEffect(() => {
        if (status === 'complete' && records.size > 0) {
            downloadCSV();
        }
    }, [status, downloadCSV, records.size]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            {/* Left Panel: Upload & Logs */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="font-bold text-lg mb-4">Scanner Input</h2>
                    <FileUploader onFileSelect={processFile} isProcessing={status === 'processing'} />

                    {status === 'processing' && (
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1 text-gray-500">
                                <span>Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-black text-green-400 p-4 rounded-xl font-mono text-xs flex-1 overflow-y-auto">
                    <div className="font-bold mb-2 border-b border-gray-700 pb-2">Use Logs</div>
                    {logs.map((log, i) => (
                        <div key={i} className="mb-1 opacity-80">{`> ${log}`}</div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Preview & Results */}
            <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
                {/* Live Preview */}
                {currentImage && (
                    <div className="bg-gray-100 rounded-xl p-4 flex justify-center items-center h-64 shrink-0 border">
                        <img src={currentImage} alt="Live Scan" className="h-full object-contain shadow-md" />
                    </div>
                )}

                {/* Results Table */}
                <div className="bg-white rounded-xl shadow-sm border flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <h2 className="font-bold flex items-center gap-2">
                            <FileText size={18} />
                            Extracted Records ({records.size})
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to clear all data?')) {
                                        localStorage.removeItem('omr_records');
                                        setRecords(new Map());
                                    }
                                }}
                                disabled={records.size === 0}
                                className="px-3 py-1.5 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200 disabled:opacity-50"
                            >
                                Clear Data
                            </button>
                            <button
                                onClick={downloadCSV}
                                disabled={records.size === 0}
                                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                                <Download size={14} /> Export CSV
                            </button>
                        </div>
                    </div>
                    <div className="overflow-auto flex-1 p-0 relative">
                        <table className="w-auto min-w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10 border-b shadow-sm">
                                <tr>
                                    {/* Fixed Columns */}
                                    <th className="p-3 font-medium whitespace-nowrap bg-gray-50 sticky left-0 z-20 border-r">Status</th>
                                    <th className="p-3 font-medium whitespace-nowrap bg-gray-50 sticky left-[60px] z-20 border-r">ID</th>
                                    <th className="p-3 font-medium whitespace-nowrap bg-gray-50 sticky left-[140px] z-20 border-r">Name</th>

                                    {/* Dynamic Columns - Sort alphabetical or predefined order if possible */}
                                    {Array.from(records.values()).reduce((keys, rec) => {
                                        Object.keys(rec).forEach(k => {
                                            if (!['status', 'student_id', 'full_name', 'missing_pages'].includes(k)) {
                                                keys.add(k);
                                            }
                                        });
                                        return keys;
                                    }, new Set<string>()).size > 0
                                        ? Array.from(
                                            Array.from(records.values()).reduce((keys, rec) => {
                                                Object.keys(rec).forEach(k => {
                                                    if (!['status', 'student_id', 'full_name', 'missing_pages'].includes(k)) {
                                                        keys.add(k);
                                                    }
                                                });
                                                return keys;
                                            }, new Set<string>())
                                        ).sort().map(key => (
                                            <th key={key} className="p-3 font-medium whitespace-nowrap border-r">{key}</th>
                                        ))
                                        : <th className="p-3 font-medium whitespace-nowrap border-r text-gray-400 font-normal italic">Waiting for data...</th>
                                    }

                                    <th className="p-3 font-medium whitespace-nowrap">Missing Pages</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {Array.from(records.values()).map(rec => {
                                    // We need to match the HEADERS order exactly. 
                                    // Better approach: Calculate headers ONCE outside render loop or Memoize. 
                                    // For now, let's re-calculate to ensure sync (slightly inefficient but safe for <1000 rows).
                                    // Actually, let's capture all keys first.

                                    const allKeys = Array.from(records.values()).reduce((keys, r) => {
                                        Object.keys(r).forEach(k => {
                                            if (!['status', 'student_id', 'full_name', 'missing_pages'].includes(k)) keys.add(k);
                                        });
                                        return keys;
                                    }, new Set<string>());
                                    const sortedKeys = Array.from(allKeys).sort();

                                    return (
                                        <tr key={rec.student_id || Math.random()} className="hover:bg-gray-50">
                                            {/* Fixed Columns */}
                                            <td className="p-3 border-r bg-white sticky left-0 z-10">
                                                {rec.status === 'complete'
                                                    ? <CheckCircle size={16} className="text-green-500" />
                                                    : <AlertCircle size={16} className="text-orange-500" />
                                                }
                                            </td>
                                            <td className="p-3 font-mono border-r bg-white sticky left-[60px] z-10">{rec.student_id}</td>
                                            <td className="p-3 whitespace-nowrap border-r bg-white sticky left-[140px] z-10 max-w-[200px] truncate" title={rec.full_name || ''}>{rec.full_name || '-'}</td>

                                            {/* Dynamic Cells */}
                                            {sortedKeys.length > 0 ? sortedKeys.map(key => (
                                                <td key={key} className="p-3 whitespace-nowrap border-r">
                                                    {(rec as any)[key]?.toString() || '-'}
                                                </td>
                                            )) : <td className="p-3 border-r"></td>}

                                            <td className="p-3 text-red-500 text-xs min-w-[150px]">{(rec.missing_pages || []).join(', ')}</td>
                                        </tr>
                                    );
                                })}
                                {records.size === 0 && (
                                    <tr>
                                        <td colSpan={100} className="p-8 text-center text-gray-400">
                                            No records extracted yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
