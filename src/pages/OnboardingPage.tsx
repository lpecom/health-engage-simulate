
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AccuTechHeader from '@/components/AccuTechHeader';
import LanguageSelector from '@/components/LanguageSelector';

const OnboardingPage: React.FC = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  
  const handleStartOnboarding = () => {
    navigate('/language');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <AccuTechHeader />
      
      <div className="flex-1 container max-w-md mx-auto px-4 py-8 flex flex-col">
        <div className="mb-6 flex justify-end">
          <LanguageSelector />
        </div>
        
        <Card className="shadow-lg border-accutech-teal/20 mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-accutech-dark">
              {translate('welcomeToAccuTech')}
            </CardTitle>
            <CardDescription>
              {translate('yourPersonalGlucoseMonitor')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center my-8">
              <img 
                src="/lovable-uploads/876ba7b6-a6f5-4c1d-91fc-848c85d435bf.png" 
                alt="Accu-Tech Device" 
                className="w-full max-w-[280px]"
              />
            </div>
            
            <div className="space-y-4 text-center">
              <h3 className="font-medium text-lg">
                {translate('getStartedWithAccuTech')}
              </h3>
              <p className="text-muted-foreground">
                {translate('setupYourProfileForPersonalizedExperience')}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-auto pt-4">
          <Button 
            onClick={handleStartOnboarding} 
            className="w-full btn-primary text-lg py-6"
          >
            {translate('getStarted')}
          </Button>
          
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {translate('byProceedingYouAgreeToOur')}{' '}
            <a href="#" className="text-accutech-blue underline">
              {translate('termsOfService')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
