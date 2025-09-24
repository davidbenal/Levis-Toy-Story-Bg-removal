import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CameraIcon, SwitchCameraIcon, CheckIcon, RefreshIcon, UploadIcon } from './common/Icons';

interface PhotoCaptureProps {
  onConfirm: (imageData: string) => void;
}

const CameraComponent: React.FC<{ onCapture: (data: string) => void }> = ({ onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [error, setError] = useState<string | null>(null);

    const startCamera = useCallback(async (mode: 'user' | 'environment') => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: mode }
            });
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
            setError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.");
        }
    }, [stream]);

    useEffect(() => {
        startCamera(facingMode);
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facingMode]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                // Use toDataURL with quality 1.0 to get the best possible JPEG quality.
                onCapture(canvasRef.current.toDataURL('image/jpeg', 1.0));
            }
        }
    };
    
    const toggleFacingMode = () => {
      setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    if (error) {
        return <div className="text-center text-red-400 p-4 bg-red-900/50 rounded-lg">{error}</div>;
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full max-w-md aspect-square bg-black rounded-lg overflow-hidden shadow-lg">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                <button onClick={toggleFacingMode} className="absolute top-4 right-4 bg-black/50 p-3 rounded-full text-white hover:bg-black/80 transition-colors">
                    <SwitchCameraIcon />
                </button>
            </div>
            <button onClick={handleCapture} className="bg-[#ffcc02] text-[#003d82] p-4 rounded-full shadow-lg transform hover:scale-110 transition-transform">
                <CameraIcon />
            </button>
        </div>
    );
};

const PhotoPreview: React.FC<{ image: string; onConfirm: () => void; onRetake: () => void }> = ({ image, onConfirm, onRetake }) => {
    return (
        <div className="flex flex-col items-center space-y-6 w-full">
            <h2 className="text-3xl font-display">Sua Foto Perfeita</h2>
            <img src={image} alt="Preview" className="w-full max-w-md aspect-square object-contain rounded-lg shadow-lg bg-black" />
            <div className="flex space-x-4 w-full max-w-md">
                <button onClick={onRetake} className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors">
                    <RefreshIcon />
                    Refazer
                </button>
                <button onClick={onConfirm} className="flex-1 flex items-center justify-center gap-2 bg-[#7cb342] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#8bc34a] transition-colors">
                    <CheckIcon />
                    Continuar
                </button>
            </div>
        </div>
    );
};


const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onConfirm }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<'select' | 'camera'>('select');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSetPreview = (data: string) => {
    setPreview(data);
  };
  
  const handleRetake = () => {
    setPreview(null);
    setMode('select');
  };
  const handleConfirm = () => preview && onConfirm(preview);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Create a square canvas based on the largest dimension of the image
            const size = Math.max(img.width, img.height);
            canvas.width = size;
            canvas.height = size;

            // Fill the canvas with a black background (for letterboxing)
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, size, size);

            // Calculate the position to draw the image so it's centered
            const x = (size - img.width) / 2;
            const y = (size - img.height) / 2;

            // Draw the original image onto the centered, square canvas
            ctx.drawImage(img, x, y);

            // Get the new base64 string of the letterboxed image
            const croppedImageData = canvas.toDataURL('image/jpeg', 1.0);
            handleSetPreview(croppedImageData);
          };
          img.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (preview) {
      return <PhotoPreview image={preview} onConfirm={handleConfirm} onRetake={handleRetake} />
  }

  if (mode === 'camera') {
      return (
        <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl md:text-4xl font-display">Tire uma foto</h2>
            <CameraComponent onCapture={handleSetPreview} />
            <button onClick={() => setMode('select')} className="mt-2 text-gray-400 hover:text-white transition-colors">Voltar</button>
        </div>
      )
  }

  // mode === 'select'
  return (
    <div className="flex flex-col items-center space-y-8 text-center min-h-[60vh] justify-center">
      <h2 className="text-3xl md:text-4xl font-display">Adicione sua Foto</h2>
      <p className="text-lg text-gray-300 max-w-sm">Escolha se quer tirar uma foto na hora ou subir uma da sua galeria.</p>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className="w-full max-w-sm space-y-4 pt-4">
        <button
          onClick={() => setMode('camera')}
          className="w-full bg-[#003d82] text-[#ffcc02] font-bold font-display tracking-wider py-4 px-8 rounded-lg shadow-lg text-xl uppercase transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#0052a8] focus:outline-none focus:ring-4 focus:ring-[#ffcc02] focus:ring-opacity-50 flex items-center justify-center gap-3"
        >
          <CameraIcon />
          Tirar Foto
        </button>
        <button
          onClick={handleUploadClick}
          className="w-full bg-gray-600 text-white font-bold font-display tracking-wider py-4 px-8 rounded-lg shadow-lg text-xl uppercase transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 flex items-center justify-center gap-3"
        >
          <UploadIcon />
          Subir da Galeria
        </button>
      </div>
    </div>
  );
};

export default PhotoCapture;
