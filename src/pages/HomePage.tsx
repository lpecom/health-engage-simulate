import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import DeviceShippingStatus from "@/components/DeviceShippingStatus";
import { 
  ActivitySquare, Award, Book, ChevronRight, History, Home, 
  TrendingUp, LineChart, BarChart, Package, User, MapPin, Phone,
  CheckCircle, Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostRecentOrder, setMostRecentOrder] = useState<any>(null);

  useEffect(() => {
    if (!userData.onboarded) {
      navigate('/onboarding');
    }
  }, [userData.onboarded, navigate]);

  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  useEffect(() => {
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

  useEffect(() => {
    const fetchUserOrders = async () => {
      setLoading(true);
      try {
        let { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        if (data) {
          setUserOrders(data);
          if (data.length > 0) {
            setMostRecentOrder(data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserOrders();
  }, [userData.name]);

  const UserProfile = () => {
    if (!userData.name) return null;
    
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-lg font-medium mb-3">{translate('userProfile')}</h2>
          
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 mb-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">{userData.name}</p>
                {userData.diabetesType && (
                  <p className="text-xs text-blue-700">{translate(userData.diabetesType)}</p>
                )}
              </div>
            </div>
          </div>
          
          {userData.shippingInfo && (
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="text-gray-700">
                  <p>{userData.shippingInfo.address}</p>
                  <p>{userData.shippingInfo.postalCode}, {userData.shippingInfo.city}</p>
                  <p>{userData.shippingInfo.province}, {userData.shippingInfo.country}</p>
                </div>
              </div>
              
              {userData.shippingInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700">{userData.shippingInfo.phone}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const LearnAboutGlucoVista = () => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium mb-4">{translate('learnAboutGlucoVista')}</h2>
        
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-between py-6 px-4" 
            onClick={() => handleNavigation('/learn/how-it-works')}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                <History className="h-4 w-4 text-teal-600" />
              </div>
              <span className="font-medium">{translate('howItWorks')}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-between py-6 px-4" 
            onClick={() => handleNavigation('/learn/benefits')}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                <Award className="h-4 w-4 text-orange-500" />
              </div>
              <span className="font-medium">{translate('benefits')}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-between py-6 px-4" 
            onClick={() => handleNavigation('/learn/safety')}
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
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
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
        <DeviceShippingStatus 
          onConnect={() => setShowDeviceConnector(false)} 
          orderDetails={mostRecentOrder}
        />
        
        <UserProfile />
      
        <LearnAboutGlucoVista />
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex flex-col items-center">
            <Home className="h-5 w-5 text-medical-primary" />
            <span className="text-xs mt-1">{translate('home')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
