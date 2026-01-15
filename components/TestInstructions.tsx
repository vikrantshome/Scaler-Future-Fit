import React from 'react';
import { Play, CheckCircle, Clock, Zap } from 'lucide-react';

interface TestInstructionsProps {
  onStart: () => void;
}

const TestInstructions: React.FC<TestInstructionsProps> = ({ onStart }) => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-scaler-blue to-blue-700 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">Before We Begin...</h2>
          <p className="text-blue-100 text-lg">A few quick tips to get the most accurate results.</p>
        </div>

        {/* Instructions Body */}
        <div className="p-8 md:p-10 space-y-8">
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-1">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">No Right or Wrong Answers</h3>
              <p className="text-slate-600 leading-relaxed">
                This isn't a test of your knowledge. It's a map of your interests. Be brutally honest about what you like, not what you think sounds "smart."
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 mt-1">
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Trust Your Instincts</h3>
              <p className="text-slate-600 leading-relaxed">
                Don't overthink it. Your first reaction is usually the truest one. Try to move through the questions steadily.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 mt-1">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">It Takes ~5 Minutes</h3>
              <p className="text-slate-600 leading-relaxed">
                Set aside a few distraction-free minutes. You must complete all sections to unlock your personalized report.
              </p>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="bg-slate-50 p-8 border-t border-slate-100 flex justify-center">
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-scaler-blue rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            I'm Ready, Let's Go!
            <Play className="w-5 h-5 ml-2 fill-current" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default TestInstructions;
