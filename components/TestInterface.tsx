import React, { useState, useEffect } from 'react';
import { Question, UserResponses } from '../types';
import { RAISEC_QUESTIONS, ACADEMIC_QUESTIONS } from '../constants';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface TestInterfaceProps {
  onComplete: (responses: UserResponses) => void;
}

const TestInterface: React.FC<TestInterfaceProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Intro/Part 1, 1 = Part 2
  const [responses, setResponses] = useState<UserResponses>({
    raisec: {},
    academic: {
      favoriteSubject: '',
      strongestSubject: '',
      examPrep: '',
      learningStyle: '',
      engineeringGoal: ''
    }
  });

  // Combine questions into pages for simpler flow
  // Page 0...N: RAISEC questions (1 per page or grouped? Let's do grouped for speed)
  // Let's do 1 question per screen for focus, with fast transitions.
  
  const allQuestions = [...RAISEC_QUESTIONS, ...ACADEMIC_QUESTIONS];
  const totalQuestions = allQuestions.length;
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const currentQuestion = allQuestions[currentQIndex];

  const handleLikert = (val: number) => {
    setResponses(prev => ({
      ...prev,
      raisec: { ...prev.raisec, [currentQuestion.id]: val }
    }));
    setTimeout(nextQuestion, 250); // Auto advance for likert
  };

  const handleAcademic = (val: string) => {
    // Map academic question ID to the specific field in UserResponses
    const keyMap: Record<string, keyof UserResponses['academic']> = {
      'fav_subject': 'favoriteSubject',
      'strong_subject': 'strongestSubject',
      'exam_prep': 'examPrep',
      'learning_style': 'learningStyle',
      'eng_goal': 'engineeringGoal'
    };
    
    const key = keyMap[currentQuestion.id];
    if (key) {
      setResponses(prev => ({
        ...prev,
        academic: { ...prev.academic, [key]: val }
      }));
    }
    setTimeout(nextQuestion, 250);
  };

  const nextQuestion = () => {
    if (currentQIndex < totalQuestions - 1) {
      setCurrentQIndex(curr => curr + 1);
    } else {
      onComplete(responses);
    }
  };

  const prevQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(curr => curr - 1);
    }
  };

  const progress = ((currentQIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {currentQuestion.category === 'RAISEC' ? 'Part 1: Personality' : 'Part 2: Academic & Career'}
                </span>
                <span className="text-sm font-bold text-scaler-blue">{currentQIndex + 1}/{totalQuestions}</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-scaler-blue transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-12 transition-all duration-300">
          <h2 className="text-2xl md:text-3xl font-medium text-slate-900 mb-8 leading-snug">
            {currentQuestion.text}
          </h2>

          {/* Render Options based on Type */}
          <div className="space-y-3">
            {currentQuestion.type === 'likert' && (
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Strongly Agree', val: 5 },
                  { label: 'Agree', val: 4 },
                  { label: 'Neutral', val: 3 },
                  { label: 'Disagree', val: 2 },
                  { label: 'Strongly Disagree', val: 1 }
                ].map((opt) => (
                    <button
                        key={opt.val}
                        onClick={() => handleLikert(opt.val)}
                        className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center
                            ${responses.raisec[currentQuestion.id] === opt.val 
                                ? 'border-scaler-blue bg-blue-50 text-scaler-blue' 
                                : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-700'
                            }`}
                    >
                        {opt.label}
                        {responses.raisec[currentQuestion.id] === opt.val && <div className="w-3 h-3 bg-scaler-blue rounded-full"></div>}
                    </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'single-choice' && currentQuestion.options && (
               <div className="grid grid-cols-1 gap-3">
                 {currentQuestion.options.map((opt) => {
                   // Helper to check selected state safely
                   const currentVal = Object.values(responses.academic).find(v => v === opt.value); // loose check for visualization
                   // Better way: get the specific key
                   const keyMap: Record<string, keyof UserResponses['academic']> = {
                        'fav_subject': 'favoriteSubject',
                        'strong_subject': 'strongestSubject',
                        'exam_prep': 'examPrep',
                        'learning_style': 'learningStyle',
                        'eng_goal': 'engineeringGoal'
                    };
                   const key = keyMap[currentQuestion.id];
                   const isSelected = key ? responses.academic[key] === opt.value : false;

                   return (
                    <button
                        key={opt.value}
                        onClick={() => handleAcademic(opt.value as string)}
                        className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center
                            ${isSelected
                                ? 'border-scaler-blue bg-blue-50 text-scaler-blue' 
                                : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-700'
                            }`}
                    >
                        {opt.label}
                        {isSelected && <div className="w-3 h-3 bg-scaler-blue rounded-full"></div>}
                    </button>
                   );
                 })}
               </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
            <button 
                onClick={prevQuestion}
                disabled={currentQIndex === 0}
                className={`flex items-center text-slate-500 font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors ${currentQIndex === 0 ? 'opacity-0 cursor-default' : ''}`}
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            {/* "Next" is mostly handled by auto-advance, but kept for accessibility or if user wants to skip? No skipping allowed here for accurate results. */}
        </div>

      </div>
    </div>
  );
};

export default TestInterface;