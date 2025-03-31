
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from './MainNavigation';
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Flame, Award, Activity } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const { userData } = useUser();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return translate('goodMorning');
    if (hour < 18) return translate('goodAfternoon');
    return translate('goodEvening');
  };
  
  return (
    <header className="bg-gradient-to-r from-accu-tech-blue to-purple-600 text-white px-4 pt-6 pb-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/home')}
          >
            <img 
              src="https://accu-tech.pro/wp-content/uploads/2024/08/Accu-Tech-1.png" 
              alt="Accu-Tech Logo" 
              className="h-8 mr-3" 
            />
            <h1 className="text-xl font-bold">Healthineers</h1>
          </div>
          
          <MainNavigation />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            {userData.name && (
              <p className="text-lg opacity-95 font-medium">
                {getGreeting()}, {userData.name}
              </p>
            )}
            {userData.diabetesType && (
              <p className="text-sm opacity-80">
                {translate('diabetesType')}: {translate(userData.diabetesType)}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="bg-white/15 rounded-lg border-none text-white shadow-md p-3 text-center transition-transform hover:scale-105">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-4 w-4 mr-1 text-yellow-200" />
              <p className="text-xs opacity-90 font-medium">{translate('points')}</p>
            </div>
            <p className="text-xl font-bold">{userData.points}</p>
          </div>
          
          <div className="bg-white/15 rounded-lg border-none text-white shadow-md p-3 text-center transition-transform hover:scale-105">
            <div className="flex items-center justify-center mb-1">
              <Flame className={`h-4 w-4 mr-1 ${userData.streak > 0 ? 'text-orange-400' : 'text-gray-300'}`} />
              <p className="text-xs opacity-90 font-medium">{translate('streak')}</p>
            </div>
            <p className="text-xl font-bold">
              {userData.streak} 
              {userData.streak > 0 && <span className="animate-pulse ml-1">🔥</span>}
            </p>
          </div>
          
          <div className="bg-white/15 rounded-lg border-none text-white shadow-md p-3 text-center transition-transform hover:scale-105">
            <div className="flex items-center justify-center mb-1">
              <Activity className="h-4 w-4 mr-1 text-green-200" />
              <p className="text-xs opacity-90 font-medium">{translate('readings')}</p>
            </div>
            <p className="text-xl font-bold">{userData.glucoseReadings.length}</p>
            {userData.glucoseReadings.length > 0 && (
              <div className="mt-1">
                <div className="h-1 bg-white/20 rounded-full w-full">
                  <div 
                    className="h-1 bg-green-300 rounded-full" 
                    style={{ width: `${Math.min(userData.glucoseReadings.length / 10 * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
