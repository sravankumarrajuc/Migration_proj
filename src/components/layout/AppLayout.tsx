import { Outlet, useLocation, Link } from 'react-router-dom';
import { Header } from './Header';
import { StepIndicator } from './StepIndicator';
import { useMigrationStore } from '@/store/migrationStore';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutGrid,
  History,
  Settings,
  HelpCircle,
  User,
} from 'lucide-react'; // Importing icons

export function AppLayout() {
  const location = useLocation();
  const { currentProject, currentPhase, userProfile } = useMigrationStore();
  const showStepIndicator =
    currentProject &&
    location.pathname !== '/projects' &&
    !location.pathname.startsWith('/code-generation') &&
    location.pathname !== '/';

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader>
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img src="/factspan_bp.png" alt="FactiMigrate Logo" className="h-6 w-6" />
            <span>FactiMigrate</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/schema-analyzer')}
              >
                <Link to="/schema-analyzer">
                  <LayoutGrid />
                  <span>SCHEMA ANALYZER</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/report-code-migration')}
              >
                <Link to="/report-code-migration">
                  <LayoutGrid />
                  <span>REPORT CODE MIGRATION</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/gen-ai-studio')}
              >
                <Link to="/gen-ai-studio">
                  <LayoutGrid />
                  <span>GEN-AI STUDIO</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/factillm-copilot')}
              >
                <Link to="/factillm-copilot">
                  <LayoutGrid />
                  <span>FACTILLM CO-PILOT</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/factillm-evaluate')}
              >
                <Link to="/factillm-evaluate">
                  <LayoutGrid />
                  <span>FACTILLM EVALUATE</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/history')}
              >
                <Link to="/history">
                  <History />
                  <span>HISTORY</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/global-setting')}
              >
                <Link to="/global-setting">
                  <Settings />
                  <span>GLOBAL SETTING</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/faq')}
              >
                <Link to="/faq">
                  <HelpCircle />
                  <span>FAQ</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="flex justify-center py-4">
          {userProfile.authenticated ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => console.log('User profile clicked - implement sign out or profile management')}>
              <img
                src={userProfile.picture || '/public/placeholder.svg'}
                alt={userProfile.name || 'User'}
                className="h-8 w-8 rounded-full"
              />
              <span className="text-sm font-medium">{userProfile.name || 'Guest'}</span>
            </div>
          ) : (
            <div className="cursor-pointer" onClick={() => console.log('Sign in clicked - trigger Google login')}>
              <User className="h-6 w-6" />
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col flex-1">
        {location.pathname !== '/' && <Header />}
        {showStepIndicator && (
          <StepIndicator
            currentPhase={currentPhase}
            completedPhases={currentProject?.progress.completedPhases || []}
          />
        )}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}