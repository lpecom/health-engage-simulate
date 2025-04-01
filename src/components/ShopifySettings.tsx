
import React, { useState } from 'react';
import { useShopify } from '@/contexts/ShopifyContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck } from 'lucide-react';

const ShopifySettings = () => {
  const { translate } = useLanguage();
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
  
  const handleConnect = async () => {
    setShopName(localShopName);
    setAccessToken(localAccessToken);
    setApiKey(localApiKey);
    setApiSecret(localApiSecret);
    await connectToShopify();
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
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-4">
          <Button
            onClick={handleConnect}
            className="w-full"
            disabled={isConnecting || !localShopName || !localAccessToken || !localApiKey || !localApiSecret}
          >
            {isConnecting ? translate('connecting') : translate('connect')}
          </Button>
          
          {isConfigured && (
            <div className="flex items-center justify-center text-sm text-green-600 gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{translate('shopifyConnected')}</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ShopifySettings;
