
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from './MainNavigation';
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Flame, Award, Activity, TrendingUp, Target } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const { userData } = useUser();
  const isMobile = useIsMobile();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return translate('goodMorning');
    if (hour < 18) return translate('goodAfternoon');
    return translate('goodEvening');
  };
  
  const getInRangePercentage = () => {
    if (userData.glucoseReadings.length === 0) return 0;
    const inRangeCount = userData.glucoseReadings.filter(r => r.inRange).length;
    return Math.round((inRangeCount / userData.glucoseReadings.length) * 100);
  };
  
  return (
    <header className="bg-gradient-to-r from-accu-tech-blue to-purple-600 text-white px-4 pt-4 pb-6 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/home')}
          >
            <img 
              src="https://accu-tech.pro/wp-content/uploads/2024/08/Accu-Tech-1.png" 
              alt="Accu-Tech Logo" 
              className="h-8 mr-2" 
            />
            <h1 className="text-xl font-bold">Healthineers</h1>
          </div>
          
          <MainNavigation />
        </div>
        
        <div className="flex justify-between items-center mb-5">
          <div>
            {userData.name && (
              <p className="text-lg font-medium">
                {getGreeting()}, {userData.name}
              </p>
            )}
            {userData.diabetesType && (
              <p className="text-sm opacity-90">
                {translate('diabetesType')}: {translate(userData.diabetesType)}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/20 rounded-lg border-none text-white shadow-md p-3 text-center transition-transform hover:scale-105">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-5 w-5 mr-1 text-yellow-200" />
              <p className="text-xs font-medium">{translate('points')}</p>
            </div>
            <p className="text-xl font-bold">{userData.points}</p>
            {userData.points > 0 && (
              <p className="text-xs mt-1 text-yellow-200">+{Math.min(userData.points, 100)} today</p>
            )}
          </div>
          
          <div className="bg-white/20 rounded-lg border-none text-white shadow-md p-3 text-center transition-transform hover:scale-105">
            <div className="flex items-center justify-center mb-1">
              <Flame className={`h-5 w-5 mr-1 ${userData.streak > 0 ? 'text-orange-400' : 'text-gray-300'}`} />
              <p className="text-xs font-medium">{translate('streak')}</p>
            </div>
            <div className="relative">
              <p className="text-xl font-bold">
                {userData.streak} 
                {userData.streak > 0 && <span className="animate-pulse ml-1">🔥</span>}
              </p>
              {userData.streak >= 3 && (
                <p className="text-xs mt-1 text-orange-200">On fire!</p>
              )}
            </div>
          </div>
          
          <div className="bg-white/20 rounded-lg border-none text-white shadow-md p-3 text-center transition-transform hover:scale-105">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-5 w-5 mr-1 text-green-200" />
              <p className="text-xs font-medium">{translate('inRange')}</p>
            </div>
            <p className="text-xl font-bold">{getInRangePercentage()}%</p>
            {userData.glucoseReadings.length > 0 && (
              <div className="mt-1">
                <div className="h-1.5 bg-white/30 rounded-full w-full">
                  <div 
                    className="h-1.5 bg-green-300 rounded-full" 
                    style={{ width: `${getInRangePercentage()}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {userData.goal && (
          <div className="mb-3 bg-white/10 p-2 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-200" />
              <p className="text-sm">
                <span className="font-medium">Your goal:</span> {userData.goal === 'custom' ? userData.customGoal : translate(userData.goal || '')}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
