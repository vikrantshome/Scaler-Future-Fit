import React from 'react';
import { PhoneCall } from 'lucide-react';

const StickyCTA = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 p-4 md:hidden z-40 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col pr-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Need Guidance?</span>
        <span className="text-xs font-bold text-slate-900 leading-tight">Know more about CSE & Scaler</span>
      </div>
      <a 
        href="https://www.scaler.com/school-of-technology/" 
        target="_blank" 
        rel="noreferrer"
        className="bg-blue-600 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center whitespace-nowrap"
      >
        <PhoneCall className="w-3 h-3 mr-1.5" />
        Talk to Counsellor
      </a>
    </div>
  );
};

export default StickyCTA;
