import { BaseEdge, type EdgeProps, getBezierPath } from '@xyflow/react';

export function WorkflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  // Determine if this is a backward/cycle edge
  const isBackward = targetX <= sourceX + 20;

  let edgePath = '';

  if (isBackward) {
    // For backward edges, create a more pronounced curve to avoid overlapping with nodes
    const midX = (sourceX + targetX) / 2;
    // Route above or below depending on vertical distance
    const offset = Math.abs(targetY - sourceY) < 50 ? -100 : (targetY > sourceY ? -60 : 60);

    edgePath = `M ${sourceX},${sourceY} C ${sourceX + 100},${sourceY + offset} ${targetX - 100},${targetY + offset} ${targetX},${targetY}`;
  } else {
    [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeWidth: 2,
        stroke: '#475569', // slate-600
      }}
    />
  );
}
