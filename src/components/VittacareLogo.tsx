import React from 'react';
import officialLogo from '../assets/images/vittaconect_app_icon_1790788178939.jpg';

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
    sm: { box: 'w-8 h-8 rounded-xl', textSize: 'text-lg' },
    md: { box: 'w-10 h-10 sm:w-11 sm:h-11 rounded-xl', textSize: 'text-xl md:text-2xl' },
    lg: { box: 'w-14 h-14 rounded-2xl', textSize: 'text-2xl md:text-3xl' },
    xl: { box: 'w-20 h-20 rounded-3xl', textSize: 'text-3xl md:text-4xl' },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Vittaconect Luxury Brand Emblem - Exact Master Image */}
      <div className="relative shrink-0 flex items-center justify-center">
        <div
          className={`${iconDimensions.box} overflow-hidden shadow-sm border ${
            inverted ? 'border-[#E6D4AF] ring-1 ring-white/20' : 'border-[#DEC68E] ring-1 ring-[#B89243]/20'
          } bg-[#FAF6ED] transition-transform duration-300 hover:scale-105 flex items-center justify-center`}
        >
          <img
            src={officialLogo}
            alt="Emblema Oficial Vittaconect - Clínica Vittacare"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-serif tracking-wide font-semibold text-wine-900 ${iconDimensions.textSize}`}
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
