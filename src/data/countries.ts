
// Portuguese districts
export const portugueseDistricts = [
  'Lisboa',
  'Porto',
  'Aveiro',
  'Beja',
  'Braga',
  'Bragança',
  'Castelo Branco',
  'Coimbra',
  'Évora',
  'Faro',
  'Guarda',
  'Leiria',
  'Portalegre',
  'Santarém',
  'Setúbal',
  'Viana do Castelo',
  'Vila Real',
  'Viseu',
  'Açores',
  'Madeira'
];

// Italian regions
export const italianRegions = [
  'Abruzzo',
  'Basilicata',
  'Calabria',
  'Campania',
  'Emilia-Romagna',
  'Friuli-Venezia Giulia',
  'Lazio',
  'Liguria',
  'Lombardia',
  'Marche',
  'Molise',
  'Piemonte',
  'Puglia',
  'Sardegna',
  'Sicilia',
  'Toscana',
  'Trentino-Alto Adige',
  'Umbria',
  'Valle d\'Aosta',
  'Veneto'
];

// Spanish provinces
export const spanishProvinces = [
  'Álava',
  'Albacete',
  'Alicante',
  'Almería',
  'Asturias',
  'Ávila',
  'Badajoz',
  'Barcelona',
  'Burgos',
  'Cáceres',
  'Cádiz',
  'Cantabria',
  'Castellón',
  'Ciudad Real',
  'Córdoba',
  'Cuenca',
  'Girona',
  'Granada',
  'Guadalajara',
  'Gipuzkoa',
  'Huelva',
  'Huesca',
  'Illes Balears',
  'Jaén',
  'A Coruña',
  'La Rioja',
  'Las Palmas',
  'León',
  'Lleida',
  'Lugo',
  'Madrid',
  'Málaga',
  'Murcia',
  'Navarra',
  'Ourense',
  'Palencia',
  'Pontevedra',
  'Salamanca',
  'Santa Cruz de Tenerife',
  'Segovia',
  'Sevilla',
  'Soria',
  'Tarragona',
  'Teruel',
  'Toledo',
  'Valencia',
  'Valladolid',
  'Bizkaia',
  'Zamora',
  'Zaragoza'
];

// Type definitions for country data
export interface Region {
  code: string;
  name: string;
  cities?: string[];
}

export interface CountryData {
  code: string;
  name: string;
  phoneRegex: RegExp;
  phoneFormat: string;
  regions: Region[];
}

// Create region objects from arrays
const portugueseRegions: Region[] = portugueseDistricts.map((district, index) => ({
  code: `PT-${index + 1}`,
  name: district,
  cities: [`${district} City`, `${district} Town`, `${district} Village`] // Example cities, replace with real data if available
}));

const italianRegionsData: Region[] = italianRegions.map((region, index) => ({
  code: `IT-${index + 1}`,
  name: region,
  cities: [`${region} City`, `${region} Town`, `${region} Village`] // Example cities, replace with real data if available
}));

const spanishRegions: Region[] = spanishProvinces.map((province, index) => ({
  code: `ES-${index + 1}`,
  name: province,
  cities: [`${province} City`, `${province} Town`, `${province} Village`] // Example cities, replace with real data if available
}));

// Main countries object
export const COUNTRIES: Record<string, CountryData> = {
  'PT': {
    code: 'PT',
    name: 'Portugal',
    phoneRegex: /^\+351\s\d{3}\s\d{3}\s\d{3}$/,
    phoneFormat: '+351 XXX XXX XXX',
    regions: portugueseRegions
  },
  'ES': {
    code: 'ES',
    name: 'España',
    phoneRegex: /^\+34\s\d{3}\s\d{3}\s\d{3}$/,
    phoneFormat: '+34 XXX XXX XXX',
    regions: spanishRegions
  },
  'IT': {
    code: 'IT',
    name: 'Italia',
    phoneRegex: /^\+39\s\d{3}\s\d{3}\s\d{3,4}$/,
    phoneFormat: '+39 XXX XXX XXXX',
    regions: italianRegionsData
  }
};

// Helper functions
export function getDefaultCountryByLanguage(language: string): string {
  switch (language) {
    case 'pt':
      return 'PT';
    case 'es':
      return 'ES';
    case 'it':
      return 'IT';
    default:
      return 'ES';
  }
}

export function getRegionLabel(countryCode: string): string {
  switch (countryCode) {
    case 'PT':
      return 'District';
    case 'ES':
      return 'Province';
    case 'IT':
      return 'Region';
    default:
      return 'Region';
  }
}
