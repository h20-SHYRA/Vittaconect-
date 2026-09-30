import React, { createContext, useContext, useEffect, useState } from 'react';

export type FontSizeOption = 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type VisualTheme = 'classic' | 'warm' | 'dark';

export interface CustomizationSettings {
  fontSize: FontSizeOption;
  lineHeight: 'normal' | 'relaxed';
  highContrast: boolean;
  reducedMotion: boolean;
  theme: VisualTheme;
  boldText: boolean;
}

const DEFAULT_SETTINGS: CustomizationSettings = {
  fontSize: 'base',
  lineHeight: 'normal',
  highContrast: false,
  reducedMotion: false,
  theme: 'classic',
  boldText: false,
};

const FONT_SIZE_PX_MAP: Record<FontSizeOption, string> = {
  sm: '14.5px', // 90%
  base: '16px',  // 100% Padrão
  lg: '18.5px',  // 115% Médio/Grande
  xl: '21px',    // 130% Grande
  '2xl': '24px', // 150% Extra Grande
};

interface CustomizationContextType {
  settings: CustomizationSettings;
  updateSetting: <K extends keyof CustomizationSettings>(key: K, value: CustomizationSettings[K]) => void;
  resetSettings: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

const STORAGE_KEY = 'vittaconect_user_customization_v1';

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CustomizationSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Error loading customization settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Apply settings to document root & body
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Error saving customization settings', e);
    }

    // Apply root font-size scaling for Tailwind rem scaling
    const targetPx = FONT_SIZE_PX_MAP[settings.fontSize] || '16px';
    document.documentElement.style.fontSize = targetPx;

    // Apply high contrast class
    if (settings.highContrast) {
      document.documentElement.classList.add('app-high-contrast');
    } else {
      document.documentElement.classList.remove('app-high-contrast');
    }

    // Apply bold text preference
    if (settings.boldText) {
      document.documentElement.classList.add('app-bold-text');
    } else {
      document.documentElement.classList.remove('app-bold-text');
    }

    // Apply relaxed line height
    if (settings.lineHeight === 'relaxed') {
      document.documentElement.classList.add('app-relaxed-leading');
    } else {
      document.documentElement.classList.remove('app-relaxed-leading');
    }

    // Apply reduced motion
    if (settings.reducedMotion) {
      document.documentElement.classList.add('app-reduced-motion');
    } else {
      document.documentElement.classList.remove('app-reduced-motion');
    }

    // Apply Theme
    document.documentElement.classList.remove('theme-warm', 'theme-dark');
    if (settings.theme === 'warm') {
      document.documentElement.classList.add('theme-warm');
    } else if (settings.theme === 'dark') {
      document.documentElement.classList.add('theme-dark');
    }
  }, [settings]);

  const updateSetting = <K extends keyof CustomizationSettings>(key: K, value: CustomizationSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const FONT_SIZES: FontSizeOption[] = ['sm', 'base', 'lg', 'xl', '2xl'];

  const increaseFontSize = () => {
    const currentIndex = FONT_SIZES.indexOf(settings.fontSize);
    if (currentIndex < FONT_SIZES.length - 1) {
      updateSetting('fontSize', FONT_SIZES[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = FONT_SIZES.indexOf(settings.fontSize);
    if (currentIndex > 0) {
      updateSetting('fontSize', FONT_SIZES[currentIndex - 1]);
    }
  };

  return (
    <CustomizationContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        increaseFontSize,
        decreaseFontSize,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};
