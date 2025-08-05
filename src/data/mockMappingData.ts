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

// Mappings for DB2_CUSTOMERS -> customers_denorm
const customerMappings: FieldMapping[] = [
  { id: 'map-cust-1', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'CUST_ID', targetTableId: 'customers_denorm', targetColumnId: 'customer_id', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of customer ID.', createdAt: now },
  { id: 'map-cust-2', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'NAME_JSON', targetTableId: 'customers_denorm', targetColumnId: 'name_first', transformationType: 'computed', formula: "JSON_EXTRACT_SCALAR(NAME_JSON, '$.first')", confidence: 85, status: undefined, description: 'Extract first name from JSON.', createdAt: now },
  { id: 'map-cust-3', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'NAME_JSON', targetTableId: 'customers_denorm', targetColumnId: 'name_last', transformationType: 'computed', formula: "JSON_EXTRACT_SCALAR(NAME_JSON, '$.last')", confidence: 85, status: undefined, description: 'Extract last name from JSON.', createdAt: now },
  { id: 'map-cust-4', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'REGION_CD', targetTableId: 'customers_denorm', targetColumnId: 'region_code', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of region code.', createdAt: now },
  { id: 'map-cust-5', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'SEGMENT', targetTableId: 'customers_denorm', targetColumnId: 'customer_segment', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of customer segment.', createdAt: now },
  { id: 'map-cust-6', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'DOB', targetTableId: 'customers_denorm', targetColumnId: 'date_of_birth', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of date of birth.', createdAt: now },
  { id: 'map-cust-7', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'EMAIL', targetTableId: 'customers_denorm', targetColumnId: 'email_address', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of email.', createdAt: now },
  { id: 'map-cust-8', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'PHONE', targetTableId: 'customers_denorm', targetColumnId: 'phone_number', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of phone number.', createdAt: now },
  { id: 'map-cust-9', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'ADDR_JSON', targetTableId: 'customers_denorm', targetColumnId: 'address_street', transformationType: 'computed', formula: "JSON_EXTRACT_SCALAR(ADDR_JSON, '$.street')", confidence: 85, status: undefined, description: 'Extract street from JSON.', createdAt: now },
  { id: 'map-cust-10', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'ADDR_JSON', targetTableId: 'customers_denorm', targetColumnId: 'address_city', transformationType: 'computed', formula: "JSON_EXTRACT_SCALAR(ADDR_JSON, '$.city')", confidence: 85, status: undefined, description: 'Extract city from JSON.', createdAt: now },
  { id: 'map-cust-11', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'ADDR_JSON', targetTableId: 'customers_denorm', targetColumnId: 'address_state', transformationType: 'computed', formula: "JSON_EXTRACT_SCALAR(ADDR_JSON, '$.state')", confidence: 85, status: undefined, description: 'Extract state from JSON.', createdAt: now },
  { id: 'map-cust-12', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'ADDR_JSON', targetTableId: 'customers_denorm', targetColumnId: 'address_postcode', transformationType: 'computed', formula: "JSON_EXTRACT_SCALAR(ADDR_JSON, '$.zip')", confidence: 85, status: undefined, description: 'Extract zip from JSON.', createdAt: now },
  { id: 'map-cust-13', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'JOIN_DT', targetTableId: 'customers_denorm', targetColumnId: 'joined_on', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of join date.', createdAt: now },
  { id: 'map-cust-14', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'STATUS', targetTableId: 'customers_denorm', targetColumnId: 'active_flag', transformationType: 'case_when', formula: "CASE WHEN STATUS = 'A' THEN 'Active' ELSE 'Inactive' END", confidence: 90, status: undefined, description: 'Map status flag to descriptive string.', createdAt: now },
  { id: 'map-cust-15', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'PREF_CHANNEL', targetTableId: 'customers_denorm', targetColumnId: 'preferred_contact', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of preferred channel.', createdAt: now },
  { id: 'map-cust-16', sourceTableId: 'DB2_CUSTOMERS', sourceColumnId: 'RISK_SCORE', targetTableId: 'customers_denorm', targetColumnId: 'customer_risk_score', transformationType: 'cast', formula: 'CAST(RISK_SCORE AS NUMERIC)', confidence: 95, status: undefined, description: 'Cast risk score to NUMERIC.', createdAt: now },
];

// Mappings for DB2_CLAIMS and related tables -> claims_denorm
const claimsMappings: FieldMapping[] = [
  { id: 'map-claims-1', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'CLM_ID', targetTableId: 'claims_denorm', targetColumnId: 'claim_identifier', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of claim ID.', createdAt: now },
  { id: 'map-claims-2', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'POLICY_REF', targetTableId: 'claims_denorm', targetColumnId: 'policy_code', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of policy reference.', createdAt: now },
  { id: 'map-claims-3', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'CUSTOMER_REF', targetTableId: 'claims_denorm', targetColumnId: 'client_key', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of customer reference.', createdAt: now },
  { id: 'map-claims-4', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'CLM_DT', targetTableId: 'claims_denorm', targetColumnId: 'claim_open_date', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of claim date.', createdAt: now },
  { id: 'map-claims-5', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'CLM_STATUS', targetTableId: 'claims_denorm', targetColumnId: 'status_code', transformationType: 'cast', formula: 'CAST(CLM_STATUS AS STRING)', confidence: 95, status: undefined, description: 'Cast status to STRING.', createdAt: now },
  { id: 'map-claims-6', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'CLM_AMT', targetTableId: 'claims_denorm', targetColumnId: 'claim_value', transformationType: 'cast', formula: 'CAST(CLM_AMT AS NUMERIC)', confidence: 95, status: undefined, description: 'Cast claim amount to NUMERIC.', createdAt: now },
  { id: 'map-claims-7', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'ADJ_AMT', targetTableId: 'claims_denorm', targetColumnId: 'adjustment_value', transformationType: 'cast', formula: 'CAST(ADJ_AMT AS NUMERIC)', confidence: 95, status: undefined, description: 'Cast adjustment amount to NUMERIC.', createdAt: now },
  { id: 'map-claims-8', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'SETTLE_DT', targetTableId: 'claims_denorm', targetColumnId: 'resolution_date', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of settlement date.', createdAt: now },
  { id: 'map-claims-9', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'CLAIM_JSON', targetTableId: 'claims_denorm', targetColumnId: 'claim_detail_json', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of claim JSON.', createdAt: now },
  { id: 'map-claims-10', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'LOSS_TYPE', targetTableId: 'claims_denorm', targetColumnId: 'loss_category', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of loss type.', createdAt: now },
  { id: 'map-claims-11', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'REPORTED_BY', targetTableId: 'claims_denorm', targetColumnId: 'report_owner', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of reporter.', createdAt: now },
  { id: 'map-claims-12', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'INCIDENT_LOC', targetTableId: 'claims_denorm', targetColumnId: 'incident_address', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of incident location.', createdAt: now },
  { id: 'map-claims-13', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'INCIDENT_DT', targetTableId: 'claims_denorm', targetColumnId: 'incident_timestamp', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of incident timestamp.', createdAt: now },
  { id: 'map-claims-14', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'DAYS_OPEN', targetTableId: 'claims_denorm', targetColumnId: 'days_to_resolution', transformationType: 'cast', formula: 'CAST(DAYS_OPEN AS INT64)', confidence: 95, status: undefined, description: 'Cast days open to INT64.', createdAt: now },
  { id: 'map-claims-15', sourceTableId: 'DB2_CLAIMS', sourceColumnId: 'PRIORITY_CD', targetTableId: 'claims_denorm', targetColumnId: 'priority_level', transformationType: 'cast', formula: 'CAST(PRIORITY_CD AS STRING)', confidence: 95, status: undefined, description: 'Cast priority code to STRING.', createdAt: now },
  { id: 'map-claims-payments', sourceTableId: 'DB2_PAYMENTS', sourceColumnId: '*', targetTableId: 'claims_denorm', targetColumnId: 'payments', transformationType: 'custom', formula: 'ARRAY_AGG(STRUCT(...)) FROM DB2_PAYMENTS', confidence: 80, status: undefined, description: 'Aggregate payments into a nested array.', createdAt: now },
  { id: 'map-claims-adjustments', sourceTableId: 'DB2_ADJUSTMENTS', sourceColumnId: '*', targetTableId: 'claims_denorm', targetColumnId: 'adjustments', transformationType: 'custom', formula: 'ARRAY_AGG(STRUCT(...)) FROM DB2_ADJUSTMENTS', confidence: 80, status: undefined, description: 'Aggregate adjustments into a nested array.', createdAt: now },
  { id: 'map-claims-events', sourceTableId: 'DB2_CLAIM_EVENTS', sourceColumnId: '*', targetTableId: 'claims_denorm', targetColumnId: 'events', transformationType: 'custom', formula: 'ARRAY_AGG(STRUCT(...)) FROM DB2_CLAIM_EVENTS', confidence: 80, status: undefined, description: 'Aggregate events into a nested array.', createdAt: now },
];

// Mappings for DB2_POLICIES and related tables -> policies_denorm
const policiesMappings: FieldMapping[] = [
    { id: 'map-policies-1', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'POLICY_ID', targetTableId: 'policies_denorm', targetColumnId: 'policy_key', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of policy ID.', createdAt: now },
    { id: 'map-policies-2', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'EFF_DT', targetTableId: 'policies_denorm', targetColumnId: 'effective_on', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of effective date.', createdAt: now },
    { id: 'map-policies-3', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'EXP_DT', targetTableId: 'policies_denorm', targetColumnId: 'expires_on', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of expiration date.', createdAt: now },
    { id: 'map-policies-4', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'POLICY_JSON', targetTableId: 'policies_denorm', targetColumnId: 'policy_document', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of policy JSON.', createdAt: now },
    { id: 'map-policies-5', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'PREMIUM_AMT', targetTableId: 'policies_denorm', targetColumnId: 'total_premium', transformationType: 'cast', formula: 'CAST(PREMIUM_AMT AS NUMERIC)', confidence: 95, status: undefined, description: 'Cast premium to NUMERIC.', createdAt: now },
    { id: 'map-policies-6', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'POL_TYPE', targetTableId: 'policies_denorm', targetColumnId: 'product_type', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of policy type.', createdAt: now },
    { id: 'map-policies-7', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'STATUS', targetTableId: 'policies_denorm', targetColumnId: 'status_flag', transformationType: 'cast', formula: 'CAST(STATUS AS STRING)', confidence: 95, status: undefined, description: 'Cast status to STRING.', createdAt: now },
    { id: 'map-policies-8', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'RIDER_CNT', targetTableId: 'policies_denorm', targetColumnId: 'rider_count', transformationType: 'cast', formula: 'CAST(RIDER_CNT AS INT64)', confidence: 95, status: undefined, description: 'Cast rider count to INT64.', createdAt: now },
    { id: 'map-policies-9', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'RENEWAL_DT', targetTableId: 'policies_denorm', targetColumnId: 'next_renewal', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of renewal date.', createdAt: now },
    { id: 'map-policies-coverages', sourceTableId: 'DB2_POLICIES', sourceColumnId: 'COVERAGES_JSON', targetTableId: 'policies_denorm', targetColumnId: 'coverages', transformationType: 'custom', formula: 'PARSE_JSON(COVERAGES_JSON) and transform to ARRAY<STRUCT>', confidence: 80, status: undefined, description: 'Extract and transform coverages from JSON.', createdAt: now },
    { id: 'map-policies-history', sourceTableId: 'DB2_POLICY_HISTORY', sourceColumnId: '*', targetTableId: 'policies_denorm', targetColumnId: 'history_log', transformationType: 'custom', formula: 'ARRAY_AGG(STRUCT(...)) FROM DB2_POLICY_HISTORY', confidence: 80, status: undefined, description: 'Aggregate history into a nested array.', createdAt: now }
];

// Mappings for DB2_AGENTS and related tables -> agents_denorm
const agentsMappings: FieldMapping[] = [
    { id: 'map-agents-1', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'AGENT_ID', targetTableId: 'agents_denorm', targetColumnId: 'agent_key', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of agent ID.', createdAt: now },
    { id: 'map-agents-2', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'FIRST_NAME', targetTableId: 'agents_denorm', targetColumnId: 'first_name', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of first name.', createdAt: now },
    { id: 'map-agents-3', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'LAST_NAME', targetTableId: 'agents_denorm', targetColumnId: 'last_name', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of last name.', createdAt: now },
    { id: 'map-agents-4', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'REGION', targetTableId: 'agents_denorm', targetColumnId: 'sales_region', transformationType: 'cast', formula: 'CAST(REGION AS STRING)', confidence: 95, status: undefined, description: 'Cast region to STRING.', createdAt: now },
    { id: 'map-agents-5', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'HIRE_DT', targetTableId: 'agents_denorm', targetColumnId: 'hired_on', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of hire date.', createdAt: now },
    { id: 'map-agents-6', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'TERMINATION_DT', targetTableId: 'agents_denorm', targetColumnId: 'left_on', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of termination date.', createdAt: now },
    { id: 'map-agents-7', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'AGENT_JSON', targetTableId: 'agents_denorm', targetColumnId: 'profile_data', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of agent JSON.', createdAt: now },
    { id: 'map-agents-8', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'STATUS', targetTableId: 'agents_denorm', targetColumnId: 'active_status', transformationType: 'cast', formula: 'CAST(STATUS AS STRING)', confidence: 95, status: undefined, description: 'Cast status to STRING.', createdAt: now },
    { id: 'map-agents-9', sourceTableId: 'DB2_AGENTS', sourceColumnId: 'RATING_KEY', targetTableId: 'agents_denorm', targetColumnId: 'performance_rating', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of rating key.', createdAt: now },
    { id: 'map-agents-commissions', sourceTableId: 'DB2_COMMISSIONS', sourceColumnId: '*', targetTableId: 'agents_denorm', targetColumnId: 'commission_records', transformationType: 'custom', formula: 'ARRAY_AGG(STRUCT(...)) FROM DB2_COMMISSIONS', confidence: 80, status: undefined, description: 'Aggregate commissions into a nested array.', createdAt: now },
];

// Mappings for DB2_RISK_RATINGS -> risk_ratings_denorm
const riskRatingsMappings: FieldMapping[] = [
    { id: 'map-risk-1', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'RATING_KEY', targetTableId: 'risk_ratings_denorm', targetColumnId: 'rating_id', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of rating key.', createdAt: now },
    { id: 'map-risk-2', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'ZIP', targetTableId: 'risk_ratings_denorm', targetColumnId: 'zip_code', transformationType: 'cast', formula: 'CAST(ZIP AS STRING)', confidence: 95, status: undefined, description: 'Cast zip to STRING.', createdAt: now },
    { id: 'map-risk-3', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'POL_TYPE', targetTableId: 'risk_ratings_denorm', targetColumnId: 'product_category', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of policy type.', createdAt: now },
    { id: 'map-risk-4', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'RATING_JSON', targetTableId: 'risk_ratings_denorm', targetColumnId: 'rating_details', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of rating JSON.', createdAt: now },
    { id: 'map-risk-5', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'SCORE', targetTableId: 'risk_ratings_denorm', targetColumnId: 'risk_score_metric', transformationType: 'cast', formula: 'CAST(SCORE AS NUMERIC)', confidence: 95, status: undefined, description: 'Cast score to NUMERIC.', createdAt: now },
    { id: 'map-risk-6', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'EFFECTIVE_DT', targetTableId: 'risk_ratings_denorm', targetColumnId: 'valid_from', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of effective date.', createdAt: now },
    { id: 'map-risk-7', sourceTableId: 'DB2_RISK_RATINGS', sourceColumnId: 'EXPIRATION_DT', targetTableId: 'risk_ratings_denorm', targetColumnId: 'valid_until', transformationType: 'direct', confidence: 99, status: undefined, description: 'Direct map of expiration date.', createdAt: now },
];

// =================================================================================
// TABLE MAPPING DEFINITIONS
// =================================================================================

export const mockTableMappings: TableMapping[] = [
  {
    sourceTableId: 'DB2_CUSTOMERS',
    targetTableId: 'customers_denorm',
    fieldMappings: customerMappings,
    completionPercentage: 100,
    requiredFieldsCovered: 17,
    totalRequiredFields: 17,
  },
  {
    sourceTableId: 'DB2_CLAIMS',
    targetTableId: 'claims_denorm',
    fieldMappings: claimsMappings,
    completionPercentage: 100,
    requiredFieldsCovered: 18,
    totalRequiredFields: 18,
  },
  {
    sourceTableId: 'DB2_POLICIES',
    targetTableId: 'policies_denorm',
    fieldMappings: policiesMappings,
    completionPercentage: 100,
    requiredFieldsCovered: 11,
    totalRequiredFields: 11,
  },
  {
    sourceTableId: 'DB2_AGENTS',
    targetTableId: 'agents_denorm',
    fieldMappings: agentsMappings,
    completionPercentage: 100,
    requiredFieldsCovered: 10,
    totalRequiredFields: 10,
  },
  {
    sourceTableId: 'DB2_RISK_RATINGS',
    targetTableId: 'risk_ratings_denorm',
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