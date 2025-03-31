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
      
      // Onboarding translations
      'welcomeToApp': 'Welcome to GlucoVista - Your Non-Invasive Glucose Monitoring Solution',
      'welcome': 'Welcome to GlucoVista',
      'step': 'Step',
      'complete': 'Complete',
      'selectLanguage': 'Select Your Language',
      'spanish': 'Spanish (Español)',
      'portuguese': 'Portuguese (Português)',
      'thankYouMessage': 'Thank you for choosing our revolutionary non-invasive glucometer. We\'re excited to help you monitor your glucose without pain.',
      'userTestimonial': 'GlucoVista has completely changed how I manage my diabetes. No more finger pricks!',
      'testimonialAuthor': 'John D., Type 2 Diabetes',
      'deviceArrivalMessage': 'Your device will arrive in the next 24-48 hours. Meanwhile, let\'s get you set up!',
      'howItWorks': 'Revolutionary Technology',
      'laserTechnologyIntro': 'Our device uses advanced laser technology to measure your glucose levels without drawing blood.',
      'laserEmissionTitle': 'Laser Emission',
      'laserEmissionDesc': 'A low-power laser beam is directed at your skin.',
      'bloodlessAnalysisTitle': 'Bloodless Analysis',
      'bloodlessAnalysisDesc': 'The reflected light is analyzed to determine glucose levels.',
      'instantReadingTitle': 'Instant Reading',
      'instantReadingDesc': 'Results appear on your app in just seconds.',
      'scientificallyProven': 'Scientifically proven accuracy comparable to traditional methods.',
      'keyBenefits': 'Key Benefits',
      'benefitsIntro': 'Experience the advantages of non-invasive glucose monitoring:',
      'noPainTitle': 'Pain-Free',
      'noPainDesc': 'No more finger pricks or needles.',
      'instantResultsTitle': 'Quick Results',
      'instantResultsDesc': 'Get readings in seconds, anytime.',
      'expertApprovedTitle': 'Expert Approved',
      'expertApprovedDesc': 'Developed with leading endocrinologists.',
      'accurateTitle': 'Highly Accurate',
      'accurateDesc': '95%+ accuracy compared to blood tests.',
      'yourNewGlucometer': 'Your new GlucoVista device',
      'setupProfile': 'Set Up Your Profile',
      'profileSetupIntro': 'Help us personalize your experience by providing some information:',
      'name': 'Name',
      'enterName': 'Enter your name',
      'age': 'Age',
      'diabetesType': 'Diabetes Type',
      'type1': 'Type 1',
      'type2': 'Type 2',
      'prediabetes': 'Prediabetes',
      'gestational': 'Gestational',
      'other': 'Other',
      'profilePrivacyMessage': 'Your information is kept private and helps us optimize your experience.',
      'readyToStart': 'Ready to Start!',
      'tutorialDescription': 'Here\'s how to use GlucoVista once your device arrives:',
      'measureGlucose': 'Measure Glucose',
      'measureGlucoseDescription': 'Hold the device against your wrist for 5 seconds.',
      'trackProgress': 'Track Progress',
      'trackProgressDescription': 'View trends and insights in the app dashboard.',
      'earnAchievements': 'Earn Achievements',
      'earnAchievementsDescription': 'Get rewards for consistent monitoring.',
      'back': 'Back',
      'next': 'Next',
      'skip': 'Skip',
      'getStarted': 'Get Started',
      
      // Checkout related
      'buy': "Buy",
      'buyNow': "Buy Now",
      'selectOffer': "Select an offer",
      'copyPromoCode': "Copy promo code",
      'paymentOnDelivery': "PAYMENT ON DELIVERY",
      'unit': "unit",
      'subtotal': "Subtotal",
      'shipping': "Shipping",
      'free': "Free",
      'total': "Total",
      'shippingMethod': "Shipping method",
      'freeShipping': "Free shipping",
      'days': "days",
      'moneyBackGuarantee': "Money back guarantee within {{days}} days",
      'secureTransaction': "Secure transaction",
      'enterShippingAddress': "Enter your shipping address",
      'firstName': "First name",
      'lastName': "Last name",
      'phone': "Phone",
      'address': "Address",
      'province': "Province",
      'city': "City",
      'postalCode': "Postal code",
      'finishOrder': "Finish Order",
      'orderConfirmed': "Order Confirmed!",
      'orderThankYou': "Thank you for your purchase. We'll start processing your order right away.",
      'deliveryStatus': "Delivery Status",
      'orderPlaced': "Order Placed",
      'processing': "Processing",
      'estimatedProcess': "Est. processing time: 1-2 days",
      'estimatedDelivery': "Est. delivery: 3-5 days",
      'orderConfirmationEmail': "A confirmation email has been sent to your email address.",
      'backToHome': "Back to Home",
      'deviceDescription': "Non-invasive glucose monitoring device",
      'installments': "In up to {{count}} installments of {{value}}",
      'buy3get1': "Buy 3 Get 1 Free",
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
      
      // Onboarding translations
      'welcomeToApp': 'Bienvenido a GlucoVista - Tu Solución de Monitoreo de Glucosa No Invasiva',
      'welcome': 'Bienvenido a GlucoVista',
      'step': 'Paso',
      'complete': 'Completo',
      'selectLanguage': 'Selecciona Tu Idioma',
      'spanish': 'Español',
      'portuguese': 'Portugués',
      'thankYouMessage': 'Gracias por elegir nuestro revolucionario glucómetro no invasivo. Estamos emocionados de ayudarte a monitorear tu glucosa sin dolor.',
      'userTestimonial': '¡GlucoVista ha cambiado completamente cómo manejo mi diabetes. No más pinchazos en los dedos!',
      'testimonialAuthor': 'Juan D., Diabetes Tipo 2',
      'deviceArrivalMessage': 'Tu dispositivo llegará en las próximas 24-48 horas. Mientras tanto, ¡vamos a configurar todo!',
      'howItWorks': 'Tecnología Revolucionaria',
      'laserTechnologyIntro': 'Nuestro dispositivo utiliza tecnología láser avanzada para medir tus niveles de glucosa sin extraer sangre.',
      'laserEmissionTitle': 'Emisión Láser',
      'laserEmissionDesc': 'Un rayo láser de baja potencia se dirige a tu piel.',
      'bloodlessAnalysisTitle': 'Análisis Sin Sangre',
      'bloodlessAnalysisDesc': 'La luz reflejada se analiza para determinar los niveles de glucosa.',
      'instantReadingTitle': 'Lectura Instantánea',
      'instantReadingDesc': 'Los resultados aparecen en tu aplicación en segundos.',
      'scientificallyProven': 'Precisión científicamente probada comparable a los métodos tradicionales.',
      'keyBenefits': 'Beneficios Principales',
      'benefitsIntro': 'Experimenta las ventajas del monitoreo de glucosa no invasivo:',
      'noPainTitle': 'Sin Dolor',
      'noPainDesc': 'No más pinchazos en los dedos ni agujas.',
      'instantResultsTitle': 'Resultados Rápidos',
      'instantResultsDesc': 'Obtén lecturas en segundos, en cualquier momento.',
      'expertApprovedTitle': 'Aprobado por Expertos',
      'expertApprovedDesc': 'Desarrollado con endocrinólogos líderes.',
      'accurateTitle': 'Alta Precisión',
      'accurateDesc': '95%+ de precisión comparado con análisis de sangre.',
      'yourNewGlucometer': 'Tu nuevo dispositivo GlucoVista',
      'setupProfile': 'Configura Tu Perfil',
      'profileSetupIntro': 'Ayúdanos a personalizar tu experiencia proporcionando alguna información:',
      'name': 'Nombre',
      'enterName': 'Introduce tu nombre',
      'age': 'Edad',
      'diabetesType': 'Tipo de Diabetes',
      'type1': 'Tipo 1',
      'type2': 'Tipo 2',
      'prediabetes': 'Prediabetes',
      'gestational': 'Gestacional',
      'other': 'Otro',
      'profilePrivacyMessage': 'Tu información se mantiene privada y nos ayuda a optimizar tu experiencia.',
      'readyToStart': '¡Listo para Comenzar!',
      'tutorialDescription': 'Así es como usar GlucoVista una vez que llegue tu dispositivo:',
      'measureGlucose': 'Medir Glucosa',
      'measureGlucoseDescription': 'Mantén el dispositivo contra tu muñeca durante 5 segundos.',
      'trackProgress': 'Seguir Progreso',
      'trackProgressDescription': 'Ver tendencias y estadísticas en el panel de la aplicación.',
      'earnAchievements': 'Ganar Logros',
      'earnAchievementsDescription': 'Obtén recompensas por un monitoreo constante.',
      'back': 'Atrás',
      'next': 'Siguiente',
      'skip': 'Omitir',
      'getStarted': 'Comenzar',
      
      // Checkout related
      'buy': "Comprar",
      'buyNow': "Comprar Ahora",
      'selectOffer': "Seleccioná la oferta",
      'copyPromoCode': "Copiar código HTML",
      'paymentOnDelivery': "PAGAMENTO NA ENTREGA",
      'unit': "unidad",
      'subtotal': "Subtotal",
      'shipping': "Envío",
      'free': "Gratis",
      'total': "Total",
      'shippingMethod': "Método de envío",
      'freeShipping': "Envío Gratuito",
      'days': "días",
      'moneyBackGuarantee': "Garantía de devolución del dinero en {{days}} días",
      'secureTransaction': "Transacción segura",
      'enterShippingAddress': "Introduzca o seu endereço de envio",
      'firstName': "Nombre",
      'lastName': "Sobrenome",
      'phone': "Teléfono",
      'address': "Endereço",
      'province': "Provincia",
      'city': "Cidade",
      'postalCode': "Código Postal",
      'finishOrder': "Finalizar Pedido",
      'orderConfirmed': "¡Pedido Confirmado!",
      'orderThankYou': "Gracias por tu compra. Comenzaremos a procesar tu pedido de inmediato.",
      'deliveryStatus': "Estado de Entrega",
      'orderPlaced': "Pedido Realizado",
      'processing': "Procesando",
      'estimatedProcess': "Tiempo est. de procesamiento: 1-2 días",
      'estimatedDelivery': "Entrega est.: 3-5 días",
      'orderConfirmationEmail': "Se ha enviado un correo de confirmación a tu dirección de email.",
      'backToHome': "Volver al Inicio",
      'deviceDescription': "Dispositivo de monitoreo de glucosa no invasivo",
      'installments': "En hasta {{count}} cuotas de {{value}}",
      'buy3get1': "Compra 3 y Llévate 1 Gratis",
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
      
      // Onboarding translations
      'welcomeToApp': 'Bem-vindo ao GlucoVista - Sua Solução de Monitoramento de Glicose Não Invasiva',
      'welcome': 'Bem-vindo ao GlucoVista',
      'step': 'Etapa',
      'complete': 'Completo',
      'selectLanguage': 'Selecione Seu Idioma',
      'spanish': 'Espanhol',
      'portuguese': 'Português',
      'thankYouMessage': 'Obrigado por escolher nosso revolucionário glicosímetro não invasivo. Estamos animados para ajudá-lo a monitorar sua glicose sem dor.',
      'userTestimonial': 'O GlucoVista mudou completamente como eu gerencio meu diabetes. Sem mais picadas nos dedos!',
      'testimonialAuthor': 'João D., Diabetes Tipo 2',
      'deviceArrivalMessage': 'Seu dispositivo chegará nas próximas 24-48 horas. Enquanto isso, vamos configurar tudo!',
      'howItWorks': 'Tecnologia Revolucionária',
      'laserTechnologyIntro': 'Nosso dispositivo usa tecnologia a laser avançada para medir seus níveis de glicose sem tirar sangue.',
      'laserEmissionTitle': 'Emissão de Laser',
      'laserEmissionDesc': 'Um feixe de laser de baixa potência é direcionado à sua pele.',
      'bloodlessAnalysisTitle': 'Análise Sem Sangue',
      'bloodlessAnalysisDesc': 'A luz refletida é analisada para determinar os níveis de glicose.',
      'instantReadingTitle': 'Leitura Instantânea',
      'instantReadingDesc': 'Os resultados aparecem no seu aplicativo em segundos.',
      'scientificallyProven': 'Precisão cientificamente comprovada comparável aos métodos tradicionais.',
      'keyBenefits': 'Principais Benefícios',
      'benefitsIntro': 'Experimente as vantagens do monitoramento de glicose não invasivo:',
      'noPainTitle': 'Sem Dor',
      'noPainDesc': 'Sem mais picadas nos dedos ou agulhas.',
      'instantResultsTitle': 'Resultados Rápidos',
      'instantResultsDesc': 'Obtenha leituras em segundos, a qualquer momento.',
      'expertApprovedTitle': 'Aprovado por Especialistas',
      'expertApprovedDesc': 'Desenvolvido com endocrinologistas líderes.',
      'accurateTitle': 'Alta Precisão',
      'accurateDesc': '95%+ de precisão comparado com exames de sangue.',
      'yourNewGlucometer': 'Seu novo dispositivo GlucoVista',
      'setupProfile': 'Configure Seu Perfil',
      'profileSetupIntro': 'Ajude-nos a personalizar sua experiência fornecendo algumas informações:',
      'name': 'Nome',
      'enterName': 'Digite seu nome',
      'age': 'Idade',
      'diabetesType': 'Tipo de Diabetes',
      'type1': 'Tipo 1',
      'type2': 'Tipo 2',
      'prediabetes': 'Pré-diabetes',
      'gestational': 'Gestacional',
      'other': 'Outro',
      'profilePrivacyMessage': 'Suas informações são mantidas privadas e nos ajudam a otimizar sua experiência.',
      'readyToStart': 'Pronto para Começar!',
      'tutorialDescription': 'Veja como usar o GlucoVista quando seu dispositivo chegar:',
      'measureGlucose': 'Medir Glicose',
      'measureGlucoseDescription': 'Mantenha o dispositivo contra seu pulso por 5 segundos.',
      'trackProgress': 'Acompanhar Progresso',
      'trackProgressDescription': 'Veja tendências e insights no painel do aplicativo.',
      'earnAchievements': 'Ganhar Conquistas',
      'earnAchievementsDescription': 'Receba recompensas por monitoramento consistente.',
      'back': 'Voltar',
      'next': 'Próximo',
      'skip': 'Pular',
      'getStarted': 'Começar',
      
      // Checkout related
      'buy': "Comprar",
      'buyNow': "Comprar Agora",
      'selectOffer': "Selecione a oferta",
      'copyPromoCode': "Copiar código HTML",
      'paymentOnDelivery': "PAGAMENTO NA ENTREGA",
      'unit': "unidade",
      'subtotal': "Subtotal",
      'shipping': "Envio",
      'free': "Grátis",
      'total': "Total",
      'shippingMethod': "Método de envio",
      'freeShipping': "Envio Gratuito",
      'days': "dias",
      'moneyBackGuarantee': "Garantia de devolução do dinheiro em {{days}} dias",
      'secureTransaction': "Transação segura",
      'enterShippingAddress': "Introduza o seu endereço de envio",
      'firstName': "Nome",
      'lastName': "Sobrenome",
      'phone': "Telefone",
      'address': "Endereço",
      'province': "Província",
      'city': "Cidade",
      'postalCode': "Código Postal",
      'finishOrder': "Finalizar Pedido",
      'orderConfirmed': "Pedido Confirmado!",
      'orderThankYou': "Obrigado pela sua compra. Iremos começar a processar o seu pedido imediatamente.",
      'deliveryStatus': "Estado da Entrega",
      'orderPlaced': "Pedido Realizado",
      'processing': "Processando",
      'estimatedProcess': "Tempo est. de processamento: 1-2 dias",
      'estimatedDelivery': "Entrega est.: 3-5 dias",
      'orderConfirmationEmail': "Um email de confirmação foi enviado para o seu endereço de email.",
      'backToHome': "Voltar à Página Inicial",
      'deviceDescription': "Dispositivo de monitoramento de glicose não invasivo",
      'installments': "Em até {{count}} parcelas de {{value}}",
      'buy3get1': "Compre 3 e Leve 1 Grátis",
    },
  };

  return (
    <LanguageContext.Provider value={{ language, translate, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
