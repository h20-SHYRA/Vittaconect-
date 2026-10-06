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
} from 'lucide-react';
import {
  CLINIC_INFO,
  PREGNANCY_WEEKS_DATA,
  INITIAL_APPOINTMENTS,
  INITIAL_REMINDERS,
} from '../data/mockData';
import { usePatient } from '../context/PatientContext';
import { useFeedback } from '../context/FeedbackContext';
import { NavTab } from '../types';
import { DailyCheckinPanel } from './patient/DailyCheckinPanel';
import {
  subscribeToRealtimeChat,
  RealtimeChatMessage,
} from '../services/realtimeChat';

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

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;

  const telehealthApt = INITIAL_APPOINTMENTS.find(
    (apt) => apt.type === 'telehealth'
  );
  const prenatalApt = INITIAL_APPOINTMENTS.find(
    (apt) => apt.type === 'prenatal'
  );

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
    <div className="space-y-6 sm:space-y-7 animate-fadeIn">
      {/* =====================================================================
          1. SAUDAÇÃO & EVOLUÇÃO SEMANAL DA GESTANTE
         ===================================================================== */}
      <section className="rounded-3xl bg-gradient-to-br from-[#FAF0F2] via-[#FDFBF7] to-[#FAF6ED] border border-[#EBBEC8]/80 p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs text-[#8D253D] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#3B744C]" />
              <span>Acompanhamento Pré-Natal · Clínica Vittacare</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-600 font-normal">
                {weekInfo.trimester}º Trimestre · DPP:{' '}
                <strong className="text-[#480D1B]">
                  {patient?.dueDate || 'A definir'}
                </strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B] leading-tight">
              Olá, {motherName}!{' '}
              <span className="italic font-normal text-[#5D1425]">
                Você está na {selectedWeek}ª semana com {babyName}.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {weekInfo.fruitEmoji}{' '}
              <strong className="text-[#480D1B]">
                Tamanho de {weekInfo.babySizeComparison}
              </strong>{' '}
              (~{weekInfo.estimatedLength} · ~{weekInfo.estimatedWeight}) —{' '}
              {weekInfo.babyDevelopmentFact}
            </p>

            {/* Quick Week Explorer */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-stone-500 mr-1">
                Explorar semanas:
              </span>
              {availableWeeks.map((wk) => (
                <button
                  key={wk}
                  type="button"
                  onClick={() => setSelectedWeek(wk)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedWeek === wk
                      ? 'bg-[#5D1425] text-white shadow-2xs'
                      : 'bg-white/80 text-stone-600 border border-[#E6D4AF] hover:text-[#5D1425]'
                  }`}
                >
                  {wk}ª
                </button>
              ))}
            </div>
          </div>

          {/* Compact Circular Gestational Progress */}
          <div className="flex items-center gap-4 bg-white/90 p-4 rounded-2xl border border-[#E6D4AF] self-start lg:self-center shrink-0">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg
                className="w-full h-full -rotate-90 transform"
                viewBox="0 0 140 140"
              >
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="#FAF0F2"
                  strokeWidth="9"
                  fill="transparent"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="#5D1425"
                  strokeWidth="9"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl">{weekInfo.fruitEmoji}</span>
                <span className="text-lg font-serif font-bold text-[#480D1B] leading-none">
                  {selectedWeek}ª sem
                </span>
                <span className="text-[10px] font-semibold text-[#9B7731]">
                  {progressPercent}%
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs pr-2">
              <span className="text-[11px] text-stone-500 block">
                Batimentos Fetais
              </span>
              <strong className="text-sm font-serif text-[#480D1B] block">
                {weekInfo.fetalHeartRateRange}
              </strong>
              <span className="text-[11px] text-stone-500 block pt-1">
                Tipo Sanguíneo:{' '}
                <strong className="text-[#5D1425]">
                  {patient?.bloodType || 'O+'}
                </strong>
              </span>
              <button
                type="button"
                onClick={() => onNavigate('prenatal_card')}
                className="text-xs font-bold text-[#8D253D] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Ver Cartão Pré-Natal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. ALGO QUE PRECISA DA ATENÇÃO DO PACIENTE
         ===================================================================== */}
      <section
        aria-label="Atenção prioritária da paciente"
        className="rounded-2xl bg-white border-l-4 border-l-[#8D253D] border border-[#EBBEC8] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#8D253D] flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#8D253D] uppercase tracking-wider">
              <span>Requer sua atenção</span>
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
              Lembre-se de levar documento com foto e anexar resultados laboratoriais recentes na aba Documentos.
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
              className="px-4 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Confirmar Presença
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 px-3 py-1.5 rounded-xl bg-emerald-50">
              <CheckCircle2 className="w-4 h-4" />
              Confirmado
            </span>
          )}
          <button
            type="button"
            onClick={() => onNavigate('documents')}
            className="px-3.5 py-2 rounded-xl bg-[#FAF6ED] hover:bg-[#F3EBD8] text-[#480D1B] border border-[#E6D4AF] text-xs font-bold transition-colors cursor-pointer"
          >
            Ver Exames
          </button>
        </div>
      </section>

      {/* =====================================================================
          3. PRÓXIMA CONSULTA & TELEATENDIMENTO
         ===================================================================== */}
      <section aria-label="Próxima consulta">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-serif font-bold text-[#480D1B]">
            Próxima Consulta & Teleatendimento
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('calendar')}
            className="text-xs font-bold text-[#8D253D] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Abrir Agenda Completa</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Next In-Person Consultation */}
          {prenatalApt && (
            <div className="p-5 rounded-2xl bg-white border border-[#E6D4AF] flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-bold text-[#5D1425] uppercase tracking-wider">
                    Consulta Presencial · Confirmada
                  </span>
                  <span className="font-semibold text-[#480D1B]">
                    12/10 às {prenatalApt.time}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#480D1B] mt-1.5">
                  {prenatalApt.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  {prenatalApt.professional} · {prenatalApt.location}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Preparo: Trazer Cartão Pré-Natal e exames
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

          {/* Teleconsultation Card */}
          {telehealthApt && (
            <div className="p-5 rounded-2xl bg-[#5D1425] text-white flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#E6D4AF] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Teleatendimento · Sala Preparada
                  </span>
                  <span className="text-[#FAF0F2]/90 font-medium">
                    {telehealthApt.time}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold mt-1.5">
                  {telehealthApt.title}
                </h3>
                <p className="text-xs text-[#FAF0F2]/80 mt-1">
                  Com {telehealthApt.professional} ({telehealthApt.role})
                </p>
              </div>

              <button
                type="button"
                onClick={() => onStartTelehealth(telehealthApt.id)}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#E6D4AF] hover:bg-[#DEC68E] text-[#480D1B] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Video className="w-4 h-4 text-[#480D1B]" />
                <span>Acessar Sala de Teleatendimento</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          4. LEMBRETES DO DIA & 5. MENSAGENS DA ENFERMAGEM (Lado a Lado)
         ===================================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 4. LEMBRETES */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-[#E6D4AF] shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#8D253D]" />
                <h2 className="font-serif font-bold text-lg text-[#480D1B]">
                  Lembretes & Cuidados de Hoje
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('reminders')}
                className="text-xs font-bold text-[#8D253D] hover:underline cursor-pointer"
              >
                Ver todos ({INITIAL_REMINDERS.length})
              </button>
            </div>

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
                      {isDone ? 'Feito' : 'Pendente'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compact Hydration Bar inside Daily Routine */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-stone-700">
              <Droplet className="w-4 h-4 text-[#3B744C]" />
              <span>
                Hidratação: <strong>{waterCups}</strong>/{targetWater} copos (
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

        {/* 5. MENSAGENS DA EQUIPE DE ENFERMAGEM */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-[#E6D4AF] shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#8D253D]" />
                <h2 className="font-serif font-bold text-lg text-[#480D1B]">
                  Mensagens da Enfermagem
                </h2>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Plantão Online
              </span>
            </div>

            <div className="space-y-2.5">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={onOpenNurseChat}
                  className="p-3 rounded-xl bg-[#FAF0F2]/60 hover:bg-[#FAF0F2] border border-[#EBBEC8] transition-colors cursor-pointer"
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

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
            <span className="text-[11px] text-stone-500">
              Enf. Marcelo, Enfª. Letícia, Enfª. Bianca e Enfª. Stephanie
            </span>
            {onOpenNurseChat && (
              <button
                type="button"
                onClick={onOpenNurseChat}
                className="px-4 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-[#E6D4AF] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Abrir Chat</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. ATALHOS PRINCIPAIS
         ===================================================================== */}
      <section aria-label="Atalhos principais">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-serif font-bold text-[#480D1B]">
            Atalhos do Seu Cuidado
          </h2>
          {onOpenShare && (
            <button
              type="button"
              onClick={onOpenShare}
              className="text-xs font-bold text-[#8D253D] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Compartilhar com Acompanhante</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <button
            type="button"
            onClick={() => onNavigate('prenatal_card')}
            className="p-4 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#5D1425] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Cartão Pré-Natal
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                Vacinas, curvas de peso, pressão e plano de parto
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('documents')}
            className="p-4 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF6ED] text-[#9B7731] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Documentos & Exames
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                Receitas, laudos, pedidos de exame e atestados
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('symptoms')}
            className="p-4 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#8D253D] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Diário de Sintomas
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                Registro de sinais, movimentos fetais e triagem
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('education')}
            className="p-4 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF6ED] text-[#5D1425] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Educação em Saúde
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                Guias por trimestre, amamentação e bem-estar
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Check-in Diário Inteligente & Sinais de Alerta */}
      <DailyCheckinPanel
        onOpenNurseChat={onOpenNurseChat}
        onOpenSOS={onOpenSOS}
      />
    </div>
  );
};
