# Complete Backend Implementation Plan for Migration Tool

## Overview
This document outlines the comprehensive plan for implementing a complete Python backend with LLM integration to replace the current static/mock data in the React/TypeScript frontend migration application.

## Current Architecture Analysis

### Static Data Usage Identified
- **Projects Management**: Mock project templates, status tracking, progress management
- **Schema Discovery**: Mock lineage graphs, table relationships, column mappings  
- **Field Mapping**: Mock AI suggestions, transformation rules, confidence scoring
- **Code Generation**: Mock generated SQL/Python code for multiple platforms (BigQuery, Databricks, Python Beam, dbt)
- **Validation**: Mock validation reports, schema comparisons, anomaly detection
- **User Management**: Mock user profiles and authentication

### Key Data Structures
- Complex migration workflows with 5 phases: upload → discovery → mapping → codegen → validation
- Detailed schema metadata (tables, columns, relationships, lineage)
- AI-powered field mapping suggestions with confidence scores
- Multi-platform code generation (BigQuery, Databricks, Python Beam, dbt)
- Comprehensive validation and reporting

## Backend Architecture Design

### Technology Stack
- **Framework**: FastAPI (Python) for high-performance async API
- **Database**: PostgreSQL for relational data + Redis for caching
- **LLM Integration**: OpenAI GPT-4/Claude for AI-powered features
- **File Processing**: Apache Airflow for ETL workflows
- **Authentication**: JWT-based auth with OAuth2 support
- **Deployment**: Docker containers with Kubernetes orchestration
- **Message Queue**: Celery with Redis for background tasks
- **File Storage**: AWS S3 or MinIO for schema files
- **Monitoring**: Prometheus + Grafana for observability

### Core Backend Services

#### 1. Project Management Service
**Purpose**: Handle project lifecycle, templates, and user management

**API Endpoints**:
```python
POST   /api/v1/projects                    # Create new project
GET    /api/v1/projects                    # List user projects
GET    /api/v1/projects/{id}               # Get project details
PUT    /api/v1/projects/{id}               # Update project
DELETE /api/v1/projects/{id}               # Delete project
GET    /api/v1/project-templates           # Get available templates
POST   /api/v1/projects/{id}/phases/{phase} # Update project phase
```

**Database Tables**:
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    picture_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source_dialect VARCHAR(50) NOT NULL,
    target_dialect VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    current_phase VARCHAR(50) DEFAULT 'upload',
    completed_phases TEXT[] DEFAULT '{}',
    schemas_uploaded BOOLEAN DEFAULT false,
    mappings_complete BOOLEAN DEFAULT false,
    validation_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE project_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source_dialect VARCHAR(50) NOT NULL,
    target_dialect VARCHAR(50) NOT NULL,
    estimated_duration VARCHAR(50),
    complexity VARCHAR(50),
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. Schema Discovery Service with LLM
**Purpose**: Analyze uploaded schema files and generate intelligent lineage graphs

**API Endpoints**:
```python
POST   /api/v1/projects/{id}/files/upload     # Upload schema files
GET    /api/v1/projects/{id}/files             # List uploaded files
DELETE /api/v1/projects/{id}/files/{file_id}  # Delete file
POST   /api/v1/projects/{id}/discovery/start  # Start discovery process
GET    /api/v1/projects/{id}/discovery/status # Get discovery status
GET    /api/v1/projects/{id}/lineage-graph    # Get generated lineage graph
POST   /api/v1/projects/{id}/discovery/analyze # LLM-powered analysis
```

**Database Tables**:
```sql
CREATE TABLE schema_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    dialect VARCHAR(50) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    status VARCHAR(50) DEFAULT 'uploading',
    preview_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
);

CREATE TABLE discovered_schemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    schema_content JSONB NOT NULL,
    lineage_graph JSONB,
    table_count INTEGER,
    column_count INTEGER,
    relationship_count INTEGER,
    complexity_score DECIMAL(3,1),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE table_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schema_id UUID REFERENCES discovered_schemas(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    schema_name VARCHAR(255),
    table_type VARCHAR(50), -- 'source', 'target', 'intermediate'
    dialect VARCHAR(50),
    row_count BIGINT,
    size_mb DECIMAL(10,2),
    last_updated TIMESTAMP,
    position_x INTEGER,
    position_y INTEGER,
    metadata JSONB
);

CREATE TABLE column_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID REFERENCES table_nodes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    data_type VARCHAR(100) NOT NULL,
    nullable BOOLEAN DEFAULT true,
    is_primary_key BOOLEAN DEFAULT false,
    is_foreign_key BOOLEAN DEFAULT false,
    references_table VARCHAR(255),
    references_column VARCHAR(255),
    sample_values TEXT[],
    description TEXT
);

CREATE TABLE relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schema_id UUID REFERENCES discovered_schemas(id) ON DELETE CASCADE,
    source_table VARCHAR(255) NOT NULL,
    source_column VARCHAR(255) NOT NULL,
    target_table VARCHAR(255) NOT NULL,
    target_column VARCHAR(255) NOT NULL,
    relationship_type VARCHAR(50), -- 'one-to-one', 'one-to-many', 'many-to-many'
    confidence DECIMAL(3,2) DEFAULT 0.0,
    ai_generated BOOLEAN DEFAULT false
);
```

**LLM Integration**:
```python
class SchemaDiscoveryLLM:
    async def analyze_schema_content(self, schema_content: str) -> SchemaAnalysis:
        prompt = f"""
        Analyze the following database schema and provide structured insights:
        
        {schema_content}
        
        Please identify:
        1. All tables and their purposes
        2. Column data types and constraints
        3. Primary and foreign key relationships
        4. Potential data quality issues
        5. Suggested optimizations
        6. Business domain classification
        
        Return as structured JSON with confidence scores.
        """
        return await self.llm_client.generate(prompt)
    
    async def suggest_table_relationships(self, tables: List[Table]) -> List[Relationship]:
        prompt = f"""
        Given these database tables: {tables}
        
        Suggest potential relationships between tables based on:
        1. Column name similarities
        2. Data type compatibility  
        3. Naming conventions
        4. Business logic patterns
        
        Return relationships with confidence scores (0-100).
        """
        return await self.llm_client.generate(prompt)
```

#### 3. AI-Powered Mapping Service
**Purpose**: Generate intelligent field mappings between source and target schemas

**API Endpoints**:
```python
POST   /api/v1/projects/{id}/mapping/start           # Start mapping process
GET    /api/v1/projects/{id}/mapping/status          # Get mapping status
POST   /api/v1/projects/{id}/mapping/ai-suggestions  # Generate AI suggestions
GET    /api/v1/projects/{id}/mapping/suggestions     # Get mapping suggestions
POST   /api/v1/projects/{id}/mapping/approve         # Approve mappings
POST   /api/v1/projects/{id}/mapping/reject          # Reject mappings
GET    /api/v1/projects/{id}/mapping/rules           # Get transformation rules
POST   /api/v1/projects/{id}/mapping/custom          # Add custom mapping
```

**Database Tables**:
```sql
CREATE TABLE field_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    source_table_id VARCHAR(255) NOT NULL,
    source_column_id VARCHAR(255) NOT NULL,
    target_table_id VARCHAR(255) NOT NULL,
    target_column_id VARCHAR(255) NOT NULL,
    transformation_type VARCHAR(50), -- 'direct', 'computed', 'concatenated', 'cast', 'case_when', 'custom'
    confidence DECIMAL(3,2) DEFAULT 0.0,
    status VARCHAR(50) DEFAULT 'suggested', -- 'suggested', 'approved', 'rejected', 'manual'
    formula TEXT,
    description TEXT,
    ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    approved_at TIMESTAMP
);

CREATE TABLE mapping_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source_columns TEXT[] NOT NULL,
    target_column VARCHAR(255) NOT NULL,
    transformation TEXT NOT NULL,
    confidence DECIMAL(3,2) DEFAULT 0.0,
    is_composite BOOLEAN DEFAULT false,
    ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE table_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    source_table_id VARCHAR(255) NOT NULL,
    target_table_id VARCHAR(255) NOT NULL,
    completion_percentage INTEGER DEFAULT 0,
    required_fields_covered INTEGER DEFAULT 0,
    total_required_fields INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**LLM Integration**:
```python
class MappingServiceLLM:
    async def generate_field_mappings(self, source_schema: Schema, target_schema: Schema) -> List[FieldMapping]:
        prompt = f"""
        Generate field mappings between source and target schemas:
        
        Source Schema: {source_schema}
        Target Schema: {target_schema}
        
        For each potential mapping, provide:
        1. Source field → Target field
        2. Transformation type (direct, computed, cast, etc.)
        3. Transformation formula if needed
        4. Confidence score (0-100)
        5. Potential data loss warnings
        6. Business logic explanation
        
        Focus on:
        - Exact name matches (high confidence)
        - Semantic similarity (medium confidence)
        - Data type compatibility
        - Business domain knowledge
        """
        return await self.llm_client.generate(prompt)
    
    async def suggest_transformation_logic(self, source_field: Field, target_field: Field) -> str:
        prompt = f"""
        Generate transformation logic for mapping:
        Source: {source_field.name} ({source_field.data_type})
        Target: {target_field.name} ({target_field.data_type})
        
        Consider:
        1. Data type conversion
        2. Null handling
        3. Format transformations
        4. Business rules
        5. Data validation
        
        Return SQL transformation expression.
        """
        return await self.llm_client.generate(prompt)
```

#### 4. Code Generation Service with LLM
**Purpose**: Generate migration code for multiple platforms with AI optimization

**API Endpoints**:
```python
POST   /api/v1/projects/{id}/codegen/start        # Start code generation
GET    /api/v1/projects/{id}/codegen/status       # Get generation status
POST   /api/v1/projects/{id}/codegen/generate     # Generate for platform
GET    /api/v1/projects/{id}/codegen/codes        # Get generated codes
POST   /api/v1/projects/{id}/codegen/optimize     # Optimize code
GET    /api/v1/projects/{id}/codegen/optimizations # Get optimization suggestions
POST   /api/v1/projects/{id}/codegen/validate     # Validate generated code
```

**Database Tables**:
```sql
CREATE TABLE generated_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'bigquery', 'databricks', 'python-beam', 'dbt'
    code_content TEXT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    language VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    optimized_at TIMESTAMP
);

CREATE TABLE code_optimizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_id UUID REFERENCES generated_codes(id) ON DELETE CASCADE,
    optimization_type VARCHAR(50), -- 'performance', 'readability', 'best-practice', 'cost-optimization'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    suggestion TEXT,
    impact VARCHAR(20), -- 'low', 'medium', 'high'
    auto_applicable BOOLEAN DEFAULT false,
    applied BOOLEAN DEFAULT false,
    ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**LLM Integration**:
```python
class CodeGenerationLLM:
    async def generate_migration_code(self, mappings: List[FieldMapping], platform: str) -> str:
        prompt = f"""
        Generate {platform} migration code for these field mappings:
        {mappings}
        
        Requirements:
        1. Include all necessary transformations
        2. Handle data type conversions properly
        3. Add null value handling
        4. Include performance optimizations
        5. Add comprehensive error handling
        6. Include documentation comments
        7. Follow platform best practices
        
        Platform-specific considerations:
        - BigQuery: Use STRUCT, ARRAY, partitioning, clustering
        - Databricks: Use Delta Lake features, optimize writes
        - Python Beam: Handle streaming, windowing, side inputs
        - dbt: Use macros, tests, documentation
        """
        return await self.llm_client.generate(prompt)
    
    async def optimize_generated_code(self, code: str, platform: str) -> List[CodeOptimization]:
        prompt = f"""
        Analyze this {platform} code and suggest optimizations:
        
        {code}
        
        Provide optimization suggestions for:
        1. Performance improvements
        2. Cost reduction
        3. Code readability
        4. Best practices compliance
        5. Error handling
        6. Maintainability
        
        For each suggestion, include:
        - Type (performance/cost/readability/best-practice)
        - Impact level (low/medium/high)
        - Specific code changes
        - Expected benefits
        """
        return await self.llm_client.generate(prompt)
```

#### 5. Validation and Testing Service
**Purpose**: Validate migration accuracy and detect data anomalies

**API Endpoints**:
```python
POST   /api/v1/projects/{id}/validation/start     # Start validation
GET    /api/v1/projects/{id}/validation/status    # Get validation status
GET    /api/v1/projects/{id}/validation/report    # Get validation report
POST   /api/v1/projects/{id}/validation/test      # Run test cases
GET    /api/v1/projects/{id}/validation/anomalies # Get detected anomalies
POST   /api/v1/projects/{id}/validation/rules     # Add validation rules
```

**Database Tables**:
```sql
CREATE TABLE validation_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    overall_accuracy DECIMAL(5,2),
    total_records_tested BIGINT,
    passed_validations BIGINT,
    failed_validations BIGINT,
    anomalies_detected INTEGER,
    report_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE data_anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    table_name VARCHAR(255),
    column_name VARCHAR(255),
    anomaly_type VARCHAR(100), -- 'missing_values', 'data_type_mismatch', 'constraint_violation', etc.
    severity VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
    description TEXT,
    sample_data JSONB,
    ai_detected BOOLEAN DEFAULT false,
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE validation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    rule_name VARCHAR(255) NOT NULL,
    rule_type VARCHAR(100), -- 'data_quality', 'referential_integrity', 'business_logic'
    rule_expression TEXT NOT NULL,
    expected_result TEXT,
    severity VARCHAR(20) DEFAULT 'medium',
    ai_generated BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    test_type VARCHAR(100),
    source_query TEXT,
    target_query TEXT,
    expected_result JSONB,
    actual_result JSONB,
    status VARCHAR(50), -- 'pending', 'passed', 'failed'
    ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    executed_at TIMESTAMP
);
```

**LLM Integration**:
```python
class ValidationServiceLLM:
    async def analyze_data_quality(self, data_sample: Dict) -> DataQualityReport:
        prompt = f"""
        Analyze this data sample for quality issues:
        {data_sample}
        
        Check for:
        1. Missing or null values
        2. Data type inconsistencies
        3. Format violations
        4. Outliers and anomalies
        5. Referential integrity issues
        6. Business rule violations
        
        Provide:
        - Issue severity (low/medium/high/critical)
        - Affected records count
        - Suggested remediation
        - Impact on migration
        """
        return await self.llm_client.generate(prompt)
    
    async def generate_validation_rules(self, schema: Schema, mappings: List[FieldMapping]) -> List[ValidationRule]:
        prompt = f"""
        Generate validation rules for this migration:
        Schema: {schema}
        Mappings: {mappings}
        
        Create rules for:
        1. Data completeness checks
        2. Data type validation
        3. Range and constraint validation
        4. Referential integrity
        5. Business logic validation
        6. Transformation accuracy
        
        Each rule should include:
        - SQL expression
        - Expected result
        - Severity level
        - Description
        """
        return await self.llm_client.generate(prompt)
```

#### 6. Authentication and User Management Service
**Purpose**: Handle user authentication, authorization, and profile management

**API Endpoints**:
```python
POST   /api/v1/auth/register          # User registration
POST   /api/v1/auth/login             # User login
POST   /api/v1/auth/logout            # User logout
POST   /api/v1/auth/refresh           # Refresh token
GET    /api/v1/auth/profile           # Get user profile
PUT    /api/v1/auth/profile           # Update user profile
POST   /api/v1/auth/google            # Google OAuth login
POST   /api/v1/auth/forgot-password   # Password reset
```

## Frontend Integration Plan

### Files That Need Updates

#### 1. Data Layer (Replace Mock Data with API Calls)
```typescript
// src/services/api.ts - New API service layer
class ApiService {
  private baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
  
  // Project Management
  async getProjects(): Promise<Project[]>
  async createProject(project: ProjectCreate): Promise<Project>
  async updateProject(id: string, updates: Partial<Project>): Promise<Project>
  
  // Schema Discovery
  async uploadSchemaFiles(projectId: string, files: File[]): Promise<SchemaFile[]>
  async startDiscovery(projectId: string): Promise<void>
  async getLineageGraph(projectId: string): Promise<LineageGraph>
  
  // Field Mapping
  async generateAIMappings(projectId: string): Promise<FieldMapping[]>
  async approveMappings(projectId: string, mappingIds: string[]): Promise<void>
  async rejectMappings(projectId: string, mappingIds: string[]): Promise<void>
  
  // Code Generation
  async generateCode(projectId: string, platform: CodePlatform): Promise<GeneratedCode>
  async optimizeCode(projectId: string, codeId: string): Promise<CodeOptimization[]>
  
  // Validation
  async startValidation(projectId: string): Promise<void>
  async getValidationReport(projectId: string): Promise<ValidationReport>
}
```

#### 2. Store Updates (Replace Mock Actions)
**File**: `src/store/migrationStore.ts`
- Replace all mock data imports with API service calls
- Update all actions to use real API endpoints
- Add proper error handling and loading states
- Implement optimistic updates where appropriate

#### 3. Component Updates (Connect to Real APIs)
**Files to Update**:
- `src/pages/Projects.tsx` - Connect to projects API
- `src/pages/Discovery.tsx` - Connect to discovery API  
- `src/pages/Mapping.tsx` - Connect to mapping API
- `src/pages/CodeGeneration.tsx` - Connect to codegen API
- `src/pages/Validation.tsx` - Connect to validation API
- `src/pages/SchemaUpload.tsx` - Connect to file upload API

#### 4. Remove Mock Data Files
**Files to Remove/Replace**:
- `src/data/mockProjects.ts` → Replace with API calls
- `src/data/mockLineageData.ts` → Replace with API calls
- `src/data/mockMappingData.ts` → Replace with API calls
- `src/data/mockCodeGeneration.ts` → Replace with API calls

## Implementation Phases

### Phase 1: Core Backend Infrastructure (Week 1-2)
**Deliverables**:
- FastAPI application setup with PostgreSQL
- Docker containerization
- Basic authentication with JWT
- User management endpoints
- Project CRUD operations
- Database migrations

**Files to Create**:
```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── Dockerfile             # Container configuration
├── docker-compose.yml     # Multi-container setup
├── alembic.ini           # Database migration config
├── .env.example          # Environment variables template
├── config/
│   ├── __init__.py
│   ├── database.py       # Database connection
│   ├── settings.py       # Application settings
│   └── security.py       # JWT and auth config
├── models/
│   ├── __init__.py
│   ├── user.py          # User SQLAlchemy models
│   ├── project.py       # Project SQLAlchemy models
│   └── base.py          # Base model class
├── schemas/
│   ├── __init__.py
│   ├── user.py          # User Pydantic schemas
│   ├── project.py       # Project Pydantic schemas
│   └── auth.py          # Authentication schemas
├── api/
│   ├── __init__.py
│   ├── deps.py          # Dependencies (auth, db)
│   └── routes/
│       ├── __init__.py
│       ├── auth.py      # Authentication endpoints
│       └── projects.py  # Project management endpoints
├── services/
│   ├── __init__.py
│   ├── auth_service.py  # Authentication business logic
│   └── project_service.py # Project business logic
└── migrations/          # Alembic database migrations
    └── versions/
```

### Phase 2: Schema Discovery with LLM (Week 3-4)
**Deliverables**:
- File upload and storage system
- Schema parsing and analysis
- LLM integration for intelligent discovery
- Lineage graph generation
- Table and column relationship detection

**New Files**:
```
backend/
├── services/
│   ├── discovery_service.py    # Schema discovery logic
│   ├── file_service.py         # File upload/storage
│   └── llm_service.py          # LLM integration base
├── llm/
│   ├── __init__.py
│   ├── openai_client.py        # OpenAI integration
│   ├── claude_client.py        # Anthropic Claude integration
│   └── prompts/
│       ├── schema_analysis.py   # Schema analysis prompts
│       └── relationship_detection.py # Relationship prompts
├── parsers/
│   ├── __init__.py
│   ├── ddl_parser.py           # DDL file parser
│   ├── json_parser.py          # JSON schema parser
│   └── csv_parser.py           # CSV structure parser
└── api/routes/
    ├── discovery.py            # Discovery endpoints
    └── files.py                # File management endpoints
```

### Phase 3: AI-Powered Field Mapping (Week 5-6)
**Deliverables**:
- AI-powered field mapping suggestions
- Confidence scoring algorithms
- Transformation rule generation
- Mapping approval/rejection workflow
- Custom mapping support

**New Files**:
```
backend/
├── services/
│   ├── mapping_service.py      # Field mapping logic
│   └── transformation_service.py # Transformation rules
├── llm/prompts/
│   ├── field_mapping.py        # Field mapping prompts
│   └── transformation_logic.py # Transformation prompts
├── algorithms/
│   ├── __init__.py
│   ├── similarity_matcher.py   # Field similarity algorithms
│   └── confidence_scorer.py    # Confidence calculation
└── api/routes/
    └── mapping.py              # Mapping endpoints
```

### Phase 4: Code Generation with LLM (Week 7-8)
**Deliverables**:
- Multi-platform code generation (BigQuery, Databricks, Python Beam, dbt)
- AI-powered code optimization
- Syntax validation
- Performance optimization suggestions
- Code export functionality

**New Files**:
```
backend/
├── services/
│   ├── codegen_service.py      # Code generation logic
│   └── optimization_service.py # Code optimization
├── generators/
│   ├── __init__.py
│   ├── bigquery_generator.py   # BigQuery SQL generator
│   ├── databricks_generator.py # Databricks SQL generator
│   ├── beam_generator.py       # Python Beam generator
│   └── dbt_generator.py        # dbt models generator
├── llm/prompts/
│   ├── code_generation.py      # Code generation prompts
│   └── code_optimization.py    # Optimization prompts
└── api/routes/
    └── codegen.py              # Code generation endpoints
```

### Phase 5: Validation and Testing (Week 9-10)
**Deliverables**:
- Data validation framework
- Anomaly detection with LLM
- Test case generation
- Validation reporting
- Quality metrics dashboard

**New Files**:
```
backend/
├── services/
│   ├── validation_service.py   # Validation logic
│   ├── anomaly_service.py      # Anomaly detection
│   └── testing_service.py      # Test case management
├── validators/
│   ├── __init__.py
│   ├── data_quality.py         # Data quality validators
│   ├── referential_integrity.py # RI validators
│   └── business_rules.py       # Business rule validators
├── llm/prompts/
│   ├── data_quality.py         # Data quality prompts
│   └── anomaly_detection.py    # Anomaly detection prompts
└── api/routes/
    └── validation.py           # Validation endpoints
```

### Phase 6: Frontend Integration (Week 11-12)
**Deliverables**:
- Complete frontend-backend integration
- Remove all mock data
- Implement real-time updates
- Error handling and loading states
- Performance optimization

**Frontend Updates**:
```
src/
├── services/
│   ├── api.ts              # API service layer
│   ├── websocket.ts        # Real-time updates
│   └── auth.ts             # Authentication service
├── hooks/
│   ├── useApi.ts           # API hooks
│   ├── useWebSocket.ts     # WebSocket hooks
│   └── useAuth.ts          # Authentication hooks
├── store/
│   └── migrationStore.ts   # Updated with API integration
└── utils/
    ├── errorHandler.ts     # Error handling utilities
    └── apiClient.ts        # HTTP client configuration
```

## Deployment Strategy

### Development Environment
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/migration_db
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./backend:/app
    depends_on:
      - db
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000/api/v1
    volumes:
      - ./frontend:/app

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=migration_db
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Production Environment
- Kubernetes deployment with Helm charts
- PostgreSQL with read replicas
- Redis cluster for caching
- Load balancer with SSL termination
- Monitoring with Prometheus/Grafana
- Logging with ELK stack
- CI/CD with GitHub Actions

## Security Considerations

### Authentication & Authorization
- JWT tokens with refresh mechanism
- OAuth2 integration (Google, Microsoft)
- Role-based access control (RBAC)
- API rate limiting
- CORS configuration

### Data Protection
- Encryption at rest and in transit
- Secure file upload with virus scanning
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### LLM Security
- API key management with rotation
- Prompt injection prevention
- Content filtering
- Usage monitoring and limits
- Data privacy compliance

## Performance Optimization

### Backend Optimization
- Database indexing strategy
- Query optimization
- Connection pooling
- Caching with Redis
- Async processing with Celery
- Backgroun
