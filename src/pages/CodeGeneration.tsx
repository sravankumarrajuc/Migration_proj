import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw, Upload, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDropZone } from '@/components/upload/FileDropZone';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMigrationStore } from '@/store/migrationStore';
import { PlatformSelector } from '@/components/codegen/PlatformSelector';
import { CodeEditor } from '@/components/codegen/CodeEditor';
import { CodeOptimizer } from '@/components/codegen/CodeOptimizer';
import { ExportOptions } from '@/components/codegen/ExportOptions';
import { mockGeneratedCodes, mockCodeGenSteps, mockCodeOptimizations } from '@/data/mockCodeGeneration';
import { CodePlatform, Project, SchemaFile } from '@/types/migration';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getCompletedProjects } from '@/data/mockProjects';

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
    setCurrentPhase,
    setOriginalCodeForComparison,
    setOptimizedCodeForComparison,
    setCurrentProject
  } = useMigrationStore();

  const [showOptimizer, setShowOptimizer] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | undefined>(projectId);
  const [selectedProjectName, setSelectedProjectName] = useState<string | null>(null);
  const [sourceFiles, setSourceFiles] = useState<SchemaFile[]>([]);
  const [targetFiles, setTargetFiles] = useState<SchemaFile[]>([]);
  const [sourceFileUploaded, setSourceFileUploaded] = useState(false);
  const [targetFileUploaded, setTargetFileUploaded] = useState(false);
  const [codeGenerated, setCodeGenerated] = useState(false);

  const currentCode = codeGenerationState.generatedCodes[codeGenerationState.selectedPlatform];
  const isGenerating = codeGenerationState.isProcessing;
  const progress = codeGenerationState.progress;

  useEffect(() => {
    if (showOptimizer && currentCode) {
      // Automatically select opt-1 and apply optimization for debugging
      // This simulates clicking the "Optimize" button and selecting opt-1
      // In a real scenario, this would be triggered by user interaction
      const optimizationId = 'opt-1'; // Corresponds to "Add clustering keys for BigQuery"
      const optimization = mockCodeOptimizations.find(opt => opt.id === optimizationId);
      console.log('Applying optimization:', optimization);
      if (optimization) {
        // Simulate selecting the optimization
        // This part is tricky as CodeOptimizer manages its own selectedOptimizations state.
        // For now, we'll directly call handleOptimizeCode with the assumption that opt-1 is applied.
        // A more robust solution would involve exposing a method from CodeOptimizer or
        // managing selectedOptimizations in the parent component.
        // For debugging, we'll assume the optimization is applied if the modal is open and code exists.
        // This is a temporary measure to get the console logs.
        // In a real app, you'd trigger the optimization via user interaction.
        // For now, we'll just ensure the original and optimized codes are set in the store.
        const optimized = currentCode.content.replace(
          /CREATE OR REPLACE TABLE analytics\.claims_denorm AS\nSELECT/,
          'CREATE OR REPLACE TABLE analytics.claims_denorm\nCLUSTER BY client_key\nAS\nSELECT'
        );
        setOriginalCodeForComparison(currentCode.content);
        setOptimizedCodeForComparison(optimized);
      }
    }
  }, [showOptimizer, currentCode, setOriginalCodeForComparison, setOptimizedCodeForComparison]);

  useEffect(() => {
    setCompletedProjects(getCompletedProjects().filter(p => p.status === 'completed'));
  }, []);

  const handleSourceFilesAdded = useCallback((acceptedFiles: File[]) => {
    const newFiles: SchemaFile[] = acceptedFiles.map(file => ({
      id: `${file.name}-${Date.now()}`, // Simple unique ID
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      status: 'completed', // Assuming immediate completion for now
      dialect: 'custom-json', // Placeholder, adjust as needed
    }));
    setSourceFiles(prev => {
      const updatedFiles = [...prev, ...newFiles];
      setSourceFileUploaded(updatedFiles.length > 0);
      return updatedFiles;
    });
  }, []);

  const handleTargetFilesAdded = useCallback((acceptedFiles: File[]) => {
    const newFiles: SchemaFile[] = acceptedFiles.map(file => ({
      id: `${file.name}-${Date.now()}`, // Simple unique ID
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      status: 'completed', // Assuming immediate completion for now
      dialect: 'custom-json', // Placeholder, adjust as needed
    }));
    setTargetFiles(prev => {
      const updatedFiles = [...prev, ...newFiles];
      setTargetFileUploaded(updatedFiles.length > 0);
      return updatedFiles;
    });
  }, []);

  const handleSourceFileRemove = useCallback((fileId: string) => {
    setSourceFiles(prev => {
      const updatedFiles = prev.filter(file => file.id !== fileId);
      setSourceFileUploaded(updatedFiles.length > 0);
      return updatedFiles;
    });
  }, []);

  const handleTargetFileRemove = useCallback((fileId: string) => {
    setTargetFiles(prev => {
      const updatedFiles = prev.filter(file => file.id !== fileId);
      setTargetFileUploaded(updatedFiles.length > 0);
      return updatedFiles;
    });
  }, []);

  const handleGenerateCode = useCallback(async (platform: CodePlatform) => {
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
  }, [startCodeGeneration, setGeneratedCode, completeCodeGeneration, codeGenerationState.completedAt]); // Removed codeGenerationState.isProcessing as it's not a direct dependency for the function itself.

  useEffect(() => {
    // If there's a projectId in the URL, try to load it
    if (projectId) {
      if (!currentProject || currentProject.id !== projectId) {
        const projectFromUrl = completedProjects.find(p => p.id === projectId);
        if (projectFromUrl) {
          setCurrentProject(projectFromUrl);
          setSelectedProject(projectId);
          setSelectedProjectName(projectFromUrl.name);
        } else {
          // If projectId in URL is invalid, navigate to projects or a default state
          setCurrentProject(null);
          setSelectedProject(undefined);
          setSelectedProjectName(null);
        }
      }
    } else if (selectedProject) {
      // If no projectId in URL, but a project is selected in dropdown (e.g., from previous session)
      if (!currentProject || currentProject.id !== selectedProject) {
        const projectToLoad = completedProjects.find(p => p.id === selectedProject);
        if (projectToLoad) {
          setCurrentProject(projectToLoad);
          setSelectedProjectName(projectToLoad.name);
        } else {
          // If selected project is invalid, clear selection and navigate to projects
          setSelectedProject(undefined);
          setCurrentProject(null);
          setSelectedProjectName(null);
        }
      }
    } else if (completedProjects.length > 0) {
      // If no project in URL and no selected project, but there are completed projects,
      // default to the first completed project and navigate to its URL.
      const firstCompletedProject = completedProjects[0];
      setCurrentProject(firstCompletedProject);
      setSelectedProject(firstCompletedProject.id);
      setSelectedProjectName(firstCompletedProject.name);
    } else {
      // If no projects at all, ensure currentProject is null
      setCurrentProject(null);
      setSelectedProjectName(null);
    }

    // Set current phase to codegen only if not already set and a project is loaded
    if (currentProject && currentProject.progress.currentPhase !== 'codegen') {
      setCurrentPhase('codegen');
    }

    // Auto-generate code for first platform if not already generated and a project is loaded
    if (currentProject && !codeGenerationState.completedAt && !codeGenerationState.isProcessing && !codeGenerated) {
      // handleGenerateCode(codeGenerationState.selectedPlatform); // This will now be triggered by the button
    }
  }, [currentProject, navigate, projectId, selectedProject, completedProjects, setCurrentProject, setSelectedProject, setCurrentPhase, codeGenerationState.completedAt, codeGenerationState.isProcessing, codeGenerated]);


  const handlePlatformChange = (platform: CodePlatform) => {
    setSelectedPlatform(platform);
    
    // Generate code for new platform if not already generated
    if (!codeGenerationState.generatedCodes[platform] && codeGenerated) { // Only generate if code was already generated once
      handleGenerateCode(platform);
    }
  };

  const handleGenerateCodeClick = useCallback(async () => {
    startCodeGeneration(`Generating ${codeGenerationState.selectedPlatform} code...`);
    
    // Simulate AI code generation with progress
    for (let i = 0; i < mockCodeGenSteps.length; i++) {
      const step = mockCodeGenSteps[i];
      startCodeGeneration(step.step);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    // Set the generated code for the platform
    setGeneratedCode(codeGenerationState.selectedPlatform, mockGeneratedCodes[codeGenerationState.selectedPlatform]);
    
    // Mark as complete if this is the first generation
    if (!codeGenerationState.completedAt) {
      completeCodeGeneration();
    }
    setCodeGenerated(true); // Set codeGenerated to true after generation
  }, [startCodeGeneration, setGeneratedCode, completeCodeGeneration, codeGenerationState.completedAt, codeGenerationState.selectedPlatform]);

  const handleRegenerateCode = () => {
    handleGenerateCodeClick(); // Use the new handler
  };

  const handleProceedToMapping = () => {
    navigate(`/mapping/${projectId}`);
  };


  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-foreground">ETL Code Generation</h1>
            </div>

            {/* Project Selection Dropdown */}
            <div className="mb-6">
              <Select value={selectedProject} onValueChange={(value) => {
                setSelectedProject(value);
                const project = completedProjects.find(p => p.id === value);
                if (project) {
                  setCurrentProject(project); // Set current project in store
                  setSelectedProjectName(project.name);
                  navigate(`/code-generation/${value}`);
                } else {
                  setCurrentProject(null);
                  setSelectedProjectName(null);
                  navigate(`/code-generation`);
                }
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Completed Migration Project" />
                </SelectTrigger>
                <SelectContent>
                  {completedProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProjectName && currentProject && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Selected Project: <span className="font-medium text-foreground">{selectedProjectName}</span>
                  <br />
                  Migration: {currentProject.sourceDialect.toUpperCase()} → {currentProject.targetDialect.toUpperCase()}
                </div>
              )}
            </div>

            {selectedProject && (
              <>
                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Upload Source SQL File</CardTitle>
                      <CardDescription>Drag and drop your source .sql file here, or click to select.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FileDropZone
                        onFilesAdded={handleSourceFilesAdded}
                        onFileRemove={handleSourceFileRemove}
                        files={sourceFiles}
                        title="Source SQL File"
                        description="Drag and drop your source .sql file here, or click to select."
                        accept=".sql"
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Upload Target SQL File</CardTitle>
                      <CardDescription>Drag and drop your target .sql file here, or click to select.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FileDropZone
                        onFilesAdded={handleTargetFilesAdded}
                        onFileRemove={handleTargetFileRemove}
                        files={targetFiles}
                        title="Target SQL File"
                        description="Drag and drop your target .sql file here, or click to select."
                        accept=".sql"
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={handleGenerateCodeClick}
                    disabled={!sourceFileUploaded || !targetFileUploaded || codeGenerated}
                    className="min-w-[200px]"
                  >
                    {codeGenerated ? 'Code Generated' : 'Generate Code'}
                  </Button>
                </div>
    
                {codeGenerated && (
                  <>
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
                        onClick={handleProceedToMapping}
                        disabled={!canProceedToNextPhase()}
                        className="min-w-[200px]"
                      >
                        Proceed to Mapping
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}

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
              setOriginalCodeForComparison(currentCode.content);
              setOptimizedCodeForComparison(optimizedCode);
            }
          }}
          originalCodeForComparison={codeGenerationState.originalCodeForComparison || ''}
          optimizedCodeForComparison={codeGenerationState.optimizedCodeForComparison || ''}
        />

        <ExportOptions
          open={showExportOptions}
          onOpenChange={setShowExportOptions}
          generatedCodes={codeGenerationState.generatedCodes}
          projectName={currentProject?.name || 'Unknown Project'}
        />
      </div>
    </ErrorBoundary>
  );
}