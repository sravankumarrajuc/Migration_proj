import { FieldMapping, MappingRule, TableMapping, TransformationType } from '@/types/migration';

const now = new Date().toISOString();

// =================================================================================
// MAPPING RULES DEFINITIONS
// =================================================================================
export const mockMappingRules: MappingRule[] = [
  {
    id: 'rule-1',
    name: 'Extract Customer Name',
    description: 'Extracts first and last name from a source JSON object.',
    sourceColumns: ['NAME_JSON'],
    targetColumn: 'name_first, name_last',
    transformation: "JSON_EXTRACT_SCALAR(NAME_JSON, '$.first'), JSON_EXTRACT_SCALAR(NAME_JSON, '$.last')",
    confidence: 85,
    isComposite: true,
  },
  {
    id: 'rule-2',
    name: 'Extract Customer Address',
    description: 'Extracts street, city, state, and zip from a source JSON object.',
    sourceColumns: ['ADDR_JSON'],
    targetColumn: 'address_street, address_city, address_state, address_postcode',
    transformation: "JSON_EXTRACT_SCALAR(ADDR_JSON, '$.street'), ...",
    confidence: 85,
    isComposite: true,
  },
  {
    id: 'rule-3',
    name: 'Map Status Code',
    description: 'Convert single-character status codes to descriptive strings.',
    sourceColumns: ['STATUS'],
    targetColumn: 'active_flag / active_status / status_flag',
    transformation: "CASE WHEN STATUS = 'A' THEN 'Active' WHEN STATUS = 'I' THEN 'Inactive' ELSE 'Unknown' END",
    confidence: 90,
    isComposite: false,
  },
  {
    id: 'rule-4',
    name: 'Denormalize Nested Arrays',
    description: 'Aggregates records from a child table into a nested array in the parent target table.',
    sourceColumns: ['* from child table'],
    targetColumn: 'payments / adjustments / events / history_log / commission_records',
    transformation: "ARRAY_AGG(STRUCT(...)) GROUP BY foreign_key",
    confidence: 80,
    isComposite: true,
  },
  {
    id: 'rule-5',
    name: 'Extract Coverage Details',
    description: 'Parses a JSON string containing coverage info and transforms it into a structured array.',
    sourceColumns: ['COVERAGES_JSON'],
    targetColumn: 'coverages',
    transformation: "PARSE_JSON(COVERAGES_JSON) and transform to ARRAY<STRUCT<...>>",
    confidence: 80,
    isComposite: true,
  },
];


// =================================================================================
// FIELD MAPPING DEFINITIONS
// =================================================================================

// Mappings for src-db2-customers -> tgt-bq-customers
export const customerMappings: FieldMapping[] = [
  { id: 'map-cust-1', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-1', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-1', transformationType: 'direct', confidence: 95, status: 'suggested', description: 'Direct map of customer ID.', createdAt: now },
  { id: 'map-cust-2', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-2', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-2', transformationType: 'computed', formula: "JSON_EXTRACT_SCALAR(NAME_JSON, '$.first')", confidence: 75, status: 'suggested', description: 'Extract first name from JSON.', createdAt: now },
  { id: 'map-cust-3', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-2', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-3', transformationType: 'computed', formula: "JSON_EXTRACT_SCALAR(NAME_JSON, '$.last')", confidence: 75, status: 'suggested', description: 'Extract last name from JSON.', createdAt: now },
  { id: 'map-cust-4', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-3', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-5', transformationType: 'direct', confidence: 92, status: 'suggested', description: 'Direct map of region code.', createdAt: now },
  { id: 'map-cust-5', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-4', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-6', transformationType: 'direct', confidence: 92, status: 'suggested', description: 'Direct map of customer segment.', createdAt: now },
  { id: 'map-cust-6', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-5', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-7', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of date of birth.', createdAt: now },
  { id: 'map-cust-7', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-6', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-8', transformationType: 'direct', confidence: 95, status: 'suggested', description: 'Direct map of email.', createdAt: now },
  { id: 'map-cust-8', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-7', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-9', transformationType: 'direct', confidence: 92, status: 'suggested', description: 'Direct map of phone number.', createdAt: now },
  { id: 'map-cust-9', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-8', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-10', transformationType: 'computed', formula: "JSON_EXTRACT_SCALAR(ADDR_JSON, '$.street')", confidence: 70, status: 'suggested', description: 'Extract street from JSON.', createdAt: now },
  { id: 'map-cust-10', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-8', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-11', transformationType: 'computed', formula: "JSON_EXTRACT_SCALAR(ADDR_JSON, '$.city')", confidence: 70, status: 'suggested', description: 'Extract city from JSON.', createdAt: now },
  { id: 'map-cust-11', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-8', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-12', transformationType: 'computed', formula: "JSON_EXTRACT_SCALAR(ADDR_JSON, '$.state')", confidence: 70, status: 'suggested', description: 'Extract state from JSON.', createdAt: now },
  { id: 'map-cust-12', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-8', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-13', transformationType: 'computed', formula: "JSON_EXTRACT_SCALAR(ADDR_JSON, '$.zip')", confidence: 70, status: 'suggested', description: 'Extract zip from JSON.', createdAt: now },
  { id: 'map-cust-13', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-9', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-14', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of join date.', createdAt: now },
  { id: 'map-cust-14', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-10', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-15', transformationType: 'case_when', formula: "CASE WHEN STATUS = 'A' THEN 'Active' ELSE 'Inactive' END", confidence: 80, status: 'suggested', description: 'Map status flag to descriptive string.', createdAt: now },
  { id: 'map-cust-15', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-11', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-16', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of preferred channel.', createdAt: now },
  { id: 'map-cust-16', sourceTableId: 'src-db2-customers', sourceColumnId: 'col-db2-customers-12', targetTableId: 'tgt-bq-customers', targetColumnId: 'col-bq-customers-17', transformationType: 'cast', formula: 'CAST(RISK_SCORE AS NUMERIC)', confidence: 75, status: 'suggested', description: 'Cast risk score to NUMERIC.', createdAt: now },
];

// Mappings for src-db2-claims and related tables -> tgt-bq-claims
export const claimsMappings: FieldMapping[] = [
  { id: 'map-claims-1', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-1', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-1', transformationType: 'direct', confidence: 95, status: 'suggested', description: 'Direct map of claim ID.', createdAt: now },
  { id: 'map-claims-2', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-2', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-2', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of policy reference.', createdAt: now },
  { id: 'map-claims-3', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-3', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-3', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of customer reference.', createdAt: now },
  { id: 'map-claims-4', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-4', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-4', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of claim date.', createdAt: now },
  { id: 'map-claims-5', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-5', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-5', transformationType: 'cast', formula: 'CAST(CLM_STATUS AS STRING)', confidence: 92, status: 'suggested', description: 'Cast status to STRING.', createdAt: now },
  { id: 'map-claims-6', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-6', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-6', transformationType: 'cast', formula: 'CAST(CLM_AMT AS NUMERIC)', confidence: 92, status: 'suggested', description: 'Cast claim amount to NUMERIC.', createdAt: now },
  { id: 'map-claims-7', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-7', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-7', transformationType: 'cast', formula: 'CAST(ADJ_AMT AS NUMERIC)', confidence: 92, status: 'suggested', description: 'Cast adjustment amount to NUMERIC.', createdAt: now },
  { id: 'map-claims-8', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-8', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-8', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of settlement date.', createdAt: now },
  { id: 'map-claims-9', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-9', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-9', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of claim JSON.', createdAt: now },
  { id: 'map-claims-10', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-10', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-10', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of loss type.', createdAt: now },
  { id: 'map-claims-11', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-11', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-11', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of reporter.', createdAt: now },
  { id: 'map-claims-12', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-12', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-12', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of incident location.', createdAt: now },
  { id: 'map-claims-13', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-13', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-13', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of incident timestamp.', createdAt: now },
  { id: 'map-claims-14', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-14', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-14', transformationType: 'cast', formula: 'CAST(DAYS_OPEN AS INT64)', confidence: 90, status: 'suggested', description: 'Cast days open to INT64.', createdAt: now },
  { id: 'map-claims-15', sourceTableId: 'src-db2-claims', sourceColumnId: 'col-db2-claims-15', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-15', transformationType: 'cast', formula: 'CAST(PRIORITY_CD AS STRING)', confidence: 90, status: 'suggested', description: 'Cast priority code to STRING.', createdAt: now },
  { id: 'map-claims-payments', sourceTableId: 'src-db2-payments', sourceColumnId: '*', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-16', transformationType: 'custom', formula: 'ARRAY_AGG(STRUCT(...)) FROM DB2_PAYMENTS', confidence: 92, status: 'suggested', description: 'Aggregate payments into a nested array.', createdAt: now },
  { id: 'map-claims-adjustments', sourceTableId: 'src-db2-adjustments', sourceColumnId: '*', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-17', transformationType: 'custom', formula: 'ARRAY_AGG(STRUCT(...)) FROM DB2_ADJUSTMENTS', confidence: 90, status: 'suggested', description: 'Aggregate adjustments into a nested array.', createdAt: now },
  { id: 'map-claims-events', sourceTableId: 'src-db2-claim-events', sourceColumnId: '*', targetTableId: 'tgt-bq-claims', targetColumnId: 'col-bq-claims-18', transformationType: 'custom', formula: 'ARRAY_AGG(STRUCT(...)) FROM DB2_CLAIM_EVENTS', confidence: 90, status: 'suggested', description: 'Aggregate events into a nested array.', createdAt: now },
];

// Mappings for DB2_POLICIES and related tables -> policies_denorm
export const policiesMappings: FieldMapping[] = [
    { id: 'map-policies-1', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'POLICY_ID', targetTableId: 'policies_denorm', targetColumnId: 'policy_key', transformationType: 'direct', confidence: 95, status: 'suggested', description: 'Direct map of policy ID.', createdAt: now },
    { id: 'map-policies-2', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'EFF_DT', targetTableId: 'policies_denorm', targetColumnId: 'effective_on', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of effective date.', createdAt: now },
    { id: 'map-policies-3', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'EXP_DT', targetTableId: 'policies_denorm', targetColumnId: 'expires_on', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of expiration date.', createdAt: now },
    { id: 'map-policies-4', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'POLICY_JSON', targetTableId: 'policies_denorm', targetColumnId: 'policy_document', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of policy JSON.', createdAt: now },
    { id: 'map-policies-5', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'PREMIUM_AMT', targetTableId: 'policies_denorm', targetColumnId: 'total_premium', transformationType: 'cast', formula: 'CAST(PREMIUM_AMT AS NUMERIC)', confidence: 92, status: 'suggested', description: 'Cast premium to NUMERIC.', createdAt: now },
    { id: 'map-policies-6', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'POL_TYPE', targetTableId: 'policies_denorm', targetColumnId: 'product_type', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of policy type.', createdAt: now },
    { id: 'map-policies-7', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'STATUS', targetTableId: 'policies_denorm', targetColumnId: 'status_flag', transformationType: 'cast', formula: 'CAST(STATUS AS STRING)', confidence: 90, status: 'suggested', description: 'Cast status to STRING.', createdAt: now },
    { id: 'map-policies-8', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'RIDER_CNT', targetTableId: 'policies_denorm', targetColumnId: 'rider_count', transformationType: 'cast', formula: 'CAST(RIDER_CNT AS INT64)', confidence: 95, status: 'suggested', description: 'Cast rider count to INT64.', createdAt: now },
    { id: 'map-policies-9', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'RENEWAL_DT', targetTableId: 'policies_denorm', targetColumnId: 'next_renewal', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of renewal date.', createdAt: now },
    { id: 'map-policies-coverages', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'COVERAGES_JSON', targetTableId: 'policies_denorm', targetColumnId: 'coverages', transformationType: 'custom', formula: 'PARSE_JSON(COVERAGES_JSON) and transform to ARRAY<STRUCT>', confidence: 75, status: 'suggested', description: 'Extract and transform coverages from JSON.', createdAt: now },
    { id: 'map-policies-history', sourceTableId: 'DB2_POLICY_HISTORY', sourceColumnId: '*', targetTableId: 'policies_denorm', targetColumnId: 'history_log', transformationType: 'custom', formula: 'ARRAY_AGG(STRUCT(...)) FROM DB2_POLICY_HISTORY', confidence: 88, status: 'suggested', description: 'Aggregate history into a nested array.', createdAt: now }
];

// Mappings for DB2_AGENTS and related tables -> agents_denorm
export const agentsMappings: FieldMapping[] = [
    { id: 'map-agents-1', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'AGENT_ID', targetTableId: 'agents_denorm', targetColumnId: 'agent_key', transformationType: 'direct', confidence: 95, status: 'suggested', description: 'Direct map of agent ID.', createdAt: now },
    { id: 'map-agents-2', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'FIRST_NAME', targetTableId: 'agents_denorm', targetColumnId: 'first_name', transformationType: 'direct', confidence: 95, status: 'suggested', description: 'Direct map of first name.', createdAt: now },
    { id: 'map-agents-3', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'LAST_NAME', targetTableId: 'agents_denorm', targetColumnId: 'last_name', transformationType: 'direct', confidence: 95, status: 'suggested', description: 'Direct map of last name.', createdAt: now },
    { id: 'map-agents-4', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'REGION', targetTableId: 'agents_denorm', targetColumnId: 'sales_region', transformationType: 'cast', formula: 'CAST(REGION AS STRING)', confidence: 95, status: 'suggested', description: 'Cast region to STRING.', createdAt: now },
    { id: 'map-agents-5', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'HIRE_DT', targetTableId: 'agents_denorm', targetColumnId: 'hired_on', transformationType: 'direct', confidence: 95, status: 'suggested', description: 'Direct map of hire date.', createdAt: now },
    { id: 'map-agents-6', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'TERMINATION_DT', targetTableId: 'agents_denorm', targetColumnId: 'left_on', transformationType: 'direct', confidence: 95, status: 'suggested', description: 'Direct map of termination date.', createdAt: now },
    { id: 'map-agents-7', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'AGENT_JSON', targetTableId: 'agents_denorm', targetColumnId: 'profile_data', transformationType: 'direct', confidence: 78, status: 'suggested', description: 'Direct map of agent JSON.', createdAt: now },
    { id: 'map-agents-8', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'STATUS', targetTableId: 'agents_denorm', targetColumnId: 'active_status', transformationType: 'cast', formula: 'CAST(STATUS AS STRING)', confidence: 85, status: 'suggested', description: 'Cast status to STRING.', createdAt: now },
    { id: 'map-agents-9', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'RATING_KEY', targetTableId: 'agents_denorm', targetColumnId: 'performance_rating', transformationType: 'direct', confidence: 95, status: 'suggested', description: 'Direct map of rating key.', createdAt: now },
    { id: 'map-agents-commissions', sourceTableId: 'DB2_COMMISSIONS', sourceColumnId: '*', targetTableId: 'agents_denorm', targetColumnId: 'commission_records', transformationType: 'custom', formula: 'ARRAY_AGG(STRUCT(...)) FROM DB2_COMMISSIONS', confidence: 85, status: 'suggested', description: 'Aggregate commissions into a nested array.', createdAt: now },
];

// Mappings for DB2_RISK_RATINGS -> risk_ratings_denorm
export const riskRatingsMappings: FieldMapping[] = [
    { id: 'map-risk-1', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'RATING_KEY', targetTableId: 'risk_ratings_denorm', targetColumnId: 'rating_id', transformationType: 'direct', confidence: 95, status: 'suggested', description: 'Direct map of rating key.', createdAt: now },
    { id: 'map-risk-2', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'ZIP', targetTableId: 'risk_ratings_denorm', targetColumnId: 'zip_code', transformationType: 'cast', formula: 'CAST(ZIP AS STRING)', confidence: 95, status: 'suggested', description: 'Cast zip to STRING.', createdAt: now },
    { id: 'map-risk-3', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'POL_TYPE', targetTableId: 'risk_ratings_denorm', targetColumnId: 'product_category', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of policy type.', createdAt: now },
    { id: 'map-risk-4', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'RATING_JSON', targetTableId: 'risk_ratings_denorm', targetColumnId: 'rating_details', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of rating JSON.', createdAt: now },
    { id: 'map-risk-5', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'SCORE', targetTableId: 'risk_ratings_denorm', targetColumnId: 'risk_score_metric', transformationType: 'cast', formula: 'CAST(SCORE AS NUMERIC)', confidence: 95, status: 'suggested', description: 'Cast score to NUMERIC.', createdAt: now },
    { id: 'map-risk-6', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'EFFECTIVE_DT', targetTableId: 'risk_ratings_denorm', targetColumnId: 'valid_from', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of effective date.', createdAt: now },
    { id: 'map-risk-7', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'EXPIRATION_DT', targetTableId: 'risk_ratings_denorm', targetColumnId: 'valid_until', transformationType: 'direct', confidence: 90, status: 'suggested', description: 'Direct map of expiration date.', createdAt: now },
];

// =================================================================================
// TABLE MAPPING DEFINITIONS
// =================================================================================

export const mockTableMappings: TableMapping[] = [
  {
    sourceTableId: 'src-db2-customers',
    targetTableId: 'tgt-bq-customers',
    fieldMappings: customerMappings,
    completionPercentage: 100,
    requiredFieldsCovered: 17,
    totalRequiredFields: 17,
  },
  {
    sourceTableId: 'src-db2-claims',
    targetTableId: 'tgt-bq-claims',
    fieldMappings: claimsMappings,
    completionPercentage: 100,
    requiredFieldsCovered: 18,
    totalRequiredFields: 18,
  },
  {
    sourceTableId: 'src-db2-policies',
    targetTableId: 'tgt-bq-policies',
    fieldMappings: policiesMappings,
    completionPercentage: 100,
    requiredFieldsCovered: 11,
    totalRequiredFields: 11,
  },
  {
    sourceTableId: 'src-db2-agents',
    targetTableId: 'tgt-bq-agents',
    fieldMappings: agentsMappings,
    completionPercentage: 100,
    requiredFieldsCovered: 10,
    totalRequiredFields: 10,
  },
  {
    sourceTableId: 'src-db2-risk-ratings',
    targetTableId: 'tgt-bq-risk-ratings',
    fieldMappings: riskRatingsMappings,
    completionPercentage: 100,
    requiredFieldsCovered: 7,
    totalRequiredFields: 7,
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