
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

// Region interface for structured region data
export interface Region {
  code: string;
  name: string;
  cities?: string[];
}

// Country-specific data including dial codes and pricing
export interface CountryData {
  code: string;
  name: string;
  dialCode: string;
  format: string;
  phoneFormat: string;
  regions: Region[];
  phoneRegex: RegExp;
  shipping: number;
  shippingCost: number; // Alias for shipping to maintain compatibility
  currency: string;
  vatRate: number;
  productPrice: number;
  formatPhoneNumber: (phone: string) => string;
}

// Country codes map
export interface CountryMap {
  [key: string]: CountryData;
}

// Helper function to format Spanish phone numbers
const formatSpanishPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if it already has country code
  if (digitsOnly.startsWith('34')) {
    return `+${digitsOnly}`;
  }
  
  // Add country code if not present
  return `+34${digitsOnly}`;
};

// Helper function to format Portuguese phone numbers
const formatPortuguesePhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if it already has country code
  if (digitsOnly.startsWith('351')) {
    return `+${digitsOnly}`;
  }
  
  // Add country code if not present
  return `+351${digitsOnly}`;
};

// Helper function to format Italian phone numbers
const formatItalianPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if it already has country code
  if (digitsOnly.startsWith('39')) {
    return `+${digitsOnly}`;
  }
  
  // Add country code if not present
  return `+39${digitsOnly}`;
};

// Convert simple region arrays to structured regions
const structuredSpanishRegions = spanishProvinces.map(province => {
  const code = province.split(':')[0].trim();
  const name = province.split(':')[1].trim();
  return {
    code,
    name,
    cities: [`${name} Town`, `${name} City`, `${name} Village`] // Sample cities for demo
  };
});

const structuredPortugueseRegions = portugueseDistricts.map((district, index) => {
  return {
    code: `PT-${index + 1}`,
    name: district,
    cities: [`${district} Town`, `${district} City`, `${district} Village`] // Sample cities for demo
  };
});

const structuredItalianRegions = italianRegions.map((region, index) => {
  return {
    code: `IT-${index + 1}`,
    name: region,
    cities: [`${region} Town`, `${region} City`, `${region} Village`] // Sample cities for demo
  };
});

// Export country codes map with structured regions
export const COUNTRIES: CountryMap = {
  'ES': {
    code: 'ES',
    name: 'España',
    dialCode: '+34',
    format: '+34 XXX XXX XXX',
    phoneFormat: '+34 XXX XXX XXX',
    regions: structuredSpanishRegions,
    phoneRegex: /^\+34[6-9]\d{8}$/,
    shipping: 3,
    shippingCost: 3,
    currency: 'EUR',
    vatRate: 21,
    productPrice: 49,
    formatPhoneNumber: formatSpanishPhone
  },
  'PT': {
    code: 'PT',
    name: 'Portugal',
    dialCode: '+351',
    format: '+351 XXX XXX XXX',
    phoneFormat: '+351 XXX XXX XXX',
    regions: structuredPortugueseRegions,
    phoneRegex: /^\+351[9]\d{8}$/,
    shipping: 3,
    shippingCost: 3,
    currency: 'EUR',
    vatRate: 23,
    productPrice: 49,
    formatPhoneNumber: formatPortuguesePhone
  },
  'IT': {
    code: 'IT',
    name: 'Italia',
    dialCode: '+39',
    format: '+39 XXX XXX XXXX',
    phoneFormat: '+39 XXX XXX XXXX',
    regions: structuredItalianRegions,
    phoneRegex: /^\+39[3]\d{9}$/,
    shipping: 5,
    shippingCost: 5,
    currency: 'EUR',
    vatRate: 22,
    productPrice: 59,
    formatPhoneNumber: formatItalianPhone
  }
};

// Helper function to format a phone number according to country
export function formatPhoneForCountry(phone: string, countryCode: string): string {
  if (!phone || !countryCode || !COUNTRIES[countryCode]) {
    return phone;
  }
  
  return COUNTRIES[countryCode].formatPhoneNumber(phone);
}

// Helper function to validate phone number by country
export function isValidPhoneForCountry(phone: string, countryCode: string): boolean {
  if (!phone || !countryCode || !COUNTRIES[countryCode]) {
    return false;
  }
  
  return COUNTRIES[countryCode].phoneRegex.test(phone);
}

// Helper function to get default country based on language
export function getDefaultCountryByLanguage(language: string): string {
  switch(language) {
    case 'es': return 'ES';
    case 'pt': return 'PT';
    case 'it': return 'IT';
    default: return 'ES';
  }
}

// Helper function to get region label based on language
export function getRegionLabel(countryCode: string): string {
  switch(countryCode) {
    case 'ES': return 'Provincia';
    case 'PT': return 'Distrito';
    case 'IT': return 'Regione';
    default: return 'Region';
  }
}

// Export country list for dropdowns
export const COUNTRY_LIST = Object.values(COUNTRIES).map(country => ({
  code: country.code,
  name: country.name
}));
