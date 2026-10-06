/**
 * Vittaconect 2.0 & Vittaprofessio — Centralized Design System Tokens
 * Centralizes colors, typography, spacing, radius, shadows, breakpoints,
 * animations, semantic states, and z-index layers.
 */

export const DESIGN_TOKENS = {
  brand: {
    name: 'Vittaconect',
    clinic: 'Clínica Vittacare',
    professionalSuite: 'Vittaprofessio',
    tagline: 'Tecnologia que aproxima o cuidado',
    slogan: 'À distância de duas telas, a proximidade de um cuidado que abraça.',
  },
  colors: {
    // Vittaconect (Paciente: Gestante & Saúde Feminina)
    vittaconect: {
      deepWine: '#480D1B',
      burgundy: '#5D1425',
      burgundyHover: '#741C30',
      roseAccent: '#8D253D',
      softRose: '#FAF0F2',
      softRoseBorder: '#EBBEC8',
      pearlWhite: '#FFFFFF',
      lightCream: '#FDFBF7',
      warmCream: '#FAF6ED',
      goldDetail: '#B89243',
      goldSoft: '#E6D4AF',
      textPrimary: '#2C2123',
      textSecondary: '#574B4E',
      textMuted: '#786B6E',
    },
    // Vittaprofessio (Corpo Clínico & Enfermagem)
    vittaprofessio: {
      pearlBlue: '#D4EAFC',
      platinumBlue: '#E6F3FE',
      deepBlue: '#0A2647',
      metallicBlue: '#144272',
      cobaltAccent: '#205295',
      iceWhite: '#F8FBFF',
      silverDetail: '#94A3B8',
      silverBorder: '#CBD5E1',
      skyHighlight: '#7DD3FC',
    },
    // Semantic Clinical States (Always paired with icon + text label for WCAG)
    semantic: {
      normal: {
        bg: '#ECFDF5',
        border: '#A7F3D0',
        text: '#065F46',
        badge: '#059669',
        label: 'Normal',
      },
      attention: {
        bg: '#FFFBEB',
        border: '#FDE68A',
        text: '#92400E',
        badge: '#D97706',
        label: 'Atenção',
      },
      urgent: {
        bg: '#FFF1F2',
        border: '#FECDD3',
        text: '#9F1239',
        badge: '#E11D48',
        label: 'Urgente',
      },
      info: {
        bg: '#F0F9FF',
        border: '#BAE6FD',
        text: '#075985',
        badge: '#0284C7',
        label: 'Informativo',
      },
    },
    // True Dark Mode Surfaces
    dark: {
      patientCanvas: '#140E10',
      patientSurface: '#1F1619',
      patientElevated: '#2B1E22',
      patientBorder: '#3D2B30',
      profCanvas: '#061325',
      profSurface: '#0B1E36',
      profElevated: '#122B4A',
      profBorder: '#1E3F66',
    },
  },
  typography: {
    fontDisplay: "'Cormorant Garamond', Georgia, serif",
    fontSans: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  radius: {
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
  },
  zIndex: {
    header: 30,
    bottomNav: 40,
    drawer: 50,
    modal: 60,
    toast: 70,
  },
  breakpoints: {
    xs: 320,
    sm: 360,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1440,
  },
} as const;
