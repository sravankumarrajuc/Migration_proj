import { Building, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMigrationStore } from '@/store/migrationStore';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const { currentProject } = useMigrationStore();

  return (
    <header className="h-16 border-b bg-card shadow-card">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/projects')}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-hero">
              <Building className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              AccelMigrate
            </span>
          </div>
          
          {currentProject && (
            <>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Project:</span>
                <span className="font-medium text-foreground">{currentProject.name}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-accent flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden sm:inline-block">Alex Chen</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Data Engineer</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}