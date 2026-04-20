import { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Node,
  type Edge,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Sidebar } from '@/components/workflow/sidebar';
import { Topbar } from '@/components/workflow/topbar';
import { StateNode } from '@/components/workflow/state-node';
import { WorkflowEdge } from '@/components/workflow/workflow-edge';
import { Inspector } from '@/components/workflow/inspector';
import { AddStateModal } from '@/components/workflow/add-state-modal';
import { SimulationBar } from '@/components/workflow/simulation-bar';
import { SimStepModal } from '@/components/workflow/sim-step-modal';

import { mapWorkflowToFlow } from '@/lib/workflow-utils';
import ticketWorkflow from '@/example/ticket-workflow.json';
import { type WorkflowData } from '@/types/workflow';

const nodeTypes = {
  stateNode: StateNode,
};

const edgeTypes = {
  workflowEdge: WorkflowEdge,
};

function WorkflowEditor() {
  const { fitView } = useReactFlow();

  // Initial data from JSON
  const [workflowData] = useState<WorkflowData>(ticketWorkflow as WorkflowData);

  const initialElements = useMemo(() => mapWorkflowToFlow(workflowData), []);

  const [nodes, setNodes] = useState<Node[]>(initialElements.nodes);
  const [edges, setEdges] = useState<Edge[]>(
    initialElements.edges.map(e => ({ ...e, type: 'workflowEdge' }))
  );

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simHistory, setSimHistory] = useState<string[]>([]);
  const [simOptions, setSimOptions] = useState<{ edgeId: string; targetId: string; targetLabel: string; }[] | null>(null);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'workflowEdge' }, eds)),
    []
  );

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNodeId(node.id);
  };

  const onPaneClick = () => {
    setSelectedNodeId(null);
  };

  const onSelectFromSidebar = (id: string) => {
    setSelectedNodeId(id);
    const node = nodes.find(n => n.id === id);
    if (node) {
      fitView({ nodes: [node], duration: 400, padding: 0.5 });
    }
  };

  const onReset = () => {
    if (confirm('¿Restablecer el workflow a los valores iniciales? Se perderán todos los cambios.')) {
      const resetElements = mapWorkflowToFlow(ticketWorkflow as WorkflowData);
      setNodes(resetElements.nodes);
      setEdges(resetElements.edges.map(e => ({ ...e, type: 'workflowEdge' })));
      setSelectedNodeId(null);
      setTimeout(() => fitView({ duration: 800 }), 50);
    }
  };

  // Actions
  const updateNodeData = (nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data } : n))
    );
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNodeId(null);
  };

  const deleteEdge = (edgeId: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
  };

  const addNewEdge = (source: string, target: string) => {
    const id = `tr_${Date.now()}`;
    setEdges((eds) => addEdge({ id, source, target, type: 'workflowEdge' }, eds));
  };

  const addNewState = (data: { label: string; group_id: string }) => {
    const group = workflowData.groups.find(g => g.id === data.group_id);
    const id = `state_${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'stateNode',
      position: { x: 100, y: 100 },
      data: {
        label: data.label,
        groupLabel: group?.label || '',
        color: group?.color || '#888',
        sla: { hours: 0, minutes: 0, total_minutes: 0 },
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id);
  };

  // Simulation logic
  const startSimulation = () => {
    const initialNode = nodes.find(n => n.id === 'nuevo_ticket') || nodes[0];
    if (initialNode) {
      setIsSimulating(true);
      setSimHistory([initialNode.id]);
      setSelectedNodeId(initialNode.id);
      fitView({ nodes: [initialNode], duration: 800 });
    }
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    setSimHistory([]);
  };

  const simNext = () => {
    const currentId = simHistory[simHistory.length - 1];
    const outgoing = edges.filter(e => e.source === currentId);

    if (outgoing.length === 0) return;

    if (outgoing.length === 1) {
      handleSimTransition(outgoing[0].target);
    } else {
      const options = outgoing.map(e => ({
        edgeId: e.id,
        targetId: e.target,
        targetLabel: nodes.find(n => n.id === e.target)?.data.label as string || e.target
      }));
      setSimOptions(options);
    }
  };

  const handleSimTransition = (targetId: string) => {
    setSimHistory(prev => [...prev, targetId]);
    setSelectedNodeId(targetId);
    setSimOptions(null);

    const nextNode = nodes.find(n => n.id === targetId);
    if (nextNode) {
      fitView({ nodes: [nextNode], duration: 800 });
    }
  };

  const simBack = () => {
    if (simHistory.length <= 1) return;
    const newHistory = [...simHistory];
    newHistory.pop();
    const prevId = newHistory[newHistory.length - 1];
    setSimHistory(newHistory);
    setSelectedNodeId(prevId);

    const prevNode = nodes.find(n => n.id === prevId);
    if (prevNode) {
      fitView({ nodes: [prevNode], duration: 800 });
    }
  };

  // Highlighting logic
  const highlightedElements = useMemo(() => {
    if (!selectedNodeId) {
      return {
        nodes: nodes.map(n => ({ ...n, data: { ...n.data, isHighlighted: false, isDimmed: false } })),
        edges: edges.map(e => ({ ...e, animated: false, style: { strokeOpacity: 1, strokeWidth: 2, stroke: '#475569' } }))
      };
    }

    const outgoingEdges = edges.filter(e => e.source === selectedNodeId);
    const connectedNodeIds = new Set(outgoingEdges.map(e => e.target));
    connectedNodeIds.add(selectedNodeId);

    return {
      nodes: nodes.map(n => {
        const isHighlighted = connectedNodeIds.has(n.id);
        const isDimmed = !isHighlighted;
        return {
          ...n,
          data: {
            ...n.data,
            isHighlighted,
            isDimmed
          }
        };
      }),
      edges: edges.map(e => {
        const isHighlighted = e.source === selectedNodeId;
        return {
          ...e,
          animated: isHighlighted,
          style: {
            strokeOpacity: isHighlighted ? 1 : 0.1,
            strokeWidth: isHighlighted ? 3 : 2,
            stroke: isHighlighted ? '#6366f1' : '#475569',
          }
        };
      })
    };
  }, [nodes, edges, selectedNodeId]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      <Topbar
        onFitView={() => fitView({ duration: 800 })}
        onReset={onReset}
        onSimulate={isSimulating ? stopSimulation : startSimulation}
        isSimulating={isSimulating}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="flex flex-col border-r border-slate-800">
          <div className="flex-1 overflow-hidden">
            <Sidebar
              groups={workflowData.groups}
              onSelectState={onSelectFromSidebar}
              onAddState={() => setIsAddModalOpen(true)}
              selectedStateId={selectedNodeId}
              states={highlightedElements.nodes.map(n => ({
                id: n.id,
                label: n.data.label as string,
                group_id: workflowData.groups.find(g => g.label === n.data.groupLabel)?.id || '',
                sla: n.data.sla as any,
                order: 0,
                is_initial: false,
                is_terminal: false,
                canvas_position: n.position
              }))}
            />
          </div>
        </div>

        {/* Canvas */}
      <div className="flex-1 relative bg-slate-950">
        <ReactFlow
          nodes={highlightedElements.nodes}
          edges={highlightedElements.edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          colorMode="dark"
          defaultEdgeOptions={{
            type: 'workflowEdge',
            markerEnd: { type: 'arrowclosed', color: '#475569' }
          }}
        >
          {/* Background grid pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
               style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-full text-[10px] font-medium text-slate-500 uppercase tracking-widest pointer-events-none">
            {isSimulating ? 'Modo Simulación Activo' : 'Arrastre para mover · Conecte para transicionar'}
          </div>
        </ReactFlow>

        {isSimulating && (
          <SimulationBar
            currentNode={selectedNode}
            historyLength={simHistory.length}
            onNext={simNext}
            onBack={simBack}
            onExit={stopSimulation}
          />
        )}
      </div>

      {/* Inspector */}
      {!isSimulating && (
        <Inspector
          selectedNode={selectedNode}
          nodes={nodes}
          edges={edges}
          onUpdateNode={updateNodeData}
          onDeleteNode={deleteNode}
          onDeleteEdge={deleteEdge}
          onAddEdge={addNewEdge}
        />
      )}

      {/* Modals */}
      {simOptions && (
        <SimStepModal
          options={simOptions}
          onSelect={handleSimTransition}
          onClose={() => setSimOptions(null)}
        />
      )}

      {isAddModalOpen && (
        <AddStateModal
          groups={workflowData.groups}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={addNewState}
        />
      )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <WorkflowEditor />
    </ReactFlowProvider>
  );
}
