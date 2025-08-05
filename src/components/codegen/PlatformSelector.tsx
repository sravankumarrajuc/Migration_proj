import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Database, Code, Workflow, GitBranch } from 'lucide-react';
import { CodePlatform, GeneratedCode } from '@/types/migration';
import { getPlatformInfo } from '@/data/mockCodeGeneration';
import { cn } from '@/lib/utils';

interface PlatformSelectorProps {
  selectedPlatform: CodePlatform;
  onPlatformChange: (platform: CodePlatform) => void;
  generatedCodes: Record<CodePlatform, GeneratedCode | null>;
}

const platformIcons = {
  bigquery: Database,
  databricks: Database,
  'python-beam': Code,
  dbt: GitBranch
};

export function PlatformSelector({ 
  selectedPlatform, 
  onPlatformChange, 
  generatedCodes 
}: PlatformSelectorProps) {
  const platforms: CodePlatform[] = ['bigquery', 'databricks', 'python-beam', 'dbt'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {platforms.map((platform) => {
        const platformInfo = getPlatformInfo(platform);
        const Icon = platformIcons[platform];
        const isSelected = selectedPlatform === platform;
        const isGenerated = !!generatedCodes[platform];

        return (
          <Card
            key={platform}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              isSelected && "ring-2 ring-primary border-primary",
              !isSelected && "hover:border-primary/50"
            )}
            onClick={() => onPlatformChange(platform)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-sm">{platformInfo.name}</h3>
                </div>
                {isGenerated && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {platformInfo.description}
              </p>

              <div className="space-y-2">
                <div className="text-xs font-medium text-foreground">Features:</div>
                <div className="flex flex-wrap gap-1">
                  {platformInfo.features.slice(0, 2).map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs px-1.5 py-0.5">
                      {feature}
                    </Badge>
                  ))}
                  {platformInfo.features.length > 2 && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      +{platformInfo.features.length - 2}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-muted-foreground">
                  <strong>Use case:</strong> {platformInfo.useCase}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}