
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check, Globe } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const countryFlags: Record<string, string> = {
  es: "🇪🇸",
  pt: "🇵🇹",
  it: "🇮🇹",
  de: "🇩🇪",
};

const LanguageSelector = () => {
  const { language, setLanguage, translate } = useLanguage();

  const getLanguageName = (code: string) => {
    switch (code) {
      case 'es': return translate('spanish');
      case 'pt': return translate('portuguese');
      case 'it': return translate('italian');
      case 'de': return translate('german');
      default: return code.toUpperCase();
    }
  };

  // For standalone language selector page
  const renderStandalone = () => {
    return (
      <div className="w-full space-y-2">
        <h2 className="text-2xl font-medium text-center text-accu-tech-blue mb-6">
          {translate('selectLanguage')}
        </h2>
        
        {Object.keys(countryFlags).map((langCode) => (
          <button
            key={langCode}
            onClick={() => setLanguage(langCode)}
            className={`w-full p-4 text-left flex items-center justify-between rounded-lg transition-colors ${
              language === langCode 
                ? "bg-accu-tech-blue text-white" 
                : "bg-white hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{countryFlags[langCode]}</span>
              <span className="text-lg">{getLanguageName(langCode)}</span>
            </div>
            {language === langCode && <Check className="h-6 w-6" />}
          </button>
        ))}
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
            <span className="ml-1">{getLanguageName(language)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          {Object.keys(countryFlags).map((langCode) => (
            <DropdownMenuItem 
              key={langCode}
              onClick={() => setLanguage(langCode)} 
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className="mr-2">{countryFlags[langCode]}</span>
                <span>{getLanguageName(langCode)}</span>
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
