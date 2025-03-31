
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Loader2, 
  Package,
  Calendar,
  PackageCheck,
  Clock
} from "lucide-react";

interface DeviceShippingStatusProps {
  onConnect?: () => void;
}

const DeviceShippingStatus: React.FC<DeviceShippingStatusProps> = ({
  onConnect
}) => {
  const { translate } = useLanguage();
  
  return (
    <Card className="mb-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center text-center px-6">
          <div className="relative">
            <Package className="h-12 w-12 text-medical-primary mb-4" />
            <div className="absolute -top-1 -right-1 bg-accu-tech-blue rounded-full p-1">
              <Loader2 className="h-4 w-4 text-white animate-spin" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-medical-dark mb-2">
            {translate('deviceOnTheWay')}
          </h3>
          
          {/* Device image added here */}
          <div className="my-3">
            <img 
              src="https://accu-tech.pro/wp-content/uploads/2024/08/device.png" 
              alt="GlucoVista Device" 
              className="w-40 h-auto rounded-lg shadow-md"
            />
          </div>
          
          <p className="text-sm text-gray-600 max-w-xs">
            {translate('yourDeviceIsBeingShipped')}
          </p>
          
          <div className="mt-6 w-full max-w-xs">
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full mb-2">
                <div className="h-2 bg-accu-tech-blue rounded-full" style={{ width: '40%' }}></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mb-6">
                <div className="flex flex-col items-center">
                  <Calendar className="h-4 w-4 mb-1 text-accu-tech-blue" />
                  <span>{translate('ordered')}</span>
                </div>
                
                <div className="flex flex-col items-center text-accu-tech-blue font-medium">
                  <Package className="h-4 w-4 mb-1" />
                  <span>{translate('shipping')}</span>
                </div>
                
                <div className="flex flex-col items-center text-gray-400">
                  <PackageCheck className="h-4 w-4 mb-1" />
                  <span>{translate('delivered')}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-xs text-accu-tech-blue">
                <Clock className="h-4 w-4" />
                <span>{translate('estimatedDelivery')}: 3-5 {translate('days')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
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
            onClick={onConnect}
          >
            {translate('connectDevice')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceShippingStatus;
