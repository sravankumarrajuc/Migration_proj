import { useState, useMemo } from 'react';
import { LineageGraph as LineageGraphType, TableNode, ColumnNode } from '@/types/migration';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, ChevronRight, Database, Key, Link, Info } from 'lucide-react';
import { dialectDisplayNames } from '@/data/mockProjects';

interface MetadataCatalogProps {
  lineageGraph: LineageGraphType;
}

interface ExpandedTableRowProps {
  table: TableNode;
  isExpanded: boolean;
  onToggle: () => void;
}

function ExpandedTableRow({ table, isExpanded, onToggle }: ExpandedTableRowProps) {
  return (
    <>
      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={onToggle}>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-auto p-1">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <Database className="h-4 w-4" />
            <span className="font-medium">{table.name}</span>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant={table.type === 'source' ? 'default' : 'secondary'}>
            {table.type}
          </Badge>
        </TableCell>
        <TableCell>{dialectDisplayNames[table.dialect] || table.dialect}</TableCell>
        <TableCell>{table.schema}</TableCell>
        <TableCell>{table.columns.length}</TableCell>
        <TableCell>{table.rowCount?.toLocaleString() || '-'}</TableCell>
        <TableCell>{table.size || '-'}</TableCell>
      </TableRow>
      
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={7} className="p-0">
            <Collapsible open={isExpanded}>
              <CollapsibleContent>
                <div className="bg-muted/20 p-4 border-t">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Columns ({table.columns.length})
                  </h4>
                  <div className="grid gap-2">
                    {table.columns.map((column) => (
                      <div key={column.id} className="flex items-center justify-between p-2 bg-background rounded border">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {column.isPrimaryKey && (
                              <Key className="h-3 w-3 text-yellow-600" />
                            )}
                            {column.isForeignKey && (
                              <Link className="h-3 w-3 text-blue-600" />
                            )}
                            <span className="font-mono text-sm">{column.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {column.dataType}
                          </Badge>
                          {!column.nullable && (
                            <Badge variant="destructive" className="text-xs">
                              NOT NULL
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {column.description && (
                            <div className="flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              <span>{column.description}</span>
                            </div>
                          )}
                          {column.references && (
                            <span className="text-blue-600">
                              → {column.references.table}.{column.references.column}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function MetadataCatalog({ lineageGraph }: MetadataCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'source' | 'target'>('all');
  const [filterDialect, setFilterDialect] = useState<string>('all');
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  // Get unique dialects for filter
  const dialects = useMemo(() => {
    const uniqueDialects = Array.from(new Set(lineageGraph.tables.map(t => t.dialect)));
    return uniqueDialects;
  }, [lineageGraph.tables]);

  // Filter tables based on search and filters
  const filteredTables = useMemo(() => {
    return lineageGraph.tables.filter(table => {
      const matchesSearch = searchTerm === '' || 
        table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.schema.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.columns.some(col => col.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === 'all' || table.type === filterType;
      const matchesDialect = filterDialect === 'all' || table.dialect === filterDialect;
      
      return matchesSearch && matchesType && matchesDialect;
    });
  }, [lineageGraph.tables, searchTerm, filterType, filterDialect]);

  const toggleTableExpansion = (tableId: string) => {
    setExpandedTables(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tableId)) {
        newSet.delete(tableId);
      } else {
        newSet.add(tableId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tables, columns, or schemas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="source">Source</SelectItem>
            <SelectItem value="target">Target</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterDialect} onValueChange={setFilterDialect}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter by dialect" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dialects</SelectItem>
            {dialects.map(dialect => (
              <SelectItem key={dialect} value={dialect}>
                {dialectDisplayNames[dialect] || dialect}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Showing Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTables.length}</div>
            <p className="text-xs text-muted-foreground">
              of {lineageGraph.tables.length} total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Columns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredTables.reduce((sum, table) => sum + table.columns.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across filtered tables
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lineageGraph.relationships.length}</div>
            <p className="text-xs text-muted-foreground">
              Data dependencies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <Card>
        <CardHeader>
          <CardTitle>Discovered Tables</CardTitle>
          <CardDescription>
            Click on any table to expand and view its columns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dialect</TableHead>
                <TableHead>Schema</TableHead>
                <TableHead>Columns</TableHead>
                <TableHead>Rows</TableHead>
                <TableHead>Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTables.map((table) => (
                <ExpandedTableRow
                  key={table.id}
                  table={table}
                  isExpanded={expandedTables.has(table.id)}
                  onToggle={() => toggleTableExpansion(table.id)}
                />
              ))}
              {filteredTables.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No tables found matching your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}