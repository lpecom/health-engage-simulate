import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the structure for translations
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Define the context type
interface LanguageContextProps {
  language: string;
  translate: (key: string) => string;
  setLanguage: (lang: string) => void;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  translate: (key: string) => key,
  setLanguage: () => {},
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Function to translate a key to the current language
  const translate = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  // Define translations for different languages
  const translations: Translations = {
    en: {
      'hello': 'Hello',
      'points': 'Points',
      'streak': 'Streak',
      'readings': 'Readings',
      'home': 'Home',
      'profile': 'Profile',
      'howitworks': 'How it Works',
      'benefits': 'Benefits',
      'safety': 'Safety',
      'achievementUnlocked': 'Achievement Unlocked!',
      'deviceOnTheWay': 'Your Device is On The Way',
      'yourDeviceIsBeingShipped': 'Your GlucoVista device is currently being shipped to your address. Please be ready to receive it.',
      'ordered': 'Ordered',
      'shipping': 'Shipping',
      'delivered': 'Delivered',
      'estimatedDelivery': 'Estimated Delivery',
      'days': 'days',
      'completed': 'Completed',
      'inProgress': 'In Progress',
      'pending': 'Pending',
      'paymentMethod': 'Payment Method',
      'cashOnDelivery': 'Cash on Delivery',
      'whatToExpect': 'What to Expect',
      'courierContact': 'The courier will contact you before delivery.',
      'preparePayment': 'Have your payment ready upon delivery.',
      'inspectDevice': 'Inspect the device before accepting delivery.',
      'followSetupInstructions': 'Follow the setup instructions in this app.',
      'connectYourDevice': 'Connect Your Device',
      'deviceSerialNumber': 'Device Serial Number',
      'enterSerialNumber': 'Enter Serial Number',
      'turnOnYourDevice': 'Turn on your GlucoVista device.',
      'enableBluetooth': 'Enable Bluetooth on your phone.',
      'enterSerialAndConnect': 'Enter the serial number and press Connect.',
      'connectDevice': 'Connect Device',
      'learnAboutGlucoVista': 'Learn About GlucoVista',
    },
    es: {
      'hello': 'Hola',
      'points': 'Puntos',
      'streak': 'Racha',
      'readings': 'Lecturas',
      'home': 'Inicio',
      'profile': 'Perfil',
      'howitworks': 'Cómo Funciona',
      'benefits': 'Beneficios',
      'safety': 'Seguridad',
      'achievementUnlocked': '¡Logro Desbloqueado!',
      'deviceOnTheWay': 'Tu Dispositivo está en Camino',
      'yourDeviceIsBeingShipped': 'Tu dispositivo GlucoVista está siendo enviado a tu dirección. Por favor, prepárate para recibirlo.',
      'ordered': 'Pedido',
      'shipping': 'Enviando',
      'delivered': 'Entregado',
      'estimatedDelivery': 'Entrega Estimada',
      'days': 'días',
      'completed': 'Completado',
      'inProgress': 'En Progreso',
      'pending': 'Pendiente',
      'paymentMethod': 'Método de Pago',
      'cashOnDelivery': 'Pago Contra Entrega',
      'whatToExpect': 'Qué Esperar',
      'courierContact': 'El mensajero te contactará antes de la entrega.',
      'preparePayment': 'Ten listo tu pago al momento de la entrega.',
      'inspectDevice': 'Inspecciona el dispositivo antes de aceptar la entrega.',
      'followSetupInstructions': 'Sigue las instrucciones de configuración en esta aplicación.',
      'connectYourDevice': 'Conecta Tu Dispositivo',
      'deviceSerialNumber': 'Número de Serie del Dispositivo',
      'enterSerialNumber': 'Ingresa el Número de Serie',
      'turnOnYourDevice': 'Enciende tu dispositivo GlucoVista.',
      'enableBluetooth': 'Activa el Bluetooth en tu teléfono.',
      'enterSerialAndConnect': 'Ingresa el número de serie y presiona Conectar.',
      'connectDevice': 'Conectar Dispositivo',
      'learnAboutGlucoVista': 'Aprende Sobre GlucoVista',
    },
    pt: {
      'hello': 'Olá',
      'points': 'Pontos',
      'streak': 'Sequência',
      'readings': 'Leituras',
      'home': 'Início',
      'profile': 'Perfil',
      'howitworks': 'Como Funciona',
      'benefits': 'Benefícios',
      'safety': 'Segurança',
      'achievementUnlocked': 'Conquista Desbloqueada!',
      'deviceOnTheWay': 'Seu Dispositivo está a Caminho',
      'yourDeviceIsBeingShipped': 'Seu dispositivo GlucoVista está sendo enviado para seu endereço. Por favor, esteja pronto para recebê-lo.',
      'ordered': 'Pedido',
      'shipping': 'Enviando',
      'delivered': 'Entregue',
      'estimatedDelivery': 'Entrega Estimada',
      'days': 'dias',
      'completed': 'Concluído',
      'inProgress': 'Em Andamento',
      'pending': 'Pendente',
      'paymentMethod': 'Método de Pagamento',
      'cashOnDelivery': 'Pagamento na Entrega',
      'whatToExpect': 'O que Esperar',
      'courierContact': 'O entregador entrará em contato antes da entrega.',
      'preparePayment': 'Tenha seu pagamento pronto no momento da entrega.',
      'inspectDevice': 'Inspecione o dispositivo antes de aceitar a entrega.',
      'followSetupInstructions': 'Siga as instruções de configuração neste aplicativo.',
      'connectYourDevice': 'Conecte Seu Dispositivo',
      'deviceSerialNumber': 'Número de Série do Dispositivo',
      'enterSerialNumber': 'Digite o Número de Série',
      'turnOnYourDevice': 'Ligue seu dispositivo GlucoVista.',
      'enableBluetooth': 'Ative o Bluetooth no seu telefone.',
      'enterSerialAndConnect': 'Digite o número de série e pressione Conectar.',
      'connectDevice': 'Conectar Dispositivo',
      'learnAboutGlucoVista': 'Saiba Mais Sobre o GlucoVista',
    },
  };

  return (
    <LanguageContext.Provider value={{ language, translate, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
