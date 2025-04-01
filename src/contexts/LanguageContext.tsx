import React, { createContext, useContext, useState } from 'react';

// Define all available languages
type LanguageCode = 'es' | 'pt' | 'it';

// Define translation function parameter type
type TranslateParams = { [key: string]: string | number };

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  translate: (key: string, params?: TranslateParams) => string;
}

// Add all the translations here
const translations = {
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
    'italian': 'Italiano',
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
    
    // Purchase step translations
    'buyYourDevice': 'Compra Tu Dispositivo',
    'paymentOnDeliveryMessage': 'Completa tu pedido con pago contra entrega',
    'paymentOnDelivery': 'PAGO CONTRA ENTREGA',
    'finishOrder': 'Finalizar Pedido',
    'deviceDescription': 'Dispositivo de monitoreo de glucosa no invasivo',
    
    // Checkout related
    'buy': "Comprar",
    'buyNow': "Comprar Ahora",
    'selectOffer': "Seleccioná la oferta",
    'copyPromoCode': "Copiar código HTML",
    'unit': "unidad",
    'subtotal': "Subtotal",
    'free': "Gratis",
    'total': "Total",
    'shippingMethod': "Método de envío",
    'freeShipping': "Envío Gratuito",
    'moneyBackGuarantee': "Garantía de devolución del dinero en {{days}} días",
    'secureTransaction': "Transacción segura",
    'enterShippingAddress': "Introduce tu dirección de envío",
    'firstName': "Nombre",
    'lastName': "Apellido",
    'phone': "Teléfono",
    'address': "Dirección",
    'province': "Provincia",
    'city': "Ciudad",
    'postalCode': "Código Postal",
    'orderConfirmed': "¡Pedido Confirmado!",
    'orderThankYou': "Gracias por tu compra. Comenzaremos a procesar tu pedido de inmediato.",
    'deliveryStatus': "Estado de Entrega",
    'orderPlaced': "Pedido Realizado",
    'processing': "Procesando",
    'estimatedProcess': "Tiempo est. de procesamiento: 1-2 días",
    'estimatedDelivery': "Entrega est.: 3-5 días",
    'orderConfirmationEmail': "Se ha enviado un correo de confirmación a tu dirección de email.",
    'backToHome': "Volver al Inicio",
    'installments': "En hasta {{count}} cuotas de {{value}}",
    'buy3get1': "Compra 3 y Llévate 1 Gratis",
    'language': "Idioma",
    'saveAndReturn': "Guardar y Volver",

    // Learn page translations
    'learn': 'Aprender',
    'topicNotFound': 'Tema no encontrado',
    'backToPlan': 'Volver al Plan',
    'markAsRead': 'Marcar como Leído',
    'topicCompleted': '¡Tema Completado!',
    'laserTechnology': 'Tecnología Láser',
    'howItWorksContent': 'GlucoVista utiliza espectroscopía de infrarrojo cercano (NIRS) para medir los niveles de glucosa a través de tu piel sin extraer sangre. El dispositivo emite un rayo láser de baja potencia que penetra la piel hasta una profundidad de unos pocos milímetros, donde interactúa con el fluido intersticial que contiene glucosa.\n\nLas moléculas de glucosa absorben longitudes de onda específicas de la luz, y el dispositivo mide este patrón de absorción. Algoritmos avanzados analizan este patrón para determinar con precisión tu nivel de glucosa. Todo este proceso toma solo unos segundos, proporcionándote lecturas rápidas y sin dolor.',
    'state': 'Estado',
    'level': 'Nivel',
    'hypoglycemia': 'Hipoglucemia',
    'normalFasting': 'Normal (ayuno)',
    'prediabeticFasting': 'Prediabético (ayuno)',
    'diabeticFasting': 'Diabético (ayuno)',
    'keyGlucoseData': 'Niveles Clave de Glucosa',
    'benefitsContent': 'GlucoVista ofrece beneficios revolucionarios en comparación con los métodos tradicionales de monitoreo de glucosa. Sin la necesidad de muestras de sangre, tiras reactivas o lancetas, nuestra tecnología hace que el monitoreo de glucosa sea verdaderamente indoloro y conveniente.',
    'noPain': 'No Pain',
    'instantResults': 'Instant Results',
    'costEffective': 'Cost Effective',
    'discrete': 'Discrete',
    'comparisonWithTraditional': 'Comparison with Traditional Methods',
    'feature': 'Feature',
    'glucoVista': 'GlucoVista',
    'traditionalMethods': 'Traditional Methods',
    'pain': 'Pain',
    'noPainAtAll': 'No pain at all',
    'painfulPricks': 'Painful finger pricks',
    'speed': 'Speed',
    'resultsInSeconds': 'Results in seconds',
    'severalMinutes': 'Several minutes',
    'consumables': 'Consumables',
    'noConsumables': 'No consumables needed',
    'expensiveStrips': 'Expensive test strips',
    'userTestimonial': 'User Testimonial',
    'testimonialContent': 'Since I started using GlucoVista, my life has completely changed. No more painful finger pricks, no more test strips, and I get my readings in seconds. It\'s been a game-changer for managing my diabetes.',
    'testimonialName': 'Sarah J., User for 6 months',
    'safetyContent': 'Safety is our top priority at GlucoVista. Our non-invasive glucose monitoring technology has undergone rigorous testing and clinical trials to ensure it meets the highest standards of safety and accuracy.',
    'certifications': 'Certifications',
    'certification1': 'FDA approved for non-invasive glucose monitoring',
    'certification2': 'CE Mark certification for European markets',
    'certification3': 'ISO 13485 Medical Device Quality Management',
    'scientificStudies': 'Scientific Studies',
    'studiesContent': 'Multiple independent studies have validated the safety and efficacy of our technology.',
    'clinicalStudyTitle': 'Clinical Validation of Non-Invasive Glucose Monitoring',
    'journalReference': 'Journal of Diabetes Technology, 2023',
    'studyResults': 'In a study of 250 patients across diverse demographics, GlucoVista demonstrated 95.4% accuracy compared to traditional blood glucose measurements, with zero adverse events reported.',
    'moreCertificationInfo': 'More certification information',
    
    // Shopify integration translations
    'shopifyIntegration': 'Integración con Shopify',
    'shopifyIntegrationDescription': 'Conecta tu tienda Shopify para sincronizar pedidos',
    'shopifyStoreName': 'Nombre de la tienda',
    'shopifyStoreNameHelp': 'Introduce solo el nombre (ejemplo: mitienda)',
    'shopifyAccessToken': 'Token de acceso',
    'shopifyAccessTokenHelp': 'Token de acceso de la API de Shopify',
    'connecting': 'Conectando...',
    'connect': 'Conectar',
    'shopifyConnected': 'Conectado a Shopify',
    'shopifySettings': 'Configuración de Shopify',
    'shopifyHelp1': 'Necesitas crear un token de acceso personalizado en tu panel de administración de Shopify.',
    'shopifyHelp2': 'Los pedidos se exportarán automáticamente a tu tienda Shopify.',
    'processing': 'Procesando...',
    'shopifyIntegrated': 'Este pedido se exportará a Shopify',
    'orderError': 'Error en el pedido',
    'orderErrorDesc': 'Ha ocurrido un error procesando tu pedido. Inténtalo de nuevo.'
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
    'italian': 'Italiano',
    'thankYouMessage': 'Obrigado por escolher nosso revolucionário glicosímetro não invasivo. Estamos animados para ajudá-lo a monitorar sua glicose sem dor.',
    'userTestimonial': 'O GlucoVista mudou completamente como eu gerencio meu diabetes. Sem mais picadas nos dedos!',
    'testimonialAuthor': 'João D., Diabetes Tipo 2',
    'deviceArrivalMessage': 'Seu dispositivo chegará nas próximas 24-48 horas. Enquanto isso, vamos configurar tudo!',
    'howItWorks': 'Tecnologia Revolucionária',
    'laserTechnologyIntro': 'Nuestro dispositivo usa tecnologia a laser avançada para medir seus níveis de glicose sem tirar sangue.',
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
    
    // Purchase step translations
    'buyYourDevice': 'Compre Seu Dispositivo',
    'paymentOnDeliveryMessage': 'Complete seu pedido com pagamento na entrega',
    'paymentOnDelivery': 'PAGAMENTO NA ENTREGA',
    'finishOrder': 'Finalizar Pedido',
    'deviceDescription': 'Dispositivo de monitoramento de glicose não invasivo',
    
    // Checkout related
    'buy': "Comprar",
    'buyNow': "Comprar Agora",
    'selectOffer': "Selecione a oferta",
    'copyPromoCode': "Copiar código HTML",
    'unit': "unidade",
    'subtotal': "Subtotal",
    'free': "Grátis",
    'total': "Total",
    'shippingMethod': "Método de envio",
    'freeShipping': "Envio Gratuito",
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
    'orderConfirmed': "Pedido Confirmado!",
    'orderThankYou': "Obrigado pela sua compra. Iremos começar a processar o seu pedido imediatamente.",
    'deliveryStatus': "Estado da Entrega",
    'orderPlaced': "Pedido Realizado",
    'processing': "Processando",
    'estimatedProcess': "Tempo est. de processamento: 1-2 dias",
    'estimatedDelivery': "Entrega est.: 3-5 dias",
    'orderConfirmationEmail': "Um email de confirmação foi enviado para o seu endereço de email.",
    'backToHome': "Voltar à Página Inicial",
    'installments': "Em até {{count}} parcelas de {{value}}",
    'buy3get1': "Compra 3 e Leve 1 Grátis",
    'language': "Idioma",
    'saveAndReturn': "Salvar e Voltar",

    // Learn page translations
    'learn': 'Aprender',
    'topicNotFound': 'Tópico não encontrado',
    'backToPlan': 'Voltar ao Plano',
    'markAsRead': 'Marcar como Lido',
    'topicCompleted': 'Tópico Concluído!',
    'laserTechnology': 'Tecnologia Laser',
    'howItWorksContent': 'O GlucoVista utiliza espectroscopia de infravermelho próximo (NIRS) para medir os níveis de glicose através da sua pele sem tirar sangue. O dispositivo emite um feixe de laser de baixa potência que penetra na pele até uma profundidade de alguns milímetros, onde interage com o fluido intersticial contendo glicose.\n\nAs moléculas de glicose absorvem comprimentos de onda específicos da luz, e o dispositivo mede este padrão de absorção. Algoritmos avançados então analisam este padrão para determinar com precisão seu nível de glicose. Todo este processo leva apenas alguns segundos, fornecendo leituras rápidas e sem dor.',
    'state': 'Estado',
    'level': 'Nível',
    'hypoglycemia': 'Hipoglicemia',
    'normalFasting': 'Normal (jejum)',
    'prediabeticFasting': 'Pré-diabético (jejum)',
    'diabeticFasting': 'Diabético (jejum)',
    'keyGlucoseData': 'Níveis-Chave de Glicose',
    'benefitsContent': 'O GlucoVista oferece benefícios revolucionários em comparação com os métodos tradicionais de monitoramento de glicose. Sem a necessidade de amostras de sangue, tiras de teste ou lancetas, nossa tecnologia torna o monitoramento de glicose verdadeiramente indolor e conveniente.',
    'noPain': 'Sem Dor',
    'instantResults': 'Resultados Instantâneos',
    'costEffective': 'Custo-Benefício',
    'discrete': 'Discreto',
    'comparisonWithTraditional': 'Comparação com Métodos Tradicionais',
    'feature': 'Característica',
    'glucoVista': 'GlucoVista',
    'traditionalMethods': 'Métodos Tradicionais',
    'pain': 'Dor',
    'noPainAtAll': 'Sem dor alguma',
    'painfulPricks': 'Picadas dolorosas',
    'speed': 'Velocidade',
    'resultsInSeconds': 'Resultados em segundos',
    'severalMinutes': 'Vários minutos',
    'consumables': 'Consumíveis',
    'noConsumables': 'Sem consumíveis necessários',
    'expensiveStrips': 'Tiras de teste caras',
    'userTestimonial': 'Testimonio de Usuário',
    'testimonialContent': 'Desde que comecei a usar o GlucoVista, minha vida mudou completamente. Sem mais picadas dolorosas nos dedos, sem mais tiras de teste, e obtenho minhas leituras em segundos. Foi uma mudança radical para gerenciar meu diabetes.',
    'testimonialName': 'Sara J., Usuária há 6 meses',
    'safetyContent': 'A segurança é nossa principal prioridade no GlucoVista. Nossa tecnologia de monitoramento de glicose não invasiva passou por rigorosos testes e ensaios clínicos para garantir que atenda aos mais altos padrões de segurança e precisão.',
    'certifications': 'Certificações',
    'certification1': 'Aprovado pelo FDA para monitoramento de glicose não invasivo',
    'certification2': 'Certificação CE Mark para mercados europeus',
    'certification3': 'ISO 13485 Gestão de Qualidade de Dispositivos Médicos',
    'scientificStudies': 'Estudos Científicos',
    'studiesContent': 'Múltiplos estudos independentes validaram a segurança e eficácia da nossa tecnologia.',
    'clinicalStudyTitle': 'Validação Clínica de Monitoramento de Glicose Não Invasivo',
    'journalReference': 'Revista de Tecnologia para Diabetes, 2023',
    'studyResults': 'Em um estudo com 250 pacientes de diversas demografias, o GlucoVista demonstrou 95,4% de precisão em comparação com medições tradicionais de glicose no sangue, sem eventos adversos relatados.',
    'moreCertificationInfo': 'Mais informações sobre certificações',
    
    // Shopify integration translations
    'shopifyIntegration': 'Integração com Shopify',
    'shopifyIntegrationDescription': 'Conecte sua loja Shopify para sincronizar pedidos',
    'shopifyStoreName': 'Nome da loja',
    'shopifyStoreNameHelp': 'Digite apenas o nome (exemplo: minhaloja)',
    'shopifyAccessToken': 'Token de acesso',
    'shopifyAccessTokenHelp': 'Token de acesso da API do Shopify',
    'connecting': 'Conectando...',
    'connect': 'Conectar',
    'shopifyConnected': 'Conectado ao Shopify',
    'shopifySettings': 'Configurações do Shopify',
    'shopifyHelp1': 'Você precisa criar um token de acesso personalizado no seu painel de administração do Shopify.',
    'shopifyHelp2': 'Os pedidos serão exportados automaticamente para sua loja Shopify.',
    'processing': 'Processando...',
    'shopifyIntegrated': 'Este pedido será exportado para o Shopify',
    'orderError': 'Erro no pedido',
    'orderErrorDesc': 'Ocorreu um erro ao processar seu pedido. Tente novamente.'
  },
  it: {
    'hello': 'Ciao',
    'points': 'Punti',
    'streak': 'Serie',
    'readings': 'Letture',
    'home': 'Home',
    'profile': 'Profilo',
    'howitworks': 'Come Funziona',
    'benefits': 'Vantaggi',
    'safety': 'Sicurezza',
    'achievementUnlocked': 'Traguardo Sbloccato!',
    'deviceOnTheWay': 'Il Tuo Dispositivo è in Arrivo',
    'yourDeviceIsBeingShipped': 'Il tuo dispositivo GlucoVista sta per essere spedito al tuo indirizzo. Per favore, preparati a riceverlo.',
    'ordered': 'Ordinato',
    'shipping': 'In Spedizione',
    'delivered': 'Consegnato',
    'estimatedDelivery': 'Consegna Stimata',
    'completed': 'Completato',
    'inProgress': 'In Corso',
    'pending': 'In Attesa',
    'paymentMethod': 'Metodo di Pagamento',
    'cashOnDelivery': 'Pagamento alla Consegna',
    'whatToExpect': 'Cosa Aspettarsi',
    'courierContact': 'Il corriere ti contatterà prima della consegna.',
    'preparePayment': 'Prepara il pagamento per la consegna.',
    'inspectDevice': 'Ispeziona il dispositivo prima di accettare la consegna.',
    'followSetupInstructions': 'Segui le istruzioni di configurazione in questa app.',
    'connectYourDevice': 'Connetti il Tuo Dispositivo',
    'deviceSerialNumber': 'Numero di Serie del Dispositivo',
    'enterSerialNumber': 'Inserisci il Numero di Serie',
    'turnOnYourDevice': 'Accendi il tuo dispositivo GlucoVista.',
    'enableBluetooth': 'Attiva il Bluetooth sul tuo telefono.',
    'enterSerialAndConnect': 'Inserisci il numero di serie e premi Connetti.',
    'connectDevice': 'Connetti Dispositivo',
    'learnAboutGlucoVista': 'Scopri GlucoVista',
    
    // Onboarding translations
    'welcomeToApp': 'Benvenuto in GlucoVista - La Tua Soluzione di Monitoraggio del Glucosio Non Invasivo',
    'welcome': 'Benvenuto in GlucoVista',
    'step': 'Fase',
    'complete': 'Completo',
    'selectLanguage': 'Seleziona la Tua Lingua',
    'spanish': 'Spagnolo',
    'portuguese': 'Portoghese',
    'italian': 'Italiano',
    'thankYouMessage': 'Grazie per aver scelto il nostro rivoluzionario glucometro non invasivo. Siamo entusiasti di aiutarti a monitorare la tua glicemia senza dolore.',
    'userTestimonial': 'GlucoVista ha completamente cambiato il modo in cui gestisco il mio diabete. Mai più punture alle dita!',
    'testimonialAuthor': 'Giovanni D., Diabete Tipo 2',
    'deviceArrivalMessage': 'Il tuo dispositivo arriverà nelle prossime 24-48 ore. Nel frattempo, iniziamo a configurare tutto!',
    'howItWorks': 'Tecnologia Rivoluzionaria',
    'laserTechnologyIntro': 'Il nostro dispositivo utilizza una tecnologia laser avanzata per misurare i livelli di glucosio senza prelievo di sangue.',
    'laserEmissionTitle': 'Emissione Laser',
    'laserEmissionDesc': 'Un raggio laser a bassa potenza viene diretto sulla tua pelle.',
    'bloodlessAnalysisTitle': 'Analisi Senza Sangue',
    'bloodlessAnalysisDesc': 'La luce riflessa viene analizzata per determinare i livelli di glucosio.',
    'instantReadingTitle': 'Lettura Istantanea',
    'instantReadingDesc': 'I risultati appaiono sulla tua app in pochi secondi.',
    'scientificallyProven': 'Precisione scientificamente provata paragonabile ai metodi tradizionali.',
    'keyBenefits': 'Vantaggi Principali',
    'benefitsIntro': 'Sperimenta i vantaggi del monitoraggio del glucosio non invasivo:',
    'noPainTitle': 'Senza Dolore',
    'noPainDesc': 'Mai più punture alle dita o aghi.',
    'instantResultsTitle': 'Risultati Rapidi',
    'instantResultsDesc': 'Ottieni letture in secondi, in qualsiasi momento.',
    'expertApprovedTitle': 'Approvato dagli Esperti',
    'expertApprovedDesc': 'Sviluppato con endocrinologi leader.',
    'accurateTitle': 'Alta Precisione',
    'accurateDesc': '95%+ di precisione rispetto agli esami del sangue.',
    'yourNewGlucometer': 'Il tuo nuovo dispositivo GlucoVista',
    'setupProfile': 'Configura il Tuo Profilo',
    'profileSetupIntro': 'Aiutaci a personalizzare la tua esperienza fornendo alcune informazioni:',
    'name': 'Nome',
    'enterName': 'Inserisci il tuo nome',
    'age': 'Età',
    'diabetesType': 'Tipo di Diabete',
    'type1': 'Tipo 1',
    'type2': 'Tipo 2',
    'prediabetes': 'Prediabete',
    'gestational': 'Gestazionale',
    'other': 'Altro',
    'profilePrivacyMessage': 'Le tue informazioni sono mantenute private e ci aiutano a ottimizzare la tua esperienza.',
    'readyToStart': 'Pronto per Iniziare!',
    'tutorialDescription': 'Ecco come usare GlucoVista una volta che il tuo dispositivo arriverà:',
    'measureGlucose': 'Misurare Glucosio',
    'measureGlucoseDescription': 'Tieni il dispositivo contro il polso per 5 secondi.',
    'trackProgress': 'Traccia Progressi',
    'trackProgressDescription': 'Visualizza tendenze e approfondimenti nel pannello dell\'app.',
    'earnAchievements': 'Guadagna Traguardi',
    'earnAchievementsDescription': 'Ottieni ricompense per un monitoraggio costante.',
    'back': 'Indietro',
    'next': 'Avanti',
    'skip': 'Salta',
    'getStarted': 'Iniziare',
    
    // Purchase step translations
    'buyYourDevice': 'Acquista il Tuo Dispositivo',
    'paymentOnDeliveryMessage': 'Completa il tuo ordine con pagamento alla consegna',
    'paymentOnDelivery': 'PAGAMENTO ALLA CONSEGNA',
    'finishOrder': 'Finalizza Ordine',
    'deviceDescription': 'Dispositivo di monitoraggio del glucosio non invasivo',
    
    // Checkout related
    'buy': "Acquista",
    'buyNow': "Acquista Ora",
    'selectOffer': "Seleziona un'offerta",
    'copyPromoCode': "Copia codice promozionale",
    'unit': "unità",
    'subtotal': "Subtotale",
    'free': "Gratuita",
    'total': "Totale",
    'shippingMethod': "Metodo di spedizione",
    'freeShipping': "Spedizione gratuita",
    'moneyBackGuarantee': "Garanzia soddisfatti o rimborsati entro {{days}} giorni",
    'secureTransaction': "Transazione sicura",
    'enterShippingAddress': "Inserisci il tuo indirizzo di spedizione",
    'firstName': "Nome",
    'lastName': "Cognome",
    'phone': "Telefono",
    'address': "Indirizzo",
    'province': "Provincia",
    'city': "Città",
    'postalCode': "Codice Postale",
    'orderConfirmed': "Ordine Confermato!",
    'orderThankYou': "Grazie per il tuo acquisto. Inizieremo a elaborare il tuo ordine immediatamente.",
    'deliveryStatus': "Stato della Consegna",
    'orderPlaced': "Ordine Effettuato",
    'processing': "In Elaborazione",
    'estimatedProcess': "Tempo stimato di elaborazione: 1-2 giorni",
    'estimatedDelivery': "Consegna stimata: 3-5 giorni",
    'orderConfirmationEmail': "Un'email di conferma è stata inviata al tuo indirizzo email.",
    'backToHome': "Torna alla Home",
    'installments': "Fino a {{count}} rate di {{value}}",
    'buy3get1': "Compra 3 e Ottieni 1 Gratis",
    'language': "Lingua",
    'saveAndReturn': "Salva e Torna Indietro",
    
    // Learn page translations
    'learn': 'Impara',
    'topicNotFound': 'Argomento non trovato',
    'backToPlan': 'Torna al Piano',
    'markAsRead': 'Segna come Letto',
    'topicCompleted': 'Argomento Completato!',
    'laserTechnology': 'Tecnologia Laser',
    'howItWorksContent': 'GlucoVista utilizza la spettroscopia nel vicino infrarosso (NIRS) per misurare i livelli di glucosio attraverso la pelle senza prelievo di sangue. Il dispositivo emette un raggio laser a bassa potenza che penetra nella pelle fino a una profondità di pochi millimetri, dove interagisce con il fluido interstiziale contenente glucosio.\n\nLe molecole di glucosio assorbono specifiche lunghezze d\'onda della luce, e il dispositivo misura questo schema di assorbimento. Algoritmi avanzati poi analizzano questo schema per determinare accuratamente il tuo livello di glucosio. L\'intero processo richiede solo pochi secondi, fornendoti letture rapide e senza dolore.',
    'state': 'Stato',
    'level': 'Livello',
    'hypoglycemia': 'Ipoglicemia',
    'normalFasting': 'Normale (digiuno)',
    'prediabeticFasting': 'Prediabetico (digiuno)',
    'diabeticFasting': 'Diabetico (digiuno)',
    'keyGlucoseData': 'Livelli Chiave di Glucosio',
    'benefitsContent': 'GlucoVista offre benefici rivoluzionari rispetto ai metodi tradizionali di monitoraggio del glucosio. Senza bisogno di campioni di sangue, strisce reattive o lancette, la nostra tecnologia rende il monitoraggio del glucosio veramente indolore e conveniente.',
    'noPain': 'Senza Dolore',
    'instantResults': 'Risultati Istantanei',
    'costEffective': 'Economico',
    'discrete': 'Discreto',
    'comparisonWithTraditional': 'Confronto con Metodi Tradizionali',
    'feature': 'Caratteristica',
    'glucoVista': 'GlucoVista',
    'traditionalMethods': 'Metodi Tradizionali',
    'pain': 'Dolore',
    'noPainAtAll': 'Nessun dolore',
    'painfulPricks': 'Dolorose punture',
    'speed': 'Velocità',
    'resultsInSeconds': 'Risultati in secondi',
    'severalMinutes': 'Diversi minuti',
    'consumables': 'Materiali di consumo',
    'noConsumables': 'Nessun materiale di consumo',
    'expensiveStrips': 'Costose strisce reattive',
    'userTestimonial': 'Testimonianza Utente',
    'testimonialContent': 'Da quando ho iniziato a usare GlucoVista, la mia vita è completamente cambiata. Non più punture dolorose, non più strisce reattive, e ottengo le mie letture in secondi. È stato un cambiamento radicale per gestire il mio diabete.',
    'testimonialName': 'Sara J., Utente da 6 mesi',
    'safetyContent': 'La sicurezza è la nostra massima priorità in GlucoVista. La nostra tecnologia di monitoraggio del glucosio non invasiva ha subito rigorosi test e trial clinici per garantire che soddisfi i più alti standard di sicurezza e precisione.',
    'certifications': 'Certificazioni',
    'certification1': 'Approvato dalla FDA per il monitoraggio del glucosio non invasivo',
    'certification2': 'Certificazione CE Mark per i mercati europei',
    'certification3': 'ISO 13485 Gestione Qualità dei Dispositivi Medici',
    'scientificStudies': 'Studi Scientifici',
    'studiesContent': 'Molteplici studi indipendenti hanno convalidato la sicurezza e l\'efficacia della nostra tecnologia.',
    'clinicalStudyTitle': 'Convalida Clinica del Monitoraggio del Glucosio Non Invasivo',
    'journalReference': 'Rivista di Tecnologia per il Diabete, 2023',
    'studyResults': 'In uno studio su 250 pazienti di diverse demografiche, GlucoVista ha dimostrato una precisione del 95,4% rispetto alle misurazioni tradizionali della glicemia, senza eventi avversi segnalati.',
    'moreCertificationInfo': 'Maggiori informazioni sulle certificazioni',
    
    // Shopify integration translations
    'shopifyIntegration': 'Integrazione con Shopify',
    'shopifyIntegrationDescription': 'Connetti il tuo negozio Shopify per sincronizzare gli ordini',
    'shopifyStoreName': 'Nome del negozio',
    'shopifyStoreNameHelp': 'Inserisci solo il nome (esempio: mionegozio)',
    'shopifyAccessToken': 'Token di accesso',
    'shopifyAccessTokenHelp': 'Token di accesso API Shopify',
    'connecting': 'Connessione in corso...',
    'connect': 'Connetti',
    'shopifyConnected': 'Connesso a Shopify',
    'shopifySettings': 'Impostazioni Shopify',
    'shopifyHelp1': 'Devi creare un token di accesso personalizzato nel tuo pannello di amministrazione Shopify.',
    'shopifyHelp2': 'Gli ordini verranno esportati automaticamente nel tuo negozio Shopify.',
    'processing': 'Elaborazione in corso...',
    'shopifyIntegrated': 'Questo ordine verrà esportato su Shopify',
    'orderError': 'Errore nell\'ordine',
    'orderErrorDesc': 'Si è verificato un errore durante l\'elaborazione dell\'ordine. Riprova.'
  }
};

// Create the Language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create a provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use browser's preferred language or default to Spanish
  const getBrowserLanguage = (): LanguageCode => {
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === 'es' || browserLang === 'pt' || browserLang === 'it') {
      return browserLang as LanguageCode;
    }
    return 'es'; // Default to Spanish
  };

  // Get saved language from localStorage or use browser language
  const getSavedLanguage = (): LanguageCode => {
    const saved = localStorage.getItem('language');
    if (saved === 'es' || saved === 'pt' || saved === 'it') {
      return saved as LanguageCode;
    }
    return getBrowserLanguage();
  };

  const [language, setLanguageState] = useState<LanguageCode>(getSavedLanguage);

  // Save language preference to localStorage when it changes
  const setLanguage = (newLanguage: LanguageCode) => {
    localStorage.setItem('language', newLanguage);
    setLanguageState(newLanguage);
  };

  // Translation function
  const translate = (key: string, params?: TranslateParams): string => {
    const currentTranslations = translations[language];
    let translation = currentTranslations[key] || key;

    if (params) {
      // Replace parameters in the translation string
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, String(value));
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a hook for easier context usage
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
