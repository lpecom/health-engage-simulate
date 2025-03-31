
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowLeft, Truck, Package, Wallet, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Product offering
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

const CheckoutPage = () => {
  const { translate } = useLanguage();
  const { userData } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  // Product selection from onboarding
  const [selectedOffering, setSelectedOffering] = useState(productOfferings[0]);
  
  // Calculate prices
  const subtotal = selectedOffering.price;
  const discount = subtotal * (selectedOffering.discount / 100);
  const discountedSubtotal = subtotal - discount;
  const shipping = 0; // Free shipping
  const total = discountedSubtotal + shipping;

  // Load selected offering from session storage
  useEffect(() => {
    const savedOffering = sessionStorage.getItem('selectedOffering');
    if (savedOffering) {
      setSelectedOffering(JSON.parse(savedOffering));
    }
  }, []);

  // Handle returning to onboarding
  useEffect(() => {
    // Mark that we're coming from checkout if we're part of the onboarding
    return () => {
      if (window.location.pathname.includes('/checkout')) {
        sessionStorage.setItem('fromCheckout', 'true');
      }
    };
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!firstName || !lastName || !phone || !email || !address || !city || !province || !postalCode) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Process order
    const orderNumber = `AC-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Save order data to session storage for confirmation page
    sessionStorage.setItem('order', JSON.stringify({
      orderNumber,
      email,
      product: {
        name: translate('deviceName'),
        quantity: selectedOffering.quantity,
        price: selectedOffering.price,
        discount: selectedOffering.discount
      },
      shipping: {
        firstName,
        lastName,
        address,
        city,
        province,
        postalCode,
        phone
      },
      paymentMethod: 'cash',
      total
    }));
    
    // Navigate to success page
    navigate('/order-success');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const goBackToOnboarding = () => {
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
        
        {/* Order Progress */}
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
        
        {/* Cash on Delivery Banner */}
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <Wallet className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <span className="font-semibold">{translate('cashOnDeliveryOnly')}</span> - {translate('cashOnDeliveryBanner')}
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main checkout area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">{translate('enterShippingAddress')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translate('firstName')}*</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accu-tech-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translate('lastName')}*</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accu-tech-blue"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translate('phone')}*</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accu-tech-blue"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">{translate('phoneRequired')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accu-tech-blue"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{translate('address')}*</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accu-tech-blue"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translate('city')}*</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accu-tech-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translate('province')}*</label>
                    <input
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accu-tech-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translate('postalCode')}*</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accu-tech-blue"
                      required
                    />
                  </div>
                </div>
                
                {/* Cash on Delivery Information */}
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
                  >
                    {translate('completeOrderCOD')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Order summary */}
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
              
              {/* Payment Method - Cash on Delivery Only */}
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <Wallet className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">{translate('payOnDelivery')}</span>
              </div>
              
              {/* Shipping Timeline */}
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
