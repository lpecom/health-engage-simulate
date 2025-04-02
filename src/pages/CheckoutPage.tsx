
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { useShopify } from "@/contexts/ShopifyContext";
import { ChevronLeft, ShieldCheck, Info, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { trackTaboolaStartCheckout, trackTaboolaPurchase } from "@/utils/tracking";

import { CountryCode, getDefaultCountryByLanguage } from '@/data/countries';
import { ProductOption, ShippingInfo } from '@/types/userData';
import ProductSelector from '@/components/ProductSelector';
import ProductSummary from '@/components/ProductSummary';
import CheckoutForm from '@/components/CheckoutForm';

const CheckoutPage = () => {
  const { translate, language } = useLanguage();
  const navigate = useNavigate();
  const { isConfigured, configError, exportOrder } = useShopify();
  const [step, setStep] = useState<'products' | 'shipping'>('products');
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Fire Taboola start_checkout event when page loads
  useEffect(() => {
    trackTaboolaStartCheckout();
  }, []);
  
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
  
  const onSubmitShippingInfo = async (data: ShippingInfo) => {
    if (!selectedProduct) return;
    
    setIsProcessing(true);
    
    try {
      console.log("Order submitted with shipping info:", data);
      console.log("Selected product:", selectedProduct);
      
      const result = await exportOrder({
        product: selectedProduct,
        shipping: data
      });
      
      if (result) {
        console.log("Order successfully exported");
        
        // Track purchase event when order is successful
        trackTaboolaPurchase();
        
        navigate('/order-success');
      } else {
        setIsProcessing(false);
        toast({
          title: translate('orderError'),
          description: translate('orderErrorDesc'),
          variant: "destructive",
        });
      }
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

  if (step === 'products') {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 px-4 pt-6">
        <ProductSelector 
          products={productOptions}
          selectedProduct={selectedProduct}
          onSelect={handleProductSelect}
          onContinue={goToShipping}
        />
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
        {configError && (
          <Alert variant="destructive" className="mb-4 mt-2 bg-red-50 border-red-200">
            <Info className="h-4 w-4" />
            <AlertTitle>{translate('shopifyConfigError')}</AlertTitle>
            <AlertDescription className="text-sm">
              {configError}
              <p className="mt-2 text-xs">
                {translate('shopifyConfigErrorDesc')}
              </p>
            </AlertDescription>
          </Alert>
        )}
        
        <ProductSummary product={selectedProduct} />
        
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
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">{translate('enterShippingAddress')}</h3>
            
            <CheckoutForm 
              onSubmit={onSubmitShippingInfo}
              isSubmitting={isProcessing}
            />
            
            <div className="flex items-center justify-center mt-3 text-xs text-gray-500 gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>{isConfigured ? translate('shopifyIntegrated') : translate('orderWillBeSaved')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
