
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import TranslatedText from "@/components/TranslatedText";
import { 
  Loader2, 
  Package,
  Calendar,
  Clock,
  Truck,
  MapPin,
  CreditCard
} from "lucide-react";

interface DeviceShippingStatusProps {
  onConnect?: () => void;
}

const DeviceShippingStatus: React.FC<DeviceShippingStatusProps> = ({
  onConnect
}) => {
  const { language } = useLanguage();
  
  // Calculate estimated delivery date (24-48 hours from now)
  const getDeliveryDate = () => {
    const now = new Date();
    const minDelivery = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const maxDelivery = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString(language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-BR' : 'en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    };
    
    return `${formatDate(minDelivery)} - ${formatDate(maxDelivery)}`;
  };
  
  return (
    <div className="space-y-4 mb-4">
      {/* Shipping Status Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="animate-pulse flex flex-col items-center text-center px-2 w-full">
            <div className="relative">
              <Package className="h-12 w-12 text-medical-primary mb-4" />
              <div className="absolute -top-1 -right-1 bg-accu-tech-blue rounded-full p-1">
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-medical-dark mb-2">
              <TranslatedText textKey="deviceOnTheWay" />
            </h3>
            
            {/* Device image added here */}
            <div className="my-3">
              <img 
                src="https://accu-tech.pro/wp-content/uploads/2024/08/device.png" 
                alt="GlucoVista Device" 
                className="w-40 h-auto rounded-lg shadow-md"
              />
            </div>
            
            <p className="text-sm text-gray-600 mb-3 max-w-xs">
              <TranslatedText textKey="yourDeviceIsBeingShipped" />
            </p>
            
            {/* Detailed shipping timeline */}
            <div className="mt-3 mb-6 w-full">
              <Progress value={40} className="h-2 mb-2" />
              
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-accu-tech-blue flex items-center justify-center mb-1">
                    <Calendar className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-accu-tech-blue font-medium">
                    <TranslatedText textKey="ordered" />
                  </span>
                  <span className="text-[10px] text-gray-400">
                    <TranslatedText textKey="completed" />
                  </span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-accu-tech-blue flex items-center justify-center mb-1">
                    <Truck className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-accu-tech-blue font-medium">
                    <TranslatedText textKey="shipping" />
                  </span>
                  <span className="text-[10px] text-gray-400">
                    <TranslatedText textKey="inProgress" />
                  </span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mb-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                  <span className="text-gray-400">
                    <TranslatedText textKey="delivered" />
                  </span>
                  <span className="text-[10px] text-gray-400">
                    <TranslatedText textKey="pending" />
                  </span>
                </div>
              </div>
            </div>
            
            {/* Delivery information */}
            <div className="bg-gray-50 w-full rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-accu-tech-blue mr-2" />
                  <span className="text-xs font-medium">
                    <TranslatedText textKey="estimatedDelivery" />:
                  </span>
                </div>
                <span className="text-xs font-semibold">{getDeliveryDate()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-accu-tech-blue mr-2" />
                  <span className="text-xs font-medium">
                    <TranslatedText textKey="paymentMethod" />:
                  </span>
                </div>
                <span className="text-xs font-semibold">
                  <TranslatedText textKey="cashOnDelivery" />
                </span>
              </div>
            </div>
            
            {/* Delivery steps */}
            <div className="w-full">
              <h4 className="text-sm font-medium text-left mb-2">
                <TranslatedText textKey="whatToExpect" />:
              </h4>
              <ol className="text-xs text-left text-gray-600 space-y-2 list-decimal pl-4">
                <li><TranslatedText textKey="courierContact" /></li>
                <li><TranslatedText textKey="preparePayment" /></li>
                <li><TranslatedText textKey="inspectDevice" /></li>
                <li><TranslatedText textKey="followSetupInstructions" /></li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connect Device Card */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-medium mb-4">
            <TranslatedText textKey="connectYourDevice" />
          </h2>
          
          {/* Added device image above serial number */}
          <div className="flex justify-center mb-4">
            <img 
              src="https://accu-tech.pro/wp-content/uploads/2024/08/device.png" 
              alt="GlucoVista Device" 
              className="w-32 h-auto rounded-lg shadow-md"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <TranslatedText textKey="deviceSerialNumber" />
              </label>
              <Input 
                placeholder={<TranslatedText textKey="enterSerialNumber" />} 
                disabled
              />
            </div>
            
            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
              <li><TranslatedText textKey="turnOnYourDevice" /></li>
              <li><TranslatedText textKey="enableBluetooth" /></li>
              <li><TranslatedText textKey="enterSerialAndConnect" /></li>
            </ol>
            
            <Button 
              className="w-full" 
              disabled
              onClick={onConnect}
            >
              <TranslatedText textKey="connectDevice" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceShippingStatus;
