import { LineageGraph, TableNode, ColumnNode, Relationship } from '@/types/migration';

// =================================================================================
// DB2 SOURCE DEFINITIONS
// =================================================================================

// Columns for INSURANCE.DB2_CLAIMS
const db2ClaimsColumns: ColumnNode[] = [
  { id: 'col-db2-claims-1', name: 'CLM_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Unique claim identifier.' },
  { id: 'col-db2-claims-2', name: 'POLICY_REF', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: false, isForeignKey: true, references: { table: 'DB2_POLICIES', column: 'POLICY_ID' }, description: 'Reference to the policy table.' },
  { id: 'col-db2-claims-3', name: 'CUSTOMER_REF', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: false, isForeignKey: true, references: { table: 'DB2_CUSTOMERS', column: 'CUST_ID' }, description: 'Reference to the customer table.' },
  { id: 'col-db2-claims-4', name: 'CLM_DT', dataType: 'DATE', nullable: false, isPrimaryKey: false, isForeignKey: false, description: 'Date the claim was filed.' },
  { id: 'col-db2-claims-5', name: 'CLM_STATUS', dataType: 'CHAR(1)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Status of the claim (e.g., O-Open, C-Closed).' },
  { id: 'col-db2-claims-6', name: 'CLM_AMT', dataType: 'DECIMAL(15,2)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'The total amount claimed by the customer.' },
  { id: 'col-db2-claims-7', name: 'ADJ_AMT', dataType: 'DECIMAL(15,2)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'The adjusted amount after review.' },
  { id: 'col-db2-claims-8', name: 'SETTLE_DT', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Date the claim was settled.' },
  { id: 'col-db2-claims-9', name: 'CLAIM_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'JSON blob containing detailed claim information.' },
  { id: 'col-db2-claims-10', name: 'LOSS_TYPE', dataType: 'VARCHAR(20)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Type of loss reported (e.g., Theft, Accident).' },
  { id: 'col-db2-claims-11', name: 'REPORTED_BY', dataType: 'VARCHAR(50)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Person who reported the claim.' },
  { id: 'col-db2-claims-12', name: 'INCIDENT_LOC', dataType: 'VARCHAR(100)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Location of the incident.' },
  { id: 'col-db2-claims-13', name: 'INCIDENT_DT', dataType: 'TIMESTAMP', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Timestamp of when the incident occurred.' },
  { id: 'col-db2-claims-14', name: 'DAYS_OPEN', dataType: 'INTEGER', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Number of days the claim has been open.' },
  { id: 'col-db2-claims-15', name: 'PRIORITY_CD', dataType: 'CHAR(2)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Priority code for handling the claim.' }
];

// Columns for INSURANCE.DB2_CUSTOMERS
const db2CustomersColumns: ColumnNode[] = [
  { id: 'col-db2-customers-1', name: 'CUST_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Unique customer identifier.' },
  { id: 'col-db2-customers-2', name: 'NAME_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'JSON blob with customer name details (first, last).' },
  { id: 'col-db2-customers-3', name: 'REGION_CD', dataType: 'CHAR(3)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Region code for the customer.' },
  { id: 'col-db2-customers-4', name: 'SEGMENT', dataType: 'VARCHAR(20)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Customer segment (e.g., Premium, Standard).' },
  { id: 'col-db2-customers-5', name: 'DOB', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Customer\'s date of birth.' },
  { id: 'col-db2-customers-6', name: 'EMAIL', dataType: 'VARCHAR(100)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Customer\'s email address.' },
  { id: 'col-db2-customers-7', name: 'PHONE', dataType: 'VARCHAR(20)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Customer\'s phone number.' },
  { id: 'col-db2-customers-8', name: 'ADDR_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'JSON blob with customer address details.' },
  { id: 'col-db2-customers-9', name: 'JOIN_DT', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Date the customer joined.' },
  { id: 'col-db2-customers-10', name: 'STATUS', dataType: 'CHAR(1)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Customer status (e.g., A-Active, I-Inactive).' },
  { id: 'col-db2-customers-11', name: 'PREF_CHANNEL', dataType: 'VARCHAR(10)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Preferred communication channel.' },
  { id: 'col-db2-customers-12', name: 'RISK_SCORE', dataType: 'DECIMAL(5,2)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Calculated risk score for the customer.' }
];

// Columns for INSURANCE.DB2_PAYMENTS
const db2PaymentsColumns: ColumnNode[] = [
  { id: 'col-db2-payments-1', name: 'PAY_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Unique payment identifier.' },
  { id: 'col-db2-payments-2', name: 'CLM_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: false, isForeignKey: true, references: { table: 'DB2_CLAIMS', column: 'CLM_ID' }, description: 'Reference to the claim being paid.' },
  { id: 'col-db2-payments-3', name: 'PAY_DT', dataType: 'TIMESTAMP', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Timestamp of the payment.' },
  { id: 'col-db2-payments-4', name: 'AMT_PAID', dataType: 'DECIMAL(15,2)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Amount paid.' },
  { id: 'col-db2-payments-5', name: 'PAY_INFO_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'JSON blob with additional payment info.' },
  { id: 'col-db2-payments-6', name: 'PAY_METHOD', dataType: 'VARCHAR(20)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Method of payment (e.g., Card, Bank Transfer).' },
  { id: 'col-db2-payments-7', name: 'RECEIPT_NO', dataType: 'VARCHAR(30)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Receipt number for the transaction.' },
  { id: 'col-db2-payments-8', name: 'BANK_CODE', dataType: 'CHAR(4)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Identifier for the bank.' },
  { id: 'col-db2-payments-9', name: 'CHANNEL', dataType: 'VARCHAR(10)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Channel through which payment was made (e.g., Online, Agent).' },
  { id: 'col-db2-payments-10', name: 'STATUS', dataType: 'CHAR(1)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Status of the payment (e.g., S-Success, F-Failed).' }
];

// Columns for INSURANCE.DB2_ADJUSTMENTS
const db2AdjustmentsColumns: ColumnNode[] = [
    { id: 'col-db2-adjustments-1', name: 'ADJ_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Unique adjustment identifier.' },
    { id: 'col-db2-adjustments-2', name: 'CLM_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: false, isForeignKey: true, references: { table: 'DB2_CLAIMS', column: 'CLM_ID' }, description: 'Reference to the claim being adjusted.' },
    { id: 'col-db2-adjustments-3', name: 'ADJ_DT', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Date of the adjustment.' },
    { id: 'col-db2-adjustments-4', name: 'ADJ_AMT_SRC', dataType: 'DECIMAL(15,2)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Original adjustment amount.' },
    { id: 'col-db2-adjustments-5', name: 'ADJ_AMT_CORR', dataType: 'DECIMAL(15,2)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Corrected adjustment amount.' },
    { id: 'col-db2-adjustments-6', name: 'REASON_CD', dataType: 'VARCHAR(10)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Reason code for the adjustment.' },
    { id: 'col-db2-adjustments-7', name: 'COMMENTS', dataType: 'VARCHAR(255)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Comments regarding the adjustment.' },
    { id: 'col-db2-adjustments-8', name: 'ADJ_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'JSON blob with additional adjustment details.' }
];

// Columns for INSURANCE.DB2_POLICIES
const db2PoliciesColumns: ColumnNode[] = [
    { id: 'col-db2-policies-1', name: 'POLICY_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Unique policy identifier.' },
    { id: 'col-db2-policies-2', name: 'EFF_DT', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Effective date of the policy.' },
    { id: 'col-db2-policies-3', name: 'EXP_DT', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Expiration date of the policy.' },
    { id: 'col-db2-policies-4', name: 'POLICY_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'JSON blob with detailed policy information.' },
    { id: 'col-db2-policies-5', name: 'PREMIUM_AMT', dataType: 'DECIMAL(15,2)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'The premium amount for the policy.' },
    { id: 'col-db2-policies-6', name: 'POL_TYPE', dataType: 'VARCHAR(20)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Type of policy (e.g., Auto, Home).' },
    { id: 'col-db2-policies-7', name: 'COVERAGES_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'JSON blob detailing policy coverages.' },
    { id: 'col-db2-policies-8', name: 'STATUS', dataType: 'CHAR(1)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Status of the policy (e.g., A-Active, E-Expired).' },
    { id: 'col-db2-policies-9', name: 'RIDER_CNT', dataType: 'INTEGER', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Count of riders on the policy.' },
    { id: 'col-db2-policies-10', name: 'RENEWAL_DT', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Date for the next policy renewal.' }
];

// Columns for INSURANCE.DB2_RISK_RATINGS
const db2RiskRatingsColumns: ColumnNode[] = [
    { id: 'col-db2-risk-ratings-1', name: 'RATING_KEY', dataType: 'VARCHAR(50)', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Unique key for the risk rating.' },
    { id: 'col-db2-risk-ratings-2', name: 'ZIP', dataType: 'CHAR(5)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'ZIP code for the rating area.' },
    { id: 'col-db2-risk-ratings-3', name: 'POL_TYPE', dataType: 'VARCHAR(10)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Policy type associated with the rating.' },
    { id: 'col-db2-risk-ratings-4', name: 'RATING_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'JSON blob with detailed rating factors.' },
    { id: 'col-db2-risk-ratings-5', name: 'SCORE', dataType: 'DECIMAL(5,2)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Calculated risk score.' },
    { id: 'col-db2-risk-ratings-6', name: 'EFFECTIVE_DT', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Date the rating becomes effective.' },
    { id: 'col-db2-risk-ratings-7', name: 'EXPIRATION_DT', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Date the rating expires.' }
];

// Columns for INSURANCE.DB2_CLAIM_EVENTS
const db2ClaimEventsColumns: ColumnNode[] = [
    { id: 'col-db2-claim-events-1', name: 'CLM_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: true, references: { table: 'DB2_CLAIMS', column: 'CLM_ID' }, description: 'Claim identifier, part of composite key.' },
    { id: 'col-db2-claim-events-2', name: 'EVENT_SEQ', dataType: 'INTEGER', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Sequence number for the event, part of composite key.' },
    { id: 'col-db2-claim-events-3', name: 'EVENT_DT', dataType: 'TIMESTAMP', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Timestamp of the event.' },
    { id: 'col-db2-claim-events-4', name: 'EVENT_TYPE', dataType: 'VARCHAR(30)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Type of event that occurred.' },
    { id: 'col-db2-claim-events-5', name: 'DETAILS_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'JSON blob with event details.' },
    { id: 'col-db2-claim-events-6', name: 'USER_ID', dataType: 'VARCHAR(36)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'User associated with the event.' }
];

// Columns for INSURANCE.DB2_POLICY_HISTORY
const db2PolicyHistoryColumns: ColumnNode[] = [
    { id: 'col-db2-policy-history-1', name: 'POLICY_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: true, references: { table: 'DB2_POLICIES', column: 'POLICY_ID' }, description: 'Policy identifier, part of composite key.' },
    { id: 'col-db2-policy-history-2', name: 'HIST_SEQ', dataType: 'INTEGER', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Sequence number for the history record, part of composite key.' },
    { id: 'col-db2-policy-history-3', name: 'CHANGE_DT', dataType: 'TIMESTAMP', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Timestamp of the change.' },
    { id: 'col-db2-policy-history-4', name: 'FIELD_NAME', dataType: 'VARCHAR(50)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'The name of the field that was changed.' },
    { id: 'col-db2-policy-history-5', name: 'OLD_VALUE', dataType: 'VARCHAR(255)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'The value of the field before the change.' },
    { id: 'col-db2-policy-history-6', name: 'NEW_VALUE', dataType: 'VARCHAR(255)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'The value of the field after the change.' },
    { id: 'col-db2-policy-history-7', name: 'CHANGE_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'JSON blob with additional change details.' }
];

// Columns for INSURANCE.DB2_AGENTS
const db2AgentsColumns: ColumnNode[] = [
    { id: 'col-db2-agents-1', name: 'AGENT_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Unique agent identifier.' },
    { id: 'col-db2-agents-2', name: 'FIRST_NAME', dataType: 'VARCHAR(50)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Agent\'s first name.' },
    { id: 'col-db2-agents-3', name: 'LAST_NAME', dataType: 'VARCHAR(50)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Agent\'s last name.' },
    { id: 'col-db2-agents-4', name: 'REGION', dataType: 'CHAR(3)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Sales region of the agent.' },
    { id: 'col-db2-agents-5', name: 'HIRE_DT', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Date the agent was hired.' },
    { id: 'col-db2-agents-6', name: 'TERMINATION_DT', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Date the agent was terminated.' },
    { id: 'col-db2-agents-7', name: 'AGENT_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'JSON blob with additional agent profile data.' },
    { id: 'col-db2-agents-8', name: 'STATUS', dataType: 'CHAR(1)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Current status of the agent (A-Active, I-Inactive).' },
    { id: 'col-db2-agents-9', name: 'RATING_KEY', dataType: 'VARCHAR(50)', nullable: true, isPrimaryKey: false, isForeignKey: true, references: { table: 'DB2_RISK_RATINGS', column: 'RATING_KEY' }, description: 'Reference to the agent\'s performance rating.' }
];

// Columns for INSURANCE.DB2_COMMISSIONS
const db2CommissionsColumns: ColumnNode[] = [
    { id: 'col-db2-commissions-1', name: 'COMM_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Unique commission identifier.' },
    { id: 'col-db2-commissions-2', name: 'AGENT_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: false, isForeignKey: true, references: { table: 'DB2_AGENTS', column: 'AGENT_ID' }, description: 'Reference to the agent earning the commission.' },
    { id: 'col-db2-commissions-3', name: 'CLM_ID', dataType: 'VARCHAR(36)', nullable: false, isPrimaryKey: false, isForeignKey: true, references: { table: 'DB2_CLAIMS', column: 'CLM_ID' }, description: 'Reference to the claim for which commission is paid.' },
    { id: 'col-db2-commissions-4', name: 'COMM_DT', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Date the commission was paid.' },
    { id: 'col-db2-commissions-5', name: 'COMM_PCT', dataType: 'DECIMAL(5,2)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Commission percentage.' },
    { id: 'col-db2-commissions-6', name: 'COMM_AMT', dataType: 'DECIMAL(15,2)', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Total commission amount.' },
    { id: 'col-db2-commissions-7', name: 'COMM_JSON', dataType: 'CLOB', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'JSON blob with additional commission details.' }
];

// =================================================================================
// BIGQUERY TARGET DEFINITIONS
// =================================================================================

// Columns for `project.dataset.claims_denorm`
const bqClaimsDenormColumns: ColumnNode[] = [
  { id: 'col-bq-claims-1', name: 'claim_identifier', dataType: 'STRING', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Unique claim identifier, from CLM_ID.' },
  { id: 'col-bq-claims-2', name: 'policy_code', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Policy reference, from POLICY_REF.' },
  { id: 'col-bq-claims-3', name: 'client_key', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Customer reference, from CUSTOMER_REF.' },
  { id: 'col-bq-claims-4', name: 'claim_open_date', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Date claim was opened, from CLM_DT.' },
  { id: 'col-bq-claims-5', name: 'status_code', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Claim status, from CLM_STATUS.' },
  { id: 'col-bq-claims-6', name: 'claim_value', dataType: 'NUMERIC', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Claimed amount, from CLM_AMT.' },
  { id: 'col-bq-claims-7', name: 'adjustment_value', dataType: 'NUMERIC', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Adjusted amount, from ADJ_AMT.' },
  { id: 'col-bq-claims-8', name: 'resolution_date', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Settlement date, from SETTLE_DT.' },
  { id: 'col-bq-claims-9', name: 'claim_detail_json', dataType: 'JSON', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Detailed claim info, from CLAIM_JSON.' },
  { id: 'col-bq-claims-10', name: 'loss_category', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Type of loss, from LOSS_TYPE.' },
  { id: 'col-bq-claims-11', name: 'report_owner', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Who reported the claim, from REPORTED_BY.' },
  { id: 'col-bq-claims-12', name: 'incident_address', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Location of incident, from INCIDENT_LOC.' },
  { id: 'col-bq-claims-13', name: 'incident_timestamp', dataType: 'TIMESTAMP', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Time of incident, from INCIDENT_DT.' },
  { id: 'col-bq-claims-14', name: 'days_to_resolution', dataType: 'INT64', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Days claim was open, from DAYS_OPEN.' },
  { id: 'col-bq-claims-15', name: 'priority_level', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Claim priority, from PRIORITY_CD.' },
  { id: 'col-bq-claims-16', name: 'payments', dataType: 'ARRAY<STRUCT<...>>', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Nested payment records for the claim from DB2_PAYMENTS.' },
  { id: 'col-bq-claims-17', name: 'adjustments', dataType: 'ARRAY<STRUCT<...>>', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Nested adjustment records for the claim from DB2_ADJUSTMENTS.' },
  { id: 'col-bq-claims-18', name: 'events', dataType: 'ARRAY<STRUCT<...>>', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Nested event records for the claim from DB2_CLAIM_EVENTS.' }
];

// Columns for `project.dataset.customers_denorm`
const bqCustomersDenormColumns: ColumnNode[] = [
  { id: 'col-bq-customers-1', name: 'customer_id', dataType: 'STRING', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Unique customer ID, from CUST_ID.' },
  { id: 'col-bq-customers-2', name: 'name_first', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'First name, extracted from NAME_JSON.' },
  { id: 'col-bq-customers-3', name: 'name_last', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Last name, extracted from NAME_JSON.' },
  { id: 'col-bq-customers-4', name: 'name_prefixes', dataType: 'ARRAY<STRING>', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Name prefixes, extracted from NAME_JSON.' },
  { id: 'col-bq-customers-5', name: 'region_code', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Region code, from REGION_CD.' },
  { id: 'col-bq-customers-6', name: 'customer_segment', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Customer segment, from SEGMENT.' },
  { id: 'col-bq-customers-7', name: 'date_of_birth', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Date of birth, from DOB.' },
  { id: 'col-bq-customers-8', name: 'email_address', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Email address, from EMAIL.' },
  { id: 'col-bq-customers-9', name: 'phone_number', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Phone number, from PHONE.' },
  { id: 'col-bq-customers-10', name: 'address_street', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Street address, extracted from ADDR_JSON.' },
  { id: 'col-bq-customers-11', name: 'address_city', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'City, extracted from ADDR_JSON.' },
  { id: 'col-bq-customers-12', name: 'address_state', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'State, extracted from ADDR_JSON.' },
  { id: 'col-bq-customers-13', name: 'address_postcode', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Postal code, extracted from ADDR_JSON.' },
  { id: 'col-bq-customers-14', name: 'joined_on', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Join date, from JOIN_DT.' },
  { id: 'col-bq-customers-15', name: 'active_flag', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Active status, from STATUS.' },
  { id: 'col-bq-customers-16', name: 'preferred_contact', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Preferred contact channel, from PREF_CHANNEL.' },
  { id: 'col-bq-customers-17', name: 'customer_risk_score', dataType: 'NUMERIC', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Risk score, from RISK_SCORE.' }
];

// Columns for `project.dataset.policies_denorm`
const bqPoliciesDenormColumns: ColumnNode[] = [
    { id: 'col-bq-policies-1', name: 'policy_key', dataType: 'STRING', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Unique policy key, from POLICY_ID.' },
    { id: 'col-bq-policies-2', name: 'effective_on', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Effective date, from EFF_DT.' },
    { id: 'col-bq-policies-3', name: 'expires_on', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Expiration date, from EXP_DT.' },
    { id: 'col-bq-policies-4', name: 'policy_document', dataType: 'JSON', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Policy details, from POLICY_JSON.' },
    { id: 'col-bq-policies-5', name: 'total_premium', dataType: 'NUMERIC', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Premium amount, from PREMIUM_AMT.' },
    { id: 'col-bq-policies-6', name: 'product_type', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Policy type, from POL_TYPE.' },
    { id: 'col-bq-policies-7', name: 'coverages', dataType: 'ARRAY<STRUCT<...>>', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Nested coverage details, from COVERAGES_JSON.' },
    { id: 'col-bq-policies-8', name: 'status_flag', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Policy status, from STATUS.' },
    { id: 'col-bq-policies-9', name: 'rider_count', dataType: 'INT64', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Number of riders, from RIDER_CNT.' },
    { id: 'col-bq-policies-10', name: 'next_renewal', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Next renewal date, from RENEWAL_DT.' },
    { id: 'col-bq-policies-11', name: 'history_log', dataType: 'ARRAY<STRUCT<...>>', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Nested policy history, from DB2_POLICY_HISTORY.' }
];

// Columns for `project.dataset.risk_ratings_denorm`
const bqRiskRatingsDenormColumns: ColumnNode[] = [
    { id: 'col-bq-risk-ratings-1', name: 'rating_id', dataType: 'STRING', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Unique rating ID, from RATING_KEY.' },
    { id: 'col-bq-risk-ratings-2', name: 'zip_code', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'ZIP code, from ZIP.' },
    { id: 'col-bq-risk-ratings-3', name: 'product_category', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Product category, from POL_TYPE.' },
    { id: 'col-bq-risk-ratings-4', name: 'rating_details', dataType: 'JSON', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Rating details, from RATING_JSON.' },
    { id: 'col-bq-risk-ratings-5', name: 'risk_score_metric', dataType: 'NUMERIC', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Risk score, from SCORE.' },
    { id: 'col-bq-risk-ratings-6', name: 'valid_from', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Effective date, from EFFECTIVE_DT.' },
    { id: 'col-bq-risk-ratings-7', name: 'valid_until', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Expiration date, from EXPIRATION_DT.' }
];

// Columns for `project.dataset.agents_denorm`
const bqAgentsDenormColumns: ColumnNode[] = [
    { id: 'col-bq-agents-1', name: 'agent_key', dataType: 'STRING', nullable: false, isPrimaryKey: true, isForeignKey: false, description: 'Unique agent key, from AGENT_ID.' },
    { id: 'col-bq-agents-2', name: 'first_name', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'First name, from FIRST_NAME.' },
    { id: 'col-bq-agents-3', name: 'last_name', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Last name, from LAST_NAME.' },
    { id: 'col-bq-agents-4', name: 'sales_region', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Sales region, from REGION.' },
    { id: 'col-bq-agents-5', name: 'hired_on', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Hire date, from HIRE_DT.' },
    { id: 'col-bq-agents-6', name: 'left_on', dataType: 'DATE', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Termination date, from TERMINATION_DT.' },
    { id: 'col-bq-agents-7', name: 'profile_data', dataType: 'JSON', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Agent profile data, from AGENT_JSON.' },
    { id: 'col-bq-agents-8', name: 'active_status', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Agent status, from STATUS.' },
    { id: 'col-bq-agents-9', name: 'performance_rating', dataType: 'STRING', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Performance rating key, from RATING_KEY.' },
    { id: 'col-bq-agents-10', name: 'commission_records', dataType: 'ARRAY<STRUCT<...>>', nullable: true, isPrimaryKey: false, isForeignKey: false, description: 'Nested commission records, from DB2_COMMISSIONS.' }
];

// =================================================================================
// MOCK GRAPH DATA
// =================================================================================

export const mockTables: TableNode[] = [
  // DB2 Source Tables
  { id: 'src-db2-claims', name: 'DB2_CLAIMS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2ClaimsColumns, rowCount: 85230, size: '15.2 MB', lastUpdated: '2025-08-05T10:30:00Z' },
  { id: 'src-db2-customers', name: 'DB2_CUSTOMERS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2CustomersColumns, rowCount: 32145, size: '8.1 MB', lastUpdated: '2025-08-05T09:45:00Z' },
  { id: 'src-db2-payments', name: 'DB2_PAYMENTS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2PaymentsColumns, rowCount: 125432, size: '22.5 MB', lastUpdated: '2025-08-05T11:00:00Z' },
  { id: 'src-db2-adjustments', name: 'DB2_ADJUSTMENTS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2AdjustmentsColumns, rowCount: 45210, size: '7.8 MB', lastUpdated: '2025-08-05T10:55:00Z' },
  { id: 'src-db2-policies', name: 'DB2_POLICIES', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2PoliciesColumns, rowCount: 41332, size: '12.3 MB', lastUpdated: '2025-08-05T09:30:00Z' },
  { id: 'src-db2-risk-ratings', name: 'DB2_RISK_RATINGS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2RiskRatingsColumns, rowCount: 1500, size: '0.5 MB', lastUpdated: '2025-08-01T12:00:00Z' },
  { id: 'src-db2-claim-events', name: 'DB2_CLAIM_EVENTS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2ClaimEventsColumns, rowCount: 250600, size: '45.1 MB', lastUpdated: '2025-08-05T11:15:00Z' },
  { id: 'src-db2-policy-history', name: 'DB2_POLICY_HISTORY', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2PolicyHistoryColumns, rowCount: 98765, size: '18.9 MB', lastUpdated: '2025-08-05T09:35:00Z' },
  { id: 'src-db2-agents', name: 'DB2_AGENTS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2AgentsColumns, rowCount: 850, size: '0.3 MB', lastUpdated: '2025-07-29T14:00:00Z' },
  { id: 'src-db2-commissions', name: 'DB2_COMMISSIONS', schema: 'INSURANCE', type: 'source', dialect: 'db2', columns: db2CommissionsColumns, rowCount: 110234, size: '19.8 MB', lastUpdated: '2025-08-05T11:10:00Z' },

  // BigQuery Target Tables
  { id: 'tgt-bq-claims', name: 'claims_denorm', schema: 'project.dataset', type: 'target', dialect: 'bigquery', columns: bqClaimsDenormColumns, rowCount: 0, size: '0 MB', lastUpdated: undefined },
  { id: 'tgt-bq-customers', name: 'customers_denorm', schema: 'project.dataset', type: 'target', dialect: 'bigquery', columns: bqCustomersDenormColumns, rowCount: 0, size: '0 MB', lastUpdated: undefined },
  { id: 'tgt-bq-policies', name: 'policies_denorm', schema: 'project.dataset', type: 'target', dialect: 'bigquery', columns: bqPoliciesDenormColumns, rowCount: 0, size: '0 MB', lastUpdated: undefined },
  { id: 'tgt-bq-risk-ratings', name: 'risk_ratings_denorm', schema: 'project.dataset', type: 'target', dialect: 'bigquery', columns: bqRiskRatingsDenormColumns, rowCount: 0, size: '0 MB', lastUpdated: undefined },
  { id: 'tgt-bq-agents', name: 'agents_denorm', schema: 'project.dataset', type: 'target', dialect: 'bigquery', columns: bqAgentsDenormColumns, rowCount: 0, size: '0 MB', lastUpdated: undefined },
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
// =================================================================================
// DFD MAPPING DATA
// =================================================================================
export const dfdMappingData = {
  tables: [
    // Source DB2 Tables
    { id: 'DB2_CUSTOMERS', name: 'DB2_CUSTOMERS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 50 } },
    { id: 'DB2_POLICIES', name: 'DB2_POLICIES', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 200 } },
    { id: 'DB2_POLICY_HISTORY', name: 'DB2_POLICY_HISTORY', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 350 } },
    { id: 'DB2_CLAIMS', name: 'DB2_CLAIMS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 500 } },
    { id: 'DB2_PAYMENTS', name: 'DB2_PAYMENTS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 650 } },
    { id: 'DB2_ADJUSTMENTS', name: 'DB2_ADJUSTMENTS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 800 } },
    { id: 'DB2_CLAIM_EVENTS', name: 'DB2_CLAIM_EVENTS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 950 } },
    { id: 'DB2_AGENTS', name: 'DB2_AGENTS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 1100 } },
    { id: 'DB2_COMMISSIONS', name: 'DB2_COMMISSIONS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 1250 } },
    { id: 'DB2_RISK_RATINGS', name: 'DB2_RISK_RATINGS', type: 'source', schema: 'INSURANCE', dialect: 'db2', position: { x: 50, y: 1400 } },

    // Target BigQuery Tables
    { id: 'customers_denorm', name: 'customers_denorm', type: 'target', schema: 'project.dataset', dialect: 'bigquery', position: { x: 800, y: 50 } },
    { id: 'policies_denorm', name: 'policies_denorm', type: 'target', schema: 'project.dataset', dialect: 'bigquery', position: { x: 800, y: 275 } },
    { id: 'claims_denorm', name: 'claims_denorm', type: 'target', schema: 'project.dataset', dialect: 'bigquery', position: { x: 800, y: 725 } },
    { id: 'agents_denorm', name: 'agents_denorm', type: 'target', schema: 'project.dataset', dialect: 'bigquery', position: { x: 800, y: 1175 } },
    { id: 'risk_ratings_denorm', name: 'risk_ratings_denorm', type: 'target', schema: 'project.dataset', dialect: 'bigquery', position: { x: 800, y: 1400 } },
  ],
  mappings: [
    // Customer Mappings
    { id: 'dfd-map-1', sourceTable: 'DB2_CUSTOMERS', targetTable: 'customers_denorm', confidence: 0.95, path: [{ x: 250, y: 100 }, { x: 800, y: 100 }] },
    // Policies Mappings
    { id: 'dfd-map-2', sourceTable: 'DB2_POLICIES', targetTable: 'policies_denorm', confidence: 0.95, path: [{ x: 250, y: 250 }, { x: 800, y: 325 }] },
    { id: 'dfd-map-3', sourceTable: 'DB2_POLICY_HISTORY', targetTable: 'policies_denorm', confidence: 0.90, path: [{ x: 250, y: 400 }, { x: 800, y: 325 }] },
    // Claims Mappings
    { id: 'dfd-map-4', sourceTable: 'DB2_CLAIMS', targetTable: 'claims_denorm', confidence: 0.95, path: [{ x: 250, y: 550 }, { x: 800, y: 775 }] },
    { id: 'dfd-map-5', sourceTable: 'DB2_PAYMENTS', targetTable: 'claims_denorm', confidence: 0.90, path: [{ x: 250, y: 700 }, { x: 800, y: 775 }] },
    { id: 'dfd-map-6', sourceTable: 'DB2_ADJUSTMENTS', targetTable: 'claims_denorm', confidence: 0.90, path: [{ x: 250, y: 850 }, { x: 800, y: 775 }] },
    { id: 'dfd-map-7', sourceTable: 'DB2_CLAIM_EVENTS', targetTable: 'claims_denorm', confidence: 0.90, path: [{ x: 250, y: 1000 }, { x: 800, y: 775 }] },
    // Agents Mappings
    { id: 'dfd-map-8', sourceTable: 'DB2_AGENTS', targetTable: 'agents_denorm', confidence: 0.95, path: [{ x: 250, y: 1150 }, { x: 800, y: 1225 }] },
    { id: 'dfd-map-9', sourceTable: 'DB2_COMMISSIONS', targetTable: 'agents_denorm', confidence: 0.90, path: [{ x: 250, y: 1300 }, { x: 800, y: 1225 }] },
    // Risk Ratings Mappings
    { id: 'dfd-map-10', sourceTable: 'DB2_RISK_RATINGS', targetTable: 'risk_ratings_denorm', confidence: 0.95, path: [{ x: 250, y: 1450 }, { x: 800, y: 1450 }] },
  ]
};

export const mockLineageGraph: LineageGraph = {
  tables: mockTables,
  relationships: mockRelationships,
  mappings: dfdMappingData.mappings, // Add the mappings here
  statistics: {
    totalTables: mockTables.length,
    totalColumns: mockTables.reduce((sum, table) => sum + table.columns.length, 0),
    totalRelationships: mockRelationships.length,
    totalMappings: dfdMappingData.mappings.length, // Add totalMappings
    complexityScore: 8.9
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

