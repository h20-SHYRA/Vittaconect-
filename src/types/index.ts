export type UserMode = 'gestante' | 'saude_feminina';

export type UserRole = 'paciente' | 'profissional' | 'administrador';

export type NavTab =
  | 'home'
  | 'woman_home'
  | 'dashboard'
  | 'prenatal_card'
  | 'calendar'
  | 'symptoms'
  | 'cycle_tracker'
  | 'CycleTracker'
  | 'preventive_screening'
  | 'PreventiveScreening'
  | 'woman_education'
  | 'reminders'
  | 'documents'
  | 'community'
  | 'news'
  | 'education'
  | 'profile';

export type ProfessionalTab =
  | 'constellation'
  | 'agenda'
  | 'metrics'
  | 'patients'
  | 'chat'
  | 'records'
  | 'prescriptions'
  | 'profile';

export interface ProfessionalAppointment {
  id: string;
  patientName: string;
  patientEmail: string;
  appointmentTime: string;
  appointmentDate: string;
  type: 'teleconsulta' | 'presencial' | 'retorno';
  specialty: string;
  status: 'em_andamento' | 'agendado' | 'concluido';
  patientMode: UserMode;
  notes: string;
}

export interface ProfessionalProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'profissional' | 'administrador';
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

export interface PatientProfile {
  id: string;
  userMode: UserMode;
  name: string;
  preferredName: string;
  age: number;
  phone?: string;
  // Gestante fields
  babyNickname?: string;
  babyGender?: 'boy' | 'girl' | 'surprise';
  currentWeek?: number;
  dueDate?: string;
  bloodType?: string;
  isFirstPregnancy?: boolean;
  initialWeight?: number;
  currentWeight?: number;
  heightCm?: number;
  // Saúde da Mulher (Não Gestante) fields
  lastPeriodDate?: string;
  cycleDurationDays?: number;
  periodDurationDays?: number;
  contraceptiveMethod?: string;
  pregnancyGoal?: 'prevent' | 'try_conceive' | 'awareness';
  lifeStage?: 'jovem' | 'reprodutiva' | 'perimenopausa' | 'menopausa';
  // Common Clinical fields
  emergencyContact: string;
  allergies: string;
  doctorName: string;
  doctorCrm: string;
  registeredAt: string;
  // Consent & Compliance (Vittaconect 2.0)
  consentAcceptedAt?: string;
  clinicalDisclaimerAcceptedAt?: string;
  // Accessibility & Assisted Access (PCD / Acesso com Ajuda)
  hasDisability?: boolean;
  disabilityTypes?: string[];
  needsAssistedAccess?: boolean;
  helperName?: string;
  helperRelationship?: string;
  needsLibrasInterpreter?: boolean;
  accessibilityNotes?: string;
}

export interface DailyHealthCheckin {
  id: string;
  date: string;
  mood: 'otima' | 'bem' | 'cansada' | 'ansiosa' | 'desconforto';
  hydrationCups: number;
  hydrationGoal: number;
  sleepHours: number;
  energyLevel: number;
  pelvicFloorDone: boolean;
  supplementsTaken: boolean;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodGlucoseMgDl?: number;
  fetalMovementsCount?: number;
  notes?: string;
}

export interface BirthPlanPreferences {
  preferredBirthType: 'normal_humanizado' | 'cesarea_agendada' | 'sem_preferencia';
  companionName: string;
  painReliefMethods: string[];
  environmentPreferences: string[];
  goldenHourSkinToSkin: boolean;
  delayedCordClamping: boolean;
  breastfeedingFirstHour: boolean;
  specialNotes: string;
  updatedAt: string;
}

export interface SOAPEvolutionEntry {
  id: string;
  patientId: string;
  patientName: string;
  createdAt: string;
  authorName: string;
  authorCouncil: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  riskClassification: 'habitual' | 'intermediario' | 'alto_risco';
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

export interface Appointment {
  id: string;
  title: string;
  professional?: string;
  doctor?: string;
  role?: string;
  specialty?: string;
  type: 'prenatal' | 'telehealth' | 'gynecology' | 'exam' | 'consultation' | 'ultrasound' | 'lab' | 'class' | 'return';
  appointmentCategory?: 'consulta' | 'retorno' | 'exame' | 'teleconsulta';
  clinicalStatus?: 'confirmado' | 'aguardando_confirmacao' | 'cancelado' | 'concluido';
  date: string;
  time: string;
  location: string;
  instructions?: string;
  notes?: string;
  status?: 'upcoming' | 'live_now' | 'completed';
  starred?: boolean;
  checklist?: string[];
  completed?: boolean;
  confirmedByPatient?: boolean;
  rescheduleRequested?: boolean;
}

export type ClinicalDocumentCategory =
  | 'exames'
  | 'receitas'
  | 'atestados'
  | 'documentos'
  | 'resultados';

export interface ClinicalDocumentItem {
  id: string;
  title: string;
  category: ClinicalDocumentCategory;
  categoryLabel: string;
  date: string;
  professional: string;
  professionalCouncil: string;
  status: 'disponivel' | 'assinado_digitalmente' | 'revisado_enfermagem' | 'pendente_analise';
  summary: string;
  details: string[];
  recommendations?: string;
  patientMode?: 'gestante' | 'saude_feminina' | 'ambos';
}

export interface SymptomEntry {
  id: string;
  date: string;
  time: string;
  overallMood?: 'radiant' | 'good' | 'tired' | 'anxious' | 'uncomfortable';
  mood?: 'radiant' | 'calm' | 'tired' | 'anxious' | 'emotional';
  intensity?: 1 | 2 | 3 | 4 | 5;
  symptoms: string[];
  waterGlasses?: number;
  bloodPressure?: string;
  weight?: string;
  notes?: string;
}

export interface EducationalArticle {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  summary: string;
  readTime: string;
  badgeGreen?: boolean;
  content: string[];
  keyTakeaways: string[];
}

export interface MedicalReminder {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  professionalName: string;
  professionalRole: string;
  date: string;
  consultationRef: string;
  importance: 'urgent' | 'important' | 'routine';
  content: string;
  checklist: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  medicationSchedule?: string;
}

export interface VaccineRecord {
  id: string;
  name: string;
  description: string;
  recommendedWeek: string;
  dose: string;
  status: 'completed' | 'scheduled' | 'pending' | 'applied';
  dateApplied?: string;
  batchNumber?: string;
  location: string;
  isMandatory: boolean;
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
  systolic: number;
  diastolic: number;
  pulse: number;
  status: 'normal' | 'attention' | 'alert';
  notes?: string;
}

export interface PrenatalConsultationRecord {
  id: string;
  date: string;
  gestationalWeek: number;
  weightKg: number | string;
  bloodPressure: string;
  uterineHeightCm: number | string;
  fetalHeartRateBpm?: number;
  bcfBpm?: string;
  fetalMovement?: boolean;
  edema: string;
  doctorOrNurse?: string;
  doctorName?: string;
  clinicalNotes?: string;
  notes?: string;
}

export interface ForumPost {
  id: string;
  category: string;
  categoryLabel: string;
  targetBirthMonth?: string;
  title: string;
  content: string;
  authorName: string;
  authorRole?: string;
  authorBaby?: string;
  isClinicOfficial?: boolean;
  createdAt: string;
  likes: number;
  commentsCount: number;
  isPinned?: boolean;
  comments: {
    id: string;
    authorName: string;
    authorRole?: string;
    isClinicOfficial?: boolean;
    content: string;
    createdAt: string;
    likes: number;
  }[];
}

export interface ClinicNewsItem {
  id: string;
  category: string;
  categoryLabel?: string;
  title: string;
  summary: string;
  fullDescription?: string;
  content?: string;
  date: string;
  readTime?: string;
  author?: string;
  authorRole?: string;
  imageTag?: string;
  highlight?: boolean;
  eventDate?: string;
  location?: string;
  badgeText?: string;
  badgeColor?: 'wine' | 'gold' | 'green' | 'blue';
  actionType?: 'reminder' | 'register' | 'info';
  actionLabel?: string;
  registeredCount?: number;
  maxSpots?: number;
  eventSpots?: number;
  isRegistered?: boolean;
}

export interface PreventiveExam {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  recommendedFrequency: string;
  targetAgeRange: string;
  lastDate: string;
  nextDueDate: string;
  status: 'em_dia' | 'proximo_vencer' | 'atrasado';
  lastResult: string;
  laboratoryOrClinic: string;
  importanceDescription: string;
}

export interface WomanEducationalArticle {
  id: string;
  track: string;
  trackLabel: string;
  title: string;
  type: 'article' | 'podcast' | 'video';
  duration: string;
  author: string;
  authorRole: string;
  recommendedAgeRange: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
}

export interface CycleDayLog {
  date: string;
  flow: 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
  symptoms: string[];
  mood: string;
  cervicalMucus?: string;
  hadIntercourse?: boolean;
  notes?: string;
}
