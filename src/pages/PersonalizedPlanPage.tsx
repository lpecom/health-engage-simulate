
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Book, Calendar, Award, CheckCircle, Lightbulb, TrendingUp, Clock, Info, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Educational module type definition
interface EducationalModule {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  completed: boolean;
  durationMinutes: number;
  content?: string;
  path?: string;
}

const PersonalizedPlanPage = () => {
  const { translate, language } = useLanguage();
  const { userData, updateUserData, earnPoints } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("plan");
  const { toast } = useToast();
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  
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
  const getEducationalModules = (): EducationalModule[] => {
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
        durationMinutes: 2,
        content: language === 'es' 
          ? "La glucosa es un tipo de azúcar que tu cuerpo utiliza como fuente principal de energía. Cuando comes, tu cuerpo convierte los carbohidratos en glucosa, que entra en el torrente sanguíneo. La insulina, una hormona producida por el páncreas, ayuda a que la glucosa entre en las células para ser utilizada como energía.\n\nEn personas con diabetes, este proceso no funciona correctamente. En la diabetes tipo 1, el cuerpo no produce insulina. En la diabetes tipo 2, el cuerpo no utiliza la insulina de manera eficiente o no produce suficiente. Esto causa que la glucosa se acumule en la sangre en lugar de ser utilizada por las células.\n\nLos niveles normales de glucosa en sangre en ayunas suelen estar entre 70-100 mg/dL. Después de comer, es normal que suban temporalmente, pero no deberían exceder los 140 mg/dL. Niveles constantemente elevados pueden dañar vasos sanguíneos y nervios con el tiempo."
          : "A glicose é um tipo de açúcar que seu corpo usa como principal fonte de energia. Quando você come, seu corpo converte carboidratos em glicose, que entra na corrente sanguínea. A insulina, um hormônio produzido pelo pâncreas, ajuda a glicose a entrar nas células para ser usada como energia.\n\nEm pessoas com diabetes, este processo não funciona corretamente. No diabetes tipo 1, o corpo não produz insulina. No diabetes tipo 2, o corpo não usa a insulina de maneira eficiente ou não produz o suficiente. Isso faz com que a glicose se acumule no sangue em vez de ser usada pelas células.\n\nOs níveis normais de glicose no sangue em jejum geralmente estão entre 70-100 mg/dL. Após comer, é normal que subam temporariamente, mas não devem exceder 140 mg/dL. Níveis constantemente elevados podem danificar vasos sanguíneos e nervos ao longo do tempo.",
        path: "how-it-works"
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
          durationMinutes: 3,
          content: language === 'es' 
            ? "El manejo efectivo de la insulina es fundamental para las personas con diabetes tipo 1. La insulina es una hormona que permite que la glucosa en tu sangre entre en las células de tu cuerpo, donde se utiliza como energía.\n\nTipos de insulina:\n• Insulina de acción rápida: comienza a funcionar en 15 minutos, alcanza su punto máximo en 1 hora y dura 2-4 horas.\n• Insulina regular (acción corta): comienza a funcionar en 30 minutos, alcanza su punto máximo en 2-3 horas y dura 3-6 horas.\n• Insulina de acción intermedia: comienza a funcionar en 2-4 horas, alcanza su punto máximo en 4-12 horas y dura 12-18 horas.\n• Insulina de acción prolongada: comienza a funcionar varias horas después de la inyección y dura hasta 24 horas.\n\nConsejos para la dosificación:\n• Mantén un registro de tus niveles de glucosa en sangre.\n• Aprende a contar los carbohidratos que consumes.\n• Ajusta tu dosis según tu actividad física, estrés y enfermedades.\n• Consulta regularmente con tu médico para ajustar tu esquema de tratamiento."
            : "O gerenciamento eficaz da insulina é fundamental para pessoas com diabetes tipo 1. A insulina é um hormônio que permite que a glicose no seu sangue entre nas células do seu corpo, onde é usada como energia.\n\nTipos de insulina:\n• Insulina de ação rápida: começa a funcionar em 15 minutos, atinge seu pico em 1 hora e dura 2-4 horas.\n• Insulina regular (ação curta): começa a funcionar em 30 minutos, atinge seu pico em 2-3 horas e dura 3-6 horas.\n• Insulina de ação intermediária: começa a funcionar em 2-4 horas, atinge seu pico em 4-12 horas e dura 12-18 horas.\n• Insulina de ação prolongada: começa a funcionar várias horas após a injeção e dura até 24 horas.\n\nDicas para dosagem:\n• Mantenha um registro dos seus níveis de glicose no sangue.\n• Aprenda a contar os carboidratos que você consome.\n• Ajuste sua dose de acordo com sua atividade física, estresse e doenças.\n• Consulte regularmente seu médico para ajustar seu esquema de tratamento.",
          path: "benefits"
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
          durationMinutes: 2,
          content: language === 'es'
            ? "La resistencia a la insulina ocurre cuando las células del cuerpo no responden correctamente a la insulina, lo que dificulta que la glucosa entre en las células. Esto obliga al páncreas a producir más insulina para compensar.\n\nAcciones clave para mejorar la sensibilidad a la insulina:\n\n1. Actividad física regular: El ejercicio ayuda a las células a responder mejor a la insulina. Incluso 30 minutos diarios de caminata pueden marcar la diferencia.\n\n2. Alimentación equilibrada: Consume alimentos con bajo índice glucémico, ricos en fibra y proteínas magras. Limita los carbohidratos refinados y los azúcares añadidos.\n\n3. Pérdida de peso: Perder entre un 5-10% del peso corporal puede mejorar significativamente la sensibilidad a la insulina.\n\n4. Manejo del estrés: El estrés crónico puede aumentar la resistencia a la insulina. Técnicas como la meditación, el yoga o la respiración profunda pueden ayudar.\n\n5. Sueño adecuado: Dormir 7-8 horas por noche ayuda a mantener el equilibrio hormonal que afecta la sensibilidad a la insulina."
            : "A resistência à insulina ocorre quando as células do corpo não respondem adequadamente à insulina, dificultando a entrada de glicose nas células. Isso força o pâncreas a produzir mais insulina para compensar.\n\nAções-chave para melhorar a sensibilidade à insulina:\n\n1. Atividade física regular: O exercício ajuda as células a responderem melhor à insulina. Mesmo 30 minutos diários de caminhada podem fazer a diferença.\n\n2. Alimentação equilibrada: Consuma alimentos com baixo índice glicêmico, ricos em fibras e proteínas magras. Limite os carboidratos refinados e açúcares adicionados.\n\n3. Perda de peso: Perder entre 5-10% do peso corporal pode melhorar significativamente a sensibilidade à insulina.\n\n4. Gerenciamento do estresse: O estresse crônico pode aumentar a resistência à insulina. Técnicas como meditação, yoga ou respiração profunda podem ajudar.\n\n5. Sono adequado: Dormir 7-8 horas por noite ajuda a manter o equilíbrio hormonal que afeta a sensibilidade à insulina.",
          path: "safety"
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
          durationMinutes: 2,
          content: language === 'es'
            ? "La prediabetes significa que tus niveles de azúcar en sangre están más altos de lo normal, pero no lo suficientemente altos para ser diagnosticados como diabetes tipo 2. Es una señal de advertencia importante, pero la buena noticia es que la progresión a diabetes tipo 2 no es inevitable.\n\nEstudios han demostrado que las personas con prediabetes pueden reducir su riesgo de desarrollar diabetes tipo 2 en un 58% realizando cambios moderados en el estilo de vida.\n\nAcciones efectivas para prevenir la progresión:\n\n1. Pérdida de peso moderada: Perder aproximadamente 7% del peso corporal (para una persona de 180 libras, eso es alrededor de 13 libras).\n\n2. Actividad física regular: Al menos 150 minutos por semana de actividad moderada como caminar rápido.\n\n3. Alimentación saludable: Reducir la ingesta de carbohidratos refinados y azúcares, aumentar el consumo de verduras, proteínas magras y grasas saludables.\n\n4. Monitoreo regular: Revisar tus niveles de glucosa periódicamente y mantener citas regulares con tu médico.\n\n5. Evitar el tabaco: Fumar aumenta el riesgo de resistencia a la insulina y diabetes."
            : "Pré-diabetes significa que seus níveis de açúcar no sangue estão mais altos que o normal, mas não altos o suficiente para serem diagnosticados como diabetes tipo 2. É um sinal de alerta importante, mas a boa notícia é que a progressão para diabetes tipo 2 não é inevitável.\n\nEstudos demonstraram que pessoas com pré-diabetes podem reduzir seu risco de desenvolver diabetes tipo 2 em 58% fazendo mudanças moderadas no estilo de vida.\n\nAções efetivas para prevenir a progressão:\n\n1. Perda de peso moderada: Perder aproximadamente 7% do peso corporal (para uma pessoa de 80 kg, isso é cerca de 5,6 kg).\n\n2. Atividade física regular: Pelo menos 150 minutos por semana de atividade moderada como caminhada rápida.\n\n3. Alimentação saudável: Reduzir a ingestão de carboidratos refinados e açúcares, aumentar o consumo de vegetais, proteínas magras e gorduras saudáveis.\n\n4. Monitoramento regular: Verificar seus níveis de glicose periodicamente e manter consultas regulares com seu médico.\n\n5. Evitar o tabaco: Fumar aumenta o risco de resistência à insulina e diabetes.",
          path: "how-it-works"
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
          durationMinutes: 3,
          content: language === 'es'
            ? "La diabetes gestacional afecta aproximadamente al 2-10% de los embarazos y generalmente se desarrolla durante el segundo o tercer trimestre. Ocurre cuando el cuerpo no puede producir suficiente insulina para compensar la resistencia natural a la insulina que ocurre durante el embarazo.\n\nImportancia del control de la glucosa durante el embarazo:\n• Reduce el riesgo de complicaciones para ti y tu bebé\n• Disminuye la probabilidad de un parto por cesárea\n• Ayuda a mantener un peso saludable para el bebé\n• Previene problemas con la glucemia del bebé después del nacimiento\n\nObjetivos recomendados para niveles de glucosa en la diabetes gestacional:\n• En ayunas: 95 mg/dL o menos\n• 1 hora después de las comidas: 140 mg/dL o menos\n• 2 horas después de las comidas: 120 mg/dL o menos\n\nEstrategias para mantener niveles saludables:\n1. Sigue un plan de alimentación desarrollado por tu equipo médico\n2. Realiza actividad física moderada según las recomendaciones de tu médico\n3. Monitorea tus niveles de glucosa regularmente\n4. Toma medicamentos si son recetados por tu médico\n\nRecuerda: La diabetes gestacional generalmente desaparece después del parto, pero las mujeres que la han tenido tienen mayor riesgo de desarrollar diabetes tipo 2 más adelante."
            : "O diabetes gestacional afeta aproximadamente 2-10% das gravidezes e geralmente se desenvolve durante o segundo ou terceiro trimestre. Ocorre quando o corpo não consegue produzir insulina suficiente para compensar a resistência natural à insulina que ocorre durante a gravidez.\n\nImportância do controle da glicose durante a gravidez:\n• Reduz o risco de complicações para você e seu bebê\n• Diminui a probabilidade de um parto por cesariana\n• Ajuda a manter um peso saudável para o bebê\n• Previne problemas com a glicemia do bebê após o nascimento\n\nObjetivos recomendados para níveis de glicose no diabetes gestacional:\n• Em jejum: 95 mg/dL ou menos\n• 1 hora após as refeições: 140 mg/dL ou menos\n• 2 horas após as refeições: 120 mg/dL ou menos\n\nEstratégias para manter níveis saudáveis:\n1. Siga um plano alimentar desenvolvido pela sua equipe médica\n2. Realize atividade física moderada conforme recomendações do seu médico\n3. Monitore seus níveis de glicose regularmente\n4. Tome medicamentos se forem prescritos pelo seu médico\n\nLembre-se: O diabetes gestacional geralmente desaparece após o parto, mas mulheres que tiveram diabetes gestacional têm maior risco de desenvolver diabetes tipo 2 mais tarde.",
          path: "benefits"
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
          durationMinutes: 2,
          content: language === 'es'
            ? "Independientemente del tipo específico de diabetes, existen principios fundamentales que pueden ayudar a todos los pacientes a manejar mejor su condición.\n\nPilares del manejo efectivo de la diabetes:\n\n1. Monitoreo regular: Comprobar los niveles de glucosa según las recomendaciones de tu médico. La tecnología moderna como GlucoVista facilita este proceso y proporciona datos valiosos sobre patrones y tendencias.\n\n2. Alimentación balanceada: Una dieta que controle los carbohidratos, enfatice las proteínas magras, grasas saludables y fibra. La planificación de comidas puede adaptarse a preferencias culturales y personales.\n\n3. Actividad física regular: El ejercicio mejora la sensibilidad a la insulina y ayuda a mantener un peso saludable. Incluso actividades de baja intensidad como caminar pueden ser beneficiosas.\n\n4. Medicación adecuada: Tomar los medicamentos recetados según las indicaciones. Esto puede incluir insulina, medicamentos orales, u otros tratamientos según el tipo de diabetes.\n\n5. Educación continua: Mantenerse informado sobre la diabetes y las nuevas opciones de tratamiento. La educación empodera a las personas para tomar mejores decisiones sobre su salud.\n\n6. Apoyo emocional: Reconocer que la diabetes puede tener un impacto psicológico. Buscar apoyo de familiares, amigos o grupos de apoyo puede ser valioso."
            : "Independentemente do tipo específico de diabetes, existem princípios fundamentais que podem ajudar todos os pacientes a gerenciar melhor sua condição.\n\nPilares do gerenciamento efetivo do diabetes:\n\n1. Monitoramento regular: Verificar os níveis de glicose de acordo com as recomendações do seu médico. A tecnologia moderna como GlucoVista facilita este processo e fornece dados valiosos sobre padrões e tendências.\n\n2. Alimentação balanceada: Uma dieta que controle os carboidratos, enfatize proteínas magras, gorduras saudáveis e fibras. O planejamento de refeições pode ser adaptado às preferências culturais e pessoais.\n\n3. Atividade física regular: O exercício melhora a sensibilidade à insulina e ajuda a manter um peso saudável. Mesmo atividades de baixa intensidade como caminhar podem ser benéficas.\n\n4. Medicação adequada: Tomar os medicamentos prescritos conforme as indicações. Isso pode incluir insulina, medicamentos orais ou outros tratamentos dependendo do tipo de diabetes.\n\n5. Educação contínua: Manter-se informado sobre diabetes e novas opções de tratamento. A educação capacita as pessoas a tomarem melhores decisões sobre sua saúde.\n\n6. Apoio emocional: Reconhecer que o diabetes pode ter um impacto psicológico. Buscar apoio de familiares, amigos ou grupos de apoio pode ser valioso.",
          path: "safety"
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
  
  // Navigate to learn topic page
  const navigateToLearnTopic = (path: string) => {
    navigate(`/learn/${path}`);
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
                  <Collapsible 
                    key={module.id} 
                    className="border rounded-lg overflow-hidden bg-white" 
                    open={expandedModule === module.id}
                    onOpenChange={(isOpen) => {
                      setExpandedModule(isOpen ? module.id : null);
                    }}
                  >
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
                      <div className="pl-8 pr-2">
                        <p className="text-sm mb-4">{module.description}</p>
                        
                        {expandedModule === module.id && module.content && (
                          <div className="mb-4 bg-gray-50 p-3 rounded-lg text-sm text-gray-700 whitespace-pre-line">
                            {module.content}
                          </div>
                        )}
                        
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                          {!module.completed ? (
                            <Button 
                              className="w-full bg-accu-tech-blue hover:bg-accu-tech-dark-blue"
                              onClick={() => handleCompleteModule(module.id)}
                            >
                              {language === 'es' ? 'Marcar como leído' : 'Marcar como lido'}
                            </Button>
                          ) : (
                            <div className="w-full p-2 bg-green-50 rounded-md border border-green-100 text-center text-sm text-green-600">
                              {language === 'es' ? '¡Módulo completado!' : 'Módulo concluído!'}
                            </div>
                          )}
                          
                          {module.path && (
                            <Button 
                              variant="outline" 
                              className="flex items-center w-full" 
                              onClick={() => navigateToLearnTopic(module.path)}
                            >
                              <span className="mr-1">
                                {language === 'es' ? 'Más información' : 'Mais informações'}
                              </span>
                              <ExternalLink size={14} />
                            </Button>
                          )}
                        </div>
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
