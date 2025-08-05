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
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

export function Header() {
  const navigate = useNavigate();
  const { currentProject, userProfile, clearUserProfile, setUserProfile } = useMigrationStore();
  
  const handleSignOut = () => {
    // Sign out from Google
    googleLogout();
    
    // Clear user profile from store
    clearUserProfile();
  };

  // Handle successful login
  const handleLoginSuccess = async (response: any) => {
    try {
      if (response.access_token) {
        // This is the response from useGoogleLogin
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
        // This is the response from useGoogleOneTapLogin (handled in GoogleAuthProvider)
        // We can keep this logic here for robustness, though it's primarily for one-tap
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

  // Helper function to parse JWT (kept for useGoogleOneTapLogin in GoogleAuthProvider)
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

  // Manual Google login
  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: () => console.error('Google login failed'),
  });

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
        </div>
      </div>
    </header>
  );
}