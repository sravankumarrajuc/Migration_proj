import React from 'react';
import { GoogleOAuthProvider, useGoogleOneTapLogin } from '@react-oauth/google';
import { useMigrationStore } from '@/store/migrationStore';

interface GoogleAuthProviderProps {
  children: React.ReactNode;
}

const GoogleOneTapLoginHandler: React.FC = () => {
  const { setUserProfile } = useMigrationStore();

  // Handle successful login
  const handleLoginSuccess = async (response: any) => {
    try {
      // Decode the credential to get user info
      const payload = parseJwt(response.credential);
      
      // Add a small delay to ensure the UI updates properly
      setTimeout(() => {
        // Update user profile in store
        setUserProfile({
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
          authenticated: true,
        });
      }, 100);
    } catch (error) {
      console.error('Error parsing credential:', error);
    }
  };

  // Helper function to parse JWT
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

  // Google One Tap login
  useGoogleOneTapLogin({
    onSuccess: handleLoginSuccess,
    onError: () => console.error('Google One Tap login failed'),
  });

  return null;
};

export const GoogleAuthProvider: React.FC<GoogleAuthProviderProps> = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId="651756031653-nsei31u17obbdbrhj7hfrfeqctjpfb95.apps.googleusercontent.com">
      <GoogleOneTapLoginHandler />
      {children}
    </GoogleOAuthProvider>
  );
};