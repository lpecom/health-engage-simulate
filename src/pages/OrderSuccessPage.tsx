import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, Package, TruckIcon, Home } from "lucide-react";

const OrderSuccessPage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="gradient-medical text-white px-4 pt-6 pb-6">
        <div className="flex items-center mb-4">
          <img src="https://accu-tech.pro/wp-content/uploads/2024/08/Accu-Tech-1.png" alt="Accu-Tech Logo" className="h-8 mr-3" />
          <h1 className="text-xl font-bold">Healthineers</h1>
        </div>
      </div>
      
      <div className="flex-1 px-4 py-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{translate('orderConfirmed')}</h1>
        <p className="text-gray-600 mb-6">{translate('orderThankYou')}</p>
        
        <Card className="w-full mb-6">
          <CardContent className="p-5">
            <h3 className="font-medium mb-4">{translate('deliveryStatus')}</h3>
            
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>
              
              <div className="flex items-start relative z-10 mb-6">
                <div className="w-8 h-8 rounded-full bg-accu-tech-blue flex items-center justify-center mr-4">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div className="pt-1">
                  <h4 className="font-medium">{translate('orderPlaced')}</h4>
                  <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start relative z-10 mb-6">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <Package className="h-4 w-4 text-gray-500" />
                </div>
                <div className="pt-1">
                  <h4 className="font-medium">{translate('processing')}</h4>
                  <p className="text-sm text-gray-500">{translate('estimatedProcess')}</p>
                </div>
              </div>
              
              <div className="flex items-start relative z-10">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <TruckIcon className="h-4 w-4 text-gray-500" />
                </div>
                <div className="pt-1">
                  <h4 className="font-medium">{translate('shipping')}</h4>
                  <p className="text-sm text-gray-500">{translate('estimatedDelivery')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-sm text-gray-500 mb-6">
          {translate('orderConfirmationEmail')}
        </p>
        
        <Button 
          onClick={() => navigate('/home')}
          className="w-full rounded-full py-3"
        >
          <Home className="mr-2 h-4 w-4" />
          {translate('backToHome')}
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
