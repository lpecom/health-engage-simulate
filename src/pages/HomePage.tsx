import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import SimulatedGlucometer from "@/components/SimulatedGlucometer";
import { 
  ActivitySquare, Award, Book, ChevronRight, History, 
  Home, TrendingUp, User, LineChart, BarChart, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const formatDateTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });
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
    const unlockedAchievements = userData.achievements.filter(a => a.unlocked);
    const latestAchievement = unlockedAchievements[unlockedAchievements.length - 1];
    
    if (latestAchievement && !localStorage.getItem(`shown_${latestAchievement.id}`)) {
      localStorage.setItem(`shown_${latestAchievement.id}`, 'true');
      
      toast({
        title: translate('achievementUnlocked'),
        description: `${latestAchievement.icon} ${translate(latestAchievement.title)}`,
        variant: "default",
        duration: 5000,
      });
    }
  }, [userData.achievements, toast, translate]);
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="gradient-medical text-white px-4 pt-12 pb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Accu-Tech Healthineers</h1>
            {userData.name && <p className="text-sm opacity-90">{translate('hello')}, {userData.name}</p>}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-white/10 hover:bg-white/20 rounded-full h-9 w-9"
              onClick={() => navigate('/profile')}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between space-x-2 mb-2">
          <Card className="flex-1 bg-white/10 border-none text-white shadow-none">
            <CardContent className="p-3 text-center">
              <p className="text-xs opacity-80">{translate('points')}</p>
              <p className="text-xl font-bold">{userData.points}</p>
            </CardContent>
          </Card>
          
          <Card className="flex-1 bg-white/10 border-none text-white shadow-none">
            <CardContent className="p-3 text-center">
              <p className="text-xs opacity-80">{translate('streak')}</p>
              <p className="text-xl font-bold">{userData.streak} {userData.streak > 0 && '🔥'}</p>
            </CardContent>
          </Card>
          
          <Card className="flex-1 bg-white/10 border-none text-white shadow-none">
            <CardContent className="p-3 text-center">
              <p className="text-xs opacity-80">{translate('readings')}</p>
              <p className="text-xl font-bold">{userData.glucoseReadings.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="px-4 -mt-4">
        {showDeviceConnector && (
          <Card className="mb-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <div className="animate-pulse flex flex-col items-center text-center px-6">
                <Loader2 className="h-10 w-10 text-medical-primary animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-medical-dark mb-2">{translate('deviceOnTheWay')}</h3>
                <p className="text-sm text-gray-600 max-w-xs">
                  {translate('yourDeviceIsBeingShipped')}
                </p>
                <div className="mt-6 w-full max-w-xs">
                  <Skeleton className="h-1.5 w-full mb-1 bg-medical-light" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{translate('ordered')}</span>
                    <span>{translate('shipping')}</span>
                    <span>{translate('delivered')}</span>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <h2 className="text-lg font-medium mb-4">{translate('connectYourDevice')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{translate('deviceSerialNumber')}</label>
                  <Input 
                    placeholder={translate('enterSerialNumber')} 
                    disabled
                  />
                </div>
                
                <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
                  <li>{translate('turnOnYourDevice')}</li>
                  <li>{translate('enableBluetooth')}</li>
                  <li>{translate('enterSerialAndConnect')}</li>
                </ol>
                
                <Button className="w-full" disabled>
                  {translate('connectDevice')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      
        <Tabs defaultValue="measure" className="w-full">
          <TabsList className="grid grid-cols-4 bg-white rounded-lg shadow-md">
            <TabsTrigger value="measure" className="py-2">
              <ActivitySquare className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="progress" className="py-2">
              <TrendingUp className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="learn" className="py-2">
              <Book className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="awards" className="py-2">
              <Award className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="measure" className="mt-4">
            <SimulatedGlucometer />
            
            {userData.glucoseReadings.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-medium mb-3">{translate('recentReadings')}</h2>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {userData.glucoseReadings.slice(0, 3).map((reading, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                          <div>
                            <p className="text-lg font-medium">
                              {reading.value} 
                              <span className="text-xs text-gray-500 ml-1">{translate('mgdl')}</span>
                            </p>
                            <p className="text-xs text-gray-500">{formatDateTime(reading.timestamp)}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            reading.inRange 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {reading.inRange ? translate('inRange') : translate('outOfRange')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="progress" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-medium mb-4">{translate('yourProgress')}</h2>
                
                {userData.glucoseReadings.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="text-gray-400 mb-2"><BarChart className="h-10 w-10 mx-auto" /></div>
                    <p className="text-gray-500">{translate('noReadingsYet')}</p>
                    <p className="text-sm text-gray-400">{translate('takeFirstMeasurement')}</p>
                  </div>
                ) : (
                  <>
                    <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <LineChart className="h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-500 ml-2">{translate('glucoseChart')}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-500">{translate('averageReading')}</div>
                        <div className="font-medium">
                          {Math.round(userData.glucoseReadings.reduce((acc, r) => acc + r.value, 0) / userData.glucoseReadings.length)} 
                          <span className="text-xs text-gray-500 ml-1">{translate('mgdl')}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-500">{translate('inRangePercent')}</div>
                        <div className="font-medium">
                          {Math.round(userData.glucoseReadings.filter(r => r.inRange).length / userData.glucoseReadings.length * 100)}%
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-500">{translate('lowestReading')}</div>
                        <div className="font-medium">
                          {Math.min(...userData.glucoseReadings.map(r => r.value))}
                          <span className="text-xs text-gray-500 ml-1">{translate('mgdl')}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-500">{translate('highestReading')}</div>
                        <div className="font-medium">
                          {Math.max(...userData.glucoseReadings.map(r => r.value))}
                          <span className="text-xs text-gray-500 ml-1">{translate('mgdl')}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="learn" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-medium mb-4">{translate('learnAboutGlucoVista')}</h2>
                
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between py-6 px-4"
                    onClick={() => navigate('/learn/how-it-works')}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-medical-light/50 flex items-center justify-center mr-3">
                        <History className="h-4 w-4 text-medical-dark" />
                      </div>
                      <span className="font-medium">{translate('howitworks')}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-between py-6 px-4"
                    onClick={() => navigate('/learn/benefits')}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-warm-light/50 flex items-center justify-center mr-3">
                        <Award className="h-4 w-4 text-warm-primary" />
                      </div>
                      <span className="font-medium">{translate('benefits')}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-between py-6 px-4"
                    onClick={() => navigate('/learn/safety')}
                  >
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
            </Card>
          </TabsContent>
          
          <TabsContent value="awards" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-medium mb-4">{translate('achievements')}</h2>
                
                <div className="grid grid-cols-2 gap-3">
                  {userData.achievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className={`border rounded-lg p-3 text-center ${
                        achievement.unlocked 
                          ? 'border-medical-primary bg-medical-light/10' 
                          : 'border-gray-200 bg-gray-50 opacity-70'
                      }`}
                    >
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <div className={`text-sm font-medium ${achievement.unlocked ? 'text-medical-dark' : 'text-gray-500'}`}>
                        {translate(achievement.title)}
                      </div>
                      
                      {achievement.progress !== undefined && achievement.maxProgress && (
                        <div className="mt-2">
                          <div className="h-1.5 w-full bg-gray-200 rounded-full">
                            <div 
                              className="h-1.5 bg-medical-primary rounded-full"
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {achievement.progress}/{achievement.maxProgress}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex flex-col items-center" onClick={() => {}}>
            <Home className="h-5 w-5 text-medical-primary" />
            <span className="text-xs mt-1">{translate('home')}</span>
          </Button>
          
          <Button variant="ghost" className="flex flex-col items-center" onClick={() => navigate('/profile')}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">{translate('profile')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
