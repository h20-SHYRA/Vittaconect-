import React from 'react';

interface NursingCrestProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'silver' | 'pearl' | 'gold';
}

export const NursingCrest: React.FC<NursingCrestProps> = ({
  className = '',
  size = 'md',
  variant = 'silver',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  const colorStyles = {
    silver: {
      primary: '#CBD5E1',
      secondary: '#94A3B8',
      glow: '#F1F5F9',
      border: 'border-slate-300',
    },
    pearl: {
      primary: '#E2EEF5',
      secondary: '#A5C4D4',
      glow: '#FFFFFF',
      border: 'border-[#B4D3E5]',
    },
    gold: {
      primary: '#DEC68E',
      secondary: '#B89243',
      glow: '#FFF7D6',
      border: 'border-[#DEC68E]',
    },
  }[variant];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl p-1.5 transition-transform hover:scale-105 ${className}`}
      title="Brasão Oficial da Enfermagem & Cuidado Clínico - Lâmpada, Serpente e Ramo"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses} drop-shadow-md`}
      >
        <defs>
          <linearGradient id={`silverGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor={colorStyles.primary} />
            <stop offset="80%" stopColor={colorStyles.secondary} />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          <linearGradient id={`glowGrad-${variant}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.9" />
            <stop offset="100%" stopColor={colorStyles.secondary} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Outer Circular Laurel Wreath Shield */}
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke={`url(#silverGrad-${variant})`}
          strokeWidth="1.5"
          strokeDasharray="2 1"
          opacity="0.85"
        />

        {/* Laurel Wreath Leaves Left */}
        <path
          d="M 16 44 C 13 36, 14 24, 20 16 M 15 38 C 17 37, 19 39, 18 41 M 14 30 C 17 30, 18 33, 16 35 M 16 22 C 19 23, 20 26, 17 28"
          stroke={`url(#silverGrad-${variant})`}
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Laurel Wreath Leaves Right */}
        <path
          d="M 48 44 C 51 36, 50 24, 44 16 M 49 38 C 47 37, 45 39, 46 41 M 50 30 C 47 30, 46 33, 48 35 M 48 22 C 45 23, 44 26, 47 28"
          stroke={`url(#silverGrad-${variant})`}
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Florence Nightingale's Oil Lamp Base and Body */}
        <path
          d="M 22 47 L 42 47 C 40 45, 38 43, 36 43 L 28 43 C 26 43, 24 45, 22 47 Z"
          fill={`url(#silverGrad-${variant})`}
          stroke="#475569"
          strokeWidth="0.75"
        />

        {/* Lamp Reservoir */}
        <path
          d="M 24 43 C 24 35, 35 34, 38 34 C 44 34, 49 37, 49 40 C 49 42, 46 43, 42 43 Z"
          fill={`url(#silverGrad-${variant})`}
        />

        {/* Lamp Handle (loop on the right) */}
        <path
          d="M 43 36 C 49 33, 51 43, 44 43"
          stroke={`url(#silverGrad-${variant})`}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Lamp Long Spout pointing left */}
        <path
          d="M 27 38 C 22 37, 18 34, 16 31 C 18 31, 22 34, 25 35"
          fill={`url(#silverGrad-${variant})`}
        />

        {/* Flame of Eternal Care and Knowledge */}
        <path
          d="M 16 30 C 14 26, 17 22, 17 19 C 19 22, 21 24, 19 28 C 18 29.5, 17 30, 16 30 Z"
          fill="#38BDF8"
          stroke="#BAE6FD"
          strokeWidth="0.8"
        />
        <path
          d="M 16.5 28 C 15.5 25, 17 23, 17 21 C 18 23, 19 25, 18 27 Z"
          fill="#FFFFFF"
        />

        {/* Asclepius Serpent intertwined with the Lamp (symbol of healing and ethical science) */}
        <path
          d="M 33 22 C 30 24, 36 28, 32 32 C 30 34, 34 37, 32 40"
          stroke="#E0F2FE"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="34" cy="22" r="1.3" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
