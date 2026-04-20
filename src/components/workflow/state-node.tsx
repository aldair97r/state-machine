import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StateNode({ data, selected }: NodeProps) {
  const { label, groupLabel, color, sla, isHighlighted, isDimmed } = data as {
    label: string;
    groupLabel: string;
    color: string;
    sla: { hours: number; minutes: number };
    isHighlighted?: boolean;
    isDimmed?: boolean;
  };

  return (
    <div className={cn(
      "min-w-45 bg-[#1e293b] border rounded-lg overflow-hidden shadow-xl text-slate-200 transition-all duration-300",
      selected ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-500/10" : "border-slate-700",
      isHighlighted && !selected && "border-indigo-400 shadow-indigo-500/5",
      isDimmed && "opacity-30 grayscale-[0.5]"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        className={cn(
          "w-3 h-3 bg-slate-500! border-2 border-slate-800 transition-colors",
          isHighlighted && "bg-indigo-400!"
        )}
      />

      {/* Header with group color */}
      <div
        className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider flex justify-between items-center transition-colors"
        style={{
          backgroundColor: isHighlighted || selected ? color : color + '33',
          color: isHighlighted || selected ? '#fff' : color
        }}
      >
        <span>{groupLabel}</span>
      </div>

      <div className="p-4">
        <div className={cn(
          "text-sm font-semibold mb-2 transition-colors",
          (isHighlighted || selected) && "text-white"
        )}>{label}</div>

        {sla && (sla.hours > 0 || sla.minutes > 0) && (
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Clock className="w-3 h-3" />
            <span>{sla.hours}h {sla.minutes > 0 ? `${sla.minutes}m` : ''}</span>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className={cn(
          "w-3 h-3 bg-slate-500! border-2 border-slate-800 transition-colors",
          (isHighlighted || selected) && "bg-indigo-400!"
        )}
      />
    </div>
  );
}
