
/**
 * ShopifyService.ts
 * Service to handle Shopify API integration for order creation
 */

import { supabase } from '@/integrations/supabase/client';
import { CheckoutOrderData } from '@/types/userData';

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
  async createOrder(orderData: CheckoutOrderData): Promise<any> {
    try {
      console.log('Creating Shopify order with order data:', JSON.stringify(orderData));
      
      const payload: ShopifyOrderPayload = this.createOrderPayload(orderData);
      
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
   * Creates the order payload for Shopify from our app's order data
   */
  private createOrderPayload(orderData: CheckoutOrderData): ShopifyOrderPayload {
    // Make price optional to handle free products
    const price = orderData.product.price ? orderData.product.price.toString() : "0.00";
    
    // Generate a placeholder email if not provided (Shopify requires either email or phone)
    const email = orderData.shipping.email || 
      `${orderData.shipping.firstName.toLowerCase()}.${orderData.shipping.lastName.toLowerCase()}@example.com`;
    
    return {
      order: {
        line_items: [
          {
            variant_id: orderData.product.id,
            quantity: orderData.product.units,
            price
          }
        ],
        customer: {
          first_name: orderData.shipping.firstName,
          last_name: orderData.shipping.lastName,
          email,
          phone: orderData.shipping.phone
        },
        shipping_address: {
          first_name: orderData.shipping.firstName,
          last_name: orderData.shipping.lastName,
          address1: orderData.shipping.address,
          city: orderData.shipping.city,
          province: orderData.shipping.province,
          zip: orderData.shipping.postalCode,
          country: orderData.shipping.country,
          phone: orderData.shipping.phone
        },
        financial_status: 'pending',
        send_receipt: true,
        send_fulfillment_receipt: true,
        tags: 'accu-tech-app'
      }
    };
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
