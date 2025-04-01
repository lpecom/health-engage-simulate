
/**
 * ShopifyService.ts
 * Service to handle Shopify API integration for order creation
 */

import { supabase } from '@/integrations/supabase/client';

export interface ShopifyOrderPayload {
  order: {
    line_items: Array<{
      variant_id: number;
      quantity: number;
      price?: string;
    }>;
    customer: {
      first_name: string;
      last_name: string;
      email?: string;
      phone?: string;
    };
    shipping_address: {
      first_name: string;
      last_name: string;
      address1: string;
      city: string;
      province: string;
      zip: string;
      country: string;
      phone?: string;
    };
    financial_status: 'pending';
    send_receipt: boolean;
    send_fulfillment_receipt: boolean;
    tags?: string;
  }
}

interface ShopifyConfig {
  shopName: string;
  accessToken: string;
  apiKey: string;
  apiSecret: string;
}

export class ShopifyService {
  private shopName: string;
  
  constructor(config: ShopifyConfig) {
    this.shopName = config.shopName;
    
    console.log(`ShopifyService initialized with shop: ${config.shopName}`);
  }

  /**
   * Creates an order in Shopify using the Supabase edge function
   */
  async createOrder(payload: ShopifyOrderPayload): Promise<any> {
    try {
      console.log('Creating Shopify order with payload:', JSON.stringify(payload));
      
      // Make price optional to handle free products
      payload.order.line_items.forEach(item => {
        if (!item.price && item.price !== "0") {
          item.price = "0.00";
        }
      });

      const { data, error } = await supabase.functions.invoke('shopify', {
        body: {
          action: 'createOrder',
          payload
        }
      });
      
      if (error) {
        console.error('Error invoking shopify function:', error);
        throw new Error(`Failed to create Shopify order: ${error.message}`);
      }
      
      if (data.error) {
        console.error('Shopify order creation failed:', data.error);
        throw new Error(`Failed to create Shopify order: ${data.error}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error creating Shopify order:', error);
      throw error;
    }
  }

  /**
   * Validates if the Shopify credentials are correct using the Supabase edge function
   */
  async validateCredentials(): Promise<boolean> {
    try {
      console.log(`Validating credentials for shop: ${this.shopName}`);
      
      const { data, error } = await supabase.functions.invoke('shopify', {
        body: {
          action: 'validateCredentials'
        }
      });
      
      if (error) {
        console.error('Error validating Shopify credentials:', error);
        return false;
      }
      
      return data?.success === true;
    } catch (error) {
      console.error('Error validating Shopify credentials:', error);
      return false;
    }
  }
}

export default ShopifyService;
