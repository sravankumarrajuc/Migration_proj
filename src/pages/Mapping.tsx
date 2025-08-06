import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMigrationStore } from '@/store/migrationStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Badge } from '@/components/ui/badge';
import { SourceSchemaPanel } from '@/components/mapping/SourceSchemaPanel';
import { TargetSchemaPanel } from '@/components/mapping/TargetSchemaPanel';
import { MappingCanvas } from '@/components/mapping/MappingCanvas';
import { AISuggestionsPanel } from '@/components/mapping/AISuggestionsPanel';
import { MappingReview } from '@/components/mapping/MappingReview';
import { mockTableMappings } from '@/data/mockMappingData';
import { Loader2, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export function Mapping() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    currentProject,
    currentPhase,
    setCurrentPhase,
    mappingState,
    discoveryState,
    startMapping,
    updateMappingProgress,
    setTableMapping,
    generateAISuggestions,
    acceptMapping,
    completeMapping,
    canProceedToNextPhase,
  } = useMigrationStore();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [filterMappings, setFilterMappings] = useState(true); // Controls filtering for MappingCanvas and AISuggestionsPanel

  useEffect(() => {
    if (currentPhase !== 'mapping') {
      setCurrentPhase('mapping');
    }
  }, [currentPhase, setCurrentPhase]);

  useEffect(() => {
    // Initialize with mock data if available
    const filteredMockTableMappings = mockTableMappings.filter(m => m.completionPercentage >= 90);

    if (filteredMockTableMappings.length > 0 && mappingState.allMappings.length === 0) {
      // Add all mock mappings to the store
      filteredMockTableMappings.forEach(mapping => {
        setTableMapping(mapping);
      });
      
    }
  }, [mappingState.allMappings.length, setTableMapping]);

  const handleGenerateAISuggestions = async () => {

    startMapping();
    setShowSuggestions(true);
    setFilterMappings(false); // Show all mappings and suggestions after generating

    // Simulate AI processing
    const steps = [
      'Analyzing source schema...',
      'Analyzing target schema...',
      'Computing field similarities...',
      'Generating AI suggestions...',
      'Calculating confidence scores...',
      'Mapping generation complete!',
    ];

    for (let i = 0; i < steps.length; i++) {
      updateMappingProgress((i + 1) * (100 / steps.length), steps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    generateAISuggestions();
    completeMapping(); // Mark mapping as complete after suggestions are generated
  };


  const handleProceedToCodeGeneration = () => {
    console.log('Proceeding to code generation...');
    
    // Auto-approve any remaining high-confidence suggestions
    mappingState.suggestions.forEach(suggestion => {
      if ((suggestion.status === undefined || suggestion.status === 'suggested') && suggestion.confidence >= 80) {
        console.log('Auto-approving suggestion:', suggestion.id);
        acceptMapping(suggestion.id);
      }
    });
    
    // Complete mapping phase
    completeMapping();
    
    // Navigate to code generation
    navigate(`/codegen/${projectId}`);
  };

  const filteredTableMappings = mockTableMappings.filter(m => m.completionPercentage >= 90);

  const availableTablePairs = filteredTableMappings.map(m => ({
    source: m.sourceTableId,
    target: m.targetTableId,
    label: `${m.sourceTableId} → ${m.targetTableId}`
  }));

  const overallProgress = filteredTableMappings.reduce((sum, m) => sum + m.completionPercentage, 0) / filteredTableMappings.length;

  if (!currentProject || !discoveryState.lineageGraph) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Discovery Required</h3>
            <p className="text-muted-foreground mb-4">
              Please complete the discovery phase before proceeding to field mapping.
            </p>
            <Button onClick={() => navigate(`/discovery/${projectId}`)}>
              Go to Discovery
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Field Mapping</h1>
              <p className="text-muted-foreground">
                Map source fields to target schema with AI assistance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleGenerateAISuggestions}
                disabled={mappingState.isProcessing || !mappingState.selectedSourceTable}
                variant="outline"
                className="gap-2"
              >
                {mappingState.isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Generate AI Suggestions
              </Button>
              <Button
                onClick={() => setShowReview(!showReview)}
                variant="outline"
              >
                {showReview ? 'Hide Review' : 'Show Review'}
              </Button>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {Math.round(overallProgress)}% Complete
                </Badge>
                <Button
                  onClick={handleProceedToCodeGeneration}
                  disabled={!canProceedToNextPhase()}
                  className="gap-2"
                >
                  Proceed to Code Generation
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>


          {/* Progress */}
          {mappingState.isProcessing && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{mappingState.currentStep}</span>
                <span className="text-sm text-muted-foreground">{Math.round(mappingState.progress)}%</span>
              </div>
              <Progress value={mappingState.progress} className="h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {showReview ? (
          <div className="h-full p-4">
            <MappingReview />
          </div>
        ) : (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Source Schema Panel */}
            <ResizablePanel defaultSize={30} minSize={25}>
              <SourceSchemaPanel />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Mapping Canvas */}
            <ResizablePanel defaultSize={40} minSize={30}>
              <MappingCanvas tableMappings={filteredTableMappings} minCompleteness={90} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Target Schema / AI Suggestions Panel */}
            <ResizablePanel defaultSize={30} minSize={25}>
              {showSuggestions ? (
                <AISuggestionsPanel
                  onClose={() => setShowSuggestions(false)}
                  minCompleteness={filterMappings ? 90 : 0} // Pass filter prop
                />
              ) : (
                <TargetSchemaPanel />
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}