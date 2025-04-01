
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
      appName: "Healthineers",
      
      // Language
      language: "Language",
      selectLanguage: "Select Language",
      saveAndReturn: "Save and Return",
      spanish: "Spanish",
      portuguese: "Portuguese",
      english: "English",
      
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
      completeOrderCOD: "Complete Order - Pay on Delivery",
      cashOnDeliveryOnly: "Cash on Delivery Only",
      cashOnDeliveryBanner: "You will pay when the product is delivered to your address.",
      phoneRequired: "Required for delivery coordination",
      prepareExactAmount: "Please prepare the exact amount for a smoother delivery",
      courierCallBefore: "The courier will call before delivery",
      receiptProvided: "You'll receive a receipt upon payment",
      payOnDelivery: "Pay on Delivery - Cash Only",
      noPaymentBeforeDelivery: "No payment required until delivery",
      deliveryTimeline: "Estimated Timeline",
      order: "Order",
      processing: "Processing",
      delivery: "Delivery",
      today: "Today",
      days: "days",
      
      // Order Success Page
      orderConfirmed: "Order Confirmed!",
      orderThankYou: "Thank you for your purchase. Your order has been confirmed.",
      deliveryStatus: "Delivery Status",
      orderPlaced: "Order Placed",
      estimatedProcess: "1-2 business days",
      estimatedDelivery: "Expected in 2-4 business days",
      orderConfirmationEmail: "We've sent you an email with your order details.",
      continueOnboarding: "Continue Setup",
      
      // Home Page
      hello: "Hello",
      points: "Points",
      streak: "Streak",
      readings: "Readings",
      home: "Home",
      profile: "Profile",
      learnAboutGlucoVista: "Learn About Accu-Tech",
      howitworks: "How It Works",
      benefits: "Benefits",
      safety: "Safety",
      achievementUnlocked: "Achievement Unlocked!",
      buyNow: "Buy Now",
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
      appName: "Healthineers",
      
      // Language
      language: "Idioma",
      selectLanguage: "Seleccionar Idioma",
      saveAndReturn: "Guardar y Volver",
      spanish: "Español",
      portuguese: "Portugués",
      english: "Inglés",

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
      completeOrderCOD: "Completar Pedido - Pagar al Recibir",
      cashOnDeliveryOnly: "Solo Pago Contra Entrega",
      cashOnDeliveryBanner: "Pagarás cuando el producto sea entregado en tu dirección.",
      phoneRequired: "Requerido para coordinar la entrega",
      prepareExactAmount: "Por favor, prepara el monto exacto para una entrega más rápida",
      courierCallBefore: "El mensajero llamará antes de la entrega",
      receiptProvided: "Recibirás un recibo al momento del pago",
      payOnDelivery: "Pago al Recibir - Solo Efectivo",
      noPaymentBeforeDelivery: "No se requiere pago hasta la entrega",
      deliveryTimeline: "Cronograma Estimado",
      order: "Pedido",
      processing: "Procesamiento",
      delivery: "Entrega",
      today: "Hoy",
      days: "días",
      
      // Order Success Page
      orderConfirmed: "¡Pedido Confirmado!",
      orderThankYou: "Gracias por tu compra. Tu pedido ha sido confirmado.",
      deliveryStatus: "Estado de la Entrega",
      orderPlaced: "Pedido Realizado",
      estimatedProcess: "1-2 días hábiles",
      estimatedDelivery: "Esperado en 2-4 días hábiles",
      orderConfirmationEmail: "Te hemos enviado un correo con los detalles de tu pedido.",
      continueOnboarding: "Continuar Configuración",
      
      // Home Page
      hello: "Hola",
      lastReading: "Última Lectura",
      mmolL: "mmol/L",
      mgdl: "mg/dL",
      viewTrends: "Ver Tendencias",
      yourDevice: "Tu Dispositivo",
      connect: "Conectar",
      connected: "Conectado",
      takeMeasurement: "Tomar Medición",
      dailyTips: "Consejos Diarios",
      learnMore: "Aprender Más",
      recentReadings: "Lecturas Recientes",
      time: "Hora",
      value: "Valor",
      viewAll: "Ver Todo",
      learningCenter: "Centro de Aprendizaje",
      todayTip: "Consejo del Día",
      exerciseTip: "El ejercicio puede ayudar a mejorar la sensibilidad a la insulina y reducir los niveles de glucosa en sangre.",
      waterTip: "Mantenerse hidratado es importante para mantener niveles saludables de glucosa.",
      sleepTip: "El sueño adecuado puede mejorar el control de la glucosa en sangre.",
      foodTip: "Las comidas equilibradas con proteínas, grasas saludables y fibra pueden prevenir picos de glucosa.",
      stressTip: "Manejar el estrés puede ayudar a mantener estables los niveles de glucosa en sangre.",
      high: "Alto",
      normal: "Normal",
      low: "Bajo",
      points: "Puntos",
      streak: "Racha",
      readings: "Lecturas",
      home: "Inicio",
      profile: "Perfil",
      learnAboutGlucoVista: "Aprender sobre Accu-Tech",
      howitworks: "Cómo Funciona",
      benefits: "Beneficios",
      safety: "Seguridad",
      achievementUnlocked: "¡Logro Desbloqueado!",
      buyNow: "Comprar Ahora",
    },
    pt: {
      // Common
      back: "Voltar",
      next: "Próximo",
      skip: "Pular",
      complete: "completo",
      step: "Etapa",
      welcomeToApp: "Bem-vindo ao futuro do monitoramento de glicose sem sangue",
      installments: "Ou pague em {{count}} parcelas de {{value}} cada",
      buy3get1: "Compre 3 e Ganhe 1 GRÁTIS",
      getStarted: "Começar",
      proceedToPayment: "Prosseguir para Pagamento",
      selectOfferDescription: "Escolha o pacote perfeito para suas necessidades",
      appName: "Healthineers",
      
      // Language
      language: "Idioma",
      selectLanguage: "Selecionar Idioma",
      saveAndReturn: "Salvar e Voltar",
      spanish: "Espanhol",
      portuguese: "Português",
      english: "Inglês",
      
      // Device
      deviceName: "Glicosímetro a Laser Accu-Tech",
      deviceDescription: "Dispositivo avançado de monitoramento de glicose sem sangue",
      units: "Unidades",
      unit: "Unidade",
      yourNewGlucometer: "Seu novo Glicosímetro a Laser Accu-Tech",
      deviceArrivalMessage: "Seu dispositivo chegará em 2-4 dias úteis.",
      
      // Checkout page
      checkout: "Finalizar Compra",
      yourOrder: "Seu Pedido",
      subtotal: "Subtotal",
      discount: "Desconto",
      shipping: "Frete",
      free: "GRÁTIS",
      total: "Total",
      finishOrder: "Concluir Pedido",
      enterShippingAddress: "Insira Informações de Envio",
      selectOffer: "Selecione Sua Oferta",
      address: "Endereço",
      city: "Cidade",
      province: "Estado/Província",
      postalCode: "CEP",
      firstName: "Nome",
      lastName: "Sobrenome",
      phone: "Número de Telefone",
      moneyBackGuarantee: "Garantia de 30 dias para devolução",
      secureTransaction: "Transação Segura",
      paymentMethod: "Método de Pagamento",
      creditCard: "Cartão de Crédito",
      cashOnDelivery: "Pagamento na Entrega",
      cashOnDeliveryDescription: "Pague em dinheiro quando seu pedido for entregue.",
      cashOnDeliveryNote: "Você precisará pagar o valor total em dinheiro quando seu pedido chegar.",
      completeOrderCOD: "Concluir Pedido - Pagar na Entrega",
      cashOnDeliveryOnly: "Apenas Pagamento na Entrega",
      cashOnDeliveryBanner: "Você pagará quando o produto for entregue em seu endereço.",
      phoneRequired: "Necessário para coordenação da entrega",
      prepareExactAmount: "Por favor, prepare o valor exato para facilitar a entrega",
      courierCallBefore: "O entregador ligará antes da entrega",
      receiptProvided: "Você receberá um recibo no momento do pagamento",
      payOnDelivery: "Pague na Entrega - Apenas Dinheiro",
      noPaymentBeforeDelivery: "Nenhum pagamento necessário até a entrega",
      deliveryTimeline: "Cronograma Estimado",
      order: "Pedido",
      processing: "Processamento",
      delivery: "Entrega",
      today: "Hoje",
      days: "dias",
      
      // Order Success Page
      orderConfirmed: "Pedido Confirmado!",
      orderThankYou: "Obrigado pela sua compra. Seu pedido foi confirmado.",
      deliveryStatus: "Status da Entrega",
      orderPlaced: "Pedido Realizado",
      estimatedProcess: "1-2 dias úteis",
      estimatedDelivery: "Previsão em 2-4 dias úteis",
      orderConfirmationEmail: "Enviamos um e-mail com os detalhes do seu pedido.",
      continueOnboarding: "Continuar Configuração",
      
      // Home Page
      hello: "Olá",
      points: "Pontos",
      streak: "Sequência",
      readings: "Leituras",
      home: "Início",
      profile: "Perfil",
      learnAboutGlucoVista: "Saiba Mais Sobre o Accu-Tech",
      howitworks: "Como Funciona",
      benefits: "Benefícios",
      safety: "Segurança",
      achievementUnlocked: "Conquista Desbloqueada!",
      buyNow: "Comprar Agora",
    }
  };

  const translate = (key: string, params = {}) => {
    let translation = translations[language]?.[key] || key;

    // If translation not found, fall back to English
    if (translation === key && language !== 'en') {
      translation = translations['en'][key] || key;
    }

    // Replace any parameters in the translation string
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
