import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Droplet, 
  Heart, 
  Sparkles, 
  Plus, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  ShieldCheck, 
  AlertCircle,
  Smile,
  Flame,
  Clock,
  Compass
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { INITIAL_CYCLE_LOGS } from '../data/mockData';
import { CycleDayLog } from '../types';

export const CycleTrackerView: React.FC = () => {
  const { patient, registerOrUpdatePatient } = usePatient();

  const [logs, setLogs] = useState<CycleDayLog[]>(() => {
    try {
      const saved = localStorage.getItem('vittaconect_cycle_logs_v1');
      return saved ? JSON.parse(saved) : INITIAL_CYCLE_LOGS;
    } catch {
      return INITIAL_CYCLE_LOGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('vittaconect_cycle_logs_v1', JSON.stringify(logs));
  }, [logs]);

  const cycleDays = patient?.cycleDurationDays || 28;
  const periodDays = patient?.periodDurationDays || 5;

  // Selected date for viewing/editing log
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Calendar month state
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());

  // Form states for selected day
  const currentLog = logs.find((l) => l.date === selectedDate) || {
    date: selectedDate,
    flow: 'none',
    symptoms: [],
    mood: 'equilibrada',
    hadIntercourse: false,
    cervicalMucus: 'seco',
    notes: '',
  };

  const [editFlow, setEditFlow] = useState<any>(currentLog.flow || 'none');
  const [editSymptoms, setEditSymptoms] = useState<string[]>(currentLog.symptoms || []);
  const [editMood, setEditMood] = useState<any>(currentLog.mood || 'equilibrada');
  const [editMucus, setEditMucus] = useState<any>(currentLog.cervicalMucus || 'seco');
  const [editIntercourse, setEditIntercourse] = useState<boolean>(currentLog.hadIntercourse || false);
  const [editNotes, setEditNotes] = useState<string>(currentLog.notes || '');

  // Update form inputs when selectedDate changes
  useEffect(() => {
    const found = logs.find((l) => l.date === selectedDate);
    if (found) {
      setEditFlow(found.flow || 'none');
      setEditSymptoms(found.symptoms || []);
      setEditMood(found.mood || 'equilibrada');
      setEditMucus(found.cervicalMucus || 'seco');
      setEditIntercourse(found.hadIntercourse || false);
      setEditNotes(found.notes || '');
    } else {
      setEditFlow('none');
      setEditSymptoms([]);
      setEditMood('equilibrada');
      setEditMucus('seco');
      setEditIntercourse(false);
      setEditNotes('');
    }
  }, [selectedDate, logs]);

  const handleSaveDayLog = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CycleDayLog = {
      date: selectedDate,
      flow: editFlow,
      symptoms: editSymptoms,
      mood: editMood,
      cervicalMucus: editMucus,
      hadIntercourse: editIntercourse,
      notes: editNotes.trim() || undefined,
    };

    setLogs((prev) => {
      const filtered = prev.filter((l) => l.date !== selectedDate);
      return [...filtered, updated].sort((a, b) => a.date.localeCompare(b.date));
    });

    // If flow is heavy or medium, optionally update lastPeriodDate if it's recent
    if (editFlow === 'heavy' || editFlow === 'medium') {
      registerOrUpdatePatient({ lastPeriodDate: selectedDate });
    }
  };

  const toggleSymptom = (sym: string) => {
    setEditSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  // Calendar matrix generator
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Helper to test if a given day is fertile, period, or predicted
  const lastPeriodDateObj = patient?.lastPeriodDate ? new Date(patient.lastPeriodDate + 'T00:00:00') : new Date('2026-09-18T00:00:00');

  const getDayClassification = (dStr: string) => {
    const log = logs.find((l) => l.date === dStr);
    if (log && log.flow && log.flow !== 'none') {
      return { type: 'period', label: 'Menstruação' };
    }

    const targetDate = new Date(dStr + 'T00:00:00');
    const diffDays = Math.round((targetDate.getTime() - lastPeriodDateObj.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = ((diffDays % cycleDays) + cycleDays) % cycleDays + 1;

    if (cycleDay <= periodDays) {
      return { type: 'predicted_period', label: 'Previsão de Menstruação' };
    }
    if (cycleDay === 14) {
      return { type: 'ovulation', label: 'Ovulação Estimada' };
    }
    if (cycleDay >= 11 && cycleDay <= 16) {
      return { type: 'fertile', label: 'Janela Fértil' };
    }
    return { type: 'regular', label: 'Fase Regular' };
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F2] border border-[#EBBEC8] text-[#8D253D] text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-[#B89243]" />
            <span>Autoconhecimento & Fertilidade • Clínica Vittacare</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
            Calendário e Monitoramento do Ciclo Menstrual
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Rastreador de ciclo, previsão de fluxo e identificação da janela fértil para quem planeja engravidar ou busca prevenção.
          </p>
        </div>

        {/* Goal Indicator */}
        <div className="p-3 rounded-2xl bg-white border border-[#DEC68E] shadow-2xs self-start md:self-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] text-[#8D253D] flex items-center justify-center font-bold text-xs">
            {cycleDays}d
          </div>
          <div className="text-xs">
            <span className="text-stone-500 block">Duração do Ciclo</span>
            <strong className="text-[#480D1B]">Média de {cycleDays} dias</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar & Day Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Calendar (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-[#E6D4AF] shadow-2xs space-y-5">
          {/* Month Header Switcher */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#8D253D]" />
              <h2 className="font-serif font-bold text-xl text-[#480D1B]">
                {monthNames[month]} {year}
              </h2>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
                aria-label="Próximo mês"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1 border-t border-stone-100">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#8D253D]" /> Menstruação Registrada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#B89243]" /> Janela Fértil
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#741C30] ring-2 ring-[#B89243]" /> Ovulação Estimada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-100 border border-rose-300" /> Previsão Próxima
            </span>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-stone-500 pb-1">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-11 sm:h-12 rounded-xl" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;
              const isToday = todayStr === dateStr;
              const classification = getDayClassification(dateStr);

              let bgStyle = 'bg-stone-50 text-stone-700 hover:bg-stone-100';
              if (classification.type === 'period') {
                bgStyle = 'bg-[#8D253D] text-white font-bold shadow-xs';
              } else if (classification.type === 'ovulation') {
                bgStyle = 'bg-gradient-to-br from-[#B89243] to-[#8D253D] text-white font-bold ring-2 ring-[#B89243]';
              } else if (classification.type === 'fertile') {
                bgStyle = 'bg-[#FAF6ED] text-[#9B7731] font-semibold border border-[#DEC68E]';
              } else if (classification.type === 'predicted_period') {
                bgStyle = 'bg-rose-50 text-rose-800 border border-dashed border-rose-300';
              }

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-11 sm:h-13 rounded-2xl flex flex-col items-center justify-center p-1 transition-all cursor-pointer relative select-none ${bgStyle} ${
                    isSelected ? 'ring-2 ring-[#480D1B] scale-105 z-10' : ''
                  }`}
                >
                  <span className="text-xs sm:text-sm">{dayNum}</span>
                  {isToday && (
                    <span className="w-1 h-1 rounded-full bg-[#480D1B] absolute bottom-1" />
                  )}
                  {classification.type === 'ovulation' && (
                    <span className="text-[8px] uppercase tracking-tighter block leading-none font-bold text-[#FAF6ED]">
                      Ovul
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Guidance Note */}
          <div className="p-3 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF] text-xs text-stone-700 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#B89243] shrink-0" />
            <span>
              <strong>Dica médica Vittacare:</strong> O dia da ovulação ocorre cerca de 14 dias antes da próxima menstruação. Use este padrão tanto para planejar gravidez quanto para prevenir com maior assertividade.
            </span>
          </div>
        </div>

        {/* Right Column: Daily Log Editor (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-[#E6D4AF] shadow-2xs space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D253D] block">
              Registro Diário
            </span>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-[#480D1B]">
              {selectedDate === todayStr ? 'Hoje, ' : ''}{selectedDate}
            </h3>
            <span className="text-xs text-stone-500">
              {getDayClassification(selectedDate).label}
            </span>
          </div>

          <form onSubmit={handleSaveDayLog} className="space-y-4">
            {/* Flow selection */}
            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1.5">
                Fluxo Menstrual
              </label>
              <div className="grid grid-cols-5 gap-1.5 text-xs text-center">
                {[
                  { id: 'none', label: 'Nenhum' },
                  { id: 'spotting', label: 'Escape' },
                  { id: 'light', label: 'Leve' },
                  { id: 'medium', label: 'Médio' },
                  { id: 'heavy', label: 'Intenso' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setEditFlow(f.id)}
                    className={`py-2 px-1 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                      editFlow === f.id
                        ? 'bg-[#5D1425] text-white border-[#5D1425] shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms check */}
            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1.5">
                Sintomas do Dia
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'cólica',
                  'sensibilidade mamária',
                  'inchaço',
                  'dor de cabeça',
                  'dor lombar',
                  'acne',
                  'azia leve',
                ].map((sym) => {
                  const active = editSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
                        active
                          ? 'bg-[#FAF0F2] text-[#8D253D] border border-[#EBBEC8] font-bold'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {active ? '✓ ' : ''}{sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cervical Mucus */}
            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1.5">
                Aspecto do Muco Cervical
              </label>
              <select
                value={editMucus}
                onChange={(e) => setEditMucus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425] bg-stone-50/50"
              >
                <option value="seco">Seco / Sem muco perceptível</option>
                <option value="pegajoso">Pegajoso / Espesso (Pós-menstruação)</option>
                <option value="cremoso">Cremoso / Branco úmido</option>
                <option value="clara_de_ovo">Clara de Ovo / Elástico (Ápice Fértil)</option>
              </select>
            </div>

            {/* Mood & Intercourse */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1.5">
                  Humor
                </label>
                <select
                  value={editMood}
                  onChange={(e) => setEditMood(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425] bg-stone-50/50"
                >
                  <option value="equilibrada">Equilibrada</option>
                  <option value="radiante">Radiante / Energizada</option>
                  <option value="sensivel">Sensível / Emotiva</option>
                  <option value="irritada">Irritada / TPM</option>
                  <option value="cansada">Cansada / Fadigada</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1.5">
                  Relação Sexual
                </label>
                <button
                  type="button"
                  onClick={() => setEditIntercourse(!editIntercourse)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                    editIntercourse
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {editIntercourse ? '❤️ Sim (Registrado)' : 'Não / Não registrado'}
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1.5">
                Anotações Pessoais
              </label>
              <input
                type="text"
                placeholder="Ex: Treino intenso, sono tranquilo..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Registro de {selectedDate}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
