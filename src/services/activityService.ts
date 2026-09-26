import { ActivityItem, ActivityType } from '../types/activity';
import { storageService } from './storageService';

export const activityService = {
  getActivities(userId: string): ActivityItem[] {
    return storageService.getItem<ActivityItem[]>(userId, 'activities', []);
  },

  logActivity(userId: string, params: {
    type: ActivityType;
    title: string;
    description: string;
    relatedBusiness?: string;
    relatedId?: string;
    actionUrl?: string;
    actionLabel?: string;
  }): ActivityItem {
    const current = this.getActivities(userId);
    const newActivity: ActivityItem = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId,
      type: params.type,
      title: params.title,
      description: params.description,
      timestamp: new Date().toISOString(),
      relatedBusiness: params.relatedBusiness,
      relatedId: params.relatedId,
      actionUrl: params.actionUrl,
      actionLabel: params.actionLabel
    };

    // Keep latest 100 activities
    const updated = [newActivity, ...current].slice(0, 100);
    storageService.setItem(userId, 'activities', updated);
    return newActivity;
  },

  clearActivities(userId: string): void {
    storageService.setItem(userId, 'activities', []);
  }
};
