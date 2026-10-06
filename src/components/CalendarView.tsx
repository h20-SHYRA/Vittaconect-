import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Video,
  Star,
  Clock,
  MapPin,
  FileText,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Stethoscope,
  RefreshCw,
  CheckSquare,
  Send,
  XCircle,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { Appointment } from '../types';
import { INITIAL_APPOINTMENTS } from '../data/mockData';
import { useFeedback } from '../context/FeedbackContext';
import { sendRealtimeChatMessage } from '../services/realtimeChat';
import { usePatient } from '../context/PatientContext';

interface CalendarViewProps {
  onStartTelehealth: (appointmentId: string) => void;
}

const APPOINTMENTS_STORAGE_KEY = 'vittaconect_patient_appointments_v2';

type PeriodViewMode = 'hoje' | 'proximos' | 'semana' | 'mes';
type CategoryFilter = 'todos' | 'consulta' | 'retorno' | 'exame' | 'teleconsulta';
type ClinicalStatusFilter =
  | 'todos'
  | 'confirmado'
  | 'aguardando_confirmacao'
  | 'cancelado'
  | 'concluido';

function resolveCategory(
  apt: Appointment
): 'consulta' | 'retorno' | 'exame' | 'teleconsulta' {
  if (apt.appointmentCategory) return apt.appointmentCategory;
  if (apt.type === 'telehealth') return 'teleconsulta';
  if (apt.type === 'ultrasound' || apt.type === 'exam' || apt.type === 'lab')
    return 'exame';
  if (
    apt.type === 'return' ||
    apt.title.toLowerCase().includes('retorno') ||
    apt.title.toLowerCase().includes('revisão')
  ) {
    return 'retorno';
  }
  return 'consulta';
}

function resolveClinicalStatus(
  apt: Appointment
): 'confirmado' | 'aguardando_confirmacao' | 'cancelado' | 'concluido' {
  if (apt.clinicalStatus) return apt.clinicalStatus;
  if (apt.completed || apt.status === 'completed') return 'concluido';
  if (apt.confirmedByPatient) return 'confirmado';
  return 'aguardando_confirmacao';
}

const ENRICHED_DEFAULT_APPOINTMENTS: Appointment[] = [
  ...INITIAL_APPOINTMENTS.map((apt, idx) => ({
    ...apt,
    appointmentCategory: resolveCategory(apt),
    clinicalStatus:
      idx === 0
        ? ('confirmado' as const)
        : idx === 1
        ? ('aguardando_confirmacao' as const)
        : ('confirmado' as const),
    confirmedByPatient: idx !== 1,
  })),
  {
    id: 'apt-retorno-1',
    title: 'Retorno de Revisão Laboratorial & Curva Glicêmica',
    professional: 'Enfª. Letícia',
    role: 'Enfermeira Obstetra & Saúde da Mulher',
    type: 'return',
    appointmentCategory: 'retorno',
    clinicalStatus: 'aguardando_confirmacao',
    date: '2026-10-19',
    time: '11:00',
    location: 'Clínica Vittacare - Consultório 02',
    instructions: 'Trazer resultados de hemograma, ferritina e glicemia em jejum.',
  },
  {
    id: 'apt-concluido-1',
    title: 'Consulta de Acolhimento & Abertura de Cartão Pré-Natal',
    professional: 'Enf. Marcelo',
    role: 'Enfermeiro Especialista Vittacare',
    type: 'prenatal',
    appointmentCategory: 'consulta',
    clinicalStatus: 'concluido',
    completed: true,
    confirmedByPatient: true,
    date: '2026-10-02',
    time: '09:00',
    location: 'Clínica Vittacare - Unidade Jardins',
    instructions: 'Atendimento concluído e registrado em prontuário SOAP.',
  },
];

export const CalendarView: React.FC<CalendarViewProps> = ({
  onStartTelehealth,
}) => {
  const { showToast } = useFeedback();
  const { patient } = usePatient();

  // Section 10: Period Views (hoje, próximos dias, semana, mês)
  const [periodMode, setPeriodMode] = useState<PeriodViewMode>('proximos');
  // Section 10: Visual Category Differentiation (consulta, retorno, exame, teleconsulta)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('todos');
  // Section 10: Clear States (confirmado, aguardando confirmação, cancelado, concluído)
  const [statusFilter, setStatusFilter] =
    useState<ClinicalStatusFilter>('todos');

  const [currentMonth] = useState('Outubro 2026');
  const [selectedDay, setSelectedDay] = useState<number | null>(12);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(
    null
  );
  const [rescheduleDate, setRescheduleDate] = useState('2026-10-24');
  const [rescheduleReason, setRescheduleReason] = useState('');

  // New appointment form state
  const [newCategory, setNewCategory] = useState<
    'consulta' | 'retorno' | 'exame' | 'teleconsulta'
  >('consulta');
  const [newServiceType, setNewServiceType] = useState(
    'Consulta Pré-natal Presencial (Enf. Marcelo)'
  );
  const [newPrefDate, setNewPrefDate] = useState('2026-10-20');
  const [newPrefPeriod, setNewPrefPeriod] = useState<
    'Manhã' | 'Tarde' | 'Noite'
  >('Manhã');
  const [newNotes, setNewNotes] = useState('');

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (saved) {
        const parsed: Appointment[] = JSON.parse(saved);
        return parsed.map((apt) => ({
          ...apt,
          appointmentCategory: resolveCategory(apt),
          clinicalStatus: resolveClinicalStatus(apt),
        }));
      }
      return ENRICHED_DEFAULT_APPOINTMENTS;
    } catch {
      return ENRICHED_DEFAULT_APPOINTMENTS;
    }
  });

  const [prepChecked, setPrepChecked] = useState<Record<string, boolean>>({
    'apt-1-doc': true,
    'apt-1-exams': true,
    'apt-2-cam': true,
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        APPOINTMENTS_STORAGE_KEY,
        JSON.stringify(appointments)
      );
    } catch {
      // ignore storage quota errors
    }
  }, [appointments]);

  const togglePrepItem = (key: string) => {
    setPrepChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmPresence = (apt: Appointment) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === apt.id
          ? {
              ...item,
              confirmedByPatient: true,
              clinicalStatus: 'confirmado',
            }
          : item
      )
    );
    showToast({
      title: 'Presença Confirmada!',
      description: `Sua presença em "${apt.title}" (${apt.date
        .split('-')
        .reverse()
        .join('/')} às ${apt.time}) foi atualizada para Confirmado.`,
      tone: 'success',
    });
  };

  const handleMarkCompleted = (apt: Appointment) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === apt.id
          ? {
              ...item,
              completed: true,
              clinicalStatus: 'concluido',
            }
          : item
      )
    );
    showToast({
      title: 'Atendimento Concluído',
      description: `"${apt.title}" foi marcado como Concluído no seu histórico.`,
      tone: 'success',
    });
  };

  const handleCancelAppointment = (apt: Appointment) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === apt.id
          ? {
              ...item,
              clinicalStatus: 'cancelado',
              confirmedByPatient: false,
            }
          : item
      )
    );
    showToast({
      title: 'Agendamento Cancelado',
      description: `"${apt.title}" foi alterado para o estado Cancelado. Você pode reagendar quando desejar.`,
      tone: 'info',
    });
  };

  const handleRequestReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTarget) return;

    setAppointments((prev) =>
      prev.map((item) =>
        item.id === rescheduleTarget.id
          ? {
              ...item,
              date: rescheduleDate,
              rescheduleRequested: true,
              clinicalStatus: 'aguardando_confirmacao',
              confirmedByPatient: false,
              notes: `Reagendamento solicitado para ${rescheduleDate
                .split('-')
                .reverse()
                .join('/')}. Motivo: ${rescheduleReason || 'Ajuste de horário'}`,
            }
          : item
      )
    );

    try {
      await sendRealtimeChatMessage({
        channelId: 'group',
        senderId: patient?.id || 'pat-1',
        senderName: patient?.name || 'Paciente',
        senderRole: 'paciente',
        text: `📅 Solicitação de reagendamento para "${
          rescheduleTarget.title
        }" (nova data sugerida: ${rescheduleDate
          .split('-')
          .reverse()
          .join('/')}). Observação: ${
          rescheduleReason || 'Disponibilidade de agenda'
        }.`,
        category: 'retorno',
      });
    } catch {
      // fallback local
    }

    showToast({
      title: 'Solicitação de Reagendamento Enviada',
      description:
        'O agendamento agora aguarda confirmação da equipe Vittacare.',
      tone: 'info',
    });
    setRescheduleTarget(null);
    setRescheduleReason('');
  };

  const handleCreateScheduleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const isTele = newCategory === 'teleconsulta';
    const isExam = newCategory === 'exame';

    const createdApt: Appointment = {
      id: `apt-${Date.now()}`,
      title: newServiceType.split(' (')[0],
      professional: newServiceType.includes('(')
        ? newServiceType.split('(')[1].replace(')', '')
        : 'Equipe Clínica Vittacare',
      role: isTele
        ? 'Teleatendimento Especializado'
        : 'Atendimento Presencial Vittacare',
      date: newPrefDate,
      time:
        newPrefPeriod === 'Manhã'
          ? '09:30'
          : newPrefPeriod === 'Tarde'
          ? '15:00'
          : '18:30',
      type: isTele
        ? 'telehealth'
        : isExam
        ? 'ultrasound'
        : newCategory === 'retorno'
        ? 'return'
        : 'prenatal',
      appointmentCategory: newCategory,
      clinicalStatus: 'aguardando_confirmacao',
      status: 'upcoming',
      location: isTele
        ? 'Sala de Teleatendimento Vittaconect 2.0'
        : 'Clínica Vittacare - Unidade Jardins',
      instructions:
        newNotes.trim() ||
        'Chegar com 15 minutos de antecedência e trazer exames recentes.',
      confirmedByPatient: false,
    };

    setAppointments((prev) => [createdApt, ...prev]);
    setShowScheduleModal(false);
    setNewNotes('');

    showToast({
      title: 'Solicitação Registrada (Aguardando Confirmação)',
      description: `${createdApt.title} pré-agendado para ${newPrefDate
        .split('-')
        .reverse()
        .join('/')} (${newPrefPeriod}).`,
      tone: 'success',
    });
  };

  const eventDays: Record<
    number,
    {
      category: 'consulta' | 'retorno' | 'exame' | 'teleconsulta';
      title: string;
    }
  > = {
    2: { category: 'consulta', title: 'Consulta de Acolhimento (Concluída)' },
    12: { category: 'consulta', title: 'Consulta Pré-natal - Enf. Marcelo' },
    15: { category: 'teleconsulta', title: 'Teleorientação - Enfª. Stephanie' },
    19: { category: 'retorno', title: 'Retorno Laboratorial - Enfª. Letícia' },
    22: { category: 'exame', title: 'Ultrassom Morfológico 2º Trimestre' },
    28: { category: 'teleconsulta', title: 'Teleconsulta Nutricional' },
  };

  // Filtered appointments by Period + Category + Status
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const cat = resolveCategory(apt);
      const status = resolveClinicalStatus(apt);
      const dayNum = parseInt(apt.date.split('-')[2] || '12', 10);

      // Period filter (hoje = dia 12/15 em destaque, proximos = a partir de hoje, semana = 12..19, mes = todos)
      let matchesPeriod = true;
      if (periodMode === 'hoje') {
        matchesPeriod = dayNum === 12 || dayNum === 15;
      } else if (periodMode === 'semana') {
        matchesPeriod = dayNum >= 12 && dayNum <= 19;
      } else if (periodMode === 'proximos') {
        matchesPeriod = status !== 'concluido' && status !== 'cancelado';
      }

      const matchesCategory =
        categoryFilter === 'todos' || cat === categoryFilter;
      const matchesStatus =
        statusFilter === 'todos' || status === statusFilter;

      return matchesPeriod && matchesCategory && matchesStatus;
    });
  }, [appointments, periodMode, categoryFilter, statusFilter]);

  const getCategoryStyle = (
    cat: 'consulta' | 'retorno' | 'exame' | 'teleconsulta'
  ) => {
    switch (cat) {
      case 'consulta':
        return {
          label: 'Consulta Presencial',
          borderLeft: 'border-l-[#5D1425]',
          iconBg: 'bg-[#FAF0F2] text-[#5D1425]',
          textAccent: 'text-[#5D1425]',
          icon: Stethoscope,
        };
      case 'retorno':
        return {
          label: 'Retorno Clínico',
          borderLeft: 'border-l-[#B89243]',
          iconBg: 'bg-[#FAF6ED] text-[#9B7731]',
          textAccent: 'text-[#9B7731]',
          icon: RefreshCw,
        };
      case 'exame':
        return {
          label: 'Exame / Ultrassom',
          borderLeft: 'border-l-emerald-700',
          iconBg: 'bg-emerald-50 text-emerald-800',
          textAccent: 'text-emerald-800',
          icon: Activity,
        };
      case 'teleconsulta':
        return {
          label: 'Teleconsulta Online',
          borderLeft: 'border-l-[#144272]',
          iconBg: 'bg-[#E6F3FE] text-[#0A2647]',
          textAccent: 'text-[#144272]',
          icon: Video,
        };
    }
  };

  const getStatusMeta = (
    status: 'confirmado' | 'aguardando_confirmacao' | 'cancelado' | 'concluido'
  ) => {
    switch (status) {
      case 'confirmado':
        return {
          label: 'Confirmado',
          textClass: 'text-emerald-800 bg-emerald-50 border-emerald-200',
          icon: CheckCircle,
        };
      case 'aguardando_confirmacao':
        return {
          label: 'Aguardando Confirmação',
          textClass: 'text-amber-800 bg-amber-50 border-amber-200',
          icon: AlertCircle,
        };
      case 'cancelado':
        return {
          label: 'Cancelado',
          textClass: 'text-rose-800 bg-rose-50 border-rose-200',
          icon: XCircle,
        };
      case 'concluido':
        return {
          label: 'Concluído',
          textClass: 'text-stone-700 bg-stone-100 border-stone-300',
          icon: CheckSquare,
        };
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#8D253D] uppercase tracking-wider mb-1">
            Clínica Vittacare Integrada · Agenda Inteligente
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
            Minha Agenda de Saúde
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Visualize por hoje, próximos dias, semana ou mês, com distinção clara entre consulta, retorno, exame e teleconsulta.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowScheduleModal(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold tracking-wide transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#E6D4AF]" />
          <span>Agendar Atendimento</span>
        </button>
      </div>

      {/* =====================================================================
          SECTION 10 CONTROLS:
          1) Period View Selector (Hoje | Próximos Dias | Semana | Mês)
          2) Category Selector (Consulta | Retorno | Exame | Teleconsulta)
          3) Status Filter (Confirmado | Aguardando Confirmação | Cancelado | Concluído)
         ===================================================================== */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6D4AF] shadow-2xs space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Period Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF6ED] rounded-xl border border-[#E6D4AF]">
            {(
              [
                { id: 'hoje', label: 'Hoje' },
                { id: 'proximos', label: 'Próximos Dias' },
                { id: 'semana', label: 'Semana' },
                { id: 'mes', label: 'Mês Completo' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriodMode(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  periodMode === p.id
                    ? 'bg-[#5D1425] text-white shadow-2xs'
                    : 'text-stone-600 hover:text-[#5D1425]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Appointment Type Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'todos', label: 'Todos os Tipos' },
                { id: 'consulta', label: 'Consultas' },
                { id: 'retorno', label: 'Retornos' },
                { id: 'exame', label: 'Exames' },
                { id: 'teleconsulta', label: 'Teleconsultas' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  categoryFilter === cat.id
                    ? 'bg-[#FAF0F2] text-[#5D1425] border-[#8D253D]'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Strip */}
        <div className="pt-2.5 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1 shrink-0">
            Estado:
          </span>
          {(
            [
              { id: 'todos', label: 'Todos os Estados' },
              { id: 'confirmado', label: 'Confirmado' },
              { id: 'aguardando_confirmacao', label: 'Aguardando Confirmação' },
              { id: 'concluido', label: 'Concluído' },
              { id: 'cancelado', label: 'Cancelado' },
            ] as const
          ).map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-all cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-[#480D1B] text-[#E6D4AF]'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid: Monthly Calendar Widget + Appointments List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Calendar (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-[#E6D4AF] shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[11px] text-[#9B7731] font-semibold uppercase tracking-wider block">
                {periodMode === 'semana'
                  ? 'Visão Semanal (12 a 19 Out)'
                  : periodMode === 'hoje'
                  ? 'Agenda de Hoje'
                  : 'Calendário Mensal'}
              </span>
              <h2 className="text-xl font-serif font-bold text-[#480D1B]">
                {currentMonth}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPeriodMode('semana')}
                className="px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-[#FAF6ED] text-stone-600 text-[11px] font-semibold cursor-pointer"
              >
                Semana
              </button>
              <button
                type="button"
                onClick={() => setPeriodMode('mes')}
                className="px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-[#FAF6ED] text-stone-600 text-[11px] font-semibold cursor-pointer"
              >
                Mês
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-stone-400 mb-2">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            <div className="h-10" />
            <div className="h-10" />
            <div className="h-10" />
            <div className="h-10" />

            {Array.from({ length: 31 }).map((_, idx) => {
              const day = idx + 1;
              const event = eventDays[day];
              const isSelected = selectedDay === day;
              const isCurrentWeek = day >= 12 && day <= 18;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`relative h-11 rounded-xl flex flex-col items-center justify-center text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#5D1425] text-white font-bold shadow-sm scale-105'
                      : event
                      ? 'bg-[#FAF6ED] border border-[#B89243] text-[#480D1B] font-semibold'
                      : periodMode === 'semana' && isCurrentWeek
                      ? 'bg-[#FAF0F2]/70 text-[#5D1425] border border-[#EBBEC8]'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                  title={event ? event.title : `Dia ${day}`}
                >
                  <span>{day}</span>
                  {event && (
                    <Star
                      className={`w-2.5 h-2.5 mt-0.5 ${
                        isSelected
                          ? 'text-[#E6D4AF] fill-[#E6D4AF]'
                          : 'text-[#B89243] fill-[#B89243]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Preview */}
          {selectedDay && (
            <div className="mt-5 p-3.5 rounded-2xl bg-[#FAF0F2]/60 border border-[#EBBEC8] text-xs">
              {eventDays[selectedDay] ? (
                <div className="flex items-start gap-2.5">
                  <Star className="w-4 h-4 text-[#B89243] fill-[#B89243] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#480D1B] block">
                      Dia {selectedDay} de Outubro:
                    </span>
                    <span className="text-stone-700">
                      {eventDays[selectedDay].title}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-stone-500">
                  Dia {selectedDay} de Outubro: Dia livre para descanso e rotina de hidratação.
                </span>
              )}
            </div>
          )}

          {/* Legend for the 4 categories */}
          <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5D1425]" />
              <span>Consulta Presencial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B89243]" />
              <span>Retorno Clínico</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
              <span>Exame / Ultrassom</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#144272]" />
              <span>Teleconsulta</span>
            </div>
          </div>
        </div>

        {/* Right Column: Appointments List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#E6D4AF]">
              <p className="text-sm text-stone-600 font-medium">
                Nenhum agendamento encontrado para este período/filtro.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPeriodMode('mes');
                  setCategoryFilter('todos');
                  setStatusFilter('todos');
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-[#FAF0F2] text-[#5D1425] text-xs font-bold cursor-pointer"
              >
                Mostrar Todos os Agendamentos do Mês
              </button>
            </div>
          ) : (
            filteredAppointments.map((apt) => {
              const cat = resolveCategory(apt);
              const clinicalStatus = resolveClinicalStatus(apt);
              const catStyle = getCategoryStyle(cat);
              const statusMeta = getStatusMeta(clinicalStatus);
              const CatIcon = catStyle.icon;
              const StatusIcon = statusMeta.icon;
              const isTelehealth = cat === 'teleconsulta';

              return (
                <div
                  key={apt.id}
                  className={`rounded-2xl p-5 sm:p-6 bg-white border border-l-4 ${catStyle.borderLeft} border-[#E6D4AF] shadow-2xs transition-all space-y-4`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${catStyle.iconBg}`}
                      >
                        <CatIcon className="w-5 h-5" />
                      </div>

                      <div>
                        {/* Type + Explicit Status */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider ${catStyle.textAccent}`}
                          >
                            {catStyle.label}
                          </span>
                          <span aria-hidden="true" className="text-stone-300">
                            ·
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-[11px] font-bold ${statusMeta.textClass}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusMeta.label}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-lg text-[#480D1B] mt-1">
                          {apt.title}
                        </h3>

                        <p className="text-xs text-stone-600 font-medium mt-0.5">
                          {apt.professional}{' '}
                          {apt.role ? `• ${apt.role}` : ''}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-stone-500">
                          <span className="flex items-center gap-1.5 font-semibold text-stone-700">
                            <Clock className="w-3.5 h-3.5 text-[#B89243]" />
                            {apt.date.split('-').reverse().join('/')} às{' '}
                            {apt.time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#8D253D]" />
                            {apt.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isTelehealth && clinicalStatus !== 'cancelado' && (
                      <button
                        type="button"
                        onClick={() => onStartTelehealth(apt.id)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-[#E6D4AF] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
                      >
                        <Video className="w-4 h-4" />
                        <span>Entrar na Teleconsulta</span>
                      </button>
                    )}
                  </div>

                  {/* Instructions */}
                  {apt.instructions && (
                    <div className="p-3 rounded-xl bg-[#FDFBF7] border border-stone-200/70 flex items-start gap-2.5 text-xs text-stone-600">
                      <FileText className="w-4 h-4 text-[#9B7731] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-800">
                          Preparo / Observações:{' '}
                        </strong>
                        {apt.instructions}
                      </div>
                    </div>
                  )}

                  {/* Quick Pre-Consultation Checklist */}
                  {clinicalStatus !== 'cancelado' &&
                    clinicalStatus !== 'concluido' && (
                      <div className="p-3 rounded-xl bg-[#FAF6ED]/60 border border-[#E6D4AF] space-y-2">
                        <span className="text-[11px] font-bold text-[#480D1B] uppercase tracking-wider flex items-center gap-1.5">
                          <CheckSquare className="w-3.5 h-3.5 text-[#8D253D]" />
                          Checklist Pré-Atendimento:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(prepChecked[`${apt.id}-doc`])}
                              onChange={() => togglePrepItem(`${apt.id}-doc`)}
                              className="rounded accent-[#5D1425]"
                            />
                            <span>
                              Cartão Pré-Natal / Exames recentes separados
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(prepChecked[`${apt.id}-sint`])}
                              onChange={() => togglePrepItem(`${apt.id}-sint`)}
                              className="rounded accent-[#5D1425]"
                            />
                            <span>
                              Dúvidas e sintomas registrados no aplicativo
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                  {/* Action Buttons for State Management */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {clinicalStatus === 'aguardando_confirmacao' && (
                        <button
                          type="button"
                          onClick={() => handleConfirmPresence(apt)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-[#E6D4AF]" />
                          <span>Confirmar Presença</span>
                        </button>
                      )}

                      {clinicalStatus === 'confirmado' && (
                        <button
                          type="button"
                          onClick={() => handleMarkCompleted(apt)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>Marcar como Concluído</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {clinicalStatus !== 'concluido' && (
                        <button
                          type="button"
                          onClick={() => setRescheduleTarget(apt)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF6ED] text-stone-700 border border-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-[#8D253D]" />
                          <span>Reagendar</span>
                        </button>
                      )}

                      {clinicalStatus !== 'cancelado' &&
                        clinicalStatus !== 'concluido' && (
                          <button
                            type="button"
                            onClick={() => handleCancelAppointment(apt)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancelar</span>
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E6D4AF] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-[#480D1B]">
                Solicitar Reagendamento
              </h3>
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-stone-600">
              Atendimento: <strong>{rescheduleTarget.title}</strong>
            </p>
            <form onSubmit={handleRequestReschedule} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nova Data Sugerida
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D4AF] text-xs bg-[#FDFBF7]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Motivo / Preferência de Horário
                </label>
                <textarea
                  rows={2}
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="Ex.: Prefiro no período da tarde após as 14h"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6D4AF] text-xs bg-[#FDFBF7]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#5D1425] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Pedido</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      {showScheduleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-[#E6D4AF] shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF0F2] flex items-center justify-center text-[#5D1425]">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#480D1B]">
                    Solicitar Agendamento
                  </h3>
                  <p className="text-xs text-stone-500">
                    Clínica Vittacare • Atendimento Integrado
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateScheduleRequest} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                  Tipo de Atendimento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'consulta', label: 'Consulta' },
                      { id: 'retorno', label: 'Retorno' },
                      { id: 'exame', label: 'Exame / USG' },
                      { id: 'teleconsulta', label: 'Teleconsulta' },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewCategory(cat.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        newCategory === cat.id
                          ? 'bg-[#5D1425] text-white border-[#5D1425]'
                          : 'bg-[#FDFBF7] text-stone-700 border-[#E6D4AF]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                  Especialidade / Profissional
                </label>
                <select
                  value={newServiceType}
                  onChange={(e) => setNewServiceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6D4AF] bg-[#FDFBF7] text-xs font-medium text-stone-800 focus:outline-none focus:border-[#5D1425]"
                >
                  <option>Consulta Pré-natal Presencial (Enf. Marcelo)</option>
                  <option>Teleorientação de Enfermagem (Enfª. Stephanie)</option>
                  <option>Retorno de Avaliação de Exames (Enfª. Letícia)</option>
                  <option>Exame Ultrassom Obstétrico / Morfológico</option>
                  <option>Consulta de Amamentação & Plano de Parto (Enfª. Bianca)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                    Data Preferencial
                  </label>
                  <input
                    type="date"
                    value={newPrefDate}
                    onChange={(e) => setNewPrefDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6D4AF] bg-[#FDFBF7] text-xs text-stone-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                    Período
                  </label>
                  <select
                    value={newPrefPeriod}
                    onChange={(e) =>
                      setNewPrefPeriod(
                        e.target.value as 'Manhã' | 'Tarde' | 'Noite'
                      )
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6D4AF] bg-[#FDFBF7] text-xs text-stone-800"
                  >
                    <option value="Manhã">Manhã (08h - 12h)</option>
                    <option value="Tarde">Tarde (13h - 17h)</option>
                    <option value="Noite">Noite (18h - 20h)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                  Observações ou Queixas Principais
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ex.: Gostaria de avaliar exames recentes..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6D4AF] bg-[#FDFBF7] text-xs text-stone-800 focus:outline-none focus:border-[#5D1425]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold cursor-pointer"
                >
                  Confirmar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
