
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { ChevronLeft, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationState {
  shippingInfo?: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    province: string;
    city: string;
    postalCode: string;
  };
  selectedProduct?: {
    id: number;
    title: string;
    price: number;
    originalPrice: number;
    units: number;
    discount: string;
    installments?: string;
  };
}

const ConfirmationPage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isConfirming, setIsConfirming] = useState(false);
  
  const { shippingInfo, selectedProduct } = (location.state as LocationState) || {};
  
  if (!shippingInfo || !selectedProduct) {
    // Redirect back to checkout if we don't have the required info
    navigate('/checkout');
    return null;
  }
  
  const handleBack = () => {
    navigate('/checkout', { state: { shippingInfo, selectedProduct } });
  };
  
  const handleConfirm = () => {
    setIsConfirming(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsConfirming(false);
      navigate('/order-success', { 
        state: { shippingInfo, selectedProduct } 
      });
    }, 1000);
  };
  
  const handleCancel = () => {
    toast({
      title: translate('orderCancelled'),
      description: translate('orderCancelledMessage'),
      variant: "destructive"
    });
    navigate('/home');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="gradient-medical text-white px-4 pt-6 pb-4">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/10 hover:bg-white/20 rounded-full p-2 mr-3"
            onClick={handleBack}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{translate('confirmYourOrder')}</h1>
        </div>
      </div>
      
      <div className="px-4 py-4">
        <div className="flex items-center mb-4 bg-amber-50 p-3 rounded-lg border border-amber-200">
          <AlertTriangle className="text-amber-500 mr-3" />
          <p className="text-sm text-amber-800">{translate('confirmationWarning')}</p>
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">{translate('shippingAddress')}</h3>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">
                {shippingInfo.firstName} {shippingInfo.lastName}
              </p>
              <p>{shippingInfo.address}</p>
              <p>
                {shippingInfo.city}, {shippingInfo.province} {shippingInfo.postalCode}
              </p>
              <p>{shippingInfo.phone}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 border-b pb-3 mb-3">
              <img 
                src="/lovable-uploads/12563003-3a79-4683-b6fa-482a7ee135e9.png" 
                alt="Accu-Tech" 
                className="w-12 h-12 object-contain" 
              />
              <div>
                <p className="text-sm">{selectedProduct.title}</p>
                <p className="text-xs text-gray-500">{selectedProduct.units} {translate('unit')}</p>
              </div>
              <div className="ml-auto">
                <p className="font-bold">€{selectedProduct.price.toFixed(2)}</p>
                <p className="text-xs text-accu-tech-blue">{selectedProduct.discount}</p>
              </div>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>{translate('subtotal')}</span>
                <span>€{selectedProduct.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{translate('shipping')}</span>
                <span className="text-accu-tech-blue">{translate('free')}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t mt-2">
                <span>{translate('total')}</span>
                <span>€{selectedProduct.price.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <ShieldCheck className="h-5 w-5 text-accu-tech-blue" />
              </div>
              <div>
                <h3 className="font-medium">{translate('paymentMethod')}</h3>
                <p className="text-sm text-gray-600">{translate('paymentOnDelivery')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          onClick={handleConfirm}
          className="w-full bg-accu-tech-blue hover:bg-accu-tech-dark-blue rounded-full py-3 mb-3"
          disabled={isConfirming}
        >
          {isConfirming ? translate('processing') : translate('confirmAndFinish')}
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleCancel}
          className="w-full border-gray-300 text-gray-600 rounded-full py-3"
        >
          {translate('cancelOrder')}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
