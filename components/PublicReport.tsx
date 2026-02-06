import React, { useEffect, useState } from 'react';
import ResultsView from './ResultsView';
import { UserInfo, UserResponses, AnalysisResult } from '../types';
import { Loader2, AlertCircle } from 'lucide-react';

interface PublicReportProps {
    studentId: string;
}

export default function PublicReport({ studentId }: PublicReportProps) {
    const [data, setData] = useState<{ userInfo: UserInfo, responses: UserResponses, results: AnalysisResult } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Hardcoded URL for now, or use import.meta.env
                const API_URL = import.meta.env.VITE_API_URL || '';
                const res = await fetch(`${API_URL}/api/student/${studentId}`);
                const json = await res.json();

                if (json.success && json.student) {
                    setData({
                        userInfo: json.student.userInfo,
                        responses: json.student.responses,
                        results: json.student.results
                    });
                } else {
                    setError(json.error || 'Student not found');
                }
            } catch (e) {
                console.error(e);
                setError('Failed to load report');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
            <p className="ml-4 text-slate-600 font-medium">Loading Report...</p>
        </div>
    );

    if (error || !data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-red-600">
            <AlertCircle className="w-16 h-16 mb-4 opacity-20" />
            <h1 className="text-2xl font-bold">Report Not Found</h1>
            <p className="text-slate-500 mt-2">{error}</p>
        </div>
    );

    return (
        <div className="public-report-container">
            {/* Header override could happen here if needed, but ResultsView is robust */}
            <div className="bg-blue-900 text-white p-4 text-center text-sm font-medium">
                Viewing Public Report for <span className="font-bold text-yellow-400">{data.userInfo.fullName}</span>
            </div>
            <ResultsView
                results={data.results}
                responses={data.responses}
                studentId={studentId}
                userInfo={data.userInfo}
                onRestart={() => { }} // No-op for public view
            />
        </div>
    );
}
