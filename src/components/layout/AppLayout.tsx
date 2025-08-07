import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { StepIndicator } from './StepIndicator';
import { useMigrationStore } from '@/store/migrationStore';

export function AppLayout() {
  const location = useLocation();
  const { currentProject, currentPhase } = useMigrationStore();
  const showStepIndicator = currentProject && location.pathname !== '/projects' && location.pathname !== '/code-generation';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {showStepIndicator && (
        <StepIndicator
          currentPhase={currentPhase}
          completedPhases={currentProject?.progress.completedPhases || []}
        />
      )}
      <main>
        <Outlet />
      </main>
    </div>
  );
}