import React, { createContext, useContext, useState } from 'react';
import { Achievement as AchievementType, User } from '@/types/userData';

interface UserShippingInfo {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  title?: string;
  unlocked?: boolean;
  progress?: number;
  maxProgress?: number;
  category?: 'reading' | 'streak' | 'learning';
}

export interface GlucoseReading {
  value: number;
  timestamp: Date;
  notes?: string;
}

export interface UserData {
  onboarded: boolean;
  points: number;
  name: string;
  age: number | null;
  diabetesType: 'type1' | 'type2' | 'prediabetes' | 'gestational' | 'other' | null;
  levels: number[];
  streak: number;
  readings: number;
  shippingInfo?: UserShippingInfo;
  targetRangeLow?: number;
  targetRangeHigh?: number;
  achievements?: Achievement[];
  glucoseReadings?: GlucoseReading[];
  exerciseFrequency?: string;
  dietType?: string;
}

export interface UserStats {
  averageLevel: number;
  minLevel: number;
  maxLevel: number;
  readingsThisWeek: number;
  trendDirection: 'up' | 'down' | 'stable';
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  addGlucoseReading: (value: number) => void;
  getUserStats: () => UserStats;
  resetUserData: () => void;
  earnPoints?: (amount: number) => void;
  checkAchievements?: () => void;
}

const defaultUserData: UserData = {
  onboarded: false,
  points: 0,
  name: '',
  age: null,
  diabetesType: null,
  levels: [],
  streak: 0,
  readings: 0,
  targetRangeLow: 70,
  targetRangeHigh: 140,
  achievements: [],
  glucoseReadings: []
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(() => {
    const savedData = localStorage.getItem('user_data');
    return savedData ? JSON.parse(savedData) : defaultUserData;
  });

  React.useEffect(() => {
    localStorage.setItem('user_data', JSON.stringify(userData));
  }, [userData]);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  const addGlucoseReading = (value: number) => {
    setUserData(prevData => {
      const now = new Date();
      const today = now.toDateString();
      const lastReadingDate = localStorage.getItem('last_reading_date');
      
      let newStreak = prevData.streak;
      if (lastReadingDate !== today) {
        newStreak += 1;
        localStorage.setItem('last_reading_date', today);
      }

      const newReading = { 
        value, 
        timestamp: now 
      };

      const newGlucoseReadings = [
        ...(prevData.glucoseReadings || []), 
        newReading
      ];
      
      return {
        ...prevData,
        levels: [...prevData.levels, value],
        glucoseReadings: newGlucoseReadings,
        readings: prevData.readings + 1,
        streak: newStreak,
        points: prevData.points + 10
      };
    });
  };

  const earnPoints = (amount: number) => {
    setUserData(prevData => ({
      ...prevData,
      points: prevData.points + amount
    }));
  };

  const checkAchievements = () => {
    setUserData(prevData => {
      const achievements = [...(prevData.achievements || [])];
      
      if (prevData.readings > 0 && !achievements.some(a => a.id === 'first_reading')) {
        achievements.push({
          id: 'first_reading',
          name: 'First Reading',
          description: 'Took your first glucose reading',
          icon: 'bar-chart',
          earned: true,
          earnedAt: new Date()
        });
      }
      
      if (prevData.streak >= 3 && !achievements.some(a => a.id === 'streak_3')) {
        achievements.push({
          id: 'streak_3', 
          name: '3-Day Streak',
          description: 'Took readings for 3 days in a row',
          icon: 'calendar',
          earned: true,
          earnedAt: new Date()
        });
      }
      
      return {
        ...prevData,
        achievements
      };
    });
  };

  const getUserStats = (): UserStats => {
    const levels = userData.levels;
    
    if (levels.length === 0) {
      return {
        averageLevel: 0,
        minLevel: 0,
        maxLevel: 0,
        readingsThisWeek: 0,
        trendDirection: 'stable'
      };
    }
    
    const sum = levels.reduce((a, b) => a + b, 0);
    const average = sum / levels.length;
    const min = Math.min(...levels);
    const max = Math.max(...levels);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const readingsThisWeek = userData.levels.length;
    
    let trendDirection: 'up' | 'down' | 'stable' = 'stable';
    if (levels.length >= 3) {
      const recentAvg = (levels[levels.length-1] + levels[levels.length-2] + levels[levels.length-3]) / 3;
      const olderAvg = (levels[0] + levels[Math.min(1, levels.length-1)] + levels[Math.min(2, levels.length-1)]) / 3;
      
      if (recentAvg > olderAvg + 10) {
        trendDirection = 'up';
      } else if (recentAvg < olderAvg - 10) {
        trendDirection = 'down';
      }
    }
    
    return {
      averageLevel: Math.round(average),
      minLevel: min,
      maxLevel: max,
      readingsThisWeek,
      trendDirection
    };
  };

  const resetUserData = () => {
    setUserData(defaultUserData);
    localStorage.removeItem('last_reading_date');
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        updateUserData,
        addGlucoseReading,
        getUserStats,
        resetUserData,
        earnPoints,
        checkAchievements
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
