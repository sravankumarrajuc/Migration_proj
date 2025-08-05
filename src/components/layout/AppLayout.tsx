import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { StepIndicator } from './StepIndicator';
import { useMigrationStore } from '@/store/migrationStore';

export function AppLayout() {
  const { currentProject, currentPhase } = useMigrationStore();
  const showStepIndicator = currentProject && currentPhase !== 'upload';

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