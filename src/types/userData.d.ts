
interface UserAchievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  date?: string;
  points: number;
}

interface GlucoseReading {
  timestamp: number;
  value: number;
  inRange: boolean;
}

interface UserData {
  id?: string;
  email?: string;
  name?: string;
  age?: number;
  diabetesType?: 'type1' | 'type2' | 'prediabetes' | 'gestational' | 'other' | null;
  onboarded: boolean;
  language?: string;
  shippingInfo?: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  points?: number;
  // Added properties to fix build errors
  targetRangeLow?: number;
  targetRangeHigh?: number;
  glucoseReadings?: GlucoseReading[];
  achievements?: UserAchievement[];
  exerciseFrequency?: string;
  dietType?: string;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  resetData: () => void;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  // Added properties to fix build errors
  earnPoints?: (points: number) => void;
  checkAchievements?: () => void;
}
