import { Project, ProjectTemplate } from '@/types/migration';

// Helper function to get completed projects from localStorage
export const getCompletedProjects = (): Project[] => {
  if (typeof window === 'undefined') return [];
  try {
    const storedProjects = localStorage.getItem('completed-projects');
    if (storedProjects) {
      return JSON.parse(storedProjects);
    }
    // Fallback to mock completed projects if localStorage is empty
    return baseMockProjects.filter(p => p.status === 'completed');
  } catch (error) {
    console.error("Failed to parse completed projects from localStorage:", error);
    // Fallback to mock completed projects on error
    return baseMockProjects.filter(p => p.status === 'completed');
  }
};

// Helper function to merge completed projects with mock data
export const getMergedProjects = (): Project[] => {
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
      validationComplete: false,
    },
    sourceFiles: [],
    targetFiles: [],
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
      completedPhases: ['upload', 'discovery', 'mapping', 'validation'],
      schemasUploaded: true,
      mappingsComplete: true,
      validationComplete: true,
    },
    sourceFiles: [],
    targetFiles: [],
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
      validationComplete: false,
    },
    sourceFiles: [],
    targetFiles: [],
  },
];


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
      return 'bg-green-500 text-white';
    case 'in-progress':
      return 'bg-orange-500 text-white';
    case 'failed':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

// Helper function to cap percentage values at 100%
export const capPercentage = (value: number): number => {
  return Math.min(Math.max(value, 0), 100);
};

export const getPhaseProgress = (completedPhases: string[]) => {
  const totalPhases = 4; // upload, discovery, mapping, validation
  const progress = (completedPhases.length / totalPhases) * 100;
  // Ensure progress never exceeds 100%
  return capPercentage(progress);
};
