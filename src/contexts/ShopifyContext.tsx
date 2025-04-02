
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { ShopifyOrderPayload } from '@/services/ShopifyService';
import { 
  CountryCode, 
  formatPhoneForCountry, 
  isValidPhoneForCountry, 
  normalizeToE164 
} from '@/data/countries';
import { CheckoutOrderData } from '@/types/userData';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";

interface ShopifyContextType {
  isConfigured: boolean;
  isConnecting: boolean;
  configError: string | null;
  connectToShopify: () => Promise<{success: boolean, error?: string, details?: string}>;
  exportOrder: (orderData: CheckoutOrderData) => Promise<boolean>;
}

interface ShopifyProviderProps {
  children: React.ReactNode;
}

const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

export const ShopifyProvider: React.FC<ShopifyProviderProps> = ({ children }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  
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
        setConfigError(`Connection error: ${validationError.message}`);
        setIsConfigured(false);
        return false;
      }
      
      // Check response from the function itself
      if (validationData?.success) {
        console.log('Shopify credentials validated successfully');
        setIsConfigured(true);
        setConfigError(null);
        return true;
      } else {
        const errorMessage = validationData?.error || "Invalid Shopify configuration";
        console.log(`Shopify credentials are invalid: ${errorMessage}`);
        
        // Store readable error for UI feedback
        if (validationData?.error === "Store not found: The Shopify store name may be incorrect") {
          setConfigError("Shopify store not found. Please check your configuration.");
        } else if (validationData?.error === "Authentication failed: Invalid API key or access token") {
          setConfigError("Invalid Shopify API credentials. Check your API key and access token.");
        } else {
          setConfigError(errorMessage);
        }
        
        setIsConfigured(false);
        return false;
      }
    } catch (error) {
      console.error('Failed to validate Shopify credentials:', error);
      setConfigError(`Connection error: ${error.message}`);
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
        setConfigError(`Connection error: ${error.message}`);
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
        setConfigError(null);
        return {success: true};
      } else {
        const errorMessage = data?.error || "Invalid Shopify credentials";
        const errorDetails = data?.details || (data ? JSON.stringify(data, null, 2) : null);
        
        toast({
          title: "Connection Failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Store readable error for UI feedback
        if (data?.error === "Store not found: The Shopify store name may be incorrect") {
          setConfigError("Shopify store not found. Please check your configuration.");
        } else if (data?.error === "Authentication failed: Invalid API key or access token") {
          setConfigError("Invalid Shopify API credentials. Check your API key and access token.");
        } else {
          setConfigError(errorMessage);
        }
        
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
      setConfigError(`Connection error: ${error.message}`);
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
      // Handle submission when Shopify isn't configured by sending as a simple order
      try {
        // Save order data to Supabase without exporting to Shopify
        const formattedPhone = normalizeToE164(orderData.shipping.phone, orderData.shipping.country as CountryCode);
        
        const { data, error } = await supabase
          .from('orders')
          .insert({
            product_name: orderData.product.title,
            product_quantity: orderData.product.units,
            product_price: orderData.product.price,
            shipping_price: orderData.product.shipping || 0,
            total_price: (orderData.product.price * orderData.product.units) + (orderData.product.shipping || 0),
            customer_name: orderData.shipping.firstName,
            customer_surname: orderData.shipping.lastName,
            customer_phone: formattedPhone,
            customer_address: orderData.shipping.address,
            province: orderData.shipping.province,
            city: orderData.shipping.city,
            zip_code: orderData.shipping.postalCode,
            exported_to_shopify: false,
            status: 'pending',
            payment_method: 'COD'
          })
          .select();
          
        if (error) {
          console.error('Error saving order to Supabase:', error);
          toast({
            title: "Order Submission Failed",
            description: "Could not save your order information. Please try again.",
            variant: "destructive",
          });
          return false;
        }
        
        console.log('Order saved to Supabase (without Shopify export):', data);
        return true;
      } catch (error) {
        console.error('Error processing order:', error);
        toast({
          title: "Order Submission Failed",
          description: "An error occurred while processing your order.",
          variant: "destructive",
        });
        return false;
      }
    }
    
    try {
      // Validate phone number before proceeding
      if (!isValidPhoneForCountry(orderData.shipping.phone, orderData.shipping.country as CountryCode)) {
        toast({
          title: "Invalid Phone Number",
          description: `Please enter a valid phone number for ${orderData.shipping.country}`,
          variant: "destructive",
        });
        return false;
      }
      
      // Format phone number to E.164 format (required by Shopify API)
      const formattedPhone = normalizeToE164(orderData.shipping.phone, orderData.shipping.country as CountryCode);
      
      console.log('Original phone:', orderData.shipping.phone);
      console.log('Normalized E.164 phone:', formattedPhone);
      
      const payload: ShopifyOrderPayload = {
        order: {
          line_items: [
            {
              variant_id: orderData.product.id,
              quantity: orderData.product.units,
              price: orderData.product.price.toString(),
              title: orderData.product.title || "Accu-Tech Glucometer", // Add title to line_items
              name: orderData.product.title || "Accu-Tech Glucometer"  // Add name to line_items
            }
          ],
          customer: {
            first_name: orderData.shipping.firstName,
            last_name: orderData.shipping.lastName,
            phone: formattedPhone,
            email: orderData.shipping.email || `${orderData.shipping.firstName.toLowerCase()}.${orderData.shipping.lastName.toLowerCase()}@example.com`
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
      
      console.log('Exporting order to Shopify with payload:', JSON.stringify(payload, null, 2));
      
      const { data: orderResponse, error: orderError } = await supabase.functions.invoke('shopify', {
        body: {
          action: 'createOrder',
          payload
        }
      });
      
      if (orderError) {
        console.error('Error creating Shopify order:', orderError);
        toast({
          title: "Export Failed",
          description: "Failed to create order in Shopify: " + orderError.message,
          variant: "destructive",
        });
        return false;
      }
      
      if (orderResponse?.error) {
        console.error('Shopify order creation failed:', orderResponse.error);
        
        let errorMessage = "Failed to create order in Shopify";
        if (orderResponse.error.shopifyError?.errors) {
          const errors = orderResponse.error.shopifyError.errors;
          errorMessage = Object.entries(errors)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        }
        
        toast({
          title: "Export Failed",
          description: errorMessage,
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
            shipping_price: orderData.product.shipping || 0,
            total_price: (orderData.product.price * orderData.product.units) + (orderData.product.shipping || 0),
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
        configError,
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
