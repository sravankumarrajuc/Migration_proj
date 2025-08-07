import { Check, Upload, Search, ArrowRightLeft, Code, Shield, ArrowRight } from 'lucide-react';
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
    icon: Check,
  },
  {
    id: 'discovery' as MigrationPhase,
    name: 'Discovery',
    description: 'Analyze data lineage & relationships',
    icon: Check,
  },
  {
    id: 'mapping' as MigrationPhase,
    name: 'Field Mapping',
    description: 'Map source to target fields',
    icon: ArrowRightLeft,
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
        <div className="flex items-center justify-center gap-x-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex flex-col items-center text-center">
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
                  <Icon className="h-5 w-5" />
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
                {index < steps.length - 1 && (
                  <div className="relative flex-1 h-0.5"> {/* This will be the line container */}
                    <div
                      className={cn(
                        'absolute inset-y-0 left-0 right-0 transition-colors', // Line itself
                        completedPhases.includes(step.id) ? 'bg-primary' : 'bg-border'
                      )}
                    />
                    <div className={cn(
                      'absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center justify-center h-4 w-4 rounded-full border',
                      completedPhases.includes(step.id) ? 'border-primary bg-primary' : 'border-muted-foreground/30 bg-background'
                    )}>
                      {completedPhases.includes(step.id) && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <ArrowRight className={cn(
                      'absolute top-1/2 -translate-y-1/2 right-0 h-4 w-4 transition-colors',
                      completedPhases.includes(step.id) ? 'text-primary' : 'text-border'
                    )} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}