
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, ChevronLeft, LogOut, Info, ShoppingCart, Languages, ShieldCheck } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const { userData } = useUser();

  const menuItems = [
    {
      icon: <Languages className="h-5 w-5" />,
      label: translate('language'),
      onClick: () => navigate('/language')
    },
    {
      icon: <Info className="h-5 w-5" />,
      label: translate('about'),
      onClick: () => {}
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: translate('shopifySettings'),
      onClick: () => navigate('/shopify-settings')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="gradient-medical text-white px-4 pt-6 pb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-white/10 hover:bg-white/20 rounded-full p-2 mb-4"
          onClick={() => navigate('/home')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarFallback className="text-lg">
              {userData.name ? userData.name.charAt(0).toUpperCase() : '?'}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-xl font-bold">
              {userData.name || translate('guest')}
            </h1>
            <p className="text-white/80">
              {translate('points')}: {userData.points}
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-4 pt-4">
        <Card className="mb-4">
          <CardContent className="p-0">
            <ul className="divide-y">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-3 h-auto rounded-none hover:bg-gray-50"
                    onClick={item.onClick}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Button
          variant="ghost"
          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 w-full justify-start px-4 py-3 h-auto"
        >
          <LogOut className="h-5 w-5" />
          <span>{translate('logout')}</span>
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
