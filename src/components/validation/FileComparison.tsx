import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CodeEditor } from '@/components/codegen/CodeEditor';
import { FileText, AlertCircle, CheckCircle, Settings } from 'lucide-react';

interface FileComparisonProps {
  tolerance: number;
}

export function FileComparison({ tolerance }: FileComparisonProps) {
  const [selectedFile, setSelectedFile] = useState('customer_data.csv');
  const [showSettings, setShowSettings] = useState(false);
  const [currentTolerance, setCurrentTolerance] = useState(tolerance);

  const mockFiles = [
    { 
      name: 'customer_data.csv', 
      status: 'match', 
      differences: 0,
      legacy: `customer_id,name,email,created_date
1,John Doe,john@example.com,2024-01-15
2,Jane Smith,jane@example.com,2024-01-16
3,Bob Johnson,bob@example.com,2024-01-17`,
      migrated: `customer_id,name,email,created_date
1,John Doe,john@example.com,2024-01-15
2,Jane Smith,jane@example.com,2024-01-16
3,Bob Johnson,bob@example.com,2024-01-17`
    },
    { 
      name: 'order_summary.csv', 
      status: 'minor_diff', 
      differences: 2,
      legacy: `order_id,customer_id,total_amount,order_date
101,1,299.99,2024-01-20
102,2,149.50,2024-01-21
103,3,599.00,2024-01-22`,
      migrated: `order_id,customer_id,total_amount,order_date
101,1,300.00,2024-01-20
102,2,149.50,2024-01-21
103,3,599.01,2024-01-22`
    },
    { 
      name: 'product_catalog.csv', 
      status: 'anomaly', 
      differences: 5,
      legacy: `product_id,name,price,category
1,Widget A,29.99,Electronics
2,Widget B,19.99,Electronics
3,Gadget X,99.99,Gadgets`,
      migrated: `product_id,name,price,category
1,Widget A,29.99,Electronics
2,Widget B,NULL,Electronics
3,Gadget X,99.99,Gadgets`
    },
  ];

  const currentFile = mockFiles.find(f => f.name === selectedFile) || mockFiles[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'match': return 'default';
      case 'minor_diff': return 'secondary';
      case 'anomaly': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'match': return <CheckCircle className="h-4 w-4" />;
      case 'minor_diff': return <AlertCircle className="h-4 w-4" />;
      case 'anomaly': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* File Selection and Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">File Comparison</CardTitle>
              <CardDescription>
                Compare legacy and migrated data files side by side
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
              <h4 className="font-medium">Comparison Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tolerance">Numerical Tolerance (%)</Label>
                  <Input
                    id="tolerance"
                    type="number"
                    value={currentTolerance * 100}
                    onChange={(e) => setCurrentTolerance(parseFloat(e.target.value) / 100)}
                    step="0.1"
                    min="0"
                    max="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format Handling</Label>
                  <Select defaultValue="flexible">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strict">Strict Match</SelectItem>
                      <SelectItem value="flexible">Flexible Format</SelectItem>
                      <SelectItem value="ignore">Ignore Format</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* File Selection */}
          <div className="space-y-2">
            <Label>Select File to Compare</Label>
            <Select value={selectedFile} onValueChange={setSelectedFile}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockFiles.map((file) => (
                  <SelectItem key={file.name} value={file.name}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(file.status)}
                      <span>{file.name}</span>
                      <Badge variant={getStatusColor(file.status)} className="ml-auto">
                        {file.differences === 0 ? 'Perfect Match' : `${file.differences} diffs`}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Legacy Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Legacy Data
              <Badge variant="outline" className="ml-auto">Source</Badge>
            </CardTitle>
            <CardDescription>{currentFile.name}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <CodeEditor
              code={currentFile.legacy}
              language="csv"
              readOnly={true}
              height="400px"
            />
          </CardContent>
        </Card>

        {/* Migrated Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Migrated Data
              <Badge variant="outline" className="ml-auto">Target</Badge>
            </CardTitle>
            <CardDescription>{currentFile.name}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <CodeEditor
              code={currentFile.migrated}
              language="csv"
              readOnly={true}
              height="400px"
            />
          </CardContent>
        </Card>
      </div>

      {/* Comparison Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comparison Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">File Status:</span>
              <Badge variant={getStatusColor(currentFile.status)}>
                {getStatusIcon(currentFile.status)}
                <span className="ml-1 capitalize">{currentFile.status.replace('_', ' ')}</span>
              </Badge>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Differences Found:</span>
                <span className="ml-2 font-medium">{currentFile.differences}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tolerance Applied:</span>
                <span className="ml-2 font-medium">{(currentTolerance * 100).toFixed(1)}%</span>
              </div>
            </div>

            {currentFile.differences > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Differences detected in numerical values. Review tolerance settings if needed.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}