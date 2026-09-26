export type Language = 'en' | 'te' | 'hi';

export interface User {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  state: string;
  district: string;
  village?: string;
  preferredLanguage: Language;
  createdAt: string;
  avatarUrl?: string;
  skills?: string[];
  experienceLevel?: string;
  marginCapital?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
}

export interface RegisterFormData {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  state: string;
  district: string;
  village?: string;
  preferredLanguage: Language;
}

export interface LoginFormData {
  identifier: string; // email or mobile
  password: string;
  rememberMe?: boolean;
}
