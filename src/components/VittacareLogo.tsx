import React from 'react';

interface VittacareLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  inverted?: boolean;
  className?: string;
}

export const VittacareLogo: React.FC<VittacareLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  inverted = false,
  className = '',
}) => {
  const iconDimensions = {
    sm: { w: 32, h: 32 },
    md: { w: 42, h: 42 },
    lg: { w: 56, h: 56 },
    xl: { w: 72, h: 72 },
  }[size];

  const goldPrimary = inverted ? '#E6D4AF' : '#B89243';
  const winePrimary = inverted ? '#FFFFFF' : '#5D1425';
  const leafGreen = inverted ? '#A1D1AF' : '#336443';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Emblem: Intertwined Heart, Leaves and Asclepius Rod/Serpent */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={iconDimensions.w}
          height={iconDimensions.h}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
          aria-label="Logo Clínica Vittacare"
        >
          {/* Subtle Outer Halo Ring */}
          <circle
            cx="50"
            cy="50"
            r="47"
            stroke={goldPrimary}
            strokeWidth="1.2"
            strokeDasharray="2 3"
            opacity="0.4"
          />

          {/* Graceful Heart Shape: Burgundy & Gold accents */}
          <path
            d="M50 82C50 82 20 62 20 40C20 28 29 20 40 20C45 20 48.5 22.5 50 25C51.5 22.5 55 20 60 20C71 20 80 28 80 40C80 62 50 82 50 82Z"
            stroke={winePrimary}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Botanical Olive / Laurel Leaves: entwined on left and right borders */}
          {/* Left Leaf Branch (Green & Gold) */}
          <path
            d="M24 38C20 33 22 26 27 27C31 28 29 36 24 38Z"
            fill={leafGreen}
            opacity="0.9"
          />
          <path
            d="M19 49C14 46 15 39 20 39C25 39 24 47 19 49Z"
            fill={goldPrimary}
            opacity="0.85"
          />
          <path
            d="M23 60C18 60 17 52 23 51C28 50 28 58 23 60Z"
            fill={leafGreen}
            opacity="0.9"
          />

          {/* Right Leaf Branch (Green & Gold) */}
          <path
            d="M76 38C80 33 78 26 73 27C69 28 71 36 76 38Z"
            fill={leafGreen}
            opacity="0.9"
          />
          <path
            d="M81 49C86 46 85 39 80 39C75 39 76 47 81 49Z"
            fill={goldPrimary}
            opacity="0.85"
          />
          <path
            d="M77 60C82 60 83 52 77 51C72 50 72 58 77 60Z"
            fill={leafGreen}
            opacity="0.9"
          />

          {/* Medical Asclepius Serpent & Central Rod of Care (Interlaced) */}
          {/* Central Rod in Brushed Gold */}
          <line
            x1="50"
            y1="18"
            x2="50"
            y2="76"
            stroke={goldPrimary}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Finial Orb at top of Rod */}
          <circle cx="50" cy="16" r="3.2" fill={goldPrimary} />

          {/* Serpent winding gently around the rod and heart apex */}
          <path
            d="M44 68C48 65 52 64 56 61C59 58 57 53 52 52C45 50 43 45 46 40C49 35 55 35 55 29C55 25 51 24 49 27"
            stroke={goldPrimary}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Serpent Head Eye dot */}
          <circle cx="49" cy="27" r="1.2" fill={winePrimary} />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-serif tracking-wide font-semibold text-wine-900 ${
              size === 'sm'
                ? 'text-lg'
                : size === 'md'
                ? 'text-xl md:text-2xl'
                : size === 'lg'
                ? 'text-2xl md:text-3xl'
                : 'text-3xl md:text-4xl'
            }`}
            style={{ color: inverted ? '#FFFFFF' : '#480D1B' }}
          >
            Vittaconect
          </span>
          <span
            className="text-[10px] uppercase tracking-widest font-sans font-semibold text-gold-600"
            style={{ color: inverted ? '#E6D4AF' : '#9B7731' }}
          >
            App
          </span>
        </div>
        {showSubtitle && (
          <span
            className="text-[11px] tracking-wider uppercase font-sans font-medium text-stone-500 mt-0.5"
            style={{ color: inverted ? '#E6D4AF' : '#78716C' }}
          >
            Clínica Vittacare
          </span>
        )}
      </div>
    </div>
  );
};
