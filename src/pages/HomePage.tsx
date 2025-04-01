
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import DeviceShippingStatus from "@/components/DeviceShippingStatus";
import { ActivitySquare, Award, Book, ChevronRight, History, Home, TrendingUp, User, LineChart, BarChart, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TranslatedText from "@/components/TranslatedText";

const formatDateTime = (timestamp: number, currentLanguage: string) => {
  return new Date(timestamp).toLocaleString(
    currentLanguage === 'es' ? 'es-ES' : 
    currentLanguage === 'pt' ? 'pt-BR' : 'en-US', 
    {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  );
};

const HomePage = () => {
  const { translate, language } = useLanguage();
  const { userData, checkAchievements } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showDeviceConnector, setShowDeviceConnector] = useState(true);

  useEffect(() => {
    if (!userData.onboarded) {
      navigate('/onboarding');
    }
    checkAchievements();
  }, [userData.onboarded, navigate, checkAchievements]);

  useEffect(() => {
    // Update document title whenever language changes
    document.title = translate('appName');
    
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
  }, [userData.achievements, toast, translate, language]);

  // Learn About GlucoVista Component
  const LearnAboutGlucoVista = () => <Card className="mb-4">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium mb-4">
          <TranslatedText textKey="learnAboutGlucoVista" />
        </h2>
        
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-between py-6 px-4" onClick={() => navigate('/learn/how-it-works')}>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-medical-light/50 flex items-center justify-center mr-3">
                <History className="h-4 w-4 text-medical-dark" />
              </div>
              <span className="font-medium"><TranslatedText textKey="howitworks" /></span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Button>
          
          <Button variant="outline" className="w-full justify-between py-6 px-4" onClick={() => navigate('/learn/benefits')}>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-warm-light/50 flex items-center justify-center mr-3">
                <Award className="h-4 w-4 text-warm-primary" />
              </div>
              <span className="font-medium"><TranslatedText textKey="benefits" /></span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Button>
          
          <Button variant="outline" className="w-full justify-between py-6 px-4" onClick={() => navigate('/learn/safety')}>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <div className="h-4 w-4 text-green-600">✓</div>
              </div>
              <span className="font-medium"><TranslatedText textKey="safety" /></span>
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
          <h1 className="text-xl font-bold">
            <TranslatedText textKey="appName" fallback="Healthineers" />
          </h1>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            {userData.name && (
              <p className="text-sm opacity-90">
                <TranslatedText textKey="hello" />, {userData.name}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 rounded-full h-9 w-9" onClick={() => navigate('/profile')}>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between space-x-2 mb-2">
          <Card className="flex-1 bg-white/10 border-none text-white shadow-none">
            <CardContent className="p-3 text-center">
              <p className="text-xs opacity-80"><TranslatedText textKey="points" /></p>
              <p className="text-xl font-bold">{userData.points}</p>
            </CardContent>
          </Card>
          
          <Card className="flex-1 bg-white/10 border-none text-white shadow-none">
            <CardContent className="p-3 text-center">
              <p className="text-xs opacity-80"><TranslatedText textKey="streak" /></p>
              <p className="text-xl font-bold">{userData.streak} {userData.streak > 0 && '🔥'}</p>
            </CardContent>
          </Card>
          
          <Card className="flex-1 bg-white/10 border-none text-white shadow-none">
            <CardContent className="p-3 text-center">
              <p className="text-xs opacity-80"><TranslatedText textKey="readings" /></p>
              <p className="text-xl font-bold">{userData.glucoseReadings.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="px-4 -mt-4">
        {showDeviceConnector && <DeviceShippingStatus onConnect={() => setShowDeviceConnector(false)} />}
        
        {/* Buy Device Button */}
        <Card className="mb-4 mt-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/dfc13871-35f5-4edb-9b1e-7851ddce07ac.png" 
                alt="Accu-Tech Device" 
                className="w-20 h-20 object-contain" 
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Accu-Tech 1</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <TranslatedText textKey="deviceDescription" />
                </p>
                <div className="flex items-center">
                  <span className="font-bold text-xl mr-2">€45.03</span>
                  <span className="text-gray-500 line-through text-sm">€75.80</span>
                  <span className="ml-2 px-2 py-0.5 bg-accu-tech-light-blue text-accu-tech-blue rounded-full text-xs font-medium">30% OFF</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/checkout')}
              className="w-full mt-4 bg-accu-tech-blue hover:bg-accu-tech-dark-blue rounded-full"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              <TranslatedText textKey="buyNow" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Learn About GlucoVista section */}
        <LearnAboutGlucoVista />
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex flex-col items-center" onClick={() => {}}>
            <Home className="h-5 w-5 text-medical-primary" />
            <span className="text-xs mt-1"><TranslatedText textKey="home" /></span>
          </Button>
          
          <Button variant="ghost" className="flex flex-col items-center" onClick={() => navigate('/profile')}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1"><TranslatedText textKey="profile" /></span>
          </Button>
        </div>
      </div>
    </div>;
};

export default HomePage;
