
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import LanguageSelector from "@/components/LanguageSelector";
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Syringe, CircleCheck, ShieldCheck } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const OnboardingSteps = ['language', 'purchase', 'welcome', 'technology', 'benefits', 'profile', 'tutorial'];

const productOfferings = [
  { 
    id: 1, 
    quantity: 1, 
    price: 199.99, 
    discount: 0,
    image: "https://h00ktt-1h.myshopify.com/cdn/shop/files/gempages_559218299439678285-292f3a7c-297f-4208-b019-985346c4ef7b.jpg?v=10467499079061507992" 
  },
  { 
    id: 2, 
    quantity: 2, 
    price: 399.98, 
    discount: 10,
    image: "https://h00ktt-1h.myshopify.com/cdn/shop/files/gempages_559218299439678285-48536be6-1e97-4f93-beec-f90b62a0a0b5.jpg?v=4986797994953195968" 
  },
  { 
    id: 3, 
    quantity: 3, 
    price: 599.97, 
    discount: 20,
    image: "https://h00ktt-1h.myshopify.com/cdn/shop/files/gempages_559218299439678285-9bda3efb-a7a6-4d37-9d5c-e9d0fd0bfb62.jpg?v=8693849955267883844" 
  },
  { 
    id: 4, 
    quantity: 4, 
    price: 799.96, 
    discount: 25,
    image: "https://h00ktt-1h.myshopify.com/cdn/shop/files/gempages_559218299439678285-9bda3efb-a7a6-4d37-9d5c-e9d0fd0bfb62.jpg?v=8693849955267883844" 
  }
];

const OnboardingPage = () => {
  const { translate } = useLanguage();
  const { userData, updateUserData } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [diabetesType, setDiabetesType] = useState<string | null>(null);
  const [selectedOffering, setSelectedOffering] = useState(productOfferings[0]);

  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = sessionStorage.getItem('onboardingStep');
    if (savedStep) {
      // Clear the session storage after getting the step
      sessionStorage.removeItem('onboardingStep');
      return parseInt(savedStep);
    }
    return 0;
  });

  const goToNextStep = () => {
    if (currentStep < OnboardingSteps.length - 1) {
      if (currentStep === 1) {
        sessionStorage.setItem('selectedOffering', JSON.stringify(selectedOffering));
        navigate('/checkout');
      } else {
        setCurrentStep(currentStep + 1);
      }
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

  useEffect(() => {
    const fromCheckout = sessionStorage.getItem('fromCheckout');
    if (fromCheckout === 'true' && currentStep === 1) {
      setCurrentStep(2);
      sessionStorage.removeItem('fromCheckout');
    }
  }, [currentStep]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleProductSelect = (offering) => {
    setSelectedOffering(offering);
  };

  const progressPercentage = (currentStep + 1) / OnboardingSteps.length * 100;

  const renderStep = () => {
    const currentStepName = OnboardingSteps[currentStep];

    switch (currentStepName) {
      case 'language':
        return <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-accu-tech-blue">Accu-Tech Healthineers</h1>
            <p className="text-gray-600 mb-6">{translate('welcomeToApp')}</p>
            <LanguageSelector />
          </div>;

      case 'purchase':
        return <div className="text-center">
            <h1 className="text-2xl font-bold mb-3 text-accu-tech-blue">{translate('purchaseDevice')}</h1>
            <p className="text-gray-600 mb-4">{translate('selectOfferDescription')}</p>
            
            <div className="space-y-3 mb-5">
              {productOfferings.map((offering) => {
                const offeringPrice = offering.price;
                const offeringDiscount = offeringPrice * (offering.discount / 100);
                const finalPrice = offeringPrice - offeringDiscount;
                
                return (
                  <div 
                    key={offering.id}
                    onClick={() => handleProductSelect(offering)}
                    className={`border rounded-lg overflow-hidden transition-all cursor-pointer hover:shadow-md ${
                      selectedOffering.id === offering.id 
                        ? 'border-accu-tech-blue bg-accu-tech-lightest' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center p-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        selectedOffering.id === offering.id 
                          ? 'bg-accu-tech-blue text-white' 
                          : 'border border-gray-300'
                      }`}>
                        {selectedOffering.id === offering.id && <Check className="h-3 w-3" />}
                      </div>
                      
                      <div className="flex-1 flex items-center">
                        <img 
                          src={offering.image} 
                          alt={`${offering.quantity} ${translate('deviceName')}`}
                          className="w-16 h-16 object-contain mr-3"
                        />
                        
                        <div className="flex-1 text-left mr-3">
                          <div className="font-medium">
                            {offering.quantity} {offering.quantity === 1 ? translate('unit') : translate('units')}
                          </div>
                          {offering.discount > 0 && (
                            <div className="text-sm text-green-700">
                              {offering.discount}% {translate('discount')}
                            </div>
                          )}
                          {offering.id === 4 && (
                            <span className="inline-block text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full mt-1">
                              {translate('buy3get1')}
                            </span>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(finalPrice)}</div>
                          {offering.discount > 0 && (
                            <div className="text-xs text-gray-500 line-through">{formatCurrency(offeringPrice)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-accu-tech-lightest p-4 rounded-lg mb-4 flex items-center">
              <ShieldCheck className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                {translate('moneyBackGuarantee')}
              </p>
            </div>
            
            <div className="text-center mb-3">
              <p className="text-sm text-gray-500">
                {translate('installments', {
                  count: 12, 
                  value: formatCurrency(selectedOffering.price / 12)
                })}
              </p>
            </div>
          </div>;

      case 'welcome':
        return <div className="text-center">
            <div className="mb-6 flex justify-center">
              <img 
                src="https://h00ktt-1h.myshopify.com/cdn/shop/files/gempages_559218299439678285-292f3a7c-297f-4208-b019-985346c4ef7b.jpg?v=10467499079061507992" 
                alt="Accu-Tech Laser Glucometer" 
                className="w-64 h-auto object-contain rounded-lg shadow-md" 
              />
            </div>
            
            <div className="w-20 h-20 rounded-full bg-accu-tech-light-blue flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-accu-tech-blue" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-accu-tech-blue">{translate('welcomeHeading')}</h1>
            <p className="text-gray-600 mb-6">{translate('thankYouMessage')}</p>
            
            <div className="bg-accu-tech-lightest rounded-lg p-4 mb-4">
              <p className="text-center italic">"{translate('userTestimonial')}"</p>
              <p className="text-right text-sm mt-2">- {translate('testimonialAuthor')}</p>
            </div>
            
            <p className="text-sm text-gray-500">{translate('deviceArrivalMessage')}</p>
          </div>;

      case 'technology':
        return <div className="text-center">
            <h1 className="text-2xl font-bold mb-3 text-accu-tech-blue">{translate('howItWorks')}</h1>
            <p className="text-gray-600 mb-6">{translate('laserTechnologyIntro')}</p>
            
            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-accu-tech-blue to-accu-tech-dark-blue p-0.5 mb-6">
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 bg-accu-tech-light-blue rounded-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-accu-tech-blue rounded-full flex items-center justify-center">
                      <div className="w-2 h-12 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-accu-tech-light-blue rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="font-bold text-accu-tech-blue">1</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">{translate('laserEmissionTitle')}</h3>
                      <p className="text-sm text-gray-500">{translate('laserEmissionDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-accu-tech-light-blue rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="font-bold text-accu-tech-blue">2</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">{translate('bloodlessAnalysisTitle')}</h3>
                      <p className="text-sm text-gray-500">{translate('bloodlessAnalysisDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-accu-tech-light-blue rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="font-bold text-accu-tech-blue">3</span>
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
            <h1 className="text-2xl font-bold mb-3 text-accu-tech-blue">{translate('keyBenefits')}</h1>
            <p className="text-gray-600 mb-6">{translate('benefitsIntro')}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-accu-tech-lightest p-4 rounded-lg flex flex-col items-center hover:bg-accu-tech-light-blue transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <Syringe className="text-accu-tech-blue" size={24} />
                </div>
                <h3 className="font-medium text-sm">{translate('noPainTitle')}</h3>
                <p className="text-xs text-gray-500 mt-1">{translate('noPainDesc')}</p>
              </div>
              
              <div className="bg-accu-tech-lightest p-4 rounded-lg flex flex-col items-center hover:bg-accu-tech-light-blue transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <ArrowRight className="text-accu-tech-blue" size={24} />
                </div>
                <h3 className="font-medium text-sm">{translate('instantResultsTitle')}</h3>
                <p className="text-xs text-gray-500 mt-1">{translate('instantResultsDesc')}</p>
              </div>
              
              <div className="bg-accu-tech-lightest p-4 rounded-lg flex flex-col items-center hover:bg-accu-tech-light-blue transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <CircleCheck className="text-accu-tech-blue" size={24} />
                </div>
                <h3 className="font-medium text-sm">{translate('expertApprovedTitle')}</h3>
                <p className="text-xs text-gray-500 mt-1">{translate('expertApprovedDesc')}</p>
              </div>
              
              <div className="bg-accu-tech-lightest p-4 rounded-lg flex flex-col items-center hover:bg-accu-tech-light-blue transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <Check className="text-accu-tech-blue" size={24} />
                </div>
                <h3 className="font-medium text-sm">{translate('accurateTitle')}</h3>
                <p className="text-xs text-gray-500 mt-1">{translate('accurateDesc')}</p>
              </div>
            </div>
            
            <div className="mt-6 mb-4 flex justify-center">
              <img 
                src="https://h00ktt-1h.myshopify.com/cdn/shop/files/gempages_559218299439678285-292f3a7c-297f-4208-b019-985346c4ef7b.jpg?v=10467499079061507992" 
                alt="GlucoVista Laser Glucometer" 
                className="w-64 h-auto object-contain rounded-lg shadow-md" 
              />
            </div>
            <p className="text-sm font-medium text-center">{translate('yourNewGlucometer')}</p>
          </div>;

      case 'profile':
        return <div>
            <h1 className="text-2xl font-bold mb-3 text-center text-accu-tech-blue">{translate('setupProfile')}</h1>
            <p className="text-gray-600 mb-6 text-center">{translate('profileSetupIntro')}</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{translate('name')}</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={translate('enterName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accu-tech-blue" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{translate('age')}</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="30" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accu-tech-blue" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{translate('diabetesType')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {['type1', 'type2', 'prediabetes', 'gestational', 'other'].map(type => <button key={type} className={`px-4 py-2 border rounded-md text-sm ${diabetesType === type ? 'bg-accu-tech-blue text-white border-accu-tech-blue' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`} onClick={() => setDiabetesType(type)}>
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
            <h1 className="text-2xl font-bold mb-2 text-accu-tech-blue">{translate('readyToStart')}</h1>
            <p className="text-gray-600 mb-6">{translate('tutorialDescription')}</p>
            
            <div className="bg-accu-tech-lightest rounded-lg p-4 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-accu-tech-blue rounded-full flex items-center justify-center text-white font-bold">1</div>
                <div className="ml-4 text-left">
                  <h3 className="font-medium">{translate('measureGlucose')}</h3>
                  <p className="text-sm text-gray-500">{translate('measureGlucoseDescription')}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-accu-tech-blue rounded-full flex items-center justify-center text-white font-bold">2</div>
                <div className="ml-4 text-left">
                  <h3 className="font-medium">{translate('trackProgress')}</h3>
                  <p className="text-sm text-gray-500">{translate('trackProgressDescription')}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accu-tech-blue rounded-full flex items-center justify-center text-white font-bold">3</div>
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
        <div className="flex items-center justify-between mb-4">
          <img 
            src="https://accu-tech.pro/wp-content/uploads/2024/08/Accu-Tech-1.png" 
            alt="Accu-Tech Logo" 
            className="h-8" 
          />
          <div className="text-xs text-gray-500 text-right">
            {translate('step')} {currentStep + 1}/{OnboardingSteps.length}
          </div>
        </div>
        
        <div className="mb-6">
          <Progress value={progressPercentage} className="h-2 bg-accu-tech-lightest" />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-500">{Math.round(progressPercentage)}% {translate('complete')}</span>
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
            
            <Button className="buy-button" onClick={goToNextStep}>
              {currentStep === 1 ? translate('proceedToPayment') : 
               currentStep === OnboardingSteps.length - 1 ? translate('getStarted') : 
               translate('next')}
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center mt-6 space-x-1">
          {OnboardingSteps.map((_, index) => <div key={index} className={`h-1.5 rounded-full ${index === currentStep ? 'w-6 bg-accu-tech-blue' : 'w-2 bg-gray-300'}`}></div>)}
        </div>
      </div>
    </div>;
};

export default OnboardingPage;
