import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw, Upload, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useMigrationStore } from '@/store/migrationStore';
import { PlatformSelector } from '@/components/codegen/PlatformSelector';
import { CodeEditor } from '@/components/codegen/CodeEditor';
import { CodeOptimizer } from '@/components/codegen/CodeOptimizer';
import { ExportOptions } from '@/components/codegen/ExportOptions';
import { mockGeneratedCodes, mockCodeGenSteps } from '@/data/mockCodeGeneration';
import { CodePlatform } from '@/types/migration';

export function CodeGeneration() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { 
    currentProject, 
    codeGenerationState,
    startCodeGeneration,
    setSelectedPlatform,
    setGeneratedCode,
    completeCodeGeneration,
    canProceedToNextPhase,
    setCurrentPhase
  } = useMigrationStore();

  const [showOptimizer, setShowOptimizer] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  useEffect(() => {
    if (!currentProject) {
      navigate('/projects');
      return;
    }

    // Set current phase to codegen only if not already set
    if (currentProject.progress.currentPhase !== 'codegen') {
      setCurrentPhase('codegen');
    }

    // Auto-generate code for first platform if not already generated
    if (!codeGenerationState.completedAt && !codeGenerationState.isProcessing) {
      handleGenerateCode(codeGenerationState.selectedPlatform);
    }
  }, [currentProject, navigate]);

  const handleGenerateCode = async (platform: CodePlatform) => {
    startCodeGeneration(`Generating ${platform} code...`);
    
    // Simulate AI code generation with progress
    for (let i = 0; i < mockCodeGenSteps.length; i++) {
      const step = mockCodeGenSteps[i];
      startCodeGeneration(step.step);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    // Set the generated code for the platform
    setGeneratedCode(platform, mockGeneratedCodes[platform]);
    
    // Mark as complete if this is the first generation
    if (!codeGenerationState.completedAt) {
      completeCodeGeneration();
    }
  };

  const handlePlatformChange = (platform: CodePlatform) => {
    setSelectedPlatform(platform);
    
    // Generate code for new platform if not already generated
    if (!codeGenerationState.generatedCodes[platform]) {
      handleGenerateCode(platform);
    }
  };

  const handleRegenerateCode = () => {
    handleGenerateCode(codeGenerationState.selectedPlatform);
  };

  const handleProceedToValidation = () => {
    navigate(`/validation/${projectId}`);
  };

  const currentCode = codeGenerationState.generatedCodes[codeGenerationState.selectedPlatform];
  const isGenerating = codeGenerationState.isProcessing;
  const progress = codeGenerationState.progress;

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
            onClick={() => navigate(`/mapping/${projectId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mapping
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">ETL Code Generation</h1>
            <p className="text-muted-foreground">
              Generate production-ready ETL code from your field mappings
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={codeGenerationState.completedAt ? "default" : "secondary"}>
            {codeGenerationState.completedAt ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Code Generated
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" />
                In Progress
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
            {currentProject.sourceDialect.toUpperCase()} → {currentProject.targetDialect.toUpperCase()} migration
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Generation Progress */}
      {isGenerating && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{codeGenerationState.currentStep}</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Selection */}
      <div className="mb-6">
        <PlatformSelector
          selectedPlatform={codeGenerationState.selectedPlatform}
          onPlatformChange={handlePlatformChange}
          generatedCodes={codeGenerationState.generatedCodes}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Code Editor - Main Column */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">Generated Code</CardTitle>
                <CardDescription>
                  {currentCode ? `${currentCode.fileName} • ${Math.round(currentCode.size / 1024)}KB` : 'No code generated yet'}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateCode}
                  disabled={isGenerating}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOptimizer(true)}
                  disabled={!currentCode}
                >
                  Optimize
                </Button>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <CodeEditor
                code={currentCode?.content || '// Generating code...'}
                language={currentCode?.language || 'sql'}
                readOnly={isGenerating}
                height="500px"
              />
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Code Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Code Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentCode ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">File Size:</span>
                    <span>{Math.round(currentCode.size / 1024)}KB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lines:</span>
                    <span>{currentCode.content.split('\n').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Generated:</span>
                    <span>{new Date(currentCode.lastGenerated).toLocaleDateString()}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Code statistics will appear here after generation
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowExportOptions(true)}
                disabled={!currentCode}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowExportOptions(true)}
                disabled={!currentCode}
              >
                <Upload className="h-4 w-4 mr-2" />
                Export to GitHub
              </Button>
            </CardContent>
          </Card>

          {/* Platform Generated Codes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generated Platforms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(codeGenerationState.generatedCodes).map(([platform, code]) => (
                <div key={platform} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{platform}</span>
                  {code ? (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ready
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowOptimizer(true)}
            disabled={!currentCode}
          >
            AI Optimization
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowExportOptions(true)}
            disabled={!currentCode}
          >
            Export Options
          </Button>
        </div>

        <Button
          onClick={handleProceedToValidation}
          disabled={!canProceedToNextPhase()}
          className="min-w-[200px]"
        >
          Proceed to Validation
        </Button>
      </div>

      {/* Modals */}
      <CodeOptimizer
        open={showOptimizer}
        onOpenChange={setShowOptimizer}
        platform={codeGenerationState.selectedPlatform}
        code={currentCode?.content || ''}
        onApplyOptimization={(optimizedCode) => {
          if (currentCode) {
            setGeneratedCode(codeGenerationState.selectedPlatform, {
              ...currentCode,
              content: optimizedCode,
              lastGenerated: new Date().toISOString()
            });
          }
        }}
      />

      <ExportOptions
        open={showExportOptions}
        onOpenChange={setShowExportOptions}
        generatedCodes={codeGenerationState.generatedCodes}
        projectName={currentProject.name}
      />
    </div>
  );
}