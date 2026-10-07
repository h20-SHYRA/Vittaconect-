import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Video,
  Activity,
  ChevronRight,
  Droplet,
  CheckCircle2,
  ArrowUpRight,
  Users,
  Bell,
  CreditCard,
  FileText,
  BookOpen,
  MessageSquare,
  AlertCircle,
  HeartPulse,
  Sparkles,
  Newspaper,
} from 'lucide-react';
import {
  PREGNANCY_WEEKS_DATA,
  INITIAL_APPOINTMENTS,
  INITIAL_REMINDERS,
  EDUCATIONAL_ARTICLES,
} from '../data/mockData';
import { usePatient } from '../context/PatientContext';
import { useFeedback } from '../context/FeedbackContext';
import { NavTab } from '../types';
import { DailyCheckinPanel } from './patient/DailyCheckinPanel';
import {
  subscribeToRealtimeChat,
  RealtimeChatMessage,
} from '../services/realtimeChat';
import { SectionHeader, EducationalClinicalBanner } from './ui';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onStartTelehealth: (appointmentId: string) => void;
  onOpenShare?: () => void;
  onOpenNurseChat?: () => void;
  onOpenSOS?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onStartTelehealth,
  onOpenShare,
  onOpenNurseChat,
  onOpenSOS,
}) => {
  const { patient } = usePatient();
  const { showToast } = useFeedback();

  const motherName =
    patient?.preferredName || patient?.name?.split(' ')[0] || 'Mãezinha';
  const babyName = patient?.babyNickname || 'Bebê';
  const patientWeek = patient?.currentWeek || 18;

  const [selectedWeek, setSelectedWeek] = useState<number>(patientWeek);
  const [waterCups, setWaterCups] = useState<number>(5);
  const [attentionConfirmed, setAttentionConfirmed] = useState<boolean>(false);
  const [checkedReminders, setCheckedReminders] = useState<
    Record<string, boolean>
  >({
    'rem-1': true,
  });
  const [recentMessages, setRecentMessages] = useState<RealtimeChatMessage[]>(
    []
  );

  const targetWater = 8;

  useEffect(() => {
    if (patient?.currentWeek) {
      setSelectedWeek(patient.currentWeek);
    }
  }, [patient?.currentWeek]);

  useEffect(() => {
    const unsub = subscribeToRealtimeChat((msgs) => {
      setRecentMessages(msgs.slice(-2).reverse());
    });
    return () => unsub();
  }, []);

  const availableWeeks = [12, 16, 18, 20, 24, 28, 32, 36];
  const closestWeek = availableWeeks.reduce(
    (prev, curr) =>
      Math.abs(curr - selectedWeek) < Math.abs(prev - selectedWeek)
        ? curr
        : prev,
    18
  );

  const weekInfo =
    PREGNANCY_WEEKS_DATA[selectedWeek] ||
    PREGNANCY_WEEKS_DATA[closestWeek] ||
    PREGNANCY_WEEKS_DATA[18];
  const progressPercent = Math.min(100, Math.round((selectedWeek / 40) * 100));

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;

  const telehealthApt = INITIAL_APPOINTMENTS.find(
    (apt) => apt.type === 'telehealth'
  );
  const prenatalApt = INITIAL_APPOINTMENTS.find(
    (apt) => apt.type === 'prenatal'
  );

  const featuredArticles = EDUCATIONAL_ARTICLES.slice(0, 2);

  const toggleQuickReminder = (id: string, title: string) => {
    const nextState = !checkedReminders[id];
    setCheckedReminders((prev) => ({ ...prev, [id]: nextState }));
    if (nextState) {
      showToast({
        title: 'Cuidado concluído',
        description: `"${title}" marcado como concluído hoje.`,
        tone: 'success',
      });
    }
  };

  return (
    <div className="space-y-7 sm:space-y-8 animate-fadeIn">
      {/* =====================================================================
          1. SAUDAÇÃO + PERFIL & 2. RESUMO RÁPIDO DA SAÚDE (Bento 8 + 4)
         ===================================================================== */}
      <section
        aria-label="Saudação, perfil e resumo rápido da saúde"
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch"
      >
        {/* Saudação + Perfil Gestacional */}
        <div className="lg:col-span-8 rounded-3xl bg-gradient-to-br from-[#FAF0F2] via-[#FDFBF7] to-[#FAF6ED] border border-[#EBBEC8]/80 p-5 sm:p-7 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8D253D] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#3B744C]" />
              <span>Acompanhamento Pré-Natal · Clínica Vittacare</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-600 font-normal">
                {weekInfo.trimester}º Trimestre · DPP:{' '}
                <strong className="text-[#480D1B]">
                  {patient?.dueDate || '24 de Março de 2027'}
                </strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B] leading-tight">
              Olá, {motherName}!{' '}
              <span className="italic font-normal text-[#5D1425]">
                Você está na {selectedWeek}ª semana com {babyName}.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-2xl">
              {weekInfo.fruitEmoji}{' '}
              <strong className="text-[#480D1B]">
                Tamanho de {weekInfo.babySizeComparison}
              </strong>{' '}
              (~{weekInfo.estimatedLength} · ~{weekInfo.estimatedWeight}) —{' '}
              {weekInfo.babyDevelopmentFact}
            </p>
          </div>

          {/* Seletor de Semanas */}
          <div className="pt-3 border-t border-[#E6D4AF]/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-stone-500 mr-1">
                Explorar semana:
              </span>
              {availableWeeks.map((wk) => (
                <button
                  key={wk}
                  type="button"
                  onClick={() => setSelectedWeek(wk)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedWeek === wk
                      ? 'bg-[#5D1425] text-white shadow-2xs'
                      : 'bg-white/90 text-stone-600 border border-[#E6D4AF] hover:text-[#5D1425]'
                  }`}
                >
                  {wk}ª
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="text-xs font-bold text-[#8D253D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Perfil Clínico</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Resumo Rápido da Saúde (Card de Indicadores Materno-Fetais) */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-[#E6D4AF] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-[#8D253D]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#480D1B]">
                Resumo da Saúde
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
              Estável
            </span>
          </div>

          <div className="my-4 flex items-center gap-4">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg
                className="w-full h-full -rotate-90 transform"
                viewBox="0 0 130 130"
              >
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke="#FAF0F2"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke="#5D1425"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg">{weekInfo.fruitEmoji}</span>
                <span className="text-sm font-serif font-bold text-[#480D1B] leading-none">
                  {selectedWeek}ª sem
                </span>
                <span className="text-[10px] font-semibold text-[#9B7731]">
                  {progressPercent}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 flex-1 text-xs">
              <div className="p-2 rounded-xl bg-[#FDFBF7] border border-[#E6D4AF]/60">
                <span className="text-[10px] text-stone-500 block">
                  Batimentos Fetais (BCF)
                </span>
                <strong className="text-xs font-serif text-[#480D1B]">
                  {weekInfo.fetalHeartRateRange}
                </strong>
              </div>
              <div className="p-2 rounded-xl bg-[#FDFBF7] border border-[#E6D4AF]/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 block">
                    Pressão / Tipo Sang.
                  </span>
                  <strong className="text-xs font-serif text-[#480D1B]">
                    110/70 mmHg · {patient?.bloodType || 'O+'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('prenatal_card')}
            className="w-full py-2.5 px-3.5 rounded-xl bg-[#FAF0F2] hover:bg-[#F5DADF] text-[#5D1425] border border-[#EBBEC8] text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Abrir Cartão Pré-Natal Digital</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* =====================================================================
          3. AÇÕES PRINCIPAIS & ATENÇÃO IMEDIATA
         ===================================================================== */}
      <section aria-label="Ações principais" className="space-y-4">
        {/* Priority Attention Card */}
        <div className="rounded-2xl bg-white border-l-4 border-l-[#8D253D] border border-[#EBBEC8] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#8D253D] flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#8D253D] uppercase tracking-wider">
                <span>Atenção Prioritária</span>
                <span aria-hidden="true">·</span>
                <span className="text-stone-500 font-normal normal-case">
                  Preparo para consulta presencial e exames do {weekInfo.trimester}º trimestre
                </span>
              </div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#480D1B] mt-0.5">
                {attentionConfirmed
                  ? 'Presença confirmada na próxima consulta pré-natal (12/10 às 09:30)'
                  : 'Confirme sua presença na consulta de 12/10 e revise seus exames recentes'}
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Leve documento com foto e anexe resultados laboratoriais recentes na aba Documentos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            {!attentionConfirmed ? (
              <button
                type="button"
                onClick={() => {
                  setAttentionConfirmed(true);
                  showToast({
                    title: 'Presença Confirmada!',
                    description:
                      'A recepção e a equipe de enfermagem Vittacare registraram sua confirmação.',
                    tone: 'success',
                  });
                }}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Confirmar Presença
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                Confirmado
              </span>
            )}
            <button
              type="button"
              onClick={() => onNavigate('documents')}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#FAF6ED] hover:bg-[#F3EBD8] text-[#480D1B] border border-[#E6D4AF] text-xs font-bold transition-colors cursor-pointer"
            >
              Ver Exames
            </button>
          </div>
        </div>

        {/* 4 Quick Action Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() =>
              telehealthApt && onStartTelehealth(telehealthApt.id)
            }
            className="p-3.5 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white flex items-center gap-3 transition-all cursor-pointer shadow-2xs text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-white/15 text-[#E6D4AF] flex items-center justify-center shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">
                Teleconsulta
              </span>
              <span className="text-[10px] text-[#E6D4AF] block truncate">
                Sala online ativa
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenNurseChat}
            className="p-3.5 rounded-2xl bg-white hover:bg-[#FAF0F2] border border-[#E6D4AF] text-[#480D1B] flex items-center gap-3 transition-all cursor-pointer shadow-2xs text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] text-[#8D253D] flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">
                Falar com Enfermagem
              </span>
              <span className="text-[10px] text-emerald-700 font-medium block truncate">
                Plantão em tempo real
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('symptoms')}
            className="p-3.5 rounded-2xl bg-white hover:bg-[#FAF0F2] border border-[#E6D4AF] text-[#480D1B] flex items-center gap-3 transition-all cursor-pointer shadow-2xs text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF6ED] text-[#9B7731] flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">
                Registrar Sintoma
              </span>
              <span className="text-[10px] text-stone-500 block truncate">
                Pressão, movimentos e humor
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('documents')}
            className="p-3.5 rounded-2xl bg-white hover:bg-[#FAF6ED] border border-[#E6D4AF] text-[#480D1B] flex items-center gap-3 transition-all cursor-pointer shadow-2xs text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] text-[#5D1425] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">
                Exames & Receitas
              </span>
              <span className="text-[10px] text-stone-500 block truncate">
                Laudos, pedidos e atestados
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* =====================================================================
          4. PRÓXIMOS COMPROMISSOS & LEMBRETES DO DIA (Grid 7 + 5)
         ===================================================================== */}
      <section
        aria-label="Próximos compromissos e lembretes"
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
      >
        {/* Próximos Compromissos */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          <SectionHeader
            overline="Agenda Clínica"
            title="Próximos Compromissos"
            subtitle="Consultas presenciais e teleatendimentos agendados"
            icon={<Calendar className="w-4 h-4" />}
            action={
              <button
                type="button"
                onClick={() => onNavigate('calendar')}
                className="text-xs font-bold text-[#8D253D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver Agenda Completa</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {prenatalApt && (
              <div className="p-5 rounded-2xl bg-white border border-[#E6D4AF] flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="font-bold text-[#5D1425] uppercase tracking-wider">
                      Presencial · Confirmada
                    </span>
                    <span className="font-semibold text-[#480D1B]">
                      12/10 · {prenatalApt.time}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#480D1B] mt-2 leading-snug">
                    {prenatalApt.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    {prenatalApt.professional} · {prenatalApt.location}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    Levar Cartão Pré-Natal
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('calendar')}
                    className="text-xs font-bold text-[#5D1425] hover:text-[#8D253D] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Detalhes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {telehealthApt && (
              <div className="p-5 rounded-2xl bg-[#5D1425] text-white flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold uppercase tracking-wider text-[#E6D4AF] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Teleatendimento
                    </span>
                    <span className="text-[#FAF0F2]/90 font-medium">
                      {telehealthApt.time}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold mt-2 leading-snug">
                    {telehealthApt.title}
                  </h3>
                  <p className="text-xs text-[#FAF0F2]/80 mt-1">
                    {telehealthApt.professional} ({telehealthApt.role})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onStartTelehealth(telehealthApt.id)}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#E6D4AF] hover:bg-[#DEC68E] text-[#480D1B] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Video className="w-4 h-4 text-[#480D1B]" />
                  <span>Entrar na Sala Online</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lembretes & Rotina do Dia */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          <SectionHeader
            overline="Rotina Diária"
            title="Lembretes & Hidratação"
            subtitle="Cuidados prescritos pela equipe"
            icon={<Bell className="w-4 h-4" />}
            action={
              <button
                type="button"
                onClick={() => onNavigate('reminders')}
                className="text-xs font-bold text-[#8D253D] hover:underline cursor-pointer"
              >
                Ver todos ({INITIAL_REMINDERS.length})
              </button>
            }
          />

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E6D4AF] shadow-2xs flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              {INITIAL_REMINDERS.slice(0, 3).map((rem) => {
                const isDone = Boolean(checkedReminders[rem.id]);
                return (
                  <div
                    key={rem.id}
                    onClick={() => toggleQuickReminder(rem.id, rem.title)}
                    className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isDone
                        ? 'bg-stone-50 border-stone-200 text-stone-500'
                        : 'bg-[#FDFBF7] border-[#E6D4AF] hover:border-[#8D253D]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => {}}
                        className="mt-0.5 rounded accent-[#5D1425] cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold truncate ${
                            isDone
                              ? 'line-through text-stone-400'
                              : 'text-[#480D1B]'
                          }`}
                        >
                          {rem.title}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {rem.professionalName} ·{' '}
                          {rem.medicationSchedule || rem.categoryLabel}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-[#8D253D] shrink-0">
                      {isDone ? 'Feito' : 'Hoje'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Hydration Tracker */}
            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-stone-700">
                <Droplet className="w-4 h-4 text-[#3B744C]" />
                <span>
                  Água: <strong>{waterCups}</strong>/{targetWater} copos (
                  {(waterCups * 250) / 1000}L)
                </span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: targetWater }).map((_, i) => {
                  const isFilled = i < waterCups;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setWaterCups(i + 1)}
                      className={`w-6 h-7 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                        isFilled
                          ? 'bg-[#3B744C] text-white'
                          : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                      }`}
                      title={`${i + 1} copos`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. ACOMPANHAMENTOS IMPORTANTES (Check-in Diário + Mensagens Enfermagem)
         ===================================================================== */}
      <section aria-label="Acompanhamentos importantes" className="space-y-5">
        <DailyCheckinPanel
          onOpenNurseChat={onOpenNurseChat}
          onOpenSOS={onOpenSOS}
        />

        {/* Mensagens Recentes da Equipe de Enfermagem */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6D4AF] shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#8D253D]" />
              <h2 className="font-serif font-bold text-lg text-[#480D1B]">
                Mensagens Recentes da Enfermagem
              </h2>
              <span className="ml-2 text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Plantão Online
              </span>
            </div>
            {onOpenNurseChat && (
              <button
                type="button"
                onClick={onOpenNurseChat}
                className="px-4 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-[#E6D4AF] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Abrir Conversa Completa</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={onOpenNurseChat}
                className="p-3.5 rounded-xl bg-[#FAF0F2]/60 hover:bg-[#FAF0F2] border border-[#EBBEC8] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                  <strong className="text-[#5D1425]">{msg.senderName}</strong>
                  <span>{msg.createdAt}</span>
                </div>
                <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. CONTEÚDOS E INFORMAÇÕES DE SAÚDE
         ===================================================================== */}
      <section aria-label="Conteúdos e informações">
        <SectionHeader
          overline="Educação em Saúde"
          title="Conteúdos Recomendados para a Sua Semana"
          subtitle="Orientações baseadas em evidências elaboradas pela equipe Vittacare"
          icon={<BookOpen className="w-4 h-4" />}
          action={
            <button
              type="button"
              onClick={() => onNavigate('education')}
              className="text-xs font-bold text-[#8D253D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Biblioteca Completa</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => onNavigate('education')}
              className="p-5 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] transition-all cursor-pointer shadow-2xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px] text-[#8D253D] font-bold uppercase tracking-wider mb-1.5">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#B89243]" />
                    {art.category}
                  </span>
                  <span className="text-stone-400 font-normal normal-case">
                    Leitura: {art.readTime}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#480D1B] group-hover:text-[#8D253D] transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">Curadoria Clínica Vittacare</span>
                <span className="font-bold text-[#5D1425] flex items-center gap-1">
                  Ler guia <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          7. ATALHOS SECUNDÁRIOS
         ===================================================================== */}
      <section aria-label="Atalhos secundários">
        <SectionHeader
          overline="Navegação Rápida"
          title="Mais Áreas do Vittaconect"
          subtitle="Acesso rápido a todas as ferramentas do seu acompanhamento"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('prenatal_card')}
            className="p-3.5 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] text-[#5D1425] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#480D1B]">
                Cartão Pré-Natal
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                Vacinas e ultrassons
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('documents')}
            className="p-3.5 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF6ED] text-[#9B7731] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#480D1B]">
                Documentos
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                Exames e receitas
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('symptoms')}
            className="p-3.5 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] text-[#8D253D] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#480D1B]">
                Sintomas
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                Diário e movimentos
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('community')}
            className="p-3.5 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF6ED] text-[#5D1425] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#480D1B]">
                Comunidade
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                Roda de gestantes
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('news')}
            className="p-3.5 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] text-[#5D1425] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#480D1B]">
                Mural Vittacare
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                Workshops e avisos
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenShare}
            className="p-3.5 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF] hover:border-[#B89243] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-white text-[#9B7731] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#480D1B]">
                Rede de Apoio
              </h3>
              <p className="text-[11px] text-stone-600 mt-0.5 line-clamp-1">
                Convidar acompanhante
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Clinical Disclaimer */}
      <EducationalClinicalBanner variant="patient" onOpenSOS={onOpenSOS} />
    </div>
  );
};
