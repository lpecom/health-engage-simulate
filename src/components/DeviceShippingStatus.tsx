
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Package, Calendar, PackageCheck, Clock, Truck, MapPin, CreditCard, CheckCircle } from "lucide-react";

interface DeviceShippingStatusProps {
  onConnect?: () => void;
  orderDetails?: any;
}

const DeviceShippingStatus: React.FC<DeviceShippingStatusProps> = ({
  onConnect,
  orderDetails
}) => {
  const { translate } = useLanguage();

  // Calculate estimated delivery date (24-48 hours from now)
  const getDeliveryDate = () => {
    const now = new Date();
    const minDelivery = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const maxDelivery = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const formatDate = (date: Date) => {
      return date.toLocaleDateString(undefined, {
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
              {translate('deviceOnTheWay')}
            </h3>
            
            {/* Device image added here */}
            <div className="my-3">
              <img alt="GlucoVista Device" className="w-40 h-auto rounded-lg shadow-md" src="https://h00ktt-1h.myshopify.com/cdn/shop/files/Remove-bg.ai_1724344152542.png" />
            </div>
            
            <p className="text-sm text-gray-600 mb-3 max-w-xs">
              {translate('yourDeviceIsBeingShipped')}
            </p>
            
            {/* Detailed shipping timeline */}
            <div className="mt-3 mb-6 w-full">
              <Progress value={40} className="h-2 mb-2" />
              
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-accu-tech-blue flex items-center justify-center mb-1">
                    <Calendar className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-accu-tech-blue font-medium">{translate('ordered')}</span>
                  <span className="text-[10px] text-gray-400">{translate('completed')}</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-accu-tech-blue flex items-center justify-center mb-1">
                    <Truck className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-accu-tech-blue font-medium">{translate('shipping')}</span>
                  <span className="text-[10px] text-gray-400">{translate('inProgress')}</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mb-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                  <span className="text-gray-400">{translate('delivered')}</span>
                  <span className="text-[10px] text-gray-400">{translate('pending')}</span>
                </div>
              </div>
            </div>
            
            {/* Delivery information */}
            <div className="bg-gray-50 w-full rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-accu-tech-blue mr-2" />
                  <span className="text-xs font-medium">{translate('estimatedDelivery')}:</span>
                </div>
                <span className="text-xs font-semibold">{getDeliveryDate()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-accu-tech-blue mr-2" />
                  <span className="text-xs font-medium">{translate('paymentMethod')}:</span>
                </div>
                <span className="text-xs font-semibold">{translate('cashOnDelivery')}</span>
              </div>
            </div>
            
            {/* Delivery steps */}
            <div className="w-full">
              <h4 className="text-sm font-medium text-left mb-2">{translate('whatToExpect')}:</h4>
              <ol className="text-xs text-left text-gray-600 space-y-2 list-decimal pl-4">
                <li>{translate('courierContact')}</li>
                <li>{translate('preparePayment')}</li>
                <li>{translate('inspectDevice')}</li>
                <li>{translate('followSetupInstructions')}</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Section */}
      {orderDetails && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">{translate('orderConfirmation')}</h2>
              <span className="text-sm text-gray-500">
                {new Date(orderDetails.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{translate('orderReceived')}</span>
              </div>
              <p className="text-sm text-green-600 mt-1">{translate('orderConfirmedMessage')}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">{translate('orderSummary')}</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{orderDetails.product_name}</p>
                      <p className="text-xs text-gray-500">
                        {orderDetails.product_quantity} {orderDetails.product_quantity > 1 ? translate('units') : translate('unit')}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <p className="font-medium">€{orderDetails.total_price}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">{translate('shippingDetails')}</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium">{orderDetails.customer_name} {orderDetails.customer_surname || ''}</p>
                  <p className="text-sm text-gray-600">{orderDetails.customer_address}</p>
                  <p className="text-sm text-gray-600">{orderDetails.zip_code}, {orderDetails.city}</p>
                  <p className="text-sm text-gray-600">{orderDetails.province}</p>
                  <p className="text-sm text-gray-600 mt-1">{orderDetails.customer_phone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">{translate('paymentMethod')}</h3>
                <p className="bg-gray-50 rounded-lg p-3 text-gray-700">
                  {orderDetails.payment_method === 'COD' ? translate('cashOnDelivery') : orderDetails.payment_method}
                </p>
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{translate('orderStatus')}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    orderDetails.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                    orderDetails.status === 'shipped' ? 'bg-green-100 text-green-800' :
                    orderDetails.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {translate(orderDetails.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">{translate('orderID')}</span>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {orderDetails.id.substring(0, 8)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connect Device Card */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-medium mb-4">{translate('connectYourDevice')}</h2>
          
          {/* Device image showing the serial number location */}
          <div className="flex justify-center mb-4">
            <img src="/lovable-uploads/1cac334f-02fc-428e-882f-8bf9125e8be3.png" alt="Device Serial Number Location" className="w-full h-auto rounded-lg shadow-md" />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translate('deviceSerialNumber')}
              </label>
              <Input placeholder={translate('enterSerialNumber')} disabled />
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-yellow-800">
                {translate('serialNumberLocationInfo') || "The serial number (SN) can be found on the back of your device as shown in the image above."}
              </p>
            </div>
            
            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
              <li>{translate('turnOnYourDevice')}</li>
              <li>{translate('enableBluetooth')}</li>
              <li>{translate('enterSerialAndConnect')}</li>
            </ol>
            
            <Button className="w-full" disabled onClick={onConnect}>
              {translate('connectDevice')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceShippingStatus;
