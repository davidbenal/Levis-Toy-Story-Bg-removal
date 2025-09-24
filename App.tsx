
import React, { useState, useCallback } from 'react';
import { Step, Background } from './types';
import LandingPage from './components/LandingPage';
import PhotoCapture from './components/PhotoCapture';
import BackgroundSelector from './components/BackgroundSelector';
import ImageGenerator from './components/ImageGenerator';
import ShareResults from './components/ShareResults';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.Landing);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedBg, setSelectedBg] = useState<Background | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const restart = useCallback(() => {
    setUserImage(null);
    setSelectedBg(null);
    setFinalImage(null);
    setError(null);
    setStep(Step.Capture);
  }, []);

  const handleStart = useCallback(() => setStep(Step.Capture), []);
  
  const handlePhotoConfirm = useCallback((imageData: string) => {
    setUserImage(imageData);
    setStep(Step.SelectBackground);
  }, []);

  const handleBackToCapture = useCallback(() => {
    setUserImage(null);
    setStep(Step.Capture);
  }, []);

  const handleBackgroundSelect = useCallback((background: Background) => {
    setSelectedBg(background);
    setStep(Step.Generating);
  }, []);

  const handleGenerationSuccess = useCallback((generatedImage: string) => {
    setFinalImage(generatedImage);
    setStep(Step.Results);
  }, []);

  const handleGenerationError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setStep(Step.SelectBackground);
  }, []);
  
  const renderStep = () => {
    switch (step) {
      case Step.Landing:
        return <LandingPage onStart={handleStart} />;
      case Step.Capture:
        return <PhotoCapture onConfirm={handlePhotoConfirm} />;
      case Step.SelectBackground:
        return <BackgroundSelector onSelect={handleBackgroundSelect} onBack={handleBackToCapture} error={error} />;
      case Step.Generating:
        if (!userImage || !selectedBg) {
            // Should not happen in normal flow, but handle it
            restart();
            return null;
        }
        return <ImageGenerator userImage={userImage} background={selectedBg} onSuccess={handleGenerationSuccess} onError={handleGenerationError} />;
      case Step.Results:
        if (!finalImage) {
            restart();
            return null;
        }
        return <ShareResults finalImage={finalImage} onRestart={restart} />;
      default:
        return <LandingPage onStart={handleStart} />;
    }
  };

  return (
    <div className="bg-[#2c2c2c] min-h-screen w-full text-white overflow-x-hidden">
      <div className="container mx-auto p-4 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
