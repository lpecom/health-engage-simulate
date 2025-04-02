
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country?: string;
}

interface AddressValidationResponse {
  isValid: boolean;
  suggestedAddress?: string;
  suggestedCity?: string;
  suggestedProvince?: string;
  suggestedPostalCode?: string;
  issues?: string[];
  confidence?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { address } = await req.json();

    if (!address || typeof address !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid address data provided' }),
        {
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // In a real implementation, you would call an AI service or geocoding API here
    // For now, we'll simulate validation with some rules
    
    const validateAddress = (address: Address): AddressValidationResponse => {
      const issues: string[] = [];
      
      // Check street address
      const hasNumber = /\d/.test(address.street);
      if (!hasNumber) {
        issues.push("Street address might be missing a house/building number");
      }
      
      // Check postal code format based on country
      // This is a simplified example - real validation would be much more complex
      const country = address.country || 'ES'; // Default to Spain if not specified
      let postalCodeValid = false;
      let suggestedPostalCode = address.postalCode;
      
      switch (country) {
        case 'ES': // Spain
          postalCodeValid = /^\d{5}$/.test(address.postalCode);
          if (!postalCodeValid && /^\d{1,4}$/.test(address.postalCode)) {
            // Pad with zeros if it's only missing leading zeros
            suggestedPostalCode = address.postalCode.padStart(5, '0');
          }
          break;
        case 'IT': // Italy
          postalCodeValid = /^\d{5}$/.test(address.postalCode);
          break;
        case 'PT': // Portugal
          postalCodeValid = /^\d{4}-\d{3}$/.test(address.postalCode);
          break;
        default:
          postalCodeValid = address.postalCode.length > 4;
      }
      
      if (!postalCodeValid) {
        issues.push("Postal code format appears to be invalid");
      }
      
      // Check city
      if (address.city.length < 2) {
        issues.push("City name seems too short");
      }
      
      // Determine if the address is generally valid
      const isValid = issues.length === 0;
      
      // Create response
      const response: AddressValidationResponse = {
        isValid,
        issues: issues.length > 0 ? issues : undefined,
        confidence: isValid ? 0.95 : 0.5
      };
      
      // Add suggestions for invalid addresses
      if (!isValid) {
        if (!hasNumber) {
          response.suggestedAddress = address.street + " 1"; // Suggest adding a number
        }
        
        if (!postalCodeValid) {
          response.suggestedPostalCode = suggestedPostalCode;
        }
      }
      
      return response;
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const validationResult = validateAddress({
      street: address.street || '',
      city: address.city || '',
      province: address.province || '',
      postalCode: address.postalCode || '',
      country: address.country
    });

    return new Response(
      JSON.stringify(validationResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error validating address:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
