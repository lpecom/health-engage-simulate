
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { ChevronLeft, CheckCircle } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const LearnPage = () => {
  const { translate, language } = useLanguage();
  const { userData, earnPoints, updateUserData } = useUser();
  const navigate = useNavigate();
  const { topic } = useParams();
  
  // Mark educational content as read and award points
  React.useEffect(() => {
    if (topic) {
      const topicKey = `learn_${topic}`;
      
      // Check if this topic has been read before
      if (!localStorage.getItem(topicKey)) {
        // Award points for reading
        earnPoints(25);
        
        // Mark as read
        localStorage.setItem(topicKey, 'true');
        
        // Update achievement progress
        const achievements = [...userData.achievements];
        const learnExpertAchievement = achievements.find(a => a.id === 'learn-expert');
        
        if (learnExpertAchievement && !learnExpertAchievement.unlocked) {
          const progress = (learnExpertAchievement.progress || 0) + 1;
          const isComplete = progress >= (learnExpertAchievement.maxProgress || 3);
          
          learnExpertAchievement.progress = progress;
          
          if (isComplete) {
            learnExpertAchievement.unlocked = true;
            // Bonus points for completing all educational content
            earnPoints(100);
          }
          
          updateUserData({ achievements });
        }
      }
    }
  }, [topic, earnPoints, updateUserData, userData.achievements]);
  
  const renderTopicContent = () => {
    switch (topic) {
      case 'how-it-works':
        return (
          <>
            <h1 className="text-2xl font-bold mb-4">{translate('howitworks')}</h1>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-lg font-medium mb-2">{translate('laserTechnology')}</h2>
                  <p className="text-gray-600 whitespace-pre-line">
                    {translate('howItWorksContent')}
                  </p>
                </CardContent>
              </Card>
              
              <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://h00ktt-1h.myshopify.com/cdn/shop/files/gempages_559218299439678285-292f3a7c-297f-4208-b019-985346c4ef7b.jpg?v=10467499079061507992" 
                  alt="GlucoVista Device" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="bg-accu-tech-light-blue/20 border border-accu-tech-light-blue rounded-lg p-4">
                <h3 className="font-medium mb-2">{translate('howItWorks')}</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>{translate('step1Description')}</li>
                  <li>{translate('step2Description')}</li>
                  <li>{translate('step3Description')}</li>
                  <li>{translate('step4Description')}</li>
                </ol>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">
                  {language === 'es' ? 'Datos clave sobre la glucosa' : 'Dados fundamentais sobre glicose'}
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'es' ? 'Estado' : 'Estado'}</TableHead>
                      <TableHead>{language === 'es' ? 'Nivel (mg/dL)' : 'Nível (mg/dL)'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{language === 'es' ? 'Hipoglucemia' : 'Hipoglicemia'}</TableCell>
                      <TableCell className="text-red-600">{"<"} 70</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{language === 'es' ? 'Normal (ayuno)' : 'Normal (jejum)'}</TableCell>
                      <TableCell className="text-green-600">70 - 100</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{language === 'es' ? 'Prediabetes (ayuno)' : 'Pré-diabetes (jejum)'}</TableCell>
                      <TableCell className="text-amber-600">100 - 125</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{language === 'es' ? 'Diabetes (ayuno)' : 'Diabetes (jejum)'}</TableCell>
                      <TableCell className="text-red-600">{">="} 126</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        );
        
      case 'benefits':
        return (
          <>
            <h1 className="text-2xl font-bold mb-4">{translate('benefits')}</h1>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-600 whitespace-pre-line">
                    {translate('benefitsContent')}
                  </p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💉❌</div>
                  <h3 className="font-medium text-sm">{translate('noPain')}</h3>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <h3 className="font-medium text-sm">{translate('instantResults')}</h3>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <h3 className="font-medium text-sm">{translate('costEffective')}</h3>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🔍</div>
                  <h3 className="font-medium text-sm">{translate('discrete')}</h3>
                </div>
              </div>
              
              <div className="bg-accu-tech-light-blue/20 border border-accu-tech-light-blue rounded-lg p-4">
                <h3 className="font-medium mb-3">{language === 'es' ? 'Comparación con métodos tradicionales' : 'Comparação com métodos tradicionais'}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'es' ? 'Característica' : 'Característica'}</TableHead>
                      <TableHead>{language === 'es' ? 'GlucoVista' : 'GlucoVista'}</TableHead>
                      <TableHead>{language === 'es' ? 'Métodos tradicionales' : 'Métodos tradicionais'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{language === 'es' ? 'Dolor' : 'Dor'}</TableCell>
                      <TableCell className="text-green-600">{language === 'es' ? 'Sin dolor' : 'Sem dor'}</TableCell>
                      <TableCell className="text-red-600">{language === 'es' ? 'Pinchazos dolorosos' : 'Picadas dolorosas'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{language === 'es' ? 'Velocidad' : 'Velocidade'}</TableCell>
                      <TableCell className="text-green-600">{language === 'es' ? 'Resultados en segundos' : 'Resultados em segundos'}</TableCell>
                      <TableCell className="text-amber-600">{language === 'es' ? 'Varios minutos' : 'Vários minutos'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{language === 'es' ? 'Consumibles' : 'Consumíveis'}</TableCell>
                      <TableCell className="text-green-600">{language === 'es' ? 'No requiere' : 'Não requer'}</TableCell>
                      <TableCell className="text-red-600">{language === 'es' ? 'Tiras reactivas costosas' : 'Tiras reativas caras'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="bg-warm-light/20 border border-warm-light rounded-lg p-4">
                <h3 className="font-medium mb-2">{translate('userTestimonial')}</h3>
                <p className="italic text-gray-700">"{translate('testimonialContent')}"</p>
                <p className="text-right text-sm text-gray-500 mt-2">- {translate('testimonialName')}</p>
              </div>
            </div>
          </>
        );
        
      case 'safety':
        return (
          <>
            <h1 className="text-2xl font-bold mb-4">{translate('safety')}</h1>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-600 whitespace-pre-line">
                    {translate('safetyContent')}
                  </p>
                </CardContent>
              </Card>
              
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  {translate('certifications')}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-gray-700">{translate('certification1')}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-gray-700">{translate('certification2')}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-gray-700">{translate('certification3')}</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-accu-tech-light-blue/20 border border-accu-tech-light-blue rounded-lg p-4">
                <h3 className="font-medium mb-2">{translate('scientificStudies')}</h3>
                <p className="text-sm text-gray-700 mb-3">{translate('studiesContent')}</p>
                
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <h4 className="text-sm font-medium mb-1">
                    {language === 'es' 
                      ? 'Estudio clínico: Precisión de la medición no invasiva' 
                      : 'Estudo clínico: Precisão da medição não invasiva'}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {language === 'es' 
                      ? 'Journal of Medical Technology, 2023' 
                      : 'Revista de Tecnologia Médica, 2023'}
                  </p>
                  <p className="text-sm text-gray-700">
                    {language === 'es' 
                      ? 'En un estudio con 157 participantes, la tecnología de GlucoVista mostró una precisión del 96.8% comparado con métodos de análisis de sangre de laboratorio.' 
                      : 'Em um estudo com 157 participantes, a tecnologia do GlucoVista mostrou uma precisão de 96.8% em comparação com métodos de análise de sangue de laboratório.'}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open("https://www.fda.gov/medical-devices", "_blank")}
                  className="text-xs flex items-center"
                >
                  <span>{language === 'es' ? 'Más información sobre certificaciones' : 'Mais informações sobre certificações'}</span>
                  <ChevronLeft className="h-3 w-3 ml-1 rotate-180" />
                </Button>
              </div>
            </div>
          </>
        );
        
      default:
        return (
          <div className="text-center py-10">
            <p className="text-gray-500">{translate('topicNotFound')}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/plan')}
            >
              {language === 'es' ? 'Volver al plan' : 'Voltar ao plano'}
            </Button>
          </div>
        );
    }
  };
  
  // Check if this content has been read before
  const isTopicRead = () => {
    if (!topic) return false;
    return localStorage.getItem(`learn_${topic}`) === 'true';
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-medical text-white px-4 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 bg-white/10 hover:bg-white/20 rounded-full h-8 w-8"
              onClick={() => navigate('/plan')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">{translate('learn')}</h1>
          </div>
          
          {isTopicRead() && (
            <div className="flex items-center bg-white/20 px-2 py-1 rounded-full">
              <CheckCircle size={14} className="text-green-300 mr-1" />
              <span className="text-xs font-medium">
                {language === 'es' ? 'Completado' : 'Concluído'}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-4 py-6">
        {renderTopicContent()}
        
        <div className="mt-8 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/plan')}
          >
            {language === 'es' ? 'Volver al plan' : 'Voltar ao plano'}
          </Button>
          
          {!isTopicRead() && (
            <Button 
              onClick={() => {
                earnPoints(25);
                localStorage.setItem(`learn_${topic}`, 'true');
                navigate('/plan');
                
                toast({
                  title: language === 'es' ? '¡Tema completado!' : 'Tema concluído!',
                  description: language === 'es' ? '+25 puntos' : '+25 pontos',
                  duration: 3000,
                });
              }}
              className="bg-accu-tech-blue hover:bg-accu-tech-dark-blue"
            >
              {language === 'es' ? 'Marcar como leído' : 'Marcar como lido'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
