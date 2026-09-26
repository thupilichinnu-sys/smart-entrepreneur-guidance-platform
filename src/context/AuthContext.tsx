import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RegisterFormData, LoginFormData, Language } from '../types/auth';
import { authService } from '../services/authService';
import { activityService } from '../services/activityService';
import { useLanguage } from './LanguageContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (creds: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loadDemo: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Restore session automatically
    const sessionUser = authService.getCurrentSessionUser();
    if (sessionUser) {
      setUser(sessionUser);
      if (sessionUser.preferredLanguage) {
        setLanguage(sessionUser.preferredLanguage);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (creds: LoginFormData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const res = authService.login(creds);
    if (res.success && res.user) {
      setUser(res.user);
      if (res.user.preferredLanguage) setLanguage(res.user.preferredLanguage);
      activityService.logActivity(res.user.id, {
        type: 'PROFILE_UPDATED',
        title: 'Logged In',
        description: 'Successfully signed in to dashboard.'
      });
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, error: res.error || 'Login failed.' };
  };

  const register = async (data: RegisterFormData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const res = authService.register(data);
    if (res.success && res.user) {
      setUser(res.user);
      setLanguage(data.preferredLanguage);
      activityService.logActivity(res.user.id, {
        type: 'PROFILE_UPDATED',
        title: 'Account Registered',
        description: `Welcome to Smart Entrepreneur Guidance Platform, ${res.user.fullName}!`
      });
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, error: res.error || 'Registration failed.' };
  };

  const logout = () => {
    authService.clearSession();
    setUser(null);
  };

  const loadDemo = () => {
    setIsLoading(true);
    const res = authService.loadDemoEntrepreneur();
    setUser(res.user);
    if (res.user.preferredLanguage) setLanguage(res.user.preferredLanguage);
    setIsLoading(false);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = authService.updateProfile(user.id, updates);
    if (updated) {
      setUser(updated);
      activityService.logActivity(user.id, {
        type: 'PROFILE_UPDATED',
        title: 'Profile Updated',
        description: 'Updated account details and preferences.'
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      loadDemo,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
