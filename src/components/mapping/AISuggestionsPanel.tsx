import { useMigrationStore } from '@/store/migrationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Check, X, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { getConfidenceBadgeColor, getTransformationIcon } from '@/data/mockMappingData.ts';
import { cn } from '@/lib/utils';

interface AISuggestionsPanelProps {
  onClose: () => void;
  filterConfidence?: number; // New prop for filtering suggestions
}

export function AISuggestionsPanel({ onClose, filterConfidence = 0 }: AISuggestionsPanelProps) {
  const {
    mappingState,
    discoveryState,
    updateFieldMapping,
    bulkAcceptHighConfidence
  } = useMigrationStore();

  const filteredSuggestions = filterConfidence > 0
    ? mappingState.suggestions.filter(s => s.confidence >= filterConfidence)
    : mappingState.suggestions;

  const highConfidenceSuggestions = filteredSuggestions.filter(s => s.confidence >= 90);
  const mediumConfidenceSuggestions = filteredSuggestions.filter(s => s.confidence >= 70 && s.confidence < 90);
  const lowConfidenceSuggestions = filteredSuggestions.filter(s => s.confidence < 70);

  const getSourceColumn = (sourceTableId: string, sourceColumnId: string) => {
    if (!discoveryState.lineageGraph) return null;
    const table = discoveryState.lineageGraph.tables.find(t => t.id === sourceTableId);
    return table?.columns.find(c => c.id === sourceColumnId) || null;
  };

  const getTargetColumn = (targetTableId: string, targetColumnId: string) => {
    if (!discoveryState.lineageGraph) return null;
    const table = discoveryState.lineageGraph.tables.find(t => t.id === targetTableId);
    return table?.columns.find(c => c.id === targetColumnId) || null;
  };

  const handleAccept = (mappingId: string) => {
    updateFieldMapping(mappingId, { 
      status: 'approved', 
      approvedAt: new Date().toISOString() 
    });
  };

  const handleReject = (mappingId: string) => {
    updateFieldMapping(mappingId, { status: 'rejected' });
  };

  const renderSuggestionGroup = (title: string, suggestions: any[], icon: React.ReactNode, emptyMessage: string) => {
    if (suggestions.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground text-sm">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {title} ({suggestions.length})
        </div>
        {suggestions.map((suggestion) => {
          const sourceColumn = getSourceColumn(suggestion.sourceTableId, suggestion.sourceColumnId);
          const targetColumn = getTargetColumn(suggestion.targetTableId, suggestion.targetColumnId);
          const isProcessed = suggestion.status !== 'suggested';

          return (
            <div
              key={suggestion.id}
              className={cn(
                "border rounded-lg p-3 space-y-2 transition-colors",
                isProcessed 
                  ? suggestion.status === 'approved'
                    ? "border-green-200 bg-green-50" 
                    : "border-gray-200 bg-gray-50"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <div className="flex items-center justify-between">
                <Badge className={getConfidenceBadgeColor(suggestion.confidence)}>
                  {suggestion.confidence}% match
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTransformationIcon(suggestion.transformationType)}</span>
                  {suggestion.status !== 'suggested' && (
                    <Badge variant={suggestion.status === 'approved' ? 'default' : 'secondary'}>
                      {suggestion.status === 'approved' ? 'Approved' : 'Rejected'}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex-1">
                  <div className="font-medium">{sourceColumn?.name}</div>
                  <div className="text-muted-foreground text-xs">{sourceColumn?.dataType}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                <div className="flex-1 text-right">
                  <div className="font-medium">{targetColumn?.name}</div>
                  <div className="text-muted-foreground text-xs">{targetColumn?.dataType}</div>
                </div>
              </div>

              {suggestion.formula && (
                <div className="bg-muted/50 rounded p-2">
                  <code className="text-xs font-mono">{suggestion.formula}</code>
                </div>
              )}

              {suggestion.description && (
                <div className="text-xs text-muted-foreground">
                  {suggestion.description}
                </div>
              )}

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleAccept(suggestion.id)}
                    className="gap-1"
                    variant={suggestion.status === 'approved' ? 'default' : 'outline'}
                    disabled={suggestion.status === 'approved' || suggestion.status === 'rejected'}
                  >
                    <Check className="h-3 w-3" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleReject(suggestion.id)}
                    className="gap-1"
                    variant={suggestion.status === 'rejected' ? 'destructive' : 'outline'}
                    disabled={suggestion.status === 'approved' || suggestion.status === 'rejected'}
                  >
                    <X className="h-3 w-3" />
                    Reject
                  </Button>
                </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Suggestions
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {highConfidenceSuggestions.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={bulkAcceptHighConfidence}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Accept All High Confidence ({highConfidenceSuggestions.length})
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            {filteredSuggestions.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Suggestions Available</h3>
                <p className="text-muted-foreground">
                  {filterConfidence > 0
                    ? `No suggestions with ${filterConfidence}% or more confidence.`
                    : "Generate AI suggestions to see mapping recommendations"}
                </p>
              </div>
            ) : (
              <>
                {renderSuggestionGroup(
                  "High Confidence",
                  highConfidenceSuggestions,
                  <CheckCircle2 className="h-4 w-4 text-green-600" />,
                  "No high confidence suggestions"
                )}

                {highConfidenceSuggestions.length > 0 && mediumConfidenceSuggestions.length > 0 && (
                  <Separator />
                )}

                {renderSuggestionGroup(
                  "Medium Confidence",
                  mediumConfidenceSuggestions,
                  <Zap className="h-4 w-4 text-yellow-600" />,
                  "No medium confidence suggestions"
                )}

                {(highConfidenceSuggestions.length > 0 || mediumConfidenceSuggestions.length > 0) && 
                 lowConfidenceSuggestions.length > 0 && (
                  <Separator />
                )}

                {renderSuggestionGroup(
                  "Low Confidence",
                  lowConfidenceSuggestions,
                  <X className="h-4 w-4 text-red-600" />,
                  "No low confidence suggestions"
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}