
import React, { useState } from 'react';
import { Tool } from '../../types';
import { Upload, CloudUpload, Music, Sparkles } from 'lucide-react';

const ToolPlaceholder: React.FC<{ tool: Tool }> = ({ tool }) => {
  const [isHovered, setIsHovered] = useState(false);
  const accentClass = tool.category === 'video' ? 'text-blue-600' : 'text-emerald-600';
  const bgAccentClass = tool.category === 'video' ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100';

  return (
    <div className="space-y-10">
      <div 
        className={`
          bg-white rounded-[2.5rem] p-16 md:p-24 border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-500
          ${isHovered ? 'border-blue-600/30 bg-blue-50/20' : 'border-slate-200 bg-white'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`w-24 h-24 ${bgAccentClass} rounded-3xl border flex items-center justify-center mb-10 transition-transform duration-500 ${isHovered ? 'scale-110 -rotate-3' : ''}`}>
          <Upload className={`w-10 h-10 ${accentClass}`} strokeWidth={2.5} />
        </div>

        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-4">Upload Asset</h3>
        <p className="text-slate-400 max-w-sm font-medium mb-12 text-lg">
          Select or drop your {tool.category} files here to start the {tool.name.toLowerCase()} sequence.
        </p>

        <button className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95">
          Choose Media
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'File Limits', value: '2GB MAX' },
          { label: 'Quality', value: 'LOSSLESS' },
          { label: 'Security', value: 'ENCRYPTED' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center gap-3">
             <div className={`p-2 rounded-lg ${bgAccentClass}`}>
               <Sparkles className={`w-4 h-4 ${accentClass}`} />
             </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
            <span className={`text-sm font-black text-slate-900 uppercase tracking-widest`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolPlaceholder;
