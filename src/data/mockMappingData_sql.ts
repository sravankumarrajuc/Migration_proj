import { FieldMapping, MappingRule, TableMapping, TransformationType } from '@/types/migration';

const now = new Date().toISOString();

// =================================================================================
// MAPPING RULES DEFINITIONS
// =================================================================================
export const mockMappingRules: MappingRule[] = [
  {
    id: 'rule-1',
    name: 'Extract JSON Fields',
    description: 'Extracts data from a JSON column using JSON_VALUE or JSON_QUERY.',
    sourceColumns: ['*_JSON'],
    targetColumn: 'various',
    transformation: "JSON_VALUE(source_column, '$.path.to.field')",
    confidence: 85,
    isComposite: true,
  },
  {
    id: 'rule-2',
    name: 'Denormalize via Aggregation',
    description: 'Aggregates records from a child table into a nested array in the parent target table.',
    sourceColumns: ['* from child table'],
    targetColumn: 'payments / adjustments / events / history_log / commission_records',
    transformation: "ARRAY_AGG(STRUCT(...)) GROUP BY foreign_key",
    confidence: 80,
    isComposite: true,
  },
];


// =================================================================================
// FIELD MAPPING DEFINITIONS
// =================================================================================

export const customerMappings: FieldMapping[] = [
  { id: 'map-cust-1', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'CUST_ID', targetTableId: 'customers_denorm', targetColumnId: 'customer_id', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of customer ID.', createdAt: now },
  { id: 'map-cust-2', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'NAME_JSON', targetTableId: 'customers_denorm', targetColumnId: 'name_first', transformationType: 'computed', formula: "JSON_VALUE(NAME_JSON, '$.first')", confidence: 85, status: undefined, description: 'Extract first name from JSON.', createdAt: now },
];

export const claimsMappings: FieldMapping[] = [
  { id: 'map-claims-1', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'CLM_ID', targetTableId: 'claims_denorm', targetColumnId: 'claim_identifier', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of claim ID.', createdAt: now },
  { id: 'map-claims-payments', sourceTableId: 'DB2_PAYMENTS', sourceColumnId: '*', targetTableId: 'claims_denorm', targetColumnId: 'payments', transformationType: 'custom', formula: 'ARRAY_AGG(STRUCT(...)) FROM DB2_PAYMENTS', confidence: 80, status: undefined, description: 'Aggregate payments into a nested array.', createdAt: now },
];

const policiesMappings: FieldMapping[] = [
    { id: 'map-policies-1', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'POLICY_ID', targetTableId: 'policies_denorm', targetColumnId: 'policy_key', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of policy ID.', createdAt: now },
    { id: 'map-policies-history', sourceTableId: 'DB2_POLICY_HISTORY', sourceColumnId: '*', targetTableId: 'policies_denorm', targetColumnId: 'history_log', transformationType: 'custom', formula: 'ARRAY_AGG(STRUCT(...)) FROM DB2_POLICY_HISTORY', confidence: 80, status: undefined, description: 'Aggregate history into a nested array.', createdAt: now }
];

const agentsMappings: FieldMapping[] = [
    { id: 'map-agents-1', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'AGENT_ID', targetTableId: 'agents_denorm', targetColumnId: 'agent_key', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of agent ID.', createdAt: now },
    { id: 'map-agents-commissions', sourceTableId: 'DB2_COMMISSIONS', sourceColumnId: '*', targetTableId: 'agents_denorm', targetColumnId: 'commission_records', transformationType: 'custom', formula: 'ARRAY_AGG(STRUCT(...)) FROM DB2_COMMISSIONS', confidence: 80, status: undefined, description: 'Aggregate commissions into a nested array.', createdAt: now },
];

const riskRatingsMappings: FieldMapping[] = [
    { id: 'map-risk-1', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'RATING_KEY', targetTableId: 'risk_ratings_denorm', targetColumnId: 'rating_id', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of rating key.', createdAt: now },
];

// =================================================================================
// TABLE MAPPING DEFINITIONS
// =================================================================================

export const mockTableMappings: TableMapping[] = [
  { sourceTableId: 'DB2_CUSTOMERS', targetTableId: 'customers_denorm', fieldMappings: customerMappings, completionPercentage: 100, requiredFieldsCovered: 2, totalRequiredFields: 2, },
  { sourceTableId: 'DB2_CLAIMS', targetTableId: 'claims_denorm', fieldMappings: claimsMappings, completionPercentage: 100, requiredFieldsCovered: 2, totalRequiredFields: 2, },
  { sourceTableId: 'DB2_POLICIES', targetTableId: 'policies_denorm', fieldMappings: policiesMappings, completionPercentage: 100, requiredFieldsCovered: 2, totalRequiredFields: 2, },
  { sourceTableId: 'DB2_AGENTS', targetTableId: 'agents_denorm', fieldMappings: agentsMappings, completionPercentage: 100, requiredFieldsCovered: 2, totalRequiredFields: 2, },
  { sourceTableId: 'DB2_RISK_RATINGS', targetTableId: 'risk_ratings_denorm', fieldMappings: riskRatingsMappings, completionPercentage: 100, requiredFieldsCovered: 1, totalRequiredFields: 1, },
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