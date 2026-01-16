import React from 'react';
import { ArrowRight, Brain, Target, TrendingUp, CheckCircle, Code, Briefcase, Users } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-scaler-dark via-slate-900 to-scaler-blue text-white pt-16 pb-16 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-scaler-blue opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-sm font-semibold mb-6 border border-white/20">
              For Class 8 - 12 Students
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Build Your Future in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Computer Science</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-lg">
              Not sure which engineering branch fits you? Take our scientific assessment to discover your path and see if you have what it takes to join the top 1% of tech talent.
            </p>
            <div className="flex flex-col items-start gap-4">
              <button 
                onClick={onStart}
                className="group bg-scaler-blue hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center text-lg"
              >
                Start Free Career Fit Test
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-slate-400 text-sm">
                Already taken the test?{' '}
                <button 
                  onClick={onLogin}
                  className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 transition-colors"
                >
                  Login to view results
                </button>
              </p>
            </div>
            <p className="mt-4 text-sm text-slate-500">Takes only 5 minutes • Powered Naviksha Ai</p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* Relevant Image: Students coding/collaborating */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 group">
                <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                alt="Students collaborating on technology projects" 
                className="object-cover h-[250px] md:h-[400px] w-full transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6">
                    <p className="text-white font-medium">Experience the 4-year residential program designed by Industry Leaders.</p>
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* Why Scaler / Why Match Matters */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Scientific Profile Analysis</h3>
            <p className="text-slate-600">
              We analyze your "RAISEC" personality type to match you with engineering branches where you are naturally inclined to succeed.
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Industry-First Approach</h3>
            <p className="text-slate-600">
              Traditional degrees are outdated. We focus on modern Computer Science skills: AI, Machine Learning, and Full-Stack Development.
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Career Outcomes</h3>
            <p className="text-slate-600">
              Discover paths that lead to roles at top product companies (Google, Microsoft, Uber) rather than mass recruiting firms.
            </p>
          </div>
        </div>
      </section>

      {/* About Scaler & CTA */}
      <section className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="mb-6">
                 <span className="text-blue-400 font-bold tracking-wide uppercase text-sm">Scaler School of Technology</span>
                 <h2 className="text-3xl font-bold mt-2">India's Ivy League for Computer Science</h2>
            </div>
            
            <p className="text-slate-300 mb-8 leading-relaxed">
                A 4-year fully residential undergraduate program in Bangalore, designed to replace the broken traditional engineering college system.
            </p>

            <ul className="space-y-6">
              {[
                {
                    icon: <Users className="w-5 h-5 text-scaler-dark" />,
                    title: "Curriculum by Top 30 Tech Leaders",
                    desc: "Learn what CTOs of Google, Meta, and Uber want you to know."
                },
                {
                    icon: <Briefcase className="w-5 h-5 text-scaler-dark" />,
                    title: "1 Year Industry Internship",
                    desc: "Graduate with 1 year of real work experience, not just a degree."
                },
                {
                    icon: <CheckCircle className="w-5 h-5 text-scaler-dark" />,
                    title: "Mentorship by Industry Experts",
                    desc: "1:1 guidance from engineers working at top tech companies."
                }
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="bg-blue-400 p-2 rounded-lg mr-4 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 bg-slate-800 p-10 rounded-3xl text-center border border-slate-700 shadow-2xl">
             <h3 className="text-2xl font-bold mb-4">Are you future-fit?</h3>
             <p className="text-slate-400 mb-8">
                 Thousands of students apply to Scaler School of Technology. <br/>
                 Take the first step by understanding your profile.
             </p>
             <button 
              onClick={onStart}
              className="w-full bg-white text-slate-900 hover:bg-blue-50 font-bold py-4 px-8 rounded-xl transition-all shadow-lg"
            >
              Start Assessment Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;