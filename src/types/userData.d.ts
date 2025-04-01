
declare module '@/types/userData' {
  export interface User {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
    glucoseUnit: 'mg/dL' | 'mmol/L';
    targetLevels: {
      low: number;
      high: number;
    };
    settings?: {
      notifications: boolean;
      theme: 'light' | 'dark' | 'system';
      language: string;
    };
    doctor?: {
      name: string;
      email: string;
      phone: string;
    };
    caregivers?: Array<{
      name: string;
      relation: string;
      phone: string;
      email: string;
    }>;
    emergencyContact?: {
      name: string;
      phone: string;
      relation: string;
    };
    onboarded?: boolean;
  }

  export interface GlucoseReading {
    timestamp: string | number;
    value: number;
    meal?: 'before' | 'after' | null;
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
    note?: string | null;
  }
  
  export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress: number;
    maxProgress: number;
    category: 'reading' | 'streak' | 'learning';
  }

  export interface GlucoseData {
    id: string;
    timestamp: number;
    value: number;
    unit: 'mg/dL' | 'mmol/L';
    note?: string;
    mealInfo?: {
      timing: 'before' | 'after';
      type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    };
    tags?: string[];
    deviceInfo?: {
      deviceId: string;
      manufacturer: string;
      model: string;
    };
  }

  export interface MealData {
    id: string;
    timestamp: number;
    name: string;
    description?: string;
    carbohydrates?: number;
    proteins?: number;
    fats?: number;
    calories?: number;
    glycemicIndex?: number;
    foods?: Array<{
      name: string;
      amount: string;
      carbs?: number;
    }>;
    photo?: string;
    tags?: string[];
  }

  export interface ActivityData {
    id: string;
    timestamp: number;
    type: 'walking' | 'running' | 'cycling' | 'swimming' | 'weights' | 'other';
    duration: number; // in minutes
    intensity: 'low' | 'moderate' | 'high';
    steps?: number;
    distance?: number; // in meters or kilometers
    calories?: number;
    heartRate?: {
      avg: number;
      max: number;
    };
    note?: string;
  }

  export interface MedicationDose {
    id: string;
    timestamp: number;
    medication: {
      name: string;
      dosage: string;
      unit: string;
    };
    taken: boolean;
    scheduled: boolean;
    scheduledTime?: number;
    note?: string;
  }

  export interface UserNote {
    id: string;
    timestamp: number;
    title: string;
    content: string;
    tags?: string[];
    attachments?: Array<{
      name: string;
      type: string;
      url: string;
    }>;
  }

  export interface DailyLog {
    date: string;
    glucoseReadings: GlucoseReading[];
    meals?: MealData[];
    medications?: MedicationDose[];
    activities?: ActivityData[];
    notes?: UserNote[];
    symptoms?: Array<{
      name: string;
      severity: 'mild' | 'moderate' | 'severe';
      timestamp: number;
      note?: string;
    }>;
    sleep?: {
      duration: number; // in hours
      quality: 'poor' | 'fair' | 'good' | 'excellent';
      note?: string;
    };
    stress?: {
      level: 'low' | 'moderate' | 'high';
      note?: string;
    };
    overview?: {
      averageGlucose: number;
      timeInRange: number;
      hypoEvents: number;
      hyperEvents: number;
    };
  }

  // Shopify Checkout Types
  export interface ShippingInfo {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    address: string;
    province: string;
    city: string;
    postalCode: string;
    country: string;
  }
  
  export interface ProductOption {
    id: number;
    title: string;
    price: number;
    originalPrice: number;
    units: number;
    discount: string;
    installments?: string;
    shipping: number;
  }

  export interface CheckoutOrderData {
    product: ProductOption;
    shipping: ShippingInfo;
  }
}
