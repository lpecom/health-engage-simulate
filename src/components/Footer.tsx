
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, User, Settings, BookOpen, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

const Footer = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-10">
      <div className="flex justify-around max-w-md mx-auto">
        <Button 
          variant="ghost" 
          className={cn(
            "flex flex-col items-center rounded-lg px-3 py-2", 
            isActive('/home') && "text-accu-tech-blue"
          )} 
          onClick={() => navigate('/home')}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">{translate('home')}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className={cn(
            "flex flex-col items-center rounded-lg px-3 py-2",
            (isActive('/learn/how-it-works') || isActive('/learn/benefits') || isActive('/learn/safety')) && "text-accu-tech-blue"
          )} 
          onClick={() => navigate('/learn/how-it-works')}
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-xs mt-1">{translate('learn')}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className={cn(
            "flex flex-col items-center rounded-lg px-3 py-2",
            isActive('/plan') && "text-accu-tech-blue"
          )} 
          onClick={() => navigate('/plan')}
        >
          <Award className="h-5 w-5" />
          <span className="text-xs mt-1">{translate('plan')}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className={cn(
            "flex flex-col items-center rounded-lg px-3 py-2",
            isActive('/profile') && "text-accu-tech-blue"
          )} 
          onClick={() => navigate('/profile')}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">{translate('profile')}</span>
        </Button>
      </div>
    </div>
  );
};

export default Footer;
