
import React, { useState, useEffect } from 'react';
import { getYouTubeTranscript } from '../../services/api';
import { ProcessingStatus } from '../../types';
import { 
  FileText, 
  Loader2, 
  Copy, 
  Check, 
  Youtube, 
  AlertCircle, 
  ArrowRight,
  Type,
  FileJson,
  Mic,
  AlignLeft
} from 'lucide-react';

const YouTubeTranscript = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Booting Engine...');

  useEffect(() => {
    let interval: any;
    if (status === 'loading') {
      const messages = [
        'Connecting to YouTube Edge...',
        'Streaming audio stream...',
        'Synthesizing language model...',
        'Cleaning transcript text...',
        'Compiling results...'
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
    setTranscript(null);

    try {
      const data = await getYouTubeTranscript(url);
      setTranscript(data);
      setStatus('success');
    } catch (err: any) {
      setError(err.message || 'Protokol ekstraksi gagal.');
      setStatus('error');
    }
  };

  const copyToClipboard = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-16">
      {/* Input Module */}
      <div className="ultra-glass rounded-[3rem] p-10 md:p-16 relative overflow-hidden group">
        {status === 'loading' && (
          <div className="absolute inset-x-0 top-0 h-[4px] bg-red-50 overflow-hidden">
            <div className="scan-line !bg-red-500 shadow-[0_0_15px_#ef4444]"></div>
          </div>
        )}

        <div className="flex items-center gap-6 mb-16">
          <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 border border-red-100 shadow-sm">
            <Youtube size={30} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">Audio Semantic Intelligence</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Neural Engine v4.2</p>
          </div>
        </div>
        
        <form onSubmit={handleExecute} className="space-y-12">
          <div className="space-y-5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">YouTube Source URL</label>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={status === 'loading'}
              className="w-full premium-input rounded-[2rem] px-10 py-7 text-slate-900 placeholder:text-slate-300 focus:outline-none font-semibold text-lg"
            />
          </div>

          <button 
            type="submit" 
            disabled={status === 'loading' || !url}
            className={`
              w-full py-7 rounded-[2rem] font-black uppercase tracking-[0.5em] text-[12px] transition-all duration-500 flex items-center justify-center gap-5 active:scale-[0.98]
              ${status === 'loading' 
                ? 'bg-slate-100 text-slate-400 border border-slate-200' 
                : 'bg-red-600 text-white shadow-xl shadow-red-100 hover:bg-red-700 hover:scale-[1.01]'}
            `}
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {loadingMessage}
              </>
            ) : (
              <>
                Ekstrak Transkrip
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-12 p-8 bg-red-50 border border-red-100 rounded-[2.5rem] flex gap-6 text-red-600 animate-slide-up shadow-sm">
            <AlertCircle className="w-8 h-8 flex-shrink-0" />
            <p className="text-[14px] font-bold leading-relaxed">{error}</p>
          </div>
        )}
      </div>

      {/* Structured Document Workspace */}
      {status === 'success' && transcript && (
        <div className="animate-slide-up space-y-12 pb-20">
          <div className="ultra-glass rounded-[4rem] border-slate-200 shadow-2xl overflow-hidden">
            {/* Action Toolbar */}
            <div className="px-12 py-10 border-b border-slate-100 flex flex-wrap items-center justify-between gap-10 bg-white/50">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Mic size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.25em]">Structured Document</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_#4f46e5]"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Verified</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={copyToClipboard}
                className={`flex items-center gap-4 px-10 py-5 rounded-[1.5rem] text-[12px] font-black uppercase tracking-widest transition-all duration-500 ${
                  copied ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xl'
                }`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied to Buffer' : 'Copy Full Transcript'}
              </button>
            </div>

            {/* Content Area - Kontras Tinggi */}
            <div className="p-16 bg-white/40">
              <div className="max-h-[600px] overflow-y-auto pr-10 custom-scrollbar">
                <div className="prose max-w-none">
                  <div className="flex gap-10">
                    <AlignLeft size={28} className="text-slate-300 mt-2 flex-shrink-0" />
                    <p className="text-slate-800 font-medium leading-[2.1] text-xl text-justify whitespace-pre-wrap selection:bg-indigo-100 first-letter:text-4xl first-letter:font-black first-letter:text-indigo-600 first-letter:mr-1">
                      {transcript}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="px-12 py-10 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-16">
              <div className="flex items-center gap-16">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Metrics</span>
                  <div className="flex items-center gap-3">
                    <Type size={16} className="text-indigo-600" />
                    <span className="text-[15px] font-black text-slate-800 uppercase tracking-wider">{transcript.split(/\s+/).length} Words</span>
                  </div>
                </div>
                <div className="h-12 w-px bg-slate-200"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Signature</span>
                  <div className="flex items-center gap-3">
                    <FileJson size={16} className="text-indigo-600" />
                    <span className="text-[15px] font-black text-slate-800 uppercase tracking-wider">GIT44-SYNTH</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setStatus('idle'); setTranscript(null); setUrl(''); }}
                className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] hover:text-indigo-600 transition-colors"
              >
                Reset Intelligence Node
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeTranscript;
