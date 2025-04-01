
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

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SHOPIFY_STORE_NAME, SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_KEY, SHOPIFY_API_SECRET } = Deno.env.toObject()
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Check for required environment variables
    if (!SHOPIFY_STORE_NAME || !SHOPIFY_ACCESS_TOKEN || !SHOPIFY_API_KEY || !SHOPIFY_API_SECRET) {
      console.error('Missing required Shopify environment variables');
      return new Response(JSON.stringify({
        error: 'Shopify is not configured. Missing required environment variables.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
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

        if (response.ok) {
          const shopData = await response.json();
          console.log('Credentials validated successfully with Access Token');
          return new Response(JSON.stringify({
            success: true,
            shop: shopData.shop
          }), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
        
        const responseText = await response.text();
        console.error('Validation failed with status:', response.status, responseText);
        
        return new Response(JSON.stringify({
          error: 'Invalid credentials',
          status: response.status,
          details: responseText
        }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        console.error('Error during credentials validation:', error);
        return new Response(JSON.stringify({
          error: 'Error validating credentials: ' + error.message
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }
    
    else if (action === 'createOrder') {
      if (!payload) {
        return new Response(JSON.stringify({
          error: 'Missing order payload'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        })
      }

      console.log('Creating order with payload:', JSON.stringify(payload))
      
      try {
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
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in Shopify function:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
})
