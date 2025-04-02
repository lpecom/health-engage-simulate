
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check, Globe } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="ml-1">{getLanguageName(language)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem onClick={() => setLanguage('es')} className="flex items-center justify-between">
          {translate('spanish')}
          {language === 'es' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('pt')} className="flex items-center justify-between">
          {translate('portuguese')}
          {language === 'pt' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('it')} className="flex items-center justify-between">
          {translate('italian')}
          {language === 'it' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('de')} className="flex items-center justify-between">
          {translate('german')}
          {language === 'de' && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
