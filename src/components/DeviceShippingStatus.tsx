
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Loader2, 
  Package,
  Calendar,
  PackageCheck,
  Clock,
  Truck,
  CheckCircle
} from "lucide-react";

interface DeviceShippingStatusProps {
  onConnect?: () => void;
}

const DeviceShippingStatus: React.FC<DeviceShippingStatusProps> = ({
  onConnect
}) => {
  const { translate } = useLanguage();
  
  return (
    <Card className="mb-6 overflow-hidden relative shadow-lg border-accu-tech-blue/10">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-accu-tech-lightest z-10">
        <div className="flex flex-col items-center text-center px-6 py-8">
          <div className="relative mb-2">
            <div className="h-16 w-16 bg-accu-tech-blue/10 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-accu-tech-blue" />
            </div>
            <div className="absolute -top-1 -right-1 bg-accu-tech-blue rounded-full p-1.5 shadow-md">
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-accu-tech-blue mb-2">
            {translate('deviceOnTheWay')}
          </h3>
          
          <p className="text-sm text-gray-600 max-w-xs mb-6">
            {translate('yourDeviceIsBeingShipped')}
          </p>
          
          <div className="w-full max-w-xs mb-4">
            <div className="relative">
              <Progress className="h-2 bg-gray-200" value={40} />
              
              <div className="flex justify-between text-xs text-gray-500 mt-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-accu-tech-blue/10 flex items-center justify-center mb-1">
                    <CheckCircle className="h-4 w-4 text-accu-tech-blue" />
                  </div>
                  <span>{translate('ordered')}</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-accu-tech-blue flex items-center justify-center mb-1">
                    <Truck className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-accu-tech-blue font-medium">{translate('shipping')}</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mb-1">
                    <PackageCheck className="h-4 w-4 text-gray-400" />
                  </div>
                  <span className="text-gray-400">{translate('delivered')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm bg-accu-tech-blue/10 py-2 px-4 rounded-full mb-6">
            <Clock className="h-4 w-4 text-accu-tech-blue" />
            <span className="text-accu-tech-blue font-medium">{translate('estimatedDelivery')}: 3-5 {translate('days')}</span>
          </div>
          
          <div className="w-full max-w-xs bg-white rounded-lg shadow-md p-4 border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span className="font-medium text-gray-800">{translate('prepareForArrival')}</span>
            </div>
            
            <p className="text-xs text-gray-600 mb-3">
              {translate('connectYourDeviceWhenArrives')}
            </p>
            
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs flex-1 border-accu-tech-blue/30 text-accu-tech-blue hover:bg-accu-tech-blue/10"
                onClick={() => window.open('/learn/how-it-works', '_blank')}
              >
                {translate('learnMore')}
              </Button>
              
              <Button 
                size="sm"
                className="text-xs flex-1 bg-accu-tech-blue hover:bg-accu-tech-blue/90"
                onClick={() => {}}
              >
                {translate('trackShipment')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4 opacity-0">
        {/* This content is invisible but maintains the card height */}
        <h2 className="text-lg font-medium mb-4">{translate('connectYourDevice')}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate('deviceSerialNumber')}
            </label>
            <Input 
              placeholder={translate('enterSerialNumber')} 
              disabled
            />
          </div>
          
          <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
            <li>{translate('turnOnYourDevice')}</li>
            <li>{translate('enableBluetooth')}</li>
            <li>{translate('enterSerialAndConnect')}</li>
          </ol>
          
          <Button 
            className="w-full" 
            disabled
          >
            {translate('connectDevice')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceShippingStatus;
