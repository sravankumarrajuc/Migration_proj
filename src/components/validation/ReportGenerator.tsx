import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, FileText, Mail, Share, Eye } from 'lucide-react';

interface ValidationStats {
  filesCompared: number;
  anomaliesDetected: number;
  accuracy: number;
  tolerance: number;
}

interface ReportGeneratorProps {
  projectName: string;
  validationStats: ValidationStats;
}

export function ReportGenerator({ projectName, validationStats }: ReportGeneratorProps) {
  const [selectedSections, setSelectedSections] = useState({
    executiveSummary: true,
    technicalDetails: true,
    aiAnalysis: true,
    anomalies: true,
    recommendations: true,
    timeline: false,
    appendices: false,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const reportSections = [
    {
      id: 'executiveSummary',
      name: 'Executive Summary',
      description: 'High-level overview and key findings',
      pages: 2,
      essential: true,
    },
    {
      id: 'technicalDetails',
      name: 'Technical Details',
      description: 'Schema mappings, transformations, and statistics',
      pages: 8,
      essential: true,
    },
    {
      id: 'aiAnalysis',
      name: 'AI Analysis & Insights',
      description: 'Machine-generated analysis and recommendations',
      pages: 4,
      essential: true,
    },
    {
      id: 'anomalies',
      name: 'Anomaly Analysis',
      description: 'Detailed breakdown of issues and resolutions',
      pages: 3,
      essential: true,
    },
    {
      id: 'recommendations',
      name: 'Recommendations',
      description: 'Action items and best practices',
      pages: 2,
      essential: true,
    },
    {
      id: 'timeline',
      name: 'Migration Timeline',
      description: 'Step-by-step process documentation',
      pages: 3,
      essential: false,
    },
    {
      id: 'appendices',
      name: 'Technical Appendices',
      description: 'Raw data, scripts, and detailed logs',
      pages: 12,
      essential: false,
    },
  ];

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGenerating(false);
    
    // Simulate download
    const blob = new Blob(['Mock PDF Report Content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}_Migration_Report.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalPages = reportSections
    .filter(section => selectedSections[section.id])
    .reduce((sum, section) => sum + section.pages, 0);

  return (
    <div className="space-y-6">
      {/* Report Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Migration Validation Report
          </CardTitle>
          <CardDescription>
            Generate a comprehensive PDF report of your migration validation results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold">{validationStats.accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold">{validationStats.filesCompared}</div>
              <div className="text-sm text-muted-foreground">Files</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold">{validationStats.anomaliesDetected}</div>
              <div className="text-sm text-muted-foreground">Issues</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold">~{totalPages}</div>
              <div className="text-sm text-muted-foreground">Pages</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Sections</CardTitle>
          <CardDescription>
            Choose which sections to include in your report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reportSections.map((section) => (
            <div key={section.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <Checkbox
                id={section.id}
                checked={selectedSections[section.id]}
                onCheckedChange={() => handleSectionToggle(section.id)}
                disabled={section.essential}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor={section.id} className="font-medium cursor-pointer">
                    {section.name}
                  </Label>
                  {section.essential && (
                    <Badge variant="secondary" className="text-xs">Required</Badge>
                  )}
                  <Badge variant="outline" className="text-xs ml-auto">
                    {section.pages} pages
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Preview</CardTitle>
          <CardDescription>
            Overview of your customized report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Project Name:</span>
              <span className="font-medium">{projectName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Generated On:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Report Sections:</span>
              <span className="font-medium">
                {Object.values(selectedSections).filter(Boolean).length} of {reportSections.length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Estimated Pages:</span>
              <span className="font-medium">{totalPages} pages</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="font-medium">Table of Contents Preview:</h4>
            <div className="space-y-1 text-sm text-muted-foreground ml-4">
              {reportSections
                .filter(section => selectedSections[section.id])
                .map((section, index) => (
                  <div key={section.id} className="flex justify-between">
                    <span>{index + 1}. {section.name}</span>
                    <span>Page {Math.max(1, index * 3 + 1)}</span>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generate & Share</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="flex-1 min-w-[200px]"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download PDF Report'}
            </Button>
            
            <Button variant="outline" disabled={isGenerating}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" disabled={isGenerating}>
              <Mail className="h-4 w-4 mr-2" />
              Email Report
            </Button>
            
            <Button variant="outline" disabled={isGenerating}>
              <Share className="h-4 w-4 mr-2" />
              Share Link
            </Button>
          </div>
          
          {isGenerating && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                <span className="text-sm">Generating comprehensive validation report...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}