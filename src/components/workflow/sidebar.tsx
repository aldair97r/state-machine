import { Clock, Plus } from 'lucide-react';
import { type Group, type State } from '@/types/workflow';
import { cn } from '@/lib/utils';

interface SidebarProps {
  groups: Group[];
  states: State[];
  onSelectState?: (id: string) => void;
  onAddState?: () => void;
  selectedStateId?: string | null;
}

export function Sidebar({ groups, states, onSelectState, onAddState, selectedStateId }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#0f172a] flex flex-col text-slate-400 select-none h-full">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-wider">Estados</span>
        <span className="text-[10px] font-bold text-slate-500 uppercase">{states.length} Estados</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groups.sort((a, b) => a.order - b.order).map((group) => {
          const groupStates = states
            .filter((s) => s.group_id === group.id)
            .sort((a, b) => a.order - b.order);

          return (
            <div key={group.id} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <span className="text-xs font-semibold text-slate-300">{group.label}</span>
              </div>

              <div className="space-y-1">
                {groupStates.map((state) => (
                  <div
                    key={state.id}
                    onClick={() => onSelectState?.(state.id)}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-800/50 cursor-pointer transition-colors",
                      selectedStateId === state.id && "bg-slate-800 text-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full border border-slate-600 group-hover:border-slate-400",
                        selectedStateId === state.id && "border-indigo-400 bg-indigo-400"
                      )} />
                      <span className={cn(
                        "text-sm text-slate-400 group-hover:text-slate-200",
                        selectedStateId === state.id && "text-slate-100 font-medium"
                      )}>{state.label}</span>
                    </div>
                    {(state.sla.hours > 0 || state.sla.minutes > 0) && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{state.sla.hours}h</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <button
          onClick={onAddState}
          className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-slate-700 rounded-lg text-xs font-medium hover:border-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all group mt-2"
        >
          <Plus className="w-4 h-4 text-slate-500 group-hover:text-slate-400" />
          <span>Nuevo estado</span>
        </button>
      </div>
    </aside>
  );
}
