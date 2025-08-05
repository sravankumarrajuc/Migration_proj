import { Check, Upload, Search, ArrowRightLeft, Code, Shield } from 'lucide-react';
import { MigrationPhase } from '@/types/migration';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentPhase: MigrationPhase;
  completedPhases: MigrationPhase[];
  className?: string;
}

const steps = [
  {
    id: 'upload' as MigrationPhase,
    name: 'Schema Upload',
    description: 'Upload source & target schemas',
    icon: Upload,
  },
  {
    id: 'discovery' as MigrationPhase,
    name: 'Discovery',
    description: 'Analyze data lineage & relationships',
    icon: Search,
  },
  {
    id: 'mapping' as MigrationPhase,
    name: 'Field Mapping',
    description: 'Map source to target fields',
    icon: ArrowRightLeft,
  },
  {
    id: 'codegen' as MigrationPhase,
    name: 'Code Generation',
    description: 'Generate ETL code',
    icon: Code,
  },
  {
    id: 'validation' as MigrationPhase,
    name: 'Validation',
    description: 'Validate migration outputs',
    icon: Shield,
  },
];

export function StepIndicator({ currentPhase, completedPhases, className }: StepIndicatorProps) {
  const getStepStatus = (stepId: MigrationPhase) => {
    if (completedPhases.includes(stepId)) return 'completed';
    if (stepId === currentPhase) return 'current';
    return 'upcoming';
  };

  return (
    <div className={cn('w-full bg-card border-b', className)}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                      status === 'completed' &&
                        'border-primary bg-primary text-primary-foreground shadow-glow',
                      status === 'current' &&
                        'border-primary bg-background text-primary shadow-enterprise',
                      status === 'upcoming' &&
                        'border-muted-foreground/30 bg-background text-muted-foreground'
                    )}
                  >
                    {status === 'completed' ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="mt-2 min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-sm font-medium transition-colors',
                        status === 'completed' && 'text-primary',
                        status === 'current' && 'text-foreground',
                        status === 'upcoming' && 'text-muted-foreground'
                      )}
                    >
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'mx-4 h-px w-16 transition-colors lg:w-24',
                      completedPhases.includes(step.id) ? 'bg-primary' : 'bg-border'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}