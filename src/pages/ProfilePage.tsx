
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { ChevronLeft, Award, Save, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

const ProfilePage = () => {
  const { translate } = useLanguage();
  const { userData, updateUserData } = useUser();
  const { toast: shadcnToast } = useToast();
  const navigate = useNavigate();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [name, setName] = useState(userData.name || '');
  const [age, setAge] = useState(userData.age !== null && userData.age !== undefined ? userData.age.toString() : '');
  const [weight, setWeight] = useState(userData.weight !== null && userData.weight !== undefined ? userData.weight.toString() : '');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer-not-to-say'>(
    (userData.gender as any) || 'prefer-not-to-say'
  );
  const [diabetesType, setDiabetesType] = useState<'type1' | 'type2' | 'prediabetes' | 'gestational' | 'other' | null>(
    userData.diabetesType || null
  );
  const [targetRange, setTargetRange] = useState([
    userData.targetRangeLow || 70,
    userData.targetRangeHigh || 180
  ]);
  const [exerciseFrequency, setExerciseFrequency] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'>(
    (userData.exerciseFrequency as any) || 'moderate'
  );
  const [dietType, setDietType] = useState<'regular' | 'low-carb' | 'low-fat' | 'vegetarian' | 'vegan' | 'other'>(
    (userData.dietType as any) || 'regular'
  );
  const [smoker, setSmoker] = useState(userData.smoker || false);
  const [goal, setGoal] = useState<'better-control' | 'lose-weight' | 'more-energy' | 'reduce-medication' | 'custom'>(
    (userData.goal as any) || 'better-control'
  );
  const [customGoal, setCustomGoal] = useState(userData.customGoal || '');
  const [weightUnit, setWeightUnit] = useState(userData.weightUnit || 'kg');
  
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    // Calculate profile completion percentage
    let fieldsCompleted = 0;
    const totalFields = 8; // Adjust based on number of important fields
    
    if (name) fieldsCompleted++;
    if (age) fieldsCompleted++;
    if (weight) fieldsCompleted++;
    if (gender) fieldsCompleted++;
    if (diabetesType) fieldsCompleted++;
    if (exerciseFrequency) fieldsCompleted++;
    if (dietType) fieldsCompleted++;
    if (goal) fieldsCompleted++;
    
    setProfileCompletion(Math.round((fieldsCompleted / totalFields) * 100));
  }, [name, age, weight, gender, diabetesType, exerciseFrequency, dietType, goal]);

  const sections = [
    'basicInfo',
    'healthInfo',
    'lifestyle',
    'goals'
  ];
  
  const saveProfile = () => {
    updateUserData({
      name,
      age: age ? parseInt(age) : null,
      weight: weight ? parseFloat(weight) : null,
      weightUnit,
      gender,
      diabetesType,
      targetRangeLow: targetRange[0],
      targetRangeHigh: targetRange[1],
      exerciseFrequency,
      dietType,
      smoker,
      goal,
      customGoal: goal === 'custom' ? customGoal : ''
    });
    
    toast(translate('profileUpdated'), {
      position: 'top-center',
      duration: 3000,
    });
    
    navigate('/home');
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderBasicInfo = () => (
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
        <label className="block text-sm font-medium text-gray-700 mb-1">{translate('gender')}</label>
        <div className="grid grid-cols-2 gap-2">
          {['male', 'female', 'other', 'prefer-not-to-say'].map((option) => (
            <button
              key={option}
              className={`px-4 py-2 border rounded-md text-sm ${
                gender === option 
                  ? 'bg-medical-primary text-white border-medical-primary' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setGender(option as 'male' | 'female' | 'other' | 'prefer-not-to-say')}
            >
              {translate(option)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHealthInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{translate('diabetesType')}</label>
        <div className="grid grid-cols-2 gap-2">
          {['type1', 'type2', 'prediabetes', 'gestational', 'other'].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 border rounded-md text-sm ${
                diabetesType === type 
                  ? 'bg-medical-primary text-white border-medical-primary' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setDiabetesType(type as 'type1' | 'type2' | 'prediabetes' | 'gestational' | 'other')}
            >
              {translate(type)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{translate('weight')}</label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary"
          />
          <div className="flex border rounded-md overflow-hidden">
            <button
              type="button"
              className={`px-3 py-2 text-sm ${weightUnit === 'kg' ? 'bg-medical-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setWeightUnit('kg')}
            >
              kg
            </button>
            <button
              type="button"
              className={`px-3 py-2 text-sm ${weightUnit === 'lb' ? 'bg-medical-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setWeightUnit('lb')}
            >
              lb
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">{translate('targetRange')}</label>
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
    </div>
  );

  const renderLifestyle = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{translate('exerciseFrequency')}</label>
        <div className="grid grid-cols-1 gap-2">
          {['sedentary', 'light', 'moderate', 'active', 'very-active'].map((level) => (
            <button
              key={level}
              className={`px-4 py-3 border rounded-md text-sm text-left ${
                exerciseFrequency === level 
                  ? 'bg-medical-primary text-white border-medical-primary' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setExerciseFrequency(level as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active')}
            >
              {translate(level)}
              <span className="block text-xs mt-1 opacity-80">{translate(`${level}Desc`)}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{translate('dietType')}</label>
        <div className="grid grid-cols-2 gap-2">
          {['regular', 'low-carb', 'low-fat', 'vegetarian', 'vegan', 'other'].map((diet) => (
            <button
              key={diet}
              className={`px-4 py-2 border rounded-md text-sm ${
                dietType === diet 
                  ? 'bg-medical-primary text-white border-medical-primary' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setDietType(diet as 'regular' | 'low-carb' | 'low-fat' | 'vegetarian' | 'vegan' | 'other')}
            >
              {translate(diet)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 py-2">
        <Checkbox 
          id="smoker" 
          checked={smoker} 
          onCheckedChange={(checked) => setSmoker(checked as boolean)}
        />
        <label
          htmlFor="smoker"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {translate('smoker')}
        </label>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{translate('primaryGoal')}</label>
      <div className="grid grid-cols-1 gap-2">
        {['better-control', 'lose-weight', 'more-energy', 'reduce-medication', 'custom'].map((goalOption) => (
          <button
            key={goalOption}
            className={`px-4 py-3 border rounded-md text-sm text-left ${
              goal === goalOption 
                ? 'bg-medical-primary text-white border-medical-primary' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setGoal(goalOption as 'better-control' | 'lose-weight' | 'more-energy' | 'reduce-medication' | 'custom')}
          >
            {translate(goalOption)}
            <span className="block text-xs mt-1 opacity-80">{translate(`${goalOption}Desc`)}</span>
          </button>
        ))}
      </div>
      
      {goal === 'custom' && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{translate('customGoal')}</label>
          <textarea
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder={translate('customGoalPlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary"
            rows={3}
          />
        </div>
      )}
      
      <div className="mt-6 bg-blue-50 rounded-lg p-4 text-sm">
        <p className="text-gray-600 italic">{translate('privacyNote')}</p>
      </div>
    </div>
  );
  
  const renderSection = () => {
    const section = sections[currentSection];
    
    switch (section) {
      case 'basicInfo':
        return renderBasicInfo();
      case 'healthInfo':
        return renderHealthInfo();
      case 'lifestyle':
        return renderLifestyle();
      case 'goals':
        return renderGoals();
      default:
        return null;
    }
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
        {/* Profile completion indicator */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">{translate('profileCompletion')}</h3>
              <span className="text-sm text-gray-500">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2" />
          </CardContent>
        </Card>
        
        {/* Section progress indicator */}
        <div className="flex justify-between mb-4">
          {sections.map((section, index) => (
            <div 
              key={section}
              className={`h-1.5 flex-1 mx-0.5 rounded-full ${
                index === currentSection ? 'bg-medical-primary' : 
                index < currentSection ? 'bg-gray-300' : 'bg-gray-200'
              }`}
            ></div>
          ))}
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-4">{translate(sections[currentSection])}</h2>
            {renderSection()}
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          {currentSection > 0 ? (
            <Button onClick={prevSection} variant="outline" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {translate('back')}
            </Button>
          ) : (
            <div></div>
          )}
          
          {currentSection < sections.length - 1 ? (
            <Button onClick={nextSection} className="flex items-center">
              {translate('next')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={saveProfile} className="btn-primary flex items-center">
              <Save className="h-4 w-4 mr-2" />
              {translate('saveProfile')}
            </Button>
          )}
        </div>
        
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
