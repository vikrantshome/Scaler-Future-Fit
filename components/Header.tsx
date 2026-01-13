import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 md:h-20 flex items-center justify-between px-4 md:px-8 shadow-sm">
      {/* Left: Scaler School of Technology Logo */}
      <div className="flex items-center gap-3">
         <img 
            src="https://assets.scaler.com/assets/scaler/svg/scaler-logo-new-15c5521978.svg" 
            alt="Scaler Logo" 
            className="h-6 md:h-8"
         />
         <div className="h-8 w-px bg-slate-300 mx-1"></div>
         <div className="flex flex-col justify-center">
            <span className="text-[10px] md:text-xs font-bold text-slate-900 leading-none tracking-wide uppercase">School of</span>
            <span className="text-[10px] md:text-xs font-bold text-slate-900 leading-none tracking-wide uppercase text-scaler-blue">Technology</span>
         </div>
      </div>

      {/* Right: Naviksha AI Badge */}
      <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-purple-500/10 to-primary/10 border-2 border-purple-500/30 rounded-full">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-purple-600 to-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white font-bold text-[8px] md:text-[10px]">AI</span>
          </div>
          <div className="text-[10px] md:text-sm whitespace-nowrap">
            <span className="text-slate-500 hidden sm:inline font-medium">Powered by </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-primary font-bold">
              Naviksha AI
            </span>
          </div>
      </div>
    </header>
  );
};

export default Header;