
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Play, Pause, ArrowUp, ArrowRight, ArrowDown, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

// Generate a somewhat realistic glucose reading
const generateReading = (targetLow: number, targetHigh: number): number => {
  // 70% chance to be in range, 15% chance to be high, 15% chance to be low
  const rand = Math.random();
  
  if (rand < 0.7) {
    // In range
    return Math.floor(Math.random() * (targetHigh - targetLow)) + targetLow;
  } else if (rand < 0.85) {
    // High
    return Math.floor(Math.random() * 80) + targetHigh;
  } else {
    // Low
    return Math.floor(Math.random() * (targetLow - 40)) + 40;
  }
};

const getTrendIcon = (readings: any[]): JSX.Element | null => {
  if (readings.length < 2) return null;
  
  const latest = readings[0].value;
  const previous = readings[1].value;
  const diff = latest - previous;
  
  if (Math.abs(diff) < 10) {
    return <ArrowRight className="text-gray-500" />;
  } else if (diff > 0) {
    return <ArrowUp className="text-orange-500" />;
  } else {
    return <ArrowDown className="text-blue-500" />;
  }
};

enum MeasurementState {
  READY,
  MEASURING,
  COMPLETE
}

const SimulatedGlucometer: React.FC = () => {
  const { translate } = useLanguage();
  const { userData, addGlucoseReading } = useUser();
  const { toast } = useToast();
  
  const [measurementState, setMeasurementState] = useState<MeasurementState>(MeasurementState.READY);
  const [progress, setProgress] = useState(0);
  const [currentReading, setCurrentReading] = useState<number | null>(null);
  
  // Get time of day for personalized greetings
  const getTimeBasedGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return translate('goodMorning');
    if (hours < 18) return translate('goodAfternoon');
    return translate('goodEvening');
  };
  
  useEffect(() => {
    if (measurementState === MeasurementState.MEASURING) {
      const interval = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = prevProgress + 2;
          if (newProgress >= 100) {
            clearInterval(interval);
            
            // Generate reading and complete measurement
            const reading = generateReading(userData.targetRangeLow, userData.targetRangeHigh);
            setCurrentReading(reading);
            addGlucoseReading(reading);
            setMeasurementState(MeasurementState.COMPLETE);
            
            return 100;
          }
          return newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [measurementState, userData.targetRangeLow, userData.targetRangeHigh, addGlucoseReading]);
  
  const startMeasurement = () => {
    setMeasurementState(MeasurementState.MEASURING);
    setProgress(0);
    toast({
      title: translate('measuringInProgress'),
      description: translate('placeLaserOnSkin'),
      duration: 3000,
    });
  };
  
  const resetMeasurement = () => {
    setMeasurementState(MeasurementState.READY);
    setProgress(0);
    setCurrentReading(null);
  };
  
  const getMotivationalMessage = () => {
    if (userData.streak > 0) {
      return `${translate('keepYourStreak')} ${userData.streak} ${translate('days')} 🔥`;
    }
    return translate('startYourJourney');
  };
  
  const renderReadingStatus = () => {
    if (!currentReading) return null;
    
    if (currentReading >= userData.targetRangeLow && currentReading <= userData.targetRangeHigh) {
      return (
        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium animate-pulse">
          {translate('inRange')} ✓
        </div>
      );
    } else if (currentReading > userData.targetRangeHigh) {
      return <div className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">{translate('highAlert')}</div>;
    } else {
      return <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">{translate('lowAlert')}</div>;
    }
  };
  
  const renderEmptyState = () => {
    if (userData.glucoseReadings.length > 0) return null;
    
    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center border border-blue-100">
        <p className="text-blue-800 text-sm">{translate('firstReadingGuide')}</p>
        <p className="text-blue-600 text-xs mt-1">{translate('takeYourFirstReading')}</p>
      </div>
    );
  };
  
  return (
    <div className="medical-card flex flex-col items-center">
      <div className="w-full max-w-sm mx-auto">
        {/* Personalized greeting and motivation */}
        <div className="text-center mb-3">
          <p className="text-lg text-accu-tech-blue font-medium">{getTimeBasedGreeting()}</p>
          <p className="text-sm text-gray-600">{getMotivationalMessage()}</p>
        </div>
        
        {/* Device simulation */}
        <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[2/3] mb-6 border-2 border-gray-200 shadow-md">
          {/* Screen */}
          <div className="absolute inset-4 bg-gray-800 rounded-lg flex flex-col items-center justify-center">
            {measurementState === MeasurementState.READY && (
              <div className="text-center text-white">
                <div className="text-xl font-semibold mb-3">{translate('readyForYourGlucoseCheck')}</div>
                <Play className="h-12 w-12 mx-auto text-accu-tech-blue animate-pulse-slow" />
                <p className="text-sm text-gray-300 mt-3">{translate('quickAndEasy')}</p>
              </div>
            )}
            
            {measurementState === MeasurementState.MEASURING && (
              <div className="text-center text-white w-full px-6">
                <div className="text-xl font-semibold mb-4">{translate('measuringInProgress')}</div>
                
                {/* Laser animation */}
                <div className="relative h-36 w-full bg-gray-700 rounded-lg mb-4 overflow-hidden">
                  <div className="laser-line" style={{ top: `${progress}%` }}></div>
                </div>
                
                {/* Progress bar */}
                <Progress value={progress} className="h-2 mb-2" />
                <div className="text-sm text-gray-300">{progress}%</div>
              </div>
            )}
            
            {measurementState === MeasurementState.COMPLETE && currentReading && (
              <div className="text-center text-white w-full px-4">
                <div className="text-xl font-semibold mb-2">{translate('greatJob')}</div>
                
                <div className="text-4xl font-bold text-accu-tech-blue mb-1 animate-fade-in">
                  {currentReading}
                  <span className="text-sm font-normal ml-1 text-gray-300">{translate('mgdl')}</span>
                </div>
                
                <div className="flex justify-center space-x-2 items-center mb-3">
                  {renderReadingStatus()}
                </div>
                
                {userData.glucoseReadings.length >= 2 && (
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-300">
                    <span>{translate('trending')}: </span>
                    {getTrendIcon(userData.glucoseReadings)}
                  </div>
                )}
                
                <div className="mt-3 px-3 py-1 bg-accu-tech-lightest text-accu-tech-blue rounded-lg text-xs">
                  <Zap className="h-3 w-3 inline mr-1" />
                  {translate('pointsEarned')}: +10
                </div>
              </div>
            )}
          </div>
          
          {/* Button at bottom of device */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-accu-tech-blue flex items-center justify-center shadow-lg hover:bg-accu-tech-blue/90 transition-colors">
            {measurementState === MeasurementState.MEASURING ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white" />
            )}
          </div>
        </div>
        
        {/* Controls with improved CTA */}
        <div className="flex justify-center">
          {measurementState === MeasurementState.READY && (
            <Button 
              onClick={startMeasurement}
              className="bg-accu-tech-blue hover:bg-accu-tech-blue/90 text-white py-6 px-8 rounded-full font-medium text-lg shadow-md hover:shadow-lg transform transition hover:scale-105"
            >
              {translate('checkYourGlucoseNow')}
            </Button>
          )}
          
          {measurementState === MeasurementState.MEASURING && (
            <Button 
              onClick={() => setMeasurementState(MeasurementState.READY)}
              variant="outline"
              className="border-accu-tech-blue text-accu-tech-blue"
            >
              {translate('cancel')}
            </Button>
          )}
          
          {measurementState === MeasurementState.COMPLETE && (
            <Button 
              onClick={resetMeasurement}
              className="bg-accu-tech-blue hover:bg-accu-tech-blue/90 text-white"
            >
              {translate('newMeasurement')}
            </Button>
          )}
        </div>
        
        {renderEmptyState()}
      </div>
    </div>
  );
};

export default SimulatedGlucometer;
