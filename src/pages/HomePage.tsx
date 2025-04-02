
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import DeviceShippingStatus from "@/components/DeviceShippingStatus";
import { ActivitySquare, Award, Book, ChevronRight, History, Home, TrendingUp, LineChart, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formatDateTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const HomePage = () => {
  const {
    translate,
    language
  } = useLanguage();
  const {
    userData,
    checkAchievements
  } = useUser();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [showDeviceConnector, setShowDeviceConnector] = useState(true);

  useEffect(() => {
    if (!userData.onboarded) {
      navigate('/onboarding');
    }
    checkAchievements();
  }, [userData.onboarded, navigate, checkAchievements]);

  useEffect(() => {
    // Check if userData.achievements exists before trying to filter it
    if (userData.achievements && Array.isArray(userData.achievements)) {
      const unlockedAchievements = userData.achievements.filter(a => a.unlocked);
      const latestAchievement = unlockedAchievements[unlockedAchievements.length - 1];
      if (latestAchievement && !localStorage.getItem(`shown_${latestAchievement.id}`)) {
        localStorage.setItem(`shown_${latestAchievement.id}`, 'true');
        toast({
          title: translate('achievementUnlocked'),
          description: `${latestAchievement.icon} ${translate(latestAchievement.title)}`,
          variant: "default",
          duration: 5000
        });
      }
    }
  }, [userData.achievements, toast, translate]);

  // Learn About GlucoVista Component
  const LearnAboutGlucoVista = () => <Card className="mb-4">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium mb-4">{translate('learnAboutGlucoVista')}</h2>
        
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-between py-6 px-4" onClick={() => navigate('/learn/how-it-works')}>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-medical-light/50 flex items-center justify-center mr-3">
                <History className="h-4 w-4 text-medical-dark" />
              </div>
              <span className="font-medium">{translate('howitworks')}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Button>
          
          <Button variant="outline" className="w-full justify-between py-6 px-4" onClick={() => navigate('/learn/benefits')}>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-warm-light/50 flex items-center justify-center mr-3">
                <Award className="h-4 w-4 text-warm-primary" />
              </div>
              <span className="font-medium">{translate('benefits')}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Button>
          
          <Button variant="outline" className="w-full justify-between py-6 px-4" onClick={() => navigate('/learn/safety')}>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <div className="h-4 w-4 text-green-600">✓</div>
              </div>
              <span className="font-medium">{translate('safety')}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Button>
        </div>
      </CardContent>
    </Card>;

  return <div className="min-h-screen bg-gray-50 pb-16">
      <div className="gradient-medical text-white px-4 pt-6 pb-6">
        <div className="flex items-center mb-4">
          <img src="https://accu-tech.pro/wp-content/uploads/2024/08/Accu-Tech-1.png" alt="Accu-Tech Logo" className="h-8 mr-3" />
          <h1 className="text-xl font-bold">Healthineers</h1>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            {userData.name && <p className="text-sm opacity-90">{translate('hello')}, {userData.name}</p>}
          </div>
        </div>
      </div>
      
      <div className="px-4 -mt-4">
        {showDeviceConnector && <DeviceShippingStatus onConnect={() => setShowDeviceConnector(false)} />}
      
        {/* Learn About GlucoVista section */}
        <LearnAboutGlucoVista />
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex flex-col items-center" onClick={() => {}}>
            <Home className="h-5 w-5 text-medical-primary" />
            <span className="text-xs mt-1">{translate('home')}</span>
          </Button>
        </div>
      </div>
    </div>;
};

export default HomePage;
