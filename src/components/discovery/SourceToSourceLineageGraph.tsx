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
import { LineageGraph as LineageGraphType, TableNode, SourceToSourceMappingLine } from '@/types/migration';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';

interface SourceToSourceLineageGraphProps {
  tables: TableNode[];
  sourceToSourceMappings: SourceToSourceMappingLine[];
}

// Custom Table Node Component (re-using from LineageGraph.tsx)
function TableFlowNode({ data }: { data: { table: TableNode; label: string; type: 'source' | 'target' | 'intermediate' } }) {
  const { table, type } = data;
  
  return (
    <div className={`bg-card border rounded-lg shadow-lg min-w-[250px] ${
      type === 'source' ? 'border-orange-500' : 'border-blue-500'
    }`}>
      {/* Source Handle */}
      <Handle type="source" position={Position.Right} className={`w-3 h-3 ${
        type === 'source' ? 'bg-orange-500' : 'bg-blue-500'
      }`} />

      {/* Target Handle */}
      <Handle type="target" position={Position.Left} className={`w-3 h-3 ${
        type === 'source' ? 'bg-orange-500' : 'bg-blue-500'
      }`} />

      {/* Header */}
      <div className={`px-4 py-3 border-b rounded-t-lg ${
        type === 'source'
          ? 'bg-orange-50 border-orange-500'
          : 'bg-blue-50 border-blue-500'
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

export function SourceToSourceLineageGraph({ tables, sourceToSourceMappings }: SourceToSourceLineageGraphProps) {
  console.log('SourceToSourceLineageGraph - tables:', tables);
  console.log('SourceToSourceLineageGraph - sourceToSourceMappings:', sourceToSourceMappings);
  const initialNodes: Node<any>[] = useMemo(() => {
    // Filter to only include source tables that are part of the s2s mappings
    return tables
      .filter(table => table.type === 'source') // Only include source tables
      .map(table => ({
        id: table.id,
        type: 'tableNode',
        position: table.position || { x: 0, y: 0 },
        data: {
          table,
          label: table.name,
          type: table.type,
        },
      }));
  }, [tables, sourceToSourceMappings]);

  const initialEdges: Edge[] = useMemo(() => {
    return sourceToSourceMappings.map((s2sMapping) => {
      const sourceTable = tables.find(t => t.name === s2sMapping.sourceTable);
      const targetTable = tables.find(t => t.name === s2sMapping.targetTable);

      if (!sourceTable) {
        console.error(`Source table not found for mapping ${s2sMapping.id}: ${s2sMapping.sourceTable}`);
        return null;
      }
      if (!targetTable) {
        console.error(`Target table not found for mapping ${s2sMapping.id}: ${s2sMapping.targetTable}`);
        return null;
      }

      return {
        id: s2sMapping.id,
        source: sourceTable.id,
        target: targetTable.id,
        type: 'smoothstep',
        animated: true,
        style: { strokeWidth: 2, stroke: '#ef4444', strokeDasharray: '8 4' }, // Dashed red line
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
  }, [tables, sourceToSourceMappings]);

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