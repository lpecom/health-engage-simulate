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

// Clean phone number to E.164 format (required by Shopify API)
function formatPhoneToE164(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  let digitsOnly = phone.replace(/\D/g, '');
  
  // If it already has a plus sign, keep it
  if (phone.startsWith('+')) {
    return '+' + digitsOnly;
  }
  
  // Otherwise add it (assuming it already has country code)
  return '+' + digitsOnly;
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
        // Ensure phone numbers are properly formatted before sending to Shopify
        if (payload.order.customer && payload.order.customer.phone) {
          payload.order.customer.phone = formatPhoneToE164(payload.order.customer.phone);
        }
        
        if (payload.order.shipping_address && payload.order.shipping_address.phone) {
          payload.order.shipping_address.phone = formatPhoneToE164(payload.order.shipping_address.phone);
        }
        
        console.log('Formatted order payload:', JSON.stringify(payload));
        
        const response = await fetch(`${apiUrl}/orders.json`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
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
                product_name: payload.order.line_items[0]?.title || 'Unknown Product',
                product_quantity: payload.order.line_items[0]?.quantity || 1,
                product_price: parseFloat(payload.order.line_items[0]?.price || '0'),
                shipping_price: 0, // Free shipping
                total_price: parseFloat(payload.order.line_items[0]?.price || '0') * (payload.order.line_items[0]?.quantity || 1),
                customer_name: payload.order.shipping_address.first_name,
                customer_surname: payload.order.shipping_address.last_name,
                customer_phone: payload.order.shipping_address.phone,
                customer_address: payload.order.shipping_address.address1,
                province: payload.order.shipping_address.province,
                city: payload.order.shipping_address.city,
                zip_code: payload.order.shipping_address.zip,
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
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        console.error('Error creating order:', error);
        return new Response(JSON.stringify({
          error: 'Error creating order: ' + error.message
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
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
