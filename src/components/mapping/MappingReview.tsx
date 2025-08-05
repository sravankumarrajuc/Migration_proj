import { useMigrationStore } from '@/store/migrationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, Clock, Download, FileText } from 'lucide-react';
import { getTransformationIcon, getConfidenceBadgeColor } from '@/data/mockMappingData';
import { mockTableMappings } from '@/data/mockMappingData';

export function MappingReview() {
  const { mappingState, discoveryState } = useMigrationStore();

  const allMappings = mockTableMappings; // Using mock data for comprehensive review
  const totalMappings = allMappings.reduce((sum, tm) => sum + tm.fieldMappings.length, 0);
  const approvedMappings = allMappings.reduce((sum, tm) => 
    sum + tm.fieldMappings.filter(fm => fm.status === 'approved').length, 0
  );
  const overallProgress = totalMappings > 0 ? (approvedMappings / totalMappings) * 100 : 0;

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

  const handleExportMappings = () => {
    // In a real implementation, this would generate and download a mapping specification file
    console.log('Exporting mapping specifications...');
  };

  return (
    <div className="h-full flex flex-col space-y-6 p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{approvedMappings}</div>
                <div className="text-sm text-muted-foreground">Approved Mappings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{totalMappings - approvedMappings}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{allMappings.length}</div>
                <div className="text-sm text-muted-foreground">Table Mappings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {allMappings.reduce((sum, tm) => 
                    sum + (tm.totalRequiredFields - tm.requiredFieldsCovered), 0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Missing Required</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Mapping Progress</span>
            <Badge variant="outline">{Math.round(overallProgress)}% Complete</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{approvedMappings} of {totalMappings} mappings approved</span>
            <span>{totalMappings - approvedMappings} remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Table Mappings Overview */}
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mapping Details</CardTitle>
            <Button onClick={handleExportMappings} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Specifications
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="p-4 space-y-6">
              {allMappings.map((tableMapping, index) => (
                <div key={`${tableMapping.sourceTableId}-${tableMapping.targetTableId}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {tableMapping.sourceTableId} → {tableMapping.targetTableId}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{tableMapping.fieldMappings.length} field mappings</span>
                        <span>{tableMapping.requiredFieldsCovered}/{tableMapping.totalRequiredFields} required fields</span>
                        <Badge variant="outline">{Math.round(tableMapping.completionPercentage)}% complete</Badge>
                      </div>
                    </div>
                    <Progress value={tableMapping.completionPercentage} className="w-32 h-2" />
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source Field</TableHead>
                        <TableHead>Target Field</TableHead>
                        <TableHead>Transformation</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableMapping.fieldMappings.map((mapping) => {
                        const sourceColumn = getSourceColumn(mapping.sourceTableId, mapping.sourceColumnId);
                        const targetColumn = getTargetColumn(mapping.targetTableId, mapping.targetColumnId);

                        return (
                          <TableRow key={mapping.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{sourceColumn?.name || mapping.sourceColumnId}</div>
                                <div className="text-xs text-muted-foreground">
                                  {sourceColumn?.dataType || 'Unknown'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{targetColumn?.name || mapping.targetColumnId}</div>
                                <div className="text-xs text-muted-foreground">
                                  {targetColumn?.dataType || 'Unknown'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getTransformationIcon(mapping.transformationType)}</span>
                                <span className="capitalize">{mapping.transformationType.replace('_', ' ')}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getConfidenceBadgeColor(mapping.confidence)}>
                                {mapping.confidence}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={mapping.status === 'approved' ? 'default' : 'secondary'}
                                className={mapping.status === 'approved' ? 'bg-green-600' : ''}
                              >
                                {mapping.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {index < allMappings.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}