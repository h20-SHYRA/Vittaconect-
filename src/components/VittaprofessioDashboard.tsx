import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MessageSquare, 
  FileText, 
  UserCheck, 
  LogOut, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Plus, 
  Send, 
  Paperclip,
  Stethoscope,
  Activity,
  Phone,
  AlertTriangle,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VittacareLogo } from './VittacareLogo';
import { NursingCrest } from './NursingCrest';
import { CircularAccessCounter } from './CircularAccessCounter';
import { NursingConstellationView } from './NursingConstellationView';
import { ProfessionalTab, ProfessionalAppointment } from '../types';
import { 
  useRealtimeChat, 
  useChatDirectory, 
  buildIndividualChatChannelId,
  ChatPatientContact 
} from '../services/realtimeChat';
import { Lock, Users } from 'lucide-react';

export const VittaprofessioDashboard: React.FC = () => {
  const { 
    professionalProfile, 
    logout, 
    updateProfessionalStatus, 
  } = useAuth();
  const { patients } = useChatDirectory();

  const [activeTab, setActiveTab] = useState<ProfessionalTab>('constellation');
  const [isOnDuty, setIsOnDuty] = useState<boolean>(professionalProfile?.onDuty ?? true);
  const [acceptEmergencyCalls, setAcceptEmergencyCalls] = useState<boolean>(true);
  const [allowQuickFitIns, setAllowQuickFitIns] = useState<boolean>(true);
  const [consultationDuration, setConsultationDuration] = useState<number>(30);
  const [scheduleSavedBanner, setScheduleSavedBanner] = useState<boolean>(false);

  // Quadro de Horários Totalmente Ajustável (Configuração Semanal do Profissional)
  const [weeklySchedule, setWeeklySchedule] = useState([
    {
      id: 'seg',
      day: 'Segunda-feira',
      enabled: true,
      startTime: '08:00',
      endTime: '18:00',
      shiftType: 'Plantão + Teleconsulta',
    },
    {
      id: 'ter',
      day: 'Terça-feira',
      enabled: true,
      startTime: '08:00',
      endTime: '18:00',
      shiftType: 'Exclusivo Teleconsulta',
    },
    {
      id: 'qua',
      day: 'Quarta-feira',
      enabled: true,
      startTime: '09:00',
      endTime: '19:00',
      shiftType: 'Consultório Presencial + Online',
    },
    {
      id: 'qui',
      day: 'Quinta-feira',
      enabled: true,
      startTime: '08:00',
      endTime: '18:00',
      shiftType: 'Plantão + Teleconsulta',
    },
    {
      id: 'sex',
      day: 'Sexta-feira',
      enabled: true,
      startTime: '08:00',
      endTime: '17:00',
      shiftType: 'Exclusivo Teleconsulta',
    },
    {
      id: 'sab',
      day: 'Sábado',
      enabled: true,
      startTime: '08:00',
      endTime: '14:00',
      shiftType: 'Plantão Obstétrico / Encaixes',
    },
    {
      id: 'dom',
      day: 'Domingo',
      enabled: false,
      startTime: '08:00',
      endTime: '12:00',
      shiftType: 'Sobreaviso Emergencial',
    },
  ]);

  // Bloqueio Rápido de Horários e Datas Específicas (Férias, Congressos, Folgas)
  const [blockedPeriods, setBlockedPeriods] = useState([
    {
      id: 'blk-1',
      title: 'Congresso Brasileiro de Enfermagem Obstétrica (COBEON)',
      category: 'Congresso',
      startDate: '2026-10-15',
      endDate: '2026-10-17',
      notes: 'Agenda bloqueada para novos agendamentos no Vittaconect.',
    },
    {
      id: 'blk-2',
      title: 'Folga Pós-Plantão 24h',
      category: 'Folga',
      startDate: '2026-10-22',
      endDate: '2026-10-22',
      notes: 'Bloqueio de agenda eletiva; apenas redirecionamento para equipe.',
    },
  ]);
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockCategory, setNewBlockCategory] = useState<'Férias' | 'Congresso' | 'Folga' | 'Reunião Clínica'>('Folga');
  const [newBlockStart, setNewBlockStart] = useState('2026-10-28');
  const [newBlockEnd, setNewBlockEnd] = useState('2026-10-29');

  // Fila de Atendimento Inteligente (Triagem Automatizada e Classificação de Risco)
  const [queueSortMode, setQueueSortMode] = useState<'risk_priority' | 'arrival_order'>('risk_priority');
  const [smartQueue, setSmartQueue] = useState<
    Array<{
      id: string;
      patientName: string;
      patientEmail: string;
      patientMode: 'gestante' | 'saude_feminina';
      clinicalTag: string;
      arrivalTime: string;
      arrivalOrder: number;
      riskLevel: 'vermelho' | 'amarelo' | 'verde';
      chiefComplaint: string;
      vitalSignsSummary: string;
      isPcdAssisted?: boolean;
    }>
  >([
    {
      id: 'q-1',
      patientName: 'Beatriz Costa Oliveira',
      patientEmail: 'beatriz.costa@email.com',
      patientMode: 'gestante',
      clinicalTag: '32ª Semana • Gestante (G2P1)',
      arrivalTime: '08:52',
      arrivalOrder: 2,
      riskLevel: 'vermelho',
      chiefComplaint: 'Queixa aguda: Cefaleia frontal persistente, escotomas visuais e pico pressórico domiciliar.',
      vitalSignsSummary: 'PA: 145x95 mmHg • FC: 96 bpm • Alerta MEOWS Vermelho',
      isPcdAssisted: false,
    },
    {
      id: 'q-2',
      patientName: 'Mariana Silva Santos',
      patientEmail: 'mariana.silva@email.com',
      patientMode: 'gestante',
      clinicalTag: '18ª Semana • Gestante (G1P0)',
      arrivalTime: '08:35',
      arrivalOrder: 1,
      riskLevel: 'amarelo',
      chiefComplaint: 'Náuseas matinais frequentes, leve tontura ao levantar e dúvida sobre suplementação.',
      vitalSignsSummary: 'PA: 110x70 mmHg • Glicemia jejum: 94 mg/dL • Prioridade Moderada',
      isPcdAssisted: true,
    },
    {
      id: 'q-3',
      patientName: 'Juliana Mendes Rocha',
      patientEmail: 'juliana.rocha@email.com',
      patientMode: 'gestante',
      clinicalTag: '36ª Semana • Pré-Natal Termo',
      arrivalTime: '09:04',
      arrivalOrder: 3,
      riskLevel: 'amarelo',
      chiefComplaint: 'Contrações de Braxton-Hicks mais frequentes à noite e dor lombar moderada (EVA 5/10).',
      vitalSignsSummary: 'PA: 122x78 mmHg • BCF: 148 bpm • Mobilograma Normal',
      isPcdAssisted: false,
    },
    {
      id: 'q-4',
      patientName: 'Camila Ferreira Lima',
      patientEmail: 'camila.lima@email.com',
      patientMode: 'saude_feminina',
      clinicalTag: 'Saúde da Mulher • Fase Folicular',
      arrivalTime: '09:10',
      arrivalOrder: 4,
      riskLevel: 'verde',
      chiefComplaint: 'Checagem de resultado de Papanicolau e orientação sobre troca de método anticoncepcional.',
      vitalSignsSummary: 'PA: 115x75 mmHg • Sem queixas álgicas • Baixo Risco',
      isPcdAssisted: false,
    },
  ]);

  // Questionários de Pré-Consulta (Disparo Rápido & Respostas "Mastigadas")
  const [selectedPreFormPatient, setSelectedPreFormPatient] = useState<string>('Mariana Silva Santos');
  const [selectedPreFormTemplate, setSelectedPreFormTemplate] = useState<
    'diabetes_gestacional' | 'humor_epds' | 'alerta_obstetrico' | 'ginecologico_ciclo'
  >('diabetes_gestacional');
  const [preFormDispatchedFeedback, setPreFormDispatchedFeedback] = useState<string | null>(null);
  const [preConsultationDigestedResponses, setPreConsultationDigestedResponses] = useState([
    {
      id: 'pre-1',
      patientName: 'Beatriz Costa Oliveira (32ª Sem)',
      questionnaireTitle: 'Checklist de Sinais de Alerta Obstétrico (Pré-Consulta)',
      submittedAt: 'Preenchido há 25 min no Vittaconect',
      riskFlag: 'vermelho' as const,
      digestedBullets: [
        'Pressão Arterial Aferida em Casa: 145x95 mmHg (Elevada)',
        'Sintomas Neurológicos/Visuais: Relata cefaleia frontal e pontos brilhantes na visão',
        'Movimentos Fetais (Mobilograma): 8 movimentos na última hora (Preservado)',
        'Edema: Inchaço moderado em membros inferiores e mãos desde ontem',
      ],
      clinicalRecommendation: 'Conduta imediata: Priorizar atendimento no topo da fila, reavaliar PA e rastreio de pré-eclâmpsia.',
    },
    {
      id: 'pre-2',
      patientName: 'Mariana Silva Santos (18ª Sem)',
      questionnaireTitle: 'Rastreio de Diabetes Gestacional & Rotina Nutricional',
      submittedAt: 'Preenchido há 1h no Vittaconect',
      riskFlag: 'amarelo' as const,
      digestedBullets: [
        'Glicemia de Jejum Recente: 94 mg/dL (Limítrofe — corte gestacional < 92 mg/dL)',
        'Histórico Familiar: Mãe com diabetes tipo 2; ganho ponderal de +2.1 kg até a 18ª semana',
        'Sintomas Associados: Polidipsia leve à tarde; náuseas matinais em remissão',
        'Adesão à Suplementação: Uso regular de Metilfolato e Sulfato Ferroso',
      ],
      clinicalRecommendation: 'Conduta sugerida: Solicitar TOTG 75g, orientar fracionamento de carboidratos de baixo índice glicêmico.',
    },
    {
      id: 'pre-3',
      patientName: 'Camila Ferreira Lima (Saúde da Mulher)',
      questionnaireTitle: 'Triagem Ginecológica & Escala de Humor Pré-Consulta',
      submittedAt: 'Preenchido há 2h no Vittaconect',
      riskFlag: 'verde' as const,
      digestedBullets: [
        'Ciclo Menstrual: Regular (28 dias), fluxo moderado de 4 dias sem dismenorreia incapacitante',
        'Escala de Humor / Bem-Estar: 3 pontos (Estável, sono reparador, sem queixas ansiosas)',
        'Objetivo Reprodutivo: Deseja avaliar transição de pílula oral para DIU de cobre/prata',
      ],
      clinicalRecommendation: 'Conduta sugerida: Apresentar protocolo de inserção de DIU e revisar citologia oncótica.',
    },
  ]);

  // Selected Client/Patient for Individual 1-on-1 Chat
  const [selectedChatPatientId, setSelectedChatPatientId] = useState<string>(
    patients[0]?.id || 'pat-mariana'
  );

  const selectedChatPatient: ChatPatientContact =
    patients.find((p) => p.id === selectedChatPatientId) ||
    patients[0] || {
      id: 'pat-mariana',
      name: 'Mariana Silva Santos',
      email: 'mariana.silva@email.com',
      mode: 'gestante',
      clinicalSummary: '18ª Semana • Gestante (G1P0)',
    };

  // Unique 1-on-1 Channel ID for this specific Professional and this specific Client
  const profIdentifier =
    professionalProfile?.email || professionalProfile?.uid || 'enf.marcelovittaprofessio@gmail.com';
  const patIdentifier = selectedChatPatient.email || selectedChatPatient.id;
  const individualChannelId = buildIndividualChatChannelId(profIdentifier, patIdentifier);

  // Real-time Individual Chat with Selected Client via Cloud Firestore
  const { messages: realtimeChatMsgs, sendMessage: sendRealtimeMessage } = useRealtimeChat(
    individualChannelId,
    {
      professionalId: profIdentifier,
      professionalName: professionalProfile?.displayName || 'Enf. Marcelo',
      professionalSpecialty:
        professionalProfile?.specialty || 'Enfermagem Obstétrica, Pré-Natal & Neonatologia',
      patientId: patIdentifier,
      patientName: selectedChatPatient.name,
      patientSummary: selectedChatPatient.clinicalSummary,
    }
  );
  const [inputChatText, setInputChatText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [realtimeChatMsgs, activeTab, individualChannelId]);

  // Agenda mock data with interactive status
  const [appointments, setAppointments] = useState<ProfessionalAppointment[]>([
    {
      id: 'apt-1',
      patientName: 'Mariana Silva Santos',
      patientEmail: 'mariana.silva@email.com',
      appointmentTime: '09:00',
      appointmentDate: 'Hoje',
      type: 'teleconsulta',
      specialty: 'Pré-Natal de Enfermagem Obstétrica (18ª Semana)',
      status: 'em_andamento',
      patientMode: 'gestante',
      notes: 'Queixa de cefaleia leve e náuseas matinais. Acompanhamento com Enf. Marcelo e Enfª. Letícia.',
    },
    {
      id: 'apt-2',
      patientName: 'Camila Ferreira Lima',
      patientEmail: 'camila.lima@email.com',
      appointmentTime: '10:30',
      appointmentDate: 'Hoje',
      type: 'presencial',
      specialty: 'Enfermagem Ginecológica & Citologia Oncótica',
      status: 'agendado',
      patientMode: 'saude_feminina',
      notes: 'Coleta de preventivo anual com Enfª. Bianca. Acolhimento e autoexame.',
    },
    {
      id: 'apt-3',
      patientName: 'Juliana Mendes Rocha',
      patientEmail: 'juliana.rocha@email.com',
      appointmentTime: '14:00',
      appointmentDate: 'Hoje',
      type: 'teleconsulta',
      specialty: 'Orientação de Amamentação & Puerpério',
      status: 'agendado',
      patientMode: 'gestante',
      notes: 'Teleorientação com Enfª. Stephanie sobre pega correta e ordenha de colostro.',
    },
    {
      id: 'apt-4',
      patientName: 'Larissa Alencar',
      patientEmail: 'larissa.a@email.com',
      appointmentTime: '16:00',
      appointmentDate: 'Hoje',
      type: 'retorno',
      specialty: 'Avaliação de Exames Laboratoriais (Glicemia de Jejum)',
      status: 'agendado',
      patientMode: 'gestante',
      notes: 'Curva glicêmica normalizada após ajuste dietético com Enfª. Letícia.',
    },
  ]);

  const [activeCallAppointment, setActiveCallAppointment] = useState<ProfessionalAppointment | null>(null);

  // New Prescription quick form
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionPatient, setPrescriptionPatient] = useState('Mariana Silva Santos');
  const [prescriptionContent, setPrescriptionContent] = useState(
    '1. Sulfato Ferroso 40mg - 1 comprimido ao dia em jejum\n2. Metilfolato 400mcg + Vitamina D3 2000 UI - 1 dose após o café\n3. Hidratação reforçada: Mínimo 2 litros de água/dia'
  );
  const [prescriptionSuccess, setPrescriptionSuccess] = useState(false);

  const handleToggleDuty = async () => {
    const nextStatus = !isOnDuty;
    setIsOnDuty(nextStatus);
    await updateProfessionalStatus(nextStatus);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChatText.trim() || sendingMsg) return;

    setSendingMsg(true);
    await sendRealtimeMessage(
      inputChatText.trim(),
      'profissional',
      professionalProfile?.displayName || 'Enf. Marcelo',
      profIdentifier,
      patIdentifier,
      selectedChatPatient.name
    );
    setInputChatText('');
    setSendingMsg(false);
  };

  const handleOpenIndividualChatWithPatient = (patientNameOrEmail: string) => {
    const found = patients.find(
      (p) =>
        p.name.toLowerCase() === patientNameOrEmail.toLowerCase() ||
        p.email.toLowerCase() === patientNameOrEmail.toLowerCase()
    );
    if (found) {
      setSelectedChatPatientId(found.id);
    }
    setActiveTab('chat');
  };

  const handlePrescribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPrescriptionSuccess(true);
    setTimeout(() => {
      setPrescriptionSuccess(false);
      setShowPrescriptionModal(false);
    }, 1800);
  };

  // Update a day's schedule in the adjustable weekly schedule grid
  const handleUpdateScheduleDay = (
    dayId: string,
    field: 'enabled' | 'startTime' | 'endTime' | 'shiftType',
    value: boolean | string
  ) => {
    setWeeklySchedule((prev) =>
      prev.map((item) => (item.id === dayId ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveScheduleSettings = () => {
    setScheduleSavedBanner(true);
    setTimeout(() => setScheduleSavedBanner(false), 2500);
  };

  // Add a blocked period (vacation, congress, day off)
  const handleAddBlockedPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockStart || !newBlockEnd) return;
    const titleToUse =
      newBlockTitle.trim() ||
      `${newBlockCategory} • Agenda Bloqueada (${newBlockStart} a ${newBlockEnd})`;
    setBlockedPeriods((prev) => [
      {
        id: `blk-${Date.now()}`,
        title: titleToUse,
        category: newBlockCategory,
        startDate: newBlockStart,
        endDate: newBlockEnd,
        notes: 'Período bloqueado pelo profissional — agendamentos suspensos no Vittaconect.',
      },
      ...prev,
    ]);
    setNewBlockTitle('');
  };

  const handleQuickPresetBlock = (
    title: string,
    category: 'Férias' | 'Congresso' | 'Folga' | 'Reunião Clínica',
    startDate: string,
    endDate: string
  ) => {
    setBlockedPeriods((prev) => [
      {
        id: `blk-${Date.now()}`,
        title,
        category,
        startDate,
        endDate,
        notes: 'Bloqueio rápido ativado com 1 clique pelo profissional.',
      },
      ...prev,
    ]);
  };

  const handleRemoveBlockedPeriod = (id: string) => {
    setBlockedPeriods((prev) => prev.filter((b) => b.id !== id));
  };

  // Change patient risk level in Smart Waiting Queue
  const handleChangeQueueRisk = (id: string, newRisk: 'vermelho' | 'amarelo' | 'verde') => {
    setSmartQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, riskLevel: newRisk } : item))
    );
  };

  // Sorted Smart Queue based on selected mode (Risk Priority vs Arrival Order)
  const sortedSmartQueue = [...smartQueue].sort((a, b) => {
    if (queueSortMode === 'arrival_order') {
      return a.arrivalOrder - b.arrivalOrder;
    }
    const riskWeight = { vermelho: 3, amarelo: 2, verde: 1 };
    if (riskWeight[b.riskLevel] !== riskWeight[a.riskLevel]) {
      return riskWeight[b.riskLevel] - riskWeight[a.riskLevel];
    }
    return a.arrivalOrder - b.arrivalOrder;
  });

  // Dispatch Pre-Consultation Questionnaire to patient's Vittaconect & Individual Chat
  const handleDispatchPreConsultationForm = async () => {
    const templateLabels: Record<typeof selectedPreFormTemplate, string> = {
      diabetes_gestacional: 'Rastreio de Diabetes Gestacional, Curva Glicêmica & Dieta',
      humor_epds: 'Escala de Humor Perinatal & Bem-Estar Emocional (EPDS)',
      alerta_obstetrico: 'Checklist de Sinais de Alerta Obstétrico (PA, Contrações & Mobilograma)',
      ginecologico_ciclo: 'Questionário Ginecológico Pré-Consulta (Ciclo, Fluxo & Anticoncepção)',
    };
    const chosenTitle = templateLabels[selectedPreFormTemplate];

    const targetPat =
      patients.find((p) => p.name.toLowerCase().includes(selectedPreFormPatient.toLowerCase())) ||
      selectedChatPatient;

    await sendRealtimeMessage(
      `📝 [Questionário Rápido de Pré-Consulta • Vittaprofessio] Olá, ${targetPat.name.split(' ')[0]}! ${professionalProfile?.displayName || 'Enf. Marcelo'} enviou o formulário "${chosenTitle}" para você responder antes da sua consulta. Suas respostas chegam estruturadas para agilizar nosso atendimento!`,
      'profissional',
      professionalProfile?.displayName || 'Enf. Marcelo',
      profIdentifier,
      targetPat.email || targetPat.id,
      targetPat.name
    );

    setPreFormDispatchedFeedback(
      `Formulário "${chosenTitle}" disparado com sucesso para o Vittaconect de ${targetPat.name}!`
    );
    setTimeout(() => setPreFormDispatchedFeedback(null), 3200);
  };

  return (
    <div className="min-h-screen vitta-pearl-blue-bg text-[#0A2647] flex flex-col font-sans">
      {/* EXTREMITY TOP: Premium Pearl Light Blue Header with Metallic Sapphire Blue Borders & Accents */}
      <header className="vitta-pearl-blue-header text-[#0A2647] border-b-2 border-[#144272] sticky top-0 z-40 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Brand & Crest Group */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-2xl vitta-pearl-white-card flex items-center gap-2">
              <VittacareLogo size="sm" showSubtitle={false} inverted={false} />
              <div className="w-[1.5px] h-6 bg-[#144272]/30" />
              <NursingCrest size="sm" variant="silver" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg sm:text-xl text-[#0A2647] tracking-wide">
                  Vittaprofessio
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-lg vitta-metallic-blue-badge">
                  Corpo de Enfermagem
                </span>
              </div>
              <span className="text-[11px] text-[#144272] font-semibold block leading-none mt-0.5">
                Clínica Vittacare • Sistema de Enfermagem Integrado
              </span>
            </div>
          </div>

          {/* Right Profile & Duty Control */}
          <div className="flex items-center gap-2.5">
            {/* Google Meet quick link */}
            <a
              href="https://meet.google.com/vit-care-obst"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold vitta-pearl-button"
              title="Abrir sala oficial no Google Meet"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Video className="w-3.5 h-3.5 text-[#144272]" />
              <span>Google Meet</span>
            </a>

            {/* Duty toggle */}
            <button
              onClick={handleToggleDuty}
              className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold vitta-pearl-button cursor-pointer ${
                isOnDuty ? 'text-emerald-800' : 'text-slate-600'
              }`}
              title="Alternar disponibilidade de plantão"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isOnDuty ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>{isOnDuty ? 'Em Plantão Ativo' : 'Em Pausa'}</span>
            </button>

            {/* Professional Identity Capsule */}
            <div className="hidden lg:flex flex-col text-right leading-tight">
              <span className="text-xs font-extrabold text-[#0A2647]">
                {professionalProfile?.displayName || 'Enf. Marcelo'}
              </span>
              <span className="text-[11px] text-[#144272] font-medium">
                {professionalProfile?.specialty || 'Enfermagem Obstétrica & Pré-Natal'} • {professionalProfile?.councilNumber || 'COREN-SP 000.002 (Fictício)'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl vitta-pearl-button text-xs font-bold cursor-pointer"
              title="Sair do painel profissional"
            >
              <LogOut className="w-3.5 h-3.5 text-[#144272]" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* FULL LATERAL WIDTH PEARL BLUE BAR: CREDENCIAIS DO PROFISSIONAL AUTENTICADO */}
        <div className="w-full vitta-pearl-blue-subbar text-[#0A2647] border-t-2 border-b-2 border-[#144272] px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-200" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#0A2647]">
                Profissional Autenticado:
              </span>
              <span className="text-xs font-bold px-3 py-0.5 rounded-lg vitta-metallic-blue-badge">
                {professionalProfile?.displayName || 'Enf. Marcelo'}
              </span>
              <span className="text-[11px] text-[#0A2647] font-semibold hidden sm:inline">
                • {professionalProfile?.specialty || 'Enfermagem Obstétrica, Pré-Natal & Neonatologia'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[11px] text-[#144272] font-medium">
                Registro: <strong className="text-[#0A2647]">{professionalProfile?.councilNumber || 'COREN-SP 000.002 (Fictício)'}</strong>
              </span>
              <div className="w-[1.5px] h-4 bg-[#144272]/30 hidden md:block" />
              <div className="text-[11px] text-[#144272] font-medium">
                E-mail Institucional: <strong className="text-[#0A2647] font-mono">{professionalProfile?.email || 'Enf.marcelovittaprofessio@gmail.com'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Navigation Tabs (Pearlescent Light Blue with Metallic Sapphire Active State & Borders) */}
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2.5 bg-gradient-to-r from-[#D4EAFC] via-[#E5F3FE] to-[#C8E2FA]">
          {[
            { id: 'constellation', label: 'Constelação Clínica', icon: Sparkles },
            { id: 'agenda', label: 'Agenda, Triagem & Horários', icon: Calendar },
            { id: 'metrics', label: 'Acessos & Indicadores', icon: TrendingUp },
            { id: 'chat', label: 'Chat Individual 1:1', icon: MessageSquare },
            { id: 'records', label: 'Prontuários & Prescrições', icon: FileText },
            { id: 'profile', label: 'Perfil Profissional & Plantão', icon: Stethoscope },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ProfessionalTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'vitta-metallic-blue-badge scale-102'
                    : 'vitta-pearl-button'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#7DD3FC]' : 'text-[#144272]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN CONTENT BODY */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Welcome Professional Banner (Pearly White Surface Card with Metallic Sapphire Blue Borders & Details) */}
        <div className="p-6 sm:p-7 rounded-3xl vitta-pearl-white-card text-[#0A2647] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-gradient-to-br from-[#93C5FD]/35 via-[#BAE6FD]/25 to-transparent blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full vitta-metallic-blue-badge text-xs font-bold">
              <NursingCrest size="sm" variant="silver" />
              <span>Painel Vittaprofessio • Enfermagem Obstétrica & Ginecológica</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A2647]">
              Bem-vindo(a), {professionalProfile?.displayName || 'Enf. Marcelo'}!
            </h1>
            <p className="text-xs sm:text-sm text-[#144272] max-w-2xl leading-relaxed font-medium">
              Ambiente clínico premium com <strong>Gestão de Agenda & Horários Ajustáveis</strong>, <strong>Bloqueio de Férias/Folgas</strong>, <strong>Status de Plantão Ativo</strong>, <strong>Fila de Atendimento Inteligente por Risco</strong> e <strong>Questionários de Pré-Consulta</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto relative z-10">
            <button
              type="button"
              onClick={() => setActiveTab('agenda')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl vitta-pearl-button text-xs font-bold cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#144272]" />
              <span>Agenda, Fila & Horários</span>
            </button>
            <a
              href="https://meet.google.com/vit-care-obst"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl vitta-pearl-button text-xs font-bold cursor-pointer"
            >
              <Video className="w-4 h-4 text-[#144272]" />
              <span>Google Meet ao Vivo</span>
            </a>
            <button
              onClick={() => setShowPrescriptionModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl vitta-metallic-blue-badge hover:brightness-110 text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#7DD3FC]" />
              <span>Nova Prescrição</span>
            </button>
          </div>
        </div>

        {/* TAB 0: CONSTELAÇÃO CLÍNICA DE ENFERMAGEM */}
        {activeTab === 'constellation' && (
          <NursingConstellationView />
        )}

        {/* TAB 1: ACESSOS & INDICADORES (CONTAINS THE CIRCULAR ACCESS COUNTER) */}
        {activeTab === 'metrics' && (
          <div className="space-y-6 animate-fadeIn">
            {/* The Mandatory Circular Access Counter */}
            <CircularAccessCounter />

            {/* Quick Metrics Grid (Pearly White Cards with Metallic Sapphire Borders) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl vitta-pearl-white-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#144272]">
                    Consultas Hoje
                  </span>
                  <div className="p-1.5 rounded-xl vitta-metallic-blue-badge">
                    <Calendar className="w-4 h-4 text-[#7DD3FC]" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#0A2647]">04</span>
                  <span className="text-xs text-emerald-700 font-bold">1 em andamento</span>
                </div>
                <p className="text-[11px] text-[#144272] font-medium mt-2 pt-2 border-t border-[#144272]/20">
                  3 teleconsultas • 1 presencial no consultório
                </p>
              </div>

              <div className="p-5 rounded-3xl vitta-pearl-white-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#144272]">
                    Canais de Chat 1:1
                  </span>
                  <div className="p-1.5 rounded-xl vitta-metallic-blue-badge">
                    <MessageSquare className="w-4 h-4 text-[#7DD3FC]" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#0A2647]">{patients.length}</span>
                  <span className="text-xs text-[#144272] font-bold">Clientes conectadas</span>
                </div>
                <p className="text-[11px] text-[#144272] font-medium mt-2 pt-2 border-t border-[#144272]/20">
                  Conversas individuais privadas por profissional e cliente
                </p>
              </div>

              <div className="p-5 rounded-3xl vitta-pearl-white-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#144272]">
                    Índice de Satisfação
                  </span>
                  <div className="p-1.5 rounded-xl vitta-metallic-blue-badge">
                    <ShieldCheck className="w-4 h-4 text-[#7DD3FC]" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#0A2647]">99.4%</span>
                  <span className="text-xs text-emerald-700 font-bold">Excelente</span>
                </div>
                <p className="text-[11px] text-[#144272] font-medium mt-2 pt-2 border-t border-[#144272]/20">
                  Avaliação das gestantes e pacientes ginecológicas
                </p>
              </div>
            </div>
            {/* Painel de Triagem e Alerta de Risco Obstétrico/Ginecológico & Prioridade PCD */}
            <div className="p-6 rounded-3xl vitta-pearl-white-card space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#144272]/20 pb-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full vitta-metallic-blue-badge text-[11px] font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#7DD3FC]" />
                    <span>Triagem Inteligente • Vigilância Obstétrica, Ginecológica & PCD</span>
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#0A2647]">
                    Painel de Triagem e Alerta de Risco Clínico
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('constellation')}
                  className="px-3.5 py-2 rounded-xl vitta-pearl-button text-xs font-bold cursor-pointer self-start sm:self-auto"
                >
                  Abrir Constelação & Escalas (Glasgow / GDS-15 / EPDS)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-500 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-600 text-white">
                      Atenção Obstétrica • MEOWS / PA
                    </span>
                    <span className="text-[11px] font-bold text-amber-900">Prioridade Alta</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0A2647]">
                    Beatriz Costa Oliveira (32ª Semana)
                  </h4>
                  <p className="text-[11px] text-amber-950 leading-relaxed">
                    Relato de edema vespertino leve em MMII e oscilação pressórica (130x85 mmHg). Recomendado monitorar curva pressórica e aplicar Escala MEOWS/EPDS.
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => {
                        const target = patients.find((p) => p.name.toLowerCase().includes('beatriz'));
                        if (target) setSelectedChatPatientId(target.id);
                        setActiveTab('chat');
                      }}
                      className="px-3 py-1.5 rounded-xl vitta-metallic-blue-badge text-[11px] font-bold text-white cursor-pointer"
                    >
                      Chamar no Chat 1:1
                    </button>
                    <button
                      onClick={() => setActiveTab('constellation')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-amber-600 text-[11px] font-bold text-amber-950 cursor-pointer"
                    >
                      Avaliar na Constelação
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl vitta-pearl-blue-subbar border-2 border-[#144272] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md vitta-metallic-blue-badge text-white">
                      ♿ Prioridade PCD / Acessibilidade
                    </span>
                    <span className="text-[11px] font-bold text-[#0A2647]">Acesso Assistido</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0A2647]">
                    Atendimento Adaptado & Intérprete de Libras
                  </h4>
                  <p className="text-[11px] text-[#144272] font-medium leading-relaxed">
                    Pacientes com suporte de acessibilidade ou acompanhante contam com alerta prioritário na fila de teleconsulta e leitura assistida por voz.
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="px-3 py-1.5 rounded-xl vitta-pearl-button text-[11px] font-bold cursor-pointer"
                    >
                      Ver Canais de Chat 1:1
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/90 border-2 border-emerald-500 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-700 text-white">
                      Rastreio Emocional • EPDS & GDS-15
                    </span>
                    <span className="text-[11px] font-bold text-emerald-900">Em Dia</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0A2647]">
                    Mariana Silva Santos (18ª Semana)
                  </h4>
                  <p className="text-[11px] text-emerald-950 leading-relaxed">
                    Sinais vitais estáveis (PA 110x70 mmHg, BCF 144 bpm). Escalas de Glasgow (15/15), Edimburgo (EPDS) e GDS-15 disponíveis para atualização.
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('constellation')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-[11px] font-bold text-white cursor-pointer"
                    >
                      Aplicar Escala EPDS / GDS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GESTÃO DE AGENDA, DISPONIBILIDADE, FILA INTELIGENTE & PRÉ-CONSULTA */}
        {activeTab === 'agenda' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. STATUS DE ATENDIMENTO ("PLANTÃO ATIVO" / EMERGÊNCIAS & ENCAIXES RÁPIDOS) */}
            <div className="p-5 sm:p-6 rounded-3xl vitta-pearl-white-card space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-[#144272]/20 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full vitta-metallic-blue-badge text-[11px] font-bold mb-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#7DD3FC]" />
                    <span>Gestão de Agenda, Disponibilidade & Triagem Automatizada</span>
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A2647]">
                    Status de Atendimento, Fila Inteligente & Quadro de Horários
                  </h2>
                  <p className="text-xs text-[#144272] font-medium">
                    Controle seu status de plantão ativo, gerencie a fila por risco obstétrico/ginecológico, dispare questionários de pré-consulta e ajuste seus horários
                  </p>
                </div>

                {/* Main Liga/Desliga Button for "Plantão Ativo" */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleToggleDuty}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold border-2 transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
                      isOnDuty
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-400'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${isOnDuty ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
                    <span>
                      {isOnDuty ? 'PLANTÃO ATIVO: LIGADO (DISPONÍVEL)' : 'PLANTÃO ATIVO: DESLIGADO (PAUSA)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Quick Availability Switches: Emergency Calls, Quick Fit-ins & Consultation Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl vitta-pearl-blue-subbar border-2 border-[#144272] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-extrabold text-[#0A2647] block">
                      🚨 Chamadas de Emergência
                    </span>
                    <span className="text-[11px] text-[#144272] font-medium">
                      Sinaliza disponibilidade imediata para urgências obstétricas
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAcceptEmergencyCalls(!acceptEmergencyCalls)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 cursor-pointer transition-all shrink-0 ${
                      acceptEmergencyCalls && isOnDuty
                        ? 'vitta-metallic-blue-badge text-white'
                        : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    {acceptEmergencyCalls && isOnDuty ? 'Ligado' : 'Desligado'}
                  </button>
                </div>

                <div className="p-4 rounded-2xl vitta-pearl-blue-subbar border-2 border-[#144272] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-extrabold text-[#0A2647] block">
                      ⚡ Encaixes Rápidos no Dia
                    </span>
                    <span className="text-[11px] text-[#144272] font-medium">
                      Permite que pacientes entrem na fila dinâmica de encaixe
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllowQuickFitIns(!allowQuickFitIns)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 cursor-pointer transition-all shrink-0 ${
                      allowQuickFitIns && isOnDuty
                        ? 'vitta-metallic-blue-badge text-white'
                        : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    {allowQuickFitIns && isOnDuty ? 'Liberado' : 'Bloqueado'}
                  </button>
                </div>

                <div className="p-4 rounded-2xl vitta-pearl-blue-subbar border-2 border-[#144272] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-extrabold text-[#0A2647] block">
                      ⏱️ Tempo Padrão de Consulta
                    </span>
                    <span className="text-[11px] text-[#144272] font-medium">
                      Intervalo automático da grade de agendamento
                    </span>
                  </div>
                  <select
                    value={consultationDuration}
                    onChange={(e) => setConsultationDuration(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-xl border-2 border-[#144272] bg-white text-xs font-extrabold text-[#0A2647] cursor-pointer"
                  >
                    <option value={20}>20 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. FILA DE ATENDIMENTO INTELIGENTE (TRIAGEM AUTOMATIZADA E CLASSIFICAÇÃO DE RISCO) */}
            <div className="p-5 sm:p-6 rounded-3xl vitta-pearl-white-card space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#144272]/20 pb-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#144272]" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#144272]">
                      Triagem Automatizada • Protocolo Obstétrico & Ginecológico
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0A2647] mt-0.5">
                    Fila de Atendimento Inteligente ({sortedSmartQueue.length} Pacientes na Sala de Espera)
                  </h3>
                  <p className="text-xs text-[#144272] font-medium">
                    Gestantes com queixas agudas aparecem automaticamente no topo em destaque vermelho ou amarelo
                  </p>
                </div>

                {/* Sort Mode Selector: Risk Priority vs Arrival Order */}
                <div className="flex items-center gap-1.5 vitta-pearl-blue-subbar p-1.5 rounded-2xl border-2 border-[#144272] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setQueueSortMode('risk_priority')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      queueSortMode === 'risk_priority'
                        ? 'vitta-metallic-blue-badge text-white'
                        : 'text-[#0A2647] hover:bg-white/80'
                    }`}
                  >
                    🚨 Prioridade de Risco
                  </button>
                  <button
                    type="button"
                    onClick={() => setQueueSortMode('arrival_order')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      queueSortMode === 'arrival_order'
                        ? 'vitta-metallic-blue-badge text-white'
                        : 'text-[#0A2647] hover:bg-white/80'
                    }`}
                  >
                    🕒 Ordem de Chegada
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {sortedSmartQueue.map((item, idx) => {
                  const riskStyles = {
                    vermelho: {
                      card: 'bg-rose-50/95 border-2 border-rose-600 shadow-md',
                      badge: 'bg-rose-600 text-white border-rose-800',
                      label: '🔴 VERMELHO • EMERGÊNCIA / QUEIXA AGUDA',
                    },
                    amarelo: {
                      card: 'bg-amber-50/95 border-2 border-amber-500 shadow-sm',
                      badge: 'bg-amber-500 text-white border-amber-700',
                      label: '🟡 AMARELO • URGÊNCIA MODERADA / PRIORIDADE',
                    },
                    verde: {
                      card: 'bg-emerald-50/90 border-2 border-emerald-500',
                      badge: 'bg-emerald-600 text-white border-emerald-800',
                      label: '🟢 VERDE • BAIXO RISCO / ROTINA ELETIVA',
                    },
                  }[item.riskLevel];

                  return (
                    <div key={item.id} className={`p-4 sm:p-5 rounded-2xl transition-all ${riskStyles.card}`}>
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-[#0A2647] text-white">
                              #{idx + 1} na Fila
                            </span>
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${riskStyles.badge}`}>
                              {riskStyles.label}
                            </span>
                            <span className="text-xs font-bold text-[#0A2647]">
                              • Chegada: {item.arrivalTime}
                            </span>
                            {item.isPcdAssisted && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md vitta-metallic-blue-badge text-white">
                                ♿ PCD / Acesso Assistido
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm sm:text-base font-serif font-bold text-[#0A2647]">
                              {item.patientName}
                            </h4>
                            <span className="text-xs font-bold text-[#144272]">
                              ({item.clinicalTag})
                            </span>
                          </div>

                          <p className="text-xs text-[#0A2647] font-semibold leading-relaxed">
                            <strong>Motivo / Queixa na Triagem:</strong> {item.chiefComplaint}
                          </p>
                          <span className="text-[11px] font-mono font-bold text-[#144272] block">
                            📊 Parâmetros Automáticos: {item.vitalSignsSummary}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-2 shrink-0">
                          {/* Reclassify Risk Level on the fly */}
                          <div className="flex items-center gap-1 bg-white/90 px-2.5 py-1 rounded-xl border border-[#144272]/40 text-[11px]">
                            <span className="font-bold text-[#0A2647] mr-1">Classificação:</span>
                            <button
                              type="button"
                              onClick={() => handleChangeQueueRisk(item.id, 'vermelho')}
                              className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                                item.riskLevel === 'vermelho' ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-100'
                              }`}
                            >
                              Vermelho
                            </button>
                            <button
                              type="button"
                              onClick={() => handleChangeQueueRisk(item.id, 'amarelo')}
                              className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                                item.riskLevel === 'amarelo' ? 'bg-amber-500 text-white' : 'text-amber-800 hover:bg-amber-100'
                              }`}
                            >
                              Amarelo
                            </button>
                            <button
                              type="button"
                              onClick={() => handleChangeQueueRisk(item.id, 'verde')}
                              className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                                item.riskLevel === 'verde' ? 'bg-emerald-600 text-white' : 'text-emerald-800 hover:bg-emerald-100'
                              }`}
                            >
                              Verde
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenIndividualChatWithPatient(item.patientName)}
                              className="px-3 py-2 rounded-xl vitta-pearl-button text-xs font-bold cursor-pointer flex items-center gap-1.5"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-[#144272]" />
                              <span>Chat 1:1</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActiveCallAppointment({
                                  id: item.id,
                                  patientName: item.patientName,
                                  patientEmail: item.patientEmail,
                                  appointmentTime: item.arrivalTime,
                                  appointmentDate: 'Hoje (Fila Inteligente)',
                                  type: 'teleconsulta',
                                  specialty: item.clinicalTag,
                                  status: 'em_andamento',
                                  patientMode: item.patientMode,
                                  notes: item.chiefComplaint,
                                })
                              }
                              className="px-3.5 py-2 rounded-xl vitta-metallic-blue-badge text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
                            >
                              <Video className="w-3.5 h-3.5 text-[#7DD3FC]" />
                              <span>Atender Agora</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. QUESTIONÁRIOS DE PRÉ-CONSULTA (DISPARO RÁPIDO & RESPOSTAS "MASTIGADAS") */}
            <div className="p-5 sm:p-6 rounded-3xl vitta-pearl-white-card space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#144272]/20 pb-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full vitta-metallic-blue-badge text-[11px] font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#7DD3FC]" />
                    <span>Anamnese Antecipada • Vittaconect ↔ Vittaprofessio</span>
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0A2647]">
                    Questionários Rápidos de Pré-Consulta & Respostas Mastigadas
                  </h3>
                  <p className="text-xs text-[#144272] font-medium">
                    Dispare formulários rápidos para a paciente preencher nas horas que antecedem a consulta e receba o resumo estruturado pronto para análise
                  </p>
                </div>
              </div>

              {/* Dispatch Bar */}
              <div className="p-4 rounded-2xl vitta-pearl-blue-subbar border-2 border-[#144272] space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-4">
                    <label className="text-xs font-extrabold text-[#0A2647] block mb-1">
                      1. Selecionar Paciente (Vittaconect):
                    </label>
                    <select
                      value={selectedPreFormPatient}
                      onChange={(e) => setSelectedPreFormPatient(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-[#144272] bg-white text-xs font-bold text-[#0A2647]"
                    >
                      {patients.map((pat) => (
                        <option key={pat.id} value={pat.name}>
                          {pat.name} ({pat.clinicalSummary})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-5">
                    <label className="text-xs font-extrabold text-[#0A2647] block mb-1">
                      2. Protocolo do Questionário de Pré-Consulta:
                    </label>
                    <select
                      value={selectedPreFormTemplate}
                      onChange={(e) => setSelectedPreFormTemplate(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-[#144272] bg-white text-xs font-bold text-[#0A2647]"
                    >
                      <option value="diabetes_gestacional">
                        🩸 Rastreio de Diabetes Gestacional, Glicemia & Dieta
                      </option>
                      <option value="alerta_obstetrico">
                        🤰 Checklist de Sinais de Alerta Obstétrico (PA, Contrações, Mobilograma)
                      </option>
                      <option value="humor_epds">
                        🧠 Escala de Humor Perinatal & Bem-Estar Emocional (EPDS)
                      </option>
                      <option value="ginecologico_ciclo">
                        🌸 Questionário Ginecológico Pré-Consulta (Ciclo, Fluxo & Anticoncepção)
                      </option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <button
                      type="button"
                      onClick={handleDispatchPreConsultationForm}
                      className="w-full py-2.5 px-4 rounded-xl vitta-metallic-blue-badge text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:brightness-110"
                    >
                      <Send className="w-3.5 h-3.5 text-[#7DD3FC]" />
                      <span>Disparar p/ Paciente</span>
                    </button>
                  </div>
                </div>

                {preFormDispatchedFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{preFormDispatchedFeedback}</span>
                  </div>
                )}
              </div>

              {/* Pre-Consultation Digested Responses ("Chegando Mastigado para Análise") */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0A2647] block">
                  📋 Respostas de Pré-Consulta Recebidas (Resumo Clínico Mastigado):
                </span>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {preConsultationDigestedResponses.map((resp) => {
                    const badgeStyle =
                      resp.riskFlag === 'vermelho'
                        ? 'bg-rose-600 text-white'
                        : resp.riskFlag === 'amarelo'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white';

                    return (
                      <div
                        key={resp.id}
                        className="p-4 rounded-2xl bg-white border-2 border-[#144272] shadow-xs flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${badgeStyle}`}>
                              {resp.riskFlag === 'vermelho'
                                ? 'Alerta Agudo'
                                : resp.riskFlag === 'amarelo'
                                ? 'Atenção Moderada'
                                : 'Estável'}
                            </span>
                            <span className="text-[10px] font-bold text-[#144272]">
                              {resp.submittedAt}
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-serif font-bold text-[#0A2647]">
                            {resp.patientName}
                          </h4>
                          <span className="text-[11px] font-extrabold text-[#144272] block">
                            {resp.questionnaireTitle}
                          </span>

                          <ul className="space-y-1 pt-1 border-t border-[#144272]/15 text-[11px] text-[#0A2647]">
                            {resp.digestedBullets.map((b, i) => (
                              <li key={i} className="flex items-start gap-1.5 leading-snug">
                                <span className="font-bold text-[#144272]">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-[#144272]/20 space-y-2">
                          <p className="text-[11px] font-bold text-[#0A2647] bg-[#E6F3FE] p-2 rounded-xl border border-[#144272]/30">
                            💡 {resp.clinicalRecommendation}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveTab('constellation')}
                              className="w-full py-1.5 px-3 rounded-xl vitta-pearl-button text-[11px] font-bold cursor-pointer"
                            >
                              Importar p/ Evolução SOAP na Constelação
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. QUADRO DE HORÁRIOS TOTALMENTE AJUSTÁVEL & BLOQUEIO DE DATAS (FÉRIAS, CONGRESSOS, FOLGAS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 cols: Quadro de Horários Ajustável */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl vitta-pearl-white-card space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#144272]/20 pb-3">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#0A2647]">
                      Quadro de Horários Totalmente Ajustável
                    </h3>
                    <p className="text-xs text-[#144272] font-medium">
                      Defina os dias da semana, horários de início/término e modalidade (plantão, teleconsulta ou presencial)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveScheduleSettings}
                    className="px-4 py-2 rounded-xl vitta-metallic-blue-badge text-white text-xs font-bold cursor-pointer"
                  >
                    Salvar Grade de Horários
                  </button>
                </div>

                {scheduleSavedBanner && (
                  <div className="p-3 rounded-xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Quadro de horários sincronizado! As pacientes verão apenas os horários habilitados.</span>
                  </div>
                )}

                <div className="space-y-2.5">
                  {weeklySchedule.map((dayItem) => (
                    <div
                      key={dayItem.id}
                      className={`p-3 rounded-2xl border-2 transition-all grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center ${
                        dayItem.enabled
                          ? 'vitta-pearl-blue-subbar border-[#144272]'
                          : 'bg-slate-100/80 border-slate-300 opacity-75'
                      }`}
                    >
                      <div className="sm:col-span-3 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={dayItem.enabled}
                          onChange={(e) =>
                            handleUpdateScheduleDay(dayItem.id, 'enabled', e.target.checked)
                          }
                          className="w-4 h-4 accent-[#0A2647] cursor-pointer"
                        />
                        <span className="text-xs font-extrabold text-[#0A2647]">
                          {dayItem.day}
                        </span>
                      </div>

                      {dayItem.enabled ? (
                        <>
                          <div className="sm:col-span-4 flex items-center gap-1.5">
                            <input
                              type="time"
                              value={dayItem.startTime}
                              onChange={(e) =>
                                handleUpdateScheduleDay(dayItem.id, 'startTime', e.target.value)
                              }
                              className="px-2 py-1 rounded-lg border border-[#144272] bg-white text-xs font-bold text-[#0A2647]"
                            />
                            <span className="text-xs font-bold text-[#144272]">às</span>
                            <input
                              type="time"
                              value={dayItem.endTime}
                              onChange={(e) =>
                                handleUpdateScheduleDay(dayItem.id, 'endTime', e.target.value)
                              }
                              className="px-2 py-1 rounded-lg border border-[#144272] bg-white text-xs font-bold text-[#0A2647]"
                            />
                          </div>

                          <div className="sm:col-span-5">
                            <select
                              value={dayItem.shiftType}
                              onChange={(e) =>
                                handleUpdateScheduleDay(dayItem.id, 'shiftType', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#144272] bg-white text-xs font-bold text-[#0A2647]"
                            >
                              <option value="Plantão + Teleconsulta">Plantão + Teleconsulta</option>
                              <option value="Exclusivo Teleconsulta">Exclusivo Teleconsulta</option>
                              <option value="Consultório Presencial + Online">Consultório Presencial + Online</option>
                              <option value="Plantão Obstétrico / Encaixes">Plantão Obstétrico / Encaixes</option>
                              <option value="Plantão Obstétrico 24h">Plantão Obstétrico 24h</option>
                              <option value="Sobreaviso Emergencial">Sobreaviso Emergencial</option>
                            </select>
                          </div>
                        </>
                      ) : (
                        <div className="sm:col-span-9 text-xs font-bold text-slate-500 italic">
                          Dia sem expediente / Folga programada (Indisponível para agendamento)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 5 cols: Bloqueio Rápido de Horários (Férias, Congressos, Folgas) */}
              <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl vitta-pearl-white-card space-y-4">
                <div className="border-b-2 border-[#144272]/20 pb-3">
                  <h3 className="text-lg font-serif font-bold text-[#0A2647]">
                    Bloqueio de Horários & Datas
                  </h3>
                  <p className="text-xs text-[#144272] font-medium">
                    Bloqueie férias, congressos ou folgas para impedir agendamentos das pacientes nesses períodos
                  </p>
                </div>

                {/* 1-Click Quick Preset Blocks */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#144272] block">
                    Bloqueio Rápido em 1 Clique:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickPresetBlock(
                          'Férias Programadas da Equipe',
                          'Férias',
                          '2026-11-10',
                          '2026-11-24'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl vitta-pearl-button text-[11px] font-bold cursor-pointer"
                    >
                      + Bloquear Férias
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickPresetBlock(
                          'Simpósio Internacional de Obstetrícia',
                          'Congresso',
                          '2026-11-05',
                          '2026-11-07'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl vitta-pearl-button text-[11px] font-bold cursor-pointer"
                    >
                      + Bloquear Congresso
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickPresetBlock(
                          'Folga de Plantão / Descanso',
                          'Folga',
                          '2026-10-30',
                          '2026-10-30'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl vitta-pearl-button text-[11px] font-bold cursor-pointer"
                    >
                      + Bloquear Folga
                    </button>
                  </div>
                </div>

                {/* Custom Date Block Form */}
                <form
                  onSubmit={handleAddBlockedPeriod}
                  className="p-3.5 rounded-2xl vitta-pearl-blue-subbar border-2 border-[#144272] space-y-2.5"
                >
                  <span className="text-xs font-extrabold text-[#0A2647] block">
                    Novo Bloqueio Personalizado:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={newBlockCategory}
                      onChange={(e) => setNewBlockCategory(e.target.value as any)}
                      className="px-2.5 py-2 rounded-xl border border-[#144272] bg-white text-xs font-bold text-[#0A2647]"
                    >
                      <option value="Folga">Folga / Descanso</option>
                      <option value="Férias">Férias</option>
                      <option value="Congresso">Congresso / Evento</option>
                      <option value="Reunião Clínica">Reunião Clínica</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Motivo (Ex: Congresso SP)"
                      value={newBlockTitle}
                      onChange={(e) => setNewBlockTitle(e.target.value)}
                      className="px-2.5 py-2 rounded-xl border border-[#144272] bg-white text-xs font-bold text-[#0A2647]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-[#144272] block">Início:</label>
                      <input
                        type="date"
                        value={newBlockStart}
                        onChange={(e) => setNewBlockStart(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-xl border border-[#144272] bg-white text-xs font-bold text-[#0A2647]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#144272] block">Término:</label>
                      <input
                        type="date"
                        value={newBlockEnd}
                        onChange={(e) => setNewBlockEnd(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-xl border border-[#144272] bg-white text-xs font-bold text-[#0A2647]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl vitta-metallic-blue-badge text-white text-xs font-bold cursor-pointer"
                  >
                    🔒 Confirmar Bloqueio na Agenda
                  </button>
                </form>

                {/* Active Blocked Periods List */}
                <div className="space-y-2 max-h-[230px] overflow-y-auto pr-1">
                  {blockedPeriods.map((blk) => (
                    <div
                      key={blk.id}
                      className="p-3 rounded-2xl bg-white border-2 border-[#144272] flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded vitta-metallic-blue-badge text-white">
                          {blk.category}
                        </span>
                        <h4 className="text-xs font-bold text-[#0A2647] mt-1">{blk.title}</h4>
                        <span className="text-[11px] font-mono text-[#144272] font-semibold block">
                          📅 {blk.startDate} até {blk.endDate}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlockedPeriod(blk.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-[11px] font-bold cursor-pointer shrink-0"
                      >
                        Desbloquear
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. CONSULTAS AGENDADAS DO DIA */}
            <div className="flex items-center justify-between p-5 rounded-3xl vitta-pearl-white-card">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#0A2647]">
                  Consultas Confirmadas na Grade de Hoje
                </h2>
                <p className="text-xs text-[#144272] font-medium">
                  Horários já reservados pelas pacientes de acordo com sua disponibilidade
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3.5 py-1.5 rounded-xl vitta-metallic-blue-badge">
                  {appointments.length} Agendamentos Hoje
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-5 rounded-3xl vitta-pearl-white-card transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl vitta-metallic-blue-badge flex flex-col items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-[#7DD3FC] mb-0.5" />
                        <span className="text-xs font-bold text-white">{apt.appointmentTime}</span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-[#0A2647]">
                            {apt.patientName}
                          </h3>
                          <span className="text-[11px] font-bold text-[#144272]">
                            · {apt.patientMode === 'gestante' ? '🤰 Gestante' : '🌸 Saúde da Mulher'}
                          </span>
                        </div>

                        <span className="text-xs text-[#144272] font-semibold block mt-0.5">
                          {apt.specialty}
                        </span>

                        <span className="text-[11px] text-slate-600 block italic mt-1">
                          Nota: {apt.notes}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleOpenIndividualChatWithPatient(apt.patientName)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl vitta-pearl-button text-xs font-bold cursor-pointer"
                        title={`Abrir chat individual com ${apt.patientName}`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#144272]" />
                        <span>Chat 1:1</span>
                      </button>

                      {apt.type === 'teleconsulta' ? (
                        <button
                          onClick={() => setActiveCallAppointment(apt)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                            apt.status === 'em_andamento'
                              ? 'vitta-metallic-blue-badge'
                              : 'vitta-pearl-button'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>{apt.status === 'em_andamento' ? 'Conectar na Consulta' : 'Abrir Teleconsulta'}</span>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-[#0A2647] bg-[#D4EAFC] px-3 py-2 rounded-2xl border-2 border-[#144272]">
                          Presencial • Sala 03
                        </span>
                      )}

                      <button
                        onClick={() => {
                          setPrescriptionPatient(apt.patientName);
                          setShowPrescriptionModal(true);
                        }}
                        className="p-2 rounded-xl vitta-pearl-button cursor-pointer"
                        title="Emitir prescrição para esta paciente"
                      >
                        <FileText className="w-4 h-4 text-[#144272]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CHAT INDIVIDUAL EM TEMPO REAL (DE CADA PROFISSIONAL PARA CADA CLIENTE) */}
        {activeTab === 'chat' && (
          <div className="vitta-pearl-white-card rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[650px] animate-fadeIn">
            {/* LEFT SIDEBAR: DIRECTORY OF CLIENTS / PATIENTS FOR INDIVIDUAL 1-ON-1 CHAT */}
            <div className="lg:col-span-4 bg-gradient-to-b from-[#D4EAFC] via-[#C6E2FA] to-[#B8D9F8] border-b-2 lg:border-b-0 lg:border-r-2 border-[#144272] flex flex-col">
              <div className="p-4 border-b-2 border-[#144272]/30 bg-white/85">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#0A2647] flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#144272]" />
                    <span>Clientes • Chat Individual</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded vitta-metallic-blue-badge flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#7DD3FC]" />
                    1:1 Privado
                  </span>
                </div>
                <p className="text-[11px] text-[#144272] font-medium">
                  Selecione a cliente abaixo para abrir o canal exclusivo entre <strong>{professionalProfile?.displayName || 'Enf. Marcelo'}</strong> e a paciente:
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[260px] lg:max-h-none">
                {patients.map((pat) => {
                  const isSelected = pat.id === selectedChatPatient.id;
                  return (
                    <button
                      key={pat.id}
                      type="button"
                      onClick={() => setSelectedChatPatientId(pat.id)}
                      className={`w-full p-3.5 rounded-2xl text-left transition-all border-2 cursor-pointer flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'vitta-metallic-blue-badge shadow-md'
                          : 'bg-white/90 border-[#144272]/50 text-[#0A2647] hover:bg-white hover:border-[#144272]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#0A2647]'}`}>
                            {pat.name}
                          </span>
                        </div>
                        <span className={`text-[11px] block mt-0.5 truncate ${isSelected ? 'text-[#BAE6FD]' : 'text-[#144272]'}`}>
                          {pat.clinicalSummary}
                        </span>
                        {pat.hasDisability && (
                          <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                            isSelected
                              ? 'bg-white/20 text-white border-white/40'
                              : 'bg-[#D4EAFC] text-[#0A2647] border-[#144272]'
                          }`}>
                            ♿ PCD / Acesso Assistido
                          </span>
                        )}
                      </div>
                      <span className="text-xs shrink-0">
                        {pat.mode === 'gestante' ? '🤰' : '🌸'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT PANEL: EXCLUSIVE 1-ON-1 CHAT CONVERSATION */}
            <div className="lg:col-span-8 flex flex-col h-[560px] lg:h-[650px]">
              {/* Chat Header (Premium Pearl Light Blue with Metallic Sapphire Accents) */}
              <div className="p-4 vitta-pearl-blue-header text-[#0A2647] border-b-2 border-[#144272] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl vitta-metallic-blue-badge flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-[#7DD3FC]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#0A2647]">
                        Chat Individual: {professionalProfile?.displayName || 'Enf. Marcelo'} ↔ {selectedChatPatient.name}
                      </h3>
                    </div>
                    <span className="text-[11px] text-[#144272] font-semibold block">
                      {selectedChatPatient.clinicalSummary} • Canal Privado e Criptografado no Firestore
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Share Google Meet into individual chat */}
                  <button
                    type="button"
                    onClick={async () => {
                      await sendRealtimeMessage(
                        `📹 Olá, ${selectedChatPatient.name.split(' ')[0]}! Sala de Videochamada Individual no Google Meet iniciada por ${professionalProfile?.displayName || 'Enfermeiro(a)'}: https://meet.google.com/vit-care-obst - Toque para entrar na teleconsulta.`,
                        'profissional',
                        professionalProfile?.displayName || 'Enf. Marcelo',
                        profIdentifier,
                        patIdentifier,
                        selectedChatPatient.name
                      );
                    }}
                    className="px-3.5 py-1.5 rounded-xl vitta-pearl-button text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    title="Enviar convite do Google Meet no chat individual desta cliente"
                  >
                    <Video className="w-3.5 h-3.5 text-[#144272]" />
                    <span className="hidden sm:inline">Convidar p/ Google Meet</span>
                  </button>
                </div>
              </div>

              {/* Accessibility Alert Banner if Patient has Disability / Helper */}
              {selectedChatPatient.hasDisability && (
                <div className="px-4 py-2 bg-[#D4EAFC] border-b-2 border-[#144272]/30 text-xs text-[#0A2647] flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <strong>♿ Paciente com Acessibilidade Assistida:</strong>{' '}
                    {selectedChatPatient.disabilityTypes?.join(', ') || 'Suporte PCD Ativo'}
                    {selectedChatPatient.helperName ? ` • Acompanhante: ${selectedChatPatient.helperName}` : ''}
                  </span>
                  {selectedChatPatient.needsLibrasInterpreter && (
                    <span className="font-bold">🤟 Intérprete de Libras Solicitado</span>
                  )}
                </div>
              )}

              {/* Chat Message List */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-gradient-to-b from-[#EBF6FF] via-[#F5FAFF] to-[#DCEFFE]">
                {realtimeChatMsgs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-[#144272] space-y-2">
                    <div className="w-8 h-8 rounded-full border-2 border-[#144272] border-t-transparent animate-spin" />
                    <span className="text-xs font-semibold">
                      Conectando ao canal individual de {selectedChatPatient.name}...
                    </span>
                  </div>
                ) : (
                  realtimeChatMsgs.map((msg) => {
                    const isMe = msg.senderRole === 'profissional';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fadeIn`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-[11px] font-bold text-[#0A2647] flex items-center gap-1">
                            {isMe ? (
                              <>
                                <NursingCrest size="sm" variant="silver" />
                                <span>{msg.senderName} (Você)</span>
                              </>
                            ) : (
                              <span>
                                {selectedChatPatient.mode === 'gestante' ? '🤰' : '🌸'} {msg.senderName}
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-[#144272]">
                            • {msg.timeString || 'Agora'}
                          </span>
                        </div>

                        <div
                          className={`max-w-lg p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isMe
                              ? 'vitta-metallic-blue-badge rounded-tr-none'
                              : 'vitta-pearl-white-card text-[#0A2647] rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t-2 border-[#144272] flex items-center gap-2">
                <input
                  type="text"
                  value={inputChatText}
                  onChange={(e) => setInputChatText(e.target.value)}
                  placeholder={`Mensagem individual para ${selectedChatPatient.name}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[#144272]/60 bg-[#F0F8FF] text-xs sm:text-sm focus:outline-none focus:border-[#0A2647] text-[#0A2647]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl vitta-metallic-blue-badge text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#7DD3FC]" />
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: PRONTUÁRIOS & PRESCRIÇÕES */}
        {activeTab === 'records' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl vitta-pearl-white-card">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#0A2647]">
                  Prontuários & Emissão de Prescrições Oficiais
                </h2>
                <p className="text-xs text-[#144272] font-medium">
                  Histórico clínico com assinatura digital COREN, exportação em PDF/Impressão e envio direto ao chat individual da paciente
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-2xl vitta-pearl-button text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#144272]" />
                  <span>Imprimir / Exportar PDF Oficial</span>
                </button>
                <button
                  onClick={() => setShowPrescriptionModal(true)}
                  className="px-4 py-2.5 rounded-2xl vitta-metallic-blue-badge text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#7DD3FC]" />
                  <span>Emitir Prescrição Digital</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl vitta-pearl-white-card space-y-3">
                <div className="flex items-center justify-between border-b border-[#144272]/20 pb-2">
                  <span className="text-xs font-bold text-[#0A2647]">
                    Mariana Silva Santos (18 Semanas • G1P0)
                  </span>
                  <span className="text-[11px] text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg font-bold border border-emerald-300">
                    · Pré-Natal Ativo
                  </span>
                </div>
                <p className="text-xs text-[#144272] leading-relaxed">
                  <strong>Última Conduta & Escalas:</strong> Prescrição de polivitamínico gestacional e suplementação de ferro. Solicitado Ultrassom Morfológico para a 20ª semana. Escala de Glasgow 15/15, EPDS 3/30 (Baixo Risco).
                </p>
                <div className="text-[11px] text-[#144272] font-medium flex items-center justify-between pt-1">
                  <span>Assinado: {professionalProfile?.displayName || 'Enf. Marcelo'} ({professionalProfile?.councilNumber || 'COREN-SP 000.002'})</span>
                  <span>Ontem às 16:40</span>
                </div>
                <div className="pt-2 border-t border-[#144272]/15 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl vitta-pearl-button text-[11px] font-bold cursor-pointer"
                  >
                    🖨️ Exportar Dossiê PDF
                  </button>
                  <button
                    onClick={() => {
                      const target = patients.find((p) => p.name.toLowerCase().includes('mariana'));
                      if (target) setSelectedChatPatientId(target.id);
                      setActiveTab('chat');
                    }}
                    className="px-3 py-1.5 rounded-xl vitta-metallic-blue-badge text-[11px] font-bold text-white cursor-pointer"
                  >
                    📨 Abrir Chat Individual da Paciente
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-3xl vitta-pearl-white-card space-y-3">
                <div className="flex items-center justify-between border-b border-[#144272]/20 pb-2">
                  <span className="text-xs font-bold text-[#0A2647]">
                    Camila Ferreira Lima (Saúde Feminina)
                  </span>
                  <span className="text-[11px] text-[#0A2647] bg-[#DCEFFE] px-2.5 py-0.5 rounded-lg font-bold border border-[#144272]">
                    · Rotina Preventiva
                  </span>
                </div>
                <p className="text-xs text-[#144272] leading-relaxed">
                  <strong>Última Conduta & Escalas:</strong> Coleta de Papanicolau em lâmina digital. Orientada sobre autoexame e ajuste do horário do anticoncepcional oral. GDS-15 dentro da normalidade.
                </p>
                <div className="text-[11px] text-[#144272] font-medium flex items-center justify-between pt-1">
                  <span>Atualizado por: Enfª. Bianca & Enfª. Stephanie</span>
                  <span>28 de Setembro</span>
                </div>
                <div className="pt-2 border-t border-[#144272]/15 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl vitta-pearl-button text-[11px] font-bold cursor-pointer"
                  >
                    🖨️ Exportar Dossiê PDF
                  </button>
                  <button
                    onClick={() => {
                      const target = patients.find((p) => p.name.toLowerCase().includes('camila'));
                      if (target) setSelectedChatPatientId(target.id);
                      setActiveTab('chat');
                    }}
                    className="px-3 py-1.5 rounded-xl vitta-metallic-blue-badge text-[11px] font-bold text-white cursor-pointer"
                  >
                    📨 Abrir Chat Individual da Paciente
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PERFIL PROFISSIONAL & PLANTÃO (PREMIUM METALLIC BLUE, PEARL LIGHT BLUE & PEARL WHITE) */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 sm:p-8 rounded-3xl vitta-pearl-white-card space-y-6 relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br from-[#60A5FA]/30 via-[#BAE6FD]/25 to-transparent blur-2xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#144272]/25 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-18 h-18 rounded-3xl vitta-metallic-blue-badge flex items-center justify-center shadow-lg">
                    <NursingCrest size="lg" variant="silver" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A2647]">
                        {professionalProfile?.displayName || 'Enf. Marcelo'}
                      </h2>
                      <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-lg vitta-metallic-blue-badge">
                        Titular Vittaprofessio
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#144272] block mt-0.5">
                      {professionalProfile?.specialty || 'Enfermagem Obstétrica, Pré-Natal & Neonatologia'}
                    </span>
                    <span className="text-[11px] text-[#205295] font-semibold block mt-0.5">
                      Registro Profissional: {professionalProfile?.councilNumber || 'COREN-SP 000.002 (Fictício)'} • Clínica Vittacare
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl vitta-pearl-blue-subbar border-2 border-[#144272] text-xs space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#144272] font-semibold">Status de Atendimento:</span>
                    <button
                      type="button"
                      onClick={handleToggleDuty}
                      className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer border ${
                        isOnDuty
                          ? 'bg-emerald-600 text-white border-emerald-800'
                          : 'bg-slate-200 text-slate-700 border-slate-400'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isOnDuty ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
                      <span>{isOnDuty ? 'Plantão Ativo (Ligado)' : 'Fora de Plantão'}</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#144272] font-semibold">Chamadas de Emergência / Encaixes:</span>
                    <button
                      type="button"
                      onClick={() => setAcceptEmergencyCalls(!acceptEmergencyCalls)}
                      className="font-bold text-[#0A2647] underline cursor-pointer"
                    >
                      {acceptEmergencyCalls && isOnDuty ? 'Habilitados Agora' : 'Pausados'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#144272] font-semibold">Corpo Clínico de Enfermagem:</span>
                    <span className="font-bold text-[#0A2647]">Letícia • Marcelo • Bianca • Stephanie</span>
                  </div>
                </div>
              </div>

              {/* Quick Management Cards inside Profile Tab for Schedule, Blocked Dates, Smart Queue & Pre-Consultation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div className="p-4 rounded-2xl vitta-pearl-blue-subbar border-2 border-[#144272] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#0A2647]">
                      📅 Gestão de Agenda & Disponibilidade
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg vitta-metallic-blue-badge text-white">
                      {weeklySchedule.filter((d) => d.enabled).length} dias ativos/sem
                    </span>
                  </div>
                  <p className="text-xs text-[#144272] font-medium">
                    Quadro de horários ajustável ({consultationDuration} min/consulta) e {blockedPeriods.length} períodos bloqueados (férias/congressos/folgas).
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('agenda')}
                    className="px-3.5 py-2 rounded-xl vitta-pearl-button text-xs font-bold cursor-pointer"
                  >
                    Configurar Horários & Bloqueios de Agenda →
                  </button>
                </div>

                <div className="p-4 rounded-2xl vitta-pearl-blue-subbar border-2 border-[#144272] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#0A2647]">
                      🚨 Fila Inteligente & Pré-Consulta
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-rose-600 text-white">
                      {smartQueue.filter((q) => q.riskLevel === 'vermelho').length} Emergência no Topo
                    </span>
                  </div>
                  <p className="text-xs text-[#144272] font-medium">
                    Triagem automatizada por risco obstétrico/ginecológico e disparo de questionários rápidos de pré-consulta para o Vittaconect.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('agenda')}
                    className="px-3.5 py-2 rounded-xl vitta-metallic-blue-badge text-white text-xs font-bold cursor-pointer"
                  >
                    Abrir Fila de Risco & Questionários Pré-Consulta →
                  </button>
                </div>
              </div>

              {/* Professional Credentials & Institutional Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D4EAFC] via-[#E5F3FE] to-[#C8E2FA] border-2 border-[#144272] space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#144272] block">
                    E-mail Institucional Homologado
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0A2647] block truncate">
                    {professionalProfile?.email || 'Enf.marcelovittaprofessio@gmail.com'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D4EAFC] via-[#E5F3FE] to-[#C8E2FA] border-2 border-[#144272] space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#144272] block">
                    Protocolos Habilitados
                  </span>
                  <span className="text-xs font-bold text-[#0A2647] block">
                    SAE • SOAP • Escala de Glasgow • GDS-15
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D4EAFC] via-[#E5F3FE] to-[#C8E2FA] border-2 border-[#144272] space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#144272] block">
                    Telemedicina & Chat 1:1
                  </span>
                  <span className="text-xs font-bold text-[#0A2647] block">
                    Sala Individual Google Meet & Firestore
                  </span>
                </div>
              </div>

              {/* Security and Credentials Banner */}
              <div className="p-4 rounded-2xl vitta-pearl-blue-header border-2 border-[#144272] flex flex-wrap items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl vitta-metallic-blue-badge">
                    <ShieldCheck className="w-5 h-5 text-[#7DD3FC]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0A2647] block">
                      Código de Segurança Institucional Validado
                    </span>
                    <span className="text-[11px] text-[#144272] font-medium">
                      Chave restrita autorizada pelo comitê de enfermagem da Clínica Vittacare
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-xl vitta-metallic-blue-badge flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>•••••••••••• (Chave Ativa)</span>
                </span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* EXTREMITY BOTTOM: Premium Pearl Light Blue Footer with Metallic Sapphire Accents */}
      <footer className="vitta-pearl-blue-header text-[#0A2647] border-t-2 border-[#144272] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#144272] font-semibold">
          <div className="flex items-center gap-2">
            <NursingCrest size="sm" variant="silver" />
            <span className="font-bold text-[#0A2647]">Vittaprofessio • Módulo Clínico Exclusivo para Profissionais</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#0A2647]">
            <span>Cloud Firestore Conectado</span>
            <span>•</span>
            <span>Segurança ABAC Ativa</span>
            <span>•</span>
            <span>Clínica Vittacare © 2026</span>
          </div>
        </div>
      </footer>

      {/* TELECONSULTATION POPUP MODAL */}
      {activeCallAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#38BDF8] shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <h3 className="font-serif font-bold text-xl text-[#0B192C]">
                  Teleconsulta em Andamento: {activeCallAppointment.patientName}
                </h3>
              </div>
              <button
                onClick={() => setActiveCallAppointment(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Fechar
              </button>
            </div>

            <div className="aspect-video bg-gradient-to-br from-[#0B192C] to-[#1E3E62] rounded-2xl flex flex-col items-center justify-center text-white relative overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-3xl mb-3">
                🤰
              </div>
              <span className="font-bold text-lg">{activeCallAppointment.patientName}</span>
              <span className="text-xs text-[#38BDF8]">Conexão Segura WebRTC • 1080p HD</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Especialidade: {activeCallAppointment.specialty}
              </span>
              <button
                onClick={() => setActiveCallAppointment(null)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Encerrar Atendimento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRESCRIPTION MODAL */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#CBD5E1] shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1E3E62]" />
                <h3 className="font-serif font-bold text-xl text-[#0B192C]">
                  Prescrição Médica Digital
                </h3>
              </div>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
            </div>

            {prescriptionSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-serif font-bold text-lg text-[#0B192C]">
                  Prescrição Enviada com Sucesso!
                </h4>
                <p className="text-xs text-slate-500">
                  Notificação e receita digital enviadas para o aplicativo de {prescriptionPatient}.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePrescribeSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Paciente</label>
                  <input
                    type="text"
                    value={prescriptionPatient}
                    onChange={(e) => setPrescriptionPatient(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Medicamentos, Dosagens & Orientações
                  </label>
                  <textarea
                    rows={6}
                    value={prescriptionContent}
                    onChange={(e) => setPrescriptionContent(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] font-mono text-xs"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#EBF3F8] text-slate-600 flex items-center justify-between">
                  <span>Assinatura Digital de Enfermagem: {professionalProfile?.councilNumber || 'COREN-SP 000.002 (Fictício)'}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowPrescriptionModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0B192C] to-[#1E3E62] text-white font-bold shadow-sm"
                  >
                    Assinar e Enviar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
