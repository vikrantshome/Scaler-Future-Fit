import React from 'react';

interface HeaderProps {
  showExit?: boolean;
  onRestart?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showExit, onRestart }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 md:h-20 flex items-center justify-between px-4 md:px-8 shadow-sm">
      {/* Left: Scaler School of Technology Logo */}
      <div className="flex items-center gap-3">
         <img 
            src="/sst-logo.png" 
            alt="Scaler School of Technology Logo" 
            className="h-8 md:h-10 w-auto"
         />
      </div>

      <div className="flex items-center gap-4">
        {showExit && onRestart && (
          <button 
            onClick={onRestart} 
            className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            Exit
          </button>
        )}

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
      </div>
    </header>
  );
};

export default Header;