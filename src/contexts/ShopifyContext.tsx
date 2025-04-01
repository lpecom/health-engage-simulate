
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast"; // Import directly from hooks/use-toast
import { supabase } from '@/integrations/supabase/client';
import { ShopifyOrderPayload } from '@/services/ShopifyService';

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
  // Remove useToast hook usage and use the direct toast function
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  
  // Check if Shopify integration is configured on mount
  useEffect(() => {
    validateCredentials();
  }, []);
  
  // Validate Shopify credentials directly using edge function
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
      // Validate the credentials using edge function
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
      // Format phone number correctly based on country
      let phone = orderData.shipping.phone;
      
      // Ensure phone number starts with + and country code
      if (orderData.shipping.country === "PT" && !phone.startsWith("+")) {
        if (phone.startsWith("351")) {
          phone = "+" + phone;
        } else {
          phone = "+351" + phone.replace(/^0+/, '');
        }
      } else if (orderData.shipping.country === "IT" && !phone.startsWith("+")) {
        if (phone.startsWith("39")) {
          phone = "+" + phone;
        } else {
          phone = "+39" + phone.replace(/^0+/, '');
        }
      } else if (orderData.shipping.country === "ES" && !phone.startsWith("+")) {
        if (phone.startsWith("34")) {
          phone = "+" + phone;
        } else {
          phone = "+34" + phone.replace(/^0+/, '');
        }
      }
      
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
            phone: phone
          },
          shipping_address: {
            first_name: orderData.shipping.firstName,
            last_name: orderData.shipping.lastName,
            address1: orderData.shipping.address,
            city: orderData.shipping.city,
            province: orderData.shipping.province,
            zip: orderData.shipping.postalCode,
            country: orderData.shipping.country,
            phone: phone
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
      
      // Save the order to Supabase
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert({
            product_name: orderData.product.title,
            product_quantity: orderData.product.units,
            product_price: orderData.product.price,
            shipping_price: 0, // Free shipping
            total_price: orderData.product.price * orderData.product.units,
            customer_name: orderData.shipping.firstName,
            customer_surname: orderData.shipping.lastName,
            customer_phone: phone,
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
        // Continue even if database save fails
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
