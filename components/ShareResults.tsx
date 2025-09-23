import React, { useState } from 'react';
import { DownloadIcon, LinkIcon, QRIcon, RefreshIcon } from './common/Icons';
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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = finalImage;
    link.download = 'levis-ai-background.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(finalImage)}`;
  const shareLink = "https://levis-ai.example.com/share/12345";

  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <h2 className="text-4xl font-display">Sua Foto Incrível!</h2>
      <div className="relative w-full max-w-md">
        <img src={finalImage} alt="Final generated" className="rounded-lg shadow-2xl w-full" />
      </div>
      <div className="w-full max-w-md grid grid-cols-2 gap-3">
        <button onClick={handleDownload} className="flex items-center justify-center gap-2 bg-[#003d82] p-3 rounded-lg hover:bg-[#0052a8] transition-colors">
            <DownloadIcon />
            <span className="font-semibold">Baixar</span>
        </button>
        <button onClick={() => setModalContent('qr')} className="flex items-center justify-center gap-2 bg-[#7cb342] p-3 rounded-lg hover:bg-[#8bc34a] transition-colors">
            <QRIcon />
            <span className="font-semibold">QR Code</span>
        </button>
        <button onClick={() => setModalContent('link')} className="col-span-2 flex items-center justify-center gap-2 bg-[#cc2936] p-3 rounded-lg hover:bg-[#e52e3e] transition-colors">
            <LinkIcon />
            <span className="font-semibold">Gerar Link de Compartilhamento</span>
        </button>
      </div>

      <div className="pt-4 w-full max-w-sm">
        <ActionButton onClick={onRestart}>
            <div className="flex items-center justify-center gap-2">
                <RefreshIcon />
                <span>Criar Outra</span>
            </div>
        </ActionButton>
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
            <Modal onClose={() => setModalContent(null)} title="Link Compartilhável">
                <input type="text" readOnly value={shareLink} className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600 text-center" />
                <button onClick={() => navigator.clipboard.writeText(shareLink)} className="mt-4 bg-[#ffcc02] text-[#003d82] font-bold py-2 px-4 rounded w-full">Copiar Link</button>
            </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareResults;