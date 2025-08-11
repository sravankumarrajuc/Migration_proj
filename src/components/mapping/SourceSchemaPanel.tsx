import { useState } from 'react';
import { useMigrationStore } from '@/store/migrationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Database, Table, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SourceSchemaPanel() {
  const { discoveryState, mappingState, toggleSourceColumnSelection } = useMigrationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  if (!discoveryState.lineageGraph) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Source Schema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No source schema data available.</p>
        </CardContent>
      </Card>
    );
  }

  const sourceTables = discoveryState.lineageGraph.tables.filter(t => t.type === 'source');
  const filteredTables = sourceTables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.columns.some(col => col.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const { setSelectedTableFilter, clearTableFilter } = useMigrationStore();

  const toggleTableExpansion = (tableId: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableId)) {
      newExpanded.delete(tableId);
    } else {
      newExpanded.add(tableId);
    }
    setExpandedTables(newExpanded);
  };

  const handleTableClick = (tableId: string, event: React.MouseEvent) => {
    // Check if the click is on the expand/collapse area or the table selection area
    const target = event.target as HTMLElement;
    const isExpandClick = target.closest('[data-expand-trigger]');
    
    if (!isExpandClick) {
      // This is a table selection click for filtering
      if (mappingState.selectedTableFilter === tableId && mappingState.selectedTableFilterType === 'source') {
        // If the same table is clicked again, clear the filter
        clearTableFilter();
      } else {
        // Set the new table filter
        setSelectedTableFilter(tableId, 'source');
      }
    }
  };

  const getColumnMappingStatus = (tableId: string, columnId: string) => {
    if (!mappingState.currentTableMapping) return 'unmapped';
    
    const mapping = mappingState.currentTableMapping.fieldMappings.find(
      fm => fm.sourceTableId === tableId && fm.sourceColumnId === columnId
    );
    
    if (mapping) {
      return mapping.status === 'approved' ? 'mapped' : 'pending';
    }
    return 'unmapped';
  };

  const selectedTable = mappingState.selectedSourceTable;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Source Schema
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tables and columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {filteredTables.map((table) => {
              const isSelected = table.id === selectedTable;
              const isExpanded = expandedTables.has(table.id);
              const mappedColumns = table.columns.filter(col => 
                getColumnMappingStatus(table.id, col.id) === 'mapped'
              ).length;

              return (
                <div key={table.id} className="space-y-2">
                  <div
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : mappingState.selectedTableFilter === table.id && mappingState.selectedTableFilterType === 'source'
                        ? "border-blue-300 bg-blue-50 ring-2 ring-blue-200"
                        : "border-border hover:bg-muted/50"
                    )}
                    onClick={(e) => handleTableClick(table.id, e)}
                  >
                    <div className="flex items-center gap-3">
                      <Table className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{table.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {table.schema} • {table.columns.length} columns
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {mappedColumns > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {mappedColumns}/{table.columns.length} mapped
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {table.dialect}
                      </Badge>
                      <div 
                        data-expand-trigger
                        className="p-1 hover:bg-muted rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTableExpansion(table.id);
                        }}
                      >
                        {isExpanded ? '−' : '+'}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="ml-4 space-y-1">
                      {table.columns.map((column) => {
                        const mappingStatus = getColumnMappingStatus(table.id, column.id);
                        const isSelected = mappingState.selectedSourceColumns.includes(column.id);
                        
                        return (
                          <div
                            key={column.id}
                            className={cn(
                              "flex items-center justify-between p-2 rounded border",
                              mappingStatus === 'mapped' 
                                ? "border-green-200 bg-green-50" 
                                : mappingStatus === 'pending'
                                ? "border-yellow-200 bg-yellow-50"
                                : isSelected
                                ? "border-blue-200 bg-blue-50"
                                : "border-border"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleSourceColumnSelection(column.id)}
                                className="h-4 w-4"
                              />
                              {mappingStatus === 'mapped' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : mappingStatus === 'pending' ? (
                                <ArrowRight className="h-4 w-4 text-yellow-600" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div>
                                <div className="font-medium text-sm">{column.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {column.dataType}
                                  {column.isPrimaryKey && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      PK
                                    </Badge>
                                  )}
                                  {column.isForeignKey && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      FK
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            {column.sampleValues && (
                              <div className="text-xs text-muted-foreground max-w-32 truncate">
                                {column.sampleValues.slice(0, 2).join(', ')}...
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {table.id !== filteredTables[filteredTables.length - 1].id && (
                    <Separator className="my-2" />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}