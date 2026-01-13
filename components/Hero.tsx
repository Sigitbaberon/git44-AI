
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto text-center pt-16 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-blue-600/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      
      <div className="animate-slide-up mb-6 sm:mb-8">
        <span className="inline-block px-4 sm:px-6 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] shadow-xl">
          AI-Core v2.4 Restoration Engine
        </span>
      </div>
      
      <h2 className="font-black text-white mb-6 sm:mb-8 tracking-tighter animate-slide-up leading-[0.85] flex flex-col items-center" 
          style={{ 
            animationDelay: '0.1s',
            fontSize: 'clamp(2.5rem, 12vw, 8rem)' 
          }}>
        <span className="shimmer-text opacity-90">MASTER</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-400 to-slate-800">RESTORER</span>
      </h2>
      
      <p className="text-base sm:text-lg md:text-xl text-slate-500 mb-10 sm:mb-12 max-w-2xl mx-auto font-medium leading-relaxed animate-slide-up tracking-tight px-2" style={{ animationDelay: '0.2s' }}>
        Advanced pixel-interpolation and object-removal designed <br className="hidden md:block"/> specifically for high-fidelity Sora AI content.
      </p>
      
      <div className="flex flex-wrap justify-center gap-6 sm:gap-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        {[
          { label: '8K Deep Scan', color: 'bg-blue-600' },
          { label: 'Smart Inpaint', color: 'bg-indigo-600' },
          { label: 'Zero Artifacts', color: 'bg-cyan-600' }
        ].map((feat, i) => (
          <div key={i} className="flex items-center sm:flex-col gap-3 sm:gap-4 group cursor-default">
            <div className={`w-1.5 h-1.5 rounded-full ${feat.color} shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover:scale-150 transition-transform duration-500`}></div>
            <span className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] sm:tracking-[0.4em] group-hover:text-blue-400 transition-colors whitespace-nowrap">{feat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
