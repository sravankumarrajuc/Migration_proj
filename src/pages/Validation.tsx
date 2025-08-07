import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMigrationStore } from '@/store/migrationStore';
import { SchemaComparisonTable } from '@/components/validation/SchemaComparisonTable';

export function Validation() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, setCurrentPhase, completeProject } = useMigrationStore();

  // Set current phase to validation only if not already set
  useEffect(() => {
    if (currentProject && currentProject.progress.currentPhase !== 'validation') {
      setCurrentPhase('validation');
    }
  }, [currentProject, setCurrentPhase]);

  const handleCompleteMigration = () => {
    completeProject();
    alert('Migration completed successfully!');
    navigate('/projects'); // Or wherever you want to redirect after completion
  };


  if (!currentProject) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/mapping/${projectId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Field Mapping
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Validation & QA</h1>
              <p className="text-muted-foreground">
                Compare legacy and migrated outputs to ensure data integrity
              </p>
            </div>
          </div>
          
          {/* Placeholder for Validation Status Badge */}
          {/* <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <FileText className="h-3 w-3 mr-1" />
              Ready to Validate
            </Badge>
          </div> */}
        </div>

        {/* Project Context */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{currentProject.name}</CardTitle>
            <CardDescription>
              {currentProject.sourceDialect.toUpperCase()} → {currentProject.targetDialect.toUpperCase()} migration validation
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Validation Progress (Commented out as per instructions) */}
        {/* {validationState.isProcessing && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{validationState.currentStep}</span>
                  <span className="text-sm text-muted-foreground">{validationState.progress}%</span>
                </div>
                <Progress value={validationState.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Validation Placeholder Content */}
        <div className="space-y-6">
          {/* Header Cards Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Tables Compared</CardDescription>
                <CardTitle className="text-2xl">10 source vs 5 target</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Columns Compared</CardDescription>
                <CardTitle className="text-2xl">190 vs 147</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Schema Accuracy</CardDescription>
                <CardTitle className="text-2xl">78 %</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Action Buttons (Keep as is, but disable if needed based on placeholder state) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => alert('Generate Report functionality is a placeholder.')}
                disabled={true} // Disable since validation is placeholder
              >
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button
                variant="outline"
                onClick={() => alert('Export Results functionality is a placeholder.')}
                disabled={true} // Disable since validation is placeholder
              >
                <Upload className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
  
            <Button
              onClick={handleCompleteMigration}
              disabled={false} // Always enabled as per user's request to hide comparison
              className="min-w-[200px]"
            >
              Complete Migration
            </Button>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Schema Comparison</h2>
            <SchemaComparisonTable />
          </div>

          {/* Completion Workflow Modal (Keep, but it will be disabled by the button above) */}
          {/* <CompletionWorkflow
            open={showCompletionWorkflow}
            onOpenChange={setShowCompletionWorkflow}
            project={currentProject}
            validationStats={{
              filesCompared: validationState.filesCompared,
              anomaliesDetected: validationState.anomaliesDetected,
              accuracy: 99.2,
              tolerance: validationState.tolerance,
            }}
          /> */}
        </div>
      </div>
    </>
  );
}