
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import SimulatedGlucometer from "@/components/SimulatedGlucometer";
import DeviceShippingStatus from "@/components/DeviceShippingStatus";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Progress } from "@/components/ui/progress";
import { 
  ActivitySquare, Award, Book, ChevronRight, 
  TrendingUp, LineChart, BarChart, Trophy, CalendarDays
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const formatDateTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });
};

const HomePage = () => {
  const { translate } = useLanguage();
  const { userData, checkAchievements, markAchievementAsSeen } = useUser();
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
    const unlockedAchievements = userData.achievements.filter(a => a.unlocked && !a.seen);
    const latestAchievement = unlockedAchievements[unlockedAchievements.length - 1];
    
    if (latestAchievement) {
      markAchievementAsSeen(latestAchievement.id);
      
      toast({
        title: translate('achievementUnlocked'),
        description: `${latestAchievement.icon} ${translate(latestAchievement.title)}`,
        variant: "default",
        duration: 5000,
      });
    }
  }, [userData.achievements, toast, translate, markAchievementAsSeen]);
  
  const renderEmptyReadingsState = () => (
    <div className="text-center py-6">
      <div className="text-gray-400 mb-3"><BarChart className="h-10 w-10 mx-auto" /></div>
      <p className="text-gray-700 font-medium">{translate('noReadingsYetTitle')}</p>
      <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">{translate('takeFirstMeasurement')}</p>
      <Button 
        className="mt-4 bg-accu-tech-blue hover:bg-accu-tech-blue/90 text-white"
        onClick={() => document.getElementById('measure-tab')?.click()}
      >
        {translate('startTracking')}
      </Button>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <div className="px-4 -mt-4 container mx-auto max-w-2xl">
        {showDeviceConnector && (
          <DeviceShippingStatus 
            onConnect={() => setShowDeviceConnector(false)}
          />
        )}
      
        <Tabs defaultValue="measure" className="w-full">
          <TabsList className="grid grid-cols-4 bg-white rounded-lg shadow-md mb-2">
            <TabsTrigger id="measure-tab" value="measure" className="py-2">
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
          
          {/* Progress summary above tabs - NEW */}
          {userData.glucoseReadings.length > 0 && (
            <div className="bg-white rounded-lg p-3 mb-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 text-accu-tech-blue mr-2" />
                  <span className="text-sm font-medium">{translate('yourDailyProgress')}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {userData.lastMeasurementDate === new Date().toDateString() 
                    ? translate('todayCompleted') 
                    : translate('needTodayReading')}
                </span>
              </div>
            </div>
          )}
          
          <TabsContent value="measure" className="mt-1">
            <SimulatedGlucometer />
            
            {userData.glucoseReadings.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium">{translate('recentReadings')}</h2>
                  <Button 
                    variant="ghost" 
                    className="text-xs text-accu-tech-blue"
                    onClick={() => navigate('/progress')}
                  >
                    {translate('viewAll')}
                  </Button>
                </div>
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {userData.glucoseReadings.slice(0, 3).map((reading, index) => (
                        <div key={index} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
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
          
          <TabsContent value="progress" className="mt-1">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardContent className="p-4">
                <h2 className="text-lg font-medium mb-4">{translate('yourProgress')}</h2>
                
                {userData.glucoseReadings.length === 0 ? (
                  renderEmptyReadingsState()
                ) : (
                  <>
                    <div className="h-40 bg-gray-100 rounded-lg mb-6 flex items-center justify-center relative">
                      <LineChart className="h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-500 ml-2">{translate('glucoseChart')}</p>
                      
                      {/* Fake chart overlay for visual appeal */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <svg width="90%" height="70%" viewBox="0 0 100 50">
                          <path 
                            d="M0,25 Q10,20 20,35 T40,15 T60,35 T80,5 T100,25" 
                            fill="none" 
                            stroke="#8B5CF6" 
                            strokeWidth="2"
                          />
                          <circle cx="20" cy="35" r="2" fill="#8B5CF6" />
                          <circle cx="40" cy="15" r="2" fill="#8B5CF6" />
                          <circle cx="60" cy="35" r="2" fill="#8B5CF6" />
                          <circle cx="80" cy="5" r="2" fill="#8B5CF6" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-accu-tech-lightest rounded-lg p-3 border border-accu-tech-light-blue">
                        <p className="text-sm text-accu-tech-blue mb-1">{translate('averageReading')}</p>
                        <p className="text-2xl font-bold">
                          {Math.round(userData.glucoseReadings.reduce((acc, r) => acc + r.value, 0) / userData.glucoseReadings.length)} 
                          <span className="text-xs text-gray-500 ml-1">{translate('mgdl')}</span>
                        </p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                        <p className="text-sm text-green-700 mb-1">{translate('inRangePercent')}</p>
                        <p className="text-2xl font-bold text-green-700">
                          {Math.round(userData.glucoseReadings.filter(r => r.inRange).length / userData.glucoseReadings.length * 100)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="text-sm text-gray-500">{translate('lowestReading')}</div>
                          <div className="font-medium">
                            {Math.min(...userData.glucoseReadings.map(r => r.value))}
                            <span className="text-xs text-gray-500 ml-1">{translate('mgdl')}</span>
                          </div>
                        </div>
                        <Progress value={Math.min(...userData.glucoseReadings.map(r => r.value)) / 400 * 100} className="h-1.5" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="text-sm text-gray-500">{translate('highestReading')}</div>
                          <div className="font-medium">
                            {Math.max(...userData.glucoseReadings.map(r => r.value))}
                            <span className="text-xs text-gray-500 ml-1">{translate('mgdl')}</span>
                          </div>
                        </div>
                        <Progress value={Math.max(...userData.glucoseReadings.map(r => r.value)) / 400 * 100} className="h-1.5" />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Personalized Goal Card - NEW */}
            {userData.goal && (
              <Card className="border-0 shadow-md overflow-hidden mt-4">
                <CardContent className="p-4">
                  <h2 className="text-lg font-medium mb-3">{translate('yourHealthGoal')}</h2>
                  <div className="bg-gradient-to-r from-accu-tech-lightest to-accu-tech-light-blue/20 p-3 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="bg-white rounded-full p-2 mt-1">
                        <Trophy className="h-5 w-5 text-accu-tech-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-accu-tech-blue">
                          {userData.goal === 'custom' 
                            ? userData.customGoal 
                            : translate(userData.goal || '')}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {translate('stayConsistentMessage')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="learn" className="mt-1">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardContent className="p-4">
                <h2 className="text-lg font-medium mb-4">{translate('learnAboutGlucoVista')}</h2>
                
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between py-6 px-4 border-accu-tech-light-blue hover:bg-accu-tech-lightest group"
                    onClick={() => navigate('/learn/how-it-works')}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-accu-tech-light-blue flex items-center justify-center mr-3 group-hover:bg-accu-tech-blue transition-colors">
                        <Book className="h-5 w-5 text-accu-tech-blue group-hover:text-white transition-colors" />
                      </div>
                      <div className="text-left">
                        <span className="font-medium block">{translate('howitworks')}</span>
                        <span className="text-xs text-gray-500">{translate('learnDeviceTechnology')}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-between py-6 px-4 border-accu-tech-light-orange hover:bg-accu-tech-light-orange/10 group"
                    onClick={() => navigate('/learn/benefits')}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-accu-tech-light-orange flex items-center justify-center mr-3 group-hover:bg-accu-tech-orange transition-colors">
                        <Award className="h-5 w-5 text-accu-tech-orange group-hover:text-white transition-colors" />
                      </div>
                      <div className="text-left">
                        <span className="font-medium block">{translate('benefits')}</span>
                        <span className="text-xs text-gray-500">{translate('improveYourHealth')}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-between py-6 px-4 border-green-100 hover:bg-green-50 group"
                    onClick={() => navigate('/learn/safety')}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-500 transition-colors">
                        <div className="h-5 w-5 text-green-600 group-hover:text-white transition-colors">✓</div>
                      </div>
                      <div className="text-left">
                        <span className="font-medium block">{translate('safety')}</span>
                        <span className="text-xs text-gray-500">{translate('safeAndReliable')}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="awards" className="mt-1">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">{translate('achievements')}</h2>
                  <div className="flex items-center space-x-1.5 bg-accu-tech-lightest px-2 py-1 rounded-lg">
                    <Trophy className="h-4 w-4 text-accu-tech-blue" />
                    <span className="text-sm font-medium text-accu-tech-blue">
                      {userData.achievements.filter(a => a.unlocked).length}/{userData.achievements.length}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {userData.achievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className={`border rounded-lg p-4 text-center ${
                        achievement.unlocked 
                          ? 'border-accu-tech-blue bg-accu-tech-lightest shadow-sm' 
                          : 'border-gray-200 bg-gray-50 opacity-70'
                      }`}
                    >
                      <div className={`text-3xl mb-2 ${achievement.unlocked ? 'animate-bounce-slow' : ''}`}>
                        {achievement.icon}
                      </div>
                      <div className={`text-sm font-medium ${achievement.unlocked ? 'text-accu-tech-blue' : 'text-gray-500'}`}>
                        {translate(achievement.title)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {translate(achievement.description)}
                      </div>
                      
                      {achievement.progress !== undefined && achievement.maxProgress && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className={achievement.unlocked ? 'text-accu-tech-blue' : 'text-gray-500'}>
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                            <span className={achievement.unlocked ? 'text-accu-tech-blue' : 'text-gray-500'}>
                              {Math.round((achievement.progress / achievement.maxProgress) * 100)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 rounded-full">
                            <div 
                              className="h-1.5 bg-accu-tech-blue rounded-full transition-all duration-500"
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            ></div>
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
      
      <Footer />
    </div>
  );
};

export default HomePage;
