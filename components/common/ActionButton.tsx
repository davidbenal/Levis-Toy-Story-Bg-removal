
import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="w-full bg-[#003d82] text-[#ffcc02] font-bold font-display tracking-wider py-4 px-8 rounded-lg shadow-lg text-xl uppercase transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#0052a8] focus:outline-none focus:ring-4 focus:ring-[#ffcc02] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </button>
  );
};

export default ActionButton;
