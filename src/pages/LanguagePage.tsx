
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft } from "lucide-react";
import LanguageSelector from '@/components/LanguageSelector';
import { useToast } from "@/components/ui/use-toast";

const LanguagePage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSaveAndReturn = () => {
    toast({
      title: "Language Saved",
      description: "Your language preference has been updated.",
    });
    navigate(-1);
  };
  
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
          <LanguageSelector />
          
          <div className="mt-8">
            <Button 
              className="w-full"
              onClick={handleSaveAndReturn}
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
