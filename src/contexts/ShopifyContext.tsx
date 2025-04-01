
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast"; // Import directly from hooks/use-toast
import { supabase } from '@/integrations/supabase/client';
import { ShopifyOrderPayload } from '@/services/ShopifyService';
import { COUNTRIES } from '@/data/countries';

interface ShopifyContextType {
  isConfigured: boolean;
  isConnecting: boolean;
  connectToShopify: () => Promise<{success: boolean, error?: string, details?: string}>;
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
    country: string;
  };
}

const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

export const ShopifyProvider: React.FC<ShopifyProviderProps> = ({ children }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  
  useEffect(() => {
    validateCredentials();
  }, []);
  
  const validateCredentials = async (): Promise<boolean> => {
    try {
      const { data: validationData, error: validationError } = await supabase.functions.invoke('shopify', {
        body: {
          action: 'validateCredentials'
        }
      });
      
      if (validationError) {
        console.error('Error validating credentials:', validationError);
        setIsConfigured(false);
        return false;
      }
      
      if (validationData?.success) {
        console.log('Shopify credentials validated successfully');
        setIsConfigured(true);
        return true;
      } else {
        console.log('Shopify credentials are invalid');
        setIsConfigured(false);
        return false;
      }
    } catch (error) {
      console.error('Failed to validate Shopify credentials:', error);
      setIsConfigured(false);
      return false;
    }
  };
  
  const connectToShopify = async (): Promise<{success: boolean, error?: string, details?: string}> => {
    setIsConnecting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('shopify', {
        body: {
          action: 'validateCredentials'
        }
      });
      
      if (error) {
        console.error('Error connecting to Shopify:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to the Shopify API: " + error.message,
          variant: "destructive",
        });
        setIsConfigured(false);
        return {
          success: false, 
          error: error.message,
          details: JSON.stringify(error, null, 2)
        };
      }
      
      if (data?.success) {
        toast({
          title: "Connected to Shopify",
          description: "Successfully connected to your Shopify store",
        });
        setIsConfigured(true);
        return {success: true};
      } else {
        const errorMessage = data?.error || "Invalid Shopify credentials";
        const errorDetails = data?.details || (data ? JSON.stringify(data, null, 2) : null);
        
        toast({
          title: "Connection Failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        setIsConfigured(false);
        return {
          success: false, 
          error: errorMessage,
          details: errorDetails
        };
      }
    } catch (error: any) {
      console.error('Error connecting to Shopify:', error);
      toast({
        title: "Connection Error",
        description: "An unexpected error occurred: " + (error.message || "Unknown error"),
        variant: "destructive",
      });
      setIsConfigured(false);
      return {
        success: false, 
        error: "An unexpected error occurred", 
        details: error.message
      };
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Improved phone number formatter that handles country-specific formats
  const formatPhoneNumber = (phone: string, countryCode: string): string => {
    if (!phone) return '';
    
    // First, clean the input by removing all non-digit characters
    let digits = phone.replace(/\D/g, '');
    
    // Handle country-specific formatting
    const formatByCountry = {
      'ES': (digits: string) => {
        // Spain uses +34 followed by 9 digits
        if (digits.startsWith('34')) {
          return `+${digits}`;
        } else {
          return `+34${digits}`;
        }
      },
      'PT': (digits: string) => {
        // Portugal uses +351 followed by 9 digits
        if (digits.startsWith('351')) {
          return `+${digits}`;
        } else {
          return `+351${digits}`;
        }
      },
      'IT': (digits: string) => {
        // Italy uses +39 followed by mobile numbers typically 10 digits
        if (digits.startsWith('39')) {
          return `+${digits}`;
        } else {
          return `+39${digits}`;
        }
      },
      // Add more countries as needed
    };
    
    // If we have a formatter for this country, use it
    if (countryCode && formatByCountry[countryCode]) {
      return formatByCountry[countryCode](digits);
    }
    
    // Default international handling for other countries
    if (digits.startsWith('00')) {
      // Convert 00 international prefix to +
      return '+' + digits.substring(2);
    } else if (!phone.startsWith('+')) {
      // If no + and no country code detected, add +
      return '+' + digits;
    }
    
    // Already has a + prefix
    return '+' + digits;
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
      // Format phone number according to E.164 standard required by Shopify
      const formattedPhone = formatPhoneNumber(orderData.shipping.phone, orderData.shipping.country);
      
      console.log('Original phone:', orderData.shipping.phone);
      console.log('Formatted E.164 phone:', formattedPhone);
      
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
            phone: formattedPhone
          },
          shipping_address: {
            first_name: orderData.shipping.firstName,
            last_name: orderData.shipping.lastName,
            address1: orderData.shipping.address,
            city: orderData.shipping.city,
            province: orderData.shipping.province,
            zip: orderData.shipping.postalCode,
            country: orderData.shipping.country,
            phone: formattedPhone
          },
          financial_status: 'pending',
          send_receipt: true,
          send_fulfillment_receipt: true,
          tags: 'accu-tech-app'
        }
      };
      
      console.log('Exporting order to Shopify with payload:', JSON.stringify(payload));
      
      const { data: orderResponse, error: orderError } = await supabase.functions.invoke('shopify', {
        body: {
          action: 'createOrder',
          payload
        }
      });
      
      if (orderError || !orderResponse) {
        console.error('Error creating Shopify order:', orderError || 'No response');
        toast({
          title: "Export Failed",
          description: "Failed to create order in Shopify",
          variant: "destructive",
        });
        return false;
      }
      
      if (orderResponse.error) {
        console.error('Shopify order creation failed:', orderResponse.error);
        toast({
          title: "Export Failed",
          description: orderResponse.error.shopifyError?.errors ? 
            Object.entries(orderResponse.error.shopifyError.errors)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ') 
            : orderResponse.error,
          variant: "destructive",
        });
        return false;
      }
      
      console.log('Order successfully exported to Shopify:', orderResponse);
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert({
            product_name: orderData.product.title,
            product_quantity: orderData.product.units,
            product_price: orderData.product.price,
            shipping_price: 0,
            total_price: orderData.product.price * orderData.product.units,
            customer_name: orderData.shipping.firstName,
            customer_surname: orderData.shipping.lastName,
            customer_phone: formattedPhone,
            customer_address: orderData.shipping.address,
            province: orderData.shipping.province,
            city: orderData.shipping.city,
            zip_code: orderData.shipping.postalCode,
            exported_to_shopify: true,
            shopify_order_id: orderResponse?.order?.id?.toString(),
            status: 'pending',
            payment_method: 'COD'
          })
          .select();
          
        if (error) {
          console.error('Error saving order to Supabase:', error);
        } else {
          console.log('Order saved to Supabase:', data);
        }
      } catch (dbError) {
        console.error('Failed to save order to Supabase:', dbError);
      }
      
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
