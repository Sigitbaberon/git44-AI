
import React, { useState } from 'react';
import { 
  Eraser, 
  FileText, 
  Menu, 
  ChevronRight,
  Zap,
  Globe,
  Cpu,
  Layers,
  Settings,
  ShieldCheck,
  Search,
  Bell,
  Sparkles,
  Command,
  LayoutGrid,
  X,
  UserRound
} from 'lucide-react';
import WatermarkRemover from './components/tools/WatermarkRemover';
import YouTubeTranscript from './components/tools/YouTubeTranscript';
import DeepSwapFace from './components/tools/DeepSwapFace';
import { Tool } from './types';

const TOOLS: Tool[] = [
  { 
    id: 'watermark', 
    name: 'AI Remover', 
    description: 'Pembersihan watermark cerdas untuk aset Sora AI menggunakan algoritma inpainting resolusi tinggi yang bersih.', 
    icon: 'Eraser', 
    category: 'video' 
  },
  { 
    id: 'transcript', 
    name: 'Kecerdasan Teks', 
    description: 'Transformasi instan narasi YouTube menjadi teks terstruktur dengan akurasi semantik tingkat tinggi.', 
    icon: 'FileText', 
    category: 'video' 
  },
  { 
    id: 'deepswap', 
    name: 'DeepSwapFace', 
    description: 'Pertukaran wajah tingkat lanjut menggunakan model AI neural untuk hasil yang mulus dan realistis.', 
    icon: 'UserRound', 
    category: 'face-swap' 
  },
];

const IconMap: Record<string, any> = { Eraser, FileText, UserRound };

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState('watermark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeTool = TOOLS.find(t => t.id === activeToolId) || TOOLS[0];

  return (
    <div className="flex min-h-screen text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar - Clean Light Theme */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/60 shadow-xl lg:shadow-none transform transition-all duration-500 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Brand Clean */}
          <div className="p-10 flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-indigo-600 blur-xl opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
              <div className="relative w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-105">
                <Command className="text-white w-6 h-6" />
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tighter leading-none text-slate-900">Git44 <span className="text-indigo-600">AI</span></h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1.5">Premium Suite</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-grow px-6 space-y-10 mt-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <p className="px-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                <LayoutGrid size={10} className="text-indigo-600" />
                Workspaces
              </p>
              <div className="space-y-2">
                {TOOLS.map(tool => (
                  <SidebarItem 
                    key={tool.id} 
                    tool={tool} 
                    isActive={activeToolId === tool.id} 
                    onClick={() => { setActiveToolId(tool.id); setIsSidebarOpen(false); }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-100">
              <p className="px-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Control Center</p>
              <SidebarAction icon={<Settings size={18} />} label="Preferences" />
              <SidebarAction icon={<ShieldCheck size={18} />} label="Data Vault" />
            </div>
          </nav>

          {/* Status Info */}
          <div className="p-8">
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-indigo-100 transition-all duration-500">
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Status: Online</span>
                 </div>
                 <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase">
                   IO Engine: <span className="text-indigo-600">Jakarta Cluster</span>
                 </p>
               </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Primary Workspace */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Floating Top Header - Clean Light */}
        <header className="flex items-center justify-between p-6 px-10 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl z-40">
          <div className="flex items-center gap-8">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 text-slate-600 hover:text-indigo-600 bg-slate-100 rounded-xl transition-all">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/60 group hover:border-indigo-200 transition-all cursor-text min-w-[320px]">
              <Search size={14} className="text-slate-400 group-hover:text-indigo-600" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Global AI Search...</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 px-5 py-2 bg-slate-50 border border-slate-100 rounded-full">
               <Globe size={12} className="text-indigo-600" />
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Cluster</span>
            </div>
            <button className="p-3 text-slate-500 hover:text-indigo-600 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
            </button>
            <button className="px-8 py-3.5 bg-indigo-600 text-white text-[11px] font-black rounded-2xl transition-all shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95 uppercase tracking-[0.15em]">
              Upgrade Pro
            </button>
          </div>
        </header>

        {/* Dynamic Area */}
        <div className="flex-grow overflow-y-auto p-10 md:p-16 lg:p-24 custom-scrollbar relative">
          <div className="max-w-4xl mx-auto relative">
            {/* Header Content */}
            <div className="mb-20 text-center animate-slide-up">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-10 animate-float">
                <Sparkles size={14} className="text-indigo-600" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Advanced Neural Suite</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter mb-8 shimmer-indigo leading-[1.05]">
                {activeTool.name}
              </h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
                {activeTool.description}
              </p>
            </div>

            {/* Core Implementation Layer */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {activeToolId === 'watermark' && <WatermarkRemover />}
              {activeToolId === 'transcript' && <YouTubeTranscript />}
              {activeToolId === 'deepswap' && <DeepSwapFace />}
            </div>
          </div>
        </div>

        <footer className="p-10 border-t border-slate-100 bg-white/50 backdrop-blur-md">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
              <div className="flex items-center gap-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">API Reference</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Safety Hub</a>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.6em]">
                &copy; 2024 GIT44 AI • Indonesia Creative Lab
              </p>
           </div>
        </footer>
      </main>

      {/* Screen Mask */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};

const SidebarItem: React.FC<{ tool: Tool, isActive: boolean, onClick: () => void }> = ({ tool, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-5 py-4.5 rounded-2xl transition-all duration-300 group relative
        ${isActive 
          ? `bg-indigo-50 text-indigo-700 border border-indigo-100` 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'}
      `}
    >
      <div className="flex items-center gap-5 relative z-10">
        <div className={`p-3 rounded-xl transition-all duration-500 ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
          {React.createElement(IconMap[tool.icon], { size: 18, strokeWidth: 2.5 })}
        </div>
        <span className="text-[13px] font-extrabold uppercase tracking-widest">{tool.name}</span>
      </div>
      <ChevronRight className={`w-4 h-4 transition-all duration-500 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
    </button>
  );
};

const SidebarAction: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
  <button className="w-full flex items-center gap-5 px-5 py-4 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all">
    <div className="p-2.5 rounded-xl bg-slate-50">{icon}</div>
    <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
