
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
    // Save the order to Supabase first, before attempting Shopify export
    try {
      const formattedPhone = normalizeToE164(orderData.shipping.phone, orderData.shipping.country as CountryCode);
      
      // First save the order to Supabase, regardless of Shopify integration status
      const { data: savedOrderData, error: saveError } = await supabase
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
          
      if (saveError) {
        console.error('Error saving order to Supabase:', saveError);
        toast({
          title: "Order Submission Warning",
          description: "We've received your order but encountered an issue. Our team will contact you.",
          variant: "warning",
        });
        // Return true to allow the user to proceed to success page, even with DB save issues
        return true;
      }
      
      // If Shopify isn't configured, we're done - order is saved to DB
      if (!isConfigured) {
        console.log('Order saved to Supabase (without Shopify export):', savedOrderData);
        return true;
      }
      
      // Now try to export to Shopify if configured
      try {
        // Validate phone number before proceeding
        if (!isValidPhoneForCountry(orderData.shipping.phone, orderData.shipping.country as CountryCode)) {
          console.warn('Invalid phone format, but proceeding with order');
        }
      
        // Format phone number to E.164 format (required by Shopify API)
        console.log('Original phone:', orderData.shipping.phone);
        console.log('Normalized E.164 phone:', formattedPhone);
        
        const payload: ShopifyOrderPayload = {
          order: {
            line_items: [
              {
                variant_id: orderData.product.id,
                quantity: orderData.product.units,
                price: orderData.product.price.toString(),
                title: orderData.product.title || "Accu-Tech Glucometer",
                name: orderData.product.title || "Accu-Tech Glucometer"
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
          
          // Update the order record to indicate the failed Shopify export
          await supabase
            .from('orders')
            .update({ 
              exported_to_shopify: false,
              status: 'pending'
            })
            .eq('id', savedOrderData[0].id);
          
          // We'll show a warning but still consider the order successful
          toast({
            title: "Order Received",
            description: "Your order has been saved. We'll process it shortly.",
            variant: "default",
          });
          
          // Return true because the order is saved in our database
          return true;
        }
        
        if (orderResponse?.error) {
          console.error('Shopify order creation failed:', orderResponse.error);
          
          // Update the order record to indicate the failed Shopify export
          await supabase
            .from('orders')
            .update({ 
              exported_to_shopify: false,
              status: 'pending'
            })
            .eq('id', savedOrderData[0].id);
          
          // We'll show a warning but still consider the order successful
          toast({
            title: "Order Received",
            description: "Your order has been saved. Our team will process it shortly.",
            variant: "default",
          });
          
          // Return true because the order is saved in our database
          return true;
        }
        
        console.log('Order successfully exported to Shopify:', orderResponse);
        
        // Update the order with the Shopify order ID
        try {
          const { error } = await supabase
            .from('orders')
            .update({
              exported_to_shopify: true,
              shopify_order_id: orderResponse?.order?.id?.toString(),
              status: 'pending'
            })
            .eq('id', savedOrderData[0].id);
            
          if (error) {
            console.error('Error updating order with Shopify ID:', error);
          }
        } catch (updateError) {
          console.error('Failed to update order with Shopify ID:', updateError);
        }
        
        toast({
          title: "Order Placed Successfully",
          description: "Your order has been processed and confirmed.",
        });
        
        return true;
      } catch (shopifyError) {
        console.error('Error exporting order to Shopify:', shopifyError);
        
        // We still consider the order successful since it's saved in our database
        toast({
          title: "Order Received",
          description: "Your order has been saved. We'll process it shortly.",
          variant: "default",
        });
        
        return true;
      }
    } catch (error) {
      console.error('Critical error processing order:', error);
      
      // This is a critical error - we couldn't even save to our database
      toast({
        title: "Order Error",
        description: "There was a problem with your order. Please try again or contact support.",
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
