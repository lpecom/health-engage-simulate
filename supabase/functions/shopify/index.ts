
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
  
  console.log('Formatting phone number:', phone);
  
  // Remove all non-digit characters except the plus sign at the beginning
  let formattedPhone = phone.trim();
  let hasPlus = formattedPhone.startsWith('+');
  
  // Remove all non-digit characters
  let digitsOnly = formattedPhone.replace(/\D/g, '');
  
  // Detect country code and format properly
  if (hasPlus) {
    // Phone already has a plus, just ensure proper format
    return `+${digitsOnly}`;
  } 
  
  // Try to detect country code from the number pattern
  if (digitsOnly.startsWith('34') && (digitsOnly.length === 11 || digitsOnly.length === 9)) {
    // Spain (+34) - either already has country code (11 digits) or just the local part (9 digits)
    return digitsOnly.length === 9 ? `+34${digitsOnly}` : `+${digitsOnly}`;
  } else if (digitsOnly.startsWith('351') && (digitsOnly.length === 12 || digitsOnly.length === 9)) {
    // Portugal (+351) - either already has country code (12 digits) or just the local part (9 digits)
    return digitsOnly.length === 9 ? `+351${digitsOnly}` : `+${digitsOnly}`;
  } else if (digitsOnly.startsWith('39') && (digitsOnly.length === 11 || digitsOnly.length === 10)) {
    // Italy (+39) - either already has country code (11-12 digits) or just the local part (10 digits)
    return digitsOnly.length === 10 ? `+39${digitsOnly}` : `+${digitsOnly}`;
  } else if (digitsOnly.startsWith('49') && (digitsOnly.length === 11 || digitsOnly.length === 10)) {
    // Germany (+49) - either already has country code or just the local part
    return digitsOnly.length === 10 ? `+49${digitsOnly}` : `+${digitsOnly}`;
  } else if (digitsOnly.length === 9) {
    // Generic 9-digit number - assume Spanish by default
    if (digitsOnly.startsWith('6') || digitsOnly.startsWith('7')) {
      return `+34${digitsOnly}`; // Spanish mobile
    } else if (digitsOnly.startsWith('9')) {
      return `+351${digitsOnly}`; // Portuguese mobile
    } else {
      return `+34${digitsOnly}`; // Default to Spanish
    }
  } else if (digitsOnly.length === 10) {
    // Generic 10-digit number - assume Italian by default
    if (digitsOnly.startsWith('3')) {
      return `+39${digitsOnly}`; // Italian mobile
    } else {
      return `+${digitsOnly}`; // Just add plus
    }
  }
  
  // If we can't determine the specific format, ensure it has a plus sign
  return `+${digitsOnly}`;
}

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
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
        // Deep clone the payload to avoid modifying the original
        const orderPayload = JSON.parse(JSON.stringify(payload));
        
        // Format phone numbers in the proper E.164 format (strict format required by Shopify API)
        if (orderPayload.order.customer && orderPayload.order.customer.phone) {
          orderPayload.order.customer.phone = formatPhoneToE164(orderPayload.order.customer.phone);
          console.log('Formatted customer phone:', orderPayload.order.customer.phone);
        }
        
        if (orderPayload.order.shipping_address && orderPayload.order.shipping_address.phone) {
          orderPayload.order.shipping_address.phone = formatPhoneToE164(orderPayload.order.shipping_address.phone);
          console.log('Formatted shipping address phone:', orderPayload.order.shipping_address.phone);
        }
        
        // Add email if not present (Shopify requires either email or phone)
        if (!orderPayload.order.customer.email) {
          // Generate a placeholder email based on name and domain
          const firstName = orderPayload.order.customer.first_name || 'customer';
          const lastName = orderPayload.order.customer.last_name || 'customer';
          const timestamp = new Date().getTime();
          orderPayload.order.customer.email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}@placeholder.com`;
          console.log('Generated placeholder email:', orderPayload.order.customer.email);
        }
        
        console.log('Final order payload:', JSON.stringify(orderPayload));
        
        const response = await fetch(`${apiUrl}/orders.json`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(orderPayload)
        });

        const responseData = await response.json();
        
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
                product_name: orderPayload.order.line_items[0]?.title || 'Unknown Product',
                product_quantity: orderPayload.order.line_items[0]?.quantity || 1,
                product_price: parseFloat(orderPayload.order.line_items[0]?.price || '0'),
                shipping_price: 0, // Free shipping
                total_price: parseFloat(orderPayload.order.line_items[0]?.price || '0') * (orderPayload.order.line_items[0]?.quantity || 1),
                customer_name: orderPayload.order.shipping_address.first_name,
                customer_surname: orderPayload.order.shipping_address.last_name,
                customer_phone: orderPayload.order.shipping_address.phone,
                customer_address: orderPayload.order.shipping_address.address1,
                province: orderPayload.order.shipping_address.province,
                city: orderPayload.order.shipping_address.city,
                zip_code: orderPayload.order.shipping_address.zip,
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
