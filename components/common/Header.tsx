import React from 'react';

const LeviLogo = () => (
    <svg width="112" height="56" viewBox="0 0 112 56" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 25 C20 45, 37 50, 56 50 C75 50, 92 45, 112 25 V 56 H0 z M0 25 C20 5, 37 0, 56 0 C75 0, 92 5, 112 25 V 0 H0 z" fill="#CC2936"/>
      <text x="56" y="34" fontFamily="Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle" letterSpacing="0.5">LEVI'S</text>
    </svg>
);

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-center py-6">
      <LeviLogo />
    </header>
  );
};

export default Header;