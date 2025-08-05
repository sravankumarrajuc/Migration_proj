import { CodePlatform, GeneratedCode, CodeOptimization } from '@/types/migration';

// BigQuery SQL Template
const bigQuerySQL = `-- Generated BigQuery SQL for Data Migration
-- Source: PostgreSQL customers, orders tables
-- Target: BigQuery dim_customer, fact_order tables
-- Generated: ${new Date().toISOString()}

-- Customer Dimension Migration
CREATE OR REPLACE TABLE \`project.dataset.dim_customer\` AS
SELECT 
  -- Direct mapping: customer_id -> customer_id
  CAST(c.customer_id AS STRING) AS customer_id,
  
  -- Composite mapping: first_name + last_name -> full_name
  CONCAT(c.first_name, ' ', c.last_name) AS full_name,
  
  -- Direct mapping with validation: email -> email
  CASE 
    WHEN c.email IS NOT NULL AND REGEXP_CONTAINS(c.email, r'^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$')
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
FROM \`source_project.source_dataset.customers\` c
WHERE c.customer_id IS NOT NULL;

-- Order Fact Migration  
CREATE OR REPLACE TABLE \`project.dataset.fact_order\` AS
SELECT
  -- Direct mapping: order_id -> order_id
  CAST(o.order_id AS STRING) AS order_id,
  
  -- Foreign key mapping: customer_id -> customer_id
  CAST(o.customer_id AS STRING) AS customer_id,
  
  -- Type conversion: order_date -> order_date (TIMESTAMP to DATE)
  DATE(o.order_date) AS order_date,
  
  -- Computed field: order_date -> date_key (YYYYMMDD format)
  CAST(FORMAT_DATE('%Y%m%d', DATE(o.order_date)) AS INT64) AS date_key,
  
  -- Type conversion: total_amount -> total_amount (DECIMAL to NUMERIC)
  CAST(o.total_amount AS NUMERIC) AS total_amount,
  
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
FROM \`source_project.source_dataset.orders\` o
WHERE o.order_id IS NOT NULL
  AND o.customer_id IS NOT NULL;`;

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
            email_pattern = r'^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$'
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
    description: 'Cluster fact_order table by customer_id for improved query performance',
    suggestion: 'Add CLUSTER BY customer_id to CREATE TABLE statement',
    impact: 'high',
    autoApplicable: true
  },
  {
    id: 'opt-2', 
    type: 'performance',
    title: 'Optimize date partitioning',
    description: 'Partition fact_order table by order_date for better performance and cost control',
    suggestion: 'Add PARTITION BY DATE(order_date) to table definition',
    impact: 'high',
    autoApplicable: true
  },
  {
    id: 'opt-3',
    type: 'best-practice',
    title: 'Add data quality checks',
    description: 'Include NOT NULL constraints and data validation checks',
    suggestion: 'Add WHERE clauses to filter invalid records before loading',
    impact: 'medium',
    autoApplicable: false
  },
  {
    id: 'opt-4',
    type: 'readability', 
    title: 'Improve code documentation',
    description: 'Add more detailed comments explaining business logic',
    suggestion: 'Include field-level comments and transformation reasoning',
    impact: 'low',
    autoApplicable: true
  },
  {
    id: 'opt-5',
    type: 'performance',
    title: 'Use MERGE instead of CREATE OR REPLACE',
    description: 'For incremental updates, MERGE statements are more efficient',
    suggestion: 'Replace CREATE OR REPLACE with MERGE statements for updates',
    impact: 'medium',
    autoApplicable: false
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