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
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { useFeedback } from '../context/FeedbackContext';
import {
  INITIAL_PREVENTIVE_EXAMS,
  INITIAL_WOMAN_REMINDERS,
} from '../data/mockData';
import { NavTab } from '../types';
import { DailyCheckinPanel } from './patient/DailyCheckinPanel';
import {
  subscribeToRealtimeChat,
  RealtimeChatMessage,
} from '../services/realtimeChat';
import { EducationalClinicalBanner } from './ui';

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
    <div className="space-y-6 sm:space-y-7 animate-fadeIn pb-12">
      {/* =====================================================================
          1. SAUDAÇÃO & RESUMO DO CICLO FEMININO
         ===================================================================== */}
      <section className="bg-gradient-to-br from-[#5D1425] via-[#741C30] to-[#480D1B] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-[#DEC68E]/30">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
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

          <div className="lg:col-span-4 lg:border-l lg:border-white/15 lg:pl-6 space-y-3">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2.5">
              <span className="text-[11px] font-bold text-[#E6D4AF] uppercase tracking-wider block">
                Monitoramento do Ciclo
              </span>
              <p className="text-xs text-stone-200 leading-relaxed">
                Registre fluxo, sintomas, humor e método contraceptivo no seu calendário menstrual.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('cycle_tracker')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#E6D4AF] hover:bg-[#DEC68E] text-[#480D1B] font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Abrir Calendário do Ciclo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. ALGO QUE PRECISA DA ATENÇÃO DA PACIENTE
         ===================================================================== */}
      <section
        aria-label="Atenção prioritária"
        className="rounded-2xl bg-white border-l-4 border-l-[#B89243] border border-[#E6D4AF] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FAF6ED] text-[#9B7731] flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#9B7731] uppercase tracking-wider">
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
            className="px-4 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Revisar Preventivos
          </button>
          <button
            type="button"
            onClick={() => onNavigate('documents')}
            className="px-3.5 py-2 rounded-xl bg-[#FAF6ED] hover:bg-[#F3EBD8] text-[#480D1B] border border-[#E6D4AF] text-xs font-bold transition-colors cursor-pointer"
          >
            Meus Laudos
          </button>
        </div>
      </section>

      {/* =====================================================================
          3. PRÓXIMA CONSULTA & AGENDA GINECOLÓGICA
         ===================================================================== */}
      <section aria-label="Próxima consulta">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-serif font-bold text-[#480D1B]">
            Próxima Consulta & Check-up
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('calendar')}
            className="text-xs font-bold text-[#8D253D] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Agenda Completa</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#E6D4AF] flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-bold text-[#5D1425] uppercase tracking-wider">
                  Consulta Ginecológica · Confirmada
                </span>
                <span className="font-semibold text-[#480D1B]">
                  15/10 às 14:00
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#480D1B] mt-1.5">
                Avaliação Ginecológica & Revisão de Exames
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Enfª. Letícia & Equipe Médica Vittacare · Unidade Jardins
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Preparo: Evitar duchas intravaginais 48h antes
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
              <div className="flex items-center justify-between text-xs text-[#8D253D]">
                <span className="font-bold uppercase tracking-wider">
                  Histórico & Rastreio Preventivo
                </span>
                <span>{INITIAL_PREVENTIVE_EXAMS.length} exames monitorados</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#480D1B] mt-1.5">
                Papanicolaou, Mamografia & Sorologias
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Acompanhe a periodicidade recomendada para sua faixa etária e compartilhe laudos com a enfermagem.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EBBEC8]/60 flex items-center justify-between">
              <span className="text-xs text-[#5D1425] font-medium">
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
      </section>

      {/* =====================================================================
          4. LEMBRETES & 5. MENSAGENS DA ENFERMAGEM
         ===================================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 4. Lembretes */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-[#E6D4AF] shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#8D253D]" />
                <h2 className="font-serif font-bold text-lg text-[#480D1B]">
                  Lembretes de Saúde Feminina
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('reminders')}
                className="text-xs font-bold text-[#8D253D] hover:underline cursor-pointer"
              >
                Ver todos ({INITIAL_WOMAN_REMINDERS.length})
              </button>
            </div>

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

        {/* 5. Mensagens */}
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
                Equipe Disponível
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

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
            <span className="text-[11px] text-stone-500">
              Tire dúvidas sobre ciclo, exames e contracepção
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
          6. ATALHOS ORGANIZADOS DE SAÚDE FEMININA (Section 8)
         ===================================================================== */}
      <section aria-label="Atalhos de saúde feminina">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-serif font-bold text-[#480D1B]">
            Áreas de Saúde Feminina
          </h2>
          <span className="text-xs text-stone-500">
            Ciclo, sintomas, prevenção, documentos e conteúdos
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <button
            type="button"
            onClick={() => onNavigate('cycle_tracker')}
            className="p-4 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#8D253D] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Ciclo & Histórico
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                Calendário menstrual, janela fértil e contracepção
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('preventive_screening')}
            className="p-4 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF6ED] text-[#9B7731] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Exames & Prevenção
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                Papanicolaou, mamografia, USG e rastreio periódico
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('documents')}
            className="p-4 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#5D1425] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Documentos & Receitas
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                Resultados, prescrições, atestados e laudos
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('woman_education')}
            className="p-4 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#8D253D] text-left transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF6ED] text-[#5D1425] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Conteúdos & Guias
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                Prevenção, saúde íntima, fertilidade e bem-estar
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Check-in Diário & Sintomas */}
      <DailyCheckinPanel
        onOpenNurseChat={onOpenNurseChat}
        onOpenSOS={onOpenSOS}
      />

      {/* Aviso Educativo — Não substitui diagnóstico médico (Section 8) */}
      <EducationalClinicalBanner variant="patient" onOpenSOS={onOpenSOS} />
    </div>
  );
};
