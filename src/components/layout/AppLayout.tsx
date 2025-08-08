import { Outlet, useLocation, Link } from 'react-router-dom';
import { Header } from './Header';
import { StepIndicator } from './StepIndicator';
import { useMigrationStore } from '@/store/migrationStore';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
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
  ChevronDown,
  LogOut,
} from 'lucide-react'; // Importing icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function AppLayout() {
  const location = useLocation();
  const { currentProject, currentPhase, userProfile, clearUserProfile, setUserProfile } = useMigrationStore();
  
  const handleSignOut = () => {
    googleLogout();
    clearUserProfile();
  };

  const handleLoginSuccess = async (response: any) => {
    try {
      if (response.access_token) {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        });
        const userInfo = await userInfoResponse.json();
        
        setUserProfile({
          id: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          authenticated: true,
        });
      } else if (response.credential) {
        const payload = parseJwt(response.credential);
        setUserProfile({
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
          authenticated: true,
        });
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error during login success handling:', error);
    }
  };

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: () => console.error('Google login failed'),
  });

  const showStepIndicator =
    currentProject &&
    location.pathname !== '/projects' &&
    !location.pathname.startsWith('/code-generation') &&
    location.pathname !== '/';

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img src="/factspan_bp.png" alt="FactiMigrate Logo" className="h-6 w-6" />
            <span className='bg-gradient-hero bg-clip-text text-transparent text-lg'>FactiMigrate</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/projects')}
                tooltip="SCHEMA ANALYZER"
              >
                <Link to="/projects">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M27 6V11H17V6H27ZM27 4H17C16.4696 4 15.9609 4.21071 15.5858 4.58579C15.2107 4.96086 15 5.46957 15 6V11C15 11.5304 15.2107 12.0391 15.5858 12.4142C15.9609 12.7893 16.4696 13 17 13H27C27.5304 13 28.0391 12.7893 28.4142 12.4142C28.7893 12.0391 29 11.5304 29 11V6C29 5.46957 28.7893 4.96086 28.4142 4.58579C28.0391 4.21071 27.5304 4 27 4Z" fill="#818199"/>
                      <path d="M11 6V11H6V6H11ZM11 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V11C4 11.5304 4.21071 12.0391 4.58579 12.4142C4.96086 12.7893 5.46957 13 6 13H11C11.5304 13 12.0391 12.7893 12.4142 12.4142C12.7893 12.0391 13 11.5304 13 11V6C13 5.46957 12.7893 4.96086 12.4142 4.58579C12.0391 4.21071 11.5304 4 11 4Z" fill="#818199"/>
                      <path d="M16 17V25H6V17H16ZM16 15H6C5.46957 15 4.96086 15.2107 4.58579 15.5858C4.21071 15.9609 4 16.4696 4 17V25C4 25.5304 4.21071 26.0391 4.58579 26.4142C4.96086 26.7893 5.46957 27 6 27H16C16.5304 27 17.0391 26.7893 17.4142 26.4142C17.7893 26.0391 18 25.5304 18 25V17C18 16.4696 17.7893 15.9609 17.4142 15.5858C17.0391 15.2107 16.5304 15 16 15Z" fill="#818199"/>
                      <path d="M27 17V22H22V17H27ZM27 15H22C21.4696 15 20.9609 15.2107 20.5858 15.5858C20.2107 15.9609 20 16.4696 20 17V22C20 22.5304 20.2107 23.0391 20.5858 23.4142C20.9609 23.7893 21.4696 24 22 24H27C27.5304 24 28.0391 23.7893 28.4142 23.4142C28.7893 23.0391 29 22.5304 29 22V17C29 16.4696 28.7893 15.9609 28.4142 15.5858C28.0391 15.2107 27.5304 15 27 15Z" fill="#818199"/>
                    </svg>
                    <span className="bg-gradient-hero bg-clip-text text-transparent">SCHEMA ANALYZER</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/code-generation')}
                tooltip="REPORT CODE MIGRATION"
              >
                <Link to="/code-generation">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M27 6V11H17V6H27ZM27 4H17C16.4696 4 15.9609 4.21071 15.5858 4.58579C15.2107 4.96086 15 5.46957 15 6V11C15 11.5304 15.2107 12.0391 15.5858 12.4142C15.9609 12.7893 16.4696 13 17 13H27C27.5304 13 28.0391 12.7893 28.4142 12.4142C28.7893 12.0391 29 11.5304 29 11V6C29 5.46957 28.7893 4.96086 28.4142 4.58579C28.0391 4.21071 27.5304 4 27 4Z" fill="#818199"/>
                      <path d="M11 6V11H6V6H11ZM11 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V11C4 11.5304 4.21071 12.0391 4.58579 12.4142C4.96086 12.7893 5.46957 13 6 13H11C11.5304 13 12.0391 12.7893 12.4142 12.4142C12.7893 12.0391 13 11.5304 13 11V6C13 5.46957 12.7893 4.96086 12.4142 4.58579C12.0391 4.21071 11.5304 4 11 4Z" fill="#818199"/>
                      <path d="M16 17V25H6V17H16ZM16 15H6C5.46957 15 4.96086 15.2107 4.58579 15.5858C4.21071 15.9609 4 16.4696 4 17V25C4 25.5304 4.21071 26.0391 4.58579 26.4142C4.96086 26.7893 5.46957 27 6 27H16C16.5304 27 17.0391 26.7893 17.4142 26.4142C17.7893 26.0391 18 25.5304 18 25V17C18 16.4696 17.7893 15.9609 17.4142 15.5858C17.0391 15.2107 16.5304 15 16 15Z" fill="#818199"/>
                      <path d="M27 17V22H22V17H27ZM27 15H22C21.4696 15 20.9609 15.2107 20.5858 15.5858C20.2107 15.9609 20 16.4696 20 17V22C20 22.5304 20.2107 23.0391 20.5858 23.4142C20.9609 23.7893 21.4696 24 22 24H27C27.5304 24 28.0391 23.7893 28.4142 23.4142C28.7893 23.0391 29 22.5304 29 22V17C29 16.4696 28.7893 15.9609 28.4142 15.5858C28.0391 15.2107 27.5304 15 27 15Z" fill="#818199"/>
                    </svg>
                    <span className="bg-gradient-hero bg-clip-text text-transparent">REPORT CODE MIGRATION</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/gen-ai-studio')}
                tooltip="GEN-AI STUDIO"
              >
                <Link to="/gen-ai-studio" aria-disabled="true" tabIndex={-1}>
                  <div className="flex items-center gap-2 pointer-events-none opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M27 6V11H17V6H27ZM27 4H17C16.4696 4 15.9609 4.21071 15.5858 4.58579C15.2107 4.96086 15 5.46957 15 6V11C15 11.5304 15.2107 12.0391 15.5858 12.4142C15.9609 12.7893 16.4696 13 17 13H27C27.5304 13 28.0391 12.7893 28.4142 12.4142C28.7893 12.0391 29 11.5304 29 11V6C29 5.46957 28.7893 4.96086 28.4142 4.58579C28.0391 4.21071 27.5304 4 27 4Z" fill="#818199"/>
                      <path d="M11 6V11H6V6H11ZM11 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V11C4 11.5304 4.21071 12.0391 4.58579 12.4142C4.96086 12.7893 5.46957 13 6 13H11C11.5304 13 12.0391 12.7893 12.4142 12.4142C12.7893 12.0391 13 11.5304 13 11V6C13 5.46957 12.7893 4.96086 12.4142 4.58579C12.0391 4.21071 11.5304 4 11 4Z" fill="#818199"/>
                      <path d="M16 17V25H6V17H16ZM16 15H6C5.46957 15 4.96086 15.2107 4.58579 15.5858C4.21071 15.9609 4 16.4696 4 17V25C4 25.5304 4.21071 26.0391 4.58579 26.4142C4.96086 26.7893 5.46957 27 6 27H16C16.5304 27 17.0391 26.7893 17.4142 26.4142C17.7893 26.0391 18 25.5304 18 25V17C18 16.4696 17.7893 15.9609 17.4142 15.5858C17.0391 15.2107 16.5304 15 16 15Z" fill="#818199"/>
                      <path d="M27 17V22H22V17H27ZM27 15H22C21.4696 15 20.9609 15.2107 20.5858 15.5858C20.2107 15.9609 20 16.4696 20 17V22C20 22.5304 20.2107 23.0391 20.5858 23.4142C20.9609 23.7893 21.4696 24 22 24H27C27.5304 24 28.0391 23.7893 28.4142 23.4142C28.7893 23.0391 29 22.5304 29 22V17C29 16.4696 28.7893 15.9609 28.4142 15.5858C28.0391 15.2107 27.5304 15 27 15Z" fill="#818199"/>
                    </svg>
                    <span className="bg-gradient-hero bg-clip-text text-transparent">GEN-AI STUDIO</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/factillm-copilot')}
                tooltip="FACTILLM CO-PILOT"
              >
                <Link to="/factillm-copilot" aria-disabled="true" tabIndex={-1}>
                  <div className="flex items-center gap-2 pointer-events-none opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M27 6V11H17V6H27ZM27 4H17C16.4696 4 15.9609 4.21071 15.5858 4.58579C15.2107 4.96086 15 5.46957 15 6V11C15 11.5304 15.2107 12.0391 15.5858 12.4142C15.9609 12.7893 16.4696 13 17 13H27C27.5304 13 28.0391 12.7893 28.4142 12.4142C28.7893 12.0391 29 11.5304 29 11V6C29 5.46957 28.7893 4.96086 28.4142 4.58579C28.0391 4.21071 27.5304 4 27 4Z" fill="#818199"/>
                      <path d="M11 6V11H6V6H11ZM11 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V11C4 11.5304 4.21071 12.0391 4.58579 12.4142C4.96086 12.7893 5.46957 13 6 13H11C11.5304 13 12.0391 12.7893 12.4142 12.4142C12.7893 12.0391 13 11.5304 13 11V6C13 5.46957 12.7893 4.96086 12.4142 4.58579C12.0391 4.21071 11.5304 4 11 4Z" fill="#818199"/>
                      <path d="M16 17V25H6V17H16ZM16 15H6C5.46957 15 4.96086 15.2107 4.58579 15.5858C4.21071 15.9609 4 16.4696 4 17V25C4 25.5304 4.21071 26.0391 4.58579 26.4142C4.96086 26.7893 5.46957 27 6 27H16C16.5304 27 17.0391 26.7893 17.4142 26.4142C17.7893 26.0391 18 25.5304 18 25V17C18 16.4696 17.7893 15.9609 17.4142 15.5858C17.0391 15.2107 16.5304 15 16 15Z" fill="#818199"/>
                      <path d="M27 17V22H22V17H27ZM27 15H22C21.4696 15 20.9609 15.2107 20.5858 15.5858C20.2107 15.9609 20 16.4696 20 17V22C20 22.5304 20.2107 23.0391 20.5858 23.4142C20.9609 23.7893 21.4696 24 22 24H27C27.5304 24 28.0391 23.7893 28.4142 23.4142C28.7893 23.0391 29 22.5304 29 22V17C29 16.4696 28.7893 15.9609 28.4142 15.5858C28.0391 15.2107 27.5304 15 27 15Z" fill="#818199"/>
                    </svg>
                    <span className="bg-gradient-hero bg-clip-text text-transparent">FACTILLM CO-PILOT</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/factillm-evaluate')}
                tooltip="FACTILLM EVALUATE"
              >
                <Link to="/factillm-evaluate" aria-disabled="true" tabIndex={-1}>
                  <div className="flex items-center gap-2 pointer-events-none opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M27 6V11H17V6H27ZM27 4H17C16.4696 4 15.9609 4.21071 15.5858 4.58579C15.2107 4.96086 15 5.46957 15 6V11C15 11.5304 15.2107 12.0391 15.5858 12.4142C15.9609 12.7893 16.4696 13 17 13H27C27.5304 13 28.0391 12.7893 28.4142 12.4142C28.7893 12.0391 29 11.5304 29 11V6C29 5.46957 28.7893 4.96086 28.4142 4.58579C28.0391 4.21071 27.5304 4 27 4Z" fill="#818199"/>
                      <path d="M11 6V11H6V6H11ZM11 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V11C4 11.5304 4.21071 12.0391 4.58579 12.4142C4.96086 12.7893 5.46957 13 6 13H11C11.5304 13 12.0391 12.7893 12.4142 12.4142C12.7893 12.0391 13 11.5304 13 11V6C13 5.46957 12.7893 4.96086 12.4142 4.58579C12.0391 4.21071 11.5304 4 11 4Z" fill="#818199"/>
                      <path d="M16 17V25H6V17H16ZM16 15H6C5.46957 15 4.96086 15.2107 4.58579 15.5858C4.21071 15.9609 4 16.4696 4 17V25C4 25.5304 4.21071 26.0391 4.58579 26.4142C4.96086 26.7893 5.46957 27 6 27H16C16.5304 27 17.0391 26.7893 17.4142 26.4142C17.7893 26.0391 18 25.5304 18 25V17C18 16.4696 17.7893 15.9609 17.4142 15.5858C17.0391 15.2107 16.5304 15 16 15Z" fill="#818199"/>
                      <path d="M27 17V22H22V17H27ZM27 15H22C21.4696 15 20.9609 15.2107 20.5858 15.5858C20.2107 15.9609 20 16.4696 20 17V22C20 22.5304 20.2107 23.0391 20.5858 23.4142C20.9609 23.7893 21.4696 24 22 24H27C27.5304 24 28.0391 23.7893 28.4142 23.4142C28.7893 23.0391 29 22.5304 29 22V17C29 16.4696 28.7893 15.9609 28.4142 15.5858C28.0391 15.2107 27.5304 15 27 15Z" fill="#818199"/>
                    </svg>
                    <span className="bg-gradient-hero bg-clip-text text-transparent">FACTILLM EVALUATE</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/history')}
                tooltip="HISTORY"
              >
                <Link to="/history" aria-disabled="true" tabIndex={-1}>
                  <div className="flex items-center gap-2 pointer-events-none opacity-50">
                    <History className="text-gray-500" />
                    <span className="bg-gradient-hero bg-clip-text text-transparent">HISTORY</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/global-setting')}
                tooltip="GLOBAL SETTING"
              >
                <Link to="/global-setting" aria-disabled="true" tabIndex={-1}>
                  <div className="flex items-center gap-2 pointer-events-none opacity-50">
                    <Settings className="text-gray-500" />
                    <span className="bg-gradient-hero bg-clip-text text-transparent">GLOBAL SETTING</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/faq')}
                tooltip="FAQ"
              >
                <Link to="/faq" aria-disabled="true" tabIndex={-1}>
                  <div className="flex items-center gap-2 pointer-events-none opacity-50">
                    <HelpCircle className="text-gray-500" />
                    <span className="bg-gradient-hero bg-clip-text text-transparent">FAQ</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="flex justify-center py-4">
          {userProfile.authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-accent flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden sm:inline-block">{userProfile.name}</span>
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
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => login()} variant="default">
              Sign In
            </Button>
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