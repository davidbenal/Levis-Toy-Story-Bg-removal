import React, { useState } from 'react';
import { DownloadIcon, ShareIcon, QRIcon, RefreshIcon } from './common/Icons';
import ActionButton from './common/ActionButton';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareResultsProps {
  finalImage: string;
  onRestart: () => void;
}

const Modal: React.FC<{ children: React.ReactNode, onClose: () => void, title: string }> = ({ children, onClose, title }) => (
    <motion.div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
    >
        <motion.div 
            className="bg-[#2c2c2c] border border-gray-600 rounded-xl p-6 w-full max-w-sm text-center relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
        >
            <h3 className="font-display text-2xl mb-4 text-[#ffcc02]">{title}</h3>
            {children}
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">&times;</button>
        </motion.div>
    </motion.div>
);

const ShareResults: React.FC<ShareResultsProps> = ({ finalImage, onRestart }) => {
  const [modalContent, setModalContent] = useState<'qr' | 'link' | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = finalImage;
    link.download = 'levis-ai-background.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmRestart = () => {
    setShowConfirmation(false);
    onRestart();
  };
  
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(finalImage)}`;
  
  const handleShare = async () => {
    // Convert base64 to File
    const res = await fetch(finalImage);
    const blob = await res.blob();
    const file = new File([blob], 'levis-ai-photo.png', { type: blob.type });

    const shareData = {
      title: "Minha foto Levi's AI",
      text: "Veja a foto incrível que eu criei com a Levi's!",
      files: [file],
    };

    // Check if the browser supports the Web Share API and can share files
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
        // Fallback to download if sharing fails
        handleDownload();
      }
    } else {
      // Fallback for browsers that don't support Web Share API (like desktop browsers)
      setModalContent('link');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <h2 className="text-4xl font-display">Sua Foto Incrível!</h2>
      <div className="relative w-full max-w-md">
        <img src={finalImage} alt="Final generated" className="rounded-lg shadow-2xl w-full" />
      </div>
      <div className="w-full max-w-md grid grid-cols-2 gap-4">
        <button onClick={handleDownload} className="flex items-center justify-center gap-2 bg-levis-indigo p-3 rounded-lg bg-[#395775] transition-colors">
            <DownloadIcon />
            <span className="font-semibold">Baixar</span>
        </button>
        <button onClick={handleShare} className="flex items-center justify-center gap-2 bg-levis-red p-3 rounded-lg bg-[#C41230] transition-colors">
            <ShareIcon />
            <span className="font-semibold">Compartilhar</span>
        </button>
      </div>
      <div className="w-full max-w-md grid grid-cols-2 gap-4">
        <button onClick={() => setModalContent('qr')} className="flex items-center justify-center gap-2 bg-[#7cb342] p-3 rounded-lg hover:bg-[#8bc34a] transition-colors">
            <QRIcon />
            <span className="font-semibold">QR Code</span>
        </button>
        <button onClick={() => setShowConfirmation(true)} className="flex items-center justify-center gap-2 bg-gray-600 p-3 rounded-lg hover:bg-gray-700 transition-colors">
            <div className="flex items-center justify-center gap-2">
                <RefreshIcon />
                <span>Criar Outra</span>
            </div>
          </button>
      </div>

      <AnimatePresence>
        {modalContent === 'qr' && (
            <Modal onClose={() => setModalContent(null)} title="QR Code">
                <div className="bg-white p-4 rounded-md inline-block">
                    <img src={qrCodeUrl} alt="QR Code for sharing" />
                </div>
                <p className="text-sm mt-4 text-gray-400">Escaneie para ver ou compartilhar sua foto.</p>
            </Modal>
        )}
        {modalContent === 'link' && (
            <Modal onClose={() => setModalContent(null)} title="Compartilhamento não suportado">
                <p className="text-gray-300 mb-4">
                    Seu navegador não suporta o compartilhamento direto. Use o botão "Baixar" ou o QR Code para salvar sua imagem.
                </p>
                <button onClick={() => setModalContent(null)} className="mt-4 bg-levis-indigo text-white font-bold py-2 px-4 rounded w-full bg-[#4a6a8c] transition-colors">
                  Entendi
                </button>
            </Modal>
        )}
        {showConfirmation && (
            <Modal onClose={() => setShowConfirmation(false)} title="Tem certeza?">
                <p className="text-gray-300 mb-6">
                    Ao criar uma nova foto, a imagem atual será perdida para sempre. Deseja continuar?
                </p>
                <div className="flex space-x-4">
                    <button onClick={() => setShowConfirmation(false)} className="flex-1 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleConfirmRestart} className="flex-1 bg-levis-red text-white font-bold py-2 px-4 rounded-lg hover:bg-[#d72c48] transition-colors">
                        Sim, criar outra
                    </button>
                </div>
            </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareResults;