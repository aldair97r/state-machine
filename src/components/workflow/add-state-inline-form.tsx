import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Group } from '@/types/workflow';

interface AddStateInlineFormProps {
  groups: Group[];
  onAdd: (data: {
    label: string;
    group_id: string;
    color?: string;
    sla?: { hours: number; minutes: number; total_minutes: number };
  }) => void;
}

export function AddStateInlineForm({ groups, onAdd }: AddStateInlineFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [groupId, setGroupId] = useState(groups[0]?.id.toString() || '');
  const [color, setColor] = useState('#6366f1');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const totalMinutes = (hours * 60) + minutes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd({
      label: label.trim(),
      group_id: groupId,
      color,
      sla: { hours, minutes, total_minutes: totalMinutes }
    });
    setLabel('');
    setIsOpen(false);
    setHours(0);
    setMinutes(0);
  };

  // Actualizar color cuando cambia el grupo para usar el color por defecto del grupo
  const handleGroupChange = (value: string) => {
    setGroupId(value);
    const group = groups.find(g => g.id.toString() === value);
    if (group) setColor(group.color);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="py-4 px-2 border-b border-slate-800 flex justify-between items-center min-h-15">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-200">Estados</span>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[11px] font-bold py-1 px-4 h-8 rounded-lg border border-slate-900 shadow-sm transition-all"
        >
          {isOpen ? 'Cerrar' : '+ Nuevo'}
        </Button>
      </div>

      {isOpen && (
        <div className="relative w-full py-4 px-3 border-b border-slate-800 z-10 animate-in slide-in-from-top duration-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              ESTADOS POR GRUPO
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              autoFocus
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Nombre del estado..."
              className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500"
              required
            />

            <Select value={groupId} onValueChange={handleGroupChange}>
              <SelectTrigger className="w-full bg-slate-950 border-slate-800 text-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500">
                <SelectValue placeholder="Seleccionar grupo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id.toString()} className="focus:bg-indigo-600 focus:text-white">
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Color Picker */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Color</label>
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 shrink-0">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div
                    className="w-full h-full rounded-md border border-slate-800 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-500 uppercase">{color}</span>
              </div>
            </div>

            {/* SLA Config */}
            <div className="space-y-2 pt-1">
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-bold uppercase text-slate-500">Horas</label>
                  <Input
                    type="number"
                    min="0"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                    className="h-8 bg-slate-950 border-slate-800 text-slate-200 text-xs"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-bold uppercase text-slate-500">Minutos</label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                    className="h-8 bg-slate-950 border-slate-800 text-slate-200 text-xs"
                  />
                </div>
              </div>

              {totalMinutes > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 flex items-baseline gap-2">
                  <span className="text-amber-500 font-bold text-sm">{totalMinutes}</span>
                  <span className="text-amber-500/70 text-[10px] uppercase font-bold">minutos totales</span>
                </div>
              )}
            </div>

            <Button
              variant={'ghost'}
              type="submit"
              className='w-full hover:text-slate-600 hover:bg-slate-500/10 gap-2 h-9 border border-slate-500/20 shadow-sm transition-all text-xs'
            >
              Añadir Estado
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
