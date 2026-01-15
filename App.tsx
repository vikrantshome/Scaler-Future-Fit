import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import TestInstructions from './components/TestInstructions';
import TestInterface from './components/TestInterface';
import SignupForm from './components/SignupForm';
import ResultsView from './components/ResultsView';
import LoginView from './components/LoginView';
import Header from './components/Header';
import StickyCTA from './components/StickyCTA';
import { saveStudentData, loginStudent } from './services/apiService';
import { UserResponses, UserInfo, AnalysisResult, calculateResults } from './services/scoringService';
import { Loader2 } from 'lucide-react';

enum AppState {
  LANDING,
  LOGIN,
  INSTRUCTIONS,
  TEST,
  SIGNUP,
  LOADING,
  RESULTS
}

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [responses, setResponses] = useState<UserResponses | null>(null);
  const [userInfo, setInfo] = useState<UserInfo | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  const startFlow = () => {
    setAppState(AppState.INSTRUCTIONS);
  };

  const startLogin = () => {
    setAppState(AppState.LOGIN);
  };

  const startTest = () => {
    setAppState(AppState.TEST);
  };

  const handleTestComplete = (data: UserResponses) => {
    setResponses(data);
    setAppState(AppState.SIGNUP);
  };

  const handleSignupComplete = async (info: UserInfo) => {
    setInfo(info);
    if (responses) {
      setAppState(AppState.LOADING);
      
      // 1. Calculate Results
      const calculatedResults = calculateResults(responses);
      setResults(calculatedResults);

      // 2. Save Data (Simulated DB call)
      const savedId = await saveStudentData(info, responses, calculatedResults, undefined);
      if (savedId) setStudentId(savedId);

      // 3. Show Results
      setAppState(AppState.RESULTS);
    }
  };

  const handleLogin = async (phone: string): Promise<boolean> => {
    const data = await loginStudent(phone);
    if (data.success && data.student) {
        setStudentId(data.student.id);
        setInfo(data.student.userInfo);
        setResponses(data.student.responses);
        setResults(data.student.results);
        setAppState(AppState.RESULTS);
        return true;
    }
    return false;
  };

  const restart = () => {
    setResponses(null);
    setInfo(null);
    setResults(null);
    setStudentId(null);
    setAppState(AppState.LANDING);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header showExit={appState !== AppState.LANDING} onRestart={restart} />
      
      {/* Main Content Container with padding-top for fixed header */}
      <div className="pt-16 md:pt-20">
        {appState === AppState.LANDING && <LandingPage onStart={startFlow} onLogin={startLogin} />}

        {appState === AppState.LOGIN && <LoginView onBack={() => setAppState(AppState.LANDING)} onLogin={handleLogin} />}

        {appState === AppState.INSTRUCTIONS && <TestInstructions onStart={startTest} />}
        
        {appState === AppState.TEST && <TestInterface onComplete={handleTestComplete} />}

        {appState === AppState.SIGNUP && <SignupForm onSubmit={handleSignupComplete} />}
        
        {appState === AppState.LOADING && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600 animate-pulse" />
             </div>
             <p className="mt-8 text-xl font-medium text-slate-600 animate-pulse">Analyzing your profile...</p>
             <p className="text-sm text-slate-400 mt-2">Connecting with AI engine</p>
          </div>
        )}
        
        {appState === AppState.RESULTS && results && responses && userInfo && (
          <ResultsView results={results} responses={responses} studentId={studentId} onRestart={restart} userInfo={userInfo} />
        )}

        {/* Sticky CTA - Visible on Landing and Results */}
        {(appState === AppState.LANDING || appState === AppState.RESULTS) && (
          <StickyCTA />
        )}
      </div>
    </div>
  );
}

export default App;