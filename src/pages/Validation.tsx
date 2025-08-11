import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMigrationStore } from '@/store/migrationStore';
import { SchemaComparisonTable } from '@/components/validation/SchemaComparisonTable';
import { generateMappingReportExcel, previewMappingReportData } from '@/utils/excelExport';
import { useToast } from '@/hooks/use-toast';

export function Validation() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, setCurrentPhase, completeProject, mappingState, initializeMappingDataForValidation } = useMigrationStore();
  const { toast } = useToast();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Set current phase to validation only if not already set
  useEffect(() => {
    if (currentProject && currentProject.progress.currentPhase !== 'validation') {
      setCurrentPhase('validation');
    }
  }, [currentProject, setCurrentPhase]);

  // Initialize mapping data for validation if not already present
  useEffect(() => {
    initializeMappingDataForValidation();
  }, [initializeMappingDataForValidation]);

  const handleCompleteMigration = () => {
    completeProject();
    alert('Mapping completed successfully!');
    navigate('/projects'); // Or wherever you want to redirect after completion
  };

  const handleGenerateReport = async () => {
    try {
      setIsGeneratingReport(true);
      
      // Get mapping data from the store
      const tableMappings = mappingState.allMappings;
      
      if (!tableMappings || tableMappings.length === 0) {
        toast({
          title: "No Mapping Data",
          description: "No mapping data available to generate report. Please complete the mapping phase first.",
          variant: "destructive",
        });
        return;
      }

      // Preview the data to show summary
      const { data, summary } = previewMappingReportData(tableMappings);
      
      if (data.length === 0) {
        toast({
          title: "No Mapping Data",
          description: "No field mappings found to export.",
          variant: "destructive",
        });
        return;
      }

      // Generate and download the Excel file
      const projectName = currentProject?.name || 'Migration Project';
      generateMappingReportExcel(tableMappings, projectName);
      
      toast({
        title: "Report Generated Successfully",
        description: `Excel report with ${summary.totalMappings} mappings has been downloaded. Average confidence: ${summary.averageConfidence}%`,
      });
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Report Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred while generating the report.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReport(false);
    }
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
                Compare legacy and mapping outputs to ensure data integrity
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

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
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
              Complete Mapping
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