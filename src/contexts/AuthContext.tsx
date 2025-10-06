import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, type User, type LoginCredentials, type RegisterData } from '@/services/api';
import { mockApiService } from '@/services/mockApi';

// User interface is now imported from api service

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone?: string, company?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('acero_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('acero_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const credentials: LoginCredentials = { email, password };
      
      // Try real API first, fallback to mock API
      let response;
      try {
        response = await apiService.login(credentials);
      } catch (error) {
        console.log('Real API not available, using mock API');
        response = await mockApiService.login(credentials);
      }
      
      if (response.data) {
        setUser(response.data.user);
        return true;
      } else {
        console.error('Login failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    phone?: string, 
    company?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const userData: RegisterData = {
        email,
        password,
        name,
        phone,
        company
      };
      
      // Try real API first, fallback to mock API
      let response;
      try {
        response = await apiService.register(userData);
      } catch (error) {
        console.log('Real API not available, using mock API');
        response = await mockApiService.register(userData);
      }
      
      if (response.data) {
        setUser(response.data.user);
        return true;
      } else {
        console.error('Registration failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Try real API first, fallback to mock API
      try {
        await apiService.logout();
      } catch (error) {
        console.log('Real API not available, using mock API');
        await mockApiService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      apiService.clearToken();
      mockApiService.clearToken();
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      // Try real API first, fallback to mock API
      let response;
      try {
        response = await apiService.updateProfile(updates);
      } catch (error) {
        console.log('Real API not available, using mock API');
        response = await mockApiService.updateProfile(updates);
      }
      
      if (response.data) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
