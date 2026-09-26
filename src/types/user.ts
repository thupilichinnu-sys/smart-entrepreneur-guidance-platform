export interface SavedBusinessPlan {
  id: string;
  userId: string;
  businessName: string;
  category: string;
  location: string;
  marginCapital: number;
  projectCost: number;
  loanAmount: number;
  schemeName: string;
  feasibilityScore: number;
  status: 'Draft' | 'Analyzing' | 'Ready' | 'Completed';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert';
  timestamp: string;
  isRead: boolean;
  linkUrl?: string;
}

export interface UserSettings {
  lowDataMode: boolean;
  enableAudioVoice: boolean;
  preferredLanguage: 'en' | 'te' | 'hi';
  notificationsEmail: boolean;
  notificationsSMS: boolean;
}
