import { LineageGraph, TableNode, ColumnNode, Relationship } from '@/types/migration';

// Sample source tables (PostgreSQL)
const sourceColumns: ColumnNode[] = [
  {
    id: 'col-1',
    name: 'customer_id',
    dataType: 'INTEGER',
    nullable: false,
    isPrimaryKey: true,
    isForeignKey: false,
    sampleValues: ['1001', '1002', '1003'],
    description: 'Unique customer identifier'
  },
  {
    id: 'col-2',
    name: 'first_name',
    dataType: 'VARCHAR(50)',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    sampleValues: ['John', 'Jane', 'Bob'],
    description: 'Customer first name'
  },
  {
    id: 'col-3',
    name: 'last_name',
    dataType: 'VARCHAR(50)',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    sampleValues: ['Doe', 'Smith', 'Johnson'],
    description: 'Customer last name'
  },
  {
    id: 'col-4',
    name: 'email',
    dataType: 'VARCHAR(100)',
    nullable: true,
    isPrimaryKey: false,
    isForeignKey: false,
    sampleValues: ['john@example.com', 'jane@example.com', 'bob@example.com'],
    description: 'Customer email address'
  }
];

const orderColumns: ColumnNode[] = [
  {
    id: 'col-5',
    name: 'order_id',
    dataType: 'INTEGER',
    nullable: false,
    isPrimaryKey: true,
    isForeignKey: false,
    sampleValues: ['2001', '2002', '2003'],
    description: 'Unique order identifier'
  },
  {
    id: 'col-6',
    name: 'customer_id',
    dataType: 'INTEGER',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: true,
    references: {
      table: 'customers',
      column: 'customer_id'
    },
    sampleValues: ['1001', '1002', '1001'],
    description: 'Reference to customer'
  },
  {
    id: 'col-7',
    name: 'order_date',
    dataType: 'DATE',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    sampleValues: ['2024-01-15', '2024-01-16', '2024-01-17'],
    description: 'Date order was placed'
  },
  {
    id: 'col-8',
    name: 'total_amount',
    dataType: 'DECIMAL(10,2)',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    sampleValues: ['299.99', '149.50', '599.00'],
    description: 'Total order amount'
  },
  {
    id: 'col-26',
    name: 'product_id',
    dataType: 'INTEGER',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: true,
    references: {
      table: 'products',
      column: 'product_id'
    },
    sampleValues: ['3001', '3002', '3001'],
    description: 'Reference to product'
  }
];

const productColumns: ColumnNode[] = [
  {
    id: 'col-19',
    name: 'product_id',
    dataType: 'INTEGER',
    nullable: false,
    isPrimaryKey: true,
    isForeignKey: false,
    sampleValues: ['3001', '3002', '3003'],
    description: 'Unique product identifier'
  },
  {
    id: 'col-20',
    name: 'product_name',
    dataType: 'VARCHAR(100)',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    sampleValues: ['Laptop', 'Mouse', 'Keyboard'],
    description: 'Name of the product'
  },
  {
    id: 'col-21',
    name: 'price',
    dataType: 'DECIMAL(10,2)',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    sampleValues: ['1200.00', '25.00', '75.00'],
    description: 'Price of the product'
  }
];

const webLogColumns: ColumnNode[] = [
  {
    id: 'col-28',
    name: 'log_id',
    dataType: 'INTEGER',
    nullable: false,
    isPrimaryKey: true,
    isForeignKey: false,
    description: 'Unique log identifier'
  },
  {
    id: 'col-29',
    name: 'user_id',
    dataType: 'INTEGER',
    nullable: true,
    isPrimaryKey: false,
    isForeignKey: true,
    references: {
      table: 'customers',
      column: 'customer_id'
    },
    description: 'User who generated the log'
  },
  {
    id: 'col-30',
    name: 'page_view',
    dataType: 'VARCHAR(255)',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Page viewed by the user'
  },
  {
    id: 'col-31',
    name: 'timestamp',
    dataType: 'TIMESTAMP',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Timestamp of the log entry'
  }
];

const processedOrderColumns: ColumnNode[] = [
  {
    id: 'col-32',
    name: 'processed_order_id',
    dataType: 'INTEGER',
    nullable: false,
    isPrimaryKey: true,
    isForeignKey: false,
    description: 'Unique processed order identifier'
  },
  {
    id: 'col-33',
    name: 'order_id',
    dataType: 'INTEGER',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: true,
    references: {
      table: 'orders',
      column: 'order_id'
    },
    description: 'Original order ID'
  },
  {
    id: 'col-34',
    name: 'customer_id',
    dataType: 'INTEGER',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: true,
    references: {
      table: 'customers',
      column: 'customer_id'
    },
    description: 'Customer ID'
  },
  {
    id: 'col-35',
    name: 'processed_date',
    dataType: 'DATE',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Date of processing'
  }
];

// Sample target tables (BigQuery)
const targetCustomerColumns: ColumnNode[] = [
  {
    id: 'col-9',
    name: 'customer_key',
    dataType: 'INT64',
    nullable: false,
    isPrimaryKey: true,
    isForeignKey: false,
    description: 'Surrogate key for customer dimension'
  },
  {
    id: 'col-10',
    name: 'customer_id',
    dataType: 'INT64',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Natural key from source system'
  },
  {
    id: 'col-11',
    name: 'full_name',
    dataType: 'STRING',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Concatenated first and last name'
  },
  {
    id: 'col-12',
    name: 'email_address',
    dataType: 'STRING',
    nullable: true,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Customer email address'
  },
  {
    id: 'col-13',
    name: 'created_at',
    dataType: 'TIMESTAMP',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Record creation timestamp'
  }
];

const targetOrderColumns: ColumnNode[] = [
  {
    id: 'col-14',
    name: 'order_key',
    dataType: 'INT64',
    nullable: false,
    isPrimaryKey: true,
    isForeignKey: false,
    description: 'Surrogate key for order fact'
  },
  {
    id: 'col-15',
    name: 'order_id',
    dataType: 'INT64',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Natural key from source system'
  },
  {
    id: 'col-16',
    name: 'customer_key',
    dataType: 'INT64',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: true,
    references: {
      table: 'dim_customer',
      column: 'customer_key'
    },
    description: 'Foreign key to customer dimension'
  },
  {
    id: 'col-17',
    name: 'order_date_key',
    dataType: 'INT64',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Date key in YYYYMMDD format'
  },
  {
    id: 'col-18',
    name: 'order_amount',
    dataType: 'NUMERIC',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Total order amount'
  },
  {
    id: 'col-27',
    name: 'product_key',
    dataType: 'INT64',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: true,
    references: {
      table: 'dim_product',
      column: 'product_key'
    },
    description: 'Foreign key to product dimension'
  }
];

const targetProductColumns: ColumnNode[] = [
  {
    id: 'col-22',
    name: 'product_key',
    dataType: 'INT64',
    nullable: false,
    isPrimaryKey: true,
    isForeignKey: false,
    description: 'Surrogate key for product dimension'
  },
  {
    id: 'col-23',
    name: 'product_id',
    dataType: 'INT64',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Natural key from source system'
  },
  {
    id: 'col-24',
    name: 'product_name',
    dataType: 'STRING',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Name of the product'
  },
  {
    id: 'col-25',
    name: 'product_price',
    dataType: 'NUMERIC',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Price of the product'
  }
];

const targetWebTrafficColumns: ColumnNode[] = [
  {
    id: 'col-36',
    name: 'traffic_key',
    dataType: 'INT64',
    nullable: false,
    isPrimaryKey: true,
    isForeignKey: false,
    description: 'Surrogate key for web traffic fact'
  },
  {
    id: 'col-37',
    name: 'log_id',
    dataType: 'INT64',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: true,
    references: {
      table: 'web_logs',
      column: 'log_id'
    },
    description: 'Natural key from web logs'
  },
  {
    id: 'col-38',
    name: 'customer_key',
    dataType: 'INT64',
    nullable: true,
    isPrimaryKey: false,
    isForeignKey: true,
    references: {
      table: 'dim_customer',
      column: 'customer_key'
    },
    description: 'Foreign key to customer dimension'
  },
  {
    id: 'col-39',
    name: 'product_key',
    dataType: 'INT64',
    nullable: true,
    isPrimaryKey: false,
    isForeignKey: true,
    references: {
      table: 'dim_product',
      column: 'product_key'
    },
    description: 'Foreign key to product dimension'
  },
  {
    id: 'col-40',
    name: 'page_view_count',
    dataType: 'INT64',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Number of page views'
  },
  {
    id: 'col-41',
    name: 'traffic_timestamp',
    dataType: 'TIMESTAMP',
    nullable: false,
    isPrimaryKey: false,
    isForeignKey: false,
    description: 'Timestamp of the traffic event'
  }
];

export const mockTables: TableNode[] = [
  {
    id: 'src-customers',
    name: 'customers',
    schema: 'public',
    type: 'source',
    dialect: 'postgres',
    columns: sourceColumns,
    rowCount: 15420,
    size: '2.1 MB',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'src-orders',
    name: 'orders',
    schema: 'public',
    type: 'source',
    dialect: 'postgres',
    columns: orderColumns,
    rowCount: 48392,
    size: '8.7 MB',
    lastUpdated: '2024-01-15T11:45:00Z'
  },
  {
    id: 'src-products',
    name: 'products',
    schema: 'public',
    type: 'source',
    dialect: 'postgres',
    columns: productColumns,
    rowCount: 5000,
    size: '1.5 MB',
    lastUpdated: '2024-01-15T09:00:00Z'
  },
  {
    id: 'src-web-logs',
    name: 'web_logs',
    schema: 'public',
    type: 'source',
    dialect: 'postgres',
    columns: webLogColumns,
    rowCount: 120000,
    size: '15.0 MB',
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    id: 'int-processed-orders',
    name: 'processed_orders',
    schema: 'internal',
    type: 'source', // Can be considered source for downstream, or intermediate
    dialect: 'postgres',
    columns: processedOrderColumns,
    rowCount: 45000,
    size: '5.0 MB',
    lastUpdated: '2024-01-15T13:00:00Z'
  },
  {
    id: 'tgt-dim-customer',
    name: 'dim_customer',
    schema: 'analytics',
    type: 'target',
    dialect: 'bigquery',
    columns: targetCustomerColumns,
    rowCount: 0,
    size: '0 MB',
    lastUpdated: undefined
  },
  {
    id: 'tgt-fact-order',
    name: 'fact_order',
    schema: 'analytics',
    type: 'target',
    dialect: 'bigquery',
    columns: targetOrderColumns,
    rowCount: 0,
    size: '0 MB',
    lastUpdated: undefined
  },
  {
    id: 'tgt-dim-product',
    name: 'dim_product',
    schema: 'analytics',
    type: 'target',
    dialect: 'bigquery',
    columns: targetProductColumns,
    rowCount: 0,
    size: '0 MB',
    lastUpdated: undefined
  },
  {
    id: 'tgt-fact-web-traffic',
    name: 'fact_web_traffic',
    schema: 'analytics',
    type: 'target',
    dialect: 'bigquery',
    columns: targetWebTrafficColumns,
    rowCount: 0,
    size: '0 MB',
    lastUpdated: undefined
  }
];

export const mockRelationships: Relationship[] = [
  {
    id: 'rel-1',
    sourceTable: 'customers',
    sourceColumn: 'customer_id',
    targetTable: 'orders',
    targetColumn: 'customer_id',
    relationshipType: 'one-to-many',
    confidence: 0.95
  },
  {
    id: 'rel-2',
    sourceTable: 'customers',
    sourceColumn: 'customer_id',
    targetTable: 'dim_customer',
    targetColumn: 'customer_id',
    relationshipType: 'one-to-one',
    confidence: 0.98
  },
  {
    id: 'rel-3',
    sourceTable: 'orders',
    sourceColumn: 'order_id',
    targetTable: 'processed_orders',
    targetColumn: 'order_id',
    relationshipType: 'one-to-one',
    confidence: 0.90
  },
  {
    id: 'rel-4',
    sourceTable: 'processed_orders',
    sourceColumn: 'order_id',
    targetTable: 'fact_order',
    targetColumn: 'order_id',
    relationshipType: 'one-to-one',
    confidence: 0.98
  },
  {
    id: 'rel-5',
    sourceTable: 'dim_customer',
    sourceColumn: 'customer_key',
    targetTable: 'fact_order',
    targetColumn: 'customer_key',
    relationshipType: 'one-to-many',
    confidence: 0.92
  },
  {
    id: 'rel-6',
    sourceTable: 'products',
    sourceColumn: 'product_id',
    targetTable: 'orders',
    targetColumn: 'product_id',
    relationshipType: 'one-to-many',
    confidence: 0.88
  },
  {
    id: 'rel-7',
    sourceTable: 'products',
    sourceColumn: 'product_id',
    targetTable: 'dim_product',
    targetColumn: 'product_id',
    relationshipType: 'one-to-one',
    confidence: 0.95
  },
  {
    id: 'rel-8',
    sourceTable: 'dim_product',
    sourceColumn: 'product_key',
    targetTable: 'fact_order',
    targetColumn: 'product_key',
    relationshipType: 'one-to-many',
    confidence: 0.80
  },
  {
    id: 'rel-9',
    sourceTable: 'web_logs',
    sourceColumn: 'log_id',
    targetTable: 'fact_web_traffic',
    targetColumn: 'log_id',
    relationshipType: 'one-to-one',
    confidence: 0.90
  },
  {
    id: 'rel-10',
    sourceTable: 'customers',
    sourceColumn: 'customer_id',
    targetTable: 'fact_web_traffic',
    targetColumn: 'customer_key',
    relationshipType: 'one-to-many',
    confidence: 0.85
  },
  {
    id: 'rel-11',
    sourceTable: 'products',
    sourceColumn: 'product_id',
    targetTable: 'fact_web_traffic',
    targetColumn: 'product_key',
    relationshipType: 'one-to-many',
    confidence: 0.75
  },
  {
    id: 'rel-12',
    sourceTable: 'processed_orders',
    sourceColumn: 'customer_id',
    targetTable: 'fact_web_traffic',
    targetColumn: 'customer_key',
    relationshipType: 'one-to-many',
    confidence: 0.70
  },
  // Mapping relationships for DFD diagram
  {
    id: 'map-1',
    sourceTable: 'customers',
    sourceColumn: 'customer_id',
    targetTable: 'dim_customer',
    targetColumn: 'customer_key',
    relationshipType: 'one-to-one',
    confidence: 0.85
  },
  {
    id: 'map-2',
    sourceTable: 'customers',
    sourceColumn: 'first_name',
    targetTable: 'dim_customer',
    targetColumn: 'full_name',
    relationshipType: 'one-to-one',
    confidence: 0.75
  },
  {
    id: 'map-3',
    sourceTable: 'customers',
    sourceColumn: 'last_name',
    targetTable: 'dim_customer',
    targetColumn: 'full_name',
    relationshipType: 'one-to-one',
    confidence: 0.75
  },
  {
    id: 'map-4',
    sourceTable: 'customers',
    sourceColumn: 'email',
    targetTable: 'dim_customer',
    targetColumn: 'email_address',
    relationshipType: 'one-to-one',
    confidence: 0.90
  },
  {
    id: 'map-5',
    sourceTable: 'orders',
    sourceColumn: 'order_id',
    targetTable: 'fact_order',
    targetColumn: 'order_key',
    relationshipType: 'one-to-one',
    confidence: 0.85
  },
  {
    id: 'map-6',
    sourceTable: 'orders',
    sourceColumn: 'customer_id',
    targetTable: 'fact_order',
    targetColumn: 'customer_key',
    relationshipType: 'one-to-one',
    confidence: 0.80
  },
  {
    id: 'map-7',
    sourceTable: 'orders',
    sourceColumn: 'order_date',
    targetTable: 'fact_order',
    targetColumn: 'order_date_key',
    relationshipType: 'one-to-one',
    confidence: 0.70
  },
  {
    id: 'map-8',
    sourceTable: 'orders',
    sourceColumn: 'total_amount',
    targetTable: 'fact_order',
    targetColumn: 'order_amount',
    relationshipType: 'one-to-one',
    confidence: 0.95
  },
  {
    id: 'map-9',
    sourceTable: 'products',
    sourceColumn: 'product_id',
    targetTable: 'dim_product',
    targetColumn: 'product_key',
    relationshipType: 'one-to-one',
    confidence: 0.90
  },
  {
    id: 'map-10',
    sourceTable: 'products',
    sourceColumn: 'product_name',
    targetTable: 'dim_product',
    targetColumn: 'product_name',
    relationshipType: 'one-to-one',
    confidence: 0.85
  },
  {
    id: 'map-11',
    sourceTable: 'products',
    sourceColumn: 'price',
    targetTable: 'dim_product',
    targetColumn: 'product_price',
    relationshipType: 'one-to-one',
    confidence: 0.92
  },
  {
    id: 'map-12',
    sourceTable: 'orders',
    sourceColumn: 'product_id',
    targetTable: 'fact_order',
    targetColumn: 'product_key',
    relationshipType: 'one-to-many',
    confidence: 0.78
  },
  {
    id: 'map-13',
    sourceTable: 'web_logs',
    sourceColumn: 'log_id',
    targetTable: 'fact_web_traffic',
    targetColumn: 'log_id',
    relationshipType: 'one-to-one',
    confidence: 0.88
  },
  {
    id: 'map-14',
    sourceTable: 'customers',
    sourceColumn: 'customer_id',
    targetTable: 'fact_web_traffic',
    targetColumn: 'customer_key',
    relationshipType: 'one-to-many',
    confidence: 0.75
  },
  {
    id: 'map-15',
    sourceTable: 'products',
    sourceColumn: 'product_id',
    targetTable: 'fact_web_traffic',
    targetColumn: 'product_key',
    relationshipType: 'one-to-many',
    confidence: 0.65
  },
  {
    id: 'map-16',
    sourceTable: 'processed_orders',
    sourceColumn: 'processed_order_id',
    targetTable: 'fact_order',
    targetColumn: 'order_key',
    relationshipType: 'one-to-one',
    confidence: 0.90
  },
  {
    id: 'map-17',
    sourceTable: 'processed_orders',
    sourceColumn: 'customer_id',
    targetTable: 'fact_web_traffic',
    targetColumn: 'customer_key',
    relationshipType: 'one-to-many',
    confidence: 0.70
  }
];

export const mockLineageGraph: LineageGraph = {
  tables: mockTables,
  relationships: mockRelationships,
  statistics: {
    totalTables: mockTables.length,
    totalColumns: mockTables.reduce((sum, table) => sum + table.columns.length, 0),
    totalRelationships: mockRelationships.length,
    complexityScore: 8.5
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

// DFD Mapping Data - Simplified format for drawing mapping lines between source and target tables
export const dfdMappingData = {
  tables: [
    {
      id: 'customers',
      name: 'customers',
      type: 'source',
      schema: 'public',
      dialect: 'postgres',
      position: { x: 100, y: 100 }
    },
    {
      id: 'orders',
      name: 'orders',
      type: 'source',
      schema: 'public',
      dialect: 'postgres',
      position: { x: 100, y: 300 }
    },
    {
      id: 'products',
      name: 'products',
      type: 'source',
      schema: 'public',
      dialect: 'postgres',
      position: { x: 100, y: 500 }
    },
    {
      id: 'web_logs',
      name: 'web_logs',
      type: 'source',
      schema: 'public',
      dialect: 'postgres',
      position: { x: 100, y: 700 }
    },
    {
      id: 'processed_orders',
      name: 'processed_orders',
      type: 'intermediate', // New type for intermediate tables
      schema: 'internal',
      dialect: 'postgres',
      position: { x: 300, y: 300 }
    },
    {
      id: 'dim_customer',
      name: 'dim_customer',
      type: 'target',
      schema: 'analytics',
      dialect: 'bigquery',
      position: { x: 700, y: 100 }
    },
    {
      id: 'fact_order',
      name: 'fact_order',
      type: 'target',
      schema: 'analytics',
      dialect: 'bigquery',
      position: { x: 700, y: 300 }
    },
    {
      id: 'dim_product',
      name: 'dim_product',
      type: 'target',
      schema: 'analytics',
      dialect: 'bigquery',
      position: { x: 700, y: 500 }
    },
    {
      id: 'fact_web_traffic',
      name: 'fact_web_traffic',
      type: 'target',
      schema: 'analytics',
      dialect: 'bigquery',
      position: { x: 700, y: 700 }
    }
  ],
  mappings: [
    {
      id: 'map-1',
      sourceTable: 'customers',
      sourceColumn: 'customer_id',
      targetTable: 'dim_customer',
      targetColumn: 'customer_key',
      confidence: 0.85,
      path: [
        { x: 200, y: 120 },
        { x: 450, y: 120 },
        { x: 700, y: 120 }
      ]
    },
    {
      id: 'map-2',
      sourceTable: 'customers',
      sourceColumn: 'first_name',
      targetTable: 'dim_customer',
      targetColumn: 'full_name',
      confidence: 0.75,
      path: [
        { x: 200, y: 140 },
        { x: 450, y: 140 },
        { x: 700, y: 140 }
      ]
    },
    {
      id: 'map-3',
      sourceTable: 'customers',
      sourceColumn: 'last_name',
      targetTable: 'dim_customer',
      targetColumn: 'full_name',
      confidence: 0.75,
      path: [
        { x: 200, y: 160 },
        { x: 450, y: 160 },
        { x: 700, y: 140 }
      ]
    },
    {
      id: 'map-4',
      sourceTable: 'customers',
      sourceColumn: 'email',
      targetTable: 'dim_customer',
      targetColumn: 'email_address',
      confidence: 0.90,
      path: [
        { x: 200, y: 180 },
        { x: 450, y: 180 },
        { x: 700, y: 180 }
      ]
    },
    {
      id: 'map-5',
      sourceTable: 'orders',
      sourceColumn: 'order_id',
      targetTable: 'processed_orders',
      targetColumn: 'order_id',
      confidence: 0.90,
      path: [
        { x: 200, y: 320 },
        { x: 300, y: 320 }
      ]
    },
    {
      id: 'map-6',
      sourceTable: 'processed_orders',
      sourceColumn: 'processed_order_id',
      targetTable: 'fact_order',
      targetColumn: 'order_key',
      confidence: 0.90,
      path: [
        { x: 400, y: 320 },
        { x: 700, y: 320 }
      ]
    },
    {
      id: 'map-7',
      sourceTable: 'orders',
      sourceColumn: 'customer_id',
      targetTable: 'processed_orders',
      targetColumn: 'customer_id',
      confidence: 0.85,
      path: [
        { x: 200, y: 340 },
        { x: 300, y: 340 }
      ]
    },
    {
      id: 'map-8',
      sourceTable: 'processed_orders',
      sourceColumn: 'customer_id',
      targetTable: 'fact_order',
      targetColumn: 'customer_key',
      confidence: 0.85,
      path: [
        { x: 400, y: 340 },
        { x: 700, y: 340 }
      ]
    },
    {
      id: 'map-9',
      sourceTable: 'products',
      sourceColumn: 'product_id',
      targetTable: 'dim_product',
      targetColumn: 'product_key',
      confidence: 0.90,
      path: [
        { x: 200, y: 520 },
        { x: 450, y: 520 },
        { x: 700, y: 520 }
      ]
    },
    {
      id: 'map-10',
      sourceTable: 'products',
      sourceColumn: 'product_name',
      targetTable: 'dim_product',
      targetColumn: 'product_name',
      confidence: 0.85,
      path: [
        { x: 200, y: 540 },
        { x: 450, y: 540 },
        { x: 700, y: 540 }
      ]
    },
    {
      id: 'map-11',
      sourceTable: 'products',
      sourceColumn: 'price',
      targetTable: 'dim_product',
      targetColumn: 'product_price',
      confidence: 0.92,
      path: [
        { x: 200, y: 560 },
        { x: 450, y: 560 },
        { x: 700, y: 560 }
      ]
    },
    {
      id: 'map-12',
      sourceTable: 'web_logs',
      sourceColumn: 'log_id',
      targetTable: 'fact_web_traffic',
      targetColumn: 'log_id',
      confidence: 0.88,
      path: [
        { x: 200, y: 720 },
        { x: 450, y: 720 },
        { x: 700, y: 720 }
      ]
    },
    {
      id: 'map-13',
      sourceTable: 'customers',
      sourceColumn: 'customer_id',
      targetTable: 'fact_web_traffic',
      targetColumn: 'customer_key',
      confidence: 0.75,
      path: [
        { x: 200, y: 100 }, // From customers
        { x: 450, y: 740 }, // Bend towards fact_web_traffic
        { x: 700, y: 740 }
      ]
    },
    {
      id: 'map-14',
      sourceTable: 'products',
      sourceColumn: 'product_id',
      targetTable: 'fact_web_traffic',
      targetColumn: 'product_key',
      confidence: 0.65,
      path: [
        { x: 200, y: 500 }, // From products
        { x: 450, y: 760 }, // Bend towards fact_web_traffic
        { x: 700, y: 760 }
      ]
    },
    {
      id: 'map-15',
      sourceTable: 'processed_orders',
      sourceColumn: 'processed_order_id',
      targetTable: 'fact_web_traffic',
      targetColumn: 'order_key', // Assuming fact_web_traffic has an order_key
      confidence: 0.70,
      path: [
        { x: 400, y: 360 }, // From processed_orders
        { x: 550, y: 780 }, // Bend towards fact_web_traffic
        { x: 700, y: 780 }
      ]
    }
  ]
};
