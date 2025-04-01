
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SHOPIFY_API_VERSION = '2023-10';

interface ShopifyRequestPayload {
  action: 'createOrder' | 'validateCredentials';
  shopName: string;
  accessToken: string;
  apiKey: string;
  apiSecret: string;
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
    const reqData: ShopifyRequestPayload = await req.json();
    const { action, shopName, accessToken, apiKey, apiSecret, payload } = reqData;
    
    if (!shopName || !accessToken || !apiKey || !apiSecret) {
      return new Response(JSON.stringify({
        error: 'Missing required credentials'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const apiUrl = `https://${shopName}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    };

    // Basic auth for additional authentication options
    const basicAuth = btoa(`${apiKey}:${apiSecret}`);
    const authHeaders = {
      ...headers,
      'Authorization': `Basic ${basicAuth}`
    };

    if (action === 'validateCredentials') {
      // Try to fetch shop info to validate credentials
      const response = await fetch(`${apiUrl}/shop.json`, {
        method: 'GET',
        headers: authHeaders
      });

      if (response.ok) {
        const shopData = await response.json();
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

      // Try with just the access token
      const tokenResponse = await fetch(`${apiUrl}/shop.json`, {
        method: 'GET',
        headers: headers
      });

      if (tokenResponse.ok) {
        const shopData = await tokenResponse.json();
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

      return new Response(JSON.stringify({
        error: 'Invalid credentials',
        status: tokenResponse.status
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
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
        });
      }

      const response = await fetch(`${apiUrl}/orders.json`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
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

      // Store the order in Supabase
      const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
      const supabaseClient = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '');

      if (responseData.order) {
        try {
          const { error } = await supabaseClient
            .from('orders')
            .insert({
              shopify_order_id: responseData.order.id.toString(),
              product_name: payload.order.line_items[0]?.title || 'Unknown Product',
              product_quantity: payload.order.line_items[0]?.quantity || 1,
              product_price: parseFloat(payload.order.line_items[0]?.price || '0'),
              shipping_price: 0, // Free shipping
              total_price: parseFloat(payload.order.line_items[0]?.price || '0'),
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

// Helper function from the Supabase docs to create client
// @deno-types="https://esm.sh/v128/supabase@1.112.0/dist/module/index.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
