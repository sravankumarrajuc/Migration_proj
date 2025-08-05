export interface Project {
  id: string;
  name: string;
  description: string;
  sourceDialect: SchemaDialect;
  targetDialect: SchemaDialect;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  progress: ProjectProgress;
}

export interface ProjectProgress {
  currentPhase: MigrationPhase;
  completedPhases: MigrationPhase[];
  schemasUploaded: boolean;
  mappingsComplete: boolean;
  codeGenerated: boolean;
  validationComplete: boolean;
}

export type MigrationPhase = 'upload' | 'discovery' | 'mapping' | 'codegen' | 'validation';

export type ProjectStatus = 'draft' | 'in-progress' | 'completed' | 'failed';

export type SchemaDialect = 'db2' | 'cobol' | 'bigquery' | 'snowflake' | 'postgres' | 'custom-json';

export interface SchemaFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  dialect: SchemaDialect;
  preview?: SchemaPreview;
}

export interface SchemaPreview {
  tableCount: number;
  columnCount: number;
  sampleTables: string[];
  estimatedComplexity: 'simple' | 'moderate' | 'complex';
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  sourceDialect: SchemaDialect;
  targetDialect: SchemaDialect;
  estimatedDuration: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

// Discovery & Lineage Types
export interface TableNode {
  id: string;
  name: string;
  schema: string;
  type: 'source' | 'target' | 'intermediate'; // Added 'intermediate' type
  dialect: SchemaDialect;
  columns: ColumnNode[];
  rowCount?: number;
  size?: string;
  lastUpdated?: string;
  position?: { x: number; y: number }; // Added position property
}

export interface ColumnNode {
  id: string;
  name: string;
  dataType: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  references?: {
    table: string;
    column: string;
  };
  sampleValues?: string[];
  description?: string;
}

export interface Relationship {
  id: string;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  relationshipType: 'one-to-one' | 'one-to-many' | 'many-to-many';
  confidence: number;
}

export interface TableMappingLine {
  id: string;
  sourceTable: string;
  targetTable: string;
  confidence: number;
  path: { x: number; y: number }[];
}

export interface LineageGraph {
  tables: TableNode[];
  relationships: Relationship[];
  mappings: TableMappingLine[];
  statistics: {
    totalTables: number;
    totalColumns: number;
    totalRelationships: number;
    totalMappings: number;
    complexityScore: number;
  };
}

export interface DiscoveryState {
  isProcessing: boolean;
  progress: number;
  currentStep: string;
  lineageGraph: LineageGraph | null;
  error: string | null;
  completedAt: string | null;
}

// Field Mapping Types
export interface FieldMapping {
  id: string;
  sourceTableId: string;
  sourceColumnId: string;
  targetTableId: string;
  targetColumnId: string;
  transformationType: TransformationType;
  confidence: number;
  status: MappingStatus;
  formula?: string;
  description?: string;
  createdAt: string;
  approvedAt?: string;
}

export type TransformationType = 
  | 'direct' 
  | 'computed' 
  | 'concatenated' 
  | 'cast' 
  | 'case_when' 
  | 'custom';

export type MappingStatus = 'suggested' | 'approved' | 'rejected' | 'manual';

export interface MappingRule {
  id: string;
  name: string;
  description: string;
  sourceColumns: string[];
  targetColumn: string;
  transformation: string;
  confidence: number;
  isComposite: boolean;
}

export interface TableMapping {
  sourceTableId: string;
  targetTableId: string;
  fieldMappings: FieldMapping[];
  completionPercentage: number;
  requiredFieldsCovered: number;
  totalRequiredFields: number;
}

export interface MappingState {
  isProcessing: boolean;
  progress: number;
  currentStep: string;
  selectedSourceTable: string | null;
  selectedTargetTable: string | null;
  currentTableMapping: TableMapping | null;
  allMappings: TableMapping[];
  suggestions: FieldMapping[];
  error: string | null;
  completedAt: string | null;
}

// Code Generation Types
export type CodePlatform = 'bigquery' | 'databricks' | 'python-beam' | 'dbt';

export interface GeneratedCode {
  platform: CodePlatform;
  content: string;
  fileName: string;
  language: string;
  size: number;
  lastGenerated: string;
}

export interface CodeOptimization {
  id: string;
  type: 'performance' | 'readability' | 'best-practice';
  title: string;
  description: string;
  suggestion: string;
  impact: 'low' | 'medium' | 'high';
  autoApplicable: boolean;
}

export interface CodeGenerationState {
  isProcessing: boolean;
  progress: number;
  currentStep: string;
  selectedPlatform: CodePlatform;
  generatedCodes: Record<CodePlatform, GeneratedCode | null>;
  optimizations: CodeOptimization[];
  previewMode: 'code' | 'execution' | 'performance';
  error: string | null;
  completedAt: string | null;
}

// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
  authenticated: boolean;
}