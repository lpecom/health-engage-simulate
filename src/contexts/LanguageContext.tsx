
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'es' | 'pt';

interface Translations {
  [key: string]: {
    en: string;
    es: string;
    pt: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation dictionary
const translations: Translations = {
  // Common
  appName: {
    en: 'GlucoVista',
    es: 'GlucoVista',
    pt: 'GlucoVista',
  },
  onboarding: {
    en: 'Onboarding',
    es: 'Incorporación',
    pt: 'Integração',
  },
  
  // Onboarding
  welcome: {
    en: 'Welcome to GlucoVista',
    es: 'Bienvenido a GlucoVista',
    pt: 'Bem-vindo ao GlucoVista',
  },
  welcomeMessage: {
    en: 'Your painless glucose monitoring solution',
    es: 'Tu solución de monitoreo de glucosa sin dolor',
    pt: 'Sua solução de monitoramento de glicose sem dor',
  },
  getStarted: {
    en: 'Get Started',
    es: 'Comenzar',
    pt: 'Iniciar',
  },
  personalizeExperience: {
    en: 'Personalize Your Experience',
    es: 'Personaliza tu experiencia',
    pt: 'Personalize sua experiência',
  },
  selectLanguage: {
    en: 'Select your preferred language',
    es: 'Selecciona tu idioma preferido',
    pt: 'Selecione seu idioma preferido',
  },
  spanish: {
    en: 'Spanish',
    es: 'Español',
    pt: 'Espanhol',
  },
  portuguese: {
    en: 'Portuguese',
    es: 'Portugués',
    pt: 'Português',
  },
  continue: {
    en: 'Continue',
    es: 'Continuar',
    pt: 'Continuar',
  },
  about: {
    en: 'About You',
    es: 'Acerca de ti',
    pt: 'Sobre você',
  },
  aboutHeading: {
    en: 'Tell us about yourself',
    es: 'Cuéntanos sobre ti',
    pt: 'Conte-nos sobre você',
  },
  name: {
    en: 'Name',
    es: 'Nombre',
    pt: 'Nome',
  },
  age: {
    en: 'Age',
    es: 'Edad',
    pt: 'Idade',
  },
  weight: {
    en: 'Weight (kg)',
    es: 'Peso (kg)',
    pt: 'Peso (kg)',
  },
  gender: {
    en: 'Gender',
    es: 'Género',
    pt: 'Gênero',
  },
  male: {
    en: 'Male',
    es: 'Masculino',
    pt: 'Masculino',
  },
  female: {
    en: 'Female',
    es: 'Femenino',
    pt: 'Feminino',
  },
  other: {
    en: 'Other',
    es: 'Otro',
    pt: 'Outro',
  },
  diabetesType: {
    en: 'Do you have diabetes?',
    es: '¿Tienes diabetes?',
    pt: 'Você tem diabetes?',
  },
  type1: {
    en: 'Type 1',
    es: 'Tipo 1',
    pt: 'Tipo 1',
  },
  type2: {
    en: 'Type 2',
    es: 'Tipo 2',
    pt: 'Tipo 2',
  },
  prediabetes: {
    en: 'Prediabetes',
    es: 'Prediabetes',
    pt: 'Pré-diabetes',
  },
  noDiabetes: {
    en: 'No, I do not have diabetes',
    es: 'No, no tengo diabetes',
    pt: 'Não, eu não tenho diabetes',
  },
  preventionMonitoring: {
    en: 'Prevention/Monitoring',
    es: 'Prevención/Monitoreo',
    pt: 'Prevenção/Monitoramento',
  },
  
  // Goal Selection
  selectGoal: {
    en: 'What is your main health goal?',
    es: '¿Cuál es tu principal objetivo de salud?',
    pt: 'Qual é o seu principal objetivo de saúde?',
  },
  betterBloodSugar: {
    en: 'Better blood sugar control',
    es: 'Mejor control de azúcar en sangre',
    pt: 'Melhor controle de açúcar no sangue',
  },
  weightManagement: {
    en: 'Weight management',
    es: 'Control de peso',
    pt: 'Controle de peso',
  },
  preventDiabetes: {
    en: 'Prevent diabetes',
    es: 'Prevenir diabetes',
    pt: 'Prevenir diabetes',
  },
  improveFitness: {
    en: 'Improve fitness',
    es: 'Mejorar estado físico',
    pt: 'Melhorar condicionamento físico',
  },
  customGoal: {
    en: 'Custom goal',
    es: 'Objetivo personalizado',
    pt: 'Objetivo personalizado',
  },
  enterCustomGoal: {
    en: 'Enter your custom goal',
    es: 'Ingresa tu objetivo personalizado',
    pt: 'Digite seu objetivo personalizado',
  },
  
  // Device Pairing
  connectDevice: {
    en: 'Connect Your Device',
    es: 'Conecta tu dispositivo',
    pt: 'Conecte seu dispositivo',
  },
  devicePairing: {
    en: 'Device Pairing',
    es: 'Emparejamiento de dispositivo',
    pt: 'Emparelhamento de dispositivo',
  },
  scanQrCode: {
    en: 'Scan the QR code on your GlucoVista device box',
    es: 'Escanea el código QR en la caja de tu dispositivo GlucoVista',
    pt: 'Escaneie o código QR na caixa do seu dispositivo GlucoVista',
  },
  scanCode: {
    en: 'Scan Code',
    es: 'Escanear Código',
    pt: 'Escanear Código',
  },
  enterManually: {
    en: 'Enter device code manually',
    es: 'Ingresar código del dispositivo manualmente',
    pt: 'Inserir código do dispositivo manualmente',
  },
  
  // Dashboard
  dashboard: {
    en: 'Dashboard',
    es: 'Panel de control',
    pt: 'Painel de controle',
  },
  yourStats: {
    en: 'Your Stats',
    es: 'Tus estadísticas',
    pt: 'Suas estatísticas',
  },
  glucoseLevel: {
    en: 'Glucose Level',
    es: 'Nivel de glucosa',
    pt: 'Nível de glicose',
  },
  currentReading: {
    en: 'Current Reading',
    es: 'Lectura actual',
    pt: 'Leitura atual',
  },
  takeMeasurement: {
    en: 'Take a new measurement',
    es: 'Tomar una nueva medición',
    pt: 'Fazer uma nova medição',
  },
  inRange: {
    en: 'In Range',
    es: 'En rango',
    pt: 'Na faixa',
  },
  outOfRange: {
    en: 'Out of Range',
    es: 'Fuera de rango',
    pt: 'Fora da faixa',
  },
  high: {
    en: 'High',
    es: 'Alto',
    pt: 'Alto',
  },
  low: {
    en: 'Low',
    es: 'Bajo',
    pt: 'Baixo',
  },
  normal: {
    en: 'Normal',
    es: 'Normal',
    pt: 'Normal',
  },
  lastMeasurement: {
    en: 'Last measurement',
    es: 'Última medición',
    pt: 'Última medição',
  },
  todaysAverage: {
    en: "Today's Average",
    es: 'Promedio de hoy',
    pt: 'Média de hoje',
  },
  weeklyAverage: {
    en: 'Weekly Average',
    es: 'Promedio semanal',
    pt: 'Média semanal',
  },
  recentReadings: {
    en: 'Recent Readings',
    es: 'Lecturas recientes',
    pt: 'Leituras recentes',
  },
  viewAll: {
    en: 'View All',
    es: 'Ver todo',
    pt: 'Ver tudo',
  },
  progress: {
    en: 'Progress',
    es: 'Progreso',
    pt: 'Progresso',
  },
  trends: {
    en: 'Trends',
    es: 'Tendencias',
    pt: 'Tendências',
  },
  
  // Measurements
  measurement: {
    en: 'Measurement',
    es: 'Medición',
    pt: 'Medição',
  },
  mgdl: {
    en: 'mg/dL',
    es: 'mg/dL',
    pt: 'mg/dL',
  },
  scanNow: {
    en: 'Scan Now',
    es: 'Escanear ahora',
    pt: 'Escanear agora',
  },
  preparing: {
    en: 'Preparing...',
    es: 'Preparando...',
    pt: 'Preparando...',
  },
  measurementReady: {
    en: 'Ready for measurement',
    es: 'Listo para la medición',
    pt: 'Pronto para medição',
  },
  holdSteady: {
    en: 'Hold steady for 3 seconds',
    es: 'Mantén firme por 3 segundos',
    pt: 'Segure firme por 3 segundos',
  },
  analyzing: {
    en: 'Analyzing...',
    es: 'Analizando...',
    pt: 'Analisando...',
  },
  measurementComplete: {
    en: 'Measurement Complete',
    es: 'Medición completa',
    pt: 'Medição completa',
  },
  yourProgress: {
    en: 'Your Progress',
    es: 'Tu Progreso',
    pt: 'Seu Progresso',
  },
  
  // Progress
  noReadingsYetTitle: {
    en: 'No readings yet',
    es: 'No hay lecturas aún',
    pt: 'Sem leituras ainda',
  },
  takeFirstMeasurement: {
    en: 'Take your first measurement to start tracking your glucose levels',
    es: 'Toma tu primera medición para comenzar a rastrear tus niveles de glucosa',
    pt: 'Faça sua primeira medição para começar a acompanhar seus níveis de glicose',
  },
  startTracking: {
    en: 'Start Tracking',
    es: 'Comenzar a rastrear',
    pt: 'Começar a rastrear',
  },
  glucoseChart: {
    en: 'Glucose Chart',
    es: 'Gráfico de glucosa',
    pt: 'Gráfico de glicose',
  },
  averageReading: {
    en: 'Average Reading',
    es: 'Lectura promedio',
    pt: 'Leitura média',
  },
  inRangePercent: {
    en: 'In Range',
    es: 'En rango',
    pt: 'Na faixa',
  },
  lowestReading: {
    en: 'Lowest Reading',
    es: 'Lectura más baja',
    pt: 'Leitura mais baixa',
  },
  highestReading: {
    en: 'Highest Reading',
    es: 'Lectura más alta',
    pt: 'Leitura mais alta',
  },
  yourHealthGoal: {
    en: 'Your Health Goal',
    es: 'Tu objetivo de salud',
    pt: 'Seu objetivo de saúde',
  },
  stayConsistentMessage: {
    en: 'Stay consistent with your measurements to track your progress.',
    es: 'Mantente constante con tus mediciones para seguir tu progreso.',
    pt: 'Mantenha consistência com suas medições para acompanhar seu progresso.',
  },
  
  // Learn
  learn: {
    en: 'Learn',
    es: 'Aprender',
    pt: 'Aprender',
  },
  learnAboutGlucoVista: {
    en: 'Learn About GlucoVista',
    es: 'Aprende sobre GlucoVista',
    pt: 'Aprenda sobre o GlucoVista',
  },
  howitworks: {
    en: 'How It Works',
    es: 'Cómo funciona',
    pt: 'Como funciona',
  },
  learnDeviceTechnology: {
    en: 'Learn about the device technology',
    es: 'Aprende sobre la tecnología del dispositivo',
    pt: 'Aprenda sobre a tecnologia do dispositivo',
  },
  benefits: {
    en: 'Benefits',
    es: 'Beneficios',
    pt: 'Benefícios',
  },
  improveYourHealth: {
    en: 'Improve your health with continuous monitoring',
    es: 'Mejora tu salud con monitoreo continuo',
    pt: 'Melhore sua saúde com monitoramento contínuo',
  },
  safety: {
    en: 'Safety',
    es: 'Seguridad',
    pt: 'Segurança',
  },
  safeAndReliable: {
    en: 'Safe and reliable monitoring',
    es: 'Monitoreo seguro y confiable',
    pt: 'Monitoramento seguro e confiável',
  },
  
  // Achievements
  achievements: {
    en: 'Achievements',
    es: 'Logros',
    pt: 'Conquistas',
  },
  achievementUnlocked: {
    en: 'Achievement Unlocked!',
    es: '¡Logro Desbloqueado!',
    pt: 'Conquista Desbloqueada!',
  },
  
  // Achievement titles
  firstMeasurement: {
    en: 'First Measurement',
    es: 'Primera Medición',
    pt: 'Primeira Medição',
  },
  dailyStreak: {
    en: 'Daily Streak',
    es: 'Racha Diaria',
    pt: 'Sequência Diária',
  },
  perfectWeek: {
    en: 'Perfect Week',
    es: 'Semana Perfecta',
    pt: 'Semana Perfeita',
  },
  inRangeChampion: {
    en: 'In-Range Champion',
    es: 'Campeón En Rango',
    pt: 'Campeão Na Faixa',
  },
  
  // Achievement descriptions
  firstMeasurementDesc: {
    en: 'Complete your first glucose measurement',
    es: 'Completa tu primera medición de glucosa',
    pt: 'Complete sua primeira medição de glicose',
  },
  dailyStreakDesc: {
    en: 'Take measurements for 3 days in a row',
    es: 'Toma mediciones durante 3 días seguidos',
    pt: 'Faça medições por 3 dias consecutivos',
  },
  perfectWeekDesc: {
    en: 'Take at least one measurement every day for a week',
    es: 'Toma al menos una medición todos los días durante una semana',
    pt: 'Faça pelo menos uma medição todos os dias durante uma semana',
  },
  inRangeChampionDesc: {
    en: 'Keep glucose levels in range for 5 consecutive readings',
    es: 'Mantén los niveles de glucosa en rango durante 5 lecturas consecutivas',
    pt: 'Mantenha os níveis de glicose na faixa durante 5 leituras consecutivas',
  },
  
  // Bluetooth connection
  connectYourDevice: {
    en: 'Connect your device',
    es: 'Conecta tu dispositivo',
    pt: 'Conecte seu dispositivo',
  },
  connectInstructions: {
    en: 'Connect your Accu-Tech Healthineers device to measure your glucose without pain',
    es: 'Conecta tu dispositivo Accu-Tech Healthineers para medir tu glucosa sin dolor',
    pt: 'Conecte seu dispositivo Accu-Tech Healthineers para medir sua glicose sem dor',
  },
  connectDeviceButton: {
    en: 'Connect Device',
    es: 'Conectar Dispositivo',
    pt: 'Conectar Dispositivo',
  },
  bluetoothNotAvailable: {
    en: 'Bluetooth not available',
    es: 'Bluetooth no disponible',
    pt: 'Bluetooth não disponível',
  },
  bluetoothNotAvailableDesc: {
    en: 'Your browser does not support Bluetooth or it is disabled. Please enable Bluetooth on your device.',
    es: 'Tu navegador no soporta Bluetooth o está desactivado. Por favor, activa Bluetooth en tu dispositivo.',
    pt: 'Seu navegador não suporta Bluetooth ou está desativado. Por favor, ative o Bluetooth no seu dispositivo.',
  },
  howToConnect: {
    en: 'How to connect your device',
    es: 'Cómo conectar tu dispositivo',
    pt: 'Como conectar seu dispositivo',
  },
  followSteps: {
    en: 'Follow these steps to pair your Accu-Tech device',
    es: 'Sigue estos pasos para emparejar tu dispositivo Accu-Tech',
    pt: 'Siga estes passos para emparelhar seu dispositivo Accu-Tech',
  },
  turnOnDevice: {
    en: 'Turn on your device',
    es: 'Enciende tu dispositivo',
    pt: 'Ligue seu dispositivo',
  },
  holdPowerButton: {
    en: 'Hold the power button for 3 seconds until you see the blue light.',
    es: 'Mantén presionado el botón de encendido durante 3 segundos hasta que veas la luz azul.',
    pt: 'Mantenha pressionado o botão de energia por 3 segundos até ver a luz azul.',
  },
  activatePairingMode: {
    en: 'Activate pairing mode',
    es: 'Activa el modo de emparejamiento',
    pt: 'Ative o modo de emparelhamento',
  },
  pressPairingButton: {
    en: 'Press the pairing button twice in succession. The light will start flashing.',
    es: 'Presiona el botón de emparejamiento dos veces seguidas. La luz comenzará a parpadear.',
    pt: 'Pressione o botão de emparelhamento duas vezes em sucessão. A luz começará a piscar.',
  },
  keepDeviceClose: {
    en: 'Keep the device close',
    es: 'Mantén el dispositivo cerca',
    pt: 'Mantenha o dispositivo próximo',
  },
  ensureDeviceClose: {
    en: 'Make sure the device is within 10 cm of your phone during the pairing process.',
    es: 'Asegúrate de que el dispositivo esté a menos de 10 cm de tu teléfono durante el proceso de emparejamiento.',
    pt: 'Certifique-se de que o dispositivo esteja a menos de 10 cm do seu telefone durante o processo de emparelhamento.',
  },
  troubleshootingTitle: {
    en: 'Having trouble connecting?',
    es: '¿Tienes problemas para conectar?',
    pt: 'Está com problemas para conectar?',
  },
  batteryCheck: {
    en: 'Ensure your device has sufficient battery',
    es: 'Asegúrate de que tu dispositivo tiene batería suficiente',
    pt: 'Certifique-se de que seu dispositivo tem bateria suficiente',
  },
  bluetoothCheck: {
    en: 'Verify that your phone\'s Bluetooth is enabled',
    es: 'Verifica que el Bluetooth de tu teléfono esté activado',
    pt: 'Verifique se o Bluetooth do seu telefone está ativado',
  },
  proximityCheck: {
    en: 'Keep the device and phone close during pairing',
    es: 'Mantén el dispositivo y el teléfono cerca durante el emparejamiento',
    pt: 'Mantenha o dispositivo e o telefone próximos durante o emparelhamento',
  },
  restartCheck: {
    en: 'Restart the device if the problem persists',
    es: 'Reinicia el dispositivo si el problema persiste',
    pt: 'Reinicie o dispositivo se o problema persistir',
  },
  contactCheck: {
    en: 'If you continue to have problems, contact us for assistance',
    es: 'Si continúas teniendo problemas, contáctanos para asistencia',
    pt: 'Se continuar tendo problemas, entre em contato conosco para assistência',
  },
  searchDevices: {
    en: 'Search for devices',
    es: 'Buscar dispositivos',
    pt: 'Buscar dispositivos',
  },
  searchingDevices: {
    en: 'Searching for nearby devices',
    es: 'Buscando dispositivos cercanos',
    pt: 'Buscando dispositivos próximos',
  },
  ensureDeviceOn: {
    en: 'Make sure your device is turned on and in pairing mode',
    es: 'Asegúrate de que tu dispositivo esté encendido y en modo de emparejamiento',
    pt: 'Certifique-se de que seu dispositivo esteja ligado e no modo de emparelhamento',
  },
  cancel: {
    en: 'Cancel',
    es: 'Cancelar',
    pt: 'Cancelar',
  },
  connectingToDevice: {
    en: 'Connecting to device',
    es: 'Conectando al dispositivo',
    pt: 'Conectando ao dispositivo',
  },
  deviceFound: {
    en: 'Device found. Establishing connection...',
    es: 'Se ha encontrado un dispositivo. Estableciendo conexión...',
    pt: 'Dispositivo encontrado. Estabelecendo conexão...',
  },
  connectionFailed: {
    en: 'Connection failed',
    es: 'No se pudo conectar',
    pt: 'Falha na conexão',
  },
  deviceNotDetected: {
    en: 'The Accu-Tech Healthineers device was not detected. This is normal if you do not have the physical device yet.',
    es: 'No se ha detectado el dispositivo Accu-Tech Healthineers. Esto es normal si aún no tienes el dispositivo físico.',
    pt: 'O dispositivo Accu-Tech Healthineers não foi detectado. Isso é normal se você ainda não tiver o dispositivo físico.',
  },
  noDeviceYet: {
    en: "Don't have your device yet?",
    es: "¿No tienes tu dispositivo aún?",
    pt: "Ainda não tem seu dispositivo?",
  },
  deviceOnTheWay: {
    en: 'Your Accu-Tech Healthineers device is on its way. In the meantime, you can explore the app to familiarize yourself with its features.',
    es: 'Tu dispositivo Accu-Tech Healthineers está en camino. Mientras tanto, puedes explorar la aplicación para familiarizarte con sus funciones.',
    pt: 'Seu dispositivo Accu-Tech Healthineers está a caminho. Enquanto isso, você pode explorar o aplicativo para se familiarizar com seus recursos.',
  },
  tryAgain: {
    en: 'Try Again',
    es: 'Intentar de nuevo',
    pt: 'Tentar novamente',
  },
  goBack: {
    en: 'Go Back',
    es: 'Volver',
    pt: 'Voltar',
  },
  deviceConnected: {
    en: 'Device Connected!',
    es: '¡Dispositivo conectado!',
    pt: 'Dispositivo conectado!',
  },
  deviceReadyToUse: {
    en: 'Your Accu-Tech Healthineers device is ready to use.',
    es: 'Tu dispositivo Accu-Tech Healthineers está listo para usar.',
    pt: 'Seu dispositivo Accu-Tech Healthineers está pronto para usar.',
  },
  startMeasuring: {
    en: 'Start measuring',
    es: 'Comenzar a medir',
    pt: 'Começar a medir',
  },
  importantNote: {
    en: 'Important Note',
    es: 'Nota importante',
    pt: 'Nota importante',
  },
  demoVersionNote: {
    en: 'This is a demo version. Since you do not have the physical device yet, the connection cannot be completed.',
    es: 'Esta es una versión de demostración. Como aún no tienes el dispositivo físico, la conexión no podrá completarse.',
    pt: 'Esta é uma versão de demonstração. Como você ainda não tem o dispositivo físico, a conexão não poderá ser concluída.',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const translate = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    console.warn(`Translation not found for key: ${key}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
