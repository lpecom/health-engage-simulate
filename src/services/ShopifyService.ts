
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

    console.log(`ShopifyService initialized with shop: ${config.shopName}`);
  }

  /**
   * Creates an order in Shopify
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

      console.log(`Sending request to ${this.apiUrl}/orders.json`);
      
      const response = await fetch(`${this.apiUrl}/orders.json`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      console.log(`Order creation response status: ${response.status}`);
      
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
      console.log(`Validating credentials for shop: ${this.apiUrl}`);
      console.log('Using access token and API credentials');
      
      // Try basic auth first (API key + API secret)
      const basicAuth = btoa(`${this.apiKey}:${this.apiSecret}`);
      console.log('Generated Basic Auth header');
      
      // First attempt with both types of authentication to maximize chances of success
      const authHeaders = {
        ...this.headers,
        'Authorization': `Basic ${basicAuth}`
      };
      
      console.log('Sending validation request with combined auth');
      const response = await fetch(`${this.apiUrl}/shop.json`, {
        method: 'GET',
        headers: authHeaders,
        mode: 'cors',
      });
      
      console.log(`Validation response status: ${response.status}`);
      
      if (response.ok) {
        console.log('Credentials validated successfully!');
        return true;
      }
      
      console.log('Combined auth failed. Trying access token only...');
      
      // Second attempt with only access token
      const tokenResponse = await fetch(`${this.apiUrl}/shop.json`, {
        method: 'GET',
        headers: this.headers,
      });
      
      console.log(`Token-only validation response status: ${tokenResponse.status}`);
      
      if (tokenResponse.ok) {
        console.log('Access token validated successfully!');
        return true;
      }
      
      console.log('Failed to validate with either auth method');
      return false;
    } catch (error) {
      console.error('Error validating Shopify credentials:', error);
      return false;
    }
  }
}

export default ShopifyService;
