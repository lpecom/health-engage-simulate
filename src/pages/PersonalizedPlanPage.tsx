
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Book, Calendar, Award, CheckCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

const PersonalizedPlanPage = () => {
  const { translate, language } = useLanguage();
  const { userData } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("plan");
  
  // Calculate overall progress
  const completedItems = userData.achievements.filter(a => a.unlocked).length;
  const totalItems = userData.achievements.length;
  const overallProgress = Math.round((completedItems / totalItems) * 100);
  
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
        completed: false,
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
          completed: false,
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
          completed: false,
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
          completed: false,
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
          completed: false,
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
          completed: false,
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Personalized greeting */}
        <Card className="mb-6">
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
          </CardContent>
        </Card>
        
        {/* Progress overview */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">
            {language === 'es' ? 'Tu progreso' : 'Seu progresso'}
          </h2>
          <Progress value={overallProgress} className="h-2 mb-2" />
          <p className="text-sm text-gray-600">
            {language === 'es' 
              ? `Has completado ${completedItems} de ${totalItems} pasos` 
              : `Você completou ${completedItems} de ${totalItems} etapas`}
          </p>
        </div>
        
        {/* Daily tip */}
        <Card className="mb-6 bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Lightbulb size={18} className="text-blue-500 mr-2" />
              <CardTitle className="text-base">
                {language === 'es' ? 'Consejo del día' : 'Dica do dia'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{getDailyTip()}</p>
          </CardContent>
        </Card>
        
        {/* Tabs for Plan and Education */}
        <Tabs defaultValue="plan" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plan">
              {language === 'es' ? 'Plan de Salud' : 'Plano de Saúde'}
            </TabsTrigger>
            <TabsTrigger value="education">
              {language === 'es' ? 'Educación' : 'Educação'}
            </TabsTrigger>
          </TabsList>
          
          {/* Plan Tab Content */}
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
                {/* Stage 1 */}
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold text-blue-600">1</span>
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
                      <div className="w-4 h-4 border rounded-full mr-2 border-gray-300"></div>
                      <span className="text-sm">
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
                
                {/* Stage 2 */}
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
                  <div className="ml-11 text-gray-400">
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
                
                {/* Stage 3 */}
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
          
          {/* Education Tab Content */}
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
                {educationalModules.map((module, index) => (
                  <Collapsible key={module.id} className="border rounded-lg overflow-hidden">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                      <div className="flex items-center">
                        <div className="mr-3 text-blue-600">
                          {module.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{module.title}</h3>
                          <p className="text-xs text-gray-500">
                            {module.durationMinutes} {language === 'es' ? 'min de lectura' : 'min de leitura'}
                          </p>
                        </div>
                      </div>
                      <ChevronDown size={16} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 pt-0">
                      <div className="pl-8">
                        <p className="text-sm mb-4">{module.description}</p>
                        <Button variant="outline" className="w-full">
                          {language === 'es' ? 'Leer ahora' : 'Ler agora'}
                        </Button>
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
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/home')}
          >
            {language === 'es' ? 'Volver a inicio' : 'Voltar ao início'}
          </Button>
          
          <Button 
            onClick={() => navigate('/home')}
          >
            {language === 'es' ? 'Ir a medir' : 'Ir para medir'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedPlanPage;
