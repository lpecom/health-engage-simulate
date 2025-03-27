
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { ChevronLeft, Award, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { translate } = useLanguage();
  const { userData, updateUserData } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState(userData.name);
  const [age, setAge] = useState(userData.age !== null ? userData.age.toString() : '');
  const [diabetesType, setDiabetesType] = useState<string | null>(userData.diabetesType);
  const [targetRange, setTargetRange] = useState([userData.targetRangeLow, userData.targetRangeHigh]);
  
  const saveProfile = () => {
    updateUserData({
      name,
      age: age ? parseInt(age) : null,
      diabetesType: diabetesType as any,
      targetRangeLow: targetRange[0],
      targetRangeHigh: targetRange[1]
    });
    
    toast({
      title: translate('profileUpdated'),
      duration: 3000,
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="gradient-medical text-white px-4 pt-12 pb-6">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 bg-white/10 hover:bg-white/20 rounded-full h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{translate('profile')}</h1>
        </div>
        
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            {name ? name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="ml-4">
            <p className="font-medium text-lg">{name || translate('guestUser')}</p>
            <div className="flex items-center text-sm opacity-80">
              <Award className="h-4 w-4 mr-1" />
              <span>{userData.points} {translate('points')}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 -mt-4">
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-4">{translate('personalInfo')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{translate('name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={translate('enterName')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{translate('age')}</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="30"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{translate('diabetesType')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {['type1', 'type2', 'prediabetes', 'gestational', 'other'].map((type) => (
                    <button
                      key={type}
                      className={`px-4 py-2 border rounded-md text-sm ${
                        diabetesType === type 
                          ? 'bg-medical-primary text-white border-medical-primary' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setDiabetesType(type)}
                    >
                      {translate(type)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-4">{translate('targetRange')}</h2>
            
            <div className="mb-8">
              <Slider
                value={targetRange}
                min={40}
                max={300}
                step={1}
                onValueChange={setTargetRange}
                className="my-6"
              />
              
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <div className="text-lg font-medium">{targetRange[0]}</div>
                  <div className="text-gray-500">{translate('low')}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xl font-medium text-green-600">
                    {Math.round((targetRange[0] + targetRange[1]) / 2)}
                  </div>
                  <div className="text-gray-500">{translate('target')}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-medium">{targetRange[1]}</div>
                  <div className="text-gray-500">{translate('high')}</div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 italic">
              {translate('targetRangeDescription')}
            </p>
          </CardContent>
        </Card>
        
        <Button className="w-full btn-primary" onClick={saveProfile}>
          <Save className="h-4 w-4 mr-2" />
          {translate('saveProfile')}
        </Button>
        
        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate('/language')}>
            {translate('changeLanguage')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
