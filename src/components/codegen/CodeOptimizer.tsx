import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DiffEditor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertTriangle, Info, Zap, Eye, Code } from 'lucide-react';
import { CodePlatform } from '@/types/migration';
import { mockCodeOptimizations } from '@/data/mockCodeGeneration';
import { CodeEditor } from './CodeEditor';

interface CodeOptimizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: CodePlatform;
  code: string;
  onApplyOptimization: (optimizedCode: string) => void;
  originalCodeForComparison: string;
  optimizedCodeForComparison: string;
}

const optimizationIcons = {
  performance: Zap,
  'best-practice': CheckCircle,
  readability: Eye,
  'cost-optimization': Code
};

const impactColors = {
  high: 'destructive',
  medium: 'secondary', 
  low: 'outline'
} as const;

export function CodeOptimizer({
  open,
  onOpenChange,
  platform,
  code,
  onApplyOptimization,
  originalCodeForComparison,
  optimizedCodeForComparison
}: CodeOptimizerProps) {
  const [selectedOptimizations, setSelectedOptimizations] = useState<string[]>([]);
  const [optimizedCode, setOptimizedCode] = useState(code); // This state will hold the *currently* optimized code within the modal
  const [isOptimizing, setIsOptimizing] = useState(false);

  const toggleOptimization = (optimizationId: string) => {
    setSelectedOptimizations(prev => 
      prev.includes(optimizationId)
        ? prev.filter(id => id !== optimizationId)
        : [...prev, optimizationId]
    );
  };

  const selectAllOptimizations = () => {
    setSelectedOptimizations(mockCodeOptimizations.map(opt => opt.id));
  };

  const deselectAllOptimizations = () => {
    setSelectedOptimizations([]);
  };

  const handleOptimizeCode = async () => {
    if (selectedOptimizations.length === 0) return;

    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI optimization process

    let optimized = code;

    selectedOptimizations.forEach(optId => {
      const optimization = mockCodeOptimizations.find(opt => opt.id === optId);
      console.log('Applying optimization:', optimization);
      if (optimization) {
        switch (optimization.id) {
          case 'opt-1': // Add clustering keys for BigQuery
            if (platform === 'bigquery') {
              optimized = optimized.replace(
                /CREATE OR REPLACE TABLE analytics\.claims_denorm AS\nSELECT/,
                'CREATE OR REPLACE TABLE analytics.claims_denorm\nCLUSTER BY client_key\nAS\nSELECT'
              );
            }
            break;
          case 'opt-2': // Optimize date partitioning
            if (platform === 'bigquery') {
              optimized = optimized.replace(
                /CREATE OR REPLACE TABLE analytics\.claims_denorm AS/,
                'CREATE OR REPLACE TABLE analytics.claims_denorm\nPARTITION BY DATE(claim_open_date)\nAS'
              );
            }
            break;
          case 'opt-3': // Add incremental merge logic
            // This is a more complex transformation, for now, just add a comment
            optimized = optimized + '\n-- TODO: Implement incremental MERGE logic for ' + optimization.title;
            break;
          case 'opt-4': // Add data quality checks
            // This is a more complex transformation, for now, just add a comment
            optimized = optimized + '\n-- TODO: Implement data quality checks for ' + optimization.title;
            break;
          case 'opt-5': // Improve code documentation
            optimized = optimized + '\n-- Improved code documentation: Added doc-blocks for columns';
            break;
          case 'opt-6': // Generate cost estimation
            optimized = `-- Estimated cost: [Calculated Cost Here]\n` + optimized;
            break;
          default:
            // Fallback for other simulated optimizations
            optimized = optimized + `\n-- Applied: ${optimization.title}`;
            break;
        }
      }
    });

setOptimizedCode(optimized);
    setIsOptimizing(false);
    onOpenChange(false); // Close the dialog after optimization
  };

  const handleApplyChanges = () => {
    onApplyOptimization(optimizedCode);
    onOpenChange(false);
  };

  const resetOptimizations = () => {
    setSelectedOptimizations([]);
    setOptimizedCode(code);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            AI Code Optimization
          </DialogTitle>
          <DialogDescription>
            Apply AI-powered optimizations to improve performance, readability, and best practices for {platform} code.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="optimizations" className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="comparison">Before/After</TabsTrigger>
          </TabsList>

          <TabsContent value="optimizations" className="h-full overflow-auto">
            <div className="space-y-4 pr-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Available Optimizations</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllOptimizations}
                    disabled={selectedOptimizations.length === mockCodeOptimizations.length}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deselectAllOptimizations}
                    disabled={selectedOptimizations.length === 0}
                  >
                    Deselect All
                  </Button>
                  <Badge variant="outline">
                    {selectedOptimizations.length} selected
                  </Badge>
                </div>
              </div>

              {mockCodeOptimizations.map((optimization) => {
                const Icon = optimizationIcons[optimization.type];
                const isSelected = selectedOptimizations.includes(optimization.id);

                return (
                  <Card
                    key={optimization.id}
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
                    }`}
                    onClick={() => toggleOptimization(optimization.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <CardTitle className="text-base">{optimization.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={impactColors[optimization.impact]}>
                            {optimization.impact} impact
                          </Badge>
                          {optimization.autoApplicable && (
                            <Badge variant="outline" className="text-xs">
                              Auto-apply
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription>{optimization.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-sm text-muted-foreground">
                        <strong>Suggestion:</strong> {optimization.suggestion}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <div className="flex items-center gap-4 pt-4">
                <Button
                  onClick={handleOptimizeCode}
                  disabled={selectedOptimizations.length === 0 || isOptimizing}
                  className="min-w-[120px]"
                >
                  {isOptimizing ? 'Optimizing...' : 'Apply Optimizations'}
                </Button>
                <Button variant="outline" onClick={resetOptimizations}>
                  Reset
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="h-full">
            <div className="h-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Optimized Code Preview</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {optimizedCode.split('\n').length} lines
                  </Badge>
                  <Badge variant="outline">
                    {Math.round(optimizedCode.length / 1024)}KB
                  </Badge>
                </div>
              </div>
              <div className="h-[400px] border rounded-md">
                <CodeEditor
                  code={optimizedCode || code}
                  language={platform === 'bigquery' ? 'sql' : platform === 'dbt' ? 'sql' : 'python'}
                  readOnly
                  height="400px"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="h-full">
            <div className="h-full space-y-4">
              <h3 className="text-lg font-semibold">Before vs After Comparison</h3>
              <div className="h-[400px] border rounded-md">
                <DiffEditor
                  key={open ? 'diff-editor-open' : 'diff-editor-closed'}
                  height="100%"
                  language={platform === 'bigquery' ? 'sql' : platform === 'dbt' ? 'sql' : 'python'}
                  original={originalCodeForComparison || code}
                  modified={optimizedCodeForComparison || optimizedCode || code}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    renderSideBySide: true, // Display side-by-side diff
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    folding: true,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedOptimizations.length > 0 && (
              <>Selected {selectedOptimizations.length} optimization{selectedOptimizations.length > 1 ? 's' : ''}</>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}