
import React, { createContext, useContext, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import ShopifyService, { ShopifyOrderPayload } from '@/services/ShopifyService';

interface ShopifyContextType {
  isConfigured: boolean;
  isConnecting: boolean;
  shopName: string;
  setShopName: (name: string) => void;
  accessToken: string;
  setAccessToken: (token: string) => void;
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

const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

export const ShopifyProvider: React.FC<ShopifyProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [shopName, setShopName] = useState<string>(() => {
    return localStorage.getItem('shopify_shop_name') || '';
  });
  
  const [accessToken, setAccessToken] = useState<string>(() => {
    return localStorage.getItem('shopify_access_token') || '';
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  
  const isConfigured = Boolean(shopName && accessToken);
  
  // Save values to localStorage when they change
  React.useEffect(() => {
    if (shopName) {
      localStorage.setItem('shopify_shop_name', shopName);
    }
  }, [shopName]);
  
  React.useEffect(() => {
    if (accessToken) {
      localStorage.setItem('shopify_access_token', accessToken);
    }
  }, [accessToken]);
  
  const connectToShopify = async (): Promise<boolean> => {
    if (!shopName || !accessToken) {
      toast({
        title: "Connection Error",
        description: "Please provide both shop name and access token",
        variant: "destructive",
      });
      return false;
    }
    
    setIsConnecting(true);
    
    try {
      const shopifyService = new ShopifyService({ 
        shopName, 
        accessToken 
      });
      
      const isValid = await shopifyService.validateCredentials();
      
      if (isValid) {
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
      const shopifyService = new ShopifyService({ shopName, accessToken });
      
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
