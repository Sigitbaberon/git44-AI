
// Import React to fix "Cannot find namespace/name 'React'" errors
import React, { useState, useRef, useEffect } from 'react';
import { deepSwapUpload, deepSwapAddTask, deepSwapQueryTask } from '../../services/api';
import { ProcessingStatus } from '../../types';
import { 
  UserRound, 
  Upload, 
  RefreshCcw, 
  AlertCircle, 
  Download, 
  Image as ImageIcon,
  ArrowRightLeft,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  FileWarning,
  Loader2
} from 'lucide-react';

const DeepSwapFace: React.FC = () => {
  const [targetFile, setTargetFile] = useState<File | null>(null);
  const [swapFile, setSwapFile] = useState<File | null>(null);
  const [targetPreview, setTargetPreview] = useState<string | null>(null);
  const [swapPreview, setSwapPreview] = useState<string | null>(null);
  
  // Resource IDs from backend
  const [targetNo, setTargetNo] = useState<string | null>(null);
  const [swapNo, setSwapNo] = useState<string | null>(null);
  
  // Individual upload states
  const [isTargetUploading, setIsTargetUploading] = useState(false);
  const [isSwapUploading, setIsSwapUploading] = useState(false);

  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [activeStep, setActiveStep] = useState(0); 
  const [loadingMessage, setLoadingMessage] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileErrorSource, setFileErrorSource] = useState<'target' | 'swap' | null>(null);

  const targetInputRef = useRef<HTMLInputElement>(null);
  const swapInputRef = useRef<HTMLInputElement>(null);

  // Cleanup effect for memory management
  useEffect(() => {
    return () => {
      if (targetPreview) URL.revokeObjectURL(targetPreview);
      if (swapPreview) URL.revokeObjectURL(swapPreview);
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'target' | 'swap') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setFileErrorSource(null);

    if (type === 'target') {
      if (targetPreview) URL.revokeObjectURL(targetPreview);
      setTargetFile(file);
      setTargetPreview(URL.createObjectURL(file));
      setTargetNo(null);
      await uploadFileImmediate(file, 'target');
    } else {
      if (swapPreview) URL.revokeObjectURL(swapPreview);
      setSwapFile(file);
      setSwapPreview(URL.createObjectURL(file));
      setSwapNo(null);
      await uploadFileImmediate(file, 'swap');
    }
    
    // Reset input value so same file can be selected again
    e.target.value = '';
  };

  const uploadFileImmediate = async (file: File, type: 'target' | 'swap') => {
    if (type === 'target') setIsTargetUploading(true);
    else setIsSwapUploading(true);

    try {
      const resourceNo = await deepSwapUpload(file);
      if (type === 'target') setTargetNo(resourceNo);
      else setSwapNo(resourceNo);
    } catch (err: any) {
      console.error(`Upload error (${type}):`, err);
      const isAccessError = err.message.includes('FILE_ACCESS_DENIED') || err.message.toLowerCase().includes('permission');
      
      if (isAccessError) {
        setFileErrorSource(type);
        if (type === 'target') {
          setTargetFile(null);
          setTargetPreview(null);
        } else {
          setSwapFile(null);
          setSwapPreview(null);
        }
      }
      setError(err.message.replace('FILE_ACCESS_DENIED: ', ''));
    } finally {
      if (type === 'target') setIsTargetUploading(false);
      else setIsSwapUploading(false);
    }
  };

  const startSwapProcess = async () => {
    if (!targetNo || !swapNo) {
      setError('Tunggu hingga kedua foto selesai diunggah.');
      return;
    }

    setStatus('loading');
    setResultUrl(null);
    setError(null);

    try {
      // Step 3: Create Swap Task (Step 1 & 2 are now done immediately on selection)
      setActiveStep(3);
      setLoadingMessage('Membuat tugas AI...');
      const taskNo = await deepSwapAddTask(targetNo, swapNo);

      // Step 4: Polling Status Task
      setActiveStep(4);
      setLoadingMessage('AI sedang bekerja...');
      
      let completed = false;
      let attempts = 0;
      const maxAttempts = 120;

      while (!completed && attempts < maxAttempts) {
        attempts++;
        const queryResult = await deepSwapQueryTask(taskNo);
        
        if (queryResult.status === 3 && queryResult.url) {
          setResultUrl(queryResult.url);
          completed = true;
          setStatus('success');
          setActiveStep(0);
        } else if (queryResult.status === 4 || queryResult.status === 5) { 
          throw new Error('Proses dihentikan oleh server. Wajah mungkin tidak terdeteksi atau gambar tidak didukung.');
        } else {
          setLoadingMessage(`Sedang Memproses (Antrean #${attempts})...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }

      if (!completed) {
        throw new Error('Proses memakan waktu terlalu lama (Timeout). Silakan coba lagi.');
      }

    } catch (err: any) {
      console.error("SWAP_EXECUTION_ERROR:", err);
      setError(err.message || 'Terjadi kegagalan saat menjalankan swap.');
      setStatus('error');
      setActiveStep(0);
    }
  };

  const reset = () => {
    if (targetPreview) URL.revokeObjectURL(targetPreview);
    if (swapPreview) URL.revokeObjectURL(swapPreview);
    setTargetFile(null);
    setSwapFile(null);
    setTargetPreview(null);
    setSwapPreview(null);
    setTargetNo(null);
    setSwapNo(null);
    setResultUrl(null);
    setStatus('idle');
    setError(null);
    setActiveStep(0);
    setFileErrorSource(null);
  };

  return (
    <div className="space-y-10">
      {/* Step Visualizer */}
      {status === 'loading' && (
        <div className="flex items-center justify-between px-10 py-6 ultra-glass rounded-3xl border-indigo-100 animate-slide-up">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-500 shadow-sm
                  ${activeStep === step ? 'bg-indigo-600 text-white scale-110 shadow-indigo-200' : activeStep > step ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}
                `}>
                  {activeStep > step ? <CheckCircle2 size={16} /> : step}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest ${activeStep === step ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {step === 1 ? 'Target' : step === 2 ? 'Swap' : step === 3 ? 'Task' : 'Result'}
                </span>
              </div>
              {step < 4 && <div className={`flex-grow h-px mx-4 ${activeStep > step ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="ultra-glass rounded-[3rem] p-8 md:p-12 border-slate-200 relative overflow-hidden">
        {status === 'loading' && (
          <div className="absolute inset-x-0 top-0 h-[4px] bg-indigo-50 overflow-hidden">
            <div className="scan-line shadow-[0_0_15px_#4f46e5]"></div>
          </div>
        )}

        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
            <UserRound size={28} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.25em]">DeepSwapFace Studio</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Instant Real-time Upload v2.2</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Target Selection */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.35em] px-2 flex items-center gap-2">
              <ImageIcon size={14} /> 1. Gambar Target (Base)
            </label>
            <div 
              onClick={() => !isTargetUploading && status !== 'loading' && targetInputRef.current?.click()}
              className={`
                aspect-square rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden
                ${targetPreview ? 'border-indigo-200 shadow-sm' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}
                ${fileErrorSource === 'target' ? 'border-red-500 bg-red-50 ring-4 ring-red-100 animate-pulse shadow-inner' : ''}
              `}
            >
              {targetPreview ? (
                <>
                  <img src={targetPreview} className={`w-full h-full object-cover transition-opacity ${isTargetUploading || fileErrorSource === 'target' ? 'opacity-30' : 'opacity-100'}`} alt="Target" />
                  {isTargetUploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-sm">
                      <Loader2 className="text-indigo-600 animate-spin" size={32} />
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Uploading...</span>
                    </div>
                  )}
                  {targetNo && !isTargetUploading && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce-in">
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Upload className="text-slate-300 mb-4" size={32} />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center px-4">
                    {fileErrorSource === 'target' ? 'Izin Akses Hilang' : 'Pilih Target'}
                  </span>
                </>
              )}
              <input ref={targetInputRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'target')} className="hidden" />
            </div>
          </div>

          {/* Swap Selection */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.35em] px-2 flex items-center gap-2">
              <Sparkles size={14} /> 2. Gambar Swap (Source)
            </label>
            <div 
              onClick={() => !isSwapUploading && status !== 'loading' && swapInputRef.current?.click()}
              className={`
                aspect-square rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden
                ${swapPreview ? 'border-indigo-200 shadow-sm' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}
                ${fileErrorSource === 'swap' ? 'border-red-500 bg-red-50 ring-4 ring-red-100 animate-pulse shadow-inner' : ''}
              `}
            >
              {swapPreview ? (
                <>
                  <img src={swapPreview} className={`w-full h-full object-cover transition-opacity ${isSwapUploading || fileErrorSource === 'swap' ? 'opacity-30' : 'opacity-100'}`} alt="Swap" />
                  {isSwapUploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-sm">
                      <Loader2 className="text-indigo-600 animate-spin" size={32} />
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Uploading...</span>
                    </div>
                  )}
                  {swapNo && !isSwapUploading && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce-in">
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Upload className="text-slate-300 mb-4" size={32} />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center px-4">
                    {fileErrorSource === 'swap' ? 'Izin Akses Hilang' : 'Pilih Swap'}
                  </span>
                </>
              )}
              <input ref={swapInputRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'swap')} className="hidden" />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <button 
            onClick={status === 'loading' ? undefined : startSwapProcess}
            disabled={status === 'loading' || !targetNo || !swapNo || isTargetUploading || isSwapUploading}
            className={`
              w-full py-7 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[12px] transition-all duration-500 flex items-center justify-center gap-5
              ${status === 'loading' 
                ? 'bg-slate-100 text-slate-400 border border-slate-200' 
                : (targetNo && swapNo) 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.01]' 
                  : 'bg-slate-100 text-slate-300 border border-slate-100 cursor-not-allowed'}
            `}
          >
            {status === 'loading' ? (
              <>
                <RefreshCcw className="w-5 h-5 animate-spin" />
                {loadingMessage}
              </>
            ) : (
              <>
                {(!targetNo || !swapNo) ? 'Menunggu Upload...' : 'Execute AI Swap'}
                <ArrowRightLeft size={18} />
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-10 p-6 bg-red-50 border border-red-100 rounded-[2rem] flex gap-4 text-red-600 animate-slide-up">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase tracking-widest">Error Notifikasi</p>
              <p className="text-[13px] font-bold leading-relaxed">{error}</p>
            </div>
          </div>
        )}
      </div>

      {status === 'success' && resultUrl && (
        <div className="animate-slide-up space-y-8 pb-20">
          <div className="ultra-glass rounded-[4rem] border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-12 py-10 border-b border-slate-100 flex flex-wrap items-center justify-between gap-10 bg-white/50">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em]">Swap Berhasil</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Git44 AI Creative Studio</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <a 
                  href={resultUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-slate-50 text-slate-500 hover:text-indigo-600 rounded-2xl transition-all border border-slate-100"
                >
                  <ExternalLink size={20} />
                </a>
                <a 
                  href={resultUrl}
                  download="git44_deepswap.jpg"
                  className="flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
                >
                  <Download size={18} />
                  Download
                </a>
              </div>
            </div>

            <div className="p-12">
              <div className="aspect-square max-w-lg mx-auto bg-slate-100 rounded-[3rem] overflow-hidden shadow-inner border border-slate-200 relative group">
                <img src={resultUrl} className="w-full h-full object-contain relative z-10" alt="Result" />
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            <div className="px-12 py-10 bg-slate-50/50 border-t border-slate-100 text-center">
              <button 
                onClick={reset}
                className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] hover:text-indigo-600 transition-colors"
              >
                Mulai Ulang Sesi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepSwapFace;
