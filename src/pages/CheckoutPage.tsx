import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { useShopify } from "@/contexts/ShopifyContext";
import { ChevronLeft, Check, Clock, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import country data for dropdowns
import { portugueseDistricts, italianRegions, spanishProvinces } from '@/data/countries';

type ShippingInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  country: string;
};

type ProductOption = {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  units: number;
  discount: string;
  installments?: string;
  shipping: number;
};

const CheckoutPage = () => {
  const { translate, language } = useLanguage();
  const navigate = useNavigate();
  const { isConfigured, exportOrder } = useShopify();
  const [step, setStep] = useState<'products' | 'shipping'>('products');
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  // Get country based on language
  const getCountryFromLanguage = () => {
    switch(language) {
      case 'pt': return 'PT';
      case 'it': return 'IT';
      case 'es': return 'ES';
      default: return 'PT';
    }
  };
  
  const [selectedCountry, setSelectedCountry] = useState(getCountryFromLanguage());
  const [cities, setCities] = useState<string[]>([]);
  
  // Updated product options with fixed price and shipping
  const productOptions: ProductOption[] = [
    {
      id: 43154955755679,
      title: "Compra 1",
      price: 49,
      originalPrice: 79,
      units: 1,
      discount: "38% OFF",
      installments: translate('installments', { count: 12, value: '€4.08' }),
      shipping: 3
    },
    {
      id: 43154955788447,
      title: "Compra 2",
      price: 89,
      originalPrice: 158,
      units: 2,
      discount: "44% OFF",
      installments: translate('installments', { count: 12, value: '€7.41' }),
      shipping: 3
    },
    {
      id: 43154955821215,
      title: "Compra 3",
      price: 109,
      originalPrice: 237,
      units: 3,
      discount: translate('buy3get1'),
      shipping: 3
    }
  ];
  
  const form = useForm<ShippingInfo>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      province: '',
      city: '',
      postalCode: '',
      country: getCountryFromLanguage()
    }
  });

  // Update cities when province changes
  useEffect(() => {
    const province = form.watch('province');
    if (!province) return;
    
    let citiesList: string[] = [];
    
    if (selectedCountry === 'PT') {
      // In a real app, you'd fetch cities based on the district
      // This is a simplified example with some sample cities
      const districtCities = {
        'Lisboa': ['Lisboa', 'Amadora', 'Sintra', 'Cascais'],
        'Porto': ['Porto', 'Vila Nova de Gaia', 'Matosinhos'],
        'Faro': ['Faro', 'Albufeira', 'Lagos']
      };
      citiesList = districtCities[province as keyof typeof districtCities] || [];
    } else if (selectedCountry === 'IT') {
      // Italian regions and some cities
      const regionCities = {
        'Lombardia': ['Milano', 'Bergamo', 'Brescia'],
        'Lazio': ['Roma', 'Viterbo', 'Frosinone'],
        'Toscana': ['Firenze', 'Siena', 'Pisa']
      };
      citiesList = regionCities[province as keyof typeof regionCities] || [];
    } else if (selectedCountry === 'ES') {
      // Spanish provinces and some cities
      const provinceCities = {
        'Madrid': ['Madrid', 'Alcalá de Henares', 'Móstoles'],
        'Barcelona': ['Barcelona', 'Sabadell', 'Terrassa'],
        'Valencia': ['Valencia', 'Alicante', 'Elche']
      };
      citiesList = provinceCities[province as keyof typeof provinceCities] || [];
    }
    
    setCities(citiesList);
    form.setValue('city', '');
  }, [form.watch('province'), selectedCountry]);

  // Set country based on language when component loads
  useEffect(() => {
    const country = getCountryFromLanguage();
    setSelectedCountry(country);
    form.setValue('country', country);
  }, [language]);

  const handleProductSelect = (product: ProductOption) => {
    setSelectedProduct(product);
  };
  
  const goToShipping = () => {
    if (selectedProduct) {
      setStep('shipping');
    }
  };
  
  const handleBackToProducts = () => {
    setStep('products');
  };
  
  // Simplified phone validation that focuses on having enough digits
  const validatePhoneNumber = (phone: string, country: string): boolean => {
    setPhoneError(null);
    
    if (!phone || phone.trim() === '') {
      setPhoneError(translate('invalidPhone'));
      return false;
    }
    
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Simplified validation based on country
    let minLength: number;
    switch(country) {
      case 'PT': minLength = 9; break; // Portugal mobile numbers are 9 digits
      case 'ES': minLength = 9; break; // Spain mobile numbers are 9 digits
      case 'IT': minLength = 10; break; // Italy mobile numbers are typically 10 digits
      default: minLength = 9;
    }
    
    if (digitsOnly.length < minLength) {
      setPhoneError(translate('invalidPhone'));
      return false;
    }
    
    return true;
  };
  
  const formatPhoneNumber = (phone: string, country: string): string => {
    // Let the Shopify context handle the proper E.164 formatting
    return phone;
  };
  
  const onSubmit = async (data: ShippingInfo) => {
    if (!selectedProduct) return;
    
    // Validate phone number
    if (!validatePhoneNumber(data.phone, data.country)) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log("Order submitted:", { 
        product: selectedProduct, 
        shipping: {...data, phone: data.phone} // No formatting here, let ShopifyContext handle it
      });
      
      await exportOrder({
        product: selectedProduct,
        shipping: {...data, phone: data.phone} // Pass phone as-is
      });
      console.log("Order successfully exported to Shopify");
      
      navigate('/order-success');
    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: translate('orderError'),
        description: translate('orderErrorDesc'),
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const getRegions = () => {
    switch(selectedCountry) {
      case 'PT': return portugueseDistricts;
      case 'IT': return italianRegions;
      case 'ES': return spanishProvinces;
      default: return [];
    }
  };

  if (step === 'products') {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 px-4 pt-6">
        <h1 className="text-xl font-bold mb-4 text-center">{translate('selectOffer')}</h1>
        
        <div className="space-y-3 mb-6">
          {productOptions.map((product) => (
            <Card 
              key={product.id} 
              className={`border ${selectedProduct?.id === product.id ? 'border-accu-tech-blue' : 'border-gray-200'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <RadioGroup value={selectedProduct?.id.toString()} className="mt-1">
                    <div className="flex items-center">
                      <RadioGroupItem 
                        value={product.id.toString()} 
                        id={`product-${product.id}`} 
                        onClick={() => handleProductSelect(product)}
                      />
                    </div>
                  </RadioGroup>
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <img 
                        src="/lovable-uploads/12563003-3a79-4683-b6fa-482a7ee135e9.png" 
                        alt="Accu-Tech 1" 
                        className="w-12 h-12 object-contain mr-3" 
                      />
                      <div>
                        <h3 className="font-semibold">
                          {product.title} {product.discount && <span className="text-accu-tech-blue ml-1">{product.discount}</span>}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">€{product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-gray-500 line-through text-sm">€{product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {product.installments && (
                      <p className="text-sm text-gray-600 mt-1">{product.installments}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Button 
          onClick={goToShipping} 
          disabled={!selectedProduct}
          className="w-full bg-accu-tech-blue hover:bg-accu-tech-dark-blue rounded-full py-3"
        >
          {translate('buy')} - €{selectedProduct?.price.toFixed(2) || '0.00'}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full mt-3 border-gray-300 text-gray-600"
          onClick={() => window.navigator.clipboard.writeText('ACCUTECH30')}
        >
          {translate('copyPromoCode')}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="gradient-medical text-white px-4 pt-6 pb-4">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/10 hover:bg-white/20 rounded-full p-2 mr-3"
            onClick={handleBackToProducts}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{translate('paymentOnDelivery')}</h1>
        </div>
      </div>
      
      <div className="px-4">
        <Card className="mb-4 mt-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 border-b pb-3 mb-3">
              <img 
                src="/lovable-uploads/12563003-3a79-4683-b6fa-482a7ee135e9.png" 
                alt="Accu-Tech" 
                className="w-12 h-12 object-contain" 
              />
              <div>
                <p className="text-sm">Accu-Tech 1 {translate('unit')}</p>
                <p className="text-xs text-gray-500">{selectedProduct?.units} {translate('unit')}</p>
              </div>
              <div className="ml-auto">
                <p className="font-bold">€{selectedProduct?.price.toFixed(2)}</p>
                <p className="text-xs text-accu-tech-blue">{selectedProduct?.discount}</p>
              </div>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>{translate('subtotal')}</span>
                <span>€{selectedProduct?.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{translate('shipping')}</span>
                <span>€{selectedProduct?.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t mt-2">
                <span>{translate('total')}</span>
                <span>€{(selectedProduct ? selectedProduct.price + selectedProduct.shipping : 0).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">{translate('shippingMethod')}</h3>
            <div className="flex items-start gap-3 mb-1">
              <RadioGroup value="standard" className="mt-1">
                <div className="flex items-center">
                  <RadioGroupItem value="standard" id="shipping-standard" checked />
                </div>
              </RadioGroup>
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full bg-accu-tech-lightest flex items-center justify-center">
                  <Clock className="h-4 w-4 text-accu-tech-blue" />
                </div>
                <div>
                  <p className="font-medium">{translate('standardShipping')}</p>
                  <p className="text-sm text-gray-500">1-3 {translate('days')}</p>
                </div>
                <span className="ml-auto">€3.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox id="money-back" checked />
              <div>
                <label htmlFor="money-back" className="font-medium cursor-pointer">
                  {translate('moneyBackGuarantee', { days: 90 })}
                </label>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  <span>{translate('secureTransaction')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">{translate('enterShippingAddress')}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translate('firstName')}</FormLabel>
                        <FormControl>
                          <Input placeholder="João" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translate('lastName')}</FormLabel>
                        <FormControl>
                          <Input placeholder="Silva" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>{translate('country')}</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCountry(value);
                          form.setValue('province', '');
                          form.setValue('city', '');
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={translate('selectCountry')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PT">Portugal</SelectItem>
                          <SelectItem value="ES">España</SelectItem>
                          <SelectItem value="IT">Italia</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>{translate('phone')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={selectedCountry === 'PT' ? '912345678' : selectedCountry === 'IT' ? '3123456789' : '612345678'} 
                          {...field} 
                          required 
                        />
                      </FormControl>
                      {phoneError && <FormMessage>{phoneError}</FormMessage>}
                      <p className="text-xs text-gray-500 mt-1">{translate('phoneFormat')}</p>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>{translate('address')}</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua das Flores, 123" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translate('province')}</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={translate('selectRegion')} />
                          </SelectTrigger>
                          <SelectContent>
                            {getRegions().map(region => (
                              <SelectItem key={region} value={region}>{region}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translate('city')}</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                          disabled={!form.watch('province')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={translate('selectCity')} />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map(city => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate('postalCode')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={selectedCountry === 'PT' ? '1000-001' : selectedCountry === 'IT' ? '00100' : '28001'} 
                          {...field} 
                          required 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="pt-2 pb-4">
              <div className="flex justify-between mb-3">
                <span className="font-medium">{translate('total')}:</span>
                <span className="font-bold">€{(selectedProduct ? selectedProduct.price + selectedProduct.shipping : 0).toFixed(2)}</span>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-black text-white rounded-full py-3"
                disabled={isProcessing}
              >
                {isProcessing ? translate('processing') : translate('finishOrder')}
              </Button>
              
              <div className="flex items-center justify-center mt-3 text-xs text-gray-500 gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span>{translate('shopifyIntegrated')}</span>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CheckoutPage;
