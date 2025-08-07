import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Project,
  SchemaFile,
  MigrationPhase,
  DiscoveryState,
  LineageGraph,
  MappingState,
  TableMapping,
  FieldMapping,
  CodeGenerationState,
  CodePlatform,
  GeneratedCode,
  UserProfile
} from '@/types/migration';
import {
  customerMappings,
  claimsMappings,
  policiesMappings,
  agentsMappings,
  riskRatingsMappings
} from '@/data/mockMappingData.ts';
import { projectTemplates } from '@/data/mockProjects';

interface MigrationState {
  // Current project context
  currentProject: Project | null;
  currentPhase: MigrationPhase;
  
  // User profile
  userProfile: UserProfile;
  
  // Schema upload state
  sourceFiles: SchemaFile[];
  targetFiles: SchemaFile[];
  uploadProgress: number;
  
  // Discovery state
  discoveryState: DiscoveryState;
  
  // Mapping state
  mappingState: MappingState;
  
  // Code Generation state
  codeGenerationState: CodeGenerationState;
  
  // Actions
  setCurrentProject: (project: Project) => void;
  setCurrentPhase: (phase: MigrationPhase) => void;
  addSourceFile: (file: SchemaFile) => void;
  addTargetFile: (file: SchemaFile) => void;
  updateFileStatus: (fileId: string, status: SchemaFile['status'], preview?: SchemaFile['preview']) => void;
  removeFile: (fileId: string, type: 'source' | 'target') => void;
  clearFiles: () => void;
  setUploadProgress: (progress: number) => void;
  canProceedToNextPhase: () => boolean;
  
  // User profile actions
  setUserProfile: (profile: UserProfile) => void;
  clearUserProfile: () => void;
  
  // Discovery actions
  startDiscovery: () => void;
  updateDiscoveryProgress: (progress: number, step: string) => void;
  setLineageGraph: (graph: LineageGraph) => void;
  completeDiscovery: () => void;
  resetDiscovery: () => void;
  
  // Mapping actions
  startMapping: () => void;
  updateMappingProgress: (progress: number, step: string) => void;
  setSelectedTables: (sourceTableId: string, targetTableId: string) => void;
  setTableMapping: (mapping: TableMapping) => void;
  addFieldMapping: (mapping: FieldMapping) => void;
  updateFieldMapping: (mappingId: string, updates: Partial<FieldMapping>) => void;
  removeFieldMapping: (mappingId: string) => void;
  generateAISuggestions: () => void;
  acceptMapping: (mappingId: string) => void;
  rejectMapping: (mappingId: string) => void;
  bulkAcceptHighConfidence: () => void;
  completeMapping: () => void;
  resetMapping: () => void;
  
  // Code Generation actions
  startCodeGeneration: (step: string) => void;
  setSelectedPlatform: (platform: CodePlatform) => void;
  setGeneratedCode: (platform: CodePlatform, code: GeneratedCode) => void;
  completeCodeGeneration: () => void;
  setOriginalCodeForComparison: (code: string) => void;
  setOptimizedCodeForComparison: (code: string) => void;
  
  // Project completion
  completeProject: () => void;
}

export const useMigrationStore = create<MigrationState>()(
  persist(
    (set, get) => ({
      currentProject: (() => {
        const defaultProjectTemplate = projectTemplates.find(
          (template) => template.name === 'DB2 to BigQuery Enterprise'
        );
        return defaultProjectTemplate
          ? {
              id: `proj-${defaultProjectTemplate.id}`,
              name: defaultProjectTemplate.name,
              description: defaultProjectTemplate.description,
              sourceDialect: defaultProjectTemplate.sourceDialect,
              targetDialect: defaultProjectTemplate.targetDialect,
              status: 'completed', // Assuming it's completed as per the screenshot
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              progress: {
                currentPhase: 'validation',
                completedPhases: ['upload', 'discovery', 'mapping', 'validation'],
                schemasUploaded: true,
                mappingsComplete: true,
                codeGenerated: true,
                validationComplete: true,
              },
            }
          : null;
      })(),
      currentPhase: (() => {
        const defaultProjectTemplate = projectTemplates.find(
          (template) => template.name === 'DB2 to BigQuery Enterprise'
        );
        return defaultProjectTemplate ? 'validation' : 'upload';
      })(),
      userProfile: {
        id: '',
        name: 'Alex Chen',
        email: '',
        authenticated: false
      },
      sourceFiles: [],
      targetFiles: [],
      uploadProgress: 0,
      discoveryState: {
        isProcessing: false,
        progress: 0,
        currentStep: '',
        lineageGraph: null,
        error: null,
        completedAt: null,
      },
    mappingState: {
      isProcessing: false,
      progress: 0,
      currentStep: '',
      selectedSourceTable: null,
      selectedTargetTable: null,
      currentTableMapping: null,
      allMappings: [],
      suggestions: [],
      error: null,
      completedAt: null,
    },

    codeGenerationState: {
      isProcessing: false,
      progress: 0,
      currentStep: '',
      selectedPlatform: 'bigquery',
      generatedCodes: {
        bigquery: null,
        databricks: null,
        'python-beam': null,
        dbt: null,
      },
      optimizations: [],
      previewMode: 'code',
      error: null,
      completedAt: null,
      originalCodeForComparison: '',
      optimizedCodeForComparison: '',
    },

      setCurrentProject: (project) => {
        set((state) => ({
          currentProject: project,
          currentPhase: project ? project.progress.currentPhase : 'upload', // Default to 'upload' if project is null
        }));
      },

      setCurrentPhase: (phase) => {
        const { currentProject, currentPhase } = get();
        
        // Only update if the phase is actually different to prevent infinite loops
        if (currentPhase === phase && currentProject?.progress.currentPhase === phase) {
          return;
        }
        
        if (currentProject) {
          const previousPhase = currentProject.progress.currentPhase;
          const updatedCompletedPhases = [...new Set([...currentProject.progress.completedPhases, previousPhase])];

          let updatedStatus = currentProject.status;
          if (currentProject.status === 'draft' && phase === 'discovery') {
            updatedStatus = 'in-progress';
          }

          set((state) => {
            const updatedProject = {
              ...currentProject,
              status: updatedStatus,
              progress: {
                ...currentProject.progress,
                currentPhase: phase,
                completedPhases: updatedCompletedPhases as MigrationPhase[],
              },
            };

            // Persist the updated project to localStorage
            if (typeof window !== 'undefined') {
              const existingProjects = JSON.parse(localStorage.getItem('completed-projects') || '[]');
              const updatedProjectsList = existingProjects.map((p: any) =>
                p.id === updatedProject.id ? updatedProject : p
              );
              // If the project is new and not in existingProjects, add it
              if (!updatedProjectsList.some((p: any) => p.id === updatedProject.id)) {
                updatedProjectsList.push(updatedProject);
              }
              localStorage.setItem('completed-projects', JSON.stringify(updatedProjectsList));
            }

            return {
              currentPhase: phase,
              currentProject: updatedProject,
            };
          });
        } else {
          set({ currentPhase: phase });
        }
      },

      addSourceFile: (file) => {
        set((state) => ({
          sourceFiles: [...state.sourceFiles, file],
        }));
      },

      addTargetFile: (file) => {
        set((state) => ({
          targetFiles: [...state.targetFiles, file],
        }));
      },

      updateFileStatus: (fileId, status, preview) => {
        set((state) => ({
          sourceFiles: state.sourceFiles.map((file) =>
            file.id === fileId ? { ...file, status, preview } : file
          ),
          targetFiles: state.targetFiles.map((file) =>
            file.id === fileId ? { ...file, status, preview } : file
          ),
        }));
      },

      removeFile: (fileId, type) => {
        set((state) => ({
          [type === 'source' ? 'sourceFiles' : 'targetFiles']: state[
            type === 'source' ? 'sourceFiles' : 'targetFiles'
          ].filter((file) => file.id !== fileId),
        }));
      },

      clearFiles: () => {
        set({ sourceFiles: [], targetFiles: [], uploadProgress: 0 });
      },

      setUploadProgress: (progress) => {
        set({ uploadProgress: progress });
      },

      canProceedToNextPhase: () => {
        const { sourceFiles, targetFiles, currentPhase, discoveryState, mappingState, codeGenerationState } = get();
        
        if (currentPhase === 'upload') {
          return sourceFiles.length > 0 && 
                 targetFiles.length > 0 && 
                 sourceFiles.every(f => f.status === 'completed') && 
                 targetFiles.every(f => f.status === 'completed');
        }
        
        if (currentPhase === 'discovery') {
          return discoveryState.completedAt !== null && discoveryState.lineageGraph !== null;
        }
        
        if (currentPhase === 'mapping') {
          console.log('Checking mapping phase completion:', {
            suggestionsCount: mappingState.suggestions.length,
            processedCount: mappingState.suggestions.filter(s => s.status === 'approved' || s.status === 'rejected').length,
            mappingsCount: mappingState.allMappings.length,
            completedAt: mappingState.completedAt
          });
          
          // Check if AI suggestions have been processed (approved/rejected) or mappings exist
          const hasProcessedSuggestions = mappingState.suggestions.length > 0 && 
            mappingState.suggestions.every(s => s.status === 'approved' || s.status === 'rejected');
          const hasMappings = mappingState.allMappings.length > 0;
          const canProceed = (hasProcessedSuggestions || hasMappings) || mappingState.completedAt !== null;
          
          console.log('Can proceed to next phase:', canProceed);
          return canProceed;
        }
        
        if (currentPhase === 'validation') {
          const { currentProject } = get();
          return currentProject?.progress?.validationComplete === true;
        }
        
        return false;
      },

      // Discovery actions
      startDiscovery: () => {
        set((state) => ({
          discoveryState: {
            ...state.discoveryState,
            isProcessing: true,
            progress: 0,
            currentStep: 'Analyzing schema files...',
            error: null,
          },
        }));
      },

      updateDiscoveryProgress: (progress, step) => {
        set((state) => ({
          discoveryState: {
            ...state.discoveryState,
            progress,
            currentStep: step,
          },
        }));
      },

      setLineageGraph: (graph) => {
        set((state) => ({
          discoveryState: {
            ...state.discoveryState,
            lineageGraph: graph,
          },
        }));
      },

      completeDiscovery: () => {
        set((state) => {
          const updatedCompletedPhases = state.currentProject
            ? [...new Set([...state.currentProject.progress.completedPhases, 'discovery'])]
            : ['discovery'];
          return {
            discoveryState: {
              ...state.discoveryState,
              isProcessing: false,
              progress: 100,
              currentStep: 'Discovery complete',
              completedAt: new Date().toISOString(),
            },
            currentProject: state.currentProject
              ? {
                  ...state.currentProject,
                  progress: {
                    ...state.currentProject.progress,
                    completedPhases: updatedCompletedPhases as MigrationPhase[],
                  },
                }
              : state.currentProject,
          };
        });
      },

      resetDiscovery: () => {
        set((state) => ({
          discoveryState: {
            isProcessing: false,
            progress: 0,
            currentStep: '',
            lineageGraph: null,
            error: null,
            completedAt: null,
          },
        }));
      },

      // Mapping actions
      startMapping: () => {
        set((state) => ({
          mappingState: {
            ...state.mappingState,
            isProcessing: true,
            progress: 0,
            currentStep: 'Initializing mapping analysis...',
            error: null,
          },
        }));
      },

      updateMappingProgress: (progress, step) => {
        set((state) => ({
          mappingState: {
            ...state.mappingState,
            progress,
            currentStep: step,
          },
        }));
      },

      setSelectedTables: (sourceTableId, targetTableId) => {
        set((state) => {
          const existingMapping = state.mappingState.allMappings.find(
            m => m.sourceTableId === sourceTableId && m.targetTableId === targetTableId
          );
          
          return {
            mappingState: {
              ...state.mappingState,
              selectedSourceTable: sourceTableId,
              selectedTargetTable: targetTableId,
              currentTableMapping: existingMapping || {
                sourceTableId,
                targetTableId,
                fieldMappings: [],
                completionPercentage: 0,
                requiredFieldsCovered: 0,
                totalRequiredFields: 0,
              },
            },
          };
        });
      },

      setTableMapping: (mapping) => {
        set((state) => ({
          mappingState: {
            ...state.mappingState,
            currentTableMapping: mapping,
            allMappings: state.mappingState.allMappings.some(
              m => m.sourceTableId === mapping.sourceTableId && m.targetTableId === mapping.targetTableId
            )
              ? state.mappingState.allMappings.map(m =>
                  m.sourceTableId === mapping.sourceTableId && m.targetTableId === mapping.targetTableId
                    ? mapping
                    : m
                )
              : [...state.mappingState.allMappings, mapping],
          },
        }));
      },

      addFieldMapping: (mapping) => {
        set((state) => {
          if (!state.mappingState.currentTableMapping) return state;
          
          const updatedMapping = {
            ...state.mappingState.currentTableMapping,
            fieldMappings: [...state.mappingState.currentTableMapping.fieldMappings, mapping],
          };
          
          return {
            mappingState: {
              ...state.mappingState,
              currentTableMapping: updatedMapping,
              allMappings: state.mappingState.allMappings.map(m =>
                m.sourceTableId === updatedMapping.sourceTableId && m.targetTableId === updatedMapping.targetTableId
                  ? updatedMapping
                  : m
              ),
            },
          };
        });
      },

      updateFieldMapping: (mappingId, updates) => {
        set((state) => {
          console.log('Updating field mapping:', mappingId, updates);
          
          const updatedSuggestions = state.mappingState.suggestions.map(s =>
            s.id === mappingId ? { ...s, ...updates } : s
          );
          
          console.log('Updated suggestions status:', updatedSuggestions.map(s => ({ id: s.id, status: s.status })));
          
          if (!state.mappingState.currentTableMapping) {
            return {
              mappingState: {
                ...state.mappingState,
                suggestions: updatedSuggestions,
              },
            };
          }
          
          const updatedMapping = {
            ...state.mappingState.currentTableMapping,
            fieldMappings: state.mappingState.currentTableMapping.fieldMappings.map(fm =>
              fm.id === mappingId ? { ...fm, ...updates } : fm
            ),
          };
          
          return {
            mappingState: {
              ...state.mappingState,
              currentTableMapping: updatedMapping,
              suggestions: updatedSuggestions,
              allMappings: state.mappingState.allMappings.map(m =>
                m.sourceTableId === updatedMapping.sourceTableId && m.targetTableId === updatedMapping.targetTableId
                  ? updatedMapping
                  : m
              ),
            },
          };
        });
      },

      removeFieldMapping: (mappingId) => {
        set((state) => {
          if (!state.mappingState.currentTableMapping) return state;
          
          const updatedMapping = {
            ...state.mappingState.currentTableMapping,
            fieldMappings: state.mappingState.currentTableMapping.fieldMappings.filter(fm => fm.id !== mappingId),
          };
          
          return {
            mappingState: {
              ...state.mappingState,
              currentTableMapping: updatedMapping,
              allMappings: state.mappingState.allMappings.map(m =>
                m.sourceTableId === updatedMapping.sourceTableId && m.targetTableId === updatedMapping.targetTableId
                  ? updatedMapping
                  : m
              ),
            },
          };
        });
      },

      generateAISuggestions: () => {
        const { mappingState } = get();
        // Simulate AI suggestion generation with mock data
        // Combine all mock mappings to ensure a variety of confidence levels for demonstration
        const suggestions = [
          ...customerMappings,
          ...claimsMappings,
          ...policiesMappings,
          ...agentsMappings,
          ...riskRatingsMappings,
        ];
          
        set((state) => {
            const currentTableMapping = state.mappingState.currentTableMapping;
            const updatedFieldMappings = currentTableMapping
              ? [...currentTableMapping.fieldMappings, ...suggestions.filter(s =>
                  !currentTableMapping.fieldMappings.some(fm => fm.id === s.id)
                )]
              : suggestions; // If no currentTableMapping, just use suggestions
            
            return {
              mappingState: {
                ...state.mappingState,
                suggestions,
                currentTableMapping: currentTableMapping ? {
                  ...currentTableMapping,
                  fieldMappings: updatedFieldMappings,
                } : null, // If no currentTableMapping, keep it null
              },
            };
        });
      },

      acceptMapping: (mappingId) => {
        get().updateFieldMapping(mappingId, { status: 'approved', approvedAt: new Date().toISOString() });
      },

      rejectMapping: (mappingId) => {
        get().updateFieldMapping(mappingId, { status: 'rejected' });
      },

      bulkAcceptHighConfidence: () => {
        const { mappingState } = get();
        const highConfidenceMappings = mappingState.suggestions.filter(s => s.confidence >= 90);
        
        highConfidenceMappings.forEach(mapping => {
          get().updateFieldMapping(mapping.id, { status: 'approved', approvedAt: new Date().toISOString() });
        });
      },

      completeMapping: () => {
        set((state) => {
          console.log('Completing mapping phase');
          const updatedCompletedPhases = state.currentProject
            ? [...new Set([...state.currentProject.progress.completedPhases, 'mapping'])]
            : ['mapping'];
          return {
            mappingState: {
              ...state.mappingState,
              isProcessing: false,
              progress: 100,
              currentStep: 'Mapping complete',
              completedAt: new Date().toISOString(),
            },
            currentProject: state.currentProject
              ? {
                  ...state.currentProject,
                  progress: {
                    ...state.currentProject.progress,
                    completedPhases: updatedCompletedPhases as MigrationPhase[],
                  },
                }
              : state.currentProject,
          };
        });
      },

      resetMapping: () => {
        set((state) => ({
          mappingState: {
            isProcessing: false,
            progress: 0,
            currentStep: '',
            selectedSourceTable: null,
            selectedTargetTable: null,
            currentTableMapping: null,
            allMappings: [],
            suggestions: [],
            error: null,
            completedAt: null,
          },
        }));
      },

      // Code Generation actions
      startCodeGeneration: (step) => set((state) => ({
        codeGenerationState: {
          ...state.codeGenerationState,
          isProcessing: true,
          currentStep: step,
          progress: Math.min(state.codeGenerationState.progress + 20, 100),
        },
      })),

      setSelectedPlatform: (platform) => set((state) => ({
        codeGenerationState: {
          ...state.codeGenerationState,
          selectedPlatform: platform,
        },
      })),

      setGeneratedCode: (platform, code) => set((state) => ({
        codeGenerationState: {
          ...state.codeGenerationState,
          generatedCodes: {
            ...state.codeGenerationState.generatedCodes,
            [platform]: code,
          },
          isProcessing: false,
          progress: 100,
        },
      })),

      completeCodeGeneration: () => set((state) => ({
        codeGenerationState: {
          ...state.codeGenerationState,
          isProcessing: false,
          completedAt: new Date().toISOString(),
        },
      })),

      setOriginalCodeForComparison: (code) => {
        console.log('Setting originalCodeForComparison:', code);
        set((state) => ({
          codeGenerationState: {
            ...state.codeGenerationState,
            originalCodeForComparison: code,
          },
        }));
      },

      setOptimizedCodeForComparison: (code) => {
        console.log('Setting optimizedCodeForComparison:', code);
        set((state) => ({
          codeGenerationState: {
            ...state.codeGenerationState,
            optimizedCodeForComparison: code,
          },
        }));
      },

      // Project completion
      completeProject: () => {
        const { currentProject } = get();
        if (!currentProject) return;
        
        const completedProject = {
          ...currentProject,
          status: 'completed' as const,
          updatedAt: new Date().toISOString(),
          progress: {
            ...currentProject.progress,
            completedPhases: ['upload' as const, 'discovery' as const, 'mapping' as const, 'validation' as const],
            validationComplete: true,
            schemasUploaded: true, // Assuming upload is completed when project is completed
            mappingsComplete: true, // Assuming mapping is completed when project is completed
          }
        };
        
        // Update mockProjects data to persist the completion
        if (typeof window !== 'undefined') {
          const existingProjects = JSON.parse(localStorage.getItem('completed-projects') || '[]');
          const updatedProjects = existingProjects.map((p: any) =>
            p.id === completedProject.id ? completedProject : p
          );
          localStorage.setItem('completed-projects', JSON.stringify(updatedProjects));
        }
        
        set({ currentProject: completedProject });
      },
      
      // User profile actions
      setUserProfile: (profile) => {
        set({ userProfile: profile });
      },
      
      clearUserProfile: () => {
        set({
          userProfile: {
            id: '',
            name: 'Alex Chen',
            email: '',
            authenticated: false
          }
        });
      },
    }),
    {
      name: 'migration-store',
      partialize: (state) => ({
        currentProject: state.currentProject || undefined, // Don't persist if null
        currentPhase: state.currentPhase,
        userProfile: state.userProfile, // Persist user profile
      }),
      onRehydrateStorage: (state) => {
        // This function runs before rehydration
        // If currentProject is null after rehydration, set the default
        if (state && state.currentProject === null) {
          const defaultProjectTemplate = projectTemplates.find(
            (template) => template.name === 'DB2 to BigQuery Enterprise'
          );
          if (defaultProjectTemplate) {
            state.currentProject = {
              id: `proj-${defaultProjectTemplate.id}`,
              name: defaultProjectTemplate.name,
              description: defaultProjectTemplate.description,
              sourceDialect: defaultProjectTemplate.sourceDialect,
              targetDialect: defaultProjectTemplate.targetDialect,
              status: 'completed',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              progress: {
                currentPhase: 'validation',
                completedPhases: ['upload', 'discovery', 'mapping', 'validation'],
                schemasUploaded: true,
                mappingsComplete: true,
                validationComplete: true,
              },
            };
            state.currentPhase = 'validation';
          }
        }
      },
    }
  )
);