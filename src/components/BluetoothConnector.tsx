
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Bluetooth, 
  BluetoothOff, 
  BluetoothConnected, 
  ArrowRight, 
  HelpCircle,
  Info,
  ChevronRight
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

enum ConnectionState {
  INITIAL,
  TUTORIAL,
  SCANNING,
  CONNECTING,
  FAILED,
  CONNECTED
}

const BluetoothConnector: React.FC = () => {
  const { translate } = useLanguage();
  const { userData } = useUser();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.INITIAL);
  const [progress, setProgress] = useState(0);
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState<boolean | null>(null);
  
  // Check if Bluetooth is available in the browser
  useEffect(() => {
    const checkBluetooth = async () => {
      if ('bluetooth' in navigator) {
        setIsBluetoothAvailable(true);
      } else {
        setIsBluetoothAvailable(false);
      }
    };
    
    checkBluetooth();
  }, []);
  
  // Progress simulation for scanning
  useEffect(() => {
    let interval: number;
    
    if (connectionState === ConnectionState.SCANNING) {
      interval = window.setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            setConnectionState(ConnectionState.CONNECTING);
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 150);
    } else if (connectionState === ConnectionState.CONNECTING) {
      interval = window.setInterval(() => {
        // After a delay, show the failure state
        setTimeout(() => {
          setConnectionState(ConnectionState.FAILED);
          toast({
            title: "Dispositivo no encontrado",
            description: "No se ha detectado el dispositivo Accu-Tech Healthineers. Asegúrate de que esté encendido y cerca de tu teléfono.",
            variant: "destructive",
            duration: 5000,
          });
        }, 3000);
        
        clearInterval(interval);
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connectionState, toast]);
  
  const startConnection = () => {
    setConnectionState(ConnectionState.TUTORIAL);
  };
  
  const startScanning = async () => {
    setConnectionState(ConnectionState.SCANNING);
    setProgress(0);
    
    toast({
      title: "Buscando dispositivo",
      description: "Asegúrate de que tu dispositivo Accu-Tech esté encendido y en modo de emparejamiento",
      duration: 3000,
    });
  };
  
  const retryConnection = () => {
    setConnectionState(ConnectionState.SCANNING);
    setProgress(0);
  };
  
  const renderInitialState = () => (
    <div className="text-center">
      <div className="w-24 h-24 rounded-full bg-accu-tech-lightest flex items-center justify-center mx-auto mb-6">
        <Bluetooth className="h-14 w-14 text-accu-tech-blue animate-pulse" />
      </div>
      
      <h2 className="text-xl font-bold mb-3">Conecta tu dispositivo</h2>
      <p className="text-gray-600 mb-6 max-w-xs mx-auto">
        Conecta tu dispositivo Accu-Tech Healthineers para medir tu glucosa sin dolor
      </p>
      
      <Button 
        onClick={startConnection}
        className="bg-accu-tech-blue hover:bg-accu-tech-blue/90 text-white py-6 px-8 rounded-full font-medium text-lg shadow-md hover:shadow-lg transform transition hover:scale-105 animate-pulse-slow"
      >
        Conectar Dispositivo
      </Button>
      
      {isBluetoothAvailable === false && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg text-center border border-red-100">
          <div className="flex items-center justify-center mb-2">
            <BluetoothOff className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-600 font-medium">Bluetooth no disponible</p>
          </div>
          <p className="text-red-600 text-sm">
            Tu navegador no soporta Bluetooth o está desactivado. Por favor, activa Bluetooth en tu dispositivo.
          </p>
        </div>
      )}
    </div>
  );
  
  const renderTutorial = () => (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-2">Cómo conectar tu dispositivo</h2>
        <p className="text-gray-600 text-sm">Sigue estos pasos para emparejar tu dispositivo Accu-Tech</p>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-start">
          <div className="bg-accu-tech-lightest rounded-full p-2 mr-3 flex-shrink-0">
            <div className="w-7 h-7 flex items-center justify-center font-bold text-accu-tech-blue">1</div>
          </div>
          <div>
            <h3 className="font-medium mb-1">Enciende tu dispositivo</h3>
            <p className="text-sm text-gray-600">Mantén presionado el botón de encendido durante 3 segundos hasta que veas la luz azul.</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-accu-tech-lightest rounded-full p-2 mr-3 flex-shrink-0">
            <div className="w-7 h-7 flex items-center justify-center font-bold text-accu-tech-blue">2</div>
          </div>
          <div>
            <h3 className="font-medium mb-1">Activa el modo emparejamiento</h3>
            <p className="text-sm text-gray-600">Presiona el botón de emparejamiento dos veces seguidas. La luz comenzará a parpadear.</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-accu-tech-lightest rounded-full p-2 mr-3 flex-shrink-0">
            <div className="w-7 h-7 flex items-center justify-center font-bold text-accu-tech-blue">3</div>
          </div>
          <div>
            <h3 className="font-medium mb-1">Mantén el dispositivo cerca</h3>
            <p className="text-sm text-gray-600">Asegúrate de que el dispositivo esté a menos de 10 cm de tu teléfono durante el proceso de emparejamiento.</p>
          </div>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-accu-tech-blue">
            <div className="flex items-center">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span>¿Tienes problemas para conectar?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="text-sm space-y-2 text-gray-600 list-disc pl-5">
              <li>Asegúrate de que tu dispositivo tiene batería suficiente</li>
              <li>Verifica que el Bluetooth de tu teléfono esté activado</li>
              <li>Mantén el dispositivo y el teléfono cerca durante el emparejamiento</li>
              <li>Reinicia el dispositivo si el problema persiste</li>
              <li>Si continúas teniendo problemas, contáctanos para asistencia</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex justify-center">
        <Button 
          onClick={startScanning}
          className="bg-accu-tech-blue hover:bg-accu-tech-blue/90 text-white"
        >
          Buscar dispositivo
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center border border-blue-100">
        <div className="flex items-center justify-center mb-1">
          <Info className="h-4 w-4 text-blue-500 mr-2" />
          <p className="text-blue-600 font-medium text-sm">Nota importante</p>
        </div>
        <p className="text-blue-600 text-xs">
          Esta es una versión de demostración. Como aún no tienes el dispositivo físico, la conexión no podrá completarse.
        </p>
      </div>
    </div>
  );
  
  const renderScanning = () => (
    <div className="text-center">
      <div className="w-24 h-24 rounded-full bg-accu-tech-lightest flex items-center justify-center mx-auto mb-6 relative">
        <Bluetooth className="h-14 w-14 text-accu-tech-blue animate-ping absolute opacity-75" />
        <Bluetooth className="h-14 w-14 text-accu-tech-blue relative" />
      </div>
      
      <h2 className="text-xl font-bold mb-3">Buscando dispositivos cercanos</h2>
      <p className="text-gray-600 mb-4 max-w-xs mx-auto">
        Asegúrate de que tu dispositivo esté encendido y en modo de emparejamiento
      </p>
      
      <div className="mb-2">
        <Progress value={progress} className="h-2" />
      </div>
      <p className="text-sm text-gray-500 mb-6">{progress}%</p>
      
      <Button 
        onClick={() => setConnectionState(ConnectionState.INITIAL)}
        variant="outline"
        className="border-accu-tech-blue text-accu-tech-blue"
      >
        Cancelar
      </Button>
    </div>
  );
  
  const renderConnecting = () => (
    <div className="text-center">
      <div className="w-24 h-24 rounded-full bg-accu-tech-lightest flex items-center justify-center mx-auto mb-6">
        <BluetoothConnected className="h-14 w-14 text-accu-tech-blue animate-pulse" />
      </div>
      
      <h2 className="text-xl font-bold mb-3">Conectando al dispositivo</h2>
      <p className="text-gray-600 mb-6 max-w-xs mx-auto">
        Se ha encontrado un dispositivo. Estableciendo conexión...
      </p>
      
      <div className="flex justify-center items-center space-x-2">
        <div className="animate-bounce w-3 h-3 bg-accu-tech-blue rounded-full"></div>
        <div className="animate-bounce w-3 h-3 bg-accu-tech-blue rounded-full" style={{ animationDelay: '0.2s' }}></div>
        <div className="animate-bounce w-3 h-3 bg-accu-tech-blue rounded-full" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
  
  const renderFailed = () => (
    <div className="text-center">
      <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
        <BluetoothOff className="h-14 w-14 text-red-500" />
      </div>
      
      <h2 className="text-xl font-bold mb-3">No se pudo conectar</h2>
      <p className="text-gray-600 mb-6 max-w-xs mx-auto">
        No se ha detectado el dispositivo Accu-Tech Healthineers. Esto es normal si aún no tienes el dispositivo físico.
      </p>
      
      <div className="p-4 bg-yellow-50 rounded-lg mb-6 border border-yellow-100 max-w-xs mx-auto">
        <h3 className="font-medium text-yellow-800 mb-2">¿No tienes tu dispositivo aún?</h3>
        <p className="text-sm text-yellow-700">
          Tu dispositivo Accu-Tech Healthineers está en camino. Mientras tanto, puedes explorar la aplicación para familiarizarte con sus funciones.
        </p>
      </div>
      
      <div className="flex justify-center space-x-3">
        <Button 
          onClick={retryConnection}
          className="bg-accu-tech-blue hover:bg-accu-tech-blue/90 text-white"
        >
          Intentar de nuevo
        </Button>
        
        <Button 
          onClick={() => setConnectionState(ConnectionState.INITIAL)}
          variant="outline"
          className="border-gray-300"
        >
          Volver
        </Button>
      </div>
    </div>
  );
  
  const renderConnected = () => (
    <div className="text-center">
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <BluetoothConnected className="h-14 w-14 text-green-500" />
      </div>
      
      <h2 className="text-xl font-bold mb-3">¡Dispositivo conectado!</h2>
      <p className="text-gray-600 mb-6 max-w-xs mx-auto">
        Tu dispositivo Accu-Tech Healthineers está listo para usar.
      </p>
      
      <Button 
        className="bg-accu-tech-blue hover:bg-accu-tech-blue/90 text-white"
      >
        Comenzar a medir
      </Button>
    </div>
  );
  
  return (
    <div className="medical-card flex flex-col items-center">
      <div className="w-full max-w-sm mx-auto">
        <div className={`relative rounded-xl overflow-hidden bg-gray-100 aspect-[2/3] mb-6 border-2 border-gray-200 shadow-lg ${isMobile ? 'max-h-[450px]' : ''}`}>
          <div className="absolute inset-4 bg-gray-800 rounded-lg flex flex-col items-center justify-center p-6 overflow-auto">
            <div className="bg-white rounded-lg p-4 w-full h-full overflow-y-auto">
              {connectionState === ConnectionState.INITIAL && renderInitialState()}
              {connectionState === ConnectionState.TUTORIAL && renderTutorial()}
              {connectionState === ConnectionState.SCANNING && renderScanning()}
              {connectionState === ConnectionState.CONNECTING && renderConnecting()}
              {connectionState === ConnectionState.FAILED && renderFailed()}
              {connectionState === ConnectionState.CONNECTED && renderConnected()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BluetoothConnector;
