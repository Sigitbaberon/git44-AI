
import React, { useState, useRef } from 'react';
import { Video, StopCircle, Download, Monitor, Activity } from 'lucide-react';

const ScreenRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 60 } },
        audio: true
      });
      
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);
      setRecordedUrl(null);
    } catch (err) {
      console.error("Recording failed", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  return (
    <div className="space-y-8">
      <div className="glass-pro rounded-[2.5rem] p-12 border-white/5 text-center relative overflow-hidden">
        {isRecording && (
          <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/20 rounded-full animate-pulse">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live REC</span>
          </div>
        )}

        <div className="max-w-md mx-auto space-y-10">
          <div className="w-24 h-24 bg-blue-500/10 rounded-3xl border border-blue-500/20 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(59,130,246,0.1)]">
            <Monitor className={`w-12 h-12 ${isRecording ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
          </div>
          
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Internal Capture</h3>
            <p className="text-slate-500 text-sm font-medium">Record high-definition video assets directly from your browser session.</p>
          </div>

          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`
              w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-sm transition-all duration-500 flex items-center justify-center gap-4 active:scale-[0.98]
              ${isRecording 
                ? 'bg-red-500 text-white shadow-[0_10px_30px_rgba(239,68,68,0.2)]' 
                : 'bg-white text-slate-900 hover:bg-blue-600 hover:text-white shadow-2xl hover:shadow-blue-500/30'}
            `}
          >
            {isRecording ? <StopCircle /> : <Video />}
            {isRecording ? 'Stop Recording' : 'Start Capture'}
          </button>
        </div>
      </div>

      {recordedUrl && (
        <div className="glass-pro rounded-[2.5rem] p-12 border-white/10 animate-slide-up">
          <div className="max-w-2xl mx-auto space-y-10 text-center">
            <div className="inline-flex items-center gap-3 bg-blue-500/10 text-blue-400 px-6 py-2.5 rounded-full border border-blue-500/20 shadow-lg">
              <Activity className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Capture Buffered</span>
            </div>
            
            <div className="aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/10">
              <video src={recordedUrl} controls className="w-full h-full object-contain" />
            </div>
            
            <a 
              href={recordedUrl}
              download="capture_output.webm"
              className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl hover:scale-[1.03] transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 text-xs uppercase tracking-widest"
            >
              <Download className="w-5 h-5" />
              Download Capturing
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;
