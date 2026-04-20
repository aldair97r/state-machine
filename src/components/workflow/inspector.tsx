import { Clock, Trash2, X } from 'lucide-react';
import { type Node, type Edge } from '@xyflow/react';
import { Button } from '@/components/ui/button';

interface InspectorProps {
  selectedNode: Node | null;
  edges: Edge[];
  nodes: Node[];
  onUpdateNode: (nodeId: string, data: any) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onAddEdge: (sourceId: string, targetId: string) => void;
}

export function Inspector({
  selectedNode,
  edges,
  nodes,
  onUpdateNode,
  onDeleteNode,
  onDeleteEdge,
  onAddEdge,
}: InspectorProps) {
  if (!selectedNode) {
    return (
      <aside className="w-80 bg-[#0f172a] border-l border-slate-800 p-6 flex flex-col items-center justify-center text-center text-slate-500">
        <div className="mb-4 p-4 rounded-full bg-slate-900">
          <Clock className="w-8 h-8 opacity-20" />
        </div>
        <p className="text-sm">Selecciona un estado para ver sus detalles</p>
      </aside>
    );
  }

  const { label, color, groupLabel, sla } = selectedNode.data as any;
  const outgoingTransitions = edges.filter((e) => e.source === selectedNode.id);
  const availableTargets = nodes.filter(
    (n) => n.id !== selectedNode.id && !outgoingTransitions.some((e) => e.target === n.id)
  );

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateNode(selectedNode.id, { ...selectedNode.data, label: e.target.value });
  };

  const handleSLAChange = (field: 'hours' | 'minutes', value: string) => {
    const numValue = parseInt(value) || 0;
    onUpdateNode(selectedNode.id, {
      ...selectedNode.data,
      sla: { ...sla, [field]: numValue },
    });
  };

  return (
    <aside className="w-80 bg-[#0f172a] border-l border-slate-800 flex flex-col select-none overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Detalles</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Group Badge */}
        <div
          className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{ backgroundColor: color + '22', color: color, border: `1px solid ${color}44` }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          {groupLabel}
        </div>

        {/* Label Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-slate-500">Nombre</label>
          <input
            type="text"
            value={label}
            onChange={handleLabelChange}
            className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-600 transition-colors"
          />
        </div>

        {/* ID Field */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-500">ID</label>
          <div className="text-xs font-mono text-slate-600">{selectedNode.id}</div>
        </div>

        {/* SLA Fields */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-2">
            <Clock className="w-3 h-3" /> SLA (Tiempo máximo)
          </label>
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <input
                type="number"
                min="0"
                value={sla.hours}
                onChange={(e) => handleSLAChange('hours', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-600"
              />
              <span className="text-[9px] text-slate-600 block text-center uppercase">Horas</span>
            </div>
            <div className="flex-1 space-y-1">
              <input
                type="number"
                min="0"
                max="59"
                value={sla.minutes}
                onChange={(e) => handleSLAChange('minutes', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-600"
              />
              <span className="text-[9px] text-slate-600 block text-center uppercase">Minutos</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-800" />

        {/* Transitions */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase text-slate-500">
            Transiciones salientes ({outgoingTransitions.length})
          </label>

          <div className="space-y-2">
            {outgoingTransitions.map((edge) => {
              const targetNode = nodes.find((n) => n.id === edge.target);
              return (
                <div key={edge.id} className="flex items-center justify-between bg-slate-900/50 p-2 rounded-md border border-slate-800/50">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-xs text-slate-500">→</span>
                    <span className="text-xs text-slate-300 truncate">{targetNode?.data.label}</span>
                  </div>
                  <button
                    onClick={() => onDeleteEdge(edge.id)}
                    className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {availableTargets.length > 0 && (
            <div className="flex gap-2 pt-2">
              <select
                className="flex-1 bg-slate-900 border border-slate-800 rounded-md px-2 py-1.5 text-xs text-slate-400 focus:outline-none focus:border-slate-600"
                onChange={(e) => {
                  if (e.target.value) {
                    onAddEdge(selectedNode.id, e.target.value);
                    e.target.value = '';
                  }
                }}
              >
                <option value="">Añadir transición...</option>
                {availableTargets.map((n) => (
                  <option key={n.id} value={n.id}>→ {n.data.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button
            variant="ghost"
            className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 gap-2 h-9 border border-red-500/20"
            onClick={() => onDeleteNode(selectedNode.id)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Eliminar estado</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
