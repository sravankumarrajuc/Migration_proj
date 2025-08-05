import { useCallback, useMemo } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LineageGraph as LineageGraphType, TableNode, Relationship } from '@/types/migration';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';

interface LineageGraphProps {
  lineageGraph: LineageGraphType;
}

interface TableNodeData extends Record<string, unknown> {
  table: TableNode;
  label: string;
  type: 'source' | 'target' | 'intermediate';
}

 // Custom Table Node Component
 function TableFlowNode({ data }: { data: TableNodeData }) {
   const { table, type } = data;
   
   return (
     <div className={`bg-card border rounded-lg shadow-lg min-w-[250px] ${
       type === 'source' ? 'border-blue-200' : 'border-green-200'
     }`}>
       {/* Source Handle (for source tables) */}
       {type === 'source' && (
         <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
       )}

       {/* Target Handle (for target tables) */}
       {type === 'target' && (
         <Handle type="target" position={Position.Left} className="w-3 h-3 bg-green-500" />
       )}

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
       <div className="px-4 py-3 space-y-1">
         {table.columns.slice(0, 4).map((column) => (
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
             +{table.columns.length - 4} more columns
           </div>
         )}
       </div>
     </div>
   );
 }

const nodeTypes = {
  tableNode: TableFlowNode,
};

export function LineageGraph({ lineageGraph }: LineageGraphProps) {
  const initialNodes: Node<TableNodeData>[] = useMemo(() => {
    return lineageGraph.tables.map(table => ({
      id: table.id,
      type: 'tableNode',
      position: table.position || { x: 0, y: 0 }, // Use position from data, or default
      data: {
        table,
        label: table.name,
        type: table.type,
      },
    }));
  }, [lineageGraph.tables]);

  const initialEdges: Edge[] = useMemo(() => {
    const relationshipEdges = lineageGraph.relationships.map((rel) => {
      const sourceTable = lineageGraph.tables.find(t => t.name === rel.sourceTable);
      const targetTable = lineageGraph.tables.find(t => t.name === rel.targetTable);

      if (!sourceTable || !targetTable) {
        return null; // Skip if tables are not found
      }

      const isSourceToSource = sourceTable.type === 'source' && targetTable.type === 'source';
      const isSourceToTarget = sourceTable.type === 'source' && targetTable.type === 'target';

      let edgeStyle = {};
      let markerColor = '';
      let animated = true;

      if (isSourceToSource) {
        edgeStyle = { strokeWidth: 3, stroke: '#3b82f6' }; // Thick blue line
        markerColor = '#3b82f6';
      } else if (isSourceToTarget) {
        edgeStyle = { strokeDasharray: '5 5', stroke: '#22c55e', strokeWidth: 2 }; // Dotted green line
        markerColor = '#22c55e';
      } else {
        // Default or other relationship types (if any)
        edgeStyle = { stroke: '#999', strokeWidth: 1 };
        markerColor = '#999';
        animated = false;
      }

      // Determine label based on relationship type
      let label = '';
      if (rel.relationshipType === 'one-to-one') {
        label = '1:1';
      } else if (rel.relationshipType === 'one-to-many') {
        label = '1:M';
      } else {
        label = `${Math.round(rel.confidence * 100)}%`; // Fallback to confidence if type is unknown
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
    }).filter(Boolean) as Edge[]; // Filter out nulls

    const mappingEdges = lineageGraph.mappings.map((mapping) => {
      const sourceTable = lineageGraph.tables.find(t => t.name === mapping.sourceTable);
      const targetTable = lineageGraph.tables.find(t => t.name === mapping.targetTable);

      if (!sourceTable || !targetTable) {
        return null; // Skip if tables are not found
      }

      return {
        id: mapping.id,
        source: sourceTable.id,
        target: targetTable.id,
        type: 'smoothstep', // Using smoothstep for now, can be 'bezier' or 'step'
        animated: true,
        style: { strokeWidth: 2, stroke: '#f97316' }, // Orange for mappings
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

    return [...relationshipEdges, ...mappingEdges];
  }, [lineageGraph.relationships, lineageGraph.tables, lineageGraph.mappings]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-[600px] w-full border rounded-lg bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
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