import { Maximize, RotateCcw, Play, StopCircle } from 'lucide-react';

interface TopbarProps {
  onFitView: () => void;
  onReset: () => void;
  onSimulate: () => void;
  isSimulating: boolean;
  status?: string;
}

export function Topbar({ onFitView, onReset, onSimulate, isSimulating, status = 'Sin cambios' }: TopbarProps) {
  return (
    <header className="h-12 bg-[#0f172a] border-b border-slate-800 flex items-center px-4 gap-4 z-10 select-none">
      <div className="flex items-center gap-2 pr-4 border-r border-slate-800">
        <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        <span className="text-sm font-bold tracking-tight text-slate-100">Workflow Editor</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onFitView}
          className="h-8 px-3 rounded-md border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-2 transition-colors"
        >
          <Maximize className="w-3.5 h-3.5" />
          <span>Ajustar vista</span>
        </button>
        <button
          onClick={onReset}
          className="h-8 px-3 rounded-md border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer</span>
        </button>
      </div>

      <div className="w-px h-5 bg-slate-800" />

      <button
        onClick={onSimulate}
        className={`h-8 px-4 rounded-md text-xs flex items-center gap-2 transition-all font-semibold ${
          isSimulating
            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20'
        }`}
      >
        {isSimulating ? (
          <>
            <StopCircle className="w-3.5 h-3.5" />
            <span>Detener</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simular flujo</span>
          </>
        )}
      </button>

      <div className="flex-1" />

      <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-500 font-medium">
        {status}
      </div>
    </header>
  );
}
