
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AccuTechHeader from '@/components/AccuTechHeader';
import { ArrowRight } from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  
  const handleStartOnboarding = () => {
    navigate('/plan');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <AccuTechHeader />
      
      <div className="flex-1 container max-w-md mx-auto px-4 py-8 flex flex-col">
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
                src="https://accu-tech.pro/wp-content/uploads/2024/08/Accu-Tech-1.png" 
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
            className="w-full bg-accutech-teal hover:bg-accutech-teal/90 text-white text-lg py-6 flex items-center justify-center gap-2"
          >
            {translate('getStarted')}
            <ArrowRight className="h-5 w-5" />
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
