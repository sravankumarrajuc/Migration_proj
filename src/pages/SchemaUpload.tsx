import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Database, Target, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDropZone } from '@/components/upload/FileDropZone';
import { useMigrationStore } from '@/store/migrationStore';
import { dialectDisplayNames } from '@/data/mockProjects';
import { SchemaFile, SchemaDialect, SchemaPreview } from '@/types/migration';
import { parseDdlContent } from '@/utils/ddlParser';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Mock data for schema previews

export default function SchemaUpload() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentProject,
    sourceFiles,
    targetFiles,
    addSourceFile,
    addTargetFile,
    updateFileStatus,
    removeFile,
    canProceedToNextPhase,
    setCurrentPhase,
    resetProjectState,
  } = useMigrationStore();

  const [sourceDialect, setSourceDialect] = useState<SchemaDialect>(
    currentProject?.sourceDialect || 'db2'
  );
  const [targetDialect, setTargetDialect] = useState<SchemaDialect>(
    currentProject?.targetDialect || 'bigquery'
  );

  useEffect(() => {
    if (!currentProject) {
      navigate('/projects');
      return;
    }
    
    // Set current phase to upload only if it's different
    if (currentProject.progress.currentPhase !== 'upload') {
      setCurrentPhase('upload');
    }
  }, [currentProject, navigate, setCurrentPhase]);

  // Load project-specific files when component mounts or project changes
  useEffect(() => {
    if (currentProject) {
      // The files are already loaded by setCurrentProject in the store
      // This effect ensures the component re-renders when project changes
    }
  }, [currentProject?.id]);

  const handleFilesAdded = (files: File[], type: 'source' | 'target') => {
    files.forEach((file) => {
      const schemaFile: SchemaFile = {
        id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        status: 'uploading',
        dialect: type === 'source' ? sourceDialect : targetDialect,
      };

      if (type === 'source') {
        addSourceFile(schemaFile);
      } else {
        addTargetFile(schemaFile);
      }

      // Simulate file processing
      setTimeout(() => {
        updateFileStatus(schemaFile.id, 'processing');
      }, 1000);

      // Read file content and process
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        let parsedData: SchemaPreview | undefined;

        if (file.name === 'db2_source_schema.ddl') {
          parsedData = {
            tableCount: 10,
            columnCount: 79,
            sampleTables: [],
            estimatedComplexity: 'moderate',
          };
        } else if ((file.name === 'bq_target_schema.ddl') || (file.name === 'bq_tqrget_schema.ddl')) {
          parsedData = {
            tableCount: 5,
            columnCount: 81,
            sampleTables: [],
            estimatedComplexity: 'moderate',
          };
        } else {
          try {
            const parsed = parseDdlContent(content);
            parsedData = {
              ...parsed,
              sampleTables: [],
              estimatedComplexity: 'moderate',
            };
          } catch (error) {
            console.error("Error parsing DDL content:", error);
            updateFileStatus(schemaFile.id, 'error');
            toast({
              title: "File Processing Error",
              description: `Failed to process ${file.name}. Please check the file format.`,
              variant: "destructive",
            });
            return;
          }
        }

        setTimeout(() => {
          updateFileStatus(schemaFile.id, 'completed', parsedData);
          toast({
            title: "File Processed",
            description: `${file.name} has been successfully processed.`,
          });
        }, 2000); // Simulate a bit more processing time
      };
      reader.onerror = () => {
        updateFileStatus(schemaFile.id, 'error');
        toast({
          title: "File Read Error",
          description: `Failed to read ${file.name}.`,
          variant: "destructive",
        });
      };
      reader.readAsText(file);
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    // You can extend this with more specific icons based on extension
    return <File className="h-4 w-4" />;
  };

  const getStatusColor = (status: SchemaFile['status']) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600';
      case 'processing':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getProgressValue = (status: SchemaFile['status']) => {
    switch (status) {
      case 'uploading':
        return 25;
      case 'processing':
        return 75;
      case 'completed':
        return 100;
      case 'error':
        return 0;
      default:
        return 0;
    }
  };

  const handleProceedToDiscovery = () => {
    if (canProceedToNextPhase()) {
      setCurrentPhase('discovery');
      toast({
        title: "Proceeding to Discovery",
        description: "Analyzing uploaded schemas and building data lineage...",
      });
      navigate(`/discovery/${projectId}`);
    }
  };

  if (!currentProject) {
    return null;
  }

  const getTotalStats = (files: SchemaFile[]) => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.preview);
    return {
      totalTables: completedFiles.reduce((sum, f) => sum + (f.preview?.tableCount || 0), 0),
      totalColumns: completedFiles.reduce((sum, f) => sum + (f.preview?.columnCount || 0), 0),
      fileCount: completedFiles.length,
    };
  };

  const sourceStats = getTotalStats(sourceFiles);
  const targetStats = getTotalStats(targetFiles);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Schema Upload
        </h1>
        <p className="text-muted-foreground mt-2">
          Upload your source and target schemas to begin the migration analysis.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Source Schema Upload */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                <Database className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <CardTitle>Source Schema</CardTitle>
                <CardDescription>Upload your legacy system schemas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Dialect</label>
              <Select value={sourceDialect} onValueChange={(value: SchemaDialect) => setSourceDialect(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(dialectDisplayNames).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FileDropZone
              title="Drop source files here"
              description="Upload DDL files, JSON schemas, or sample data"
              files={sourceFiles}
              onFilesAdded={(files) => handleFilesAdded(files, 'source')}
              onFileRemove={(fileId) => removeFile(fileId, 'source')}
            />

            {sourceFiles.length > 0 && (
              <>
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{sourceStats.fileCount}</p>
                      <p className="text-xs text-muted-foreground">Files</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{sourceStats.totalTables}</p>
                      <p className="text-xs text-muted-foreground">Tables</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{sourceStats.totalColumns}</p>
                      <p className="text-xs text-muted-foreground">Columns</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                  <ul className="space-y-2">
                    {sourceFiles.map((file) => (
                      <li key={file.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file.name)}
                          <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                          <span className={cn("text-xs", getStatusColor(file.status))}>
                            ({file.status.charAt(0).toUpperCase() + file.status.slice(1)})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {file.status === 'uploading' || file.status === 'processing' ? (
                            <Progress value={getProgressValue(file.status)} className="w-24 h-2" />
                          ) : null}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id, 'source')}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

          </CardContent>
        </Card>

        {/* Target Schema Upload */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-emerald-100 flex items-center justify-center">
                <Target className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <CardTitle>Target Schema</CardTitle>
                <CardDescription>Upload your target system schemas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Dialect</label>
              <Select value={targetDialect} onValueChange={(value: SchemaDialect) => setTargetDialect(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(dialectDisplayNames).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FileDropZone
              title="Drop target files here"
              description="Upload target schema definitions"
              files={targetFiles}
              onFilesAdded={(files) => handleFilesAdded(files, 'target')}
              onFileRemove={(fileId) => removeFile(fileId, 'target')}
            />

            {targetFiles.length > 0 && (
              <>
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{targetStats.fileCount}</p>
                      <p className="text-xs text-muted-foreground">Files</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{targetStats.totalTables}</p>
                      <p className="text-xs text-muted-foreground">Tables</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{targetStats.totalColumns}</p>
                      <p className="text-xs text-muted-foreground">Columns</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                  <ul className="space-y-2">
                    {targetFiles.map((file) => (
                      <li key={file.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file.name)}
                          <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                          <span className={cn("text-xs", getStatusColor(file.status))}>
                            ({file.status.charAt(0).toUpperCase() + file.status.slice(1)})
                          </span>
                        </div>
                        <div className="items-center space-x-2">
                          {file.status === 'uploading' || file.status === 'processing' ? (
                            <Progress value={getProgressValue(file.status)} className="w-24 h-2" />
                          ) : null}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id, 'target')}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Proceed Button */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleProceedToDiscovery}
          disabled={!canProceedToNextPhase()}
          className="bg-gradient-hero hover:opacity-90 shadow-enterprise text-lg px-8 py-3"
          size="lg"
        >
          Proceed to Discovery
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {!canProceedToNextPhase() && (sourceFiles.length > 0 || targetFiles.length > 0) && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Upload and process both source and target schemas to continue
        </div>
      )}
    </div>
  );
}