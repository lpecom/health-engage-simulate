
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TranslatedTextProps {
  textKey: string;
  params?: { [key: string]: string | number };
  className?: string;
}

/**
 * A component that wraps text content with translation functionality
 * Use this to ensure consistent translation across the app
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  textKey, 
  params = {}, 
  className = ""
}) => {
  const { translate } = useLanguage();
  
  return (
    <span className={className}>
      {translate(textKey, params)}
    </span>
  );
};

export default TranslatedText;
