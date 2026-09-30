export type NavTab = 
  | 'home' 
  | 'prenatal_card' 
  | 'community' 
  | 'news' 
  | 'calendar' 
  | 'reminders' 
  | 'symptoms' 
  | 'education' 
  | 'profile';

export type AppointmentType = 'prenatal' | 'telehealth' | 'exam' | 'ultrasound';

export interface PatientProfile {
  id: string;
  name: string;
  preferredName: string;
  age: number;
  phone?: string;
  babyNickname: string;
  babyGender?: 'boy' | 'girl' | 'surprise';
  currentWeek: number;
  dueDate: string;
  bloodType: string;
  isFirstPregnancy: boolean;
  emergencyContact: string;
  allergies: string;
  doctorName: string;
  doctorCrm: string;
  registeredAt: string;
  initialWeight?: number;
  currentWeight?: number;
  heightCm?: number;
}

export interface WeightRecord {
  id: string;
  week: number;
  date: string;
  weightKg: number;
  bmi: number;
  notes?: string;
}

export interface BloodPressureRecord {
  id: string;
  date: string;
  time: string;
  systolic: number; // PAS
  diastolic: number; // PAD
  pulse?: number;
  status: 'normal' | 'attention' | 'alert';
  notes?: string;
}

export interface VaccineRecord {
  id: string;
  name: string;
  description: string;
  recommendedWeek: string;
  dose: string;
  status: 'completed' | 'scheduled' | 'pending';
  dateApplied?: string;
  batchNumber?: string;
  location?: string;
  isMandatory: boolean;
}

export interface PrenatalConsultationRecord {
  id: string;
  date: string;
  gestationalWeek: number;
  weightKg: number;
  bloodPressure: string;
  uterineHeightCm: number;
  fetalHeartRateBpm: number;
  fetalMovement: boolean;
  edema: 'ausente' | '+' | '++' | '+++';
  doctorOrNurse: string;
  clinicalNotes: string;
}

export interface ForumComment {
  id: string;
  authorName: string;
  authorRole?: string;
  isClinicOfficial?: boolean;
  content: string;
  createdAt: string;
  likes: number;
}

export interface ForumPost {
  id: string;
  category: 'birth_month' | 'first_trimester' | 'breastfeeding' | 'delivery' | 'nutrition' | 'mental_health';
  categoryLabel: string;
  targetBirthMonth?: string;
  title: string;
  content: string;
  authorName: string;
  authorBaby?: string;
  authorRole?: string;
  isClinicOfficial?: boolean;
  createdAt: string;
  likes: number;
  commentsCount: number;
  comments: ForumComment[];
  isPinned?: boolean;
}

export interface ClinicNewsItem {
  id: string;
  category: 'vaccination' | 'course' | 'oncall' | 'technology';
  categoryLabel: string;
  title: string;
  summary: string;
  fullDescription: string;
  date: string;
  eventDate?: string;
  location?: string;
  badgeText?: string;
  badgeColor?: 'wine' | 'gold' | 'green' | 'blue';
  actionType?: 'register' | 'reminder' | 'info';
  actionLabel?: string;
  registeredCount?: number;
  maxSpots?: number;
  imageUrl?: string;
}

export type ReminderCategory = 'pos_consulta' | 'preparo_exame' | 'medicacao' | 'sinais_alerta' | 'geral';

export interface MedicalReminderItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface MedicalReminder {
  id: string;
  title: string;
  category: ReminderCategory;
  categoryLabel: string;
  professionalName: string;
  professionalRole: string;
  date: string; // YYYY-MM-DD
  consultationRef?: string;
  importance: 'urgent' | 'important' | 'routine';
  content: string;
  checklist?: MedicalReminderItem[];
  medicationSchedule?: string;
  isCustomUserCreated?: boolean;
}

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
