
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type LanguageType = 'en' | 'es' | 'pt';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  translate: (key: string, params?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  translate: () => ''
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState<LanguageType>('en');
  const [forceUpdate, setForceUpdate] = useState(0);

  const changeLanguage = useCallback((lang: LanguageType) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Force re-render of components when language changes
    document.documentElement.setAttribute('lang', lang);
    setForceUpdate(prev => prev + 1);
    
    // Log language change for debugging
    console.log(`Language changed to: ${lang}`);
  }, []);

  // Load language from local storage on initial load
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as LanguageType | null;
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'es' || storedLanguage === 'pt')) {
      setLanguage(storedLanguage);
      document.documentElement.setAttribute('lang', storedLanguage);
      console.log(`Initial language loaded from storage: ${storedLanguage}`);
    }
  }, []);

  // This section with translations is kept the same
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
      estimatedDelivery: "Expected in 2-4 days",
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
      
      // Profile Page
      name: "Name",
      enterName: "Enter your name",
      age: "Age",
      gender: "Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      "prefer-not-to-say": "Prefer not to say",
      diabetesType: "Diabetes Type",
      type1: "Type 1",
      type2: "Type 2",
      prediabetes: "Prediabetes",
      gestational: "Gestational",
      weight: "Weight",
      targetRange: "Target Glucose Range",
      low: "Low",
      target: "Target",
      high: "High",
      exerciseFrequency: "Exercise Frequency",
      sedentary: "Sedentary",
      sedentaryDesc: "Little to no exercise",
      light: "Light",
      lightDesc: "Light exercise 1-3 days/week",
      moderate: "Moderate",
      moderateDesc: "Moderate exercise 3-5 days/week",
      active: "Active",
      activeDesc: "Active exercise 6-7 days/week",
      "very-active": "Very Active",
      "very-activeDesc": "Very active & physical job",
      dietType: "Diet Type",
      regular: "Regular",
      "low-carb": "Low Carb",
      "low-fat": "Low Fat",
      vegetarian: "Vegetarian",
      vegan: "Vegan",
      smoker: "I am a smoker",
      primaryGoal: "Primary Health Goal",
      "better-control": "Better Glucose Control",
      "better-controlDesc": "Maintain healthier glucose levels",
      "lose-weight": "Lose Weight",
      "lose-weightDesc": "Reduce weight through diet & exercise",
      "more-energy": "More Energy",
      "more-energyDesc": "Improve energy levels throughout the day",
      "reduce-medication": "Reduce Medication",
      "reduce-medicationDesc": "Work towards reducing medication needs",
      custom: "Custom Goal",
      customDesc: "Set your own health objective",
      customGoal: "Your Custom Goal",
      customGoalPlaceholder: "Describe your health goal here...",
      privacyNote: "Your health information is kept private and helps us personalize your experience.",
      profileCompletion: "Profile Completion",
      saveProfile: "Save Profile",
      changeLanguage: "Change Language",
      basicInfo: "Basic Information",
      healthInfo: "Health Information",
      lifestyle: "Lifestyle",
      goals: "Goals",
      guestUser: "Guest User",
      completed: "Completed",
      
      // Learn Page
      learn: "Learn",
      topicNotFound: "Topic not found",
      backToPlan: "Back to Home",
      topicCompleted: "Topic Completed",
      markAsRead: "Mark as Read",
      laserTechnology: "Laser Technology",
      howItWorksContent: "The Accu-Tech Glucometer uses advanced laser technology to measure glucose levels without requiring blood samples. The device works by directing a safe, low-power laser beam through the skin, where it interacts with glucose molecules in the interstitial fluid.\n\nUsing a process called Raman spectroscopy, the device analyzes how the light scatters when it encounters glucose molecules, providing an accurate measurement without piercing the skin.",
      howItWorks: "How Does It Work?",
      step1Description: "Place the device against your skin (typically on your wrist or palm)",
      step2Description: "Press the scan button to activate the laser sensor",
      step3Description: "Hold still for 5-10 seconds while the reading is taken",
      step4Description: "View your glucose results on the device display or in the app",
      keyGlucoseData: "Key Glucose Levels",
      state: "State",
      level: "Level",
      hypoglycemia: "Hypoglycemia (Low)",
      normalFasting: "Normal (Fasting)",
      prediabeticFasting: "Prediabetic (Fasting)",
      diabeticFasting: "Diabetic (Fasting)",
      
      // Benefits Page
      benefitsContent: "The Accu-Tech Laser Glucometer revolutionizes glucose monitoring by eliminating the pain and inconvenience of traditional blood testing methods. Our patented technology makes glucose testing simple, painless, and accessible for everyone.",
      noPain: "Pain-Free",
      instantResults: "Instant Results",
      costEffective: "Cost Effective",
      discrete: "Discrete & Portable",
      comparisonWithTraditional: "Comparison With Traditional Methods",
      feature: "Feature",
      glucoVista: "Accu-Tech",
      traditionalMethods: "Traditional Methods",
      pain: "Pain",
      noPainAtAll: "No pain at all",
      painfulPricks: "Painful finger pricks",
      speed: "Speed",
      resultsInSeconds: "Results in seconds",
      severalMinutes: "Several minutes",
      consumables: "Consumables",
      noConsumables: "No test strips needed",
      expensiveStrips: "Expensive test strips",
      userTestimonial: "User Testimonial",
      testimonialContent: "After 10 years of pricking my fingers multiple times daily, switching to the Accu-Tech device has been life-changing. No more pain, no more test strips, and my fingers have finally healed.",
      testimonialName: "Michael R., Type 1 Diabetic",
      
      // Safety Page
      safetyContent: "Safety is our top priority. The Accu-Tech Laser Glucometer has undergone rigorous testing and clinical trials to ensure it meets the highest standards of medical device safety and accuracy.",
      certifications: "Certifications & Approvals",
      certification1: "FDA Cleared (US)",
      certification2: "CE Marked (Europe)",
      certification3: "ISO 13485 Medical Devices Certified",
      scientificStudies: "Scientific Validation",
      studiesContent: "Multiple independent clinical studies have validated the accuracy and safety of our non-invasive glucose monitoring technology.",
      clinicalStudyTitle: "Comparative Study of Non-Invasive Glucose Monitoring Technologies",
      journalReference: "Journal of Diabetes Technology, 2023",
      studyResults: "Study found 95% agreement between Accu-Tech readings and traditional blood glucose measurements across diverse patient populations.",
      moreCertificationInfo: "More Safety Information"
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
      
      // Profile Page
      name: "Nombre",
      enterName: "Ingresa tu nombre",
      age: "Edad",
      gender: "Género",
      male: "Masculino",
      female: "Femenino",
      other: "Otro",
      "prefer-not-to-say": "Prefiero no decir",
      diabetesType: "Tipo de Diabetes",
      type1: "Tipo 1",
      type2: "Tipo 2",
      prediabetes: "Prediabetes",
      gestational: "Gestacional",
      weight: "Peso",
      targetRange: "Rango de Glucosa Objetivo",
      low: "Bajo",
      target: "Objetivo",
      high: "Alto",
      exerciseFrequency: "Frecuencia de Ejercicio",
      sedentary: "Sedentario",
      sedentaryDesc: "Poco o ningún ejercicio",
      light: "Ligero",
      lightDesc: "Ejercicio ligero 1-3 días/semana",
      moderate: "Moderado",
      moderateDesc: "Ejercicio moderado 3-5 días/semana",
      active: "Activo",
      activeDesc: "Ejercicio activo 6-7 días/semana",
      "very-active": "Muy Activo",
      "very-activeDesc": "Muy activo y trabajo físico",
      dietType: "Tipo de Dieta",
      regular: "Regular",
      "low-carb": "Baja en Carbohidratos",
      "low-fat": "Baja en Grasas",
      vegetarian: "Vegetariana",
      vegan: "Vegana",
      smoker: "Soy fumador",
      primaryGoal: "Objetivo Principal de Salud",
      "better-control": "Mejor Control de Glucosa",
      "better-controlDesc": "Mantener niveles de glucosa más saludables",
      "lose-weight": "Perder Peso",
      "lose-weightDesc": "Reducir peso a través de dieta y ejercicio",
      "more-energy": "Más Energía",
      "more-energyDesc": "Mejorar los niveles de energía durante el día",
      "reduce-medication": "Reducir Medicación",
      "reduce-medicationDesc": "Trabajar para reducir las necesidades de medicación",
      custom: "Objetivo Personalizado",
      customDesc: "Establece tu propio objetivo de salud",
      customGoal: "Tu Objetivo Personalizado",
      customGoalPlaceholder: "Describe tu objetivo de salud aquí...",
      privacyNote: "Tu información de salud se mantiene privada y nos ayuda a personalizar tu experiencia.",
      profileCompletion: "Completado del Perfil",
      saveProfile: "Guardar Perfil",
      changeLanguage: "Cambiar Idioma",
      basicInfo: "Información Básica",
      healthInfo: "Información de Salud",
      lifestyle: "Estilo de Vida",
      goals: "Objetivos",
      guestUser: "Usuario Invitado",
      completed: "Completado",
      
      // Learn Page
      learn: "Aprender",
      topicNotFound: "Tema no encontrado",
      backToPlan: "Volver a Inicio",
      topicCompleted: "Tema Completado",
      markAsRead: "Marcar como Leído",
      laserTechnology: "Tecnología Láser",
      howItWorksContent: "El Glucómetro Accu-Tech utiliza tecnología láser avanzada para medir los niveles de glucosa sin requerir muestras de sangre. El dispositivo funciona dirigiendo un rayo láser seguro de baja potencia a través de la piel, donde interactúa con las moléculas de glucosa en el fluido intersticial.\n\nUtilizando un proceso llamado espectroscopia Raman, el dispositivo analiza cómo se dispersa la luz cuando encuentra moléculas de glucosa, proporcionando una medición precisa sin perforar la piel.",
      howItWorks: "¿Cómo Funciona?",
      step1Description: "Coloca el dispositivo contra tu piel (típicamente en la muñeca o palma)",
      step2Description: "Presiona el botón de escaneo para activar el sensor láser",
      step3Description: "Mantente quieto durante 5-10 segundos mientras se toma la lectura",
      step4Description: "Visualiza tus resultados de glucosa en la pantalla del dispositivo o en la aplicación",
      keyGlucoseData: "Niveles Clave de Glucosa",
      state: "Estado",
      level: "Nivel",
      hypoglycemia: "Hipoglucemia (Bajo)",
      normalFasting: "Normal (En ayunas)",
      prediabeticFasting: "Prediabético (En ayunas)",
      diabeticFasting: "Diabético (En ayunas)",
      
      // Benefits Page
      benefitsContent: "El Glucómetro Láser Accu-Tech revoluciona el monitoreo de glucosa eliminando el dolor y la inconveniencia de los métodos tradicionales de análisis de sangre. Nuestra tecnología patentada hace que las pruebas de glucosa sean simples, indoloras y accesibles para todos.",
      noPain: "Sin Dolor",
      instantResults: "Resultados Instantáneos",
      costEffective: "Rentable",
      discrete: "Discreto y Portátil",
      comparisonWithTraditional: "Comparación Con Métodos Tradicionales",
      feature: "Característica",
      glucoVista: "Accu-Tech",
      traditionalMethods: "Métodos Tradicionales",
      pain: "Dolor",
      noPainAtAll: "Sin dolor en absoluto",
      painfulPricks: "Dolorosos pinchazos en el dedo",
      speed: "Velocidad",
      resultsInSeconds: "Resultados en segundos",
      severalMinutes: "Varios minutos",
      consumables: "Consumibles",
      noConsumables: "No se necesitan tiras reactivas",
      expensiveStrips: "Tiras reactivas costosas",
      userTestimonial: "Testimonio de Usuario",
      testimonialContent: "Después de 10 años pinchándome los dedos varias veces al día, cambiar al dispositivo Accu-Tech ha cambiado mi vida. No más dolor, no más tiras reactivas, y mis dedos finalmente han sanado.",
      testimonialName: "Miguel R., Diabético Tipo 1",
      
      // Safety Page
      safetyContent: "La seguridad es nuestra principal prioridad. El Glucómetro Láser Accu-Tech ha sido sometido a rigurosas pruebas y ensayos clínicos para garantizar que cumple con los más altos estándares de seguridad y precisión de dispositivos médicos.",
      certifications: "Certificaciones y Aprobaciones",
      certification1: "Autorizado por la FDA (EE.UU.)",
      certification2: "Marcado CE (Europa)",
      certification3: "Certificado ISO 13485 para Dispositivos Médicos",
      scientificStudies: "Validación Científica",
      studiesContent: "Múltiples estudios clínicos independientes han validado la precisión y seguridad de nuestra tecnología de monitoreo de glucosa no invasiva.",
      clinicalStudyTitle: "Estudio Comparativo de Tecnologías de Monitoreo de Glucosa No Invasivas",
      journalReference: "Revista de Tecnología para la Diabetes, 2023",
      studyResults: "El estudio encontró un 95% de concordancia entre las lecturas de Accu-Tech y las mediciones tradicionales de glucosa en sangre en diversas poblaciones de pacientes.",
      moreCertificationInfo: "Más Información de Seguridad"
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
      
      // Profile Page
      name: "Nome",
      enterName: "Digite seu nome",
      age: "Idade",
      gender: "Gênero",
      male: "Masculino",
      female: "Feminino",
      other: "Outro",
      "prefer-not-to-say": "Prefiro não dizer",
      diabetesType: "Tipo de Diabetes",
      type1: "Tipo 1",
      type2: "Tipo 2",
      prediabetes: "Pré-diabetes",
      gestational: "Gestacional",
      weight: "Peso",
      targetRange: "Faixa Alvo de Glicose",
      low: "Baixo",
      target: "Alvo",
      high: "Alto",
      exerciseFrequency: "Frequência de Exercícios",
      sedentary: "Sedentário",
      sedentaryDesc: "Pouco ou nenhum exercício",
      light: "Leve",
      lightDesc: "Exercício leve 1-3 dias/semana",
      moderate: "Moderado",
      moderateDesc: "Exercício moderado 3-5 dias/semana",
      active: "Ativo",
      activeDesc: "Exercício ativo 6-7 dias/semana",
      "very-active": "Muito Ativo",
      "very-activeDesc": "Muito ativo e trabalho físico",
      dietType: "Tipo de Dieta",
      regular: "Regular",
      "low-carb": "Baixo Carboidrato",
      "low-fat": "Baixa Gordura",
      vegetarian: "Vegetariana",
      vegan: "Vegana",
      smoker: "Sou fumante",
      primaryGoal: "Objetivo Principal de Saúde",
      "better-control": "Melhor Controle de Glicose",
      "better-controlDesc": "Manter níveis de glicose mais saudáveis",
      "lose-weight": "Perder Peso",
      "lose-weightDesc": "Reduzir peso através de dieta e exercícios",
      "more-energy": "Mais Energia",
      "more-energyDesc": "Melhorar os níveis de energia ao longo do dia",
      "reduce-medication": "Reduzir Medicação",
      "reduce-medicationDesc": "Trabalhar para reduzir as necessidades de medicação",
      custom: "Objetivo Personalizado",
      customDesc: "Defina seu próprio objetivo de saúde",
      customGoal: "Seu Objetivo Personalizado",
      customGoalPlaceholder: "Descreva seu objetivo de saúde aqui...",
      privacyNote: "Suas informações de saúde são mantidas privadas e nos ajudam a personalizar sua experiência.",
      profileCompletion: "Conclusão do Perfil",
      saveProfile: "Salvar Perfil",
      changeLanguage: "Mudar Idioma",
      basicInfo: "Informações Básicas",
      healthInfo: "Informações de Saúde",
      lifestyle: "Estilo de Vida",
      goals: "Objetivos",
      guestUser: "Usuário Convidado",
      completed: "Concluído",
      
      // Learn Page
      learn: "Aprender",
      topicNotFound: "Tópico não encontrado",
      backToPlan: "Voltar para Início",
      topicCompleted: "Tópico Concluído",
      markAsRead: "Marcar como Lido",
      laserTechnology: "Tecnologia Laser",
      howItWorksContent: "O Glicosímetro Accu-Tech usa tecnologia laser avançada para medir os níveis de glicose sem precisar de amostras de sangue. O dispositivo funciona direcionando um feixe laser seguro de baixa potência através da pele, onde interage com as moléculas de glicose no fluido intersticial.\n\nUsando um processo chamado espectroscopia Raman, o dispositivo analisa como a luz se dispersa quando encontra moléculas de glicose, fornecendo uma medição precisa sem perfurar a pele.",
      howItWorks: "Como Funciona?",
      step1Description: "Coloque o dispositivo contra sua pele (geralmente no pulso ou palma)",
      step2Description: "Pressione o botão de digitalização para ativar o sensor laser",
      step3Description: "Fique parado por 5-10 segundos enquanto a leitura é feita",
      step4Description: "Veja seus resultados de glicose no visor do dispositivo ou no aplicativo",
      keyGlucoseData: "Níveis Chave de Glicose",
      state: "Estado",
      level: "Nível",
      hypoglycemia: "Hipoglicemia (Baixo)",
      normalFasting: "Normal (Jejum)",
      prediabeticFasting: "Pré-diabético (Jejum)",
      diabeticFasting: "Diabético (Jejum)",
      
      // Benefits Page
      benefitsContent: "O Glicosímetro a Laser Accu-Tech revoluciona o monitoramento de glicose eliminando a dor e o inconveniente dos métodos tradicionais de teste sanguíneo. Nossa tecnologia patenteada torna o teste de glicose simples, indolor e acessível para todos.",
      noPain: "Sem Dor",
      instantResults: "Resultados Instantâneos",
      costEffective: "Custo-Benefício",
      discrete: "Discreto e Portátil",
      comparisonWithTraditional: "Comparação Com Métodos Tradicionais",
      feature: "Característica",
      glucoVista: "Accu-Tech",
      traditionalMethods: "Métodos Tradicionais",
      pain: "Dor",
      noPainAtAll: "Sem dor alguma",
      painfulPricks: "Picadas dolorosas nos dedos",
      speed: "Velocidade",
      resultsInSeconds: "Resultados em segundos",
      severalMinutes: "Vários minutos",
      consumables: "Consumíveis",
      noConsumables: "Não precisa de tiras de teste",
      expensiveStrips: "Tiras de teste caras",
      userTestimonial: "Depoimento de Usuário",
      testimonialContent: "Depois de 10 anos furando meus dedos várias vezes ao dia, mudar para o dispositivo Accu-Tech mudou minha vida. Sem mais dor, sem mais tiras de teste, e meus dedos finalmente sararam.",
      testimonialName: "Miguel R., Diabético Tipo 1",
      
      // Safety Page
      safetyContent: "A segurança é nossa prioridade máxima. O Glicosímetro a Laser Accu-Tech passou por testes rigorosos e ensaios clínicos para garantir que atenda aos mais altos padrões de segurança e precisão de dispositivos médicos.",
      certifications: "Certificações e Aprovações",
      certification1: "Aprovado pela FDA (EUA)",
      certification2: "Marcação CE (Europa)",
      certification3: "Certificado ISO 13485 para Dispositivos Médicos",
      scientificStudies: "Validação Científica",
      studiesContent: "Vários estudos clínicos independentes validaram a precisão e segurança da nossa tecnologia de monitoramento de glicose não invasiva.",
      clinicalStudyTitle: "Estudo Comparativo de Tecnologias de Monitoramento de Glicose Não Invasivas",
      journalReference: "Revista de Tecnologia para Diabetes, 2023",
      studyResults: "O estudo encontrou 95% de concordância entre as leituras do Accu-Tech e as medições tradicionais de glicose no sangue em diversas populações de pacientes.",
      moreCertificationInfo: "Mais Informações de Segurança"
    }
  };

  const translate = (key: string, params = {}) => {
    if (!key) return '';
    
    // Try to get translation from current language
    let translation = translations[language]?.[key];
    
    // If translation not found, fall back to English
    if (!translation && language !== 'en') {
      translation = translations['en'][key];
      
      // Log missing translations for debugging
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Missing translation for key "${key}" in language "${language}"`);
      }
    }
    
    // If still no translation found, return the key itself
    if (!translation) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Missing translation for key "${key}" in any language`);
      }
      return key;
    }
    
    // Replace any parameters in the translation string
    for (const paramKey in params) {
      translation = translation.replace(
        new RegExp(`{{${paramKey}}}`, 'g'), 
        String(params[paramKey])
      );
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
      {/* forceUpdate is added to the key to force re-renders when language changes */}
      <div key={`lang-wrapper-${language}-${forceUpdate}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
