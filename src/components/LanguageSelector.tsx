
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check, Globe } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LanguageCode } from "@/translations/types";

const countryFlags: Record<string, string> = {
  es: "🇪🇸",
  pt: "🇵🇹",
  it: "🇮🇹",
  de: "🇩🇪",
};

const countryNames: Record<string, string> = {
  es: "España",
  pt: "Portugal",
  it: "Italia",
  de: "Deutschland",
};

const LanguageSelector = () => {
  const { language, setLanguage, translate } = useLanguage();

  const getCountryName = (code: string) => {
    return countryNames[code] || code.toUpperCase();
  };

  // For standalone language selector page
  const renderStandalone = () => {
    return (
      <div className="w-full space-y-2">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/dda38d27-5b5f-40cb-a3e4-f87b713723e1.png" 
            alt="Accu-Tech Logo" 
            className="h-4 mx-auto" 
          />
        </div>
        
        <h2 className="text-2xl font-medium text-center text-accu-tech-blue mb-6">
          {translate('selectLanguage')}
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(countryFlags).map((langCode) => (
            <button
              key={langCode}
              onClick={() => setLanguage(langCode as LanguageCode)}
              className={`p-3 text-left flex items-center justify-between rounded-lg transition-colors ${
                language === langCode 
                  ? "bg-accu-tech-blue text-white" 
                  : "bg-white hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{countryFlags[langCode]}</span>
                <span className="text-lg">{getCountryName(langCode)}</span>
              </div>
              {language === langCode && <Check className="h-6 w-6" />}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // For dropdown in header
  const renderDropdown = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span className="ml-1">{getCountryName(language)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          {Object.keys(countryFlags).map((langCode) => (
            <DropdownMenuItem 
              key={langCode}
              onClick={() => setLanguage(langCode as LanguageCode)} 
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className="mr-2">{countryFlags[langCode]}</span>
                <span>{getCountryName(langCode)}</span>
              </div>
              {language === langCode && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Check if this is on the language page
  const isLanguagePage = window.location.pathname === "/language";
  
  return isLanguagePage ? renderStandalone() : renderDropdown();
};

export default LanguageSelector;
