export interface SLA {
  hours: number;
  minutes: number;
  total_minutes: number;
}

export interface CanvasPosition {
  x: number;
  y: number;
}

export interface Group {
  id: string;
  label: string;
  color: string;
  order?: number;
}

export interface State {
  id: string;
  label: string;
  group_id?: string;
  group?: string | number;
  color?: string;
  is_initial: boolean;
  is_terminal: boolean;
  sla: SLA;
  order?: number;
  canvas_position?: CanvasPosition;
}

export interface Transition {
  id: string | number;
  from_state_id?: string;
  to_state_id?: string;
  from?: string | number;
  to?: string | number;
  label?: string | null;
  order?: number;
  note?: string;
}

export interface WorkflowMetadata {
  id: string;
  name: string;
  version: string;
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface WorkflowData {
  workflow: WorkflowMetadata;
  groups: Group[];
  states: State[];
  transitions: Transition[];
}
