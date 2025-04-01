
// Portuguese districts
export const portugueseDistricts = [
  'Lisboa', 'Porto', 'Braga', 'Aveiro', 'Leiria', 'Faro', 'Coimbra', 
  'Setúbal', 'Viseu', 'Viana do Castelo', 'Vila Real', 'Guarda'
];

// Italian regions
export const italianRegions = [
  'Lombardia', 'Lazio', 'Toscana', 'Sicilia', 'Veneto', 'Campania',
  'Emilia-Romagna', 'Piemonte', 'Puglia', 'Calabria', 'Sardegna'
];

// Spanish provinces
export const spanishProvinces = [
  'ES-01: Álava', 'ES-02: Albacete', 'ES-03: Alicante', 'ES-04: Almería', 'ES-05: Ávila',
  'ES-06: Badajoz', 'ES-07: Baleares', 'ES-08: Barcelona', 'ES-09: Burgos', 'ES-10: Cáceres',
  'ES-11: Cádiz', 'ES-12: Castellón', 'ES-13: Ciudad Real', 'ES-14: Córdoba', 'ES-15: Coruña',
  'ES-16: Cuenca', 'ES-17: Gerona', 'ES-18: Granada', 'ES-19: Guadalajara', 'ES-20: Guipúzcoa',
  'ES-21: Huelva', 'ES-22: Huesca', 'ES-23: Jaén', 'ES-24: León', 'ES-25: Lérida',
  'ES-26: La Rioja', 'ES-27: Lugo', 'ES-28: Madrid', 'ES-29: Málaga', 'ES-30: Murcia',
  'ES-31: Navarra', 'ES-32: Orense', 'ES-33: Asturias', 'ES-34: Palencia', 'ES-35: Las Palmas',
  'ES-36: Pontevedra', 'ES-37: Salamanca', 'ES-38: Santa Cruz de Tenerife', 'ES-39: Cantabria', 'ES-40: Segovia',
  'ES-41: Sevilla', 'ES-42: Soria', 'ES-43: Tarragona', 'ES-44: Teruel', 'ES-45: Toledo',
  'ES-46: Valencia', 'ES-47: Valladolid', 'ES-48: Vizcaya', 'ES-49: Zamora', 'ES-50: Zaragoza',
  'ES-51: Ceuta', 'ES-52: Melilla'
];

// Country-specific data including dial codes and pricing
export interface CountryData {
  dialCode: string;
  format: string;
  regions: string[];
  phoneRegex?: RegExp;
  shipping?: number;
  currency?: string;
  vatRate?: number;
}

// Country codes map
export interface CountryMap {
  [key: string]: CountryData;
}

// Export country codes map
export const COUNTRIES: CountryMap = {
  'ES': {
    dialCode: '+34',
    format: '+34 XXX XXX XXX',
    regions: spanishProvinces,
    phoneRegex: /^(\+34)?\s?[6-9]\d{8}$/,
    shipping: 3,
    currency: 'EUR',
    vatRate: 21
  },
  'PT': {
    dialCode: '+351',
    format: '+351 XXX XXX XXX',
    regions: portugueseDistricts,
    phoneRegex: /^(\+351)?\s?9[1236]\d{7}$/,
    shipping: 3,
    currency: 'EUR',
    vatRate: 23
  },
  'IT': {
    dialCode: '+39',
    format: '+39 XXX XXX XXXX',
    regions: italianRegions,
    phoneRegex: /^(\+39)?\s?3\d{9}$/,
    shipping: 5,
    currency: 'EUR',
    vatRate: 22
  }
};

// Helper function to format a phone number according to country
export function formatPhoneForCountry(phone: string, countryCode: string): string {
  if (!phone || !countryCode || !COUNTRIES[countryCode]) {
    return phone;
  }
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Add dial code if not present
  const dialCode = COUNTRIES[countryCode].dialCode.replace('+', '');
  if (!digitsOnly.startsWith(dialCode)) {
    return `+${dialCode}${digitsOnly}`;
  }
  
  // Add plus if not present
  if (phone.startsWith(dialCode) && !phone.startsWith('+')) {
    return `+${phone}`;
  }
  
  // Already formatted correctly
  return phone.startsWith('+') ? phone : `+${digitsOnly}`;
}

// Helper function to validate phone number by country
export function isValidPhoneForCountry(phone: string, countryCode: string): boolean {
  if (!phone || !countryCode || !COUNTRIES[countryCode]) {
    return false;
  }
  
  // If country has a regex pattern, use it
  if (COUNTRIES[countryCode].phoneRegex) {
    return COUNTRIES[countryCode].phoneRegex.test(phone);
  }
  
  // Fallback validation - at least country code + 7 digits
  const minLength = COUNTRIES[countryCode].dialCode.length + 7;
  return phone.replace(/\D/g, '').length >= minLength;
}
