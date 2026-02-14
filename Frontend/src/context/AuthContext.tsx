import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import authService from '../services/auth.service';

interface User {
  id: number;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = authService.getToken();
      
      if (storedToken) {
        try {
          // Verify token by fetching profile
          const profileResponse = await authService.getProfile();
          
          if (profileResponse.success && profileResponse.data?.user) {
            setUser(profileResponse.data.user);
            setToken(storedToken);
          } else {
            // Token invalid, remove it
            authService.logout();
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          authService.logout();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      
      if (response.success && response.data?.user && response.data?.token) {
        setUser(response.data.user);
        setToken(response.data.token);
      }
      
      return {
        success: response.success,
        message: response.message
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await authService.signup(email, password);
      
      return {
        success: response.success,
        message: response.message
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Signup failed. Please try again.'
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state
      setUser(null);
      setToken(null);
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
