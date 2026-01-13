
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-12 glass-pro border-b border-white/5 sticky top-0 z-[100]">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-xl transition-transform duration-500 group-hover:scale-105">
              <span className="text-white font-black text-xl sm:text-2xl italic tracking-tighter">S2</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base sm:text-xl font-black text-white tracking-tighter leading-none">SORA 2</h1>
            <p className="hidden xs:block text-[8px] sm:text-[9px] uppercase font-black text-slate-500 tracking-[0.3em] mt-1 sm:mt-1.5">Asset Restoration</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-8">
          <nav className="hidden lg:flex items-center gap-8 border-x border-white/5 px-8">
            {['Engine', 'Cloud', 'API Docs'].map((item) => (
              <a key={item} href="#" className="text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-[0.2em]">
                {item}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[9px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                Operational
              </span>
            </div>
            <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-slate-900 text-[10px] font-black rounded-lg sm:rounded-xl hover:bg-blue-50 transition-all shadow-xl active:scale-95 uppercase tracking-widest">
              Pro
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
