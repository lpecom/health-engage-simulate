import { enUS } from "date-fns/locale";

export type SupportedLanguage = "en" | "es" | "it";

interface CommonTranslations {
  // General
  appName: string;
  loading: string;
  error: string;
  success: string;
  home: string;
  
  // Onboarding
  onboardingTitle: string;
  onboardingSubtitle: string;
  next: string;
  finish: string;
  
  // Language Page
  languageTitle: string;
  languageSubtitle: string;
  selectLanguage: string;
  
  // Home Page
  homeTitle: string;
  welcomeMessage: string;
  startHere: string;
  
  // Learn Page
  learnTitle: string;
  learnSubtitle: string;
  
  // Personalized Plan Page
  planTitle: string;
  planSubtitle: string;
  
  // Device Connection Page
  deviceConnectionTitle: string;
  deviceConnectionSubtitle: string;
  connectDevice: string;
  
  // Checkout Page
  checkoutTitle: string;
  checkoutSubtitle: string;
  shippingInformation: string;
  paymentInformation: string;
  reviewOrder: string;
  placeOrder: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  email: string;
  phone: string;
  
  // Order Success Page
  orderConfirmed: string;
  orderThankYou: string;
  deliveryStatus: string;
  orderPlaced: string;
  processing: string;
  estimatedProcess: string;
  shipping: string;
  estimatedDelivery: string;
  orderConfirmationEmail: string;
  backToHome: string;
  
  // Shopify Settings
  shopifyIntegration: string;
  shopifyIntegrationDescription: string;
  connecting: string;
  shopifyConnected: string;
  
  // Admin
  adminDashboard: 'Admin Dashboard';
  allOrders: 'All Orders';
  orderDetails: 'Order Details';
  orderID: 'Order ID';
  customer: 'Customer';
  shippingAddress: 'Shipping Address';
  productPrice: 'Product Price';
  shipping: 'Shipping';
  total: 'Total';
  paymentMethod: 'Payment Method';
  shopifyOrderID: 'Shopify Order ID';
  exportedToShopify: 'Exported to Shopify';
  pendingExport: 'Pending Export';
  edit: 'Edit';
  editOrder: 'Edit Order';
  exportToShopify: 'Export to Shopify';
  noOrders: 'No orders found';
  errorLoadingOrder: 'Error loading order';
  addressCheck: 'Address Check';
  aiAddressValidation: 'AI Address Validation';
  checkAddress: 'Check Address';
  applySuggestions: 'Apply Suggestions';
  issuesDetected: 'Issues Detected';
  issuesFound: 'Issues Found';
  valid: 'Valid';
  notChecked: 'Not Checked';
  suggestions: 'Suggestions';
  pending: 'Pending';
  shipped: 'Shipped';
  delivered: 'Delivered';
  adminOrders: 'Orders';
  phone: 'Phone';
  product: 'Product';
}

export const commonTranslations: Record<SupportedLanguage, CommonTranslations> = {
  en: {
    appName: "Accu-Tech",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    home: "Home",
    
    onboardingTitle: "Welcome to Accu-Tech",
    onboardingSubtitle: "Let's get you started with our app.",
    next: "Next",
    finish: "Finish",
    
    languageTitle: "Language Settings",
    languageSubtitle: "Choose your preferred language.",
    selectLanguage: "Select Language",
    
    homeTitle: "Dashboard",
    welcomeMessage: "Welcome back!",
    startHere: "Start Here",
    
    learnTitle: "Learn More",
    learnSubtitle: "Expand your knowledge.",
    
    planTitle: "Personalized Plan",
    planSubtitle: "Get your tailored health plan.",
    
    deviceConnectionTitle: "Connect Your Device",
    deviceConnectionSubtitle: "Pair your Accu-Tech device for seamless tracking.",
    connectDevice: "Connect Device",
    
    checkoutTitle: "Checkout",
    checkoutSubtitle: "Review your order and complete your purchase.",
    shippingInformation: "Shipping Information",
    paymentInformation: "Payment Information",
    reviewOrder: "Review Order",
    placeOrder: "Place Order",
    firstName: "First Name",
    lastName: "Last Name",
    address: "Address",
    city: "City",
    province: "Province",
    postalCode: "Postal Code",
    country: "Country",
    email: "Email",
    phone: "Phone",
    
    orderConfirmed: "Order Confirmed!",
    orderThankYou: "Thank you for your order!",
    deliveryStatus: "Delivery Status",
    orderPlaced: "Order Placed",
    processing: "Processing",
    estimatedProcess: "Estimated 1-2 business days",
    shipping: "Shipping",
    estimatedDelivery: "Estimated 3-5 business days",
    orderConfirmationEmail: "A confirmation email has been sent to your address.",
    backToHome: "Back to Home",
    
    shopifyIntegration: "Shopify Integration",
    shopifyIntegrationDescription: "Connect your Shopify store to export orders.",
    connecting: "Connecting...",
    shopifyConnected: "Shopify is connected",
    adminDashboard: 'Admin Dashboard',
    allOrders: 'All Orders',
    orderDetails: 'Order Details',
    orderID: 'Order ID',
    customer: 'Customer',
    shippingAddress: 'Shipping Address',
    productPrice: 'Product Price',
    shipping: 'Shipping',
    total: 'Total',
    paymentMethod: 'Payment Method',
    shopifyOrderID: 'Shopify Order ID',
    exportedToShopify: 'Exported to Shopify',
    pendingExport: 'Pending Export',
    edit: 'Edit',
    editOrder: 'Edit Order',
    exportToShopify: 'Export to Shopify',
    loading: 'Loading',
    noOrders: 'No orders found',
    errorLoadingOrder: 'Error loading order',
    addressCheck: 'Address Check',
    aiAddressValidation: 'AI Address Validation',
    checkAddress: 'Check Address',
    applySuggestions: 'Apply Suggestions',
    issuesDetected: 'Issues Detected',
    issuesFound: 'Issues Found',
    valid: 'Valid',
    notChecked: 'Not Checked',
    suggestions: 'Suggestions',
    pending: 'Pending',
    shipped: 'Shipped',
    delivered: 'Delivered',
    adminOrders: 'Orders',
    phone: 'Phone',
    address: 'Address',
    product: 'Product',
  },
  es: {
    appName: "Accu-Tech",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    home: "Inicio",
    
    onboardingTitle: "Bienvenido a Accu-Tech",
    onboardingSubtitle: "Comencemos con nuestra aplicación.",
    next: "Siguiente",
    finish: "Finalizar",
    
    languageTitle: "Configuración de Idioma",
    languageSubtitle: "Elige tu idioma preferido.",
    selectLanguage: "Seleccionar Idioma",
    
    homeTitle: "Panel",
    welcomeMessage: "¡Bienvenido de nuevo!",
    startHere: "Comenzar Aquí",
    
    learnTitle: "Aprende Más",
    learnSubtitle: "Amplía tus conocimientos.",
    
    planTitle: "Plan Personalizado",
    planSubtitle: "Obtén tu plan de salud a medida.",
    
    deviceConnectionTitle: "Conecta tu Dispositivo",
    deviceConnectionSubtitle: "Empareja tu dispositivo Accu-Tech para un seguimiento perfecto.",
    connectDevice: "Conectar Dispositivo",
    
    checkoutTitle: "Pago",
    checkoutSubtitle: "Revisa tu pedido y completa tu compra.",
    shippingInformation: "Información de Envío",
    paymentInformation: "Información de Pago",
    reviewOrder: "Revisar Pedido",
    placeOrder: "Realizar Pedido",
    firstName: "Nombre",
    lastName: "Apellido",
    address: "Dirección",
    city: "Ciudad",
    province: "Provincia",
    postalCode: "Código Postal",
    country: "País",
    email: "Correo Electrónico",
    phone: "Teléfono",
    
    orderConfirmed: "¡Pedido Confirmado!",
    orderThankYou: "¡Gracias por tu pedido!",
    deliveryStatus: "Estado de Entrega",
    orderPlaced: "Pedido Realizado",
    processing: "Procesando",
    estimatedProcess: "Estimado de 1-2 días hábiles",
    shipping: "Envío",
    estimatedDelivery: "Estimado de 3-5 días hábiles",
    orderConfirmationEmail: "Se ha enviado un correo electrónico de confirmación a tu dirección.",
    backToHome: "Volver a Inicio",
    
    shopifyIntegration: "Integración con Shopify",
    shopifyIntegrationDescription: "Conecta tu tienda Shopify para exportar pedidos.",
    connecting: "Conectando...",
    shopifyConnected: "Shopify está conectado",
    adminDashboard: 'Panel de Administración',
    allOrders: 'Todos los Pedidos',
    orderDetails: 'Detalles del Pedido',
    orderID: 'ID del Pedido',
    customer: 'Cliente',
    shippingAddress: 'Dirección de Envío',
    productPrice: 'Precio del Producto',
    shipping: 'Envío',
    total: 'Total',
    paymentMethod: 'Método de Pago',
    shopifyOrderID: 'ID de Pedido Shopify',
    exportedToShopify: 'Exportado a Shopify',
    pendingExport: 'Exportación Pendiente',
    edit: 'Editar',
    editOrder: 'Editar Pedido',
    exportToShopify: 'Exportar a Shopify',
    loading: 'Cargando',
    noOrders: 'No se encontraron pedidos',
    errorLoadingOrder: 'Error al cargar el pedido',
    addressCheck: 'Verificación de Dirección',
    aiAddressValidation: 'Validación de Dirección con IA',
    checkAddress: 'Verificar Dirección',
    applySuggestions: 'Aplicar Sugerencias',
    issuesDetected: 'Problemas Detectados',
    issuesFound: 'Problemas Encontrados',
    valid: 'Válida',
    notChecked: 'Sin Verificar',
    suggestions: 'Sugerencias',
    pending: 'Pendiente',
    shipped: 'Enviado',
    delivered: 'Entregado',
    adminOrders: 'Pedidos',
    phone: 'Teléfono',
    address: 'Dirección',
    product: 'Producto',
  },
  it: {
    appName: "Accu-Tech",
    loading: "Caricamento...",
    error: "Errore",
    success: "Successo",
    home: "Home",
    
    onboardingTitle: "Benvenuto su Accu-Tech",
    onboardingSubtitle: "Iniziamo con la nostra app.",
    next: "Avanti",
    finish: "Fine",
    
    languageTitle: "Impostazioni Lingua",
    languageSubtitle: "Scegli la tua lingua preferita.",
    selectLanguage: "Seleziona Lingua",
    
    homeTitle: "Dashboard",
    welcomeMessage: "Bentornato!",
    startHere: "Inizia Qui",
    
    learnTitle: "Scopri di Più",
    learnSubtitle: "Espandi le tue conoscenze.",
    
    planTitle: "Piano Personalizzato",
    planSubtitle: "Ottieni il tuo piano sanitario su misura.",
    
    deviceConnectionTitle: "Connetti il Tuo Dispositivo",
    deviceConnectionSubtitle: "Associa il tuo dispositivo Accu-Tech per un monitoraggio perfetto.",
    connectDevice: "Connetti Dispositivo",
    
    checkoutTitle: "Checkout",
    checkoutSubtitle: "Rivedi il tuo ordine e completa l'acquisto.",
    shippingInformation: "Informazioni di Spedizione",
    paymentInformation: "Informazioni di Pagamento",
    reviewOrder: "Rivedi Ordine",
    placeOrder: "Effettua Ordine",
    firstName: "Nome",
    lastName: "Cognome",
    address: "Indirizzo",
    city: "Città",
    province: "Provincia",
    postalCode: "Codice Postale",
    country: "Paese",
    email: "Email",
    phone: "Telefono",
    
    orderConfirmed: "Ordine Confermato!",
    orderThankYou: "Grazie per il tuo ordine!",
    deliveryStatus: "Stato di Consegna",
    orderPlaced: "Ordine Effettuato",
    processing: "Elaborazione",
    estimatedProcess: "Stimato 1-2 giorni lavorativi",
    shipping: "Spedizione",
    estimatedDelivery: "Stimato 3-5 giorni lavorativi",
    orderConfirmationEmail: "Un'email di conferma è stata inviata al tuo indirizzo.",
    backToHome: "Torna alla Home",
    
    shopifyIntegration: "Integrazione con Shopify",
    shopifyIntegrationDescription: "Collega il tuo negozio Shopify per esportare gli ordini.",
    connecting: "Connessione...",
    shopifyConnected: "Shopify è connesso",
    adminDashboard: 'Pannello di Amministrazione',
    allOrders: 'Tutti gli Ordini',
    orderDetails: 'Dettagli dell\'Ordine',
    orderID: 'ID Ordine',
    customer: 'Cliente',
    shippingAddress: 'Indirizzo di Spedizione',
    productPrice: 'Prezzo del Prodotto',
    shipping: 'Spedizione',
    total: 'Totale',
    paymentMethod: 'Metodo di Pagamento',
    shopifyOrderID: 'ID Ordine Shopify',
    exportedToShopify: 'Esportato su Shopify',
    pendingExport: 'Esportazione in Attesa',
    edit: 'Modifica',
    editOrder: 'Modifica Ordine',
    exportToShopify: 'Esporta su Shopify',
    loading: 'Caricamento',
    noOrders: 'Nessun ordine trovato',
    errorLoadingOrder: 'Errore nel caricamento dell\'ordine',
    addressCheck: 'Verifica Indirizzo',
    aiAddressValidation: 'Validazione Indirizzo con IA',
    checkAddress: 'Verifica Indirizzo',
    applySuggestions: 'Applica Suggerimenti',
    issuesDetected: 'Problemi Rilevati',
    issuesFound: 'Problemi Trovati',
    valid: 'Valido',
    notChecked: 'Non Verificato',
    suggestions: 'Suggerimenti',
    pending: 'In Attesa',
    shipped: 'Spedito',
    delivered: 'Consegnato',
    adminOrders: 'Ordini',
    phone: 'Telefono',
    address: 'Indirizzo',
    product: 'Prodotto',
  },
};

export const dateFnsLocales: Record<SupportedLanguage, Locale> = {
  en: enUS,
  es: es,
  it: it,
};
