import { useMemo } from 'react';
import { useMigrationStore } from '@/store/migrationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Zap, Link, Calculator, Code, Shuffle, Trash2 } from 'lucide-react';
import { getTransformationIcon, getConfidenceBadgeColor } from '@/data/mockMappingData';
import { TransformationType } from '@/types/migration';
import { cn } from '@/lib/utils';

import { TableMapping } from '@/types/migration'; // Add this import

interface MappingCanvasProps {
  tableMappings: TableMapping[];
  minCompleteness?: number;
}

export function MappingCanvas({ tableMappings, minCompleteness = 90 }: MappingCanvasProps) {
  const { discoveryState, updateFieldMapping, removeFieldMapping } = useMigrationStore();

  const currentMappings = useMemo(() => {
    const allFieldMappings = tableMappings.flatMap(tableMapping =>
      tableMapping.fieldMappings.filter(fm =>
        fm.status === 'approved' || fm.status === 'suggested' || fm.status === 'rejected'
      )
    );

    return allFieldMappings.filter(fm => fm.confidence >= minCompleteness);
  }, [tableMappings, minCompleteness]);

  const getSourceColumn = (sourceTableId: string, sourceColumnId: string) => {
    if (!discoveryState.lineageGraph) return null;
    const table = discoveryState.lineageGraph.tables.find(t => t.id === sourceTableId);
    return table?.columns.find(c => c.id === sourceColumnId) || null;
  };

  const getTargetColumn = (targetTableId: string, targetColumnId: string) => {
    if (!discoveryState.lineageGraph) return null;
    const table = discoveryState.lineageGraph.tables.find(t => t.id === targetTableId);
    return table?.columns.find(c => c.id === targetColumnId) || null;
  };

  const getTransformationDetails = (type: TransformationType) => {
    switch (type) {
      case 'direct':
        return { icon: ArrowRight, color: 'text-blue-600', label: 'Direct' };
      case 'computed':
        return { icon: Calculator, color: 'text-purple-600', label: 'Computed' };
      case 'concatenated':
        return { icon: Link, color: 'text-green-600', label: 'Concatenated' };
      case 'cast':
        return { icon: Shuffle, color: 'text-orange-600', label: 'Type Cast' };
      case 'case_when':
        return { icon: Code, color: 'text-indigo-600', label: 'Conditional' };
      case 'custom':
        return { icon: Zap, color: 'text-pink-600', label: 'Custom' };
      default:
        return { icon: ArrowRight, color: 'text-gray-600', label: 'Unknown' };
    }
  };


  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Field Mappings
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Displaying field mappings for tables with &ge; {minCompleteness}% completeness.
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {currentMappings.length === 0 ? (
              <div className="text-center py-8">
                <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Mappings Yet</h3>
                <p className="text-muted-foreground mb-4">
                  {minCompleteness > 0
                    ? `No mappings with ${minCompleteness}% or more completeness.`
                    : "Generate AI suggestions or create manual mappings to get started"}
                </p>
              </div>
            ) : (
              currentMappings.map((mapping) => {
                const sourceColumn = getSourceColumn(mapping.sourceTableId, mapping.sourceColumnId);
                const targetColumn = getTargetColumn(mapping.targetTableId, mapping.targetColumnId);
                const transformationDetails = getTransformationDetails(mapping.transformationType);
                const TransformationIcon = transformationDetails.icon;

                return (
                  <div
                    key={mapping.id}
                    className={cn(
                      "border rounded-lg p-4 space-y-3 transition-colors",
                      mapping.status === 'approved'
                        ? "border-green-200 bg-green-50"
                        : mapping.status === 'rejected'
                          ? "border-red-200 bg-red-50"
                          : "border-border hover:bg-muted/50"
                    )}
                  >
                    {/* Mapping Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getConfidenceBadgeColor(mapping.confidence)}>
                          {mapping.confidence}% confidence
                        </Badge>
                        <Badge variant="outline" className={transformationDetails.color}>
                          <TransformationIcon className="h-3 w-3 mr-1" />
                          {transformationDetails.label}
                        </Badge>
                        {mapping.status === 'approved' && (
                          <Badge variant="default" className="bg-green-600">
                            Approved
                          </Badge>
                        )}
                        {mapping.status === 'rejected' && (
                          <Badge variant="default" className="bg-red-600">
                            Rejected
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {mapping.status === 'suggested' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateFieldMapping(mapping.id, { 
                                status: 'approved', 
                                approvedAt: new Date().toISOString() 
                              })}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateFieldMapping(mapping.id, { status: 'rejected' })}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {mapping.status === 'rejected' && (
                          <Button
                            size="sm"
                            onClick={() => updateFieldMapping(mapping.id, { status: 'suggested' })}
                          >
                            Revert Reject
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFieldMapping(mapping.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Source → Target Mapping */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {sourceColumn?.name || mapping.sourceColumnId}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {sourceColumn?.dataType || 'Unknown type'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 px-4">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1 text-right">
                        <div className="font-medium text-sm">
                          {targetColumn?.name || mapping.targetColumnId}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {targetColumn?.dataType || 'Unknown type'}
                        </div>
                      </div>
                    </div>

                    {/* Transformation Formula */}
                    {mapping.formula && (
                      <div className="bg-muted/50 rounded p-2">
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          Transformation:
                        </div>
                        <code className="text-xs font-mono">{mapping.formula}</code>
                      </div>
                    )}

                    {/* Description */}
                    {mapping.description && (
                      <div className="text-xs text-muted-foreground">
                        {mapping.description}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}