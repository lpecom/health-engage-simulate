
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  CountryCode, 
  getRegionsForCountry, 
  isValidPhoneForCountry,
  getRegionLabel
} from '@/data/countries';
import { ShippingInfo } from '@/types/userData';

interface CheckoutFormProps {
  onSubmit: (data: ShippingInfo) => void;
  isSubmitting: boolean;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, isSubmitting }) => {
  const { translate, language } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('ES');
  const [cities, setCities] = useState<string[]>([]);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  // Get default country based on language
  const getDefaultCountry = (): CountryCode => {
    switch(language) {
      case 'pt': return 'PT';
      case 'it': return 'IT';
      case 'de': return 'DE';
      case 'es':
      default: return 'ES';
    }
  };
  
  // Create a schema for form validation
  const formSchema = z.object({
    firstName: z.string().min(2, { message: translate('firstNameRequired') }),
    lastName: z.string().min(2, { message: translate('lastNameRequired') }),
    phone: z.string().min(9, { message: translate('phoneInvalid') }),
    email: z.string().email({ message: translate('emailInvalid') }).optional().or(z.literal('')),
    address: z.string().min(5, { message: translate('addressRequired') }),
    province: z.string().min(1, { message: translate('provinceRequired') }),
    city: z.string().min(1, { message: translate('cityRequired') }),
    postalCode: z.string().min(4, { message: translate('postalCodeRequired') }),
    country: z.string()
  });
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      province: '',
      city: '',
      postalCode: '',
      country: getDefaultCountry()
    }
  });
  
  // Update country when language changes
  useEffect(() => {
    const country = getDefaultCountry();
    setSelectedCountry(country);
    form.setValue('country', country);
  }, [language]);
  
  // Update cities when province changes
  useEffect(() => {
    const province = form.watch('province');
    if (!province) return;
    
    const regions = getRegionsForCountry(selectedCountry);
    const selectedRegion = regions.find(r => r.name === province);
    setCities(selectedRegion?.cities || []);
    
    // Reset city when province changes
    form.setValue('city', '');
  }, [form.watch('province'), selectedCountry]);
  
  // Validate phone number on blur
  const validatePhoneNumber = (phone: string) => {
    setPhoneError(null);
    
    if (!phone || phone.trim() === '') {
      setPhoneError(translate('invalidPhone'));
      return false;
    }
    
    if (!isValidPhoneForCountry(phone, selectedCountry)) {
      setPhoneError(translate('invalidPhone'));
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (!validatePhoneNumber(data.phone)) {
      return;
    }
    
    onSubmit(data as ShippingInfo);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translate('firstName')}</FormLabel>
                <FormControl>
                  <Input placeholder={translate('firstNamePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input placeholder={translate('lastNamePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translate('country')}</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value: CountryCode) => {
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
                  <SelectItem value="ES">España</SelectItem>
                  <SelectItem value="PT">Portugal</SelectItem>
                  <SelectItem value="IT">Italia</SelectItem>
                  <SelectItem value="DE">Deutschland</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translate('phone')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    selectedCountry === 'PT' ? '912345678' : 
                    selectedCountry === 'IT' ? '3123456789' : 
                    selectedCountry === 'DE' ? '1512345678' :
                    '612345678'
                  }
                  {...field}
                  onBlur={(e) => {
                    field.onBlur();
                    validatePhoneNumber(e.target.value);
                  }}
                />
              </FormControl>
              {phoneError && <FormMessage>{phoneError}</FormMessage>}
              <p className="text-xs text-gray-500 mt-1">{translate('phoneFormat')}</p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="email@example.com" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500 mt-1">{translate('emailOptional')}</p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translate('address')}</FormLabel>
              <FormControl>
                <Input placeholder={translate('addressPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{getRegionLabel(selectedCountry)}</FormLabel>
                <Select 
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={translate('selectRegion')} />
                  </SelectTrigger>
                  <SelectContent>
                    {getRegionsForCountry(selectedCountry).map(region => (
                      <SelectItem key={region.name} value={region.name}>{region.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
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
                <FormMessage />
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
                  placeholder={
                    selectedCountry === 'PT' ? '1000-001' : 
                    selectedCountry === 'IT' ? '00100' : 
                    selectedCountry === 'DE' ? '10115' :
                    '28001'
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Shipping Method - Fixed Standard */}
        <div className="mt-6 mb-4">
          <h3 className="font-medium mb-3">{translate('shippingMethod')}</h3>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 mt-1 rounded-full border-2 border-accu-tech-blue flex-shrink-0">
              <div className="w-2 h-2 bg-accu-tech-blue rounded-full m-0.5"></div>
            </div>
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
        </div>
        
        <div className="py-4">
          <Button 
            type="submit" 
            className="w-full bg-black text-white rounded-full py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? translate('processing') : translate('finishOrder')}
          </Button>
          
          <div className="flex items-center justify-center mt-3 text-xs text-gray-500 gap-1">
            <ShieldCheck className="h-3 w-3" />
            <span>{translate('shopifyIntegrated')}</span>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CheckoutForm;
