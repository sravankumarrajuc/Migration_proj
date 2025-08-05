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
    targetTable: 'fact_order',
    targetColumn: 'order_id',
    relationshipType: 'one-to-one',
    confidence: 0.98
  },
  {
    id: 'rel-4',
    sourceTable: 'dim_customer',
    sourceColumn: 'customer_key',
    targetTable: 'fact_order',
    targetColumn: 'customer_key',
    relationshipType: 'one-to-many',
    confidence: 0.92
  }
];

export const mockLineageGraph: LineageGraph = {
  tables: mockTables,
  relationships: mockRelationships,
  statistics: {
    totalTables: mockTables.length,
    totalColumns: mockTables.reduce((sum, table) => sum + table.columns.length, 0),
    totalRelationships: mockRelationships.length,
    complexityScore: 7.2
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