
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

interface AddressValidationRequest {
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

interface ValidationResult {
  isValid: boolean;
  suggestions?: {
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
  issues?: string[];
}

serve(async (req) => {
  // CORS handling for browser requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get request data
    const requestData = await req.json();
    
    // Handle batch validation
    if (Array.isArray(requestData)) {
      const results = await Promise.all(
        requestData.map(async (address) => {
          const result = await validateAddress(address);
          return {
            id: address.id, // Pass through any ID that was sent
            result
          };
        })
      );
      
      return new Response(JSON.stringify(results), {
        headers: corsHeaders,
      });
    }
    
    // Handle single address validation
    const result = await validateAddress(requestData);
    
    return new Response(JSON.stringify(result), {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error in address validation function:', error);
    
    return new Response(JSON.stringify({
      error: error.message,
      details: JSON.stringify(error, null, 2)
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

async function validateAddress(addressData: AddressValidationRequest): Promise<ValidationResult> {
  // This is a simple validation implementation
  // In a production environment, this would be connected to a real address validation service
  
  const issues: string[] = [];
  const suggestions: ValidationResult['suggestions'] = {};
  
  // Validate address
  if (!addressData.address || addressData.address.length < 5) {
    issues.push('Address is too short');
  }
  
  // Validate postal code format based on country
  const postalCodePatterns: Record<string, RegExp> = {
    'ES': /^[0-9]{5}$/,                 // Spain: 28001
    'PT': /^[0-9]{4}-[0-9]{3}$/,        // Portugal: 1000-001
    'IT': /^[0-9]{5}$/,                 // Italy: 00100
    'DE': /^[0-9]{5}$/,                 // Germany: 10115
  };
  
  const countryPattern = postalCodePatterns[addressData.country];
  if (countryPattern && !countryPattern.test(addressData.postalCode)) {
    issues.push('Invalid postal code format');
    
    // Generate suggestion for postal code
    if (addressData.country === 'PT' && /^[0-9]{4}$/.test(addressData.postalCode)) {
      suggestions.postalCode = `${addressData.postalCode}-000`;
    } else if (addressData.country === 'PT' && /^[0-9]{7}$/.test(addressData.postalCode)) {
      suggestions.postalCode = `${addressData.postalCode.substring(0, 4)}-${addressData.postalCode.substring(4)}`;
    }
  }
  
  // Check for potentially problematic characters in the address
  if (/[<>]/.test(addressData.address)) {
    issues.push('Address contains invalid characters');
    suggestions.address = addressData.address.replace(/[<>]/g, '');
  }
  
  // Basic city validation
  if (!addressData.city || addressData.city.length < 2) {
    issues.push('City name is too short');
  }
  
  // Check for all uppercase or all lowercase cities and make a proper case suggestion
  if (addressData.city === addressData.city.toUpperCase() || addressData.city === addressData.city.toLowerCase()) {
    const words = addressData.city.toLowerCase().split(' ');
    const properCaseCity = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    suggestions.city = properCaseCity;
  }
  
  return {
    isValid: issues.length === 0,
    suggestions: Object.keys(suggestions).length > 0 ? suggestions : undefined,
    issues: issues.length > 0 ? issues : undefined
  };
}
