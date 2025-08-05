import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Download, Github, FileText, FolderOpen, CheckCircle } from 'lucide-react';
import { CodePlatform, GeneratedCode } from '@/types/migration';
import { useToast } from '@/hooks/use-toast';

interface ExportOptionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatedCodes: Record<CodePlatform, GeneratedCode | null>;
  projectName: string;
}

export function ExportOptions({
  open,
  onOpenChange,
  generatedCodes,
  projectName
}: ExportOptionsProps) {
  const { toast } = useToast();
  const [exportSettings, setExportSettings] = useState({
    includeDocumentation: true,
    includeReadme: true,
    includeCiCd: false,
    organizeByPlatform: true
  });
  const [githubSettings, setGithubSettings] = useState({
    repositoryName: `${projectName.toLowerCase().replace(/\s+/g, '-')}-migration`,
    isPrivate: true,
    includeWorkflows: false
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadFiles = async () => {
    setIsExporting(true);
    
    try {
      // Simulate file preparation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create and download files
      Object.entries(generatedCodes).forEach(([platform, code]) => {
        if (code) {
          const blob = new Blob([code.content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = code.fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });

      if (exportSettings.includeReadme) {
        const readmeContent = generateReadme();
        const blob = new Blob([readmeContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'README.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      toast({
        title: "Files downloaded",
        description: "All generated code files have been downloaded successfully",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to download files. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsExporting(false);
  };

  const handleCreateGithubRepo = async () => {
    setIsExporting(true);
    
    try {
      // Simulate GitHub repository creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Repository created",
        description: `Successfully created ${githubSettings.repositoryName} on GitHub`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "GitHub export failed", 
        description: "Failed to create repository. Please check your GitHub connection.",
        variant: "destructive",
      });
    }
    
    setIsExporting(false);
  };

  const generateReadme = () => {
    const availablePlatforms = Object.keys(generatedCodes).filter(platform => 
      generatedCodes[platform as CodePlatform]
    );

    return `# ${projectName} - Data Migration

## Overview
This repository contains generated ETL code for migrating data from legacy systems to modern cloud platforms.

## Generated Platforms
${availablePlatforms.map(platform => {
  const code = generatedCodes[platform as CodePlatform];
  return `- **${platform.toUpperCase()}**: ${code?.fileName} (${Math.round((code?.size || 0) / 1024)}KB)`;
}).join('\n')}

## Quick Start

### BigQuery
1. Update project and dataset names in the SQL files
2. Run the migration scripts in BigQuery console
3. Validate data integrity using the provided queries

### Databricks
1. Import SQL files into your Databricks workspace
2. Configure Delta Lake storage paths
3. Execute notebooks in the correct dependency order

### Python/Beam
1. Install Apache Beam: \`pip install apache-beam[gcp]\`
2. Configure authentication for your cloud provider
3. Run the pipeline: \`python beam_migration_pipeline.py\`

### dbt
1. Install dbt: \`pip install dbt-bigquery\`
2. Configure profiles.yml with your connection details
3. Run migrations: \`dbt run\`

## File Structure
\`\`\`
${exportSettings.organizeByPlatform ? `
├── bigquery/
│   └── bigquery_migration.sql
├── databricks/
│   └── databricks_migration.sql
├── python-beam/
│   └── beam_migration_pipeline.py
├── dbt/
│   └── dbt_migration_models.sql
` : availablePlatforms.map(platform => `├── ${generatedCodes[platform as CodePlatform]?.fileName}`).join('\n')}
└── README.md
\`\`\`

## Migration Process
1. **Schema Upload**: Source and target schemas analyzed
2. **Discovery**: Data lineage and relationships mapped
3. **Field Mapping**: AI-generated field mappings with transformations
4. **Code Generation**: Platform-specific ETL code generated
5. **Validation**: Data quality checks and validation scripts

## Support
Generated by AccelMigrate - AI-powered data migration accelerator
Last updated: ${new Date().toISOString()}
`;
  };

  const availableCodes = Object.values(generatedCodes).filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Generated Code
          </DialogTitle>
          <DialogDescription>
            Download files or create a GitHub repository with your generated ETL code
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="download" className="h-[calc(90vh-120px)]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="download">Download Files</TabsTrigger>
            <TabsTrigger value="github">GitHub Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="download" className="h-full overflow-auto space-y-6">
            {/* Generated Files Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generated Files</CardTitle>
                <CardDescription>
                  {availableCodes.length} code file{availableCodes.length !== 1 ? 's' : ''} ready for download
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(generatedCodes).map(([platform, code]) => (
                  <div key={platform} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{code?.fileName || `${platform}.sql`}</div>
                        <div className="text-sm text-muted-foreground">
                          {platform.toUpperCase()} • {Math.round((code?.size || 0) / 1024)}KB
                        </div>
                      </div>
                    </div>
                    {code ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="text-xs text-muted-foreground">Not generated</div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Export Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Documentation</Label>
                    <div className="text-sm text-muted-foreground">
                      Add inline comments and field mapping documentation
                    </div>
                  </div>
                  <Switch
                    checked={exportSettings.includeDocumentation}
                    onCheckedChange={(checked) =>
                      setExportSettings(prev => ({ ...prev, includeDocumentation: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Generate README</Label>
                    <div className="text-sm text-muted-foreground">
                      Include setup instructions and migration guide
                    </div>
                  </div>
                  <Switch
                    checked={exportSettings.includeReadme}
                    onCheckedChange={(checked) =>
                      setExportSettings(prev => ({ ...prev, includeReadme: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Organize by Platform</Label>
                    <div className="text-sm text-muted-foreground">
                      Create separate folders for each platform
                    </div>
                  </div>
                  <Switch
                    checked={exportSettings.organizeByPlatform}
                    onCheckedChange={(checked) =>
                      setExportSettings(prev => ({ ...prev, organizeByPlatform: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleDownloadFiles}
                disabled={availableCodes.length === 0 || isExporting}
                className="min-w-[140px]"
              >
                {isExporting ? 'Preparing...' : `Download ${availableCodes.length} Files`}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="github" className="h-full overflow-auto space-y-6">
            {/* GitHub Repository Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  GitHub Repository
                </CardTitle>
                <CardDescription>
                  Create a new repository with your generated code and documentation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repo-name">Repository Name</Label>
                  <Input
                    id="repo-name"
                    value={githubSettings.repositoryName}
                    onChange={(e) =>
                      setGithubSettings(prev => ({ ...prev, repositoryName: e.target.value }))
                    }
                    placeholder="my-migration-project"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Private Repository</Label>
                    <div className="text-sm text-muted-foreground">
                      Keep your migration code private
                    </div>
                  </div>
                  <Switch
                    checked={githubSettings.isPrivate}
                    onCheckedChange={(checked) =>
                      setGithubSettings(prev => ({ ...prev, isPrivate: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include CI/CD Workflows</Label>
                    <div className="text-sm text-muted-foreground">
                      Add GitHub Actions for automated deployments
                    </div>
                  </div>
                  <Switch
                    checked={githubSettings.includeWorkflows}
                    onCheckedChange={(checked) =>
                      setGithubSettings(prev => ({ ...prev, includeWorkflows: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Repository Structure Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Repository Structure Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-sm space-y-1 text-muted-foreground">
                  <div>📁 {githubSettings.repositoryName}/</div>
                  <div>├── 📄 README.md</div>
                  {Object.entries(generatedCodes).map(([platform, code]) => 
                    code && (
                      <div key={platform}>
                        ├── 📁 {platform}/
                        <div>│   └── 📄 {code.fileName}</div>
                      </div>
                    )
                  )}
                  {githubSettings.includeWorkflows && (
                    <>
                      <div>├── 📁 .github/</div>
                      <div>│   └── 📁 workflows/</div>
                      <div>│       ├── 📄 deploy-bigquery.yml</div>
                      <div>│       └── 📄 deploy-databricks.yml</div>
                    </>
                  )}
                  <div>└── 📄 .gitignore</div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleCreateGithubRepo}
                disabled={!githubSettings.repositoryName || isExporting}
                className="min-w-[160px]"
              >
                {isExporting ? 'Creating Repository...' : 'Create GitHub Repository'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />
        
        <div className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {availableCodes.length} of {Object.keys(generatedCodes).length} platforms ready
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}