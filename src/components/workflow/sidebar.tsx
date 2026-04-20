import { Clock, X } from 'lucide-react';
import { type Group, type State } from '@/types/workflow';
import { cn } from '@/lib/utils';
import { AddStateInlineForm } from './add-state-inline-form';

interface SidebarProps {
  groups: Group[];
  states: State[];
  onSelectState?: (id: string) => void;
  onAddState?: (data: { label: string; group_id: string }) => void;
  onDeleteState?: (id: string) => void;
  selectedStateId?: string | null;
}

export function Sidebar({ groups, states, onSelectState, onAddState, onDeleteState, selectedStateId }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#0f172a] flex flex-col text-slate-400 select-none h-full">
      {onAddState ? (
        <AddStateInlineForm groups={groups} onAdd={onAddState} />
      ) : (
        <div className="border-b border-slate-800 flex justify-between items-center min-h-15">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-200">Estados</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">{states.length} Estados</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
        {groups.sort((a, b) => (a.order || 0) - (b.order || 0)).map((group) => {
          const groupStates = states
            .filter((s) => s.group_id === group.id.toString())
            .sort((a, b) => (a.order || 0) - (b.order || 0));

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
                    <div className="flex items-center gap-3 overflow-hidden mr-2">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full border border-slate-600 group-hover:border-slate-400 shrink-0",
                        selectedStateId === state.id && "border-indigo-400 bg-indigo-400"
                      )} />
                      <span className={cn(
                        "text-sm text-slate-400 group-hover:text-slate-200 truncate",
                        selectedStateId === state.id && "text-slate-100 font-medium"
                      )}>{state.label}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {(state.sla.hours > 0 || state.sla.minutes > 0) && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{state.sla.hours}h</span>
                        </div>
                      )}
                      {onDeleteState && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`¿Eliminar el estado "${state.label}"?`)) {
                              onDeleteState(state.id);
                            }
                          }}
                          className="p-1 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* El formulario de creación se encuentra en la cabecera del Sidebar */}
      </div>
    </aside>
  );
}
