import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, Database, Calendar } from 'lucide-react';

interface AnomalyDetectionProps {
  anomalies: number;
}

export function AnomalyDetection({ anomalies }: AnomalyDetectionProps) {
  const mockAnomalies = [
    {
      id: 1,
      type: 'data_type_mismatch',
      severity: 'high',
      table: 'customer_orders',
      field: 'total_amount',
      description: 'Expected DECIMAL, found VARCHAR in 3 records',
      count: 3,
      suggestion: 'Apply data type conversion in ETL pipeline'
    },
    {
      id: 2,
      type: 'null_values',
      severity: 'medium',
      table: 'product_catalog',
      field: 'price',
      description: 'NULL values found where NOT NULL expected',
      count: 5,
      suggestion: 'Implement default value handling or data cleansing'
    },
    {
      id: 3,
      type: 'range_violation',
      severity: 'low',
      table: 'user_activity',
      field: 'login_timestamp',
      description: 'Future dates detected in timestamp field',
      count: 1,
      suggestion: 'Add timestamp validation to prevent future dates'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'data_type_mismatch': return <Database className="h-5 w-5" />;
      case 'null_values': return <XCircle className="h-5 w-5" />;
      case 'range_violation': return <Calendar className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Anomaly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{mockAnomalies.filter(a => a.severity === 'high').length}</p>
                <p className="text-sm text-muted-foreground">High Severity</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-amber-600">{mockAnomalies.filter(a => a.severity === 'medium').length}</p>
                <p className="text-sm text-muted-foreground">Medium Severity</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{mockAnomalies.filter(a => a.severity === 'low').length}</p>
                <p className="text-sm text-muted-foreground">Low Severity</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Quality Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Data Quality Score
          </CardTitle>
          <CardDescription>
            Overall assessment of data migration quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Data Accuracy</span>
              <span>99.2%</span>
            </div>
            <Progress value={99.2} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Schema Compliance</span>
              <span>97.8%</span>
            </div>
            <Progress value={97.8} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Data Completeness</span>
              <span>95.5%</span>
            </div>
            <Progress value={95.5} className="h-2" />
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Overall Quality Score</span>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-lg px-3 py-1">
                97.5%
              </Badge>
              <span className="text-sm text-muted-foreground">Excellent</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Anomalies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detected Anomalies</CardTitle>
          <CardDescription>
            Issues found during data validation that require attention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockAnomalies.map((anomaly, index) => (
            <div key={anomaly.id}>
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(anomaly.type)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{anomaly.table}.{anomaly.field}</h4>
                      <Badge variant={getSeverityColor(anomaly.severity)}>
                        {getSeverityIcon(anomaly.severity)}
                        <span className="ml-1 capitalize">{anomaly.severity}</span>
                      </Badge>
                    </div>
                    <Badge variant="outline">
                      {anomaly.count} records
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {anomaly.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600">
                      💡 {anomaly.suggestion}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Fix Automatically
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {index < mockAnomalies.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Resolution Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resolution Actions</CardTitle>
          <CardDescription>
            Recommended actions to resolve detected anomalies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Generate Fix Scripts</div>
                <div className="text-sm text-muted-foreground">
                  Create SQL scripts to fix data type mismatches
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Update ETL Pipeline</div>
                <div className="text-sm text-muted-foreground">
                  Modify transformation logic to handle NULL values
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Add Validation Rules</div>
                <div className="text-sm text-muted-foreground">
                  Implement data quality checks for future runs
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Schedule Re-validation</div>
                <div className="text-sm text-muted-foreground">
                  Run validation again after fixes are applied
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}