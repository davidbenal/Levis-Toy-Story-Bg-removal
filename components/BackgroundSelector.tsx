
import React, { useRef } from 'react';
import { Background } from '../types';
import { BACKGROUNDS } from '../constants';
import { motion } from 'framer-motion';
import { UploadIcon } from './common/Icons';

interface BackgroundSelectorProps {
  onSelect: (background: Background) => void;
  onBack: () => void;
  error: string | null;
}

const BackgroundOption: React.FC<{ background: Background; onSelect: (bg: Background) => void }> = ({ background, onSelect }) => (
    <motion.div 
        className="relative rounded-lg overflow-hidden cursor-pointer group shadow-lg"
        onClick={() => onSelect(background)}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <img src={background.previewUrl} alt={background.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-4">
            <h3 className="font-display text-2xl text-white drop-shadow-lg">{background.name}</h3>
        </div>
    </motion.div>
);

const UploadOption: React.FC<{ onSelect: (bg: Background) => void }> = ({ onSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newBackground: Background = {
                    id: 'custom-upload',
                    name: 'Fundo Personalizado',
                    previewUrl: e.target?.result as string,
                };
                onSelect(newBackground);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <motion.div
                className="relative rounded-lg overflow-hidden cursor-pointer group shadow-lg bg-white/10 h-48 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-500 hover:border-[#ffcc02] transition-all duration-300"
                onClick={handleClick}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <div className="text-[#ffcc02] mb-2">
                    <UploadIcon className="w-10 h-10" />
                </div>
                <h3 className="font-display text-2xl text-white drop-shadow-lg">Subir Foto</h3>
            </motion.div>
        </>
    );
};


const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ onSelect, onBack, error }) => {
  return (
    <div className="flex flex-col items-center space-y-8 text-center">
      <h2 className="text-3xl md:text-4xl font-display">Escolha seu Cenário Favorito</h2>
      {error && (
         <div className="text-center text-red-400 p-3 bg-red-900/50 rounded-lg w-full max-w-3xl">
          <strong>Oops!</strong> {error}. Por favor, tente novamente ou escolha outro fundo.
        </div>
      )}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BACKGROUNDS.map((bg) => (
          <BackgroundOption key={bg.id} background={bg} onSelect={onSelect} />
        ))}
        <UploadOption onSelect={onSelect} />
      </div>
       <button onClick={onBack} className="mt-4 text-gray-400 hover:text-white transition-colors">Voltar e trocar foto</button>
    </div>
  );
};

export default BackgroundSelector;