
// Define country-specific region data and phone validation

export const COUNTRIES = ['ES', 'PT', 'IT', 'DE'];

export const spanishProvinces = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 
  'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 
  'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 
  'Huesca', 'Islas Baleares', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 
  'León', 'Lérida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Orense', 
  'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 
  'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 
  'Vizcaya', 'Zamora', 'Zaragoza'
];

export const portugueseDistricts = [
  'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra', 'Évora', 
  'Faro', 'Guarda', 'Leiria', 'Lisboa', 'Portalegre', 'Porto', 'Santarém', 
  'Setúbal', 'Viana do Castelo', 'Vila Real', 'Viseu', 'Açores', 'Madeira'
];

export const italianRegions = [
  'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 
  'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche', 
  'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana', 
  'Trentino-Alto Adige', 'Umbria', 'Valle d\'Aosta', 'Veneto'
];

export const germanStates = [
  'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 
  'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen', 'Nordrhein-Westfalen', 
  'Rheinland-Pfalz', 'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'
];

/**
 * Formats a phone number based on the country
 */
export function formatPhoneForCountry(phone: string, countryCode: string): string {
  if (!phone) return '';
  
  // Clean the phone number first
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it already has a plus sign, respect it
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // Format by country
  switch(countryCode) {
    case 'ES': // Spain (+34)
      if (cleaned.startsWith('34')) {
        return `+${cleaned}`;
      }
      return `+34${cleaned}`;
    
    case 'PT': // Portugal (+351)
      if (cleaned.startsWith('351')) {
        return `+${cleaned}`;
      }
      return `+351${cleaned}`;
    
    case 'IT': // Italy (+39)
      if (cleaned.startsWith('39')) {
        return `+${cleaned}`;
      }
      return `+39${cleaned}`;
      
    case 'DE': // Germany (+49)
      if (cleaned.startsWith('49')) {
        return `+${cleaned}`;
      }
      return `+49${cleaned}`;
    
    default:
      // If not a recognized country code, just add a plus sign if not present
      return `+${cleaned}`;
  }
}

/**
 * Validates a phone number for a specific country
 */
export function isValidPhoneForCountry(phone: string, countryCode: string): boolean {
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
      return (cleaned.startsWith('6') || cleaned.startsWith('7')) && cleaned.length === 9;
      
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
      return cleaned.startsWith('3') && cleaned.length === 10;
      
    case 'DE': // Germany
      // German mobile numbers start with 15, 16, 17 and typically have 10-11 digits after country code
      if (cleaned.startsWith('49')) {
        cleaned = cleaned.substring(2);
      }
      return (cleaned.startsWith('15') || cleaned.startsWith('16') || cleaned.startsWith('17')) && 
             (cleaned.length >= 10 && cleaned.length <= 11);
      
    default:
      // Generic validation - at least 9 digits
      return cleaned.length >= 9;
  }
}
