
export type LanguageCode = 'es' | 'pt' | 'it';

export type TranslateParams = { [key: string]: string | number };

export interface TranslationMap {
  [key: string]: string;
}
