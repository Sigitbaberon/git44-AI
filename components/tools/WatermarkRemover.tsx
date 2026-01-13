
import React, { useState, useEffect } from 'react';
import { removeWatermark } from '../../services/api';
import { ProcessingStatus } from '../../types';
import { 
  Download, 
  RefreshCcw, 
  AlertCircle, 
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Maximize2,
  Cpu,
  Video,
  ExternalLink
} from 'lucide-react';

const WatermarkRemover: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Initializing Engine...');

  useEffect(() => {
    let interval: any;
    if (status === 'loading') {
      const messages = [
        'Connecting to Sora Edge...',
        'Scanning frame sequences...',
        'Restoring pixel fidelity...',
        'Executing AI Synthesis...',
        'Validating output quality...'
      ];
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingMessage(messages[i]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setStatus('loading');
    setError(null);
    setResult(null);

    try {
      const videoLink = await removeWatermark(url);
      setResult(videoLink);
      setStatus('success');
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="space-y-16">
      {/* Control Module - Clean Light */}
      <div className="ultra-glass rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
        {status === 'loading' && (
          <div className="absolute inset-x-0 top-0 h-[4px] bg-indigo-50 overflow-hidden">
            <div className="scan-line shadow-[0_0_15px_#4f46e5]"></div>
          </div>
        )}

        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
              <Video size={28} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.25em]">Sora Restoration Lab</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Neural Inpainting v4.2</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl">
            <Cpu size={14} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Synthesis</span>
          </div>
        </div>
        
        <form onSubmit={handleExecute} className="space-y-12">
          <div className="space-y-5">
            <div className="flex justify-between items-center px-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.35em]">Asset Source URL</label>
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-indigo-600/60" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Encrypted Stream</span>
              </div>
            </div>
            <div className="relative group">
               <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://sora.com/assets/video-id"
                disabled={status === 'loading'}
                className="w-full premium-input rounded-[2rem] px-10 py-7 text-slate-900 placeholder:text-slate-300 focus:outline-none font-semibold text-lg"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status === 'loading' || !url}
            className={`
              w-full py-7 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[12px] transition-all duration-500 flex items-center justify-center gap-5 active:scale-[0.98]
              ${status === 'loading' 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                : 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.01]'}
            `}
          >
            {status === 'loading' ? (
              <>
                <RefreshCcw className="w-5 h-5 animate-spin" />
                {loadingMessage}
              </>
            ) : (
              <>
                Initialize Restoration
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-12 p-8 bg-red-50 border border-red-100 rounded-[2.5rem] flex gap-6 text-red-600 animate-slide-up shadow-sm">
            <AlertCircle className="w-8 h-8 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest">Protocol Error</p>
              <p className="text-[14px] font-bold leading-relaxed">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Result Workspace */}
      {status === 'success' && result && (
        <div className="animate-slide-up space-y-12 pb-20">
          <div className="ultra-glass rounded-[4rem] border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-12 py-10 border-b border-slate-100 flex flex-wrap items-center justify-between gap-10 bg-white/50">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em]">Synthesis Complete</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quality Verified</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <a 
                  href={result} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all border border-slate-100"
                >
                  <ExternalLink size={20} />
                </a>
                <a 
                  href={result}
                  download
                  className="flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl active:scale-95 group"
                >
                  <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                  Download Aset
                </a>
              </div>
            </div>

            <div className="p-12 flex flex-col items-center">
              <div className="w-full aspect-video bg-slate-100 rounded-[3rem] overflow-hidden shadow-inner border border-slate-200 relative group">
                <video 
                  src={result} 
                  controls 
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain relative z-10"
                />
              </div>
              
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
                <DetailBox icon={<Sparkles size={18} />} label="Inference" value="Lossless" />
                <DetailBox icon={<Maximize2 size={18} />} label="Resolution" value="Dynamic" />
                <DetailBox icon={<Cpu size={18} />} label="Engine" value="G44-V4" />
              </div>
            </div>

            <div className="px-12 py-10 bg-slate-50/50 border-t border-slate-100 text-center">
              <button 
                onClick={() => { setStatus('idle'); setResult(null); setUrl(''); }}
                className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] hover:text-indigo-600 transition-colors"
              >
                Start New Sessiion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailBox: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-6 px-8 py-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:border-indigo-100 transition-all duration-300 group">
    <div className="text-indigo-600 group-hover:scale-110 transition-transform duration-500">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</span>
      <span className="text-[14px] font-extrabold text-slate-800 uppercase tracking-wider">{value}</span>
    </div>
  </div>
);

export default WatermarkRemover;
