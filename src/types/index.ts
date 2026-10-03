export type UserMode = 'gestante' | 'saude_feminina';

export type NavTab = 
  | 'home' 
  | 'prenatal_card' 
  | 'community' 
  | 'news' 
  | 'calendar' 
  | 'reminders' 
  | 'symptoms' 
  | 'education' 
  | 'profile'
  // Abas de Saúde Feminina (Não Gestante)
  | 'woman_home'
  | 'cycle_tracker'
  | 'preventive_screening'
  | 'woman_education';

export type AppointmentType = 'prenatal' | 'telehealth' | 'exam' | 'ultrasound' | 'gynecology';

export interface PatientProfile {
  id: string;
  userMode: UserMode;
  name: string;
  preferredName: string;
  age: number;
  phone?: string;
  // Campos de gestante (quando userMode === 'gestante')
  babyNickname?: string;
  babyGender?: 'boy' | 'girl' | 'surprise';
  currentWeek?: number;
  dueDate?: string;
  bloodType?: string;
  isFirstPregnancy?: boolean;
  // Campos de saúde feminina (quando userMode === 'saude_feminina')
  lastPeriodDate?: string;
  cycleDurationDays?: number;
  periodDurationDays?: number;
  contraceptiveMethod?: string;
  pregnancyGoal?: 'prevent' | 'try_conceive' | 'awareness';
  lifeStage?: 'jovem' | 'reprodutiva' | 'perimenopausa' | 'menopausa';
  
  emergencyContact: string;
  allergies: string;
  doctorName: string;
  doctorCrm: string;
  registeredAt: string;
  initialWeight?: number;
  currentWeight?: number;
  heightCm?: number;
}

export interface CycleDayLog {
  date: string; // YYYY-MM-DD
  flow?: 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
  symptoms: string[];
  mood?: 'equilibrada' | 'sensivel' | 'irritada' | 'cansada' | 'radiante';
  cervicalMucus?: 'seco' | 'pegajoso' | 'cremoso' | 'clara_de_ovo';
  hadIntercourse?: boolean;
  notes?: string;
}

export interface PreventiveExam {
  id: string;
  name: string;
  category: 'colo_utero' | 'mamas' | 'laboratorial' | 'vacina' | 'imagem';
  categoryLabel: string;
  description: string;
  recommendedFrequency: string; // ex: Anual, A cada 2 anos, Dose única
  targetAgeRange: string; // ex: 25 a 64 anos
  lastDate?: string;
  nextDueDate: string;
  status: 'em_dia' | 'proximo_vencer' | 'atrasado' | 'agendado';
  lastResult?: string;
  laboratoryOrClinic?: string;
  importanceDescription: string;
}

export interface WomanEducationalArticle {
  id: string;
  track: 'saude_intima' | 'menopausa' | 'fertilidade' | 'nutricao_metabolismo';
  trackLabel: string;
  title: string;
  type: 'article' | 'podcast' | 'video';
  duration: string;
  author: string;
  authorRole: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  recommendedAgeRange?: string;
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
  category: 'vaccination' | 'course' | 'oncall' | 'technology' | 'campaign' | 'workshop';
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

export type UserRole = 'paciente' | 'profissional';

export type ProfessionalTab = 'constellation' | 'metrics' | 'agenda' | 'chat' | 'records' | 'profile';

export interface ProfessionalProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'profissional';
  specialty: string;
  councilNumber?: string;
  phone?: string;
  createdAt: string;
  lastLoginAt: string;
  onDuty?: boolean;
}

export interface AccessMetricsData {
  dailyAccessCount: number;
  monthlyAccessCount: number;
  dailyGoal: number;
  monthlyGoal: number;
  updatedAt: string;
}

export interface ProfessionalAppointment {
  id: string;
  patientName: string;
  patientEmail?: string;
  appointmentTime: string;
  appointmentDate: string;
  type: 'teleconsulta' | 'presencial' | 'ultrassom' | 'retorno';
  specialty: string;
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';
  patientMode?: 'gestante' | 'saude_feminina';
  notes?: string;
}

export interface RealtimeChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'paciente' | 'profissional';
  text: string;
  timestamp: string;
  avatar?: string;
}
