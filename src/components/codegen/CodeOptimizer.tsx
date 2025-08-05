import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
}

const optimizationIcons = {
  performance: Zap,
  'best-practice': CheckCircle,
  readability: Eye
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
  onApplyOptimization
}: CodeOptimizerProps) {
  const [selectedOptimizations, setSelectedOptimizations] = useState<string[]>([]);
  const [optimizedCode, setOptimizedCode] = useState(code);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const toggleOptimization = (optimizationId: string) => {
    setSelectedOptimizations(prev => 
      prev.includes(optimizationId)
        ? prev.filter(id => id !== optimizationId)
        : [...prev, optimizationId]
    );
  };

  const handleOptimizeCode = async () => {
    if (selectedOptimizations.length === 0) return;

    setIsOptimizing(true);
    
    // Simulate AI optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Apply optimizations to code (enhanced implementation)
    let optimized = code;
    
    selectedOptimizations.forEach(optId => {
      const optimization = mockCodeOptimizations.find(opt => opt.id === optId);
      if (optimization) {
        // Enhanced simulation of code optimization
        if (optimization.id === 'performance') {
          optimized = optimized.replace(/SELECT \*/g, 'SELECT column1, column2, column3');
          optimized = optimized + '\n-- Optimized for performance: Added specific column selection';
        } else if (optimization.id === 'readability') {
          optimized = optimized.replace(/,/g, ',\n  ');
          optimized = optimized + '\n-- Improved readability: Added proper formatting';
        } else if (optimization.id === 'security') {
          optimized = optimized + '\n-- Added security measures: Parameterized queries';
        } else if (optimization.id === 'maintainability') {
          optimized = optimized + '\n-- Enhanced maintainability: Added comments and documentation';
        }
      }
    });
    
    // Ensure we have meaningful optimized code
    if (optimized === code && selectedOptimizations.length > 0) {
      optimized = code + '\n-- Code optimized based on selected improvements';
    }

    setOptimizedCode(optimized);
    setIsOptimizing(false);
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            AI Code Optimization
          </DialogTitle>
          <DialogDescription>
            Apply AI-powered optimizations to improve performance, readability, and best practices for {platform} code.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="optimizations" className="h-[calc(90vh-120px)]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="comparison">Before/After</TabsTrigger>
          </TabsList>

          <TabsContent value="optimizations" className="h-full overflow-auto">
            <div className="space-y-4 pr-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Available Optimizations</h3>
                <Badge variant="outline">
                  {selectedOptimizations.length} selected
                </Badge>
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
              <div className="grid grid-cols-2 gap-4 h-[400px]">
                <div>
                  <h4 className="text-sm font-medium mb-2">Before</h4>
                  <div className="border rounded-md h-[350px]">
                    <CodeEditor
                      code={code}
                      language={platform === 'bigquery' ? 'sql' : platform === 'dbt' ? 'sql' : 'python'}
                      readOnly
                      height="350px"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">After</h4>
                  <div className="border rounded-md h-[350px]">
                    <CodeEditor
                      code={optimizedCode || code}
                      language={platform === 'bigquery' ? 'sql' : platform === 'dbt' ? 'sql' : 'python'}
                      readOnly
                      height="350px"
                    />
                  </div>
                </div>
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
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApplyChanges}
              disabled={optimizedCode === code}
            >
              Apply Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}