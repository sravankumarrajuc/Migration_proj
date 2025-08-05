import { Project, ProjectTemplate } from '@/types/migration';

// Helper function to get completed projects from localStorage
const getCompletedProjects = (): Project[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('completed-projects') || '[]');
  } catch {
    return [];
  }
};

// Helper function to merge completed projects with mock data
const getMergedProjects = (): Project[] => {
  const completedProjects = getCompletedProjects();
  const baseProjects = baseMockProjects.map(project => {
    const completedProject = completedProjects.find(cp => cp.id === project.id);
    return completedProject || project;
  });
  
  // Add any new completed projects that aren't in the base list
  const newCompletedProjects = completedProjects.filter(
    cp => !baseMockProjects.find(bp => bp.id === cp.id)
  );
  
  return [...baseProjects, ...newCompletedProjects];
};

const baseMockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Legacy DB2 to BigQuery Migration',
    description: 'Migrating customer and order data from IBM DB2 to Google BigQuery',
    sourceDialect: 'db2',
    targetDialect: 'bigquery',
    status: 'in-progress',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    progress: {
      currentPhase: 'mapping',
      completedPhases: ['upload', 'discovery'],
      schemasUploaded: true,
      mappingsComplete: false,
      codeGenerated: false,
      validationComplete: false,
    },
  },
  {
    id: 'proj-2',
    name: 'COBOL Copybooks to Snowflake',
    description: 'Modernizing financial data structures from COBOL to Snowflake',
    sourceDialect: 'cobol',
    targetDialect: 'snowflake',
    status: 'completed',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-25T16:45:00Z',
    progress: {
      currentPhase: 'validation',
      completedPhases: ['upload', 'discovery', 'mapping', 'codegen', 'validation'],
      schemasUploaded: true,
      mappingsComplete: true,
      codeGenerated: true,
      validationComplete: true,
    },
  },
  {
    id: 'proj-3',
    name: 'PostgreSQL to BigQuery Analytics',
    description: 'Moving analytics workload from PostgreSQL to BigQuery',
    sourceDialect: 'postgres',
    targetDialect: 'bigquery',
    status: 'draft',
    createdAt: '2024-01-22T11:15:00Z',
    updatedAt: '2024-01-22T11:15:00Z',
    progress: {
      currentPhase: 'upload',
      completedPhases: [],
      schemasUploaded: false,
      mappingsComplete: false,
      codeGenerated: false,
      validationComplete: false,
    },
  },
];

export const mockProjects: Project[] = getMergedProjects();

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'template-1',
    name: 'DB2 to BigQuery Enterprise',
    description: 'Standard migration pattern for IBM DB2 mainframe data to Google BigQuery',
    sourceDialect: 'db2',
    targetDialect: 'bigquery',
    estimatedDuration: '4-6 weeks',
    complexity: 'intermediate',
    tags: ['mainframe', 'analytics', 'cloud'],
  },
  {
    id: 'template-2',
    name: 'COBOL to Snowflake Financial',
    description: 'Specialized template for financial COBOL copybook migrations to Snowflake',
    sourceDialect: 'cobol',
    targetDialect: 'snowflake',
    estimatedDuration: '6-8 weeks',
    complexity: 'advanced',
    tags: ['financial', 'legacy', 'compliance'],
  },
  {
    id: 'template-3',
    name: 'PostgreSQL to BigQuery Analytics',
    description: 'Quick migration for PostgreSQL databases to BigQuery for analytics',
    sourceDialect: 'postgres',
    targetDialect: 'bigquery',
    estimatedDuration: '2-3 weeks',
    complexity: 'beginner',
    tags: ['analytics', 'modern', 'quick-start'],
  },
  {
    id: 'template-4',
    name: 'Custom JSON to Snowflake',
    description: 'Flexible template for custom JSON schema migrations to Snowflake',
    sourceDialect: 'custom-json',
    targetDialect: 'snowflake',
    estimatedDuration: '3-4 weeks',
    complexity: 'intermediate',
    tags: ['flexible', 'json', 'modern'],
  },
];

export const dialectDisplayNames = {
  'db2': 'IBM DB2',
  'cobol': 'COBOL Copybooks',
  'bigquery': 'Google BigQuery',
  'snowflake': 'Snowflake',
  'postgres': 'PostgreSQL',
  'custom-json': 'Custom JSON Schema',
};

export const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPhaseProgress = (completedPhases: string[]) => {
  const totalPhases = 5;
  return (completedPhases.length / totalPhases) * 100;
};