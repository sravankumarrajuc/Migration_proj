import { CodePlatform, GeneratedCode, CodeOptimization } from '@/types/migration';

// BigQuery SQL Template
const bigQuerySQL = `-- Generated BigQuery SQL for Data Migration
-- Source: PostgreSQL customers, orders tables
-- Target: BigQuery dim_customer, fact_order tables
-- Generated: ${new Date().toISOString()}

-- 1) Customer Dimension
CREATE OR REPLACE TABLE analytics.customers_denorm AS
SELECT
  CAST(c.CUST_ID      AS INT64)       AS customer_id,           -- Name-Similarity
  JSON_VALUE(c.NAME_JSON, '$.firstName') AS name_first,         -- Multi-Column Parse
  JSON_VALUE(c.NAME_JSON, '$.lastName')  AS name_last,          -- Multi-Column Parse
  c.REGION_CD                        AS region_code,            -- Name-Similarity
  c.SEGMENT                          AS customer_segment,       -- Name-Similarity
  CAST(c.DOB AS DATE)               AS date_of_birth,           -- Name-Similarity
  c.EMAIL                            AS email_address,          -- Name-Similarity
  c.PHONE                            AS phone_number,           -- Name-Similarity
  JSON_VALUE(c.ADDR_JSON, '$.street')   AS address_street,      -- Fuzzy-Suggestion
  JSON_VALUE(c.ADDR_JSON, '$.city')     AS address_city,        -- Fuzzy-Suggestion
  JSON_VALUE(c.ADDR_JSON, '$.state')    AS address_state,       -- Fuzzy-Suggestion
  JSON_VALUE(c.ADDR_JSON, '$.postcode') AS address_postcode,    -- Fuzzy-Suggestion
  c.JOIN_DT                          AS joined_on,               -- Name-Similarity
  c.STATUS                           AS status,                  -- Name-Similarity
  c.PREF_CHANNEL                     AS preferred_contact,       -- Name-Similarity
  CAST(c.RISK_SCORE AS NUMERIC)      AS risk_score               -- Name-Similarity
FROM project.dataset.stage_db2_customers AS c;


-- 2) Policy Dimension
CREATE OR REPLACE TABLE analytics.policies_denorm AS
SELECT
  CAST(p.POLICY_ID AS INT64)            AS policy_key,       -- Name-Similarity
  p.EFF_DT                              AS effective_on,     -- Name-Similarity
  p.EXP_DT                              AS expires_on,       -- Name-Similarity
  p.POLICY_JSON                         AS policy_document,  -- Name-Similarity
  p.PREMIUM_AMT                         AS total_premium,    -- Name-Similarity
  p.POL_TYPE                            AS product_type,     -- Name-Similarity
  JSON_VALUE(p.COVERAGES_JSON, '$.type')  AS coverage_type,  -- Fuzzy-Suggestion
  JSON_VALUE(p.COVERAGES_JSON, '$.limit') AS coverage_limit, -- Fuzzy-Suggestion
  p.STATUS                              AS policy_status,    -- Fuzzy-Suggestion
  p.RIDER_CNT                           AS rider_count,      -- Name-Similarity
  p.RENEWAL_DT                          AS next_renewal,     -- Name-Similarity
  ARRAY_AGG(
    STRUCT(
      h.HIST_SEQ     AS revision_number,
      h.CHANGE_DT    AS changed_on,
      h.FIELD_NAME   AS field_changed,
      h.OLD_VALUE    AS old_value_text,
      h.NEW_VALUE    AS new_value_text
    )
    ORDER BY h.CHANGE_DT
  ) AS history                                    -- Fuzzy-Nest-Array
FROM project.dataset.stage_db2_policies         AS p
LEFT JOIN project.dataset.stage_db2_policy_history AS h
  ON h.POLICY_ID = p.POLICY_ID
GROUP BY p.POLICY_ID, p.EFF_DT, p.EXP_DT, p.POLICY_JSON,
         p.PREMIUM_AMT, p.POL_TYPE, p.COVERAGES_JSON,
         p.STATUS, p.RIDER_CNT, p.RENEWAL_DT;


-- 3) Claim Fact (denormalized)
CREATE OR REPLACE TABLE analytics.claims_denorm AS
SELECT
  CAST(c.CLM_ID   AS INT64)   AS claim_identifier,
  CAST(c.POLICY_REF   AS INT64) AS policy_code,
  CAST(c.CUSTOMER_REF AS INT64) AS client_key,
  c.CLM_DT              AS claim_open_date,
  c.CLM_STATUS          AS status_code,
  c.CLM_AMT             AS claim_amount,
  c.ADJ_AMT             AS total_adjustment_amount,
  c.SETTLE_DT           AS settlement_date,
  c.CLAIM_JSON          AS claim_details,
  c.LOSS_TYPE           AS loss_category,
  c.REPORTED_BY         AS reported_by,
  c.INCIDENT_LOC        AS incident_location,
  c.INCIDENT_DT         AS incident_date,
  c.DAYS_OPEN           AS days_to_resolution,

  -- payments[]
  ARRAY(
    SELECT AS STRUCT
      CAST(pay.PAY_ID AS INT64)       AS payment_key,
      pay.PAY_DT                      AS payment_date,
      pay.AMT_PAID                    AS amount_paid,
      pay.PAYMENT_TYPE                AS method_used,
      pay.PAYMENT_STATUS              AS status
    FROM project.dataset.stage_db2_payments AS pay
    WHERE pay.CLM_ID = c.CLM_ID
  ) AS payments,

  -- adjustments[]
  ARRAY(
    SELECT AS STRUCT
      CAST(adj.ADJ_ID AS INT64)              AS adjustment_key,
      adj.ADJ_DT                             AS adjustment_date,
      adj.ADJ_AMT_SRC                        AS original_amount,
      adj.REASON_CD                          AS reason_code,
      adj.COMMENTS                           AS comments_text,
      adj.ADJ_JSON                           AS adjustment_meta
    FROM project.dataset.stage_db2_adjustments AS adj
    WHERE adj.CLM_ID = c.CLM_ID
  ) AS adjustments,

  -- events[]
  ARRAY(
    SELECT AS STRUCT
      ev.EVENT_SEQ                   AS sequence_number,
      ev.EVENT_DT                    AS occurred_on,
      ev.EVENT_TYPE                  AS event_type,
      ev.EVENT_DETAILS               AS event_details,
      ev.DETAILS_JSON                AS event_metadata,
      ev.USER_ID                     AS user_identifier
    FROM project.dataset.stage_db2_claim_events AS ev
    WHERE ev.CLM_ID = c.CLM_ID
  ) AS events

FROM project.dataset.stage_db2_claims AS c;


-- 4) Risk Ratings
CREATE OR REPLACE TABLE analytics.risk_ratings_denorm AS
SELECT
  CAST(r.RATING_KEY AS INT64)    AS rating_key,
  r.ZIP                          AS zip_code,
  r.POL_TYPE                     AS policy_type,
  r.RATING_JSON                  AS rating_details,
  r.SCORE                        AS score,
  r.EFFECTIVE_DT                 AS effective_date,
  r.EXPIRATION_DT                AS expiration_date
FROM project.dataset.stage_db2_risk_ratings AS r;


-- 5) Agent Dimension with commissions[]
CREATE OR REPLACE TABLE analytics.agents_denorm AS
SELECT
  CAST(a.AGENT_ID AS INT64)     AS agent_key,
  a.FIRST_NAME                  AS first_name,
  a.LAST_NAME                   AS last_name,
  a.REGION                      AS region,
  a.STATUS                      AS status,
  a.AGENT_JSON                  AS agent_meta,

  ARRAY(
    SELECT AS STRUCT
      c.COMM_ID                AS commission_key,
      c.COMM_DT                AS commission_date,
      c.COMM_AMT               AS commission_amount
    FROM project.dataset.stage_db2_commissions AS c
    WHERE c.AGENT_ID = a.AGENT_ID
  ) AS commissions

FROM project.dataset.stage_db2_agents AS a;
`;

// Databricks SQL Template
const databricksSQL = `-- Generated Databricks SQL for Data Migration
-- Source: PostgreSQL customers, orders tables  
-- Target: Delta Lake dim_customer, fact_order tables
-- Generated: ${new Date().toISOString()}

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
Generated: ${new Date().toISOString()}
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
-- Generated: ${new Date().toISOString()}

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