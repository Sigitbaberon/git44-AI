
import React from 'react';
import { ProcessedVideo } from '../types';

interface HistoryItemProps {
  video: ProcessedVideo;
  onDownload: (url: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ video, onDownload }) => {
  const dateStr = new Date(video.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  return (
    <div className="flex items-center justify-between p-4 sm:p-6 glass-pro rounded-2xl sm:rounded-3xl hover:bg-white/[0.04] transition-all duration-500 group border-white/5 hover:border-blue-500/20 relative overflow-hidden">
      <div className="flex items-center gap-4 sm:gap-6 relative z-10 min-w-0">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black/50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/5 flex-shrink-0 group-hover:border-blue-500/30 transition-all">
           <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
           </svg>
        </div>
        <div className="space-y-1 min-w-0">
          <h4 className="text-[10px] sm:text-[11px] font-black text-white truncate uppercase tracking-[0.1em] sm:tracking-[0.2em] group-hover:text-blue-300 transition-colors">
            {video.fileName || 'SYS-EXP-ALPHA'}
          </h4>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-600 uppercase tracking-widest whitespace-nowrap">{dateStr}</span>
            <span className="hidden xs:block w-1 h-1 bg-slate-800 rounded-full"></span>
            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest border border-blue-500/20 px-1.5 rounded whitespace-nowrap">Pro HD</span>
          </div>
        </div>
      </div>
      <button 
        onClick={() => onDownload(video.processedUrl)}
        className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 hover:bg-white hover:text-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 group/btn border border-white/5 flex-shrink-0 active:scale-90"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
    </div>
  );
};

export default HistoryItem;
