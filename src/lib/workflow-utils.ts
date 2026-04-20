import { type Node, type Edge } from '@xyflow/react';
import { type WorkflowData } from '@/types/workflow';

const groupXMap: Record<string, number> = {
  'inicio': 0,
  'proceso': 400,
  'fin': 800
};

export function getAutoPosition(groupLabel: string, existingNodes: Node[]): { x: number; y: number } {
  const groupLabelLower = groupLabel.toLowerCase();

  // Determinar posición X basada en el grupo
  let x = 400; // Por defecto proceso en el centro
  if (groupLabelLower.includes('inicio')) x = groupXMap['inicio'];
  else if (groupLabelLower.includes('fin')) x = groupXMap['fin'];

  // Encontrar nodos existentes en la misma columna X para determinar la Y
  const nodesInColumn = existingNodes.filter(n => n.position.x === x);

  if (nodesInColumn.length === 0) {
    return { x, y: 100 };
  }

  // Encontrar la posición Y más baja (máxima)
  const maxY = Math.max(...nodesInColumn.map(n => n.position.y));

  return { x, y: maxY + 180 };
}

export function mapWorkflowToFlow(data: WorkflowData): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];

  data.states.forEach((state) => {
    const groupId = (state.group_id || state.group)?.toString() || '';
    const group = data.groups.find((g) => g.id.toString() === groupId);

    // Si tiene canvas_position, usarla directamente
    if (state.canvas_position) {
      nodes.push({
        id: state.id.toString(),
        type: 'stateNode',
        position: state.canvas_position,
        data: {
          label: state.label,
          groupLabel: group?.label || '',
          color: state.color || group?.color || '#888',
          sla: state.sla,
        },
      });
    } else {
      // Si no, calcular posición automática basada en los nodos ya procesados
      const position = getAutoPosition(group?.label || '', nodes);
      nodes.push({
        id: state.id.toString(),
        type: 'stateNode',
        position,
        data: {
          label: state.label,
          groupLabel: group?.label || '',
          color: state.color || group?.color || '#888',
          sla: state.sla,
        },
      });
    }
  });

  const edges: Edge[] = data.transitions.map((t) => {
    const source = (t.from_state_id || t.from)?.toString() || '';
    const target = (t.to_state_id || t.to)?.toString() || '';

    return {
      id: t.id.toString(),
      source,
      target,
      label: t.label || '',
      animated: false,
    };
  });

  return { nodes, edges };
}
