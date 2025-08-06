import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Node } from '@xyflow/react'; // Import Node
import { TableNode, TableNodeData } from '@/types/migration'; // Import TableNodeData
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useMigrationStore } from '@/store/migrationStore';
import { LineageGraph } from '@/components/discovery/LineageGraph';
import { MetadataCatalog } from '@/components/discovery/MetadataCatalog';
import { SourceToSourceLineageGraph } from '@/components/discovery/SourceToSourceLineageGraph';
import { mockLineageGraph, discoverySteps } from '@/data/mockLineageData';
import { ArrowRight, Database, GitBranch, BarChart3, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Discovery() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    discoveryState,
    startDiscovery,
    updateDiscoveryProgress,
    setLineageGraph,
    completeDiscovery,
    canProceedToNextPhase,
    setCurrentPhase
  } = useMigrationStore();
  
  const [activeTab, setActiveTab] = useState('overview');

  const handleNodesPositionsChange = useCallback((updatedNodes: Node<TableNodeData>[]) => { // Correct Node type
    if (!discoveryState.lineageGraph) return;

    const newTables = discoveryState.lineageGraph.tables.map(table => {
      const updatedNode = updatedNodes.find(node => node.id === table.id);
      if (updatedNode && updatedNode.position) { // Now 'position' should be recognized
        return {
          ...table,
          position: updatedNode.position,
        };
      }
      return table;
    });

    setLineageGraph({
      ...discoveryState.lineageGraph,
      tables: newTables,
    });
  }, [discoveryState.lineageGraph, setLineageGraph]);

  useEffect(() => {
    // Set current phase to discovery
    setCurrentPhase('discovery');
    
    // Auto-start discovery if not already started
    if (!discoveryState.isProcessing && !discoveryState.completedAt) {
      setTimeout(() => {
        runDiscovery();
      }, 1000);
    }
  }, [setCurrentPhase]);

  const runDiscovery = async () => {
    startDiscovery();
    
    let currentProgress = 0;
    const totalSteps = discoverySteps.length;
    
    for (let i = 0; i < totalSteps; i++) {
      const step = discoverySteps[i];
      updateDiscoveryProgress(currentProgress, step.step);
      
      await new Promise(resolve => setTimeout(resolve, step.duration));
      
      currentProgress = Math.round(((i + 1) / totalSteps) * 100);
      
      // Set lineage graph at 80% completion
      if (currentProgress >= 80) {
        setLineageGraph(mockLineageGraph);
      }
    }
    
    // Ensure lineage graph is set before completing
    if (!discoveryState.lineageGraph) {
      setLineageGraph(mockLineageGraph);
    }
    
    completeDiscovery();
    toast.success('Schema discovery completed successfully!');
  };

  const handleProceedToMapping = () => {
    setCurrentPhase('mapping');
    navigate(`/mapping/${projectId}`);
  };

  const isComplete = discoveryState.completedAt !== null;
  const canProceed = canProceedToNextPhase();

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schema Discovery & Lineage</h1>
          <p className="text-muted-foreground mt-2">
            Analyze data relationships and build comprehensive lineage mapping
          </p>
        </div>
        
        {isComplete && (
          <Button 
            onClick={handleProceedToMapping}
            disabled={!canProceed}
            className="gap-2"
          >
            Proceed to Mapping
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Progress Card */}
      {(discoveryState.isProcessing || !isComplete) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Discovery Progress
            </CardTitle>
            <CardDescription>
              {discoveryState.currentStep || 'Preparing to analyze schemas...'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={discoveryState.progress} className="w-full" />
            <div className="text-sm text-muted-foreground">
              {discoveryState.progress}% complete
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {isComplete && discoveryState.lineageGraph && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="lineage" className="gap-2">
              <GitBranch className="h-4 w-4" />
              Lineage Graph
            </TabsTrigger>
            <TabsTrigger value="catalog" className="gap-2">
              <Database className="h-4 w-4" />
              Metadata Catalog
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{discoveryState.lineageGraph.statistics.totalTables}</div>
                  <p className="text-xs text-muted-foreground">
                    {discoveryState.lineageGraph.tables.filter(t => t.type === 'source').length} source, {' '}
                    {discoveryState.lineageGraph.tables.filter(t => t.type === 'target').length} target
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Columns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{discoveryState.lineageGraph.statistics.totalColumns}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all tables
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Relationships</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{discoveryState.lineageGraph.statistics.totalRelationships}</div>
                  <p className="text-xs text-muted-foreground">
                    Data dependencies identified
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Complexity Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{discoveryState.lineageGraph.statistics.complexityScore}/10</div>
                  <Badge variant="secondary" className="mt-1">
                    Moderate
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Discovery Complete
                </CardTitle>
                <CardDescription>
                  Schema analysis completed successfully. Review the lineage graph and metadata catalog before proceeding to field mapping.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Schemas Analyzed</span>
                    <Badge variant="outline">2 sources, 1 target</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Analysis Quality</span>
                    <Badge variant="outline">High Confidence</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Completed At</span>
                    <span className="text-muted-foreground">
                      {new Date(discoveryState.completedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="lineage">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Lineage Graph</CardTitle>
                <CardDescription>
                  Explore data relationships between source and target schemas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineageGraph
                  lineageGraph={discoveryState.lineageGraph}
                  onNodesPositionsChange={handleNodesPositionsChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="catalog">
            <Card>
              <CardHeader>
                <CardTitle>Metadata Catalog</CardTitle>
                <CardDescription>
                  Browse and search discovered tables and columns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MetadataCatalog lineageGraph={discoveryState.lineageGraph} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}