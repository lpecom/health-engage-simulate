
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import DeviceShippingStatus from '@/components/DeviceShippingStatus';
import LanguageSelector from '@/components/LanguageSelector';
import { Home, Bluetooth } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const DeviceConnectionPage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="gradient-medical text-white px-4 pt-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white p-0 hover:bg-transparent" 
              onClick={() => navigate('/home')}
            >
              <Home className="h-5 w-5 mr-1" />
            </Button>
          </div>
          <div className="flex justify-center flex-1">
            <img 
              src="/lovable-uploads/dda38d27-5b5f-40cb-a3e4-f87b713723e1.png" 
              alt="Accu-Tech Logo" 
              className="h-5 object-contain" 
            />
          </div>
          <div className="flex justify-end flex-1">
            <LanguageSelector />
          </div>
        </div>
        
        <h1 className="text-xl font-semibold text-center">
          {translate('deviceConnection') || 'Device Connection'}
        </h1>
      </div>
      
      {/* Main Content - Now using DeviceShippingStatus component instead of BluetoothConnection */}
      <div className="px-4 pt-4 pb-20">
        <DeviceShippingStatus />
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex justify-around">
          <Button 
            variant="ghost" 
            className="flex flex-col items-center" 
            onClick={() => navigate('/home')}
          >
            <Home className="h-5 w-5 text-gray-500" />
            <span className="text-xs mt-1 text-gray-500">{translate('home') || 'Home'}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex flex-col items-center" 
            onClick={() => navigate('/device')}
          >
            <Bluetooth className="h-5 w-5 text-medical-primary" />
            <span className="text-xs mt-1 text-medical-primary">{translate('device') || 'Device'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeviceConnectionPage;
