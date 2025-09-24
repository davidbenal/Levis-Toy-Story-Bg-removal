import React from 'react';
import Header from './common/Header';
import ActionButton from './common/ActionButton';
import { CameraIcon, ImageIcon, ShareIcon } from './common/Icons';

interface InstructionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const InstructionCard: React.FC<InstructionCardProps> = ({ icon, title, description }) => (
    <div className="bg-white/10 p-6 rounded-xl flex flex-col items-center text-center backdrop-blur-sm border border-white/20">
        <div className="text-[#ffcc02] mb-4">{icon}</div>
        <h3 className="font-display text-xl mb-2">{title}</h3>
        <p className="text-sm text-gray-300">{description}</p>
    </div>
);


interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col min-h-screen justify-center text-center py-8">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center space-y-8 px-4">
        <h1 className="text-4xl md:text-5xl font-display text-white leading-tight" style={{textShadow: '2px 2px 0 #003d82, 4px 4px 0 #cc2936'}}>
            Crie Fotos Incríveis com a Levi's
        </h1>
        <p className="text-lg md:text-xl max-w-lg text-gray-200">
            Transforme suas fotos com fundos criativos!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl pt-8">
          <InstructionCard icon={<CameraIcon />} title="Tire uma Foto" description="Use sua câmera para começar" />
          <InstructionCard icon={<ImageIcon />} title="Escolha o Cenário" description="3 cenários criativos disponíveis" />
          <InstructionCard icon={<ShareIcon />} title="Baixe e Compartilhe" description="Salve sua criação e mostre para todos" />
        </div>

        <div className="pt-8 w-full max-w-sm">
            <ActionButton onClick={onStart}>
                Começar Experiência
            </ActionButton>
        </div>
      </main>

      <footer className="text-xs text-gray-500 pt-8">
        <div className="flex justify-center space-x-4">
          <a href="/terms" className="hover:text-gray-300 transition-colors">
            Termos de Uso
          </a>
          <span>|</span>
          <a href="/privacy" className="hover:text-gray-300 transition-colors">
            Política de Privacidade
          </a>
        </div>
        <p>&copy; 2024 Levi's. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;