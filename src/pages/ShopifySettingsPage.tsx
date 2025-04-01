
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShopifySettings from '@/components/ShopifySettings';
import { useLanguage } from '@/contexts/LanguageContext';

const ShopifySettingsPage = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">{translate('shopifySettings')}</h1>
        
        <ShopifySettings />
        
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">{translate('shopifyHelp1')}</p>
          <p>{translate('shopifyHelp2')}</p>
        </div>
      </div>
    </div>
  );
};

export default ShopifySettingsPage;
