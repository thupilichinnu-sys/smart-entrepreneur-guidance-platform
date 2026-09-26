export type ActivityType = 
  | 'ASSESSMENT_COMPLETED'
  | 'FINANCIAL_PLAN_CREATED'
  | 'SCHEME_CHECKED'
  | 'FEASIBILITY_GENERATED'
  | 'BUSINESS_COMPARED'
  | 'REPORT_DOWNLOADED'
  | 'AI_ADVISOR_USED'
  | 'PROFILE_UPDATED'
  | 'SAVED_PLAN_CREATED'
  | 'ACTION_ITEM_COMPLETED';

export type ActivityFilter = 'all' | 'assessments' | 'financial' | 'schemes' | 'ai' | 'reports' | 'profile';

export interface ActivityItem {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  relatedBusiness?: string;
  relatedId?: string;
  actionUrl?: string;
  actionLabel?: string;
}
