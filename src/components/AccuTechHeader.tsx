
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AccuTechHeaderProps {
  title?: string;
  showLogo?: boolean;
}

const AccuTechHeader: React.FC<AccuTechHeaderProps> = ({ 
  title,
  showLogo = true
}) => {
  const { translate } = useLanguage();
  
  return (
    <div className="w-full py-4">
      <div className="container flex items-center justify-between">
        {showLogo && (
          <div className="flex items-center">
            <img 
              src="https://accu-tech.pro/wp-content/uploads/2024/08/Accu-Tech-1.png" 
              alt="Accu-Tech" 
              className="h-12"
            />
          </div>
        )}
        {title && <h1 className="text-xl font-semibold text-accutech-dark">{title}</h1>}
      </div>
    </div>
  );
};

export default AccuTechHeader;
