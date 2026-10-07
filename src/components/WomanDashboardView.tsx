import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ShieldCheck,
  FileText,
  BookOpen,
  Activity,
  ChevronRight,
  AlertCircle,
  ArrowUpRight,
  Bell,
  MessageSquare,
  Flower2,
  Sparkles,
  Newspaper,
  User,
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { useFeedback } from '../context/FeedbackContext';
import {
  INITIAL_PREVENTIVE_EXAMS,
  INITIAL_WOMAN_REMINDERS,
  WOMAN_EDUCATIONAL_ARTICLES,
} from '../data/mockData';
import { NavTab } from '../types';
import { DailyCheckinPanel } from './patient/DailyCheckinPanel';
import {
  subscribeToRealtimeChat,
  RealtimeChatMessage,
} from '../services/realtimeChat';
import { SectionHeader, EducationalClinicalBanner } from './ui';

interface WomanDashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenSOS?: () => void;
  onOpenNurseChat?: () => void;
}

export const WomanDashboardView: React.FC<WomanDashboardViewProps> = ({
  onNavigate,
  onOpenSOS,
  onOpenNurseChat,
}) => {
  const { patient } = usePatient();
  const { showToast } = useFeedback();

  const [checkedReminders, setCheckedReminders] = useState<
    Record<string, boolean>
  >({});
  const [recentMessages, setRecentMessages] = useState<RealtimeChatMessage[]>(
    []
  );

  useEffect(() => {
    const unsub = subscribeToRealtimeChat((msgs) => {
      setRecentMessages(msgs.slice(-2).reverse());
    });
    return () => unsub();
  }, []);

  const cycleDays = patient?.cycleDurationDays || 28;
  const lastPeriod = patient?.lastPeriodDate
    ? new Date(patient.lastPeriodDate)
    : new Date(Date.now() - 14 * 86400000);

  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastPeriod.getTime());
  const currentCycleDay = Math.min(
    cycleDays,
    Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1)
  );

  let phaseName = 'Fase Folicular';
  let phaseDescription =
    'Energia e disposição em alta com elevação progressiva do estrogênio.';
  let fertilityStatus = 'Janela Fértil Estimada';
  const daysUntilPeriod = Math.max(1, cycleDays - currentCycleDay);

  if (currentCycleDay <= (patient?.periodDurationDays || 5)) {
    phaseName = 'Fase Menstrual';
    phaseDescription =
      'Dias de fluxo. Priorize repouso, hidratação e alimentos quentes e reconfortantes.';
    fertilityStatus = 'Baixa Probabilidade Estimada';
  } else if (currentCycleDay >= 12 && currentCycleDay <= 16) {
    phaseName = 'Janela Fértil & Ovulação Estimada';
    phaseDescription =
      'Estimativa educativa do período ovulatório baseada na duração média do seu ciclo.';
    fertilityStatus = 'Janela Fértil Ativa';
  } else if (currentCycleDay > 16) {
    phaseName = 'Fase Lútea';
    phaseDescription =
      'Aumento fisiológico da progesterona. Observe sinais como retenção hídrica ou sensibilidade.';
    fertilityStatus = 'Pós-Ovulação';
  }

  const urgentExams = INITIAL_PREVENTIVE_EXAMS.filter(
    (e) => e.status === 'atrasado' || e.status === 'proximo_vencer'
  );

  const featuredWomanArticles = WOMAN_EDUCATIONAL_ARTICLES.slice(0, 2);

  const toggleQuickReminder = (id: string, title: string) => {
    const next = !checkedReminders[id];
    setCheckedReminders((prev) => ({ ...prev, [id]: next }));
    if (next) {
      showToast({
        title: 'Lembrete concluído',
        description: `"${title}" foi marcado como concluído hoje.`,
        tone: 'success',
      });
    }
  };

  return (
    <div className="space-y-7 sm:space-y-8 animate-fadeIn pb-12">
      {/* =====================================================================
          1. SAUDAÇÃO + PERFIL & 2. RESUMO RÁPIDO DA SAÚDE FEMININA (8 + 4)
         ===================================================================== */}
      <section
        aria-label="Saudação e resumo da saúde feminina"
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch"
      >
        {/* Saudação + Perfil */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#5D1425] via-[#741C30] to-[#480D1B] rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden border border-[#DEC68E]/30 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#E6D4AF]">
              <span className="font-semibold uppercase tracking-wider">
                Saúde Integral da Mulher · Clínica Vittacare
              </span>
              <span aria-hidden="true">·</span>
              <span>{phaseName}</span>
              <span aria-hidden="true">·</span>
              <span>Ciclo de {cycleDays} dias</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              Olá, {patient?.preferredName || 'Camila'}!{' '}
              <span className="text-[#E6D4AF] font-normal italic">
                Hoje é o Dia {currentCycleDay} do seu ciclo.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-200 max-w-xl leading-relaxed">
              {phaseDescription}
            </p>
          </div>

          <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-stone-300 block">
                Próximo Fluxo Estimado
              </span>
              <strong className="text-white text-sm">
                Em {daysUntilPeriod} dias
              </strong>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-stone-300 block">
                Estimativa Fértil (Educativa)
              </span>
              <strong className="text-[#E6D4AF] text-sm">
                {fertilityStatus}
              </strong>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-stone-300 block">
                Planejamento / Método
              </span>
              <strong className="text-white text-xs truncate block">
                {patient?.contraceptiveMethod || 'Preservativo'}
              </strong>
            </div>
          </div>
        </div>

        {/* Resumo Rápido da Saúde Feminina */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-[#E6D4AF] p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Flower2 className="w-4 h-4 text-[#8D253D]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#480D1B]">
                Resumo Ginecológico
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#FAF0F2] text-[#5D1425] border border-[#EBBEC8] text-[10px] font-bold">
              Dia {currentCycleDay}/{cycleDays}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E6D4AF]/60 flex items-center justify-between">
              <span className="text-stone-600">Fase Atual</span>
              <strong className="font-serif text-[#480D1B]">{phaseName}</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E6D4AF]/60 flex items-center justify-between">
              <span className="text-stone-600">Exames Monitorados</span>
              <strong className="font-serif text-[#480D1B]">
                {INITIAL_PREVENTIVE_EXAMS.length} em carteira
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E6D4AF]/60 flex items-center justify-between">
              <span className="text-stone-600">Faixa Etária / Sangue</span>
              <strong className="font-serif text-[#480D1B]">
                {patient?.age || 32} anos · {patient?.bloodType || 'O+'}
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('cycle_tracker')}
            className="w-full py-2.5 px-3.5 rounded-xl bg-[#FAF0F2] hover:bg-[#F5DADF] text-[#5D1425] border border-[#EBBEC8] font-bold text-xs transition-all cursor-pointer flex items-center justify-between"
          >
            <span>Abrir Calendário do Ciclo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* =====================================================================
          2. AÇÕES PRINCIPAIS & ATENÇÃO PREVENTIVA
         ===================================================================== */}
      <section aria-label="Ações principais" className="space-y-4">
        <div className="rounded-2xl bg-white border-l-4 border-l-[#B89243] border border-[#E6D4AF] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6ED] text-[#9B7731] flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#9B7731] uppercase tracking-wider">
                <span>Atenção Preventiva</span>
                <span aria-hidden="true">·</span>
                <span className="text-stone-500 font-normal normal-case">
                  Rastreio ginecológico periódico ({patient?.age || 32} anos)
                </span>
              </div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#480D1B] mt-0.5">
                {urgentExams.length > 0
                  ? `Você possui ${urgentExams.length} exame(s) preventivo(s) próximos do vencimento ou pendentes`
                  : 'Seus exames preventivos principais estão em dia!'}
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                {urgentExams[0]?.name
                  ? `Destaque: ${urgentExams[0].name} (${urgentExams[0].nextDueDate}). Mantenha seu rastreio atualizado.`
                  : 'Continue acompanhando seus resultados e orientações na carteira preventiva.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('preventive_screening')}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Revisar Preventivos
            </button>
            <button
              type="button"
              onClick={() => onNavigate('documents')}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#FAF6ED] hover:bg-[#F3EBD8] text-[#480D1B] border border-[#E6D4AF] text-xs font-bold transition-colors cursor-pointer"
            >
              Meus Laudos
            </button>
          </div>
        </div>

        {/* 4 Quick Actions Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('cycle_tracker')}
            className="p-3.5 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white flex items-center gap-3 transition-all cursor-pointer shadow-2xs text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-white/15 text-[#E6D4AF] flex items-center justify-center shrink-0">
              <Flower2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">
                Registrar Ciclo
              </span>
              <span className="text-[10px] text-[#E6D4AF] block truncate">
                Fluxo, sintomas e humor
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
                Chat Enfermagem
              </span>
              <span className="text-[10px] text-emerald-700 font-medium block truncate">
                Dúvidas e acolhimento
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('preventive_screening')}
            className="p-3.5 rounded-2xl bg-white hover:bg-[#FAF6ED] border border-[#E6D4AF] text-[#480D1B] flex items-center gap-3 transition-all cursor-pointer shadow-2xs text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF6ED] text-[#9B7731] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">
                Carteira Preventiva
              </span>
              <span className="text-[10px] text-stone-500 block truncate">
                Papanicolaou e USG
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('documents')}
            className="p-3.5 rounded-2xl bg-white hover:bg-[#FAF0F2] border border-[#E6D4AF] text-[#480D1B] flex items-center gap-3 transition-all cursor-pointer shadow-2xs text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] text-[#5D1425] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">
                Exames & Receitas
              </span>
              <span className="text-[10px] text-stone-500 block truncate">
                Laudos e prescrições
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* =====================================================================
          3. PRÓXIMOS COMPROMISSOS & LEMBRETES (Grid 7 + 5)
         ===================================================================== */}
      <section
        aria-label="Próximos compromissos e lembretes"
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
      >
        {/* Próximos Compromissos */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          <SectionHeader
            overline="Agenda Ginecológica"
            title="Próxima Consulta & Check-up"
            subtitle="Consultas e acompanhamento preventivo"
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
            <div className="p-5 rounded-2xl bg-white border border-[#E6D4AF] flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-bold text-[#5D1425] uppercase tracking-wider">
                    Ginecologia · Confirmada
                  </span>
                  <span className="font-semibold text-[#480D1B]">
                    15/10 · 14:00
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#480D1B] mt-2 leading-snug">
                  Avaliação Ginecológica & Revisão de Exames
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Enfª. Letícia & Equipe Médica Vittacare · Unidade Jardins
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">
                  Levar últimos resultados
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('calendar')}
                  className="text-xs font-bold text-[#5D1425] hover:text-[#8D253D] flex items-center gap-1 cursor-pointer"
                >
                  <span>Gerenciar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8] flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#8D253D]">
                  <span className="font-bold uppercase tracking-wider">
                    Rastreio Preventivo
                  </span>
                  <span>{INITIAL_PREVENTIVE_EXAMS.length} exames</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#480D1B] mt-2 leading-snug">
                  Papanicolaou, Mamografia & Sorologias
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Acompanhe a periodicidade recomendada para sua faixa etária.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#EBBEC8]/60 flex items-center justify-between">
                <span className="text-[11px] text-[#5D1425] font-medium">
                  Protocolo Febrasgo / MS
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('preventive_screening')}
                  className="text-xs font-bold text-[#5D1425] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Abrir Prevenção</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lembretes de Saúde Feminina */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          <SectionHeader
            overline="Rotina & Autocuidado"
            title="Lembretes do Dia"
            subtitle="Contraceptivo, vitaminas e hidratação"
            icon={<Bell className="w-4 h-4" />}
            action={
              <button
                type="button"
                onClick={() => onNavigate('reminders')}
                className="text-xs font-bold text-[#8D253D] hover:underline cursor-pointer"
              >
                Ver todos ({INITIAL_WOMAN_REMINDERS.length})
              </button>
            }
          />

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E6D4AF] shadow-2xs flex-1 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              {INITIAL_WOMAN_REMINDERS.slice(0, 3).map((rem) => {
                const isDone = Boolean(checkedReminders[rem.id]);
                return (
                  <div
                    key={rem.id}
                    onClick={() => toggleQuickReminder(rem.id, rem.title)}
                    className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isDone
                        ? 'bg-stone-50 border-stone-200 text-stone-400'
                        : 'bg-[#FDFBF7] border-[#E6D4AF] hover:border-[#8D253D]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => {}}
                        className="mt-0.5 rounded accent-[#5D1425]"
                      />
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold truncate ${
                            isDone ? 'line-through' : 'text-[#480D1B]'
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
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. ACOMPANHAMENTOS IMPORTANTES
         ===================================================================== */}
      <section aria-label="Acompanhamentos importantes" className="space-y-5">
        <DailyCheckinPanel
          onOpenNurseChat={onOpenNurseChat}
          onOpenSOS={onOpenSOS}
        />

        <div className="bg-white rounded-2xl p-5 border border-[#E6D4AF] shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#8D253D]" />
              <h2 className="font-serif font-bold text-lg text-[#480D1B]">
                Mensagens da Enfermagem
              </h2>
              <span className="ml-2 text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Equipe Disponível
              </span>
            </div>
            {onOpenNurseChat && (
              <button
                type="button"
                onClick={onOpenNurseChat}
                className="px-4 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-[#E6D4AF] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Abrir Chat</span>
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
          5. CONTEÚDOS E INFORMAÇÕES DE SAÚDE FEMININA
         ===================================================================== */}
      <section aria-label="Conteúdos e informações">
        <SectionHeader
          overline="Educação em Saúde"
          title="Conteúdos Recomendados para Você"
          subtitle="Prevenção ginecológica, autoconhecimento, fertilidade e bem-estar"
          icon={<BookOpen className="w-4 h-4" />}
          action={
            <button
              type="button"
              onClick={() => onNavigate('woman_education')}
              className="text-xs font-bold text-[#8D253D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Todos os Guias</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredWomanArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => onNavigate('woman_education')}
              className="p-5 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] transition-all cursor-pointer shadow-2xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px] text-[#8D253D] font-bold uppercase tracking-wider mb-1.5">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#B89243]" />
                    {art.categoryLabel}
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
                  Ler artigo <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          6. ATALHOS SECUNDÁRIOS
         ===================================================================== */}
      <section aria-label="Atalhos secundários">
        <SectionHeader
          overline="Navegação Rápida"
          title="Áreas de Saúde Feminina"
          subtitle="Acesso rápido aos seus módulos clínicos"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('cycle_tracker')}
            className="p-3.5 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] text-[#8D253D] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#480D1B]">
                Ciclo & Ovulação
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                Calendário menstrual
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('preventive_screening')}
            className="p-3.5 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF6ED] text-[#9B7731] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#480D1B]">
                Prevenção
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                Papanicolaou e USG
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('documents')}
            className="p-3.5 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] text-[#5D1425] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#480D1B]">
                Documentos
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                Receitas e laudos
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
                Diário ginecológico
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('news')}
            className="p-3.5 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF6ED] text-[#5D1425] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#480D1B]">
                Mural Vittacare
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                Eventos e avisos
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="p-3.5 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF] hover:border-[#B89243] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-white text-[#9B7731] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#480D1B]">
                Meu Perfil
              </h3>
              <p className="text-[11px] text-stone-600 mt-0.5 line-clamp-1">
                Dados e LGPD
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Aviso Educativo — Não substitui diagnóstico médico */}
      <EducationalClinicalBanner variant="patient" onOpenSOS={onOpenSOS} />
    </div>
  );
};
