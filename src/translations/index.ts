
import { LanguageCode, TranslationMap } from './types';
import { commonTranslations } from './common';
import { onboardingTranslations } from './onboarding';
import { productTranslations } from './product';
import { checkoutTranslations } from './checkout';
import { deliveryTranslations } from './delivery';
import { learnTranslations } from './learn';
import { shopifyTranslations } from './shopify';

// Merge all translation files
export const translations: Record<LanguageCode, TranslationMap> = {
  es: {
    ...commonTranslations.es,
    ...onboardingTranslations.es,
    ...productTranslations.es,
    ...checkoutTranslations.es,
    ...deliveryTranslations.es,
    ...learnTranslations.es,
    ...shopifyTranslations.es,
  },
  pt: {
    ...commonTranslations.pt,
    ...onboardingTranslations.pt,
    ...productTranslations.pt,
    ...checkoutTranslations.pt,
    ...deliveryTranslations.pt,
    ...learnTranslations.pt,
    ...shopifyTranslations.pt,
  },
  it: {
    ...commonTranslations.it,
    ...onboardingTranslations.it,
    ...productTranslations.it,
    ...checkoutTranslations.it,
    ...deliveryTranslations.it,
    ...learnTranslations.it,
    ...shopifyTranslations.it,
  },
  de: {
    ...commonTranslations.de,
    ...onboardingTranslations.it, // Need to create proper German translations for onboarding
    ...productTranslations.it, // Need to create proper German translations for product
    ...checkoutTranslations.de,
    ...deliveryTranslations.it, // Need to create proper German translations for delivery
    ...learnTranslations.it, // Need to create proper German translations for learn
    ...shopifyTranslations.de,
  }
};

export * from './types';
