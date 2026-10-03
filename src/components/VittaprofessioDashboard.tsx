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
import { useRealtimeChat } from '../services/realtimeChat';

export const VittaprofessioDashboard: React.FC = () => {
  const { 
    professionalProfile, 
    logout, 
    updateProfessionalStatus, 
    clinicalTeam, 
    switchProfessional 
  } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfessionalTab>('constellation');
  const [isOnDuty, setIsOnDuty] = useState<boolean>(professionalProfile?.onDuty ?? true);

  // Real-time Chat with Patients via Cloud Firestore
  const { messages: realtimeChatMsgs, sendMessage: sendRealtimeMessage } = useRealtimeChat();
  const [inputChatText, setInputChatText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [realtimeChatMsgs, activeTab]);

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
      professionalProfile?.uid || 'prof-marcelo'
    );
    setInputChatText('');
    setSendingMsg(false);
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
    <div className="min-h-screen bg-[#F0F6FA] text-[#0B192C] flex flex-col font-sans">
      {/* EXTREMITY TOP: Pearl Light Blue Header with Dark Metallic Blue Button Borders */}
      <header className="bg-gradient-to-r from-[#FAFCFE] via-[#F0F6FA] to-[#E2EEF5] text-[#0B192C] border-b-2 border-[#0B192C]/20 shadow-xs sticky top-0 z-40 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Brand & Crest Group */}
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-2xl bg-white border-2 border-[#0B192C] shadow-2xs flex items-center gap-2">
              <VittacareLogo size="sm" showSubtitle={false} inverted={false} />
              <div className="w-[1px] h-6 bg-slate-300" />
              <NursingCrest size="sm" variant="gold" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg sm:text-xl text-[#0B192C] tracking-wide">
                  Vittaprofessio
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-white border-2 border-[#0B192C] text-[#0B192C] shadow-2xs">
                  Corpo de Enfermagem
                </span>
              </div>
              <span className="text-[11px] text-slate-600 block leading-none">
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
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-[#0B192C] bg-white text-[#0B192C] hover:bg-[#EBF3F8] shadow-2xs transition-all"
              title="Abrir sala oficial no Google Meet"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Video className="w-3.5 h-3.5 text-[#1E3E62]" />
              <span>Google Meet</span>
            </a>

            {/* Duty toggle */}
            <button
              onClick={handleToggleDuty}
              className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-[#0B192C] bg-white transition-all cursor-pointer shadow-2xs ${
                isOnDuty ? 'text-emerald-700' : 'text-slate-500'
              }`}
              title="Alternar disponibilidade de plantão"
            >
              <span className={`w-2 h-2 rounded-full ${isOnDuty ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>{isOnDuty ? 'Em Plantão' : 'Pausa'}</span>
            </button>

            {/* Professional Identity Capsule */}
            <div className="hidden lg:flex flex-col text-right leading-tight">
              <span className="text-xs font-bold text-[#0B192C]">
                {professionalProfile?.displayName || 'Enf. Marcelo'}
              </span>
              <span className="text-[11px] text-slate-600">
                {professionalProfile?.specialty || 'Enfermagem Obstétrica & Pré-Natal'} • {professionalProfile?.councilNumber || 'COREN-SP 000.002 (Fictício)'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border-2 border-[#0B192C] text-[#0B192C] text-xs font-bold shadow-2xs transition-all cursor-pointer"
              title="Sair do painel profissional"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* FULL LATERAL WIDTH LIGHT PEARL BAR: CREDENCIAIS DO PROFISSIONAL AUTENTICADO */}
        <div className="w-full bg-gradient-to-r from-[#EBF3F8] via-[#F0F6FA] to-[#E2EEF5] text-[#0B192C] border-t border-b-2 border-[#0B192C]/15 px-4 sm:px-6 lg:px-8 py-2.5 shadow-2xs">
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#0B192C]">
                Enfermeiro(a) em Atendimento:
              </span>
              <span className="text-xs font-bold text-[#0B192C] px-2.5 py-0.5 rounded-lg bg-white border-2 border-[#0B192C] shadow-2xs">
                {professionalProfile?.displayName || 'Enf. Marcelo'}
              </span>
              <span className="text-[11px] text-slate-600 hidden sm:inline">
                • {professionalProfile?.specialty || 'Enfermagem Obstétrica, Pré-Natal & Neonatologia'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[11px] text-slate-600">
                Registro: <strong className="text-[#0B192C]">{professionalProfile?.councilNumber || 'COREN-SP 000.002 (Fictício)'}</strong>
              </span>
              <div className="w-[1px] h-4 bg-slate-300 hidden md:block" />
              <div className="text-[11px] text-slate-600">
                E-mail Institucional: <strong className="text-[#0B192C] font-mono">{professionalProfile?.email || 'Enf.marcelovittaprofessio@gmail.com'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Navigation Tabs (Pearl Background with Dark Metallic Blue Button Borders) */}
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-[#0B192C]/10 py-2 bg-[#F0F6FA]/80">
          {[
            { id: 'constellation', label: 'Constelação Clínica', icon: Sparkles },
            { id: 'metrics', label: 'Acessos & Indicadores', icon: TrendingUp },
            { id: 'agenda', label: 'Agenda & Google Meet', icon: Calendar },
            { id: 'chat', label: 'Chat em Tempo Real', icon: MessageSquare },
            { id: 'records', label: 'Prontuários & Prescrições', icon: FileText },
            { id: 'profile', label: 'Meu Plantão & Credenciais', icon: Stethoscope },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ProfessionalTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border-2 cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-[#0B192C] text-white border-[#0B192C] shadow-sm scale-102'
                    : 'bg-white/90 text-[#0B192C] hover:bg-white border-[#0B192C] hover:border-[#1E3E62]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#38BDF8]' : 'text-[#0B192C]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN CONTENT BODY */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Welcome Professional Banner (Soft Pearl Blue Card with Dark Metallic Blue Details) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FAFCFE] via-[#F0F6FA] to-[#E2EEF5] text-[#0B192C] border-2 border-[#0B192C]/25 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative z-10 space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border-2 border-[#0B192C] text-[#0B192C] text-xs font-bold shadow-2xs">
              <NursingCrest size="sm" variant="gold" />
              <span>Painel Vittaprofessio • Enfermagem Obstétrica & Ginecológica</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B192C]">
              Bem-vindo(a), {professionalProfile?.displayName || 'Enf. Marcelo'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Ambiente de enfermagem integrado com <strong>Constelação Clínica Digital</strong>, <strong>Prontuário</strong>, <strong>Evolução SOAP</strong>, <strong>Escalas de Avaliação</strong> e <strong>Teleconsultas pelo Google Meet</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto relative z-10">
            <a
              href="https://meet.google.com/vit-care-obst"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#EBF3F8] text-[#0B192C] text-xs font-bold border-2 border-[#0B192C] shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Video className="w-4 h-4 text-[#1E3E62]" />
              <span>Google Meet ao Vivo</span>
            </a>
            <button
              onClick={() => setShowPrescriptionModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold border-2 border-[#0B192C] shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
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

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Consultas Hoje
                  </span>
                  <Calendar className="w-4 h-4 text-[#1E3E62]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#0B192C]">04</span>
                  <span className="text-xs text-emerald-600 font-semibold">1 em andamento</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  3 teleconsultas • 1 presencial no consultório
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Mensagens no Chat
                  </span>
                  <MessageSquare className="w-4 h-4 text-[#1E3E62]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#0B192C]">12</span>
                  <span className="text-xs text-blue-600 font-semibold">2 aguardando resposta</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  Dúvidas sobre medicações e resultados de exames
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Índice de Satisfação
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#0B192C]">99.4%</span>
                  <span className="text-xs text-emerald-600 font-semibold">Excelente</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  Avaliação das gestantes e pacientes ginecológicas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AGENDA & TELECONSULTAS */}
        {activeTab === 'agenda' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#0B192C]">
                  Agenda Clínica do Dia
                </h2>
                <p className="text-xs text-slate-600">
                  Gerencie seus horários, inicie teleconsultas e acesse o prontuário
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0B192C]">
                  Quinta-feira, 02 de Outubro
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`p-5 rounded-3xl bg-white border transition-all ${
                    apt.status === 'em_andamento'
                      ? 'border-[#38BDF8] ring-2 ring-[#38BDF8]/20 shadow-md'
                      : 'border-[#CBD5E1] shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B192C] to-[#1E3E62] text-white flex flex-col items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-[#38BDF8] mb-0.5" />
                        <span className="text-xs font-bold">{apt.appointmentTime}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#0B192C]">
                            {apt.patientName}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            apt.patientMode === 'gestante'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {apt.patientMode === 'gestante' ? '🤰 Gestante' : '🌸 Saúde da Mulher'}
                          </span>
                        </div>

                        <span className="text-xs text-slate-600 block mt-0.5">
                          {apt.specialty}
                        </span>

                        <span className="text-[11px] text-slate-500 block italic mt-1">
                          Nota: {apt.notes}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {apt.type === 'teleconsulta' ? (
                        <button
                          onClick={() => setActiveCallAppointment(apt)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                            apt.status === 'em_andamento'
                              ? 'bg-[#0B192C] text-white hover:bg-[#102A43] shadow-sm animate-pulse'
                              : 'bg-[#EBF3F8] border border-[#CBD5E1] text-[#0B192C] hover:bg-[#D0E3F0]'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5 text-[#38BDF8]" />
                          <span>{apt.status === 'em_andamento' ? 'Conectar na Consulta' : 'Abrir Teleconsulta'}</span>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                          Presencial • Sala 03
                        </span>
                      )}

                      <button
                        onClick={() => {
                          setPrescriptionPatient(apt.patientName);
                          setShowPrescriptionModal(true);
                        }}
                        className="p-2 rounded-xl border border-[#CBD5E1] hover:bg-slate-50 text-slate-600 cursor-pointer"
                        title="Emitir prescrição para esta paciente"
                      >
                        <FileText className="w-4 h-4 text-[#1E3E62]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CHAT EM TEMPO REAL */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-3xl border-2 border-[#0B192C] shadow-xl overflow-hidden flex flex-col h-[650px] animate-fadeIn">
            {/* Chat Header (Soft Pearl Light Blue with Dark Metallic Blue Accents) */}
            <div className="p-4 bg-gradient-to-r from-[#FAFCFE] via-[#F0F6FA] to-[#E2EEF5] text-[#0B192C] border-b-2 border-[#0B192C]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border-2 border-[#0B192C] shadow-2xs flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#1E3E62]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0B192C]">Canal Clínico em Tempo Real</h3>
                  <span className="text-[11px] text-slate-600">
                    Conexão ao vivo com pacientes e equipe de enfermagem
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Share Google Meet into chat */}
                <button
                  type="button"
                  onClick={async () => {
                    await sendRealtimeMessage(
                      `📹 Sala de Videochamada no Google Meet iniciada pelo ${professionalProfile?.displayName || 'Enfermeiro(a)'}: https://meet.google.com/vit-care-obst - Toque para entrar na teleconsulta.`,
                      'profissional',
                      professionalProfile?.displayName || 'Enf. Marcelo',
                      professionalProfile?.uid || 'prof-marcelo'
                    );
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EBF3F8] text-[#0B192C] border-2 border-[#0B192C] text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Enviar convite do Google Meet no chat"
                >
                  <Video className="w-3.5 h-3.5 text-[#1E3E62]" />
                  <span className="hidden sm:inline">Convidar p/ Google Meet</span>
                </button>
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold">Firestore Ativo</span>
                </div>
              </div>
            </div>

            {/* Chat Message List */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-[#FAFCFE]">
              {realtimeChatMsgs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-2">
                  <div className="w-8 h-8 rounded-full border-2 border-[#0B192C] border-t-transparent animate-spin" />
                  <span className="text-xs">Conectando ao canal em tempo real do Cloud Firestore...</span>
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
                        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          {isMe ? (
                            <>
                              <NursingCrest size="sm" variant="gold" />
                              <span>{msg.senderName} (Você)</span>
                            </>
                          ) : (
                            <span>🤰 {msg.senderName}</span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          • {msg.timeString || 'Agora'}
                        </span>
                      </div>

                      <div
                        className={`max-w-lg p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-gradient-to-r from-[#FAFCFE] via-[#F0F6FA] to-[#E2EEF5] text-[#0B192C] border-2 border-[#0B192C] rounded-tr-none shadow-xs'
                            : 'bg-white border border-[#CBD5E1] text-[#0B192C] rounded-tl-none shadow-2xs'
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
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#CBD5E1] flex items-center gap-2">
              <input
                type="text"
                value={inputChatText}
                onChange={(e) => setInputChatText(e.target.value)}
                placeholder="Digite sua orientação ou resposta clínica..."
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[#0B192C]/30 bg-[#F8FAFC] text-xs sm:text-sm focus:outline-none focus:border-[#0B192C] text-[#0B192C]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0B192C] border-2 border-[#0B192C] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: PRONTUÁRIOS & PRESCRIÇÕES */}
        {activeTab === 'records' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#0B192C]">
                  Prontuários & Emissão de Prescrições
                </h2>
                <p className="text-xs text-slate-600">
                  Histórico médico com assinatura digital e envio direto ao celular da paciente
                </p>
              </div>

              <button
                onClick={() => setShowPrescriptionModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#0B192C] to-[#1E3E62] text-white text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Emitir Prescrição Digital</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-[#0B192C]">
                    Mariana Silva Santos (18 Semanas)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Pré-Natal Ativo
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  <strong>Última Conduta:</strong> Prescrição de polivitamínico gestacional e suplementação de ferro. Solicitado Ultrassom Morfológico para a 20ª semana.
                </p>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Atualizado por: Enfª. Letícia & Enf. Marcelo</span>
                  <span>Ontem às 16:40</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-[#0B192C]">
                    Camila Ferreira Lima (Saúde Feminina)
                  </span>
                  <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    Rotina Preventiva
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  <strong>Última Conduta:</strong> Coleta de Papanicolau em lâmina digital. Orientada sobre autoexame e ajuste do horário do anticoncepcional oral.
                </p>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Atualizado por: Enfª. Bianca & Enfª. Stephanie</span>
                  <span>28 de Setembro</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MEU PLANTÃO & CREDENCIAIS */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#0B192C] to-[#1E3E62] text-white flex items-center justify-center shadow-md">
                    <NursingCrest size="lg" variant="silver" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#0B192C]">
                      {professionalProfile?.displayName || 'Enf. Marcelo'}
                    </h2>
                    <span className="text-xs font-semibold text-[#1E3E62] block">
                      {professionalProfile?.specialty || 'Enfermagem Obstétrica, Pré-Natal & Neonatologia'}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Registro: {professionalProfile?.councilNumber || 'COREN-SP 000.002 (Fictício)'} • Clínica Vittacare
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#EBF3F8] border border-[#CBD5E1] text-xs space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Status de Plantão:</span>
                    <span className="font-bold text-emerald-700">Ativo 24h</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Equipe de Plantão:</span>
                    <span className="font-bold text-slate-700">Letícia • Marcelo • Bianca • Stephanie</span>
                  </div>
                </div>
              </div>

              {/* Security and Credentials Banner */}
              <div className="p-4 rounded-2xl bg-[#FAFCFE] border border-[#CBD5E1] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-[#0B192C] block">
                      Código de Segurança Validado
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Chave restrita autorizada pelo comitê médico da Clínica Vittacare
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>•••••••••••• (Chave Ativa)</span>
                </span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* EXTREMITY BOTTOM: Pearl Light Blue Footer with Dark Metallic Blue Accents */}
      <footer className="bg-gradient-to-r from-[#FAFCFE] via-[#F0F6FA] to-[#E2EEF5] text-[#0B192C] border-t-2 border-[#0B192C]/20 py-4 mt-auto shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <NursingCrest size="sm" variant="gold" />
            <span className="font-bold text-[#0B192C]">Vittaprofessio • Módulo Clínico Exclusivo para Profissionais</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
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
