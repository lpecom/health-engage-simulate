
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import ShopifyService, { ShopifyOrderPayload } from '@/services/ShopifyService';

interface ShopifyContextType {
  isConfigured: boolean;
  isConnecting: boolean;
  shopName: string;
  setShopName: (name: string) => void;
  accessToken: string;
  setAccessToken: (token: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  apiSecret: string;
  setApiSecret: (secret: string) => void;
  connectToShopify: () => Promise<boolean>;
  exportOrder: (orderData: CheckoutOrderData) => Promise<boolean>;
}

interface ShopifyProviderProps {
  children: React.ReactNode;
}

export interface CheckoutOrderData {
  product: {
    id: number;
    title: string;
    price: number;
    units: number;
  };
  shipping: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    province: string;
    city: string;
    postalCode: string;
  };
}

// Default Shopify test store credentials
const DEFAULT_SHOPIFY_STORE = 'h00ktt-1h';
const DEFAULT_SHOPIFY_TOKEN = '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';
const DEFAULT_SHOPIFY_API_KEY = '503954b7fa4651188b15be6895625719';
const DEFAULT_SHOPIFY_API_SECRET = '09283c1b816d60e082382805f8521908';

const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

export const ShopifyProvider: React.FC<ShopifyProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [shopName, setShopName] = useState<string>(() => {
    return localStorage.getItem('shopify_shop_name') || DEFAULT_SHOPIFY_STORE;
  });
  
  const [accessToken, setAccessToken] = useState<string>(() => {
    return localStorage.getItem('shopify_access_token') || DEFAULT_SHOPIFY_TOKEN;
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('shopify_api_key') || DEFAULT_SHOPIFY_API_KEY;
  });

  const [apiSecret, setApiSecret] = useState<string>(() => {
    return localStorage.getItem('shopify_api_secret') || DEFAULT_SHOPIFY_API_SECRET;
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  
  // Save values to localStorage when they change
  useEffect(() => {
    if (shopName) {
      localStorage.setItem('shopify_shop_name', shopName);
    }
  }, [shopName]);
  
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('shopify_access_token', accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('shopify_api_key', apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    if (apiSecret) {
      localStorage.setItem('shopify_api_secret', apiSecret);
    }
  }, [apiSecret]);
  
  // Check if credentials are valid on mount
  useEffect(() => {
    const validateCredentials = async () => {
      if (shopName && accessToken && apiKey && apiSecret) {
        try {
          const shopifyService = new ShopifyService({ 
            shopName, 
            accessToken,
            apiKey,
            apiSecret
          });
          const isValid = await shopifyService.validateCredentials();
          setIsConfigured(isValid);
          
          if (isValid) {
            console.log('Shopify integration is configured with valid credentials');
          }
        } catch (error) {
          console.error('Failed to validate Shopify credentials:', error);
        }
      }
    };
    
    validateCredentials();
  }, [shopName, accessToken, apiKey, apiSecret]);
  
  const connectToShopify = async (): Promise<boolean> => {
    if (!shopName || !accessToken || !apiKey || !apiSecret) {
      toast({
        title: "Connection Error",
        description: "Please provide all Shopify credentials",
        variant: "destructive",
      });
      return false;
    }
    
    setIsConnecting(true);
    
    try {
      const shopifyService = new ShopifyService({ 
        shopName, 
        accessToken,
        apiKey,
        apiSecret
      });
      
      const isValid = await shopifyService.validateCredentials();
      
      if (isValid) {
        setIsConfigured(true);
        toast({
          title: "Connected to Shopify",
          description: "Your store was successfully connected",
        });
        return true;
      } else {
        toast({
          title: "Connection Failed",
          description: "Unable to connect to Shopify. Please check your credentials.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error connecting to Shopify:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Shopify. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  };
  
  const exportOrder = async (orderData: CheckoutOrderData): Promise<boolean> => {
    if (!isConfigured) {
      toast({
        title: "Shopify Not Connected",
        description: "Please connect to Shopify before exporting orders",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const shopifyService = new ShopifyService({ 
        shopName, 
        accessToken,
        apiKey,
        apiSecret
      });
      
      // Map local order data to Shopify format
      const payload: ShopifyOrderPayload = {
        order: {
          line_items: [
            {
              variant_id: orderData.product.id,
              quantity: orderData.product.units,
              price: orderData.product.price.toString(),
            }
          ],
          customer: {
            first_name: orderData.shipping.firstName,
            last_name: orderData.shipping.lastName,
            phone: orderData.shipping.phone
          },
          shipping_address: {
            first_name: orderData.shipping.firstName,
            last_name: orderData.shipping.lastName,
            address1: orderData.shipping.address,
            city: orderData.shipping.city,
            province: orderData.shipping.province,
            zip: orderData.shipping.postalCode,
            country: 'IT', // Default to Italy since we're offering Italian language
            phone: orderData.shipping.phone
          },
          financial_status: 'pending',
          send_receipt: true,
          send_fulfillment_receipt: true,
          tags: 'accu-tech-app'
        }
      };
      
      const response = await shopifyService.createOrder(payload);
      console.log('Order successfully exported to Shopify');
      
      toast({
        title: "Order Exported Successfully",
        description: "Your order has been created in Shopify",
      });
      
      return true;
    } catch (error) {
      console.error('Error exporting order to Shopify:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export order to Shopify",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return (
    <ShopifyContext.Provider
      value={{
        isConfigured,
        isConnecting,
        shopName,
        setShopName,
        accessToken,
        setAccessToken,
        apiKey,
        setApiKey,
        apiSecret,
        setApiSecret,
        connectToShopify,
        exportOrder
      }}
    >
      {children}
    </ShopifyContext.Provider>
  );
};

export const useShopify = (): ShopifyContextType => {
  const context = useContext(ShopifyContext);
  if (!context) {
    throw new Error('useShopify must be used within a ShopifyProvider');
  }
  return context;
};
