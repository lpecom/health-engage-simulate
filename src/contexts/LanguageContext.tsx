import React, { createContext, useContext, useState, useCallback } from 'react';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: (lang: string) => {},
  translate: (key: string, params?: { [key: string]: string | number }) => ''
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const changeLanguage = useCallback((lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  }, []);

  // Load language from local storage on initial load
  React.useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const translations = {
    en: {
      // Common
      back: "Back",
      next: "Next",
      skip: "Skip",
      complete: "complete",
      step: "Step",
      welcomeToApp: "Welcome to the future of blood-free glucose monitoring",
      installments: "Or pay in {{count}} installments of {{value}} each",
      buy3get1: "Buy 3 Get 1 FREE",
      getStarted: "Get Started",
      proceedToPayment: "Proceed to Payment",
      selectOfferDescription: "Choose the perfect package for your needs",
      
      // Device
      deviceName: "Accu-Tech Laser Glucometer",
      deviceDescription: "Advanced blood-free glucose monitoring device",
      units: "Units",
      unit: "Unit",
      yourNewGlucometer: "Your new Accu-Tech Laser Glucometer",
      deviceArrivalMessage: "Your device will arrive in 2-4 business days.",
      
      // Checkout page
      checkout: "Checkout",
      yourOrder: "Your Order",
      subtotal: "Subtotal",
      discount: "Discount",
      shipping: "Shipping",
      free: "FREE",
      total: "Total",
      finishOrder: "Complete Order",
      enterShippingAddress: "Enter Shipping Information",
      selectOffer: "Select Your Offer",
      address: "Address",
      city: "City",
      province: "State/Province",
      postalCode: "Postal Code",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      moneyBackGuarantee: "30-day Money Back Guarantee",
      secureTransaction: "Secure Transaction",
      paymentMethod: "Payment Method",
      creditCard: "Credit Card",
      cashOnDelivery: "Cash on Delivery",
      cashOnDeliveryDescription: "Pay in cash when your order is delivered.",
      cashOnDeliveryNote: "You will need to pay the full amount in cash when your order arrives.",
      
      // Onboarding
      purchaseDevice: "Purchase Your Device",
      welcomeHeading: "Welcome to Accu-Tech!",
      thankYouMessage: "Thank you for choosing our innovative blood-free glucose monitoring solution.",
      userTestimonial: "Since I started using the Accu-Tech Laser Glucometer, I've been able to track my glucose levels without the pain of finger pricks. It's been life-changing!",
      testimonialAuthor: "Sarah K., Accu-Tech User",
      laserTechnologyIntro: "Our patented laser technology allows for completely blood-free glucose monitoring.",
      laserEmissionTitle: "Laser Emission",
      laserEmissionDesc: "The device emits a non-harmful laser that penetrates the skin to analyze glucose molecules.",
      bloodlessAnalysisTitle: "Bloodless Analysis",
      bloodlessAnalysisDesc: "Advanced algorithms analyze the reflected light to determine precise glucose levels.",
      instantReadingTitle: "Instant Reading",
      instantReadingDesc: "Results appear on screen within seconds, allowing immediate action if needed.",
      scientificallyProven: "Scientifically proven to be as accurate as traditional blood testing methods.",
      howItWorks: "How It Works",
      keyBenefits: "Key Benefits",
      benefitsIntro: "Discover the advantages of our blood-free glucose monitoring technology.",
      noPainTitle: "Pain-Free",
      noPainDesc: "No more finger pricks or blood samples.",
      instantResultsTitle: "Quick Results",
      instantResultsDesc: "Get readings in seconds, anytime.",
      expertApprovedTitle: "Expert Approved",
      expertApprovedDesc: "Validated by medical professionals.",
      accurateTitle: "Accurate",
      accurateDesc: "Precision comparable to blood tests.",
      setupProfile: "Set Up Your Profile",
      profileSetupIntro: "Help us personalize your experience by providing some basic information.",
      name: "Name",
      enterName: "Enter your name",
      age: "Age",
      diabetesType: "Diabetes Type",
      type1: "Type 1",
      type2: "Type 2",
      prediabetes: "Prediabetes",
      gestational: "Gestational",
      other: "Other",
      profilePrivacyMessage: "Your information is kept private and secure, and helps us provide personalized insights.",
      readyToStart: "Ready to Start",
      tutorialDescription: "Let's get familiar with the app's features and how to use them.",
      measureGlucose: "Measure Glucose",
      measureGlucoseDescription: "Connect your device and take blood-free readings anytime.",
      trackProgress: "Track Progress",
      trackProgressDescription: "View trends and patterns in your glucose levels over time.",
      earnAchievements: "Earn Achievements",
      earnAchievementsDescription: "Complete goals and unlock rewards as you maintain healthy levels.",
    },
    es: {
      // Common
      back: "Atrás",
      next: "Siguiente",
      skip: "Omitir",
      complete: "completado",
      step: "Paso",
      welcomeToApp: "Bienvenido al futuro del monitoreo de glucosa sin sangre",
      installments: "O paga en {{count}} cuotas de {{value}} cada una",
      buy3get1: "Compra 3 y Lleva 1 GRATIS",
      getStarted: "Comenzar",
      proceedToPayment: "Proceder al Pago",
      selectOfferDescription: "Elige el paquete perfecto para tus necesidades",

      // Device
      deviceName: "Glucómetro Láser Accu-Tech",
      deviceDescription: "Dispositivo avanzado de monitoreo de glucosa sin sangre",
      units: "Unidades",
      unit: "Unidad",
      yourNewGlucometer: "Tu nuevo Glucómetro Láser Accu-Tech",
      deviceArrivalMessage: "Tu dispositivo llegará en 2-4 días hábiles.",
      
      // Checkout page
      checkout: "Pago",
      yourOrder: "Tu Pedido",
      subtotal: "Subtotal",
      discount: "Descuento",
      shipping: "Envío",
      free: "GRATIS",
      total: "Total",
      finishOrder: "Completar Pedido",
      enterShippingAddress: "Ingresa la Información de Envío",
      selectOffer: "Selecciona Tu Oferta",
      address: "Dirección",
      city: "Ciudad",
      province: "Estado/Provincia",
      postalCode: "Código Postal",
      firstName: "Nombre",
      lastName: "Apellido",
      phone: "Número de Teléfono",
      moneyBackGuarantee: "Garantía de devolución de 30 días",
      secureTransaction: "Transacción Segura",
      paymentMethod: "Método de Pago",
      creditCard: "Tarjeta de Crédito",
      cashOnDelivery: "Pago Contra Entrega",
      cashOnDeliveryDescription: "Paga en efectivo cuando tu pedido sea entregado.",
      cashOnDeliveryNote: "Necesitarás pagar el monto total en efectivo cuando llegue tu pedido.",
      
      // Onboarding
      purchaseDevice: "Compra Tu Dispositivo",
      welcomeHeading: "¡Bienvenido a Accu-Tech!",
      thankYouMessage: "Gracias por elegir nuestra innovadora solución de monitoreo de glucosa sin sangre.",
      userTestimonial: "Desde que comencé a usar el Glucómetro Láser Accu-Tech, he podido monitorear mis niveles de glucosa sin el dolor de los pinchazos en los dedos. ¡Ha cambiado mi vida!",
      testimonialAuthor: "Sara K., Usuario de Accu-Tech",
      laserTechnologyIntro: "Nuestra tecnología láser patentada permite un monitoreo de glucosa completamente sin sangre.",
      laserEmissionTitle: "Emisión Láser",
      laserEmissionDesc: "El dispositivo emite un láser no dañino que penetra la piel para analizar las moléculas de glucosa.",
      bloodlessAnalysisTitle: "Análisis Sin Sangre",
      bloodlessAnalysisDesc: "Algoritmos avanzados analizan la luz reflejada para determinar niveles precisos de glucosa.",
      instantReadingTitle: "Lectura Instantánea",
      instantReadingDesc: "Los resultados aparecen en pantalla en segundos, permitiendo acción inmediata si es necesario.",
      scientificallyProven: "Científicamente probado para ser tan preciso como los métodos tradicionales de análisis de sangre.",
      howItWorks: "Cómo Funciona",
      keyBenefits: "Beneficios Clave",
      benefitsIntro: "Descubre las ventajas de nuestra tecnología de monitoreo de glucosa sin sangre.",
      noPainTitle: "Sin Dolor",
      noPainDesc: "No más pinchazos ni muestras de sangre.",
      instantResultsTitle: "Resultados Rápidos",
      instantResultsDesc: "Obtén lecturas en segundos, en cualquier momento.",
      expertApprovedTitle: "Aprobado por Expertos",
      expertApprovedDesc: "Validado por profesionales médicos.",
      accurateTitle: "Preciso",
      accurateDesc: "Precisión comparable a las pruebas de sangre.",
      setupProfile: "Configura Tu Perfil",
      profileSetupIntro: "Ayúdanos a personalizar tu experiencia proporcionando información básica.",
      name: "Nombre",
      enterName: "Ingresa tu nombre",
      age: "Edad",
      diabetesType: "Tipo de Diabetes",
      type1: "Tipo 1",
      type2: "Tipo 2",
      prediabetes: "Prediabetes",
      gestational: "Gestacional",
      other: "Otro",
      profilePrivacyMessage: "Tu información se mantiene privada y segura, y nos ayuda a proporcionar ideas personalizadas.",
      readyToStart: "Listo para Comenzar",
      tutorialDescription: "Familiaricémonos con las características de la aplicación y cómo usarlas.",
      measureGlucose: "Medir Glucosa",
      measureGlucoseDescription: "Conecta tu dispositivo y toma lecturas sin sangre en cualquier momento.",
      trackProgress: "Seguir Progreso",
      trackProgressDescription: "Ver tendencias y patrones en tus niveles de glucosa a lo largo del tiempo.",
      earnAchievements: "Ganar Logros",
      earnAchievementsDescription: "Completa objetivos y desbloquea recompensas mientras mantienes niveles saludables.",
    },
  };

  const translate = (key: string, params = {}) => {
    let translation = translations[language]?.[key] || key;

    for (const paramKey in params) {
      translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(params[paramKey]));
    }

    return translation;
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    translate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
