
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft } from "lucide-react";
import LanguageSelector from '@/components/LanguageSelector';

const LanguagePage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-medical text-white px-4 pt-12 pb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 bg-white/10 hover:bg-white/20 rounded-full h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{translate('language')}</h1>
        </div>
      </div>
      
      <div className="px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/dda38d27-5b5f-40cb-a3e4-f87b713723e1.png" 
              alt="Accu-Tech Logo" 
              className="h-6" 
            />
          </div>
          
          <h1 className="text-3xl font-bold text-center text-accu-tech-blue mb-3">
            Accu-Tech Healthineers
          </h1>
          
          <p className="text-center text-gray-600 mb-8">
            {translate('welcomeToGlucoVista')}
          </p>
          
          <LanguageSelector />
          
          <div className="mt-8">
            <Button 
              className="w-full bg-accu-tech-blue hover:bg-accu-tech-dark-blue"
              onClick={() => navigate(-1)}
            >
              {translate('saveAndReturn')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguagePage;
