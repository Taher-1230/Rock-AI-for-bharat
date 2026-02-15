export enum ScreenName {
  WELCOME = 'WELCOME',
  LOGIN = 'LOGIN',
  PROFILE_METHOD = 'PROFILE_METHOD',
  PROFILE_WIZARD = 'PROFILE_WIZARD',
  SCAN_VERIFY = 'SCAN_VERIFY',
  ANALYZING = 'ANALYZING',
  DASHBOARD = 'DASHBOARD',
  RECOMMENDATIONS = 'RECOMMENDATIONS',
  SCHEME_DETAILS = 'SCHEME_DETAILS',
}

export interface UserProfile {
  name: string;
  mobile: string;
  ageRange?: string;
  state?: string;
  district?: string;
  occupation?: string;
  income?: string;
  category?: string;
  language: string;
  profileImage?: string;
}

export const INITIAL_PROFILE: UserProfile = {
  name: 'Rajesh Kumar',
  mobile: '',
  language: 'English',
};

export interface Scheme {
  id: string;
  title: string;
  description: string;
  benefitType: string;
  tags: string[];
  eligible: boolean;
  amount?: string;
}