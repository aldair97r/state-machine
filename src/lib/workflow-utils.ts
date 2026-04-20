import { type Node, type Edge } from '@xyflow/react';
import { type WorkflowData } from '@/types/workflow';

export function mapWorkflowToFlow(data: WorkflowData): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = data.states.map((state) => {
    const group = data.groups.find((g) => g.id === state.group_id);
    return {
      id: state.id,
      type: 'stateNode',
      position: state.canvas_position,
      data: {
        label: state.label,
        groupLabel: group?.label || '',
        color: group?.color || '#888',
        sla: state.sla,
      },
    };
  });

  const edges: Edge[] = data.transitions.map((t) => ({
    id: t.id,
    source: t.from_state_id,
    target: t.to_state_id,
    label: t.label,
    animated: false,
  }));

  return { nodes, edges };
}
