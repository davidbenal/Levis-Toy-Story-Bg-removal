
import React from 'react';
import { motion } from 'framer-motion';

const LuxoBall = () => (
    <motion.div
        className="relative w-24 h-24"
        animate={{ y: [0, -40, 0] }}
        transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    >
        <div className="absolute w-full h-full rounded-full bg-[#ffcc02] overflow-hidden shadow-2xl">
            <div className="absolute top-0 w-full h-1/2 bg-[#003d82]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
                <svg viewBox="0 0 24 24" fill="#cc2936">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                </svg>
            </div>
        </div>
    </motion.div>
);


interface LoadingSpinnerProps {
    message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-16">
      <LuxoBall />
      <p className="font-display text-2xl text-[#ffcc02] animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
