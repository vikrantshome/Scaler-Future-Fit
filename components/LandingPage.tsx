import React from 'react';
import { ArrowRight, Brain, Target, TrendingUp, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-scaler-dark via-slate-900 to-scaler-blue text-white pt-24 pb-16 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-scaler-blue opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-sm font-semibold mb-6 border border-white/20">
              For Class 8 - 12 Students
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Discover Your Perfect <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Engineering Branch</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-lg">
              Don't guess your future. Use our scientific psychometric test to find the engineering stream that fits your personality and ambition.
            </p>
            <button 
              onClick={onStart}
              className="group bg-scaler-blue hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center text-lg"
            >
              Start Free Fit Test
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="mt-4 text-sm text-slate-400">Takes only 5 minutes • Powered by Scaler School of Technology</p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* Abstract visual representation of branches */}
            <img 
               src="https://picsum.photos/600/400?grayscale" 
               alt="Students collaborating" 
               className="rounded-2xl shadow-2xl border-4 border-white/10"
            />
          </div>
        </div>
      </header>

      {/* Why Scaler / Why Match Matters */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Scientific RAISEC Model</h3>
            <p className="text-slate-600">
              We move beyond just marks. We analyze your personality type (Realistic, Investigative, Artistic, etc.) to match you with a career you'll love.
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Indian Context</h3>
            <p className="text-slate-600">
              Tailored for the Indian education system—factoring in JEE, CETs, and the specific landscape of Indian engineering colleges.
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Future-Proof Careers</h3>
            <p className="text-slate-600">
              We emphasize branches with high growth potential, aligned with the industry-ready curriculum of Scaler School of Technology.
            </p>
          </div>
        </div>
      </section>

      {/* About Scaler & CTA */}
      <section className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Why Scaler School of Technology?</h2>
            <ul className="space-y-4">
              {[
                "Top 1% Curriculum designed by Tech Leaders",
                "1 Year Industry Internship included",
                "Built for Computer Science & AI aspirants",
                "Mentorship from Google, Amazon, Microsoft engineers"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-3 shrink-0" />
                  <span className="text-lg text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 bg-slate-800 p-8 rounded-2xl text-center">
             <h3 className="text-2xl font-bold mb-4">Ready to find your path?</h3>
             <p className="text-slate-400 mb-8">Join thousands of students making data-backed career decisions.</p>
             <button 
              onClick={onStart}
              className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold py-4 px-8 rounded-xl transition-all"
            >
              Start Your Assessment Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;