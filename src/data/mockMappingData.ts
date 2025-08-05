import { FieldMapping, MappingRule, TableMapping, TransformationType } from '@/types/migration';

// Mock field mappings for customers -> dim_customer
export const mockCustomerMappings: FieldMapping[] = [
  {
    id: 'map-1',
    sourceTableId: 'customers',
    sourceColumnId: 'customer_id',
    targetTableId: 'dim_customer',
    targetColumnId: 'customer_key',
    transformationType: 'direct',
    confidence: 98,
    status: undefined,
    description: 'Direct mapping of primary key',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'map-2',
    sourceTableId: 'customers',
    sourceColumnId: 'email',
    targetTableId: 'dim_customer',
    targetColumnId: 'email_address',
    transformationType: 'direct',
    confidence: 95,
    status: undefined,
    description: 'Email field with minor name difference',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'map-3',
    sourceTableId: 'customers',
    sourceColumnId: 'first_name',
    targetTableId: 'dim_customer',
    targetColumnId: 'full_name',
    transformationType: 'concatenated',
    confidence: 85,
    status: undefined,
    formula: "CONCAT(first_name, ' ', last_name)",
    description: 'Composite field: first_name + last_name → full_name',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'map-4',
    sourceTableId: 'customers',
    sourceColumnId: 'created_at',
    targetTableId: 'dim_customer',
    targetColumnId: 'registration_date',
    transformationType: 'cast',
    confidence: 92,
    status: undefined,
    formula: 'DATE(created_at)',
    description: 'Convert timestamp to date',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'map-5',
    sourceTableId: 'customers',
    sourceColumnId: 'is_active',
    targetTableId: 'dim_customer',
    targetColumnId: 'customer_status',
    transformationType: 'case_when',
    confidence: 78,
    status: undefined,
    formula: "CASE WHEN is_active = true THEN 'Active' ELSE 'Inactive' END",
    description: 'Convert boolean to status string',
    createdAt: new Date().toISOString(),
  },
];

// Mock field mappings for orders -> fact_order
export const mockOrderMappings: FieldMapping[] = [
  {
    id: 'map-6',
    sourceTableId: 'orders',
    sourceColumnId: 'order_id',
    targetTableId: 'fact_order',
    targetColumnId: 'order_key',
    transformationType: 'direct',
    confidence: 98,
    status: undefined,
    description: 'Direct mapping of primary key',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'map-7',
    sourceTableId: 'orders',
    sourceColumnId: 'customer_id',
    targetTableId: 'fact_order',
    targetColumnId: 'customer_key',
    transformationType: 'direct',
    confidence: 95,
    status: undefined,
    description: 'Foreign key reference to customer dimension',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'map-8',
    sourceTableId: 'orders',
    sourceColumnId: 'total_amount',
    targetTableId: 'fact_order',
    targetColumnId: 'order_amount',
    transformationType: 'cast',
    confidence: 90,
    status: undefined,
    formula: 'CAST(total_amount AS NUMERIC(10,2))',
    description: 'Convert to BigQuery NUMERIC type',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'map-9',
    sourceTableId: 'orders',
    sourceColumnId: 'order_date',
    targetTableId: 'fact_order',
    targetColumnId: 'order_date_key',
    transformationType: 'computed',
    confidence: 82,
    status: undefined,
    formula: 'FORMAT_DATE("%Y%m%d", order_date)',
    description: 'Generate date key for dimension lookup',
    createdAt: new Date().toISOString(),
  },
];

// Mock mapping rules for complex transformations
export const mockMappingRules: MappingRule[] = [
  {
    id: 'rule-1',
    name: 'Full Name Concatenation',
    description: 'Combine first and last name with space separator',
    sourceColumns: ['first_name', 'last_name'],
    targetColumn: 'full_name',
    transformation: "CONCAT(first_name, ' ', last_name)",
    confidence: 85,
    isComposite: true,
  },
  {
    id: 'rule-2',
    name: 'Date Key Generation',
    description: 'Convert date to YYYYMMDD format for dimension keys',
    sourceColumns: ['order_date'],
    targetColumn: 'order_date_key',
    transformation: 'FORMAT_DATE("%Y%m%d", order_date)',
    confidence: 82,
    isComposite: false,
  },
  {
    id: 'rule-3',
    name: 'Status Code Mapping',
    description: 'Convert boolean flags to descriptive status codes',
    sourceColumns: ['is_active'],
    targetColumn: 'customer_status',
    transformation: "CASE WHEN is_active = true THEN 'Active' ELSE 'Inactive' END",
    confidence: 78,
    isComposite: false,
  },
];

// Mock table mappings
export const mockTableMappings: TableMapping[] = [
  {
    sourceTableId: 'customers',
    targetTableId: 'dim_customer',
    fieldMappings: mockCustomerMappings,
    completionPercentage: 83,
    requiredFieldsCovered: 5,
    totalRequiredFields: 6,
  },
  {
    sourceTableId: 'orders',
    targetTableId: 'fact_order',
    fieldMappings: mockOrderMappings,
    completionPercentage: 100,
    requiredFieldsCovered: 4,
    totalRequiredFields: 4,
  },
];

// Helper functions
export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return 'text-green-600';
  if (confidence >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

export const getConfidenceBadgeColor = (confidence: number): string => {
  if (confidence >= 90) return 'bg-green-100 text-green-800';
  if (confidence >= 70) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const getTransformationIcon = (type: TransformationType): string => {
  switch (type) {
    case 'direct': return '→';
    case 'computed': return '🔢';
    case 'concatenated': return '🔗';
    case 'cast': return '🎯';
    case 'case_when': return '🔀';
    case 'custom': return '⚙️';
    default: return '?';
  }
};

// Mock processing steps for mapping generation
export const mockMappingSteps = [
  { step: 'Analyzing source schema...', duration: 1000 },
  { step: 'Analyzing target schema...', duration: 800 },
  { step: 'Computing field similarities...', duration: 1200 },
  { step: 'Generating AI suggestions...', duration: 1500 },
  { step: 'Calculating confidence scores...', duration: 900 },
  { step: 'Building mapping rules...', duration: 700 },
  { step: 'Mapping generation complete!', duration: 500 },
];