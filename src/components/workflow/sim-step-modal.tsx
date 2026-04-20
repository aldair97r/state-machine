import { X } from 'lucide-react';
import { type Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';

interface TransitionOption {
  edgeId: string;
  targetId: string;
  targetLabel: string;
}

interface SimStepModalProps {
  options: TransitionOption[];
  onSelect: (targetId: string) => void;
  onClose: () => void;
}

export function SimStepModal({ options, onSelect, onClose }: SimStepModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl w-full max-w-[280px] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Elegir siguiente estado</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 space-y-1">
          {options.map((opt, idx) => (
            <button
              key={opt.edgeId}
              onClick={() => onSelect(opt.targetId)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-left transition-colors group"
            >
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-md bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-500 group-hover:text-indigo-400 group-hover:border-indigo-500/30">
                {idx + 1}
              </span>
              <span className="text-sm text-slate-300 group-hover:text-white font-medium">
                {opt.targetLabel}
              </span>
            </button>
          ))}
        </div>

        <div className="p-3 bg-slate-900/30 border-t border-slate-800 flex justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-8 px-4 text-xs text-slate-500 hover:text-slate-300"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
