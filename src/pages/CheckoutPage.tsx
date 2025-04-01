import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowLeft, Truck, Package, Wallet, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' })
    .regex(/^[0-9+\s()-]+$/, { message: 'Please enter a valid phone number' }),
  address1: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  address2: z.string().optional(),
  city: z.string().min(2, { message: 'City must be at least 2 characters' }),
  province: z.string().min(2, { message: 'Province/State must be at least 2 characters' }),
  postalCode: z.string().min(4, { message: 'Postal/ZIP code must be at least 4 characters' }),
  country: z.string().default('United States'),
  orderNotes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

const CheckoutPage = () => {
  const { translate } = useLanguage();
  const { userData } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedOffering, setSelectedOffering] = useState(productOfferings[0]);
  const [orderProcessing, setOrderProcessing] = useState(false);
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address1: '',
      address2: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'United States',
      orderNotes: '',
    },
  });
  
  const subtotal = selectedOffering.price;
  const discount = subtotal * (selectedOffering.discount / 100);
  const discountedSubtotal = subtotal - discount;
  const shipping = 0;
  const total = discountedSubtotal + shipping;

  useEffect(() => {
    const savedOffering = sessionStorage.getItem('selectedOffering');
    if (savedOffering) {
      setSelectedOffering(JSON.parse(savedOffering));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (window.location.pathname.includes('/checkout')) {
        sessionStorage.setItem('fromCheckout', 'true');
      }
    };
  }, []);

  useEffect(() => {
    // Check if user already completed the onboarding process
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (onboardingComplete === 'true') {
      const fromCheckout = sessionStorage.getItem('fromCheckout');
      if (!fromCheckout) {
        navigate('/home');
      }
    }
  }, [navigate]);

  const onSubmit = (values: CheckoutFormValues) => {    
    setOrderProcessing(true);
    
    const orderNumber = `AC-${Math.floor(100000 + Math.random() * 900000)}`;
    
    sessionStorage.setItem('order', JSON.stringify({
      orderNumber,
      email: values.email,
      product: {
        name: translate('deviceName'),
        quantity: selectedOffering.quantity,
        price: selectedOffering.price,
        discount: selectedOffering.discount
      },
      shipping: {
        firstName: values.firstName,
        lastName: values.lastName,
        address1: values.address1,
        address2: values.address2 || '',
        city: values.city,
        province: values.province,
        postalCode: values.postalCode,
        country: values.country,
        phone: values.phone
      },
      notes: values.orderNotes,
      paymentMethod: 'cash',
      total
    }));
    
    // Save onboarding completion in localStorage to prevent going back to initial steps
    localStorage.setItem('onboardingComplete', 'true');
    sessionStorage.setItem('onboardingStep', '3');
    
    // Short timeout to simulate order processing
    setTimeout(() => {
      setOrderProcessing(false);
      navigate('/order-success');
    }, 500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const goBackToOnboarding = () => {
    sessionStorage.setItem('onboardingStep', '1');
    navigate('/onboarding');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2" 
              onClick={goBackToOnboarding}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              {translate('back')}
            </Button>
            <img 
              src="https://accu-tech.pro/wp-content/uploads/2024/08/Accu-Tech-1.png" 
              alt="Accu-Tech Logo" 
              className="h-8" 
            />
          </div>
          <h1 className="text-xl font-bold text-gray-800">{translate('checkout')}</h1>
        </div>
        
        <Card className="mb-6 bg-white">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4">{translate('purchaseDevice')}</h2>
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-accu-tech-blue text-white rounded-full flex items-center justify-center mb-2">
                  <Truck className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{translate('enterShippingAddress')}</span>
              </div>
              
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className="h-full bg-accu-tech-blue w-1/2 transition-all duration-500"></div>
              </div>
              <div className="flex flex-col items-center opacity-70">
                <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center mb-2">
                  <Package className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{translate('completeOrder')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <Wallet className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <span className="font-semibold">{translate('cashOnDeliveryOnly')}</span> - {translate('cashOnDeliveryBanner')}
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">{translate('enterShippingAddress')}</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translate('firstName')}*</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
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
                          <FormLabel>{translate('lastName')}*</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email*</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              {translate('phone')}*
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{translate('phoneRequired')}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            {translate('phoneRequired')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translate('address')} 1*</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translate('address')} 2 ({translate('optional')})</FormLabel>
                        <FormControl>
                          <Input placeholder="Apartment, suite, unit, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translate('city')}*</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translate('province')}*</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translate('postalCode')}*</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="orderNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translate('orderNotes')} ({translate('optional')})</FormLabel>
                        <FormControl>
                          <textarea 
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accu-tech-blue min-h-[80px]"
                            placeholder={translate('additionalInfo')}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {translate('orderNotesDescription')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-4 border rounded-lg border-yellow-200 bg-yellow-50 p-4">
                    <div className="flex items-start">
                      <Wallet className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-yellow-800">{translate('cashOnDelivery')}</h3>
                        <p className="text-sm text-yellow-700 mt-1">{translate('cashOnDeliveryDescription')}</p>
                        <ul className="mt-2 text-sm text-yellow-700 space-y-1 list-disc pl-5">
                          <li>{translate('prepareExactAmount')}</li>
                          <li>{translate('courierCallBefore')}</li>
                          <li>{translate('receiptProvided')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full buy-button"
                      disabled={orderProcessing}
                    >
                      {orderProcessing ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {translate('processing')}...
                        </span>
                      ) : (
                        translate('completeOrderCOD')
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-bold mb-4">{translate('yourOrder')}</h2>
              
              <div className="border-b pb-4 mb-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedOffering.image}
                    alt={translate('deviceName')}
                    className="w-16 h-16 object-contain rounded-md"
                  />
                  <div>
                    <h3 className="font-medium">{translate('deviceName')}</h3>
                    <p className="text-sm text-gray-500">{translate('deviceDescription')}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium">Qty: {selectedOffering.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{translate('subtotal')}</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                {selectedOffering.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{translate('discount')} ({selectedOffering.discount}%)</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{translate('shipping')}</span>
                  <span className="font-medium text-green-600">{translate('free')}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-lg font-bold mb-4">
                <span>{translate('total')}</span>
                <span>{formatCurrency(total)}</span>
              </div>
              
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <Wallet className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">{translate('payOnDelivery')}</span>
              </div>
              
              <div className="border rounded-lg p-3 mb-4">
                <h3 className="font-medium text-gray-800 text-sm mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2 text-gray-500" />
                  {translate('deliveryTimeline')}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>{translate('order')}</span>
                  <span>{translate('today')}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>{translate('processing')}</span>
                  <span>1-2 {translate('days')}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{translate('delivery')}</span>
                  <span>2-4 {translate('days')}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                  <span>{translate('moneyBackGuarantee')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                  <span>{translate('noPaymentBeforeDelivery')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
