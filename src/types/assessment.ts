export interface LocationData {
  state: string;
  district: string;
  block?: string;
  gramPanchayat?: string;
  village?: string;
  pinCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface AssessmentData {
  id?: string;
  userId?: string;
  location: LocationData;
  marginCapital: number;
  category: string;
  subCategory?: string;
  experienceLevel: 'none' | '1-2_years' | '3-5_years' | '5+_years';
  skills: string[];
  existingAssets: string[];
  familyWorkforce: number;
  targetMarket: 'village_only' | 'cluster_5km' | 'district_10km' | 'regional';
  status: 'draft' | 'completed';
  updatedAt: string;
  progressPercent: number;
}
