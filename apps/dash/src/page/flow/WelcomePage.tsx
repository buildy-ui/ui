import { useCallback } from 'react';
import { 
  ReactFlow,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
 // Handle,
  //Position,
} from '@xyflow/react';
import '@xyflow/react/dist/base.css';

import CustomNode from './CustomNode';
 
const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 350, y: 50 },
    data: { 
      label: 'Welcome'
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 150, y: 300 },
    data: { 
      label: 'to Flow Builder'
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 350, y: 550 },
    data: { 
      label: 'Check',
      message: '' 
    },
  },
];

const initialEdges: Edge[] = [];

export function WelcomePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Simplified hasDeletedNodes calculation
  const hasDeletedNodes = nodes.length < initialNodes.length;

  const checkConnections = useCallback(() => {
    if (edges.length === 2) {
      const correctConnection = 
        edges.some(e => e.source === '1' && e.target === '2') &&
        edges.some(e => e.source === '2' && e.target === '3');
      
      if (correctConnection) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === '3') {
              return {
                ...node,
                data: {
                  ...node.data,
                  label: 'Welcome to Flow Builder',
                },
              };
            }
            return node;
          })
        );
      } else {
        alert('Please correctly connect the nodes to continue: 1 -> 2 -> 3');
      }
    } else {
        alert('Please connect the nodes correctly.');
      }
  }, [edges, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const resetNodes = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          colorMode="dark"
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          deleteKeyCode={'Delete'}
          fitView
        >
          <Background className="bg-background text-foreground" />
          <Controls />
          {hasDeletedNodes && (
            <Panel position="top-right">
              <button 
                onClick={resetNodes}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Restore nodes
              </button>
            </Panel>
          )}
          {nodes.find(node => node.id === '3') && (
            <Panel position="bottom-right">
              <button 
                onClick={() => checkConnections()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Check Connections
              </button>
            </Panel>
          )}
          <Panel position="top-left">
            <div className="flex flex-col max-w-[200px] items-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow min-w-[200px]">
              <h3 className="text-lg font-semibold mb-2">How use</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop nodes to create your flow. For delete node, select node or edge and press delete key.
              </p>
            </div>
          </Panel>
        </ReactFlow>
      </div>
  );
} 