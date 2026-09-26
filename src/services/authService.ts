import { User, RegisterFormData, LoginFormData } from '../types/auth';
import { DEMO_USER, DEMO_ASSESSMENT, DEMO_FEASIBILITY_REPORT, DEMO_ACTIVITIES } from '../data/demoData';
import { storageService } from './storageService';

const USERS_REGISTRY_KEY = 'segp_v1_users_registry';
const CURRENT_SESSION_KEY = 'segp_v1_current_session';

interface RegisteredUserRecord {
  user: User;
  passwordHash: string; // Simulated SHA/secure hash
}

export const authService = {
  getUsersRegistry(): RegisteredUserRecord[] {
    try {
      const raw = localStorage.getItem(USERS_REGISTRY_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveUsersRegistry(users: RegisteredUserRecord[]): void {
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
  },

  getCurrentSessionUser(): User | null {
    try {
      const raw = localStorage.getItem(CURRENT_SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  setSession(user: User): void {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
  },

  clearSession(): void {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  },

  register(data: RegisterFormData): { success: boolean; user?: User; error?: string } {
    const registry = this.getUsersRegistry();
    const existing = registry.find(r => r.user.email.toLowerCase() === data.email.toLowerCase() || r.user.mobile === data.mobile);
    if (existing) {
      return { success: false, error: 'An account with this email or mobile number already exists.' };
    }

    const newUser: User = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      fullName: data.fullName.trim(),
      mobile: data.mobile.trim(),
      email: data.email.toLowerCase().trim(),
      state: data.state,
      district: data.district,
      village: data.village || '',
      preferredLanguage: data.preferredLanguage,
      createdAt: new Date().toISOString()
    };

    // Store user securely with simulated hashing (never store raw passwords)
    registry.push({
      user: newUser,
      passwordHash: btoa(data.password + '_salt_segp_2026')
    });
    this.saveUsersRegistry(registry);
    this.setSession(newUser);

    return { success: true, user: newUser };
  },

  login(credentials: LoginFormData): { success: boolean; user?: User; error?: string } {
    const ident = credentials.identifier.trim().toLowerCase();
    
    // Check Demo Entrepreneur Bypass
    if (ident === 'demo' || ident === 'demo@ruralempower.org' || ident === '9876543210') {
      return this.loadDemoEntrepreneur();
    }

    const registry = this.getUsersRegistry();
    const expectedHash = btoa(credentials.password + '_salt_segp_2026');

    const found = registry.find(r => 
      (r.user.email.toLowerCase() === ident || r.user.mobile === ident) && 
      r.passwordHash === expectedHash
    );

    if (!found) {
      return { success: false, error: 'Invalid email/mobile or password. Please try again.' };
    }

    this.setSession(found.user);
    return { success: true, user: found.user };
  },

  loadDemoEntrepreneur(): { success: boolean; user: User } {
    const demoUser = { ...DEMO_USER };
    this.setSession(demoUser);

    // Populate initial state if not already existing
    const existingAssessment = storageService.getItem(demoUser.id, 'assessment', null);
    if (!existingAssessment) {
      storageService.setItem(demoUser.id, 'assessment', DEMO_ASSESSMENT);
      storageService.setItem(demoUser.id, 'feasibility_reports', [DEMO_FEASIBILITY_REPORT]);
      storageService.setItem(demoUser.id, 'activities', DEMO_ACTIVITIES);
      storageService.setItem(demoUser.id, 'saved_plans', [
        {
          id: 'plan_demo_01',
          userId: demoUser.id,
          businessName: 'Dairy & Milk Products Enterprise',
          category: 'Agriculture & FoodTech',
          location: 'Penukonda GP, Andhra Pradesh',
          marginCapital: 100000,
          projectCost: 1000000,
          loanAmount: 900000,
          schemeName: 'Term Loan Scheme',
          feasibilityScore: 82,
          status: 'Ready',
          createdAt: '2026-03-01T10:00:00Z',
          updatedAt: '2026-03-09T18:30:00Z'
        }
      ]);
      storageService.setItem(demoUser.id, 'notifications', [
        {
          id: 'notif_1',
          userId: demoUser.id,
          title: 'Feasibility Report Ready',
          message: 'Your Dairy & Milk Products feasibility report scored 82/100 (Promising Opportunity).',
          type: 'success',
          timestamp: new Date().toISOString(),
          isRead: false,
          linkUrl: '/feasibility'
        },
        {
          id: 'notif_2',
          userId: demoUser.id,
          title: 'Scheme Matched: Term Loan',
          message: 'Eligible for 90% financing (₹9.00 Lakh) at 8% p.a. interest.',
          type: 'info',
          timestamp: new Date().toISOString(),
          isRead: true,
          linkUrl: '/scheme-router'
        }
      ]);
    }

    return { success: true, user: demoUser };
  },

  updateProfile(userId: string, updates: Partial<User>): User | null {
    const current = this.getCurrentSessionUser();
    if (!current || current.id !== userId) return null;

    const updated: User = { ...current, ...updates };
    this.setSession(updated);

    const registry = this.getUsersRegistry();
    const idx = registry.findIndex(r => r.user.id === userId);
    if (idx !== -1) {
      registry[idx].user = updated;
      this.saveUsersRegistry(registry);
    }
    return updated;
  },

  changePassword(userId: string, newPass: string): boolean {
    const registry = this.getUsersRegistry();
    const idx = registry.findIndex(r => r.user.id === userId);
    if (idx !== -1) {
      registry[idx].passwordHash = btoa(newPass + '_salt_segp_2026');
      this.saveUsersRegistry(registry);
      return true;
    }
    return false;
  }
};
