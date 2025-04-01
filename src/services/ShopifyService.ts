
/**
 * ShopifyService.ts
 * Service to handle Shopify API integration for order creation
 */

// Shopify API endpoints
const SHOPIFY_API_VERSION = '2023-10'; // Update to the latest stable version

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
  private apiUrl: string;
  private headers: HeadersInit;
  private apiKey: string;
  private apiSecret: string;

  constructor(config: ShopifyConfig) {
    this.apiUrl = `https://${config.shopName}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}`;
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': config.accessToken
    };
  }

  /**
   * Creates an order in Shopify
   */
  async createOrder(payload: ShopifyOrderPayload): Promise<any> {
    try {
      // Make price optional to handle free products
      payload.order.line_items.forEach(item => {
        if (!item.price && item.price !== "0") {
          item.price = "0.00";
        }
      });

      const response = await fetch(`${this.apiUrl}/orders.json`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Shopify order creation failed:', errorData);
        throw new Error(`Failed to create Shopify order: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Shopify order:', error);
      throw error;
    }
  }

  /**
   * Validates if the Shopify credentials are correct
   */
  async validateCredentials(): Promise<boolean> {
    try {
      // We can try to authenticate using the API key and API secret
      // For API validation, we can use the shop endpoint which is lightweight
      const basicAuth = btoa(`${this.apiKey}:${this.apiSecret}`);
      
      const response = await fetch(`${this.apiUrl}/shop.json`, {
        method: 'GET',
        headers: {
          ...this.headers,
          'Authorization': `Basic ${basicAuth}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error validating Shopify credentials:', error);
      return false;
    }
  }
}

export default ShopifyService;
