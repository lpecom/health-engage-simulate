import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import LanguageSelector from "@/components/LanguageSelector";
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Syringe, CircleCheck } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
const OnboardingSteps = ['language', 'welcome', 'technology', 'benefits', 'profile', 'tutorial'];
const OnboardingPage = () => {
  const {
    translate
  } = useLanguage();
  const {
    userData,
    updateUserData
  } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [diabetesType, setDiabetesType] = useState<string | null>(null);
  const goToNextStep = () => {
    if (currentStep < OnboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const completeOnboarding = () => {
    updateUserData({
      onboarded: true,
      name: name || userData.name,
      age: age ? parseInt(age) : userData.age,
      diabetesType: diabetesType as any || userData.diabetesType
    });
    navigate('/home');
  };
  const skipOnboarding = () => {
    updateUserData({
      onboarded: true
    });
    navigate('/home');
  };
  const progressPercentage = (currentStep + 1) / OnboardingSteps.length * 100;
  const renderStep = () => {
    const currentStepName = OnboardingSteps[currentStep];
    switch (currentStepName) {
      case 'language':
        return <div className="text-center">
            <div className="flex justify-center mb-4">
              <img src="https://accu-tech.pro/wp-content/uploads/2024/08/Accu-Tech-1.png" alt="Accu-Tech Logo" className="h-16 mb-4" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-accu-tech-blue">GlucoVista</h1>
            <p className="text-gray-600 mb-6">{translate('welcomeToApp')}</p>
            <LanguageSelector />
          </div>;
      case 'welcome':
        return <div className="text-center">
            <div className="flex justify-center mb-4">
              <img src="https://accu-tech.pro/wp-content/uploads/2024/08/Accu-Tech-1.png" alt="Accu-Tech Logo" className="h-16 mb-4 object-scale-down" />
            </div>
            <div className="w-20 h-20 rounded-full bg-accu-tech-light flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-accu-tech-blue" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-accu-tech-blue">{translate('welcome')}</h1>
            <p className="text-gray-600 mb-6">{translate('thankYouMessage')}</p>
            
            <div className="bg-accu-tech-lightest rounded-lg p-4 mb-4">
              <p className="text-center italic">"{translate('userTestimonial')}"</p>
              <p className="text-right text-sm mt-2">- {translate('testimonialAuthor')}</p>
            </div>
            
            <p className="text-sm text-gray-500">{translate('deviceArrivalMessage')}</p>
          </div>;
      case 'technology':
        return <div className="text-center">
            <h1 className="text-2xl font-bold mb-3">{translate('howItWorks')}</h1>
            <p className="text-gray-600 mb-6">{translate('laserTechnologyIntro')}</p>
            
            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-medical-primary to-medical-dark p-0.5 mb-6">
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 bg-medical-light rounded-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-medical-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-12 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="font-bold text-medical-primary">1</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">{translate('laserEmissionTitle')}</h3>
                      <p className="text-sm text-gray-500">{translate('laserEmissionDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="font-bold text-medical-primary">2</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">{translate('bloodlessAnalysisTitle')}</h3>
                      <p className="text-sm text-gray-500">{translate('bloodlessAnalysisDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="font-bold text-medical-primary">3</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">{translate('instantReadingTitle')}</h3>
                      <p className="text-sm text-gray-500">{translate('instantReadingDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 italic">{translate('scientificallyProven')}</p>
          </div>;
      case 'benefits':
        return <div className="text-center">
            <h1 className="text-2xl font-bold mb-3">{translate('keyBenefits')}</h1>
            <p className="text-gray-600 mb-6">{translate('benefitsIntro')}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center hover:bg-blue-100 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <Syringe className="text-medical-primary" size={24} />
                </div>
                <h3 className="font-medium text-sm">{translate('noPainTitle')}</h3>
                <p className="text-xs text-gray-500 mt-1">{translate('noPainDesc')}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center hover:bg-blue-100 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <ArrowRight className="text-medical-primary" size={24} />
                </div>
                <h3 className="font-medium text-sm">{translate('instantResultsTitle')}</h3>
                <p className="text-xs text-gray-500 mt-1">{translate('instantResultsDesc')}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center hover:bg-blue-100 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <CircleCheck className="text-medical-primary" size={24} />
                </div>
                <h3 className="font-medium text-sm">{translate('expertApprovedTitle')}</h3>
                <p className="text-xs text-gray-500 mt-1">{translate('expertApprovedDesc')}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center hover:bg-blue-100 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <Check className="text-medical-primary" size={24} />
                </div>
                <h3 className="font-medium text-sm">{translate('accurateTitle')}</h3>
                <p className="text-xs text-gray-500 mt-1">{translate('accurateDesc')}</p>
              </div>
            </div>
            
            <div className="mt-6 mb-4 flex justify-center">
              <img src="/placeholder.svg" alt="GlucoVista Laser Glucometer" className="w-48 h-48 object-contain" />
            </div>
            <p className="text-sm font-medium text-center">{translate('yourNewGlucometer')}</p>
          </div>;
      case 'profile':
        return <div>
            <h1 className="text-2xl font-bold mb-3 text-center">{translate('setupProfile')}</h1>
            <p className="text-gray-600 mb-6 text-center">{translate('profileSetupIntro')}</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{translate('name')}</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={translate('enterName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{translate('age')}</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="30" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{translate('diabetesType')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {['type1', 'type2', 'prediabetes', 'gestational', 'other'].map(type => <button key={type} className={`px-4 py-2 border rounded-md text-sm ${diabetesType === type ? 'bg-medical-primary text-white border-medical-primary' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`} onClick={() => setDiabetesType(type)}>
                      {translate(type)}
                    </button>)}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 italic mb-6">
              {translate('profilePrivacyMessage')}
            </p>
          </div>;
      case 'tutorial':
        return <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">{translate('readyToStart')}</h1>
            <p className="text-gray-600 mb-6">{translate('tutorialDescription')}</p>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-medical-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
                <div className="ml-4 text-left">
                  <h3 className="font-medium">{translate('measureGlucose')}</h3>
                  <p className="text-sm text-gray-500">{translate('measureGlucoseDescription')}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-medical-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
                <div className="ml-4 text-left">
                  <h3 className="font-medium">{translate('trackProgress')}</h3>
                  <p className="text-sm text-gray-500">{translate('trackProgressDescription')}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-medical-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
                <div className="ml-4 text-left">
                  <h3 className="font-medium">{translate('earnAchievements')}</h3>
                  <p className="text-sm text-gray-500">{translate('earnAchievementsDescription')}</p>
                </div>
              </div>
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-gradient-to-b from-white to-accu-tech-lightest px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{translate('step')} {currentStep + 1}/{OnboardingSteps.length}</span>
            <span>{Math.round(progressPercentage)}% {translate('complete')}</span>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} transition={{
          duration: 0.3
        }} className="bg-white rounded-xl shadow-lg p-6 mb-8">
            {renderStep()}
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-between">
          {currentStep > 0 ? <Button variant="outline" onClick={goToPreviousStep}>
              {translate('back')}
            </Button> : <div></div>}
          
          <div className="flex space-x-2">
            {currentStep < OnboardingSteps.length - 1 && <Button variant="ghost" onClick={skipOnboarding}>
                {translate('skip')}
              </Button>}
            
            <Button className="accu-tech-gradient text-white" onClick={goToNextStep}>
              {currentStep === OnboardingSteps.length - 1 ? translate('getStarted') : translate('next')}
            </Button>
          </div>
        </div>
        
        {/* Step indicator */}
        <div className="flex justify-center mt-6 space-x-1">
          {OnboardingSteps.map((_, index) => <div key={index} className={`h-1.5 rounded-full ${index === currentStep ? 'w-6 bg-accu-tech-blue' : 'w-2 bg-gray-300'}`}></div>)}
        </div>
      </div>
    </div>;
};
export default OnboardingPage;