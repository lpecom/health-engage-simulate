
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bluetooth, 
  BluetoothConnected,
  BluetoothOff,
  Wifi,
  Check,
  AlertCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const BluetoothConnection: React.FC = () => {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceName, setDeviceName] = useState("GlucoVista G1");
  const [showConnectionGuide, setShowConnectionGuide] = useState(false);
  
  const handleScanClick = () => {
    setIsScanning(true);
    
    // Simulate finding a device after 2 seconds
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: translate('deviceFound') || 'Device found',
        description: `${deviceName} ${translate('foundNearby') || 'found nearby'}`,
        variant: "default",
      });
    }, 2000);
  };
  
  const handleConnectClick = () => {
    setIsScanning(true);
    
    // Simulate connecting to a device after 3 seconds
    setTimeout(() => {
      setIsScanning(false);
      setIsConnected(true);
      toast({
        title: translate('connected') || 'Connected',
        description: `${translate('successfullyConnectedTo') || 'Successfully connected to'} ${deviceName}`,
        variant: "default",
      });
    }, 3000);
  };
  
  const handleDisconnectClick = () => {
    setIsConnected(false);
    toast({
      title: translate('disconnected') || 'Disconnected',
      description: `${translate('deviceDisconnected') || 'Device disconnected successfully'}`,
      variant: "default",
    });
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center">
              {isConnected ? 
                <BluetoothConnected className="h-5 w-5 text-medical-primary mr-2" /> : 
                <Bluetooth className="h-5 w-5 text-gray-400 mr-2" />
              }
              {translate('glucometerConnection') || 'Glucometer Connection'}
            </div>
            {isConnected && (
              <span className="text-sm font-normal flex items-center text-green-600">
                <Check className="h-4 w-4 mr-1" /> 
                {translate('connected') || 'Connected'}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {!isConnected ? (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  {translate('connectYourDeviceToMonitor') || 'Connect your glucose monitoring device to track your readings in real-time.'}
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs mb-4" 
                  onClick={() => setShowConnectionGuide(true)}
                >
                  {translate('howToConnect') || 'How to connect?'}
                </Button>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium">{deviceName}</span>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {translate('available') || 'Available'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={isScanning}
                  onClick={handleScanClick}
                >
                  {isScanning ? (
                    <>
                      <span className="animate-spin mr-2">⚪</span>
                      {translate('scanning') || 'Scanning...'}
                    </>
                  ) : (
                    translate('scanForDevices') || 'Scan for devices'
                  )}
                </Button>
                
                <Button
                  className="flex-1"
                  disabled={isScanning}
                  onClick={handleConnectClick}
                >
                  {isScanning ? (
                    <>
                      <span className="animate-spin mr-2">⚪</span>
                      {translate('connecting') || 'Connecting...'}
                    </>
                  ) : (
                    translate('connect') || 'Connect'
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <div className="bg-green-50 border border-green-100 rounded-md p-3 mb-4">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {translate('deviceConnectedSuccessfully') || 'Device connected successfully'}
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        {translate('yourReadingsWillSyncAutomatically') || 'Your readings will sync automatically when new measurements are taken.'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <BluetoothConnected className="h-4 w-4 text-medical-primary mr-2" />
                      <span className="text-sm font-medium">{deviceName}</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {translate('connected') || 'Connected'}
                    </span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {translate('deviceId') || 'Device ID'}:
                      </span>
                      <span className="font-mono">GV-{Math.floor(10000 + Math.random() * 90000)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">
                        {translate('batteryLevel') || 'Battery Level'}:
                      </span>
                      <span>87%</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">
                        {translate('lastSync') || 'Last Sync'}:
                      </span>
                      <span>{translate('justNow') || 'Just now'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDisconnectClick}
              >
                <BluetoothOff className="h-4 w-4 mr-2" />
                {translate('disconnect') || 'Disconnect'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showConnectionGuide} onOpenChange={setShowConnectionGuide}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translate('howToConnectYourDevice') || 'How to Connect Your Device'}</DialogTitle>
            <DialogDescription>
              {translate('followTheseStepsToConnectYourGlucometer') || 'Follow these steps to connect your glucometer via Bluetooth.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="flex">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                1
              </div>
              <p className="text-sm">
                {translate('turnOnYourDeviceAndEnsureItHasBattery') || 'Turn on your GlucoVista device and ensure it has sufficient battery.'}
              </p>
            </div>
            
            <div className="flex">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                2
              </div>
              <p className="text-sm">
                {translate('enableBluetoothOnYourPhone') || 'Enable Bluetooth on your phone and keep it within 30 feet of your device.'}
              </p>
            </div>
            
            <div className="flex">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                3
              </div>
              <p className="text-sm">
                {translate('pressAndHoldButtonOnDevice') || 'Press and hold the pairing button on your GlucoVista device for 5 seconds until the LED flashes blue.'}
              </p>
            </div>
            
            <div className="flex">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                4
              </div>
              <p className="text-sm">
                {translate('clickOnScanForDevices') || 'Click on "Scan for Devices" in the app and select your device when it appears.'}
              </p>
            </div>
            
            <div className="flex">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                5
              </div>
              <p className="text-sm">
                {translate('followPrompts') || 'Follow any additional prompts on your device or app to complete the pairing process.'}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowConnectionGuide(false)}>
              {translate('gotIt') || 'Got it'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BluetoothConnection;
