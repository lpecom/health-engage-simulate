
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
    selectLanguage: "Seleccionar idioma",
    spanish: "Español",
    portuguese: "Portugués",
    continue: "Continuar",
    skip: "Omitir",
    next: "Siguiente",
    back: "Atrás",
    getStarted: "Empezar",
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
  },
  pt: {
    welcome: "Bem-vindo ao GlucoVista",
    welcomeSubtitle: "Seu companheiro para monitoramento de glicose sem dor",
    selectLanguage: "Selecionar idioma",
    spanish: "Espanhol",
    portuguese: "Português",
    continue: "Continuar",
    skip: "Pular",
    next: "Próximo",
    back: "Voltar",
    getStarted: "Começar",
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
