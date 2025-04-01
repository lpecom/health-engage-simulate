
import React, { useState, useEffect } from 'react';
import { useShopify } from '@/contexts/ShopifyContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck, AlertCircle, CheckCircle, ExternalLink, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ShopifySettings = () => {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const {
    shopName,
    setShopName,
    accessToken,
    setAccessToken,
    apiKey,
    setApiKey,
    apiSecret,
    setApiSecret,
    connectToShopify,
    isConnecting,
    isConfigured
  } = useShopify();
  
  const [localShopName, setLocalShopName] = useState(shopName);
  const [localAccessToken, setLocalAccessToken] = useState(accessToken);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localApiSecret, setLocalApiSecret] = useState(apiSecret);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  
  // Update local state when context values change
  useEffect(() => {
    setLocalShopName(shopName);
    setLocalAccessToken(accessToken);
    setLocalApiKey(apiKey);
    setLocalApiSecret(apiSecret);
  }, [shopName, accessToken, apiKey, apiSecret]);
  
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
  
  // Set connection status based on isConfigured
  useEffect(() => {
    setConnectionStatus(isConfigured ? 'success' : 'idle');
  }, [isConfigured]);
  
  useEffect(() => {
    setConnectionStatus(isConnecting ? 'connecting' : connectionStatus);
  }, [isConnecting, connectionStatus]);
  
  const handleConnect = async () => {
    setErrorMessage('');
    
    // Trim input values to remove any accidental whitespace
    const trimmedShopName = localShopName.trim();
    const trimmedAccessToken = localAccessToken.trim();
    const trimmedApiKey = localApiKey.trim();
    const trimmedApiSecret = localApiSecret.trim();
    
    setShopName(trimmedShopName);
    setAccessToken(trimmedAccessToken);
    setApiKey(trimmedApiKey);
    setApiSecret(trimmedApiSecret);
    
    try {
      const success = await connectToShopify();
      
      if (success) {
        setConnectionStatus('success');
        toast({
          title: "Shopify Connected",
          description: "Your Shopify store has been successfully connected.",
        });
      } else {
        setConnectionStatus('error');
        setErrorMessage('Failed to connect to Shopify. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Error connecting to Shopify:', error);
      setConnectionStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
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
        <CardTitle className="text-2xl font-bold">{translate('shopifyIntegration')}</CardTitle>
        <CardDescription>
          {translate('shopifyIntegrationDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-800">
            Your Shopify credentials need to be entered here. The system will also store these in Supabase secrets for secure access.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shopName">{translate('shopifyStoreName')}</Label>
            <Input
              id="shopName"
              placeholder="your-store-name"
              value={localShopName}
              onChange={(e) => setLocalShopName(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {translate('shopifyStoreNameHelp')}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accessToken">{translate('shopifyAccessToken')}</Label>
            <Input
              id="accessToken"
              type="password"
              placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
              value={localAccessToken}
              onChange={(e) => setLocalAccessToken(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {translate('shopifyAccessTokenHelp')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">{translate('shopifyApiKey')}</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {translate('shopifyApiKeyHelp')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiSecret">{translate('shopifyApiSecret')}</Label>
            <Input
              id="apiSecret"
              type="password"
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
              value={localApiSecret}
              onChange={(e) => setLocalApiSecret(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {translate('shopifyApiSecretHelp')}
            </p>
          </div>
          
          {connectionStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errorMessage || 'Connection failed. Please check your credentials and try again.'}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <h4 className="font-medium text-blue-800 mb-1">How to find your Shopify API credentials</h4>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              <li>Go to your Shopify admin panel</li>
              <li>Go to Apps &gt; Develop apps</li>
              <li>Create a new app or select an existing one</li>
              <li>Go to API credentials section</li>
              <li>Under Admin API, create an access token with appropriate permissions</li>
            </ol>
            <div className="mt-2">
              <a 
                href="https://shopify.dev/docs/api/admin-rest" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:underline"
              >
                Shopify API Documentation
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-4">
          <Button
            onClick={handleConnect}
            className="w-full"
            disabled={connectionStatus === 'connecting' || !localShopName || !localAccessToken || !localApiKey || !localApiSecret}
          >
            {connectionStatus === 'connecting' ? translate('connecting') : translate('connect')}
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
