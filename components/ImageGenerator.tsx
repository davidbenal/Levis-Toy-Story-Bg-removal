import React, { useEffect } from 'react';
import { Background } from '../types';
import { generateImageWithGemini } from '../services/geminiService';
import LoadingSpinner from './common/LoadingSpinner';

interface ImageGeneratorProps {
  userImage: string;
  background: Background;
  onSuccess: (generatedImage: string) => void;
  onError: (errorMessage: string) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ userImage, background, onSuccess, onError }) => {

  useEffect(() => {
    const generate = async () => {
      try {
        const result = await generateImageWithGemini(userImage, background);
        onSuccess(result);
      } catch (error) {
        if (error instanceof Error) {
          onError(error.message);
        } else {
          onError("An unexpected error occurred.");
        }
      }
    };
    
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userImage, background]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner message="Aguarde, estamos preparando sua foto..." />
    </div>
  );
};

export default ImageGenerator;