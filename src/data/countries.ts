
// Define country-specific region data and phone validation

export type CountryCode = 'ES' | 'PT' | 'IT' | 'DE';

export interface Region {
  name: string;
  code?: string;
  cities?: string[];
}

export interface CountryData {
  name: string;
  currency: string;
  productPrice: number;
  shippingCost: number;
  phoneFormat: string;
  phoneRegex: RegExp;
  formatPhoneNumber: (phone: string) => string;
  regions: Region[];
}

export const COUNTRIES: Record<CountryCode, CountryData> = {
  'ES': {
    name: 'España',
    currency: '€',
    productPrice: 49.99,
    shippingCost: 3.00,
    phoneFormat: '612345678',
    phoneRegex: /^[6-9]\d{8}$/,
    formatPhoneNumber: (phone: string) => {
      // Clean the phone number first
      let cleaned = phone.replace(/[^\d+]/g, '');
      
      // Format for Spain
      if (cleaned.startsWith('+34')) {
        return cleaned;
      } else if (cleaned.startsWith('34')) {
        return `+${cleaned}`;
      }
      return `+34${cleaned}`;
    },
    regions: spanishProvinces
  },
  'PT': {
    name: 'Portugal',
    currency: '€',
    productPrice: 49.99,
    shippingCost: 4.50,
    phoneFormat: '912345678',
    phoneRegex: /^9\d{8}$/,
    formatPhoneNumber: (phone: string) => {
      // Clean the phone number first
      let cleaned = phone.replace(/[^\d+]/g, '');
      
      // Format for Portugal
      if (cleaned.startsWith('+351')) {
        return cleaned;
      } else if (cleaned.startsWith('351')) {
        return `+${cleaned}`;
      }
      return `+351${cleaned}`;
    },
    regions: portugueseDistricts
  },
  'IT': {
    name: 'Italia',
    currency: '€',
    productPrice: 49.99,
    shippingCost: 5.00,
    phoneFormat: '3123456789',
    phoneRegex: /^3\d{9}$/,
    formatPhoneNumber: (phone: string) => {
      // Clean the phone number first
      let cleaned = phone.replace(/[^\d+]/g, '');
      
      // Format for Italy
      if (cleaned.startsWith('+39')) {
        return cleaned;
      } else if (cleaned.startsWith('39')) {
        return `+${cleaned}`;
      }
      return `+39${cleaned}`;
    },
    regions: italianRegions
  },
  'DE': {
    name: 'Deutschland',
    currency: '€',
    productPrice: 49.99,
    shippingCost: 5.50,
    phoneFormat: '1512345678',
    phoneRegex: /^1[5-7]\d{8,9}$/,
    formatPhoneNumber: (phone: string) => {
      // Clean the phone number first
      let cleaned = phone.replace(/[^\d+]/g, '');
      
      // Format for Germany
      if (cleaned.startsWith('+49')) {
        return cleaned;
      } else if (cleaned.startsWith('49')) {
        return `+${cleaned}`;
      }
      return `+49${cleaned}`;
    },
    regions: germanStates
  }
};

export const getCountryName = (code: CountryCode): string => {
  return COUNTRIES[code].name;
};

export const getDefaultCountryByLanguage = (language: string): CountryCode => {
  switch(language) {
    case 'pt': return 'PT';
    case 'it': return 'IT';
    case 'de': return 'DE';
    case 'es': 
    default: 
      return 'ES';
  }
};

export const getRegionLabel = (countryCode: CountryCode): string => {
  switch(countryCode) {
    case 'ES': return 'Provincia';
    case 'PT': return 'Distrito';
    case 'IT': return 'Regione';
    case 'DE': return 'Bundesland';
    default: return 'Region';
  }
};

export const spanishProvinces: Region[] = [
  { name: 'Álava', cities: ['Vitoria-Gasteiz', 'Amurrio', 'Salvatierra'] },
  { name: 'Albacete', cities: ['Albacete', 'Hellín', 'Almansa'] },
  { name: 'Alicante', cities: ['Alicante', 'Elche', 'Benidorm', 'Torrevieja'] },
  { name: 'Almería', cities: ['Almería', 'El Ejido', 'Roquetas de Mar'] },
  { name: 'Asturias', cities: ['Oviedo', 'Gijón', 'Avilés'] },
  { name: 'Ávila', cities: ['Ávila', 'Arévalo', 'El Tiemblo'] },
  { name: 'Badajoz', cities: ['Badajoz', 'Mérida', 'Don Benito'] },
  { name: 'Barcelona', cities: ['Barcelona', 'Sabadell', 'Terrassa', 'Hospitalet'] },
  { name: 'Burgos', cities: ['Burgos', 'Aranda de Duero', 'Miranda de Ebro'] },
  { name: 'Cáceres', cities: ['Cáceres', 'Plasencia', 'Navalmoral de la Mata'] },
  { name: 'Cádiz', cities: ['Cádiz', 'Jerez de la Frontera', 'Algeciras'] },
  { name: 'Cantabria', cities: ['Santander', 'Torrelavega', 'Castro-Urdiales'] },
  { name: 'Castellón', cities: ['Castellón', 'Villarreal', 'Burriana'] },
  { name: 'Ciudad Real', cities: ['Ciudad Real', 'Puertollano', 'Valdepeñas'] },
  { name: 'Córdoba', cities: ['Córdoba', 'Lucena', 'Puente Genil'] },
  { name: 'Cuenca', cities: ['Cuenca', 'Tarancón', 'San Clemente'] },
  { name: 'Girona', cities: ['Girona', 'Figueres', 'Blanes'] },
  { name: 'Granada', cities: ['Granada', 'Motril', 'Baza'] },
  { name: 'Guadalajara', cities: ['Guadalajara', 'Azuqueca de Henares', 'Alovera'] },
  { name: 'Guipúzcoa', cities: ['San Sebastián', 'Irún', 'Eibar'] },
  { name: 'Huelva', cities: ['Huelva', 'Lepe', 'Almonte'] },
  { name: 'Huesca', cities: ['Huesca', 'Barbastro', 'Monzón'] },
  { name: 'Islas Baleares', cities: ['Palma', 'Ibiza', 'Mahón'] },
  { name: 'Jaén', cities: ['Jaén', 'Linares', 'Úbeda'] },
  { name: 'La Coruña', cities: ['A Coruña', 'Santiago de Compostela', 'Ferrol'] },
  { name: 'La Rioja', cities: ['Logroño', 'Calahorra', 'Arnedo'] },
  { name: 'Las Palmas', cities: ['Las Palmas de Gran Canaria', 'Telde', 'Arrecife'] },
  { name: 'León', cities: ['León', 'Ponferrada', 'San Andrés del Rabanedo'] },
  { name: 'Lérida', cities: ['Lleida', 'Balaguer', 'Tàrrega'] },
  { name: 'Lugo', cities: ['Lugo', 'Monforte de Lemos', 'Viveiro'] },
  { name: 'Madrid', cities: ['Madrid', 'Móstoles', 'Alcalá de Henares', 'Fuenlabrada'] },
  { name: 'Málaga', cities: ['Málaga', 'Marbella', 'Vélez-Málaga', 'Torremolinos'] },
  { name: 'Murcia', cities: ['Murcia', 'Cartagena', 'Lorca'] },
  { name: 'Navarra', cities: ['Pamplona', 'Tudela', 'Barañáin'] },
  { name: 'Orense', cities: ['Ourense', 'Verín', 'O Barco de Valdeorras'] },
  { name: 'Palencia', cities: ['Palencia', 'Aguilar de Campoo', 'Guardo'] },
  { name: 'Pontevedra', cities: ['Vigo', 'Pontevedra', 'Vilagarcía de Arousa'] },
  { name: 'Salamanca', cities: ['Salamanca', 'Béjar', 'Ciudad Rodrigo'] },
  { name: 'Santa Cruz de Tenerife', cities: ['Santa Cruz de Tenerife', 'La Laguna', 'Arona'] },
  { name: 'Segovia', cities: ['Segovia', 'Cuéllar', 'El Espinar'] },
  { name: 'Sevilla', cities: ['Sevilla', 'Dos Hermanas', 'Écija'] },
  { name: 'Soria', cities: ['Soria', 'Almazán', 'El Burgo de Osma'] },
  { name: 'Tarragona', cities: ['Tarragona', 'Reus', 'Tortosa'] },
  { name: 'Teruel', cities: ['Teruel', 'Alcañiz', 'Andorra'] },
  { name: 'Toledo', cities: ['Toledo', 'Talavera de la Reina', 'Illescas'] },
  { name: 'Valencia', cities: ['Valencia', 'Torrent', 'Gandia', 'Sagunto'] },
  { name: 'Valladolid', cities: ['Valladolid', 'Medina del Campo', 'Laguna de Duero'] },
  { name: 'Vizcaya', cities: ['Bilbao', 'Barakaldo', 'Getxo'] },
  { name: 'Zamora', cities: ['Zamora', 'Benavente', 'Toro'] },
  { name: 'Zaragoza', cities: ['Zaragoza', 'Calatayud', 'Ejea de los Caballeros'] }
];

export const portugueseDistricts: Region[] = [
  { name: 'Aveiro', cities: ['Aveiro', 'Espinho', 'Santa Maria da Feira', 'Águeda'] },
  { name: 'Beja', cities: ['Beja', 'Moura', 'Odemira'] },
  { name: 'Braga', cities: ['Braga', 'Guimarães', 'Barcelos'] },
  { name: 'Bragança', cities: ['Bragança', 'Mirandela', 'Macedo de Cavaleiros'] },
  { name: 'Castelo Branco', cities: ['Castelo Branco', 'Covilhã', 'Fundão'] },
  { name: 'Coimbra', cities: ['Coimbra', 'Figueira da Foz', 'Cantanhede'] },
  { name: 'Évora', cities: ['Évora', 'Montemor-o-Novo', 'Estremoz'] },
  { name: 'Faro', cities: ['Faro', 'Albufeira', 'Lagos', 'Portimão'] },
  { name: 'Guarda', cities: ['Guarda', 'Seia', 'Gouveia'] },
  { name: 'Leiria', cities: ['Leiria', 'Pombal', 'Peniche'] },
  { name: 'Lisboa', cities: ['Lisboa', 'Amadora', 'Sintra', 'Cascais', 'Loures'] },
  { name: 'Portalegre', cities: ['Portalegre', 'Elvas', 'Ponte de Sor'] },
  { name: 'Porto', cities: ['Porto', 'Vila Nova de Gaia', 'Matosinhos', 'Maia'] },
  { name: 'Santarém', cities: ['Santarém', 'Tomar', 'Abrantes'] },
  { name: 'Setúbal', cities: ['Setúbal', 'Almada', 'Seixal'] },
  { name: 'Viana do Castelo', cities: ['Viana do Castelo', 'Ponte de Lima', 'Caminha'] },
  { name: 'Vila Real', cities: ['Vila Real', 'Chaves', 'Peso da Régua'] },
  { name: 'Viseu', cities: ['Viseu', 'Lamego', 'São Pedro do Sul'] },
  { name: 'Açores', cities: ['Ponta Delgada', 'Angra do Heroísmo', 'Horta'] },
  { name: 'Madeira', cities: ['Funchal', 'Câmara de Lobos', 'Santa Cruz'] }
];

export const italianRegions: Region[] = [
  { name: 'Abruzzo', cities: ['L\'Aquila', 'Pescara', 'Chieti', 'Teramo'] },
  { name: 'Basilicata', cities: ['Potenza', 'Matera'] },
  { name: 'Calabria', cities: ['Catanzaro', 'Reggio Calabria', 'Cosenza'] },
  { name: 'Campania', cities: ['Napoli', 'Salerno', 'Caserta'] },
  { name: 'Emilia-Romagna', cities: ['Bologna', 'Modena', 'Parma', 'Rimini'] },
  { name: 'Friuli-Venezia Giulia', cities: ['Trieste', 'Udine', 'Pordenone'] },
  { name: 'Lazio', cities: ['Roma', 'Latina', 'Frosinone'] },
  { name: 'Liguria', cities: ['Genova', 'La Spezia', 'Savona'] },
  { name: 'Lombardia', cities: ['Milano', 'Bergamo', 'Brescia', 'Como'] },
  { name: 'Marche', cities: ['Ancona', 'Pesaro', 'Ascoli Piceno'] },
  { name: 'Molise', cities: ['Campobasso', 'Isernia'] },
  { name: 'Piemonte', cities: ['Torino', 'Novara', 'Alessandria'] },
  { name: 'Puglia', cities: ['Bari', 'Taranto', 'Lecce', 'Foggia'] },
  { name: 'Sardegna', cities: ['Cagliari', 'Sassari', 'Nuoro'] },
  { name: 'Sicilia', cities: ['Palermo', 'Catania', 'Messina', 'Siracusa'] },
  { name: 'Toscana', cities: ['Firenze', 'Pisa', 'Livorno', 'Siena'] },
  { name: 'Trentino-Alto Adige', cities: ['Trento', 'Bolzano'] },
  { name: 'Umbria', cities: ['Perugia', 'Terni'] },
  { name: 'Valle d\'Aosta', cities: ['Aosta'] },
  { name: 'Veneto', cities: ['Venezia', 'Verona', 'Padova', 'Vicenza'] }
];

export const germanStates: Region[] = [
  { name: 'Baden-Württemberg', cities: ['Stuttgart', 'Karlsruhe', 'Freiburg', 'Heidelberg'] },
  { name: 'Bayern', cities: ['München', 'Nürnberg', 'Augsburg', 'Regensburg'] },
  { name: 'Berlin', cities: ['Berlin'] },
  { name: 'Brandenburg', cities: ['Potsdam', 'Cottbus', 'Frankfurt an der Oder'] },
  { name: 'Bremen', cities: ['Bremen', 'Bremerhaven'] },
  { name: 'Hamburg', cities: ['Hamburg'] },
  { name: 'Hessen', cities: ['Frankfurt am Main', 'Wiesbaden', 'Kassel', 'Darmstadt'] },
  { name: 'Mecklenburg-Vorpommern', cities: ['Schwerin', 'Rostock', 'Stralsund'] },
  { name: 'Niedersachsen', cities: ['Hannover', 'Braunschweig', 'Osnabrück', 'Oldenburg'] },
  { name: 'Nordrhein-Westfalen', cities: ['Düsseldorf', 'Köln', 'Dortmund', 'Essen'] },
  { name: 'Rheinland-Pfalz', cities: ['Mainz', 'Ludwigshafen', 'Koblenz', 'Trier'] },
  { name: 'Saarland', cities: ['Saarbrücken', 'Neunkirchen', 'Homburg'] },
  { name: 'Sachsen', cities: ['Dresden', 'Leipzig', 'Chemnitz'] },
  { name: 'Sachsen-Anhalt', cities: ['Magdeburg', 'Halle', 'Dessau-Roßlau'] },
  { name: 'Schleswig-Holstein', cities: ['Kiel', 'Lübeck', 'Flensburg'] },
  { name: 'Thüringen', cities: ['Erfurt', 'Jena', 'Gera'] }
];

export const getRegionsForCountry = (countryCode: CountryCode): Region[] => {
  return COUNTRIES[countryCode].regions;
};

/**
 * Formats a phone number based on the country
 */
export function formatPhoneForCountry(phone: string, countryCode: CountryCode): string {
  if (!phone) return '';
  
  return COUNTRIES[countryCode].formatPhoneNumber(phone);
}

// Normalize phone to E.164 format (required by Shopify API)
export function normalizeToE164(phone: string, countryCode: CountryCode): string {
  if (!phone) return '';
  
  // First use our country-specific formatter to ensure proper country code
  let formatted = formatPhoneForCountry(phone, countryCode);
  
  // Then remove all non-digit characters except the plus sign
  return formatted.replace(/[^+\d]/g, '');
}

/**
 * Validates a phone number for a specific country
 */
export function isValidPhoneForCountry(phone: string, countryCode: CountryCode): boolean {
  if (!phone) return false;
  
  // Clean the phone number first
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Remove the plus sign and country code if present
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  // Country-specific validation
  switch (countryCode) {
    case 'ES': // Spain
      // Spanish mobile numbers start with 6 or 7 and have 9 digits
      if (cleaned.startsWith('34')) {
        cleaned = cleaned.substring(2);
      }
      return (cleaned.startsWith('6') || cleaned.startsWith('7') || cleaned.startsWith('8') || cleaned.startsWith('9')) && cleaned.length === 9;
      
    case 'PT': // Portugal
      // Portuguese mobile numbers start with 9 and have 9 digits
      if (cleaned.startsWith('351')) {
        cleaned = cleaned.substring(3);
      }
      return cleaned.startsWith('9') && cleaned.length === 9;
      
    case 'IT': // Italy
      // Italian mobile numbers start with 3 and typically have 10 digits
      if (cleaned.startsWith('39')) {
        cleaned = cleaned.substring(2);
      }
      return cleaned.startsWith('3') && (cleaned.length === 9 || cleaned.length === 10);
      
    case 'DE': // Germany
      // German mobile numbers start with 15, 16, 17 and typically have 10-11 digits after country code
      if (cleaned.startsWith('49')) {
        cleaned = cleaned.substring(2);
      }
      return (cleaned.startsWith('15') || cleaned.startsWith('16') || cleaned.startsWith('17') || cleaned.startsWith('1')) && 
             (cleaned.length >= 10 && cleaned.length <= 11);
      
    default:
      // Generic validation - at least 9 digits
      return cleaned.length >= 9;
  }
}
