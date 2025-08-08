import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Trophy, ArrowRight, Star, Users, FileText, Home } from 'lucide-react';
import { Project } from '@/types/migration';
import { useMigrationStore } from '@/store/migrationStore';

interface ValidationStats {
  filesCompared: number;
  anomaliesDetected: number;
  accuracy: number;
  tolerance: number;
}

interface CompletionWorkflowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  validationStats: ValidationStats;
}

export function CompletionWorkflow({ 
  open, 
  onOpenChange, 
  project, 
  validationStats 
}: CompletionWorkflowProps) {
  const navigate = useNavigate();
  const { completeProject } = useMigrationStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionChecklist, setCompletionChecklist] = useState({
    dataValidated: true,
    codeReviewed: false,
    stakeholderApproval: false,
    documentationComplete: false,
    backupStrategy: false,
    rollbackPlan: false,
  });
  const [notes, setNotes] = useState('');

  const handleChecklistChange = (item: string) => {
    setCompletionChecklist(prev => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const completionItems = [
    {
      id: 'dataValidated',
      label: 'Data Validation Complete',
      description: 'All data files have been validated with acceptable accuracy',
      completed: completionChecklist.dataValidated,
      required: true,
    },
    {
      id: 'codeReviewed',
      label: 'Generated Code Reviewed',
      description: 'ETL code has been reviewed and approved by technical team',
      completed: completionChecklist.codeReviewed,
      required: true,
    },
    {
      id: 'stakeholderApproval',
      label: 'Stakeholder Sign-off',
      description: 'Business stakeholders have approved mapping results',
      completed: completionChecklist.stakeholderApproval,
      required: true,
    },
    {
      id: 'documentationComplete',
      label: 'Documentation Updated',
      description: 'System documentation reflects new architecture',
      completed: completionChecklist.documentationComplete,
      required: false,
    },
    {
      id: 'backupStrategy',
      label: 'Backup Strategy Confirmed',
      description: 'Data backup and recovery procedures are in place',
      completed: completionChecklist.backupStrategy,
      required: true,
    },
    {
      id: 'rollbackPlan',
      label: 'Rollback Plan Ready',
      description: 'Emergency rollback procedures documented and tested',
      completed: completionChecklist.rollbackPlan,
      required: true,
    },
  ];

  const allRequiredComplete = completionItems
    .filter(item => item.required)
    .every(item => item.completed);

  const handleCompleteProject = async () => {
    setIsCompleting(true);
    
    // Complete the project in the store
    completeProject();
    
    // Move to final step
    setCurrentStep(3);
    setIsCompleting(false);
  };

  const handleCloseAndNavigate = () => {
    onOpenChange(false);
    navigate('/projects');
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Trophy className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Mapping Complete!</h3>
          <p className="text-muted-foreground">
            Congratulations! Your data mapping has been successfully validated.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Final Results Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{validationStats.accuracy}%</div>
              <div className="text-sm text-green-600">Data Accuracy</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{validationStats.filesCompared}</div>
              <div className="text-sm text-blue-600">Files Migrated</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium">Ready for Production Deployment</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => setCurrentStep(2)}>
          Continue to Checklist
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Pre-Production Checklist</h3>
        <p className="text-muted-foreground">
          Complete these final steps before deploying to production
        </p>
      </div>

      <div className="space-y-4">
        {completionItems.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-4 border rounded-lg">
            <Checkbox
              id={item.id}
              checked={item.completed}
              onCheckedChange={() => handleChecklistChange(item.id)}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Label htmlFor={item.id} className="font-medium cursor-pointer">
                  {item.label}
                </Label>
                {item.required && (
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                )}
                {item.completed && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any additional notes or comments about the mapping..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button 
          onClick={handleCompleteProject}
          disabled={!allRequiredComplete || isCompleting}
        >
          {isCompleting ? 'Completing...' : 'Finalize Mapping'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
          <Star className="h-8 w-8 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Mapping Project Complete!</h3>
          <p className="text-muted-foreground">
            Your mapping has been successfully completed and is ready for production.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium">Download Final Report</div>
                <div className="text-sm text-muted-foreground">
                  Get a comprehensive PDF report for your records
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">Schedule Production Deployment</div>
                <div className="text-sm text-muted-foreground">
                  Coordinate with your team for go-live activities
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <div className="font-medium text-green-800">Mapping Successful</div>
            <div className="text-sm text-green-700">
              Project "{project.name}" has been completed with {validationStats.accuracy}% accuracy.
              All validation checks passed successfully.
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCloseAndNavigate}>
            <Home className="h-4 w-4 mr-2" />
            Return to Projects
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Mapping Project</DialogTitle>
          <DialogDescription>
            Finalize your mapping project and prepare for production deployment
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-8 h-0.5 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Separator />

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </DialogContent>
    </Dialog>
  );
}