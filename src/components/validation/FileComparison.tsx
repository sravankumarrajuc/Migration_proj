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
  legacyCode?: string;
  migratedCode?: string;
}

export function FileComparison({ tolerance, legacyCode, migratedCode }: FileComparisonProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [currentTolerance, setCurrentTolerance] = useState(tolerance);

  // If codes are provided as props, use them directly
  const displayLegacyCode = legacyCode || '';
  const displayMigratedCode = migratedCode || '';

  // Determine language based on content (simple check for SQL)
  const language = (displayLegacyCode.includes('CREATE OR REPLACE TABLE') || displayMigratedCode.includes('CREATE OR REPLACE TABLE')) ? 'sql' : 'csv';

  // Calculate differences (a very basic example, real diffing would be more complex)
  const differences = displayLegacyCode !== displayMigratedCode ? 1 : 0;
  const status = differences > 0 ? 'minor_diff' : 'match';

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
          {/* Removed file selection as data now comes from props */}
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
            <CardDescription>Legacy Code</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <CodeEditor
              code={displayLegacyCode}
              language={language}
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
            <CardDescription>Migrated Code</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <CodeEditor
              code={displayMigratedCode}
              language={language}
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
              <Badge variant={getStatusColor(status)}>
                {getStatusIcon(status)}
                <span className="ml-1 capitalize">{status.replace('_', ' ')}</span>
              </Badge>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Differences Found:</span>
                <span className="ml-2 font-medium">{differences}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tolerance Applied:</span>
                <span className="ml-2 font-medium">{(currentTolerance * 100).toFixed(1)}%</span>
              </div>
            </div>

            {differences > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Differences detected. Review the code.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}