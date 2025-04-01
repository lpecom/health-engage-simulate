
import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TranslatedTextProps {
  textKey: string;
  params?: { [key: string]: string | number };
  className?: string;
  fallback?: string;
}

/**
 * A component that wraps text content with translation functionality
 * Use this to ensure consistent translation across the app
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  textKey, 
  params = {}, 
  className = "",
  fallback
}) => {
  const { translate, language } = useLanguage();
  
  const translatedText = translate(textKey, params);
  
  // If translation returns the same key, it means translation is missing
  const isMissingTranslation = translatedText === textKey && !fallback;
  
  return (
    <span 
      className={`${className} ${isMissingTranslation ? 'text-red-500' : ''}`}
      data-testid={`translated-${textKey}`}
      key={`${textKey}-${language}`} // Add key to force re-render when language changes
    >
      {isMissingTranslation ? 
        (fallback || `[${textKey}]`) : 
        translatedText}
    </span>
  );
};

export default TranslatedText;
