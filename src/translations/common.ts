
import { enUS, es, it, de } from "date-fns/locale";
import type { Locale } from 'date-fns';

export type SupportedLanguage = "en" | "es" | "it" | "de" | "pt";

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
  phoneNumber: string;
  
  // Order Success Page
  orderConfirmed: string;
  orderThankYou: string;
  deliveryStatus: string;
  orderPlaced: string;
  processingStatus: string;
  estimatedProcess: string;
  shippingStatus: string;
  estimatedDelivery: string;
  orderConfirmationEmail: string;
  backToHome: string;
  
  // Shopify Settings
  shopifyIntegration: string;
  shopifyIntegrationDescription: string;
  connecting: string;
  shopifyConnected: string;
  
  // Admin
  adminDashboard: string;
  allOrders: string;
  orderDetails: string;
  orderID: string;
  customer: string;
  shippingAddress: string;
  productPrice: string;
  shippingCost: string;
  total: string;
  paymentMethod: string;
  shopifyOrderID: string;
  exportedToShopify: string;
  pendingExport: string;
  edit: string;
  editOrder: string;
  exportToShopify: string;
  loadingStatus: string;
  noOrders: string;
  errorLoadingOrder: string;
  addressCheck: string;
  aiAddressValidation: string;
  checkAddress: string;
  applySuggestions: string;
  issuesDetected: string;
  issuesFound: string;
  valid: string;
  notChecked: string;
  suggestions: string;
  pendingStatus: string;
  shippedStatus: string;
  delivered: string;
  adminOrders: string;
  phoneLabel: string;
  addressLabel: string;
  product: string;
}

export const commonTranslations: Record<string, CommonTranslations> = {
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
    phoneNumber: "Phone",
    
    orderConfirmed: "Order Confirmed!",
    orderThankYou: "Thank you for your order!",
    deliveryStatus: "Delivery Status",
    orderPlaced: "Order Placed",
    processingStatus: "Processing",
    estimatedProcess: "Estimated 1-2 business days",
    shippingStatus: "Shipping",
    estimatedDelivery: "Estimated 3-5 business days",
    orderConfirmationEmail: "A confirmation email has been sent to your address.",
    backToHome: "Back to Home",
    
    shopifyIntegration: "Shopify Integration",
    shopifyIntegrationDescription: "Connect your Shopify store to export orders.",
    connecting: "Connecting...",
    shopifyConnected: "Shopify is connected",
    adminDashboard: "Admin Dashboard",
    allOrders: "All Orders",
    orderDetails: "Order Details",
    orderID: "Order ID",
    customer: "Customer",
    shippingAddress: "Shipping Address",
    productPrice: "Product Price",
    shippingCost: "Shipping",
    total: "Total",
    paymentMethod: "Payment Method",
    shopifyOrderID: "Shopify Order ID",
    exportedToShopify: "Exported to Shopify",
    pendingExport: "Pending Export",
    edit: "Edit",
    editOrder: "Edit Order",
    exportToShopify: "Export to Shopify",
    loadingStatus: "Loading",
    noOrders: "No orders found",
    errorLoadingOrder: "Error loading order",
    addressCheck: "Address Check",
    aiAddressValidation: "AI Address Validation",
    checkAddress: "Check Address",
    applySuggestions: "Apply Suggestions",
    issuesDetected: "Issues Detected",
    issuesFound: "Issues Found",
    valid: "Valid",
    notChecked: "Not Checked",
    suggestions: "Suggestions",
    pendingStatus: "Pending",
    shippedStatus: "Shipped",
    delivered: "Delivered",
    adminOrders: "Orders",
    phoneLabel: "Phone",
    addressLabel: "Address",
    product: "Product",
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
    phoneNumber: "Teléfono",
    
    orderConfirmed: "¡Pedido Confirmado!",
    orderThankYou: "¡Gracias por tu pedido!",
    deliveryStatus: "Estado de Entrega",
    orderPlaced: "Pedido Realizado",
    processingStatus: "Procesando",
    estimatedProcess: "Estimado de 1-2 días hábiles",
    shippingStatus: "Envío",
    estimatedDelivery: "Estimado de 3-5 días hábiles",
    orderConfirmationEmail: "Se ha enviado un correo electrónico de confirmación a tu dirección.",
    backToHome: "Volver a Inicio",
    
    shopifyIntegration: "Integración con Shopify",
    shopifyIntegrationDescription: "Conecta tu tienda Shopify para exportar pedidos.",
    connecting: "Conectando...",
    shopifyConnected: "Shopify está conectado",
    adminDashboard: "Panel de Administración",
    allOrders: "Todos los Pedidos",
    orderDetails: "Detalles del Pedido",
    orderID: "ID del Pedido",
    customer: "Cliente",
    shippingAddress: "Dirección de Envío",
    productPrice: "Precio del Producto",
    shippingCost: "Envío",
    total: "Total",
    paymentMethod: "Método de Pago",
    shopifyOrderID: "ID de Pedido Shopify",
    exportedToShopify: "Exportado a Shopify",
    pendingExport: "Exportación Pendiente",
    edit: "Editar",
    editOrder: "Editar Pedido",
    exportToShopify: "Exportar a Shopify",
    loadingStatus: "Cargando",
    noOrders: "No se encontraron pedidos",
    errorLoadingOrder: "Error al cargar el pedido",
    addressCheck: "Verificación de Dirección",
    aiAddressValidation: "Validación de Dirección con IA",
    checkAddress: "Verificar Dirección",
    applySuggestions: "Aplicar Sugerencias",
    issuesDetected: "Problemas Detectados",
    issuesFound: "Problemas Encontrados",
    valid: "Válida",
    notChecked: "Sin Verificar",
    suggestions: "Sugerencias",
    pendingStatus: "Pendiente",
    shippedStatus: "Enviado",
    delivered: "Entregado",
    adminOrders: "Pedidos",
    phoneLabel: "Teléfono",
    addressLabel: "Dirección",
    product: "Producto",
  },
  pt: {
    appName: "Accu-Tech",
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso",
    home: "Início",
    
    onboardingTitle: "Bem-vindo ao Accu-Tech",
    onboardingSubtitle: "Vamos começar com nosso aplicativo.",
    next: "Próximo",
    finish: "Terminar",
    
    languageTitle: "Configurações de Idioma",
    languageSubtitle: "Escolha seu idioma preferido.",
    selectLanguage: "Selecionar Idioma",
    
    homeTitle: "Painel",
    welcomeMessage: "Bem-vindo de volta!",
    startHere: "Comece Aqui",
    
    learnTitle: "Aprenda Mais",
    learnSubtitle: "Amplie seus conhecimentos.",
    
    planTitle: "Plano Personalizado",
    planSubtitle: "Obtenha seu plano de saúde personalizado.",
    
    deviceConnectionTitle: "Conecte seu Dispositivo",
    deviceConnectionSubtitle: "Emparelhe seu dispositivo Accu-Tech para um monitoramento perfeito.",
    connectDevice: "Conectar Dispositivo",
    
    checkoutTitle: "Finalizar Compra",
    checkoutSubtitle: "Revise seu pedido e complete sua compra.",
    shippingInformation: "Informações de Envio",
    paymentInformation: "Informações de Pagamento",
    reviewOrder: "Revisar Pedido",
    placeOrder: "Fazer Pedido",
    firstName: "Nome",
    lastName: "Sobrenome",
    address: "Endereço",
    city: "Cidade",
    province: "Distrito",
    postalCode: "Código Postal",
    country: "País",
    email: "Email",
    phoneNumber: "Telefone",
    
    orderConfirmed: "Pedido Confirmado!",
    orderThankYou: "Obrigado pelo seu pedido!",
    deliveryStatus: "Status de Entrega",
    orderPlaced: "Pedido Realizado",
    processingStatus: "Processando",
    estimatedProcess: "Estimado em 1-2 dias úteis",
    shippingStatus: "Enviando",
    estimatedDelivery: "Estimado em 3-5 dias úteis",
    orderConfirmationEmail: "Um email de confirmação foi enviado para o seu endereço.",
    backToHome: "Voltar para o Início",
    
    shopifyIntegration: "Integração com Shopify",
    shopifyIntegrationDescription: "Conecte sua loja Shopify para exportar pedidos.",
    connecting: "Conectando...",
    shopifyConnected: "Shopify está conectado",
    adminDashboard: "Painel de Administração",
    allOrders: "Todos os Pedidos",
    orderDetails: "Detalhes do Pedido",
    orderID: "ID do Pedido",
    customer: "Cliente",
    shippingAddress: "Endereço de Entrega",
    productPrice: "Preço do Produto",
    shippingCost: "Envio",
    total: "Total",
    paymentMethod: "Método de Pagamento",
    shopifyOrderID: "ID do Pedido Shopify",
    exportedToShopify: "Exportado para Shopify",
    pendingExport: "Exportação Pendente",
    edit: "Editar",
    editOrder: "Editar Pedido",
    exportToShopify: "Exportar para Shopify",
    loadingStatus: "Carregando",
    noOrders: "Nenhum pedido encontrado",
    errorLoadingOrder: "Erro ao carregar o pedido",
    addressCheck: "Verificação de Endereço",
    aiAddressValidation: "Validação de Endereço com IA",
    checkAddress: "Verificar Endereço",
    applySuggestions: "Aplicar Sugestões",
    issuesDetected: "Problemas Detectados",
    issuesFound: "Problemas Encontrados",
    valid: "Válido",
    notChecked: "Não Verificado",
    suggestions: "Sugestões",
    pendingStatus: "Pendente",
    shippedStatus: "Enviado",
    delivered: "Entregue",
    adminOrders: "Pedidos",
    phoneLabel: "Telefone",
    addressLabel: "Endereço",
    product: "Produto",
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
    phoneNumber: "Telefono",
    
    orderConfirmed: "Ordine Confermato!",
    orderThankYou: "Grazie per il tuo ordine!",
    deliveryStatus: "Stato di Consegna",
    orderPlaced: "Ordine Effettuato",
    processingStatus: "Elaborazione",
    estimatedProcess: "Stimato 1-2 giorni lavorativi",
    shippingStatus: "Spedizione",
    estimatedDelivery: "Stimato 3-5 giorni lavorativi",
    orderConfirmationEmail: "Un'email di conferma è stata inviata al tuo indirizzo.",
    backToHome: "Torna alla Home",
    
    shopifyIntegration: "Integrazione con Shopify",
    shopifyIntegrationDescription: "Collega il tuo negozio Shopify per esportare gli ordini.",
    connecting: "Connessione...",
    shopifyConnected: "Shopify è connesso",
    adminDashboard: "Pannello di Amministrazione",
    allOrders: "Tutti gli Ordini",
    orderDetails: "Dettagli dell'Ordine",
    orderID: "ID Ordine",
    customer: "Cliente",
    shippingAddress: "Indirizzo di Spedizione",
    productPrice: "Prezzo del Prodotto",
    shippingCost: "Spedizione",
    total: "Totale",
    paymentMethod: "Metodo di Pagamento",
    shopifyOrderID: "ID Ordine Shopify",
    exportedToShopify: "Esportato su Shopify",
    pendingExport: "Esportazione in Attesa",
    edit: "Modifica",
    editOrder: "Modifica Ordine",
    exportToShopify: "Esporta su Shopify",
    loadingStatus: "Caricamento",
    noOrders: "Nessun ordine trovato",
    errorLoadingOrder: "Errore nel caricamento dell'ordine",
    addressCheck: "Verifica Indirizzo",
    aiAddressValidation: "Validazione Indirizzo con IA",
    checkAddress: "Verifica Indirizzo",
    applySuggestions: "Applica Suggerimenti",
    issuesDetected: "Problemi Rilevati",
    issuesFound: "Problemi Trovati",
    valid: "Valido",
    notChecked: "Non Verificato",
    suggestions: "Suggerimenti",
    pendingStatus: "In Attesa",
    shippedStatus: "Spedito",
    delivered: "Consegnato",
    adminOrders: "Ordini",
    phoneLabel: "Telefono",
    addressLabel: "Indirizzo",
    product: "Prodotto",
  },
  de: {
    appName: "Accu-Tech",
    loading: "Wird geladen...",
    error: "Fehler",
    success: "Erfolg",
    home: "Startseite",
    
    onboardingTitle: "Willkommen bei Accu-Tech",
    onboardingSubtitle: "Lass uns mit unserer App beginnen.",
    next: "Weiter",
    finish: "Fertigstellen",
    
    languageTitle: "Spracheinstellungen",
    languageSubtitle: "Wähle deine bevorzugte Sprache.",
    selectLanguage: "Sprache auswählen",
    
    homeTitle: "Dashboard",
    welcomeMessage: "Willkommen zurück!",
    startHere: "Hier beginnen",
    
    learnTitle: "Mehr erfahren",
    learnSubtitle: "Erweitere dein Wissen.",
    
    planTitle: "Personalisierter Plan",
    planSubtitle: "Erhalte deinen maßgeschneiderten Gesundheitsplan.",
    
    deviceConnectionTitle: "Verbinde dein Gerät",
    deviceConnectionSubtitle: "Koppel dein Accu-Tech-Gerät für nahtloses Tracking.",
    connectDevice: "Gerät verbinden",
    
    checkoutTitle: "Zur Kasse",
    checkoutSubtitle: "Überprüfe deine Bestellung und schließe deinen Kauf ab.",
    shippingInformation: "Versandinformationen",
    paymentInformation: "Zahlungsinformationen",
    reviewOrder: "Bestellung überprüfen",
    placeOrder: "Bestellung aufgeben",
    firstName: "Vorname",
    lastName: "Nachname",
    address: "Adresse",
    city: "Stadt",
    province: "Bundesland",
    postalCode: "Postleitzahl",
    country: "Land",
    email: "E-Mail",
    phoneNumber: "Telefon",
    
    orderConfirmed: "Bestellung bestätigt!",
    orderThankYou: "Vielen Dank für deine Bestellung!",
    deliveryStatus: "Lieferstatus",
    orderPlaced: "Bestellung aufgegeben",
    processingStatus: "In Bearbeitung",
    estimatedProcess: "Geschätzte 1-2 Werktage",
    shippingStatus: "Versand",
    estimatedDelivery: "Geschätzte 3-5 Werktage",
    orderConfirmationEmail: "Eine Bestätigungsmail wurde an deine Adresse gesendet.",
    backToHome: "Zurück zur Startseite",
    
    shopifyIntegration: "Shopify Integration",
    shopifyIntegrationDescription: "Verbinde deinen Shopify-Shop, um Bestellungen zu exportieren.",
    connecting: "Verbinden...",
    shopifyConnected: "Shopify ist verbunden",
    adminDashboard: "Admin-Dashboard",
    allOrders: "Alle Bestellungen",
    orderDetails: "Bestellungsdetails",
    orderID: "Bestellnummer",
    customer: "Kunde",
    shippingAddress: "Lieferadresse",
    productPrice: "Produktpreis",
    shippingCost: "Versand",
    total: "Gesamt",
    paymentMethod: "Zahlungsmethode",
    shopifyOrderID: "Shopify Bestellnummer",
    exportedToShopify: "Nach Shopify exportiert",
    pendingExport: "Export ausstehend",
    edit: "Bearbeiten",
    editOrder: "Bestellung bearbeiten",
    exportToShopify: "Nach Shopify exportieren",
    loadingStatus: "Wird geladen",
    noOrders: "Keine Bestellungen gefunden",
    errorLoadingOrder: "Fehler beim Laden der Bestellung",
    addressCheck: "Adressprüfung",
    aiAddressValidation: "KI-Adressvalidierung",
    checkAddress: "Adresse prüfen",
    applySuggestions: "Vorschläge anwenden",
    issuesDetected: "Probleme erkannt",
    issuesFound: "Probleme gefunden",
    valid: "Gültig",
    notChecked: "Nicht überprüft",
    suggestions: "Vorschläge",
    pendingStatus: "Ausstehend",
    shippedStatus: "Versendet",
    delivered: "Geliefert",
    adminOrders: "Bestellungen",
    phoneLabel: "Telefon",
    addressLabel: "Adresse",
    product: "Produkt",
  }
};

export const dateFnsLocales: Record<string, Locale> = {
  en: enUS,
  es: es,
  it: it,
  pt: enUS, // Using English for Portuguese as fallback
  de: de
};
