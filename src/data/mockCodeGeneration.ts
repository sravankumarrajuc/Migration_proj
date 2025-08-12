import { CodePlatform, GeneratedCode, CodeOptimization } from '@/types/migration';
import { formatDateOnly } from '@/utils/dateFormatter';

// BigQuery SQL Template
const bigQuerySQL = `-- Condensed BigQuery SQL using Denormalized Schema
-- Steps collapsed for a cleaner, production‐style pipeline
-- Generated: ${formatDateOnly(new Date())}

--------------------------------------------------------------------------------
-- 1. BaseFlatten: unpack all nested arrays in one go
--------------------------------------------------------------------------------
WITH BaseFlatten AS (
  SELECT
    c.claim_identifier       AS claim_id,
    c.policy_code            AS policy_ref,
    c.client_key             AS customer_ref,
    c.claim_open_date        AS clm_dt,
    c.status_code            AS clm_status,
    c.claim_value            AS clm_amt,
    JSON_EXTRACT_SCALAR(c.claim_detail_json, '$.incident.date')     AS incident_date,
    JSON_EXTRACT(c.claim_detail_json, '$.incident.details')        AS incident_details,
    p.payment_key            AS pay_id,
    p.paid_amount            AS amt_paid,
    SAFE_CAST(JSON_EXTRACT_SCALAR(p.payment_meta, '$.pct') AS NUMERIC) AS allocation_pct,
    a.adjustment_key         AS adj_id,
    a.original_amount        AS adj_amt_src,
    a.corrected_amount       AS adj_amt_corr,
    e.sequence_number        AS event_seq,
    com.commission_id        AS comm_id
  FROM
    \`project.dataset.claims_denorm\` AS c
  LEFT JOIN UNNEST(c.payments)           AS p
  LEFT JOIN UNNEST(c.adjustments)        AS a
  LEFT JOIN UNNEST(c.events)             AS e
  LEFT JOIN UNNEST(c.commission_records) AS com
  WHERE
    c.claim_open_date >= DATE('2025-01-01')
),

--------------------------------------------------------------------------------
-- 2. FilterRecent: pick the most recent claim per policy
--------------------------------------------------------------------------------
FilterRecent AS (
  SELECT
    bf.*,
    ROW_NUMBER() OVER (PARTITION BY bf.policy_ref ORDER BY bf.clm_dt DESC) AS rn
  FROM BaseFlatten bf
),

--------------------------------------------------------------------------------
-- 3. CustomerInfo, PolicyCoverages, RiskRatings inline as CTEs
--------------------------------------------------------------------------------
CustomerInfo AS (
  SELECT
    cu.customer_id  AS cust_id,
    cu.name_first,
    cu.name_last,
    cu.region_code  AS region_cd,
    cu.customer_segment AS segment,
    cu.customer_risk_score AS risk_score
  FROM \`project.dataset.customers_denorm\` cu
  WHERE cu.active_flag = 'A'
),

PolicyCoverages AS (
  SELECT
    p.policy_key    AS policy_id,
    cov.coverage_type,
    cov.coverage_limit
  FROM \`project.dataset.policies_denorm\` p,
       UNNEST(p.coverages) AS cov
  WHERE p.effective_on <= CURRENT_DATE()
    AND p.expires_on   >= CURRENT_DATE()
),

RiskRatings AS (
  SELECT
    r.zip_code AS region_cd,
    r.product_category AS pol_type,
    r.risk_score_metric AS risk_score
  FROM \`project.dataset.risk_ratings_denorm\` r
  WHERE r.valid_from <= CURRENT_DATE()
    AND r.valid_until >= CURRENT_DATE()
),

--------------------------------------------------------------------------------
-- 4. Enriched: join flatten data with reference CTEs
--------------------------------------------------------------------------------
Enriched AS (
  SELECT
    fr.claim_id,
    fr.policy_ref,
    fr.customer_ref,
    fr.clm_dt,
    fr.incident_date,
    fr.incident_details,
    fr.clm_status,
    fr.clm_amt,
    fr.amt_paid * (fr.allocation_pct / 100) AS net_paid,
    fr.adj_amt_corr - fr.adj_amt_src      AS adj_diff,
    ci.name_first,
    ci.name_last,
    ci.region_cd,
    ci.segment,
    pc.coverage_type    AS coverage1_type,
    pc.coverage_limit   AS coverage1_limit,
    rr.risk_score       AS policy_risk_score
  FROM
    FilterRecent fr
  LEFT JOIN CustomerInfo    ci ON fr.customer_ref = ci.cust_id
  LEFT JOIN PolicyCoverages pc ON fr.policy_ref   = pc.policy_id
  LEFT JOIN RiskRatings     rr ON ci.region_cd    = rr.region_cd
  WHERE fr.rn = 1
),

--------------------------------------------------------------------------------
-- 5. Aggregations: TimeSeries, RegionalAgg, StatusPivot
--------------------------------------------------------------------------------
TimeSeries AS (
  SELECT
    DATE(e.clm_dt)            AS report_date,
    COUNT(*)                  AS daily_claims,
    SUM(e.clm_amt)            AS daily_claim_amount,
    SUM(e.net_paid)           AS daily_net_payments
  FROM Enriched e
  GROUP BY report_date
),

RegionalAgg AS (
  SELECT
    e.region_cd  AS region,
    e.segment,
    COUNT(e.claim_id)   AS claims_count,
    SUM(e.clm_amt)      AS claims_amount,
    AVG(e.policy_risk_score) AS avg_risk_score
  FROM Enriched e
  GROUP BY region, segment
),

StatusPivot AS (
  SELECT
    ra.region,
    ra.segment,
    SUM(CASE WHEN e.clm_status = 'O' THEN 1 ELSE 0 END) AS open_count,
    SUM(CASE WHEN e.clm_status = 'C' THEN 1 ELSE 0 END) AS closed_count,
    SUM(CASE WHEN e.clm_status = 'P' THEN 1 ELSE 0 END) AS pending_count
  FROM RegionalAgg ra
  JOIN Enriched e
    ON ra.region = e.region_cd
   AND ra.segment = e.segment
  GROUP BY ra.region, ra.segment
),

--------------------------------------------------------------------------------
-- 6. FinalOutput: assemble all pieces
--------------------------------------------------------------------------------
FinalOutput AS (
  SELECT
    e.*,
    ts.daily_claims,
    ts.daily_claim_amount,
    ts.daily_net_payments,
    ra.claims_count,
    ra.claims_amount,
    ra.avg_risk_score,
    sp.open_count,
    sp.closed_count,
    sp.pending_count
  FROM Enriched e
  LEFT JOIN TimeSeries  ts ON DATE(e.clm_dt) = ts.report_date
  LEFT JOIN RegionalAgg ra ON e.region_cd     = ra.region
                         AND e.segment       = ra.segment
  LEFT JOIN StatusPivot sp ON ra.region       = sp.region
                         AND ra.segment      = sp.segment
)

--------------------------------------------------------------------------------
-- 7. Final SELECT: top 100 rows
--------------------------------------------------------------------------------
SELECT
  *
FROM
  FinalOutput
ORDER BY
  report_date DESC,
  claims_amount DESC
LIMIT 100;
`;

// Databricks SQL Template
const databricksSQL = `-- Generated Databricks SQL for Data Migration
-- Source: PostgreSQL customers, orders tables  
-- Target: Delta Lake dim_customer, fact_order tables
-- Generated: ${formatDateOnly(new Date())}

-- Customer Dimension Migration
CREATE OR REPLACE TABLE main.warehouse.dim_customer
USING DELTA
LOCATION '/mnt/warehouse/dim_customer'
TBLPROPERTIES (
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.autoOptimize.autoCompact' = 'true'
)
AS
SELECT 
  -- Direct mapping: customer_id -> customer_id
  CAST(c.customer_id AS STRING) AS customer_id,
  
  -- Composite mapping: first_name + last_name -> full_name
  CONCAT(c.first_name, ' ', c.last_name) AS full_name,
  
  -- Direct mapping with validation: email -> email
  CASE 
    WHEN c.email IS NOT NULL AND c.email RLIKE '^[\\\\w\\\\.-]+@[\\\\w\\\\.-]+\\\\.[a-zA-Z]{2,}$'
    THEN c.email
    ELSE 'invalid@domain.com'
  END AS email,
  
  -- Type conversion: phone_number -> phone (VARCHAR to STRING)
  CAST(c.phone_number AS STRING) AS phone,
  
  -- Date conversion: created_at -> created_date
  DATE(c.created_at) AS created_date,
  
  -- Transformation: status -> customer_status (with default)
  COALESCE(c.status, 'unknown') AS customer_status,
  
  -- Generated metadata
  CURRENT_TIMESTAMP() AS etl_created_at,
  'migration_v1' AS etl_source_version
FROM main.source.customers c
WHERE c.customer_id IS NOT NULL;

-- Order Fact Migration with Delta optimizations
CREATE OR REPLACE TABLE main.warehouse.fact_order
USING DELTA
LOCATION '/mnt/warehouse/fact_order'
PARTITIONED BY (order_date)
TBLPROPERTIES (
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.autoOptimize.autoCompact' = 'true'
)
AS
SELECT
  -- Direct mapping: order_id -> order_id
  CAST(o.order_id AS STRING) AS order_id,
  
  -- Foreign key mapping: customer_id -> customer_id  
  CAST(o.customer_id AS STRING) AS customer_id,
  
  -- Type conversion: order_date -> order_date (TIMESTAMP to DATE)
  DATE(o.order_date) AS order_date,
  
  -- Computed field: order_date -> date_key (YYYYMMDD format)
  CAST(DATE_FORMAT(DATE(o.order_date), 'yyyyMMdd') AS INT) AS date_key,
  
  -- Type conversion: total_amount -> total_amount (DECIMAL to DECIMAL)
  CAST(o.total_amount AS DECIMAL(10,2)) AS total_amount,
  
  -- Transformation: status -> order_status with case normalization
  CASE 
    WHEN UPPER(o.status) = 'PENDING' THEN 'pending'
    WHEN UPPER(o.status) = 'COMPLETED' THEN 'completed'
    WHEN UPPER(o.status) = 'CANCELLED' THEN 'cancelled'
    ELSE 'unknown'
  END AS order_status,
  
  -- Generated metadata
  CURRENT_TIMESTAMP() AS etl_created_at,
  'migration_v1' AS etl_source_version
FROM main.source.orders o
WHERE o.order_id IS NOT NULL
  AND o.customer_id IS NOT NULL;`;

// Python/Beam Template
const pythonBeamCode = `"""
Generated Apache Beam Pipeline for Data Migration
Source: PostgreSQL customers, orders tables
Target: BigQuery dim_customer, fact_order tables
Generated: ${formatDateOnly(new Date())}
"""

import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.io.gcp.bigquery import WriteToBigQuery
import re
from datetime import datetime


class CustomerTransform(beam.DoFn):
    """Transform customer records from PostgreSQL to BigQuery format."""
    
    def process(self, element):
        try:
            # Direct mapping: customer_id -> customer_id
            customer_id = str(element.get('customer_id', ''))
            
            # Composite mapping: first_name + last_name -> full_name
            first_name = element.get('first_name', '')
            last_name = element.get('last_name', '')
            full_name = f"{first_name} {last_name}".strip()
            
            # Direct mapping with validation: email -> email
            email = element.get('email', '')
            email_pattern = r'^[\\\\w\\\\.-]+@[\\\\w\\\\.-]+\\\\.[a-zA-Z]{2,}$'
            if not email or not re.match(email_pattern, email):
                email = 'invalid@domain.com'
            
            # Type conversion: phone_number -> phone
            phone = str(element.get('phone_number', ''))
            
            # Date conversion: created_at -> created_date
            created_at = element.get('created_at')
            created_date = created_at.date() if created_at else None
            
            # Transformation: status -> customer_status
            status = element.get('status', 'unknown')
            
            yield {
                'customer_id': customer_id,
                'full_name': full_name,
                'email': email,
                'phone': phone,
                'created_date': created_date,
                'customer_status': status,
                'etl_created_at': datetime.utcnow(),
                'etl_source_version': 'migration_v1'
            }
            
        except Exception as e:
            # Log error and continue processing
            beam.logging.error(f"Error processing customer record: {e}")


class OrderTransform(beam.DoFn):
    """Transform order records from PostgreSQL to BigQuery format."""
    
    def process(self, element):
        try:
            # Direct mapping: order_id -> order_id
            order_id = str(element.get('order_id', ''))
            
            # Foreign key mapping: customer_id -> customer_id
            customer_id = str(element.get('customer_id', ''))
            
            # Type conversion: order_date -> order_date
            order_date = element.get('order_date')
            if order_date:
                order_date = order_date.date()
                # Computed field: order_date -> date_key (YYYYMMDD format)
                date_key = int(order_date.strftime('%Y%m%d'))
            else:
                date_key = None
            
            # Type conversion: total_amount -> total_amount
            total_amount = float(element.get('total_amount', 0))
            
            # Transformation: status -> order_status
            status = element.get('status', '').upper()
            order_status_map = {
                'PENDING': 'pending',
                'COMPLETED': 'completed', 
                'CANCELLED': 'cancelled'
            }
            order_status = order_status_map.get(status, 'unknown')
            
            yield {
                'order_id': order_id,
                'customer_id': customer_id,
                'order_date': order_date,
                'date_key': date_key,
                'total_amount': total_amount,
                'order_status': order_status,
                'etl_created_at': datetime.utcnow(),
                'etl_source_version': 'migration_v1'
            }
            
        except Exception as e:
            beam.logging.error(f"Error processing order record: {e}")


def run_migration_pipeline(argv=None):
    """Main pipeline execution function."""
    
    pipeline_options = PipelineOptions(argv)
    
    with beam.Pipeline(options=pipeline_options) as pipeline:
        
        # Customer dimension migration
        customers = (
            pipeline
            | 'Read Customers' >> beam.io.ReadFromBigQuery(
                query='SELECT * FROM source_project.source_dataset.customers',
                use_standard_sql=True
            )
            | 'Transform Customers' >> beam.ParDo(CustomerTransform())
            | 'Write Customer Dimension' >> WriteToBigQuery(
                'project:dataset.dim_customer',
                write_disposition=beam.io.BigQueryDisposition.WRITE_TRUNCATE,
                create_disposition=beam.io.BigQueryDisposition.CREATE_IF_NEEDED
            )
        )
        
        # Order fact migration
        orders = (
            pipeline  
            | 'Read Orders' >> beam.io.ReadFromBigQuery(
                query='SELECT * FROM source_project.source_dataset.orders',
                use_standard_sql=True
            )
            | 'Transform Orders' >> beam.ParDo(OrderTransform())
            | 'Write Order Fact' >> WriteToBigQuery(
                'project:dataset.fact_order',
                write_disposition=beam.io.BigQueryDisposition.WRITE_TRUNCATE,
                create_disposition=beam.io.BigQueryDisposition.CREATE_IF_NEEDED
            )
        )


if __name__ == '__main__':
    run_migration_pipeline()`;

// dbt Template
const dbtCode = `-- Generated dbt models for Data Migration
-- Source: PostgreSQL customers, orders tables
-- Target: BigQuery dim_customer, fact_order tables
-- Generated: ${formatDateOnly(new Date())}

-- models/staging/stg_customers.sql
{{
  config(
    materialized='view',
    description='Staging view for customer data from PostgreSQL source'
  )
}}

SELECT 
    customer_id,
    first_name,
    last_name,
    email,
    phone_number,
    status,
    created_at,
    updated_at
FROM {{ source('source_db', 'customers') }}
WHERE customer_id IS NOT NULL

-- models/staging/stg_orders.sql
{{
  config(
    materialized='view', 
    description='Staging view for order data from PostgreSQL source'
  )
}}

SELECT
    order_id,
    customer_id,
    order_date,
    total_amount,
    status,
    created_at,
    updated_at
FROM {{ source('source_db', 'orders') }}
WHERE order_id IS NOT NULL
  AND customer_id IS NOT NULL

-- models/marts/dim_customer.sql
{{
  config(
    materialized='table',
    description='Customer dimension table with cleansed and transformed data'
  )
}}

SELECT 
    -- Direct mapping: customer_id -> customer_id
    CAST(customer_id AS STRING) AS customer_id,
    
    -- Composite mapping: first_name + last_name -> full_name  
    CONCAT(first_name, ' ', last_name) AS full_name,
    
    -- Direct mapping with validation: email -> email
    CASE 
        WHEN email IS NOT NULL 
        AND REGEXP_CONTAINS(email, r'^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$')
        THEN email
        ELSE 'invalid@domain.com'
    END AS email,
    
    -- Type conversion: phone_number -> phone
    CAST(phone_number AS STRING) AS phone,
    
    -- Date conversion: created_at -> created_date
    DATE(created_at) AS created_date,
    
    -- Transformation: status -> customer_status
    COALESCE(status, 'unknown') AS customer_status,
    
    -- Generated metadata
    CURRENT_TIMESTAMP() AS etl_created_at,
    'migration_v1' AS etl_source_version

FROM {{ ref('stg_customers') }}

-- models/marts/fact_order.sql
{{
  config(
    materialized='table',
    description='Order fact table with enriched data and computed fields',
    partition_by={
      "field": "order_date",
      "data_type": "date"
    }
  )
}}

SELECT
    -- Direct mapping: order_id -> order_id
    CAST(order_id AS STRING) AS order_id,
    
    -- Foreign key mapping: customer_id -> customer_id
    CAST(customer_id AS STRING) AS customer_id,
    
    -- Type conversion: order_date -> order_date
    DATE(order_date) AS order_date,
    
    -- Computed field: order_date -> date_key (YYYYMMDD format)
    CAST(FORMAT_DATE('%Y%m%d', DATE(order_date)) AS INT64) AS date_key,
    
    -- Type conversion: total_amount -> total_amount
    CAST(total_amount AS NUMERIC) AS total_amount,
    
    -- Transformation: status -> order_status
    CASE 
        WHEN UPPER(status) = 'PENDING' THEN 'pending'
        WHEN UPPER(status) = 'COMPLETED' THEN 'completed'
        WHEN UPPER(status) = 'CANCELLED' THEN 'cancelled'
        ELSE 'unknown'
    END AS order_status,
    
    -- Generated metadata
    CURRENT_TIMESTAMP() AS etl_created_at,
    'migration_v1' AS etl_source_version

FROM {{ ref('stg_orders') }}`;

// Optimized BigQuery SQL Template - This will be shown as the "After" code
const optimizedBigQuerySQL = `--------------------------------------------------------------------------------
-- Optimized BigQuery SQL for Target Reports
-- Best practices applied: pushdown filters, avoid rescans, column pruning,
-- QUALIFY usage, precompute reusable fields, explicit projections.
-- Generated: ${formatDateOnly(new Date())}
--------------------------------------------------------------------------------

WITH BaseFlatten AS (
  SELECT
    c.claim_identifier       AS claim_id,
    c.policy_code            AS policy_ref,
    c.client_key             AS customer_ref,
    c.claim_open_date        AS clm_dt,
    DATE(c.claim_open_date)  AS clm_date,  -- precomputed for reuse
    c.status_code            AS clm_status,
    c.claim_value            AS clm_amt,
    JSON_EXTRACT_SCALAR(c.claim_detail_json, '$.incident.date')     AS incident_date,
    JSON_EXTRACT(c.claim_detail_json, '$.incident.details')        AS incident_details,
    p.payment_key            AS pay_id,
    p.paid_amount            AS amt_paid,
    SAFE_CAST(JSON_EXTRACT_SCALAR(p.payment_meta, '$.pct') AS NUMERIC) AS allocation_pct,
    a.adjustment_key         AS adj_id,
    a.original_amount        AS adj_amt_src,
    a.corrected_amount       AS adj_amt_corr,
    e.sequence_number        AS event_seq,
    com.commission_id        AS comm_id
  FROM
    \`project.dataset.claims_denorm\` AS c
  LEFT JOIN UNNEST(c.payments)           AS p
  LEFT JOIN UNNEST(c.adjustments)        AS a
  LEFT JOIN UNNEST(c.events)             AS e
  LEFT JOIN UNNEST(c.commission_records) AS com
  WHERE
    c.claim_open_date >= DATE('2025-01-01')
),

-- Filter most recent claim per policy
FilterRecent AS (
  SELECT *
  FROM BaseFlatten
  QUALIFY ROW_NUMBER() OVER (PARTITION BY policy_ref ORDER BY clm_dt DESC) = 1
),

CustomerInfo AS (
  SELECT
    cu.customer_id  AS cust_id,
    cu.name_first,
    cu.name_last,
    cu.region_code  AS region_cd,
    cu.customer_segment AS segment,
    cu.customer_risk_score AS risk_score
  FROM \`project.dataset.customers_denorm\` cu
  WHERE cu.active_flag = 'A'
),

PolicyCoverages AS (
  SELECT
    p.policy_key    AS policy_id,
    cov.coverage_type,
    cov.coverage_limit
  FROM \`project.dataset.policies_denorm\` p,
       UNNEST(p.coverages) AS cov
  WHERE p.effective_on <= CURRENT_DATE()
    AND p.expires_on   >= CURRENT_DATE()
),

RiskRatings AS (
  SELECT
    r.zip_code AS region_cd,
    r.product_category AS pol_type,
    r.risk_score_metric AS risk_score
  FROM \`project.dataset.risk_ratings_denorm\` r
  WHERE r.valid_from <= CURRENT_DATE()
    AND r.valid_until >= CURRENT_DATE()
),

-- Enriched dataset with all joins applied
Enriched AS (
  SELECT
    fr.claim_id,
    fr.policy_ref,
    fr.customer_ref,
    fr.clm_dt,
    fr.clm_date,
    fr.incident_date,
    fr.incident_details,
    fr.clm_status,
    fr.clm_amt,
    fr.amt_paid * (fr.allocation_pct / 100) AS net_paid,
    fr.adj_amt_corr - fr.adj_amt_src        AS adj_diff,
    ci.name_first,
    ci.name_last,
    ci.region_cd,
    ci.segment,
    pc.coverage_type    AS coverage1_type,
    pc.coverage_limit   AS coverage1_limit,
    rr.risk_score       AS policy_risk_score
  FROM
    FilterRecent fr
  LEFT JOIN CustomerInfo    ci ON fr.customer_ref = ci.cust_id
  LEFT JOIN PolicyCoverages pc ON fr.policy_ref   = pc.policy_id
  LEFT JOIN RiskRatings     rr ON ci.region_cd    = rr.region_cd
),

-- Combined aggregation step to avoid rescans
Aggregations AS (
  SELECT
    e.region_cd,
    e.segment,
    e.clm_date,
    COUNT(e.claim_id)                     AS claims_count,
    SUM(e.clm_amt)                         AS claims_amount,
    AVG(e.policy_risk_score)               AS avg_risk_score,
    SUM(CASE WHEN e.clm_status = 'O' THEN 1 ELSE 0 END) AS open_count,
    SUM(CASE WHEN e.clm_status = 'C' THEN 1 ELSE 0 END) AS closed_count,
    SUM(CASE WHEN e.clm_status = 'P' THEN 1 ELSE 0 END) AS pending_count,
    COUNT(*)                               AS daily_claims,
    SUM(e.clm_amt)                         AS daily_claim_amount,
    SUM(e.net_paid)                        AS daily_net_payments
  FROM Enriched e
  GROUP BY e.region_cd, e.segment, e.clm_date
)

-- Final Output
SELECT
  e.claim_id,
  e.policy_ref,
  e.customer_ref,
  e.clm_dt,
  e.clm_date,
  e.incident_date,
  e.incident_details,
  e.clm_status,
  e.clm_amt,
  e.net_paid,
  e.adj_diff,
  e.name_first,
  e.name_last,
  e.region_cd,
  e.segment,
  e.coverage1_type,
  e.coverage1_limit,
  e.policy_risk_score,
  a.daily_claims,
  a.daily_claim_amount,
  a.daily_net_payments,
  a.claims_count,
  a.claims_amount,
  a.avg_risk_score,
  a.open_count,
  a.closed_count,
  a.pending_count
FROM Enriched e
LEFT JOIN Aggregations a
  ON e.region_cd = a.region_cd
 AND e.segment   = a.segment
 AND e.clm_date  = a.clm_date
ORDER BY
  e.clm_date DESC,
  a.claims_amount DESC
LIMIT 100;`;

export const mockGeneratedCodes: Record<CodePlatform, GeneratedCode> = {
  bigquery: {
    platform: 'bigquery',
    content: bigQuerySQL,
    fileName: 'bigquery_migration.sql',
    language: 'sql',
    size: bigQuerySQL.length,
    lastGenerated: new Date().toISOString()
  },
  databricks: {
    platform: 'databricks',
    content: databricksSQL, 
    fileName: 'databricks_migration.sql',
    language: 'sql',
    size: databricksSQL.length,
    lastGenerated: new Date().toISOString()
  },
  'python-beam': {
    platform: 'python-beam',
    content: pythonBeamCode,
    fileName: 'beam_migration_pipeline.py',
    language: 'python',
    size: pythonBeamCode.length,
    lastGenerated: new Date().toISOString()
  },
  dbt: {
    platform: 'dbt',
    content: dbtCode,
    fileName: 'dbt_migration_models.sql',
    language: 'sql', 
    size: dbtCode.length,
    lastGenerated: new Date().toISOString()
  }
};

export const mockCodeOptimizations: CodeOptimization[] = [
  {
    id: 'opt-1',
    type: 'performance',
    title: 'Add clustering keys for BigQuery',
    description: 'Cluster claims_denorm and fact_order tables by their most-frequently filtered keys (e.g. client_key, order_date_key) to reduce query scan costs.',
    suggestion: 'Add CLUSTER BY client_key, order_date_key to your CREATE TABLE statements.',
    impact: 'high',
    autoApplicable: true
  },
  {
    id: 'opt-2',
    type: 'performance',
    title: 'Optimize date partitioning',
    description: 'Partition your denorm tables by a date or timestamp column to prune historic data—e.g. PARTITION BY DATE(claim_open_date).',
    suggestion: 'Insert PARTITION BY DATE(claim_open_date) into your DDL.',
    impact: 'high',
    autoApplicable: true
  },
  {
    id: 'opt-3',
    type: 'performance',
    title: 'Add incremental merge logic',
    description: 'Switch from full-table overwrite to a MERGE strategy using a watermark on CLM_DT / EFF_DT, so you only upsert new or changed records.',
    suggestion: 'Wrap your INSERT into a MERGE ... WHEN MATCHED/NOT MATCHED block.',
    impact: 'medium',
    autoApplicable: true
  },
  {
    id: 'opt-4',
    type: 'best-practice',
    title: 'Add data quality checks',
    description: 'Validate key constraints before loading (e.g. WHERE CUST_ID IS NOT NULL AND CLM_ID IS NOT NULL).',
    suggestion: 'Prepend a CTE that filters out bad rows and logs rejected records.',
    impact: 'medium',
    autoApplicable: true
  },
  {
    id: 'opt-5',
    type: 'readability',
    title: 'Improve code documentation',
    description: 'Insert richer comments (from your DDL descriptions) above each field transformation.',
    suggestion: 'Auto-generate doc-blocks for each SELECT column.',
    impact: 'low',
    autoApplicable: true
  },
  {
    id: 'opt-6',
    type: 'cost-optimization',
    title: 'Generate cost estimation',
    description: 'Estimate slot-time and storage cost for each table based on your sample row counts.',
    suggestion: 'Add a “-- Estimated cost:” comment at the top of each CREATE block.',
    impact: 'low',
    autoApplicable: true
  }
];

export const mockCodeGenSteps = [
  { step: 'Analyzing field mappings...', duration: 800 },
  { step: 'Generating SQL transformations...', duration: 1200 },
  { step: 'Optimizing data types...', duration: 600 },
  { step: 'Adding performance hints...', duration: 400 },
  { step: 'Validating syntax...', duration: 500 },
  { step: 'Generating documentation...', duration: 300 }
];

export function getPlatformInfo(platform: CodePlatform) {
  const platformData = {
    bigquery: {
      name: 'BigQuery SQL',
      description: 'Google Cloud BigQuery native SQL with optimizations',
      features: ['Serverless', 'Petabyte scale', 'ANSI SQL', 'Machine Learning'],
      useCase: 'Large-scale analytics and data warehousing'
    },
    databricks: {
      name: 'Databricks SQL',
      description: 'Delta Lake optimized SQL for unified analytics',
      features: ['Delta Lake', 'Auto-optimization', 'Unity Catalog', 'Real-time'],
      useCase: 'Unified data lakehouse with streaming support'
    },
    'python-beam': {
      name: 'Python/Beam',
      description: 'Apache Beam pipeline for batch and streaming',
      features: ['Multi-cloud', 'Streaming', 'Batch processing', 'Portable'],
      useCase: 'Complex ETL pipelines and real-time processing'
    },
    dbt: {
      name: 'dbt Models',
      description: 'Data build tool for analytics engineering',
      features: ['Version control', 'Testing', 'Documentation', 'Lineage'],
      useCase: 'Analytics engineering and data transformation'
    }
  };
  
  return platformData[platform];
}

// Export the optimized SQL for use in CodeOptimizer
export { optimizedBigQuerySQL };
