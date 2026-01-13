import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import TestInterface from './components/TestInterface';
import SignupForm from './components/SignupForm';
import ResultsView from './components/ResultsView';
import Header from './components/Header';
import { UserResponses, AnalysisResult, UserInfo } from './types';
import { calculateResults } from './services/scoringService';
import { saveStudentData } from './services/apiService';
import { Loader2 } from 'lucide-react';

enum AppState {
  LANDING,
  TEST,
  SIGNUP,
  LOADING,
  RESULTS
}

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [responses, setResponses] = useState<UserResponses | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const startTest = () => {
    setAppState(AppState.TEST);
  };

  const handleTestComplete = (userResponses: UserResponses) => {
    setResponses(userResponses);
    setAppState(AppState.SIGNUP); // Move to signup instead of direct loading
  };

  const handleSignupComplete = async (info: UserInfo) => {
    setUserInfo(info);
    setAppState(AppState.LOADING);

    if (responses) {
      // 1. Calculate Results
      const calculatedResults = calculateResults(responses);
      setResults(calculatedResults);

      // 2. Save Data (Simulated DB call)
      await saveStudentData(info, responses, calculatedResults);

      // 3. Show Results
      setAppState(AppState.RESULTS);
    }
  };

  const restart = () => {
    setResponses(null);
    setUserInfo(null);
    setResults(null);
    setAppState(AppState.LANDING);
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen">
      <Header />
      
      {/* Main Content Container with padding-top for fixed header */}
      <div className="pt-16 md:pt-20">
        {appState === AppState.LANDING && <LandingPage onStart={startTest} />}
        
        {appState === AppState.TEST && <TestInterface onComplete={handleTestComplete} />}

        {appState === AppState.SIGNUP && <SignupForm onSubmit={handleSignupComplete} />}
        
        {appState === AppState.LOADING && (
          <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
            <Loader2 className="w-12 h-12 text-scaler-blue animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing your profile...</h2>
            <p className="text-slate-500 text-center max-w-md">
              Mapping your personality traits to engineering branches and comparing with industry requirements.
            </p>
          </div>
        )}
        
        {appState === AppState.RESULTS && results && responses && (
          <ResultsView results={results} responses={responses} onRestart={restart} />
        )}
      </div>
    </div>
  );
}

export default App;