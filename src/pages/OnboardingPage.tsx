import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useShopify } from "@/contexts/ShopifyContext"; 
import LanguageSelector from "@/components/LanguageSelector";
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Syringe, CircleCheck, MapPin, CreditCard, AlertTriangle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES, getDefaultCountryByLanguage, getRegionLabel, getRegionsForCountry } from '@/data/countries';
import { Badge } from "@/components/ui/badge";

const OnboardingSteps = [
  'language', 
  'welcome', 
  'technology', 
  'benefits', 
  'profile', 
  'purchase',
  'tutorial'
];

const OnboardingPage = () => {
  const { translate, language } = useLanguage();
  const { userData, updateUserData } = useUser();
  const { isConfigured, exportOrder } = useShopify();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [diabetesType, setDiabetesType] = useState<string | null>(null);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(getDefaultCountryByLanguage(language));
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  useEffect(() => {
    const defaultCountry = getDefaultCountryByLanguage(language);
    setSelectedCountry(defaultCountry);
    
    setProvince('');
    setCity('');
  }, [language]);
  
  useEffect(() => {
    if (selectedCountry && province) {
      const countryData = COUNTRIES[selectedCountry];
      if (countryData) {
        const selectedRegion = countryData.regions.find(r => r.code === province);
        if (selectedRegion && selectedRegion.cities) {
          setAvailableCities(selectedRegion.cities);
        } else {
          setAvailableCities([]);
        }
      }
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry, province]);

  const validatePhone = (phoneNumber: string, country: string): boolean => {
    if (!country || !COUNTRIES[country]) return false;
    
    return COUNTRIES[country].phoneRegex.test(phoneNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    
    if (value && selectedCountry && COUNTRIES[selectedCountry]) {
      const formattedValue = COUNTRIES[selectedCountry].formatPhoneNumber(value);
      setFormattedPhone(formattedValue);
      
      if (!validatePhone(formattedValue, selectedCountry)) {
        setPhoneError(translate('invalidPhone'));
      } else {
        setPhoneError(null);
      }
    } else {
      setPhoneError(null);
    }
  };

  useEffect(() => {
    if (phone && selectedCountry && COUNTRIES[selectedCountry]) {
      const formatted = COUNTRIES[selectedCountry].formatPhoneNumber(phone);
      setFormattedPhone(formatted);
    }
  }, [phone, selectedCountry]);

  useEffect(() => {
    if (phone && selectedCountry && COUNTRIES[selectedCountry]) {
      const formatted = COUNTRIES[selectedCountry].formatPhoneNumber(phone);
      setFormattedPhone(formatted);
    }
  }, [selectedCountry]);

  const goToNextStep = async () => {
    if (currentStep === 5) { // Purchase step
      await handlePurchase();
      return;
    }

    if (currentStep < OnboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePurchase = async () => {
    if (!firstName || !lastName || !address || !city || !province || !postalCode || !formattedPhone || !selectedCountry) {
      toast({
        title: translate('formError'),
        description: translate('fillAllFields'),
        variant: "destructive",
      });
      return;
    }

    if (!validatePhone(formattedPhone, selectedCountry)) {
      toast({
        title: translate('formError'),
        description: translate('invalidPhone'),
        variant: "destructive",
      });
      return;
    }

    setIsProcessingOrder(true);

    try {
      const shippingInfo = {
        firstName,
        lastName,
        phone: formattedPhone,
        address,
        province,
        city,
        postalCode,
        country: selectedCountry
      };

      updateUserData({ shippingInfo });

      const countryData = COUNTRIES[selectedCountry];
      const orderData = {
        product: {
          id: 43154955755679,
          title: "Accu-Tech Glucometer",
          price: countryData.productPrice,
          units: 1
        },
        shipping: {
          ...shippingInfo,
          cost: countryData.shippingCost
        }
      };

      const success = await exportOrder(orderData);
      if (success) {
        console.log("Order successfully exported to Shopify");
        setCurrentStep(currentStep + 1);
      } else {
        toast({
          title: translate('orderError'),
          description: translate('orderErrorDesc'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: translate('orderError'),
        description: translate('orderErrorDesc'),
        variant: "destructive",
      });
    } finally {
      setIsProcessingOrder(false);
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
  
  const getRegions = () => {
    return getRegionsForCountry(selectedCountry);
  };

  const renderStep = () => {
    const currentStepName = OnboardingSteps[currentStep];
    const countryData = selectedCountry ? COUNTRIES[selectedCountry] : null;

    switch (currentStepName) {
      case 'language':
        return <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-accu-tech-blue">Accu-Tech Healthineers</h1>
            <p className="text-gray-600 mb-6">{translate('welcomeToApp')}</p>
            <LanguageSelector />
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

      case 'purchase':
        return <div>
            <h1 className="text-2xl font-bold mb-3 text-center text-accu-tech-blue">{translate('buyYourDevice')}</h1>
            <p className="text-gray-600 mb-4 text-center">{translate('paymentOnDeliveryMessage')}</p>
            
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <img 
                  src="https://h00ktt-1h.myshopify.com/cdn/shop/files/gempages_559218299439678285-292f3a7c-297f-4208-b019-985346c4ef7b.jpg?v=10467499079061507992" 
                  alt="GlucoVista Laser Glucometer" 
                  className="w-36 h-auto object-contain rounded-lg shadow-md" 
                />
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {countryData ? `${countryData.productPrice}${countryData.currency}` : translate('free')}
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-center">
              <CreditCard className="text-yellow-600 mr-3 h-5 w-5 flex-shrink-0" />
              <p className="text-sm text-yellow-800">{translate('paymentOnDelivery')}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">{translate('firstName')}</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={translate('firstName')}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">{translate('lastName')}</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={translate('lastName')}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700">{translate('country')}</Label>
                <Select 
                  value={selectedCountry}
                  onValueChange={(value: CountryCode) => {
                    setSelectedCountry(value);
                    setSelectedRegion('');
                    setSelectedCity('');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ES">España</SelectItem>
                    <SelectItem value="PT">Portugal</SelectItem>
                    <SelectItem value="IT">Italia</SelectItem>
                    <SelectItem value="DE">Deutschland</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  {translate('phone')}
                </Label>
                <div className="mt-1">
                  <Input
                    id="phone"
                    type="tel"
                    value={formattedPhone}
                    onChange={handlePhoneChange}
                    placeholder={selectedCountry && COUNTRIES[selectedCountry] ? COUNTRIES[selectedCountry].phoneFormat : translate('phone')}
                    className={phoneError ? "border-red-500" : ""}
                  />
                  {phoneError && (
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {phoneError}
                    </p>
                  )}
                  {selectedCountry && COUNTRIES[selectedCountry] && (
                    <p className="text-xs text-gray-500 mt-1">
                      {translate('phoneFormat')}: {COUNTRIES[selectedCountry].phoneFormat}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">{translate('address')}</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={translate('address')}
                  className="mt-1"
                />
              </div>
              
              {selectedCountry && (
                <div>
                  <Label htmlFor="region" className="text-sm font-medium text-gray-700">
                    {translate('region')}
                  </Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion} disabled={!selectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder={translate('selectRegion', { region: getRegionLabel(selectedCountry) })} />
                    </SelectTrigger>
                    <SelectContent>
                      {getRegions().map(region => (
                        <SelectItem key={region.name} value={region.name}>{region.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {province && availableCities.length > 0 && (
                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">{translate('city')}</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger>
                      <SelectValue placeholder={translate('selectCity')} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((cityName) => (
                        <SelectItem key={cityName} value={cityName}>
                          {cityName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">{translate('postalCode')}</Label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder={translate('postalCode')}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{translate('deviceDescription')}</span>
                <span className="font-medium">
                  {countryData 
                    ? `${countryData.productPrice}${countryData.currency}` 
                    : `${COUNTRIES['ES'].productPrice}${COUNTRIES['ES'].currency}`}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{translate('shipping')}</span>
                <span className="font-medium">
                  {countryData 
                    ? `${countryData.shippingCost}${countryData.currency}` 
                    : `${COUNTRIES['ES'].shippingCost}${COUNTRIES['ES'].currency}`}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">{translate('total')}</span>
                <span className="font-bold text-accu-tech-blue">
                  {countryData 
                    ? `${countryData.productPrice + countryData.shippingCost}${countryData.currency}` 
                    : `${COUNTRIES['ES'].productPrice + COUNTRIES['ES'].shippingCost}${COUNTRIES['ES'].currency}`}
                </span>
              </div>
            </div>
            
            {isConfigured && (
              <div className="flex items-center mt-4 text-xs text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{translate('shopifyIntegrated')}</span>
              </div>
            )}
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
            {currentStep < OnboardingSteps.length - 1 && currentStep !== 5 && <Button variant="ghost" onClick={skipOnboarding}>
                {translate('skip')}
              </Button>}
            
            <Button className="buy-button" onClick={goToNextStep} disabled={currentStep === 5 && isProcessingOrder}>
              {currentStep === OnboardingSteps.length - 1 ? translate('getStarted') : 
               currentStep === 5 ? (isProcessingOrder ? translate('processing') : translate('finishOrder')) : translate('next')}
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
