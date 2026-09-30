export type NavTab = 'home' | 'calendar' | 'symptoms' | 'education' | 'profile';

export type AppointmentType = 'prenatal' | 'telehealth' | 'exam' | 'ultrasound';

export interface Appointment {
  id: string;
  title: string;
  professional: string;
  role: string;
  type: AppointmentType;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  instructions: string;
  status: 'upcoming' | 'completed' | 'live_now';
  telehealthUrl?: string;
  starred?: boolean;
}

export interface PregnancyWeekData {
  week: number;
  trimester: 1 | 2 | 3;
  babySizeComparison: string;
  fruitEmoji: string;
  estimatedWeight: string;
  estimatedLength: string;
  babyDevelopmentFact: string;
  motherAdvice: string;
  fetalHeartRateRange: string;
}

export interface SymptomEntry {
  id: string;
  date: string;
  time: string;
  overallMood: 'radiant' | 'good' | 'tired' | 'uncomfortable' | 'anxious';
  symptoms: string[];
  waterGlasses: number;
  bloodPressure?: string;
  weight?: string;
  notes?: string;
}

export interface EducationalArticle {
  id: string;
  category: 'saude_gestante' | 'preventivos_mulher' | 'saude_mental' | 'amamentacao' | 'nutricao';
  categoryLabel: string;
  title: string;
  summary: string;
  readTime: string;
  badgeGreen?: boolean;
  content: string[];
  keyTakeaways: string[];
}
