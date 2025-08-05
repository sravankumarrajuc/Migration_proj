import { useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Controls,
  Background,
  useNodesState,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LineageGraph as LineageGraphType, TableNode } from '@/types/migration';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';

interface LineageGraphProps {
  lineageGraph: LineageGraphType;
}

interface TableNodeData extends Record<string, unknown> {
  table: TableNode;
  label: string;
  type: 'source' | 'target';
}

 // Custom Table Node Component
 function TableFlowNode({ data }: { data: TableNodeData }) {
   const { table, type } = data;
   
   return (
     <div className={`bg-card border rounded-lg shadow-lg min-w-[250px] ${
       type === 'source' ? 'border-blue-200' : 'border-green-200'
     }`}>
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
       
       {/* Stats - Removed rowCount and size display */}
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
  const sourceNodes: Node<TableNodeData>[] = useMemo(() => {
    return lineageGraph.tables
      .filter(t => t.type === 'source')
      .map((table, index) => ({
        id: table.id,
        type: 'tableNode',
        position: { x: 50, y: 50 + index * 200 },
        data: {
          table,
          label: table.name,
          type: 'source',
        },
      }));
  }, [lineageGraph.tables]);

  const targetNodes: Node<TableNodeData>[] = useMemo(() => {
    return lineageGraph.tables
      .filter(t => t.type === 'target')
      .map((table, index) => ({
        id: table.id,
        type: 'tableNode',
        position: { x: 50, y: 50 + index * 200 },
        data: {
          table,
          label: table.name,
          type: 'target',
        },
      }));
  }, [lineageGraph.tables]);

  const [sourceGraphNodes, , onSourceNodesChange] = useNodesState(sourceNodes);
  const [targetGraphNodes, , onTargetNodesChange] = useNodesState(targetNodes);

  return (
    <div className="flex w-full gap-4">
      {/* Source Graph */}
      <div className="h-[600px] w-1/2 border rounded-lg bg-background">
        <h3 className="text-lg font-semibold p-4 border-b">Source Tables</h3>
        <ReactFlow
          nodes={sourceGraphNodes}
          edges={[]} // No edges for source graph
          onNodesChange={onSourceNodesChange}
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

      {/* Target Graph */}
      <div className="h-[600px] w-1/2 border rounded-lg bg-background">
        <h3 className="text-lg font-semibold p-4 border-b">Target Tables</h3>
        <ReactFlow
          nodes={targetGraphNodes}
          edges={[]} // No edges for target graph
          onNodesChange={onTargetNodesChange}
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
    </div>
  );
}