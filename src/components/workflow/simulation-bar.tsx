import { ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';
import { type Node } from '@xyflow/react';

interface SimulationBarProps {
  currentNode: Node | null;
  historyLength: number;
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
}

export function SimulationBar({
  currentNode,
  historyLength,
  onNext,
  onBack,
  onExit,
}: SimulationBarProps) {
  if (!currentNode) return null;

  const { label, sla } = currentNode.data as any;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#1e293b] border border-slate-700 rounded-full px-6 py-2 shadow-2xl flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            disabled={historyLength <= 1}
            className="p-1.5 rounded-full hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="h-4 w-px bg-slate-700" />
          <button
            onClick={onNext}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center min-w-30">
          <span className="text-xs font-bold text-slate-200">{label}</span>
          {sla && (sla.hours > 0 || sla.minutes > 0) && (
            <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              SLA: {sla.hours}h {sla.minutes > 0 ? `${sla.minutes}m` : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Paso {historyLength}
          </span>
          <div className="h-4 w-px bg-slate-700" />
          <button
            onClick={onExit}
            className="p-1.5 rounded-full hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
