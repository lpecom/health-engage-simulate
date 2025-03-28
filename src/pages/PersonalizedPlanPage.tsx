
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Book, Calendar, Award, CheckCircle, Lightbulb, TrendingUp, Clock, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const PersonalizedPlanPage = () => {
  const { translate, language } = useLanguage();
  const { userData, updateUserData, earnPoints } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("plan");
  const { toast } = useToast();
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  
  // Calculate overall progress
  const completedItems = userData.achievements.filter(a => a.unlocked).length;
  const totalItems = userData.achievements.length;
  const overallProgress = Math.round((completedItems / totalItems) * 100);
  
  // Track when the user visits this page
  useEffect(() => {
    // If this is the first time visiting the plan page, give points
    const hasVisitedPlan = localStorage.getItem('visitedPlan');
    if (!hasVisitedPlan) {
      earnPoints(25);
      localStorage.setItem('visitedPlan', 'true');
      toast({
        title: language === 'es' ? '¡25 puntos ganados!' : '25 pontos ganhos!',
        description: language === 'es' 
          ? 'Por explorar tu plan personalizado' 
          : 'Por explorar seu plano personalizado',
        duration: 3000,
      });
    }
  }, []);
  
  // Get educational modules based on diabetes type
  const getEducationalModules = () => {
    if (!userData.diabetesType) return [];
    
    const commonModules = [
      {
        id: "glucose-basics",
        title: language === 'es' ? "Conceptos básicos de glucosa" : "Conceitos básicos de glicose",
        description: language === 'es' 
          ? "Aprenda cómo el azúcar afecta su cuerpo" 
          : "Aprenda como o açúcar afeta seu corpo",
        icon: <Book size={20} />,
        completed: completedModules.includes("glucose-basics"),
        durationMinutes: 2
      }
    ];
    
    const typeSpecificModules = {
      type1: [
        {
          id: "insulin-management",
          title: language === 'es' ? "Manejo de la insulina" : "Gestão de insulina",
          description: language === 'es' 
            ? "Estrategias para una dosificación efectiva" 
            : "Estratégias para uma dosagem eficaz",
          icon: <TrendingUp size={20} />,
          completed: completedModules.includes("insulin-management"),
          durationMinutes: 3
        }
      ],
      type2: [
        {
          id: "insulin-sensitivity",
          title: language === 'es' ? "Mejorando la sensibilidad a la insulina" : "Melhorando a sensibilidade à insulina",
          description: language === 'es' 
            ? "Consejos para que su cuerpo responda mejor" 
            : "Dicas para que seu corpo responda melhor",
          icon: <TrendingUp size={20} />,
          completed: completedModules.includes("insulin-sensitivity"),
          durationMinutes: 2
        }
      ],
      prediabetes: [
        {
          id: "prevent-progression",
          title: language === 'es' ? "Previniendo la progresión" : "Prevenindo a progressão",
          description: language === 'es' 
            ? "Cómo evitar desarrollar diabetes tipo 2" 
            : "Como evitar desenvolver diabetes tipo 2",
          icon: <TrendingUp size={20} />,
          completed: completedModules.includes("prevent-progression"),
          durationMinutes: 2
        }
      ],
      gestational: [
        {
          id: "pregnancy-glucose",
          title: language === 'es' ? "Glucosa durante el embarazo" : "Glicose durante a gravidez",
          description: language === 'es' 
            ? "Manteniendo niveles saludables para usted y su bebé" 
            : "Mantendo níveis saudáveis para você e seu bebê",
          icon: <TrendingUp size={20} />,
          completed: completedModules.includes("pregnancy-glucose"),
          durationMinutes: 3
        }
      ],
      other: [
        {
          id: "general-management",
          title: language === 'es' ? "Manejo general de la diabetes" : "Gerenciamento geral do diabetes",
          description: language === 'es' 
            ? "Principios fundamentales para cualquier tipo" 
            : "Princípios fundamentais para qualquer tipo",
          icon: <TrendingUp size={20} />,
          completed: completedModules.includes("general-management"),
          durationMinutes: 2
        }
      ]
    };
    
    // Add diabetes type-specific modules
    const diabetesType = userData.diabetesType as keyof typeof typeSpecificModules;
    return [...commonModules, ...typeSpecificModules[diabetesType] || []];
  };
  
  const educationalModules = getEducationalModules();
  
  // Get daily tip based on profile
  const getDailyTip = () => {
    if (userData.exerciseFrequency === 'sedentary' || userData.exerciseFrequency === 'light') {
      return language === 'es' 
        ? "Toma una caminata de 10 minutos después de las comidas para ayudar a reducir la glucosa postprandial." 
        : "Faça uma caminhada de 10 minutos após as refeições para ajudar a reduzir a glicose pós-prandial.";
    }
    
    if (userData.dietType === 'regular') {
      return language === 'es'
        ? "Intenta reemplazar una porción de carbohidratos por verduras en tu próxima comida."
        : "Tente substituir uma porção de carboidratos por vegetais em sua próxima refeição.";
    }
    
    // Default tip
    return language === 'es'
      ? "Beber agua regularmente ayuda a mantener niveles óptimos de glucosa en sangre."
      : "Beber água regularmente ajuda a manter níveis ótimos de glicose no sangue.";
  };
  
  // Handle module completion
  const handleCompleteModule = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
      earnPoints(50);
      toast({
        title: language === 'es' ? '¡Módulo completado!' : 'Módulo concluído!',
        description: language === 'es' 
          ? '¡Ganaste 50 puntos por aprender!' 
          : 'Você ganhou 50 pontos por aprender!',
        duration: 3000,
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-accu-tech-lightest px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Personalized greeting with enhanced visuals */}
        <Card className="mb-6 border-accu-tech-blue/20 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-accu-tech-blue to-accu-tech-light-blue"></div>
          <CardHeader>
            <CardTitle>
              {language === 'es' ? '¡Hola' : 'Olá'}, {userData.name || 'Usuario'}!
            </CardTitle>
            <CardDescription>
              {language === 'es' 
                ? `Hemos preparado este plan pensando en ti. ¡Juntos vamos a mejorar tu control de glucosa!` 
                : `Preparamos este plano pensando em você. Juntos vamos melhorar seu controle de glicose!`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-accu-tech-lightest rounded-lg p-4 border border-accu-tech-light-blue/30">
              <div className="flex items-start">
                <Info size={20} className="text-accu-tech-blue mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  {userData.diabetesType && (
                    <p>
                      {language === 'es' 
                        ? `Basado en la información que compartiste, hemos preparado un plan para una persona con diabetes ${
                            userData.diabetesType === 'type1' ? 'Tipo 1' : 
                            userData.diabetesType === 'type2' ? 'Tipo 2' : 
                            userData.diabetesType === 'prediabetes' ? 'Prediabetes' : 
                            userData.diabetesType === 'gestational' ? 'Gestacional' : 'Otro tipo'
                          } en tu rango de edad.`
                        : `Com base nas informações que você compartilhou, preparamos um plano para uma pessoa com diabetes ${
                            userData.diabetesType === 'type1' ? 'Tipo 1' : 
                            userData.diabetesType === 'type2' ? 'Tipo 2' : 
                            userData.diabetesType === 'prediabetes' ? 'Pré-diabetes' : 
                            userData.diabetesType === 'gestational' ? 'Gestacional' : 'Outro tipo'
                          } na sua faixa etária.`
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Enhanced Progress overview with better visual hierarchy */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">
              {language === 'es' ? 'Tu progreso' : 'Seu progresso'}
            </h2>
            <span className="text-sm font-medium text-accu-tech-blue">
              {completedItems}/{totalItems}
            </span>
          </div>
          <Progress value={overallProgress} className="h-2 mb-2 bg-gray-100" />
          <p className="text-sm text-gray-600">
            {language === 'es' 
              ? overallProgress > 0 ? `¡Buen trabajo! Has completado el ${overallProgress}% de tu plan` : 'Comienza tu viaje de salud'
              : overallProgress > 0 ? `Bom trabalho! Você completou ${overallProgress}% do seu plano` : 'Comece sua jornada de saúde'}
          </p>
        </div>
        
        {/* Daily tip with more engaging design */}
        <Card className="mb-6 bg-accu-tech-light-blue/20 border-accu-tech-light-blue shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Lightbulb size={18} className="text-accu-tech-blue mr-2" />
              <CardTitle className="text-base">
                {language === 'es' ? 'Consejo del día' : 'Dica do dia'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{getDailyTip()}</p>
            
            {/* Goal tracker */}
            <div className="mt-4 pt-4 border-t border-accu-tech-blue/10">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <Clock size={14} className="mr-1 text-accu-tech-blue/70" />
                  <span>
                    {language === 'es' ? 'Meta para hoy' : 'Meta para hoje'}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs hover:bg-accu-tech-blue/10 hover:text-accu-tech-blue"
                  onClick={() => {
                    earnPoints(10);
                    toast({
                      title: language === 'es' ? '¡Meta completada!' : 'Meta concluída!',
                      description: language === 'es' ? '+10 puntos' : '+10 pontos',
                      duration: 2000,
                    });
                  }}
                >
                  {language === 'es' ? 'Completar' : 'Concluir'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for Plan and Education with improved styling */}
        <Tabs defaultValue="plan" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 bg-accu-tech-lightest">
            <TabsTrigger value="plan" className="data-[state=active]:bg-accu-tech-blue data-[state=active]:text-white">
              {language === 'es' ? 'Plan de Salud' : 'Plano de Saúde'}
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-accu-tech-blue data-[state=active]:text-white">
              {language === 'es' ? 'Educación' : 'Educação'}
            </TabsTrigger>
          </TabsList>
          
          {/* Plan Tab Content with improved visual hierarchy */}
          <TabsContent value="plan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'es' ? 'Tu plan personalizado' : 'Seu plano personalizado'}
                </CardTitle>
                <CardDescription>
                  {language === 'es' 
                    ? 'Sigue estos pasos para mejorar tu control de glucosa' 
                    : 'Siga estas etapas para melhorar seu controle de glicose'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stage 1 - Active */}
                <div className="border rounded-lg p-4 bg-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accu-tech-blue"></div>
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-accu-tech-blue rounded-full flex items-center justify-center mr-3 text-white">
                      <span className="font-bold">1</span>
                    </div>
                    <h3 className="font-medium">
                      {language === 'es' ? 'Educación y registro diario' : 'Educação e registro diário'}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-11 mb-2">
                    {language === 'es' 
                      ? 'Aprender sobre la diabetes y establecer el hábito de monitoreo' 
                      : 'Aprender sobre diabetes e estabelecer o hábito de monitoramento'}
                  </p>
                  <div className="ml-11">
                    <div className="flex items-center mb-1">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-sm">
                        {language === 'es' ? 'Completar perfil de salud' : 'Completar perfil de saúde'}
                      </span>
                    </div>
                    <div className="flex items-center mb-1">
                      <div className={`w-4 h-4 ${completedModules.length > 0 ? 'bg-green-500 text-white flex items-center justify-center' : 'border rounded-full border-gray-300'}`}>
                        {completedModules.length > 0 && <CheckCircle size={12} />}
                      </div>
                      <span className="text-sm ml-2">
                        {language === 'es' ? 'Leer primer módulo educativo' : 'Ler primeiro módulo educativo'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 border rounded-full mr-2 border-gray-300"></div>
                      <span className="text-sm">
                        {language === 'es' ? 'Registrar primera medición simulada' : 'Registrar primeira medição simulada'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Stage 2 - Next up */}
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold text-gray-500">2</span>
                    </div>
                    <h3 className="font-medium">
                      {language === 'es' ? 'Primera semana con GlucoVista' : 'Primeira semana com GlucoVista'}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-11 mb-2">
                    {language === 'es' 
                      ? 'Configura tu dispositivo y establece una rutina diaria' 
                      : 'Configure seu dispositivo e estabeleça uma rotina diária'}
                  </p>
                  <div className="ml-11 text-gray-600">
                    <div className="flex items-center mb-1">
                      <div className="w-4 h-4 border rounded-full mr-2 border-gray-300"></div>
                      <span className="text-sm">
                        {language === 'es' ? 'Configurar el dispositivo' : 'Configurar o dispositivo'}
                      </span>
                    </div>
                    <div className="flex items-center mb-1">
                      <div className="w-4 h-4 border rounded-full mr-2 border-gray-300"></div>
                      <span className="text-sm">
                        {language === 'es' ? 'Realizar medición matutina por 7 días' : 'Realizar medição matinal por 7 dias'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 border rounded-full mr-2 border-gray-300"></div>
                      <span className="text-sm">
                        {language === 'es' ? 'Obtener insignia de racha de 7 días' : 'Obter emblema de sequência de 7 dias'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Stage 3 - Future */}
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold text-gray-500">3</span>
                    </div>
                    <h3 className="font-medium">
                      {language === 'es' ? 'Revisión mensual de progreso' : 'Revisão mensal de progresso'}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-11 mb-2">
                    {language === 'es' 
                      ? 'Analiza tus datos y ajusta tus hábitos' 
                      : 'Analise seus dados e ajuste seus hábitos'}
                  </p>
                  <div className="ml-11 text-gray-400">
                    <div className="flex items-center mb-1">
                      <div className="w-4 h-4 border rounded-full mr-2 border-gray-300"></div>
                      <span className="text-sm">
                        {language === 'es' ? 'Revisar tendencias mensuales' : 'Revisar tendências mensais'}
                      </span>
                    </div>
                    <div className="flex items-center mb-1">
                      <div className="w-4 h-4 border rounded-full mr-2 border-gray-300"></div>
                      <span className="text-sm">
                        {language === 'es' ? 'Completar todos los módulos educativos' : 'Completar todos os módulos educativos'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 border rounded-full mr-2 border-gray-300"></div>
                      <span className="text-sm">
                        {language === 'es' ? 'Establecer metas para el próximo mes' : 'Estabelecer metas para o próximo mês'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Education Tab Content with interactive modules */}
          <TabsContent value="education" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'es' ? 'Módulos educativos' : 'Módulos educativos'}
                </CardTitle>
                <CardDescription>
                  {language === 'es' 
                    ? 'Aprendizaje personalizado para tu tipo de diabetes' 
                    : 'Aprendizado personalizado para seu tipo de diabetes'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {educationalModules.map((module) => (
                  <Collapsible key={module.id} className="border rounded-lg overflow-hidden bg-white">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${module.completed ? 'bg-green-100' : 'bg-accu-tech-light-blue'}`}>
                          <div className={`${module.completed ? 'text-green-600' : 'text-accu-tech-blue'}`}>
                            {module.completed ? <CheckCircle size={18} /> : module.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium">{module.title}</h3>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock size={12} className="mr-1" />
                            <span>
                              {module.durationMinutes} {language === 'es' ? 'min de lectura' : 'min de leitura'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {module.completed && (
                          <span className="text-xs font-medium text-green-600 mr-2">
                            {language === 'es' ? 'Completado' : 'Concluído'}
                          </span>
                        )}
                        <ChevronDown size={16} />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 pt-0">
                      <div className="pl-8">
                        <p className="text-sm mb-4">{module.description}</p>
                        {!module.completed ? (
                          <Button 
                            className="w-full bg-accu-tech-blue hover:bg-accu-tech-dark-blue"
                            onClick={() => handleCompleteModule(module.id)}
                          >
                            {language === 'es' ? 'Leer ahora' : 'Ler agora'}
                          </Button>
                        ) : (
                          <div className="w-full p-2 bg-green-50 rounded-md border border-green-100 text-center text-sm text-green-600">
                            {language === 'es' ? '¡Módulo completado!' : 'Módulo concluído!'}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
                
                {educationalModules.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    {language === 'es' 
                      ? 'Complete su perfil para ver los módulos educativos personalizados.' 
                      : 'Complete seu perfil para ver os módulos educativos personalizados.'}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/profile')} 
                variant="outline" 
                className="mx-auto"
              >
                {language === 'es' ? 'Actualizar perfil' : 'Atualizar perfil'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/home')}
          >
            {language === 'es' ? 'Volver a inicio' : 'Voltar ao início'}
          </Button>
          
          <Button 
            onClick={() => navigate('/home')}
            className="bg-accu-tech-blue hover:bg-accu-tech-dark-blue"
          >
            {language === 'es' ? 'Ir a medir' : 'Ir para medir'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedPlanPage;
