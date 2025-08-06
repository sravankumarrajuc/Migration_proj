import { LineageGraph, TableNode, ColumnNode, Relationship, KeyMappingLine, SourceToSourceMappingLine } from '@/types/migration';

// =================================================================================
// DB2 SOURCE DEFINITIONS
// =================================================================================

const db2ClaimsColumns: ColumnNode[] = [
  { id: 'col-db2-claims-1', name: 'CLM_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: false },
  { id: 'col-db2-claims-2', name: 'POLICY_REF', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: false, isForeignKey: true, references: { table: 'DB2_POLICIES', column: 'POLICY_ID' } },
  { id: 'col-db2-claims-3', name: 'CUSTOMER_REF', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: false, isForeignKey: true, references: { table: 'DB2_CUSTOMERS', column: 'CUST_ID' } },
  { id: 'col-db2-claims-4', name: 'CLM_DT', dataType: 'DATE', nullable: false, isPrimaryKey: false, isForeignKey: false },
  { id: 'col-db2-claims-5', name: 'CLM_STATUS', dataType: 'CHAR(1)', nullable: true, isPrimaryKey: false, isForeignKey: false },
  { id: 'col-db2-claims-6', name: 'CLM_AMT', dataType: 'DECIMAL(15,2)', nullable: true, isPrimaryKey: false, isForeignKey: false },
  { id: 'col-db2-claims-9', name: 'CLAIM_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false },
];

const db2CustomersColumns: ColumnNode[] = [
  { id: 'col-db2-customers-1', name: 'CUST_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: false },
  { id: 'col-db2-customers-2', name: 'NAME_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false },
  { id: 'col-db2-customers-3', name: 'REGION_CD', dataType: 'CHAR(3)', nullable: true, isPrimaryKey: false, isForeignKey: false },
  { id: 'col-db2-customers-8', name: 'ADDR_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false },
  { id: 'col-db2-customers-10', name: 'STATUS', dataType: 'CHAR(1)', nullable: true, isPrimaryKey: false, isForeignKey: false },
];

const db2PaymentsColumns: ColumnNode[] = [
  { id: 'col-db2-payments-1', name: 'PAY_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: false },
  { id: 'col-db2-payments-2', name: 'CLM_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: false, isForeignKey: true, references: { table: 'DB2_CLAIMS', column: 'CLM_ID' } },
  { id: 'col-db2-payments-5', name: 'PAY_INFO_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false },
];

const db2AdjustmentsColumns: ColumnNode[] = [
    { id: 'col-db2-adjustments-1', name: 'ADJ_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: false },
    { id: 'col-db2-adjustments-2', name: 'CLM_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: false, isForeignKey: true, references: { table: 'DB2_CLAIMS', column: 'CLM_ID' } },
    { id: 'col-db2-adjustments-8', name: 'ADJ_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false },
];

const db2PoliciesColumns: ColumnNode[] = [
    { id: 'col-db2-policies-1', name: 'POLICY_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: false },
    { id: 'col-db2-policies-4', name: 'POLICY_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { id: 'col-db2-policies-7', name: 'COVERAGES_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false },
];

const db2RiskRatingsColumns: ColumnNode[] = [
    { id: 'col-db2-risk-ratings-1', name: 'RATING_KEY', dataType: 'VARCHAR(50)', nullable: false, isPrimaryKey: true, isForeignKey: false },
    { id: 'col-db2-risk-ratings-4', name: 'RATING_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false },
];

const db2ClaimEventsColumns: ColumnNode[] = [
    { id: 'col-db2-claim-events-1', name: 'CLM_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: true, references: { table: 'DB2_CLAIMS', column: 'CLM_ID' } },
    { id: 'col-db2-claim-events-5', name: 'DETAILS_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false },
];

const db2PolicyHistoryColumns: ColumnNode[] = [
    { id: 'col-db2-policy-history-1', name: 'POLICY_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: true, references: { table: 'DB2_POLICIES', column: 'POLICY_ID' } },
    { id: 'col-db2-policy-history-7', name: 'CHANGE_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false },
];

const db2AgentsColumns: ColumnNode[] = [
    { id: 'col-db2-agents-1', name: 'AGENT_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: false },
    { id: 'col-db2-agents-9', name: 'RATING_KEY', dataType: 'VARCHAR(50)', nullable: true, isPrimaryKey: false, isForeignKey: true, references: { table: 'DB2_RISK_RATINGS', column: 'RATING_KEY' } },
];

const db2CommissionsColumns: ColumnNode[] = [
    { id: 'col-db2-commissions-1', name: 'COMM_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: false },
    { id: 'col-db2-commissions-2', name: 'AGENT_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: false, isForeignKey: true, references: { table: 'DB2_AGENTS', column: 'AGENT_ID' } },
    { id: 'col-db2-commissions-3', name: 'CLM_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: false, isForeignKey: true, references: { table: 'DB2_CLAIMS', column: 'CLM_ID' } },
];

// =================================================================================
// BIGQUERY TARGET DEFINITIONS
// =================================================================================

const bqClaimsDenormColumns: ColumnNode[] = [
  { id: 'col-bq-claims-1', name: 'claim_identifier', dataType: 'STRING', nullable: false, isPrimaryKey: true, isForeignKey: false },
  { id: 'col-bq-claims-9', name: 'claim_detail_json', dataType: 'JSON', nullable: true, isPrimaryKey: false, isForeignKey: false },
  { id: 'col-bq-claims-16', name: 'payments', dataType: 'ARRAY<STRUCT<...>>', nullable: true, isPrimaryKey: false, isForeignKey: false },
  { id: 'col-bq-claims-17', name: 'adjustments', dataType: 'ARRAY<STRUCT<...>>', nullable: true, isPrimaryKey: false, isForeignKey: false },
  { id: 'col-bq-claims-18', name: 'events', dataType: 'ARRAY<STRUCT<...>>', nullable: true, isPrimaryKey: false, isForeignKey: false },
];

const bqCustomersDenormColumns: ColumnNode[] = [
  { id: 'col-bq-customers-1', name: 'customer_id', dataType: 'STRING', nullable: false, isPrimaryKey: true, isForeignKey: false },
];

const bqPoliciesDenormColumns: ColumnNode[] = [
    { id: 'col-bq-policies-1', name: 'policy_key', dataType: 'STRING', nullable: false, isPrimaryKey: true, isForeignKey: false },
    { id: 'col-bq-policies-7', name: 'coverages', dataType: 'ARRAY<STRUCT<...>>', nullable: true, isPrimaryKey: false, isForeignKey: false },
    { id: 'col-bq-policies-11', name: 'history_log', dataType: 'ARRAY<STRUCT<...>>', nullable: true, isPrimaryKey: false, isForeignKey: false },
];

const bqRiskRatingsDenormColumns: ColumnNode[] = [
    { id: 'col-bq-risk-ratings-1', name: 'rating_id', dataType: 'STRING', nullable: false, isPrimaryKey: true, isForeignKey: false },
];

const bqAgentsDenormColumns: ColumnNode[] = [
    { id: 'col-bq-agents-1', name: 'agent_key', dataType: 'STRING', nullable: false, isPrimaryKey: true, isForeignKey: false },
    { id: 'col-bq-agents-10', name: 'commission_records', dataType: 'ARRAY<STRUCT<...>>', nullable: true, isPrimaryKey: false, isForeignKey: false },
];

// =================================================================================
// MOCK GRAPH DATA
// =================================================================================

export const mockTables: TableNode[] = [
  // DB2 Source Tables
  { id: 'src-db2-claims', name: 'DB2_CLAIMS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2ClaimsColumns, rowCount: 85230, size: '15.2 MB', lastUpdated: '2025-08-05T10:30:00Z', position: { x: 350, y: 600 } },
  { id: 'src-db2-customers', name: 'DB2_CUSTOMERS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2CustomersColumns, rowCount: 32145, size: '8.1 MB', lastUpdated: '2025-08-05T09:45:00Z', position: { x: 50, y: 275 } },
  { id: 'src-db2-payments', name: 'DB2_PAYMENTS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2PaymentsColumns, rowCount: 125432, size: '22.5 MB', lastUpdated: '2025-08-05T11:00:00Z', position: { x: 350, y: 200 } },
  { id: 'src-db2-adjustments', name: 'DB2_ADJUSTMENTS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2AdjustmentsColumns, rowCount: 45210, size: '7.8 MB', lastUpdated: '2025-08-05T10:55:00Z', position: { x: 350, y: 350 } },
  { id: 'src-db2-policies', name: 'DB2_POLICIES', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2PoliciesColumns, rowCount: 41332, size: '12.3 MB', lastUpdated: '2025-08-05T09:30:00Z', position: { x: 50, y: 500 } },
  { id: 'src-db2-risk-ratings', name: 'DB2_RISK_RATINGS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2RiskRatingsColumns, rowCount: 1500, size: '0.5 MB', lastUpdated: '2025-08-01T12:00:00Z', position: { x: 50, y: 1100 } },
  { id: 'src-db2-claim-events', name: 'DB2_CLAIM_EVENTS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2ClaimEventsColumns, rowCount: 250600, size: '45.1 MB', lastUpdated: '2025-08-05T11:15:00Z', position: { x: 350, y: 500 } },
  { id: 'src-db2-policy-history', name: 'DB2_POLICY_HISTORY', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2PolicyHistoryColumns, rowCount: 98765, size: '18.9 MB', lastUpdated: '2025-08-05T09:35:00Z', position: { x: 50, y: 650 } },
  { id: 'src-db2-agents', name: 'DB2_AGENTS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2AgentsColumns, rowCount: 850, size: '0.3 MB', lastUpdated: '2025-07-29T14:00:00Z', position: { x: 350, y: 800 } },
  { id: 'src-db2-commissions', name: 'DB2_COMMISSIONS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2CommissionsColumns, rowCount: 110234, size: '19.8 MB', lastUpdated: '2025-08-05T11:10:00Z', position: { x: 350, y: 950 } },

  // BigQuery Target Tables
  { id: 'tgt-bq-claims', name: 'claims_denorm', schema: 'project.dataset', type: 'target', dialect: 'bigquery', columns: bqClaimsDenormColumns, rowCount: 0, size: '0 MB', lastUpdated: undefined, position: { x: 1000, y: 275 } },
  { id: 'tgt-bq-customers', name: 'customers_denorm', schema: 'project.dataset', type: 'target', dialect: 'bigquery', columns: bqCustomersDenormColumns, rowCount: 0, size: '0 MB', lastUpdated: undefined, position: { x: 1000, y: 50 } },
  { id: 'tgt-bq-policies', name: 'policies_denorm', schema: 'project.dataset', type: 'target', dialect: 'bigquery', columns: bqPoliciesDenormColumns, rowCount: 0, size: '0 MB', lastUpdated: undefined, position: { x: 1000, y: 575 } },
  { id: 'tgt-bq-risk-ratings', name: 'risk_ratings_denorm', schema: 'project.dataset', type: 'target', dialect: 'bigquery', columns: bqRiskRatingsDenormColumns, rowCount: 0, size: '0 MB', lastUpdated: undefined, position: { x: 1000, y: 1100 } },
  { id: 'tgt-bq-agents', name: 'agents_denorm', schema: 'project.dataset', type: 'target', dialect: 'bigquery', columns: bqAgentsDenormColumns, rowCount: 0, size: '0 MB', lastUpdated: undefined, position: { x: 1000, y: 875 } },
];

export const mockRelationships: Relationship[] = [
  { id: 'rel-1', sourceTable: 'DB2_CLAIMS', sourceColumn: 'CUSTOMER_REF', targetTable: 'DB2_CUSTOMERS', targetColumn: 'CUST_ID', relationshipType: 'one-to-many', confidence: 0.99 },
  { id: 'rel-2', sourceTable: 'DB2_PAYMENTS', sourceColumn: 'CLM_ID', targetTable: 'DB2_CLAIMS', targetColumn: 'CLM_ID', relationshipType: 'one-to-many', confidence: 0.99 },
  { id: 'rel-3', sourceTable: 'DB2_CLAIMS', sourceColumn: 'POLICY_REF', targetTable: 'DB2_POLICIES', targetColumn: 'POLICY_ID', relationshipType: 'one-to-many', confidence: 0.99 },
  { id: 'rel-4', sourceTable: 'DB2_ADJUSTMENTS', sourceColumn: 'CLM_ID', targetTable: 'DB2_CLAIMS', targetColumn: 'CLM_ID', relationshipType: 'one-to-many', confidence: 0.99 },
  { id: 'rel-5', sourceTable: 'DB2_CLAIM_EVENTS', sourceColumn: 'CLM_ID', targetTable: 'DB2_CLAIMS', targetColumn: 'CLM_ID', relationshipType: 'one-to-many', confidence: 0.99 },
  { id: 'rel-6', sourceTable: 'DB2_POLICY_HISTORY', sourceColumn: 'POLICY_ID', targetTable: 'DB2_POLICIES', targetColumn: 'POLICY_ID', relationshipType: 'one-to-many', confidence: 0.99 },
  { id: 'rel-7', sourceTable: 'DB2_AGENTS', sourceColumn: 'RATING_KEY', targetTable: 'DB2_RISK_RATINGS', targetColumn: 'RATING_KEY', relationshipType: 'one-to-many', confidence: 0.99 },
  { id: 'rel-8', sourceTable: 'DB2_COMMISSIONS', sourceColumn: 'AGENT_ID', targetTable: 'DB2_AGENTS', targetColumn: 'AGENT_ID', relationshipType: 'one-to-many', confidence: 0.99 },
  { id: 'rel-9', sourceTable: 'DB2_COMMISSIONS', sourceColumn: 'CLM_ID', targetTable: 'DB2_CLAIMS', targetColumn: 'CLM_ID', relationshipType: 'one-to-many', confidence: 0.99 },
];

export const mockKeyMappings: KeyMappingLine[] = [
  { id: 'key-map-1', sourceTable: 'src-db2-claims', sourceColumn: 'CLM_ID', targetTable: 'tgt-bq-claims', targetColumn: 'claim_identifier', confidence: 0.98 },
  { id: 'key-map-2', sourceTable: 'src-db2-customers', sourceColumn: 'CUST_ID', targetTable: 'tgt-bq-customers', targetColumn: 'customer_id', confidence: 0.98 },
  { id: 'key-map-3', sourceTable: 'src-db2-policies', sourceColumn: 'POLICY_ID', targetTable: 'tgt-bq-policies', targetColumn: 'policy_key', confidence: 0.98 },
  { id: 'key-map-4', sourceTable: 'src-db2-agents', sourceColumn: 'AGENT_ID', targetTable: 'tgt-bq-agents', targetColumn: 'agent_key', confidence: 0.98 },
  { id: 'key-map-5', sourceTable: 'src-db2-risk-ratings', sourceColumn: 'RATING_KEY', targetTable: 'tgt-bq-risk-ratings', targetColumn: 'rating_id', confidence: 0.98 },
];

export const mockSourceToSourceMappings: SourceToSourceMappingLine[] = [
    { id: 's2s-map-1', sourceTable: 'src-db2-claims', targetTable: 'src-db2-customers', confidence: 0.99, description: 'Claims have Customers' },
    { id: 's2s-map-2', sourceTable: 'src-db2-claims', targetTable: 'src-db2-policies', confidence: 0.99, description: 'Claims are based on Policies' },
    { id: 's2s-map-3', sourceTable: 'src-db2-payments', targetTable: 'src-db2-claims', confidence: 0.99, description: 'Payments are for Claims' },
];

export const dfdMappingData = {
  tables: [
    // Source DB2 Tables
    { id: 'DB2_CUSTOMERS', name: 'DB2_CUSTOMERS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 50 } },
    { id: 'DB2_POLICIES', name: 'DB2_POLICIES', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 250 } },
    { id: 'DB2_POLICY_HISTORY', name: 'DB2_POLICY_HISTORY', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 400 } },
    { id: 'DB2_CLAIMS', name: 'DB2_CLAIMS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 600 } },
    { id: 'DB2_PAYMENTS', name: 'DB2_PAYMENTS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 750 } },
    { id: 'DB2_ADJUSTMENTS', name: 'DB2_ADJUSTMENTS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 900 } },
    { id: 'DB2_CLAIM_EVENTS', name: 'DB2_CLAIM_EVENTS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 1050 } },
    { id: 'DB2_AGENTS', name: 'DB2_AGENTS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 1250 } },
    { id: 'DB2_COMMISSIONS', name: 'DB2_COMMISSIONS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 1400 } },
    { id: 'DB2_RISK_RATINGS', name: 'DB2_RISK_RATINGS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 1550 } },
    
    // Intermediate CTEs from DB2
    { id: 'DB2_CTE_Combined', name: 'DB2 Combined Data', type: 'intermediate', schema: 'CTE', dialect: 'db2', position: { x: 450, y: 800 } },
    { id: 'DB2_CTE_Final', name: 'DB2 Final Report', type: 'intermediate', schema: 'CTE', dialect: 'db2', position: { x: 800, y: 800 } },

    // Target BigQuery Tables
    { id: 'customers_denorm', name: 'customers_denorm', type: 'target', schema: 'project.dataset', dialect: 'bigquery', position: { x: 1150, y: 50 } },
    { id: 'policies_denorm', name: 'policies_denorm', type: 'target', schema: 'project.dataset', dialect: 'bigquery', position: { x: 1150, y: 325 } },
    { id: 'claims_denorm', name: 'claims_denorm', type: 'target', schema: 'project.dataset', dialect: 'bigquery', position: { x: 1150, y: 825 } },
    { id: 'agents_denorm', name: 'agents_denorm', type: 'target', schema: 'project.dataset', dialect: 'bigquery', position: { x: 1150, y: 1325 } },
    { id: 'risk_ratings_denorm', name: 'risk_ratings_denorm', type: 'target', schema: 'project.dataset', dialect: 'bigquery', position: { x: 1150, y: 1550 } },
  ],
  mappings: [
    // Inter-Source Mappings (Solid Lines) - DB2 Base Tables to DB2 CTE
    { id: 'dfd-is-map-1', sourceTable: 'DB2_CUSTOMERS', targetTable: 'DB2_CTE_Combined', confidence: 0.99, lineStyle: 'solid', path: [{ x: 250, y: 100 }, { x: 450, y: 800 }] },
    { id: 'dfd-is-map-2', sourceTable: 'DB2_POLICIES', targetTable: 'DB2_CTE_Combined', confidence: 0.99, lineStyle: 'solid', path: [{ x: 250, y: 300 }, { x: 450, y: 800 }] },
    { id: 'dfd-is-map-3', sourceTable: 'DB2_CLAIMS', targetTable: 'DB2_CTE_Combined', confidence: 0.99, lineStyle: 'solid', path: [{ x: 250, y: 650 }, { x: 450, y: 800 }] },
    { id: 'dfd-is-map-4', sourceTable: 'DB2_PAYMENTS', targetTable: 'DB2_CTE_Combined', confidence: 0.99, lineStyle: 'solid', path: [{ x: 250, y: 800 }, { x: 450, y: 800 }] },
    { id: 'dfd-is-map-5', sourceTable: 'DB2_AGENTS', targetTable: 'DB2_CTE_Combined', confidence: 0.99, lineStyle: 'solid', path: [{ x: 250, y: 1300 }, { x: 450, y: 800 }] },
    { id: 'dfd-is-map-6', sourceTable: 'DB2_RISK_RATINGS', targetTable: 'DB2_CTE_Combined', confidence: 0.99, lineStyle: 'solid', path: [{ x: 250, y: 1600 }, { x: 450, y: 800 }] },
    { id: 'dfd-is-map-7', sourceTable: 'DB2_CTE_Combined', targetTable: 'DB2_CTE_Final', confidence: 0.99, lineStyle: 'solid', path: [{ x: 650, y: 825 }, { x: 800, y: 825 }] },

    // Source-to-Target Mappings (Dotted Lines) - DB2 Final CTE to BQ Denormalized Tables
    { id: 'dfd-st-map-1', sourceTable: 'DB2_CTE_Final', targetTable: 'customers_denorm', confidence: 0.95, lineStyle: 'dotted', path: [{ x: 1000, y: 825 }, { x: 1150, y: 100 }] },
    { id: 'dfd-st-map-2', sourceTable: 'DB2_CTE_Final', targetTable: 'policies_denorm', confidence: 0.95, lineStyle: 'dotted', path: [{ x: 1000, y: 825 }, { x: 1150, y: 375 }] },
    { id: 'dfd-st-map-3', sourceTable: 'DB2_CTE_Final', targetTable: 'claims_denorm', confidence: 0.95, lineStyle: 'dotted', path: [{ x: 1000, y: 825 }, { x: 1150, y: 875 }] },
    { id: 'dfd-st-map-4', sourceTable: 'DB2_CTE_Final', targetTable: 'agents_denorm', confidence: 0.95, lineStyle: 'dotted', path: [{ x: 1000, y: 825 }, { x: 1150, y: 1375 }] },
    { id: 'dfd-st-map-5', sourceTable: 'DB2_CTE_Final', targetTable: 'risk_ratings_denorm', confidence: 0.95, lineStyle: 'dotted', path: [{ x: 1000, y: 825 }, { x: 1150, y: 1600 }] },
  ]
};

export const mockLineageGraph: LineageGraph = {
  tables: mockTables,
  relationships: mockRelationships,
  keyMappings: mockKeyMappings,
  sourceToSourceMappings: mockSourceToSourceMappings,
  mappings: dfdMappingData.mappings,
  statistics: {
    totalTables: mockTables.length,
    totalColumns: mockTables.reduce((sum, table) => sum + table.columns.length, 0),
    totalRelationships: mockRelationships.length,
    totalMappings: dfdMappingData.mappings.length,
    complexityScore: 9.5
  }
};
// Discovery processing steps
export const discoverySteps = [
  { step: 'Analyzing schema files...', duration: 1000 },
  { step: 'Extracting table definitions...', duration: 1500 },
  { step: 'Identifying column relationships...', duration: 2000 },
  { step: 'Calculating data lineage...', duration: 1800 },
  { step: 'Generating metadata catalog...', duration: 1200 },
  { step: 'Building lineage graph...', duration: 800 },
  { step: 'Discovery complete!', duration: 500 }
];

