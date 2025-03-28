
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const LanguageSelector = () => {
  const { language, translate } = useLanguage();

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto">
      <h2 className="text-lg font-medium mb-4">{translate('selectLanguage')}</h2>
      
      <div className="grid grid-cols-1 gap-3 w-full">
        <Button
          variant={language === 'es' ? "default" : "outline"}
          className="relative px-6 py-6 h-auto flex justify-between items-center"
          disabled
        >
          <span className="text-lg">{translate('spanish')}</span>
          {language === 'es' && <Check className="h-5 w-5 ml-2" />}
        </Button>
        
        <Button
          variant={language === 'pt' ? "default" : "outline"}
          className="relative px-6 py-6 h-auto flex justify-between items-center"
          disabled
        >
          <span className="text-lg">{translate('portuguese')}</span>
          {language === 'pt' && <Check className="h-5 w-5 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default LanguageSelector;
