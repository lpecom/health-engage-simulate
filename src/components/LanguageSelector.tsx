
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const LanguageSelector = () => {
  const { language, setLanguage, translate } = useLanguage();
  const { toast } = useToast();

  // Notify about language change
  const handleLanguageChange = (newLang: string) => {
    if (newLang !== language) {
      setLanguage(newLang);
      toast({
        title: translate('languageChanged'),
        description: newLang === 'en' ? 'Language changed to English' : 
                     newLang === 'es' ? 'Idioma cambiado a Español' : 
                     'Idioma alterado para Português',
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto">
      <h2 className="text-lg font-medium mb-4 text-accu-tech-blue">{translate('selectLanguage')}</h2>
      
      <div className="grid grid-cols-1 gap-3 w-full">
        <Button
          variant={language === 'en' ? "default" : "outline"}
          className={`relative px-6 py-6 h-auto flex justify-between items-center ${
            language === 'en' ? 'bg-accu-tech-blue hover:bg-accu-tech-dark-blue' : ''
          }`}
          onClick={() => handleLanguageChange('en')}
        >
          <span className="text-lg">{translate('english')}</span>
          {language === 'en' && <Check className="h-5 w-5 ml-2" />}
        </Button>
        
        <Button
          variant={language === 'es' ? "default" : "outline"}
          className={`relative px-6 py-6 h-auto flex justify-between items-center ${
            language === 'es' ? 'bg-accu-tech-blue hover:bg-accu-tech-dark-blue' : ''
          }`}
          onClick={() => handleLanguageChange('es')}
        >
          <span className="text-lg">{translate('spanish')}</span>
          {language === 'es' && <Check className="h-5 w-5 ml-2" />}
        </Button>
        
        <Button
          variant={language === 'pt' ? "default" : "outline"}
          className={`relative px-6 py-6 h-auto flex justify-between items-center ${
            language === 'pt' ? 'bg-accu-tech-blue hover:bg-accu-tech-dark-blue' : ''
          }`}
          onClick={() => handleLanguageChange('pt')}
        >
          <span className="text-lg">{translate('portuguese')}</span>
          {language === 'pt' && <Check className="h-5 w-5 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default LanguageSelector;
