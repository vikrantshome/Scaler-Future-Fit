import React, { useEffect, useState } from 'react';
import { AnalysisResult, UserResponses } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { generateAIInsights } from '../services/geminiService';
import { generateReport, saveStudentData } from '../services/apiService';
import { Download, Share2, Award, Zap, BookOpen, ArrowRight, Briefcase, Building2, GraduationCap, Loader2 } from 'lucide-react';

interface ResultsViewProps {
  results: AnalysisResult;
  responses: UserResponses;
  studentId: string | null;
  onRestart: () => void;
  userInfo: any;
}

const ResultsView: React.FC<ResultsViewProps> = ({ results, responses, studentId: initialStudentId, onRestart, userInfo }) => {
  const [aiText, setAiText] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(true);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(initialStudentId);

  // Calculate dominant traits handling ties
  const maxScore = Math.max(...results.raisecProfile.map(p => p.score));
  const dominantTypes = results.raisecProfile.filter(p => p.score === maxScore);
  
  const dominantTraits = dominantTypes.length >= 4 
      ? "Balanced All-Rounder"
      : dominantTypes.map(p => {
           const names: Record<string, string> = { R: 'Realistic', I: 'Investigative', A: 'Artistic', S: 'Social', E: 'Enterprising', C: 'Conventional' };
           return names[p.type] || p.type;
      }).join(' / ');

  useEffect(() => {
    // Trigger AI generation
    setIsGeneratingAI(true);
    generateAIInsights(responses, results).then(async (text) => {
        setAiText(text);
        setIsGeneratingAI(false);
        
        // Save the AI insights to the backend once generated
        if (currentStudentId) {
             // We'd ideally have an endpoint to just update insights, but we can re-save or 
             // assuming saveStudentData handles updates or we might need a specific update call.
             // However, given the context, let's assume we might need to resave to ensure insights are there
             // for the PDF generation which reads from the DB. 
             // Or better, let's assume generateReport sends the data if needed or the backend already has it.
             // If backend generates PDF from DB, we MUST update the DB with this new insight.
             
             // Quick fix: Re-save student data with new AI insights included in results
             const updatedResults = { ...results, aiInsight: text };
             await saveStudentData(userInfo, responses, updatedResults, currentStudentId);
        }
    });
  }, [results, responses]);

  // Update currentStudentId if prop changes (though usually it's set once)
  useEffect(() => {
      if (initialStudentId) setCurrentStudentId(initialStudentId);
  }, [initialStudentId]);


  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Your Engineering Fit Report</h1>
            <p className="text-slate-600">Based on your personality profile and academic strengths</p>
        </div>

        {/* Top Recommendations */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {results.topBranches.map((item, idx) => (
                <div key={item.branch.id} className={`relative bg-white rounded-2xl shadow-lg border-2 flex flex-col ${idx === 0 ? 'border-scaler-blue ring-4 ring-blue-50' : 'border-transparent'}`}>
                    {idx === 0 && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-scaler-blue text-white px-4 py-1 rounded-full text-sm font-bold shadow-md z-10">
                            Top Match
                        </div>
                    )}
                    
                    <div className="p-6 pb-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-scaler-blue font-bold text-xl mb-4">
                            #{idx + 1}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2">{item.branch.name}</h3>
                        <p className="text-sm text-slate-500 mb-4">{item.branch.description}</p>
                        
                         <div className="flex items-center text-sm text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                            <Award className="w-4 h-4 mr-2" />
                            Match Score: {Math.round(item.score)}/100
                        </div>
                    </div>

                    {/* Sub-Careers Section */}
                    {item.branch.subCareers && item.branch.subCareers.length > 0 && (
                        <div className="border-t border-slate-100 bg-slate-50/50 p-5 flex-1">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                                <Briefcase className="w-3 h-3 mr-1" /> Career Paths
                            </h4>
                            <ul className="space-y-3 mb-6">
                                {item.branch.subCareers.slice(0, 3).map((career, cIdx) => (
                                    <li key={cIdx} className="text-sm">
                                        <div className="font-semibold text-slate-800">{career.name}</div>
                                        <div className="text-xs text-slate-500 line-clamp-1" title={career.recruiters?.join(', ')}>
                                            <span className="font-medium text-slate-400">Hiring:</span> {career.recruiters?.join(', ')}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Target Exams Section */}
                            {item.branch.exams && item.branch.exams.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                                        <GraduationCap className="w-3 h-3 mr-1" /> Target Exams
                                    </h4>
                                    <div className="space-y-2">
                                        {item.branch.exams.slice(0, 3).map((exam, eIdx) => (
                                            <div key={eIdx} className="flex items-center justify-between text-sm bg-white p-2 rounded border border-slate-100">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-700">{exam.name}</span>
                                                    <span className="text-[10px] text-slate-400">{exam.description}</span>
                                                </div>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                                    exam.type === 'National' ? 'bg-purple-100 text-purple-700' :
                                                    exam.type === 'New-age' ? 'bg-green-100 text-green-700' :
                                                    exam.type === 'Private' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {exam.type}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="mt-auto pt-4 border-t border-slate-100">
                        <div className="flex items-center text-sm text-green-600 font-medium mb-2">
                            <Award className="w-4 h-4 mr-2" />
                            Match Score: {Math.round(item.score)}/100
                        </div>
                        <p className="text-xs text-slate-500 italic">"{item.matchReason}"</p>
                    </div>
                </div>
            ))}
        </div>

        {/* AI Insight & Chart Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Chart */}
            <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                <h3 className="font-bold text-slate-700 mb-4">Your Personality Profile</h3>
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results.raisecProfile}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                            <Radar
                                name="Profile"
                                dataKey="score"
                                stroke="#2d5bff"
                                fill="#2d5bff"
                                fillOpacity={0.4}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                    <span className="text-sm font-semibold text-slate-500">Dominant Trait: </span>
                    <span className="text-sm font-bold text-scaler-blue">{results.dominantType}</span>
                </div>
            </div>

            {/* AI Text */}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative z-10">
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                            <Zap className="w-5 h-5 text-yellow-300" />
                        </div>
                        <h3 className="text-2xl font-bold">Counselor's Insight</h3>
                    </div>
                    <p className="text-lg text-blue-50 leading-relaxed mb-6 whitespace-pre-line">
                        {isGeneratingAI ? 'Generating personalized insights with AI...' : aiText}
                    </p>
                    <div className="flex flex-wrap gap-4">
                         {results.topBranches.some(b => ['cse', 'ai_ds', 'algo_trading', 'it'].includes(b.branch.id)) && (
                            <a href="https://www.scaler.com/school-of-technology/" target="_blank" rel="noreferrer" className="inline-flex items-center bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors">
                                Explore Scaler School of Technology <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                         )}
                    </div>
                </div>
            </div>
        </div>

        {/* Scaler Pitch */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Build a career, not just a degree.</h3>
                <p className="text-slate-600 mb-4">
                    Scaler School of Technology offers a 4-year residential undergraduate program in Computer Science, designed to create the top 1% of software engineers.
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-700 font-medium">
                    <span className="flex items-center"><BookOpen className="w-4 h-4 mr-1 text-scaler-blue"/> Real-world projects</span>
                    <span className="flex items-center"><Award className="w-4 h-4 mr-1 text-scaler-blue"/> Top-tier Placements</span>
                </div>
            </div>
            <div className="flex gap-4">
                 <button onClick={onRestart} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                    Retake Test
                </button>
                {currentStudentId && (
                    <button 
                        onClick={async () => {
                            if (!currentStudentId) return;
                            setIsDownloading(true);
                            const result = await generateReport(currentStudentId);
                            if (result && result !== 'downloaded') {
                                window.open(result, '_blank');
                            }
                            setIsDownloading(false);
                        }} 
                        disabled={isDownloading || isGeneratingAI}
                        className={`px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl transition-colors flex items-center ${isDownloading || isGeneratingAI ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                    >
                        {(isDownloading || isGeneratingAI) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        {isDownloading ? 'Generating PDF...' : isGeneratingAI ? 'Waiting for AI...' : 'Download Report'}
                    </button>
                )}
                <button className="px-6 py-3 bg-scaler-blue text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors">
                    Apply Now
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsView;