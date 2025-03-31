import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Play, Pause, ArrowUp, ArrowRight, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  COMPLETE,
}
const SimulatedGlucometer: React.FC = () => {
  const {
    translate
  } = useLanguage();
  const {
    userData,
    addGlucoseReading
  } = useUser();
  const {
    toast
  } = useToast();
  const [measurementState, setMeasurementState] = useState<MeasurementState>(MeasurementState.READY);
  const [progress, setProgress] = useState(0);
  const [currentReading, setCurrentReading] = useState<number | null>(null);
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
      duration: 3000
    });
  };
  const resetMeasurement = () => {
    setMeasurementState(MeasurementState.READY);
    setProgress(0);
    setCurrentReading(null);
  };
  const renderReadingStatus = () => {
    if (!currentReading) return null;
    if (currentReading >= userData.targetRangeLow && currentReading <= userData.targetRangeHigh) {
      return <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">{translate('inRange')}</div>;
    } else if (currentReading > userData.targetRangeHigh) {
      return <div className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">{translate('highAlert')}</div>;
    } else {
      return <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">{translate('lowAlert')}</div>;
    }
  };
  return;
};
export default SimulatedGlucometer;