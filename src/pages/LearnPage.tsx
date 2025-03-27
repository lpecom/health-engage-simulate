
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { ChevronLeft } from "lucide-react";

const LearnPage = () => {
  const { translate } = useLanguage();
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
              
              <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">{translate('videoPlaceholder')}</p>
              </div>
              
              <div className="bg-medical-light/20 border border-medical-light rounded-lg p-4">
                <h3 className="font-medium mb-2">{translate('howItWorks')}</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>{translate('step1Description')}</li>
                  <li>{translate('step2Description')}</li>
                  <li>{translate('step3Description')}</li>
                  <li>{translate('step4Description')}</li>
                </ol>
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
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h3 className="font-medium mb-2">{translate('scientificStudies')}</h3>
                <p className="text-sm text-gray-700">{translate('studiesContent')}</p>
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
              onClick={() => navigate('/home')}
            >
              {translate('backToHome')}
            </Button>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-medical text-white px-4 pt-12 pb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 bg-white/10 hover:bg-white/20 rounded-full h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{translate('learn')}</h1>
        </div>
      </div>
      
      <div className="px-4 py-6">
        {renderTopicContent()}
      </div>
    </div>
  );
};

export default LearnPage;
