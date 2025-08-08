import { Building, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMigrationStore } from '@/store/migrationStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStatusColor } from '@/data/mockProjects';
import { Project } from '@/types/migration';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProject } = useMigrationStore();
  
  const showProjectDetails = currentProject && location.pathname !== '/projects';

  return (
    <header className="h-16 border-b bg-card shadow-card">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-hero">
              <Building className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              FactiMigrate
            </span>
          </div>
          
          {showProjectDetails && (
            <>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{currentProject.name}</span>
                <Badge className={getStatusColor(currentProject.status)}>
                  {getStatusIcon(currentProject.status)}
                  <span className="ml-1 capitalize">{currentProject.status}</span>
                </Badge>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Authentication has been moved to SidebarFooter */}
        </div>
      </div>
    </header>
  );
}

const getStatusIcon = (status: Project['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'in-progress':
      return <Clock className="h-4 w-4" />;
    case 'failed':
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};