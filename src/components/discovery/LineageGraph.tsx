import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Position,
  MarkerType,
  Handle,
  applyNodeChanges,
  NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LineageGraph as LineageGraphType, TableNode, Relationship, TableNodeData } from '@/types/migration';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';
import dagre from 'dagre';

interface LineageGraphProps {
  lineageGraph: LineageGraphType;
  onNodesPositionsChange: (nodes: Node<TableNodeData>[]) => void; // Update prop type
}

 // Custom Table Node Component
 function TableFlowNode({ data }: { data: TableNodeData }) {
   const { table, type } = data;
   const [showAllColumns, setShowAllColumns] = useState(false); // State to manage column visibility
   
   const displayedColumns = showAllColumns ? table.columns : table.columns.slice(0, 4);
   
   return (
     <div className={`bg-card border rounded-lg shadow-lg min-w-[250px] ${
       type === 'source' ? 'border-blue-200' : 'border-green-200'
     }`} onClick={() => setShowAllColumns(!showAllColumns)}> {/* Add onClick to toggle */}
       {/* Source Handle */}
       <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />

       {/* Target Handle */}
       <Handle type="target" position={Position.Left} className="w-3 h-3 bg-green-500" />

       {/* Header */}
       <div className={`px-4 py-3 border-b rounded-t-lg ${
         type === 'source'
           ? 'bg-blue-50 border-blue-200'
           : 'bg-green-50 border-green-200'
       }`}>
         <div className="flex items-center gap-2">
           <Database className="h-4 w-4" />
           <span className="font-medium text-sm">{table.name}</span>
           <Badge variant="outline" className="text-xs">
             {type === 'source' ? table.dialect : table.dialect}
           </Badge>
         </div>
         <div className="text-xs text-muted-foreground mt-1">
           {table.schema}.{table.name}
         </div>
       </div>
       
       {/* Stats */}
       <div className="px-4 py-2 bg-muted/20">
         <div className="flex justify-between text-xs text-muted-foreground">
           <span>{table.columns.length} columns</span>
         </div>
       </div>
       
       {/* Key Columns Preview */}
       <div className="px-4 py-3 space-y-1 cursor-pointer"> {/* Add cursor-pointer for visual cue */}
         {displayedColumns.map((column) => (
           <div key={column.id} className="flex items-center gap-2 text-xs">
             <div className={`w-2 h-2 rounded-full ${
               column.isPrimaryKey ? 'bg-yellow-400' :
               column.isForeignKey ? 'bg-blue-400' :
               'bg-gray-300'
             }`} />
             <span className="font-mono">{column.name}</span>
             <span className="text-muted-foreground">{column.dataType}</span>
           </div>
         ))}
         {table.columns.length > 4 && (
           <div className="text-xs text-muted-foreground pl-4">
             {showAllColumns ? '- Show less' : `+${table.columns.length - 4} more columns`}
           </div>
         )}
       </div>
     </div>
   );
 }

const nodeTypes = {
  tableNode: TableFlowNode,
};


export function LineageGraph({ lineageGraph, onNodesPositionsChange }: LineageGraphProps) {
  const dagreGraph = useMemo(() => {
    const graph = new dagre.graphlib.Graph();
    graph.setDefaultEdgeLabel(() => ({}));
    return graph;
  }, []);

  const nodeWidth = 250; // Approximate width of your TableFlowNode
  const nodeHeight = 150; // Approximate height of your TableFlowNode, adjust as needed

  const getLayoutedElements = useCallback((nodes: Node<TableNodeData>[], edges: Edge[], direction = 'LR') => {
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
      return node;
    });
  }, [dagreGraph]); // Add dagreGraph to dependencies

  const { layoutedNodes, layoutedEdges } = useMemo(() => {
    const initialNodes: Node<TableNodeData>[] = lineageGraph.tables.map(table => ({
      id: table.id,
      type: 'tableNode',
      position: { x: 0, y: 0 }, // Initial dummy position, will be overwritten by layout
      data: {
        table,
        label: table.name,
        type: table.type,
      },
    }));

    const initialEdges: Edge[] = lineageGraph.relationships.map((rel) => {
      const sourceTable = lineageGraph.tables.find(t => t.name === rel.sourceTable);
      const targetTable = lineageGraph.tables.find(t => t.name === rel.targetTable);

      if (!sourceTable || !targetTable) {
        return null;
      }

      const isSourceToTarget = sourceTable.type === 'source' && targetTable.type === 'target';

      let edgeStyle = {};
      let markerColor = '';
      let animated = true;

      if (isSourceToTarget) {
        edgeStyle = { strokeDasharray: '5 5', stroke: '#22c55e', strokeWidth: 2 };
        markerColor = '#22c55e';
      } else {
        edgeStyle = { stroke: '#999', strokeWidth: 1 };
        markerColor = '#999';
        animated = false;
      }

      if (sourceTable.type === 'source' && targetTable.type === 'source') {
        return null;
      }

      let label = '';
      if (rel.relationshipType === 'one-to-one') {
        label = '1:1';
      } else if (rel.relationshipType === 'one-to-many') {
        label = '1:M';
      } else {
        label = `${Math.round(rel.confidence * 100)}%`;
      }

      return {
        id: rel.id,
        source: sourceTable.id,
        target: targetTable.id,
        type: 'smoothstep',
        animated: animated,
        style: edgeStyle,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: markerColor,
        },
        label: label,
        labelStyle: {
          fontSize: 11,
          fontWeight: 500,
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.9,
        },
      };
    }).filter(Boolean) as Edge[];

    const mappingEdges = lineageGraph.mappings.map((mapping) => {
      const sourceTable = lineageGraph.tables.find(t => t.name === mapping.sourceTable);
      const targetTable = lineageGraph.tables.find(t => t.name === mapping.targetTable);

      if (!sourceTable || !targetTable) {
        return null;
      }

      return {
        id: mapping.id,
        source: sourceTable.id,
        target: targetTable.id,
        type: 'smoothstep',
        animated: true,
        style: { strokeWidth: 2, stroke: '#f97316' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#f97316',
        },
        label: `${Math.round(mapping.confidence * 100)}%`,
        labelStyle: {
          fontSize: 11,
          fontWeight: 500,
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.9,
        },
      };
    }).filter(Boolean) as Edge[];

    const keyMappingEdges = lineageGraph.keyMappings.map((keyMapping) => {
      const sourceTable = lineageGraph.tables.find(t => t.name === keyMapping.sourceTable);
      const targetTable = lineageGraph.tables.find(t => t.name === keyMapping.targetTable);

      if (!sourceTable || !targetTable) {
        return null;
      }

      return {
        id: keyMapping.id,
        source: sourceTable.id,
        target: targetTable.id,
        type: 'smoothstep',
        animated: true,
        style: { strokeWidth: 4, stroke: '#8b5cf6' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#8b5cf6',
        },
        label: `${keyMapping.sourceColumn} -> ${keyMapping.targetColumn}`,
        labelStyle: {
          fontSize: 11,
          fontWeight: 500,
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.9,
        },
      };
    }).filter(Boolean) as Edge[];

    const sourceToSourceMappingEdges = lineageGraph.sourceToSourceMappings.map((s2sMapping) => {
      const sourceTable = lineageGraph.tables.find(t => t.name === s2sMapping.sourceTable);
      const targetTable = lineageGraph.tables.find(t => t.name === s2sMapping.targetTable);

      if (!sourceTable || !targetTable) {
        return null;
      }

      return {
        id: s2sMapping.id,
        source: sourceTable.id,
        target: targetTable.id,
        type: 'smoothstep',
        animated: true,
        style: { strokeWidth: 2, stroke: '#ef4444', strokeDasharray: '8 4' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#ef4444',
        },
        label: s2sMapping.description || `${Math.round(s2sMapping.confidence * 100)}%`,
        labelStyle: {
          fontSize: 11,
          fontWeight: 500,
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.9,
        },
      };
    }).filter(Boolean) as Edge[];

    const allEdges = [...initialEdges, ...mappingEdges, ...keyMappingEdges, ...sourceToSourceMappingEdges];
    const layoutedNodes = getLayoutedElements(initialNodes, allEdges);

    return { layoutedNodes, layoutedEdges: allEdges };
  }, [lineageGraph.tables, lineageGraph.relationships, lineageGraph.mappings, lineageGraph.keyMappings, lineageGraph.sourceToSourceMappings]);


  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onNodesChangeCallback = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds) as Node<TableNodeData>[];
        onNodesPositionsChange(updated); // Call the prop callback with updated nodes
        return updated;
      });
    },
    [setNodes, onNodesPositionsChange]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-[600px] w-full border rounded-lg bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeCallback} // Use the new callback name
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        className="bg-background"
        minZoom={0.3}
        maxZoom={2}
      >
        <Controls className="bg-background border" />
        <Background color="#e2e8f0" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}