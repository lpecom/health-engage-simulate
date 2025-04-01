
import React, { useState, useEffect } from 'react';
import { useShopify } from '@/contexts/ShopifyContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, AlertCircle, CheckCircle, Info, HelpCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const ShopifySettings = () => {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const { 
    connectToShopify,
    isConnecting,
    isConfigured
  } = useShopify();
  
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  
  // Set connection status based on isConfigured
  useEffect(() => {
    setConnectionStatus(isConfigured ? 'success' : 'idle');
  }, [isConfigured]);
  
  useEffect(() => {
    setConnectionStatus(isConnecting ? 'connecting' : connectionStatus);
  }, [isConnecting, connectionStatus]);
  
  // Check if we have any orders in Supabase
  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        const { count, error } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error fetching orders count:', error);
        } else {
          setOrdersCount(count || 0);
        }
      } catch (error) {
        console.error('Failed to fetch orders count:', error);
      }
    };
    
    fetchOrdersCount();
  }, []);
  
  const handleConnect = async () => {
    setErrorMessage('');
    setErrorDetails(null);
    
    try {
      const { success, error, details } = await connectToShopify();
      
      if (success) {
        setConnectionStatus('success');
        toast({
          title: "Shopify Connected",
          description: "Successfully connected to your Shopify store using credentials from Supabase secrets.",
        });
      } else {
        setConnectionStatus('error');
        setErrorMessage(error || 'Failed to connect to Shopify. Please check your Supabase secrets.');
        if (details) {
          setErrorDetails(details);
        }
      }
    } catch (error) {
      console.error('Error connecting to Shopify:', error);
      setConnectionStatus('error');
      setErrorMessage('An unexpected error occurred. Please check the Edge Function logs for more details.');
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'connecting': return 'text-amber-600';
      default: return 'text-gray-400';
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{translate('shopifyIntegration')}</CardTitle>
          <Badge variant={connectionStatus === 'success' ? 'success' : 'outline'} className="ml-2">
            {connectionStatus === 'success' ? 'Connected' : 'Not Connected'}
          </Badge>
        </div>
        <CardDescription>
          {translate('shopifyIntegrationDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-800">
            This page validates the connection to Shopify using credentials stored in Supabase secrets.
          </AlertDescription>
        </Alert>
        
        {connectionStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 flex flex-col gap-3 my-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errorMessage || 'Connection failed. Please check your Supabase secrets and try again.'}</p>
            </div>
            
            {errorDetails && (
              <div className="pl-7 mt-1">
                <div className="text-xs font-mono bg-red-100 p-2 rounded text-red-800 overflow-auto max-h-32">
                  {errorDetails}
                </div>
              </div>
            )}
            
            {errorMessage && errorMessage.includes("404") && (
              <div className="pl-7 mt-1 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-800">
                  A 404 error usually means the Shopify store name is incorrect. Make sure your store name is entered correctly in the Supabase secrets.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <h4 className="font-medium text-blue-800 mb-2">Shopify Connection Instructions</h4>
          <p className="text-sm text-blue-700 mb-2">
            Your Shopify credentials are securely stored as Supabase secrets. Make sure you have set these secrets correctly:
          </p>
          <ul className="list-disc list-inside ml-2 text-xs text-blue-600 space-y-1 mb-3">
            <li><span className="font-mono font-semibold">SHOPIFY_STORE_NAME</span> - Your Shopify store name without the ".myshopify.com" part</li>
            <li><span className="font-mono font-semibold">SHOPIFY_ACCESS_TOKEN</span> - Your Shopify admin API access token</li>
            <li><span className="font-mono font-semibold">SHOPIFY_API_KEY</span> - Your Shopify API key</li>
            <li><span className="font-mono font-semibold">SHOPIFY_API_SECRET</span> - Your Shopify API secret</li>
          </ul>
          <div className="flex items-center justify-between mt-3 text-xs text-blue-700">
            <span>Need to update these values?</span>
            <a 
              href="https://supabase.com/dashboard/project/zccjmsppyzvvguxkjnuv/settings/functions" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-800 hover:underline"
            >
              Go to Supabase Secrets <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-4">
          <Button
            onClick={handleConnect}
            className="w-full"
            disabled={connectionStatus === 'connecting'}
          >
            {connectionStatus === 'connecting' ? translate('connecting') : 'Test Connection'}
          </Button>
          
          <div className={`flex items-center justify-center text-sm gap-2 ${getStatusColor()}`}>
            {connectionStatus === 'success' && (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>{translate('shopifyConnected')}</span>
              </>
            )}
            {connectionStatus === 'idle' && !isConfigured && (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Not connected to Shopify</span>
              </>
            )}
          </div>
          
          {ordersCount !== null && (
            <div className="text-center text-sm text-gray-500 pt-2 border-t">
              {ordersCount > 0 ? (
                <p>You have {ordersCount} {ordersCount === 1 ? 'order' : 'orders'} in your database.</p>
              ) : (
                <p>No orders in your database yet.</p>
              )}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ShopifySettings;
