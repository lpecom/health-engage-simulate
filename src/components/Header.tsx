
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from './MainNavigation';
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const { userData } = useUser();
  
  return (
    <header className="gradient-medical text-white px-4 pt-6 pb-6">
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
            {userData.name && <p className="text-sm opacity-90">{translate('hello')}, {userData.name}</p>}
          </div>
        </div>
        
        <div className="flex justify-between space-x-2 mb-2">
          <div className="flex-1 bg-white/10 rounded-lg border-none text-white shadow-none p-3 text-center">
            <p className="text-xs opacity-80">{translate('points')}</p>
            <p className="text-xl font-bold">{userData.points}</p>
          </div>
          
          <div className="flex-1 bg-white/10 rounded-lg border-none text-white shadow-none p-3 text-center">
            <p className="text-xs opacity-80">{translate('streak')}</p>
            <p className="text-xl font-bold">{userData.streak} {userData.streak > 0 && '🔥'}</p>
          </div>
          
          <div className="flex-1 bg-white/10 rounded-lg border-none text-white shadow-none p-3 text-center">
            <p className="text-xs opacity-80">{translate('readings')}</p>
            <p className="text-xl font-bold">{userData.glucoseReadings.length}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
