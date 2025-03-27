
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'pt';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string) => string;
};

const translations = {
  es: {
    welcome: "Bienvenido a GlucoVista",
    welcomeSubtitle: "Tu compañero para el control de la glucosa sin dolor",
    welcomeToApp: "La nueva era del control de la diabetes",
    thankYouMessage: "¡Gracias por tu compra! Estamos preparando tu dispositivo",
    userTestimonial: "Por fin puedo medir mi glucosa sin pincharme los dedos. ¡Es increíble!",
    testimonialAuthor: "María G., usuario de GlucoVista",
    deviceArrivalMessage: "Mientras esperas la llegada de tu GlucoVista, exploremos la aplicación",
    selectLanguage: "Seleccionar idioma",
    spanish: "Español",
    portuguese: "Portugués",
    continue: "Continuar",
    skip: "Omitir",
    next: "Siguiente",
    back: "Atrás",
    getStarted: "Empezar",
    howItWorks: "¿Cómo funciona?",
    laserTechnologyIntro: "Nuestra tecnología láser revolucionaria mide tu glucosa sin dolor",
    laserEmissionTitle: "Emisión de láser",
    laserEmissionDesc: "Un láser infrarrojo seguro penetra ligeramente en la piel",
    bloodlessAnalysisTitle: "Análisis sin sangre",
    bloodlessAnalysisDesc: "La luz reflejada analiza las moléculas de glucosa",
    instantReadingTitle: "Lectura instantánea",
    instantReadingDesc: "El dispositivo calcula tu nivel de glucosa en segundos",
    scientificallyProven: "Tecnología respaldada por investigación científica avanzada",
    keyBenefits: "Beneficios principales",
    benefitsIntro: "Descubre por qué GlucoVista transformará tu vida",
    noPainTitle: "Sin dolor",
    noPainDesc: "Olvídate de los pinchazos diarios",
    instantResultsTitle: "Resultados inmediatos",
    instantResultsDesc: "Lecturas en tiempo real",
    expertApprovedTitle: "Aprobado por expertos",
    expertApprovedDesc: "Validado clínicamente",
    accurateTitle: "Preciso",
    accurateDesc: "Mediciones confiables",
    yourNewGlucometer: "Tu nuevo glucómetro",
    step: "Paso",
    complete: "completado",
    profileSetupIntro: "Personaliza tu experiencia para mejores resultados",
    home: "Inicio",
    profile: "Perfil",
    learn: "Aprender",
    progress: "Progreso",
    measure: "Medir",
    readyToMeasure: "Listo para medir",
    takeMeasurement: "Tomar medida",
    measuringInProgress: "Midiendo...",
    measurementComplete: "¡Medición completada!",
    yourReading: "Tu lectura",
    mgdl: "mg/dL",
    inRange: "Dentro del rango",
    highAlert: "Alerta alta",
    lowAlert: "Alerta baja",
    trending: "Tendencia",
    trendingUp: "Subiendo",
    trendingDown: "Bajando",
    stable: "Estable",
    lastReading: "Última lectura",
    points: "Puntos",
    streak: "Racha",
    achievements: "Logros",
    howitworks: "Cómo funciona",
    laserTechnology: "Tecnología láser",
    benefits: "Beneficios",
    safety: "Seguridad",
    name: "Nombre",
    age: "Edad",
    diabetesType: "Tipo de diabetes",
    targetRange: "Rango objetivo",
    saveProfile: "Guardar perfil",
    enterName: "Introduce tu nombre",
    type1: "Tipo 1",
    type2: "Tipo 2",
    prediabetes: "Prediabetes",
    gestational: "Gestacional",
    other: "Otro",
    targetRangeDescription: "Rango objetivo de glucosa (mg/dL)",
    howItWorksContent: "GlucoVista utiliza tecnología láser avanzada para medir los niveles de glucosa a través de la piel sin necesidad de pinchazos. El láser penetra en la piel y analiza la concentración de glucosa en la sangre de forma no invasiva.",
    benefitsContent: "- Sin dolor ni molestias\n- Sin consumibles costosos\n- Resultados inmediatos\n- Seguimiento continuo\n- Discreto y conveniente",
    safetyContent: "La tecnología láser de GlucoVista utiliza un láser de baja potencia que es completamente seguro para la piel. El dispositivo ha pasado rigurosas pruebas de seguridad y cumple con todos los estándares médicos internacionales.",
    firstMeasurement: "¡Primera medición!",
    threeDay: "¡Racha de 3 días!",
    sevenDay: "¡Racha de 7 días!",
    profileComplete: "Perfil completo",
    learnExpert: "Experto en aprendizaje",
    readyToStart: "¿Listo para comenzar?",
    tutorialDescription: "Comencemos a explorar todo lo que puedes hacer",
    measureGlucose: "Mide tu glucosa",
    measureGlucoseDescription: "Simula mediciones y prepárate para usar tu dispositivo",
    trackProgress: "Seguimiento de progreso",
    trackProgressDescription: "Visualiza tus lecturas y tendencias a lo largo del tiempo",
    earnAchievements: "Gana logros",
    earnAchievementsDescription: "Completa desafíos y mantén tu motivación",
    setupProfile: "Configura tu perfil",
    profilePrivacyMessage: "Tu información se mantiene privada y segura. La usamos para personalizar tu experiencia.",
  },
  pt: {
    welcome: "Bem-vindo ao GlucoVista",
    welcomeSubtitle: "Seu companheiro para monitoramento de glicose sem dor",
    welcomeToApp: "A nova era do controle do diabetes",
    thankYouMessage: "Obrigado pela sua compra! Estamos preparando seu dispositivo",
    userTestimonial: "Finalmente posso medir minha glicose sem furar os dedos. É incrível!",
    testimonialAuthor: "João M., usuário GlucoVista",
    deviceArrivalMessage: "Enquanto você espera a chegada do seu GlucoVista, vamos explorar o aplicativo",
    selectLanguage: "Selecionar idioma",
    spanish: "Espanhol",
    portuguese: "Português",
    continue: "Continuar",
    skip: "Pular",
    next: "Próximo",
    back: "Voltar",
    getStarted: "Começar",
    howItWorks: "Como funciona?",
    laserTechnologyIntro: "Nossa revolucionária tecnologia a laser mede sua glicose sem dor",
    laserEmissionTitle: "Emissão do laser",
    laserEmissionDesc: "Um laser infravermelho seguro penetra levemente na pele",
    bloodlessAnalysisTitle: "Análise sem sangue",
    bloodlessAnalysisDesc: "A luz refletida analisa as moléculas de glicose",
    instantReadingTitle: "Leitura instantânea",
    instantReadingDesc: "O dispositivo calcula seu nível de glicose em segundos",
    scientificallyProven: "Tecnologia respaldada por pesquisas científicas avançadas",
    keyBenefits: "Principais benefícios",
    benefitsIntro: "Descubra por que o GlucoVista vai transformar sua vida",
    noPainTitle: "Sem dor",
    noPainDesc: "Esqueça as picadas diárias",
    instantResultsTitle: "Resultados imediatos",
    instantResultsDesc: "Leituras em tempo real",
    expertApprovedTitle: "Aprovado por especialistas",
    expertApprovedDesc: "Validado clinicamente",
    accurateTitle: "Preciso",
    accurateDesc: "Medições confiáveis",
    yourNewGlucometer: "Seu novo glicosímetro",
    step: "Passo",
    complete: "concluído",
    profileSetupIntro: "Personalize sua experiência para melhores resultados",
    home: "Início",
    profile: "Perfil",
    learn: "Aprender",
    progress: "Progresso",
    measure: "Medir",
    readyToMeasure: "Pronto para medir",
    takeMeasurement: "Fazer medição",
    measuringInProgress: "Medindo...",
    measurementComplete: "Medição completa!",
    yourReading: "Sua leitura",
    mgdl: "mg/dL",
    inRange: "Dentro da faixa",
    highAlert: "Alerta alto",
    lowAlert: "Alerta baixo",
    trending: "Tendência",
    trendingUp: "Subindo",
    trendingDown: "Descendo",
    stable: "Estável",
    lastReading: "Última leitura",
    points: "Pontos",
    streak: "Sequência",
    achievements: "Conquistas",
    howitworks: "Como funciona",
    laserTechnology: "Tecnologia laser",
    benefits: "Benefícios",
    safety: "Segurança",
    name: "Nome",
    age: "Idade",
    diabetesType: "Tipo de diabetes",
    targetRange: "Faixa alvo",
    saveProfile: "Salvar perfil",
    enterName: "Digite seu nome",
    type1: "Tipo 1",
    type2: "Tipo 2",
    prediabetes: "Pré-diabetes",
    gestational: "Gestacional",
    other: "Outro",
    targetRangeDescription: "Faixa alvo de glicose (mg/dL)",
    howItWorksContent: "O GlucoVista usa tecnologia laser avançada para medir os níveis de glicose através da pele sem a necessidade de picadas. O laser penetra na pele e analisa a concentração de glicose no sangue de forma não invasiva.",
    benefitsContent: "- Sem dor ou desconforto\n- Sem consumíveis caros\n- Resultados imediatos\n- Monitoramento contínuo\n- Discreto e conveniente",
    safetyContent: "A tecnologia laser GlucoVista usa um laser de baixa potência que é completamente seguro para a pele. O dispositivo passou por testes rigorosos de segurança e atende a todos os padrões médicos internacionais.",
    firstMeasurement: "Primeira medição!",
    threeDay: "Sequência de 3 dias!",
    sevenDay: "Sequência de 7 dias!",
    profileComplete: "Perfil completo",
    learnExpert: "Especialista em aprendizado",
    readyToStart: "Pronto para começar?",
    tutorialDescription: "Vamos começar a explorar tudo o que você pode fazer",
    measureGlucose: "Meça sua glicose",
    measureGlucoseDescription: "Simule medições e prepare-se para usar seu dispositivo",
    trackProgress: "Acompanhe seu progresso",
    trackProgressDescription: "Visualize suas leituras e tendências ao longo do tempo",
    earnAchievements: "Ganhe conquistas",
    earnAchievementsDescription: "Complete desafios e mantenha sua motivação",
    setupProfile: "Configure seu perfil",
    profilePrivacyMessage: "Suas informações são mantidas privadas e seguras. Utilizamos para personalizar sua experiência.",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    // Try to get saved language preference from local storage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'pt')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const translate = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
