# Plan: Adapt to new Workflow JSON Structure

The user has updated `src/example/ticket-workflow.json` with a simplified structure. The current codebase expects a more complex structure defined in `WorkflowData`. I need to adapt the mapping logic and types to handle both or migrate to the new structure.

## Context
The new JSON structure in `src/example/ticket-workflow.json` is:
- `groups`: `[{ id: number, label: string, color: string }]`
- `states`: `[{ id: number, label: string, group: number, color: string, is_initial: boolean, is_terminal: boolean, sla: { ... } }]`
- `transitions`: `[{ id: number, from: number, to: number }]`

The current code (`App.tsx` and `workflow-utils.ts`) expects:
- `states[].group_id` instead of `group`
- `states[].canvas_position` (missing in new JSON)
- `transitions[].from_state_id` instead of `from`
- `transitions[].to_state_id` instead of `to`
- String IDs instead of numbers

## Proposed Changes

### 1. Update Types
Modify `src/types/workflow.ts` to make some fields optional or add support for the new structure. Since the IDs are now numbers in the JSON, I'll update the interfaces to accept `string | number`.

### 2. Update Mapping Logic
Update `src/lib/workflow-utils.ts` to handle the new JSON structure:
- Use `state.group` if `state.group_id` is missing.
- Provide default `canvas_position` if missing (e.g., a simple grid or random layout).
- Use `t.from` and `t.to` if `t.from_state_id` and `t.to_state_id` are missing.
- Convert numeric IDs to strings for React Flow compatibility.

### 3. Update Components
- **App.tsx**: Update initial state and casting. Fix `addNewState` and `addNewEdge` to be compatible with both numeric and string IDs.
- **sidebar.tsx**: Ensure group lookup works with numeric IDs.

## Critical Files
- [src/types/workflow.ts](src/types/workflow.ts)
- [src/lib/workflow-utils.ts](src/lib/workflow-utils.ts)
- [src/App.tsx](src/App.tsx)

## Verification
- Run the application and verify that the workflow renders correctly.
- Verify that states are correctly assigned to groups (colors).
- Verify that transitions (edges) are correctly drawn between states.
- Test adding a new state and verifying it appears on the canvas.
- Test simulation mode.
