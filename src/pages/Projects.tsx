import { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { projectTemplates, dialectDisplayNames, getStatusColor, getPhaseProgress } from '@/data/mockProjects';
import { useMigrationStore } from '@/store/migrationStore';
import { useNavigate } from 'react-router-dom';
import { Project, ProjectTemplate, SchemaDialect } from '@/types/migration';
import { useToast } from '@/hooks/use-toast';

export default function Projects() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentProject, setCurrentPhase } = useMigrationStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    sourceDialect: '' as SchemaDialect,
    targetDialect: '' as SchemaDialect,
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Load projects on component mount and refresh
  useEffect(() => {
    const loadProjects = async () => {
      // Import mockProjects dynamically to get fresh data including completed projects
      const { mockProjects } = await import('@/data/mockProjects');
      setProjects(mockProjects);
    };
    loadProjects();
  }, []);

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project);
    setCurrentPhase(project.progress.currentPhase);
    
    // Navigate based on current phase
    switch (project.progress.currentPhase) {
      case 'upload':
        navigate(`/upload/${project.id}`);
        break;
      case 'discovery':
        navigate(`/discovery/${project.id}`);
        break;
      case 'mapping':
        navigate(`/mapping/${project.id}`);
        break;
      case 'codegen':
        navigate(`/codegen/${project.id}`);
        break;
      case 'validation':
        navigate(`/validation/${project.id}`);
        break;
      default:
        navigate(`/upload/${project.id}`);
    }
  };

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.sourceDialect || !newProject.targetDialect) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const project: Project = {
      id: `proj-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      sourceDialect: newProject.sourceDialect,
      targetDialect: newProject.targetDialect,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: {
        currentPhase: 'upload',
        completedPhases: [],
        schemasUploaded: false,
        mappingsComplete: false,
        codeGenerated: false,
        validationComplete: false,
      },
    };

    // Add project to projects list and persist it
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    
    // Persist new project
    if (typeof window !== 'undefined') {
      const existingProjects = JSON.parse(localStorage.getItem('completed-projects') || '[]');
      existingProjects.push(project);
      localStorage.setItem('completed-projects', JSON.stringify(existingProjects));
    }
    
    setCurrentProject(project);
    setCurrentPhase('upload');
    setIsCreateDialogOpen(false);
    
    // Reset form
    setNewProject({
      name: '',
      description: '',
      sourceDialect: '' as SchemaDialect,
      targetDialect: '' as SchemaDialect,
    });
    
    toast({
      title: "Project Created",
      description: `${project.name} has been created successfully.`,
    });

    navigate(`/upload/${project.id}`);
  };

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setNewProject({
      name: `${template.name} Migration`,
      description: template.description,
      sourceDialect: template.sourceDialect,
      targetDialect: template.targetDialect,
    });
    setSelectedTemplateId(template.id); // Set the selected template ID
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Migration Projects
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your data migration projects and track progress across all phases.
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-hero hover:opacity-90 shadow-enterprise">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Migration Project</DialogTitle>
                <DialogDescription>
                  Set up a new data migration project with source and target configurations.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="custom" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="templates">From Template</TabsTrigger>
                  <TabsTrigger value="custom">Custom Setup</TabsTrigger>
                </TabsList>
                
                <TabsContent value="templates" className="space-y-4">
                  <div className="grid gap-4">
                    {projectTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer hover:shadow-card transition-shadow ${selectedTemplateId === template.id ? 'border-2 border-primary' : ''}`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            <Badge variant="outline">{template.complexity}</Badge>
                          </div>
                          <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {dialectDisplayNames[template.sourceDialect]} → {dialectDisplayNames[template.targetDialect]}
                            </span>
                            <span className="text-muted-foreground">{template.estimatedDuration}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="project-name">Project Name *</Label>
                      <Input
                        id="project-name"
                        placeholder="Enter project name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="project-description">Description</Label>
                      <Textarea
                        id="project-description"
                        placeholder="Describe your migration project"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="source-dialect">Source Dialect *</Label>
                        <Select
                          value={newProject.sourceDialect}
                          onValueChange={(value: SchemaDialect) => setNewProject({ ...newProject, sourceDialect: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
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
                      
                      <div className="grid gap-2">
                        <Label htmlFor="target-dialect">Target Dialect *</Label>
                        <Select
                          value={newProject.targetDialect}
                          onValueChange={(value: SchemaDialect) => setNewProject({ ...newProject, targetDialect: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select target" />
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
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} className="bg-gradient-hero hover:opacity-90">
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer hover:shadow-enterprise transition-all duration-300 hover:-translate-y-1"
            onClick={() => handleProjectSelect(project)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {getStatusIcon(project.status)}
                  <span className="ml-1 capitalize">{project.status}</span>
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Migration Path:</span>
                  <span className="font-medium">
                    {dialectDisplayNames[project.sourceDialect]} → {dialectDisplayNames[project.targetDialect]}
                  </span>
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium">{getPhaseProgress(project.progress.completedPhases)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-gradient-hero h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getPhaseProgress(project.progress.completedPhases)}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                  <span>Phase: {project.progress.currentPhase}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}