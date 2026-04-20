import { useState } from 'react';
import { type Group } from '@/types/workflow';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddStateModalProps {
  groups: Group[];
  onAdd: (data: { label: string; group_id: string }) => void;
  onClose: () => void;
}

export function AddStateModal({ groups, onAdd, onClose }: AddStateModalProps) {
  const [label, setLabel] = useState('');
  const [groupId, setGroupId] = useState(groups[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd({ label: label.trim(), group_id: groupId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Nuevo Estado</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-500">Nombre del estado</label>
            <input
              autoFocus
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ej. En revisión técnica"
              className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-500">Grupo</label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-slate-500"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-[11px]"
            >
              Crear Estado
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
