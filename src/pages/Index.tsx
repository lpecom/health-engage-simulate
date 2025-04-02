
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageCode } from "@/translations/types";

const Index = () => {
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();
  const [showLanguageSelection, setShowLanguageSelection] = useState(true);

  useEffect(() => {
    if (!showLanguageSelection) {
      navigate("/home");
    }
  }, [showLanguageSelection, navigate]);

  const handleLanguageSelect = (langCode: LanguageCode) => {
    setLanguage(langCode);
    setShowLanguageSelection(false);
  };

  const languageOptions = [
    { code: 'es', name: 'España', flag: '🇪🇸' },
    { code: 'pt', name: 'Portugal', flag: '🇵🇹' },
    { code: 'it', name: 'Italia', flag: '🇮🇹' },
    { code: 'de', name: 'Deutschland', flag: '🇩🇪' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-accu-tech-lightest">
      {showLanguageSelection ? (
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-6">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/dda38d27-5b5f-40cb-a3e4-f87b713723e1.png" 
                alt="Accu-Tech Logo" 
                className="h-5 mx-auto mb-3" 
              />
            </div>
            <h1 className="text-2xl font-bold text-accu-tech-blue">Accu-Tech Healthineers</h1>
            <p className="text-lg text-gray-600 mt-2">
              Bienvenido a GlucoVista - Tu Solución de Monitoreo de Glucosa No Invasiva
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code as LanguageCode)}
                className="bg-white border border-gray-200 hover:bg-gray-50 rounded-lg p-3 text-left flex items-center transition-colors"
              >
                <span className="text-2xl mr-3">{lang.flag}</span>
                <span className="text-lg font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/dda38d27-5b5f-40cb-a3e4-f87b713723e1.png" 
              alt="Accu-Tech Logo" 
              className="h-5 mx-auto mb-3" 
            />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-accu-tech-blue">Accu-Tech Healthineers</h1>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default Index;
