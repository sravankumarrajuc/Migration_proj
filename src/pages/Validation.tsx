import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useMigrationStore } from '@/store/migrationStore';
import { FileComparison } from '@/components/validation/FileComparison';
import { AnomalyDetection } from '@/components/validation/AnomalyDetection';
import { ValidationSummary } from '@/components/validation/ValidationSummary';
import { ReportGenerator } from '@/components/validation/ReportGenerator';
import { CompletionWorkflow } from '@/components/validation/CompletionWorkflow';

export function Validation() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, setCurrentPhase } = useMigrationStore();
  
  const [validationState, setValidationState] = useState({
    isProcessing: false,
    progress: 0,
    currentStep: '',
    filesCompared: 0,
    totalFiles: 0,
    anomaliesDetected: 0,
    tolerance: 0.01, // 1% tolerance
    completedAt: null as string | null,
  });

  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showCompletionWorkflow, setShowCompletionWorkflow] = useState(false);

  useEffect(() => {
    if (!currentProject) {
      navigate('/projects');
      return;
    }

    // Set current phase to validation only if not already set
    if (currentProject.progress.currentPhase !== 'validation') {
      setCurrentPhase('validation');
    }
  }, [currentProject, navigate]);

  const handleStartValidation = async () => {
    setValidationState(prev => ({
      ...prev,
      isProcessing: true,
      progress: 0,
      currentStep: 'Initializing validation process...',
    }));

    // Simulate validation steps
    const steps = [
      { step: 'Loading legacy data files...', duration: 1000 },
      { step: 'Loading migrated data files...', duration: 1000 },
      { step: 'Performing schema validation...', duration: 1500 },
      { step: 'Running data comparison analysis...', duration: 2000 },
      { step: 'Detecting anomalies and discrepancies...', duration: 1500 },
      { step: 'Generating validation summary...', duration: 1000 },
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setValidationState(prev => ({
        ...prev,
        currentStep: step.step,
        progress: Math.round(((i + 1) / steps.length) * 100),
      }));
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    // Complete validation
    setValidationState(prev => ({
      ...prev,
      isProcessing: false,
      progress: 100,
      currentStep: 'Validation complete',
      filesCompared: 24,
      totalFiles: 24,
      anomaliesDetected: 3,
      completedAt: new Date().toISOString(),
    }));
  };

  const handleCompleteProject = () => {
    setShowCompletionWorkflow(true);
  };

  if (!currentProject) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/codegen/${projectId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Code Generation
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Validation & QA</h1>
            <p className="text-muted-foreground">
              Compare legacy and migrated outputs to ensure data integrity
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={validationState.completedAt ? "default" : "secondary"}>
            {validationState.completedAt ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Validation Complete
              </>
            ) : (
              <>
                <FileText className="h-3 w-3 mr-1" />
                {validationState.isProcessing ? 'Validating' : 'Ready to Validate'}
              </>
            )}
          </Badge>
        </div>
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

      {/* Validation Progress */}
      {validationState.isProcessing && (
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
      )}

      {/* Validation Stats */}
      {validationState.completedAt && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{validationState.filesCompared}</p>
                  <p className="text-sm text-muted-foreground">Files Compared</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{validationState.anomaliesDetected}</p>
                  <p className="text-sm text-muted-foreground">Anomalies Detected</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">99.2%</p>
                  <p className="text-sm text-muted-foreground">Data Accuracy</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{(validationState.tolerance * 100).toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Tolerance Level</p>
                </div>
                <Badge variant="outline">Configured</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      {!validationState.completedAt ? (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Start Data Validation</h3>
                <p className="text-muted-foreground mb-4">
                  Compare your legacy and migrated data files to ensure accuracy and integrity
                </p>
                <Button
                  onClick={handleStartValidation}
                  disabled={validationState.isProcessing}
                  size="lg"
                >
                  {validationState.isProcessing ? 'Validating...' : 'Start Validation'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="comparison" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="comparison">File Comparison</TabsTrigger>
            <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
            <TabsTrigger value="summary">AI Summary</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comparison" className="space-y-6">
            <FileComparison tolerance={validationState.tolerance} />
          </TabsContent>
          
          <TabsContent value="anomalies" className="space-y-6">
            <AnomalyDetection anomalies={validationState.anomaliesDetected} />
          </TabsContent>
          
          <TabsContent value="summary" className="space-y-6">
            <ValidationSummary 
              filesCompared={validationState.filesCompared}
              anomaliesDetected={validationState.anomaliesDetected}
              accuracy={99.2}
            />
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-6">
            <ReportGenerator
              projectName={currentProject.name}
              validationStats={{
                filesCompared: validationState.filesCompared,
                anomaliesDetected: validationState.anomaliesDetected,
                accuracy: 99.2,
                tolerance: validationState.tolerance,
              }}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowReportGenerator(true)}
            disabled={!validationState.completedAt}
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button
            variant="outline"
            onClick={() => {/* Handle export */}}
            disabled={!validationState.completedAt}
          >
            <Upload className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>

        <Button
          onClick={handleCompleteProject}
          disabled={!validationState.completedAt}
          className="min-w-[200px]"
        >
          Complete Migration
        </Button>
      </div>

      {/* Completion Workflow Modal */}
      <CompletionWorkflow
        open={showCompletionWorkflow}
        onOpenChange={setShowCompletionWorkflow}
        project={currentProject}
        validationStats={{
          filesCompared: validationState.filesCompared,
          anomaliesDetected: validationState.anomaliesDetected,
          accuracy: 99.2,
          tolerance: validationState.tolerance,
        }}
      />
    </div>
  );
}