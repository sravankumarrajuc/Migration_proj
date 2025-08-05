import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Brain, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface ValidationSummaryProps {
  filesCompared: number;
  anomaliesDetected: number;
  accuracy: number;
}

export function ValidationSummary({ filesCompared, anomaliesDetected, accuracy }: ValidationSummaryProps) {
  const aiNarrative = `
Based on the comprehensive analysis of ${filesCompared} data files during the migration from legacy systems to modern cloud infrastructure, I've identified several key findings:

**Overall Assessment: Excellent Migration Quality**

The migration has achieved an outstanding ${accuracy}% data accuracy rate, which exceeds industry standards for enterprise data migrations. This high success rate indicates robust ETL processes and careful attention to data integrity during the transformation phase.

**Key Findings:**

1. **Data Integrity**: All critical business data has been successfully migrated with perfect schema alignment. Customer records, order histories, and product catalogs maintain complete referential integrity.

2. **Performance Improvements**: The new cloud-based structure shows 3x faster query performance compared to the legacy system, with improved indexing and optimized table structures.

3. **Minor Discrepancies**: ${anomaliesDetected} anomalies were detected, primarily consisting of:
   - Data type mismatches in legacy formatting
   - Null value handling in optional fields
   - Timestamp format standardization needs

**Recommendations:**

1. **Immediate Actions**: Address the high-severity data type mismatches in the customer_orders table before production deployment.

2. **Quality Assurance**: Implement the suggested validation rules to prevent similar issues in future incremental loads.

3. **Production Readiness**: With current accuracy levels, the migration is ready for production deployment with minimal risk.

**Business Impact:**

This migration positions your organization for:
- Enhanced analytical capabilities with cloud-native tools
- Improved scalability for future growth
- Reduced maintenance overhead
- Better disaster recovery capabilities

The migration project can be considered highly successful and ready for final deployment approval.
  `;

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Validation Summary</CardTitle>
              <CardDescription>
                Intelligent analysis of your migration results with actionable insights
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{accuracy}%</div>
              <div className="text-sm text-green-600">Data Accuracy</div>
              <CheckCircle className="h-5 w-5 text-green-500 mx-auto mt-2" />
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{filesCompared}</div>
              <div className="text-sm text-blue-600">Files Validated</div>
              <FileText className="h-5 w-5 text-blue-500 mx-auto mt-2" />
            </div>
            
            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{anomaliesDetected}</div>
              <div className="text-sm text-amber-600">Issues Found</div>
              <AlertTriangle className="h-5 w-5 text-amber-500 mx-auto mt-2" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
            <Badge variant="default" className="text-lg px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Migration Approved
            </Badge>
            <span className="text-sm text-muted-foreground">Ready for production deployment</span>
          </div>
        </CardContent>
      </Card>

      {/* AI Narrative */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI-Generated Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive narrative summary generated by AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line text-sm leading-relaxed">
              {aiNarrative.trim()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Migration Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Migration Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Schema Upload & Analysis</div>
                <div className="text-sm text-muted-foreground">Completed in 2.3 minutes</div>
              </div>
              <Badge variant="outline">100%</Badge>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Discovery & Lineage Mapping</div>
                <div className="text-sm text-muted-foreground">Completed in 4.7 minutes</div>
              </div>
              <Badge variant="outline">100%</Badge>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Field Mapping & AI Suggestions</div>
                <div className="text-sm text-muted-foreground">Completed in 3.1 minutes</div>
              </div>
              <Badge variant="outline">100%</Badge>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">ETL Code Generation</div>
                <div className="text-sm text-muted-foreground">Completed in 1.8 minutes</div>
              </div>
              <Badge variant="outline">100%</Badge>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Validation & QA</div>
                <div className="text-sm text-muted-foreground">Completed in 6.2 minutes</div>
              </div>
              <Badge variant="default">Current</Badge>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Migration Time</span>
              <Badge variant="outline" className="text-lg px-3 py-1">
                18.1 minutes
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Next Steps</CardTitle>
          <CardDescription>
            Recommended actions based on validation results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Address Data Type Mismatches</span>
            </div>
            <Button variant="outline" size="sm">Review</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Update NULL Value Handling</span>
            </div>
            <Button variant="outline" size="sm">Fix</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Schedule Production Deployment</span>
            </div>
            <Button variant="outline" size="sm">Plan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}