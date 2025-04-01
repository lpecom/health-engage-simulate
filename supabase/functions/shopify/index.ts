
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const SHOPIFY_API_VERSION = '2023-10';

interface ShopifyRequestPayload {
  action: 'createOrder' | 'validateCredentials';
  payload?: any;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// Enhanced phone number formatting to E.164 format (required by Shopify API)
function formatPhoneToE164(phone: string): string {
  if (!phone) return '';
  
  // If the phone already starts with a plus sign, assume it's already in E.164 format
  if (phone.startsWith('+')) {
    // Just remove any non-digit characters after the plus sign
    return '+' + phone.substring(1).replace(/\D/g, '');
  }
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Try to detect country code from the number pattern
  if (digitsOnly.startsWith('34') && (digitsOnly.length === 11 || digitsOnly.length === 9)) {
    // Spain (+34)
    return digitsOnly.length === 9 ? `+34${digitsOnly}` : `+${digitsOnly}`;
  } else if (digitsOnly.startsWith('351') && (digitsOnly.length === 12 || digitsOnly.length === 9)) {
    // Portugal (+351)
    return digitsOnly.length === 9 ? `+351${digitsOnly}` : `+${digitsOnly}`;
  } else if (digitsOnly.startsWith('39') && (digitsOnly.length === 11 || digitsOnly.length === 10 || digitsOnly.length === 9)) {
    // Italy (+39)
    return digitsOnly.length <= 10 ? `+39${digitsOnly}` : `+${digitsOnly}`;
  } else if (digitsOnly.startsWith('49') && (digitsOnly.length >= 11 || digitsOnly.length <= 13)) {
    // Germany (+49)
    return digitsOnly.length <= 11 ? `+49${digitsOnly}` : `+${digitsOnly}`;
  }
  
  // If we can't determine a specific format, try to guess based on length
  if (digitsOnly.length === 9) {
    // Most likely Spain or Portugal
    // Check first digit to guess
    if (digitsOnly.startsWith('6') || digitsOnly.startsWith('7')) {
      return `+34${digitsOnly}`; // Spanish mobile
    } else if (digitsOnly.startsWith('9')) {
      return `+351${digitsOnly}`; // Portuguese mobile
    } 
    return `+34${digitsOnly}`; // Default to Spain
  } else if (digitsOnly.length === 10) {
    // Most likely Italy
    if (digitsOnly.startsWith('3')) {
      return `+39${digitsOnly}`; // Italian mobile
    }
    return `+39${digitsOnly}`; // Default to Italy
  } else if (digitsOnly.length === 11) {
    // Most likely Germany
    return `+49${digitsOnly}`;
  }
  
  // If all else fails, just add a plus sign
  return `+${digitsOnly}`;
}

// Ensures all phones in the order are properly formatted and validates required fields
function validateAndFormatOrderPayload(orderPayload: any) {
  if (!orderPayload || !orderPayload.order) {
    throw new Error("Invalid order payload format");
  }
  
  // Deep clone the payload to avoid modifying the original
  const payload = JSON.parse(JSON.stringify(orderPayload));
  
  // Format phone numbers
  if (payload.order.customer?.phone) {
    payload.order.customer.phone = formatPhoneToE164(payload.order.customer.phone);
    console.log("Formatted customer phone:", payload.order.customer.phone);
  }
  
  if (payload.order.shipping_address?.phone) {
    payload.order.shipping_address.phone = formatPhoneToE164(payload.order.shipping_address.phone);
    console.log("Formatted shipping phone:", payload.order.shipping_address.phone);
  }
  
  // Ensure email exists (Shopify requires either email or phone)
  if (!payload.order.customer.email && payload.order.customer.first_name) {
    // Generate placeholder email
    const firstName = payload.order.customer.first_name.toLowerCase() || 'customer';
    const lastName = payload.order.customer.last_name?.toLowerCase() || 'unknown';
    const timestamp = new Date().getTime();
    payload.order.customer.email = `${firstName}.${lastName}.${timestamp}@placeholder.com`;
    console.log("Generated placeholder email:", payload.order.customer.email);
  }
  
  // Ensure required fields for shipping address
  if (payload.order.shipping_address) {
    const required = ['first_name', 'address1', 'city', 'province', 'country', 'zip'];
    const missing = required.filter(field => !payload.order.shipping_address[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required shipping fields: ${missing.join(', ')}`);
    }
  }
  
  // Ensure line items have required fields
  if (payload.order.line_items && payload.order.line_items.length > 0) {
    payload.order.line_items.forEach((item: any, index: number) => {
      if (!item.variant_id || !item.quantity) {
        throw new Error(`Missing required fields in line item ${index}: variant_id or quantity`);
      }
      
      // Ensure name and title are present for each line item
      if (!item.name) {
        item.name = "Accu-Tech Glucometer";
        console.log(`Added default name to line item ${index}`);
      }
      
      if (!item.title) {
        item.title = item.name;
        console.log(`Added title to line item ${index} based on name`);
      }
    });
  } else {
    throw new Error("Order must contain at least one line item");
  }
  
  return payload;
}

serve(async (req) => {
  // CORS handling for browser requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SHOPIFY_STORE_NAME, SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_KEY, SHOPIFY_API_SECRET } = Deno.env.toObject()
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Check for required environment variables
    if (!SHOPIFY_STORE_NAME || !SHOPIFY_ACCESS_TOKEN || !SHOPIFY_API_KEY || !SHOPIFY_API_SECRET) {
      console.error('Missing required Shopify environment variables');
      
      // Log which variables are missing for easier debugging
      const missingVars = [];
      if (!SHOPIFY_STORE_NAME) missingVars.push('SHOPIFY_STORE_NAME');
      if (!SHOPIFY_ACCESS_TOKEN) missingVars.push('SHOPIFY_ACCESS_TOKEN');
      if (!SHOPIFY_API_KEY) missingVars.push('SHOPIFY_API_KEY');
      if (!SHOPIFY_API_SECRET) missingVars.push('SHOPIFY_API_SECRET');
      
      return new Response(JSON.stringify({
        error: 'Shopify is not configured. Missing required environment variables.',
        details: `Missing variables: ${missingVars.join(', ')}`
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    
    // Format shop name to ensure it's a valid Shopify URL
    // Remove any spaces, special characters, or .myshopify.com if it's already there
    const formattedShopName = SHOPIFY_STORE_NAME.trim()
      .replace(/\.myshopify\.com$/, '')
      .replace(/[^\w-]/g, '');
    
    const apiUrl = `https://${formattedShopName}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}`;
    
    console.log(`Using Shopify API URL: ${apiUrl}`);
    console.log(`Using shop name: ${formattedShopName}`);

    const headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
    };

    const reqData: ShopifyRequestPayload = await req.json();
    const { action, payload } = reqData;

    if (action === 'validateCredentials') {
      console.log(`Validating Shopify credentials for shop: ${formattedShopName}`);
      
      // Try to fetch shop info to validate credentials using access token
      try {
        const response = await fetch(`${apiUrl}/shop.json`, {
          method: 'GET',
          headers: headers
        });

        // Log full response for debugging
        const responseText = await response.text();
        console.log(`Shopify validation response status: ${response.status}`);
        console.log(`Shopify validation response body: ${responseText}`);
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          responseData = null; 
        }

        if (response.ok) {
          return new Response(JSON.stringify({
            success: true,
            shop: responseData?.shop || responseData
          }), {
            headers: corsHeaders,
          });
        }
        
        console.error('Validation failed with status:', response.status, responseText);
        
        let errorMessage = 'Invalid credentials';
        let errorDetails = responseText;
        
        if (response.status === 401) {
          errorMessage = 'Authentication failed: Invalid API key or access token';
        } else if (response.status === 404) {
          errorMessage = 'Store not found: The Shopify store name may be incorrect';
          errorDetails = `Could not connect to ${formattedShopName}.myshopify.com - Please verify the store name is correct`;
        }
        
        return new Response(JSON.stringify({
          error: errorMessage,
          status: response.status,
          details: errorDetails
        }), {
          status: response.status,
          headers: corsHeaders,
        });
      } catch (error) {
        console.error('Error during credentials validation:', error);
        return new Response(JSON.stringify({
          error: 'Error validating credentials: ' + error.message,
          details: JSON.stringify(error, null, 2)
        }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }
    
    else if (action === 'createOrder') {
      if (!payload) {
        return new Response(JSON.stringify({
          error: 'Missing order payload'
        }), {
          status: 400,
          headers: corsHeaders,
        })
      }

      console.log('Creating order with payload:', JSON.stringify(payload));
      
      try {
        // Validate and format the order payload
        const formattedPayload = validateAndFormatOrderPayload(payload);
        console.log('Final formatted order payload:', JSON.stringify(formattedPayload));
        
        // Send the order to Shopify API
        const response = await fetch(`${apiUrl}/orders.json`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(formattedPayload)
        });

        // Get the response data
        const responseText = await response.text();
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          console.error('Error parsing response as JSON:', e);
          responseData = { text: responseText };
        }
        
        console.log('Shopify API response:', JSON.stringify(responseData));
        
        if (!response.ok) {
          console.error('Failed to create order:', responseData);
          return new Response(JSON.stringify({
            error: 'Failed to create order',
            shopifyError: responseData,
            status: response.status
          }), {
            status: response.status,
            headers: corsHeaders,
          });
        }

        console.log('Order created successfully:', responseData);
        
        // Store the order in Supabase if it doesn't exist yet
        if (responseData.order) {
          try {
            const { error } = await supabaseClient
              .from('orders')
              .upsert({
                shopify_order_id: responseData.order.id.toString(),
                product_name: formattedPayload.order.line_items[0]?.title || 'Accu-Tech Device',
                product_quantity: formattedPayload.order.line_items[0]?.quantity || 1,
                product_price: parseFloat(formattedPayload.order.line_items[0]?.price || '0'),
                shipping_price: 3, // Shipping price
                total_price: parseFloat(formattedPayload.order.line_items[0]?.price || '0') * 
                  (formattedPayload.order.line_items[0]?.quantity || 1) + 3,
                customer_name: formattedPayload.order.shipping_address.first_name,
                customer_surname: formattedPayload.order.shipping_address.last_name,
                customer_phone: formattedPayload.order.shipping_address.phone,
                customer_address: formattedPayload.order.shipping_address.address1,
                province: formattedPayload.order.shipping_address.province,
                city: formattedPayload.order.shipping_address.city,
                zip_code: formattedPayload.order.shipping_address.zip,
                exported_to_shopify: true,
                status: 'pending',
                payment_method: 'COD'
              }, {
                onConflict: 'shopify_order_id'
              });

            if (error) {
              console.error("Supabase order insertion error:", error);
            }
          } catch (error) {
            console.error("Error saving to database:", error);
          }
        }

        return new Response(JSON.stringify(responseData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error creating order:', error);
        return new Response(JSON.stringify({
          error: 'Error creating order: ' + error.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    return new Response(JSON.stringify({
      error: 'Invalid action'
    }), {
      status: 400,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Error in Shopify function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      details: JSON.stringify(error, null, 2)
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
})
