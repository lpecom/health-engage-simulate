
import React, { createContext, useContext, useState, useEffect } from 'react';

type DiabetesType = 'type1' | 'type2' | 'prediabetes' | 'gestational' | 'other';

type GlucoseReading = {
  value: number;
  timestamp: number;
  inRange: boolean;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
};

interface UserData {
  name: string;
  age: number | null;
  diabetesType: DiabetesType | null;
  targetRangeLow: number;
  targetRangeHigh: number;
  onboarded: boolean;
  points: number;
  streak: number;
  lastMeasurementDate: string | null;
  glucoseReadings: GlucoseReading[];
  achievements: Achievement[];
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  addGlucoseReading: (reading: number) => void;
  checkAndUpdateStreak: () => void;
  earnPoints: (points: number) => void;
  checkAchievements: () => void;
}

const defaultUserData: UserData = {
  name: '',
  age: null,
  diabetesType: null,
  targetRangeLow: 70,
  targetRangeHigh: 180,
  onboarded: false,
  points: 0,
  streak: 0,
  lastMeasurementDate: null,
  glucoseReadings: [],
  achievements: [
    {
      id: 'first-measurement',
      title: 'firstMeasurement',
      description: 'Complete your first glucose measurement',
      icon: '🎯',
      unlocked: false
    },
    {
      id: 'three-day-streak',
      title: 'threeDay',
      description: 'Measure your glucose for 3 consecutive days',
      icon: '🔥',
      unlocked: false,
      progress: 0,
      maxProgress: 3
    },
    {
      id: 'seven-day-streak',
      title: 'sevenDay',
      description: 'Measure your glucose for 7 consecutive days',
      icon: '⚡',
      unlocked: false,
      progress: 0,
      maxProgress: 7
    },
    {
      id: 'profile-complete',
      title: 'profileComplete',
      description: 'Complete your health profile',
      icon: '📋',
      unlocked: false
    },
    {
      id: 'learn-expert',
      title: 'learnExpert',
      description: 'Read all educational content',
      icon: '🧠',
      unlocked: false,
      progress: 0,
      maxProgress: 3
    }
  ]
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : defaultUserData;
  });

  // Save to localStorage whenever userData changes
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prevData => {
      const newData = { ...prevData, ...data };
      
      // Check if profile is now complete to unlock achievement
      if (data.name || data.age || data.diabetesType) {
        if (newData.name && newData.age && newData.diabetesType) {
          checkProfileCompleteAchievement(newData);
        }
      }
      
      return newData;
    });
  };

  const addGlucoseReading = (reading: number) => {
    const newReading: GlucoseReading = {
      value: reading,
      timestamp: Date.now(),
      inRange: reading >= userData.targetRangeLow && reading <= userData.targetRangeHigh
    };

    const today = new Date().toDateString();
    
    setUserData(prevData => {
      const newData = {
        ...prevData,
        glucoseReadings: [newReading, ...prevData.glucoseReadings],
        lastMeasurementDate: today
      };
      
      // Add points for taking a measurement
      newData.points += 10;
      
      return newData;
    });

    // Check for first measurement achievement
    if (userData.glucoseReadings.length === 0) {
      unlockAchievement('first-measurement');
      earnPoints(50); // Bonus points for first measurement
    }
    
    checkAndUpdateStreak();
  };

  const checkAndUpdateStreak = () => {
    const today = new Date().toDateString();
    
    if (userData.lastMeasurementDate === null) {
      // First measurement ever
      setUserData(prevData => ({
        ...prevData,
        streak: 1,
        lastMeasurementDate: today
      }));
      return;
    }
    
    const lastDate = new Date(userData.lastMeasurementDate);
    const currentDate = new Date(today);
    
    // Calculate the difference in days
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day, increase streak
      const newStreak = userData.streak + 1;
      
      setUserData(prevData => ({
        ...prevData,
        streak: newStreak,
        lastMeasurementDate: today
      }));
      
      // Check streak achievements
      if (newStreak === 3) {
        unlockAchievement('three-day-streak');
        earnPoints(100);
      }
      
      if (newStreak === 7) {
        unlockAchievement('seven-day-streak');
        earnPoints(200);
      }
      
    } else if (diffDays > 1) {
      // Streak broken
      setUserData(prevData => ({
        ...prevData,
        streak: 1,
        lastMeasurementDate: today
      }));
    }
    // If diffDays is 0, it's the same day, no change to streak
  };

  const earnPoints = (points: number) => {
    setUserData(prevData => ({
      ...prevData,
      points: prevData.points + points
    }));
  };

  const unlockAchievement = (achievementId: string) => {
    setUserData(prevData => {
      const updatedAchievements = prevData.achievements.map(achievement => {
        if (achievement.id === achievementId) {
          return { ...achievement, unlocked: true };
        }
        return achievement;
      });
      
      return {
        ...prevData,
        achievements: updatedAchievements
      };
    });
  };

  const updateAchievementProgress = (achievementId: string, progressValue: number) => {
    setUserData(prevData => {
      const updatedAchievements = prevData.achievements.map(achievement => {
        if (achievement.id === achievementId) {
          const newProgress = (achievement.progress || 0) + progressValue;
          const isComplete = achievement.maxProgress && newProgress >= achievement.maxProgress;
          
          return { 
            ...achievement, 
            progress: newProgress,
            unlocked: isComplete ? true : achievement.unlocked
          };
        }
        return achievement;
      });
      
      return {
        ...prevData,
        achievements: updatedAchievements
      };
    });
  };

  const checkProfileCompleteAchievement = (userData: UserData) => {
    if (userData.name && userData.age && userData.diabetesType) {
      unlockAchievement('profile-complete');
      earnPoints(75);
    }
  };

  const checkAchievements = () => {
    // Check profile completion
    if (userData.name && userData.age && userData.diabetesType) {
      const profileAchievement = userData.achievements.find(a => a.id === 'profile-complete');
      if (profileAchievement && !profileAchievement.unlocked) {
        unlockAchievement('profile-complete');
        earnPoints(75);
      }
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        userData, 
        updateUserData, 
        addGlucoseReading, 
        checkAndUpdateStreak, 
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
