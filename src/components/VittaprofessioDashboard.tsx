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
            { id: 'metrics', label: 'Acessos & Indicadores', icon: TrendingUp },
            { id: 'agenda', label: 'Agenda & Google Meet', icon: Calendar },
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
              Ambiente clínico premium em azul claro perolado, branco perolado e azul escuro metalizado com <strong>Constelação Clínica Digital</strong>, <strong>Prontuário</strong>, <strong>Evolução SOAP</strong>, <strong>Escalas (Glasgow & GDS-15)</strong> e <strong>Chat Individual 1:1</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto relative z-10">
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
          </div>
        )}

        {/* TAB 2: AGENDA & TELECONSULTAS */}
        {activeTab === 'agenda' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between p-5 rounded-3xl vitta-pearl-white-card">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#0A2647]">
                  Agenda Clínica do Dia
                </h2>
                <p className="text-xs text-[#144272] font-medium">
                  Gerencie seus horários, inicie teleconsultas, abra o chat individual e acesse o prontuário
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3.5 py-1.5 rounded-xl vitta-metallic-blue-badge">
                  Agenda Ativa • Vittaprofessio
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
                  Prontuários & Emissão de Prescrições
                </h2>
                <p className="text-xs text-[#144272] font-medium">
                  Histórico clínico com assinatura digital e envio direto ao celular da paciente
                </p>
              </div>

              <button
                onClick={() => setShowPrescriptionModal(true)}
                className="px-4 py-2.5 rounded-2xl vitta-metallic-blue-badge text-xs font-bold transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 text-[#7DD3FC]" />
                <span>Emitir Prescrição Digital</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl vitta-pearl-white-card space-y-3">
                <div className="flex items-center justify-between border-b border-[#144272]/20 pb-2">
                  <span className="text-xs font-bold text-[#0A2647]">
                    Mariana Silva Santos (18 Semanas)
                  </span>
                  <span className="text-[11px] text-emerald-800 font-bold">
                    · Pré-Natal Ativo
                  </span>
                </div>
                <p className="text-xs text-[#144272] leading-relaxed">
                  <strong>Última Conduta:</strong> Prescrição de polivitamínico gestacional e suplementação de ferro. Solicitado Ultrassom Morfológico para a 20ª semana.
                </p>
                <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1">
                  <span>Atualizado por: Enfª. Letícia & Enf. Marcelo</span>
                  <span>Ontem às 16:40</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl vitta-pearl-white-card space-y-3">
                <div className="flex items-center justify-between border-b border-[#144272]/20 pb-2">
                  <span className="text-xs font-bold text-[#0A2647]">
                    Camila Ferreira Lima (Saúde Feminina)
                  </span>
                  <span className="text-[11px] text-[#144272] font-bold">
                    · Rotina Preventiva
                  </span>
                </div>
                <p className="text-xs text-[#144272] leading-relaxed">
                  <strong>Última Conduta:</strong> Coleta de Papanicolau em lâmina digital. Orientada sobre autoexame e ajuste do horário do anticoncepcional oral.
                </p>
                <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1">
                  <span>Atualizado por: Enfª. Bianca & Enfª. Stephanie</span>
                  <span>28 de Setembro</span>
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

                <div className="p-4 rounded-2xl vitta-pearl-blue-subbar border-2 border-[#144272] text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#144272] font-semibold">Status de Plantão:</span>
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Ativo 24h
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#144272] font-semibold">Corpo Clínico de Enfermagem:</span>
                    <span className="font-bold text-[#0A2647]">Letícia • Marcelo • Bianca • Stephanie</span>
                  </div>
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
