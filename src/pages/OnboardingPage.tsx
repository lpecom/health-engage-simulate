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
import { 
  CountryCode, 
  COUNTRIES,
  getDefaultCountryByLanguage, 
  getRegionLabel, 
  getRegionsForCountry,
  isValidPhoneForCountry
} from '@/data/countries';
import { Badge } from "@/components/ui/badge";
import { ProductOption } from '@/types/userData';
import { trackTaboolaStartCheckout, trackTaboolaPurchase } from '@/utils/tracking';

const OnboardingSteps = [
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
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(getDefaultCountryByLanguage(language));
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const defaultCountry = getDefaultCountryByLanguage(language);
    setSelectedCountry(defaultCountry);
    
    setProvince('');
    setCity('');
  }, [language]);
  
  useEffect(() => {
    if (selectedCountry && province) {
      const selectedRegion = getRegionsForCountry(selectedCountry).find(r => r.name === province);
      if (selectedRegion && selectedRegion.cities) {
        setAvailableCities(selectedRegion.cities);
      } else {
        setAvailableCities([]);
      }
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry, province]);

  const validatePhone = (phoneNumber: string): boolean => {
    if (!phoneNumber || !selectedCountry) return false;
    
    const isValid = isValidPhoneForCountry(phoneNumber, selectedCountry);
    if (!isValid) {
      setPhoneError(translate('invalidPhoneFormat'));
    } else {
      setPhoneError(null);
    }
    return isValid;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    
    if (value && selectedCountry) {
      const formattedValue = COUNTRIES[selectedCountry].formatPhoneNumber(value);
      setFormattedPhone(formattedValue);
      
      if (!validatePhone(formattedValue)) {
        setPhoneError(translate('invalidPhoneFormat'));
      } else {
        setPhoneError(null);
      }
    } else {
      setPhoneError(null);
    }
  };

  useEffect(() => {
    if (phone && selectedCountry) {
      const formatted = COUNTRIES[selectedCountry].formatPhoneNumber(phone);
      setFormattedPhone(formatted);
    }
  }, [phone, selectedCountry]);

  useEffect(() => {
    if (currentStep === 4) {
      trackTaboolaStartCheckout();
    }
  }, [currentStep]);

  const goToNextStep = async () => {
    if (currentStep === 4) { // Purchase step
      await handlePurchase();
      return;
    }

    if (currentStep < OnboardingSteps.length - 1) {
      if (currentStep === 4) {
        trackTaboolaPurchase();
      }
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePurchase = async () => {
    setFormSubmitted(true);
    
    if (!validateCheckoutForm()) {
      toast({
        title: translate('formError'),
        description: translate('allFieldsRequired'),
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
        email: email || undefined,
        address,
        province,
        city,
        postalCode,
        country: selectedCountry
      };

      updateUserData({ shippingInfo });

      const countryData = COUNTRIES[selectedCountry];
      const productOption: ProductOption = {
        id: 43154955755679,
        title: "Accu-Tech Glucometer",
        price: countryData.productPrice,
        originalPrice: countryData.productPrice * 1.2,
        units: 1,
        discount: "-20%",
        shipping: countryData.shippingCost
      };
      
      const orderData = {
        product: productOption,
        shipping: shippingInfo
      };

      await exportOrder(orderData);
      
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error processing order:', error);
      
      toast({
        title: translate('orderReceived'),
        description: translate('orderProcessLater'),
        variant: "default",
      });
      
      setCurrentStep(currentStep + 1);
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const validateCheckoutForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!firstName.trim()) {
      errors.firstName = translate('requiredField');
      isValid = false;
    }
    
    if (!lastName.trim()) {
      errors.lastName = translate('requiredField');
      isValid = false;
    }

    if (!address.trim()) {
      errors.address = translate('requiredField');
      isValid = false;
    }

    if (!province) {
      errors.province = translate('requiredField');
      isValid = false;
    }

    if (!city && availableCities.length > 0) {
      errors.city = translate('requiredField');
      isValid = false;
    }

    if (!postalCode.trim()) {
      errors.postalCode = translate('requiredField');
      isValid = false;
    }

    if (!phone.trim()) {
      errors.phone = translate('requiredField');
      isValid = false;
    } else if (!validatePhone(phone)) {
      errors.phone = translate('invalidPhoneFormat');
      isValid = false;
    }

    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = translate('emailInvalid');
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
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
    const countryData = COUNTRIES[selectedCountry];

    switch (currentStepName) {
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
                  {countryData.productPrice}{countryData.currency}
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-center">
              <CreditCard className="text-yellow-600 mr-3 h-5 w-5 flex-shrink-0" />
              <p className="text-sm text-yellow-800">{translate('paymentOnDelivery')}</p>
            </div>
            
            {formSubmitted && Object.keys(formErrors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-700 font-medium">{translate('allFieldsRequired')}</p>
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 flex items-center">
                    {translate('firstName')} <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={translate('firstName')}
                    className={`mt-1 ${formErrors.firstName ? 'border-red-500' : ''}`}
                  />
                  {formErrors.firstName && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 flex items-center">
                    {translate('lastName')} <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={translate('lastName')}
                    className={`mt-1 ${formErrors.lastName ? 'border-red-500' : ''}`}
                  />
                  {formErrors.lastName && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700 flex items-center">
                  {translate('country')} <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select 
                  value={selectedCountry}
                  onValueChange={(value: CountryCode) => {
                    setSelectedCountry(value);
                    setProvince('');
                    setCity('');
                    setPhoneError(null);
                  }}
                >
                  <SelectTrigger className={`bg-white ${!selectedCountry ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ES">España</SelectItem>
                    <SelectItem value="PT">Portugal</SelectItem>
                    <SelectItem value="IT">Italia</SelectItem>
                    <SelectItem value="DE">Deutschland</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.country && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.country}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                  {translate('phone')} <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="mt-1">
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder={COUNTRIES[selectedCountry].phoneFormat}
                    className={phoneError || formErrors.phone ? "border-red-500" : ""}
                  />
                  {(phoneError || formErrors.phone) && (
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {phoneError || formErrors.phone}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {translate('phoneFormat')}: {COUNTRIES[selectedCountry].phoneFormat}
                  </p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className={`mt-1 ${formErrors.email ? 'border-red-500' : ''}`}
                />
                {formErrors.email ? (
                  <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">{translate('emailOptional')}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center">
                  {translate('address')} <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={translate('addressPlaceholder')}
                  className={`mt-1 ${formErrors.address ? 'border-red-500' : ''}`}
                />
                {formErrors.address && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>
                )}
              </div>
              
              {selectedCountry && (
                <div>
                  <Label htmlFor="region" className="text-sm font-medium text-gray-700 flex items-center">
                    {getRegionLabel(selectedCountry)} <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select 
                    value={province} 
                    onValueChange={setProvince} 
                    disabled={!selectedCountry}
                  >
                    <SelectTrigger className={`bg-white ${formErrors.province ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder={translate('selectRegion')} />
                    </SelectTrigger>
                    <SelectContent>
                      {getRegions().map(region => (
                        <SelectItem key={region.name} value={region.name}>{region.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.province && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.province}</p>
                  )}
                </div>
              )}

              {province && availableCities.length > 0 && (
                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700 flex items-center">
                    {translate('city')} <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select 
                    value={city} 
                    onValueChange={setCity}
                  >
                    <SelectTrigger className={`bg-white ${formErrors.city ? 'border-red-500' : ''}`}>
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
                  {formErrors.city && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>
                  )}
                </div>
              )}
              
              <div>
                <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700 flex items-center">
                  {translate('postalCode')} <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder={translate('postalCode')}
                  className={`mt-1 ${formErrors.postalCode ? 'border-red-500' : ''}`}
                />
                {formErrors.postalCode && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.postalCode}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{translate('deviceDescription')}</span>
                <span className="font-medium">
                  {countryData.productPrice}{countryData.currency}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{translate('shipping')}</span>
                <span className="font-medium">
                  {countryData.shippingCost}{countryData.currency}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">{translate('total')}</span>
                <span className="font-bold text-accu-tech-blue">
                  {countryData.productPrice + countryData.shippingCost}{countryData.currency}
                </span>
              </div>
            </div>
            
            <div className="flex items-center mt-4 mb-1 text-xs text-gray-500 justify-center">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{translate('orderWillBeSaved')}</span>
            </div>
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
            src="/lovable-uploads/dda38d27-5b5f-40cb-a3e4-f87b713723e1.png" 
            alt="Accu-Tech Logo" 
            className="h-5" 
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
            {currentStep < OnboardingSteps.length - 1 && currentStep !== 4 && <Button variant="ghost" onClick={skipOnboarding}>
                {translate('skip')}
              </Button>}
            
            <Button className="buy-button" onClick={goToNextStep} disabled={currentStep === 4 && isProcessingOrder}>
              {currentStep === OnboardingSteps.length - 1 ? translate('getStarted') : 
               currentStep === 4 ? (isProcessingOrder ? translate('processing') : translate('finishOrder')) : translate('next')}
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
