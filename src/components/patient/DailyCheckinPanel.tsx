import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Moon,
  Zap,
  Pill,
  Smile,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  PhoneCall,
  HeartPulse,
  Sparkles,
} from 'lucide-react';
import { DailyHealthCheckin } from '../../types';
import { usePatient } from '../../context/PatientContext';
import { useFeedback } from '../../context/FeedbackContext';
import { EducationalClinicalBanner } from '../ui';

interface DailyCheckinPanelProps {
  onOpenNurseChat?: () => void;
  onOpenSOS?: () => void;
}

const CHECKIN_STORAGE_KEY = 'vittaconect_daily_checkin_v2';

export const DailyCheckinPanel: React.FC<DailyCheckinPanelProps> = ({
  onOpenNurseChat,
  onOpenSOS,
}) => {
  const { patient } = usePatient();
  const { showToast } = useFeedback();
  const isPregnant = patient?.userMode !== 'saude_feminina';
  const todayStr = new Date().toISOString().split('T')[0];

  const [checkin, setCheckin] = useState<DailyHealthCheckin>(() => {
    try {
      const saved = localStorage.getItem(CHECKIN_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.date === todayStr) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return {
      id: `chk-${todayStr}`,
      date: todayStr,
      mood: 'bem',
      hydrationCups: 5,
      hydrationGoal: 10,
      sleepHours: 7.5,
      energyLevel: 4,
      pelvicFloorDone: false,
      supplementsTaken: true,
      bloodPressureSystolic: 110,
      bloodPressureDiastolic: 70,
      fetalMovementsCount: 12,
    };
  });

  const [savedToday, setSavedToday] = useState(false);
  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(checkin));
    } catch {
      // ignore
    }
  }, [checkin]);

  const redFlagOptions = isPregnant
    ? [
        'Dor de cabeça intensa ou visão turva (escotomas)',
        'Sangramento vaginal ou perda de líquido amniótico',
        'Redução importante dos movimentos do bebê',
        'Contrações regulares e dolorosas antes de 37 semanas',
        'Febre (≥ 37,8°C) ou inchaço súbito em rosto/mãos',
      ]
    : [
        'Dor pélvica aguda intensa e súbita',
        'Sangramento vaginal intenso fora do período menstrual',
        'Febre associada a corrimento com odor forte',
        'Nódulo mamário palpável ou saída de secreção',
      ];

  const toggleRedFlag = (flag: string) => {
    setSelectedRedFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  const handleSaveCheckin = () => {
    setSavedToday(true);
    showToast({
      type: 'success',
      title: 'Check-in Diário Registrado',
      message: `Seus indicadores de hoje (${checkin.hydrationCups}/${checkin.hydrationGoal} copos d'água, ${checkin.sleepHours}h de sono) foram salvos com sucesso.`,
    });
  };

  return (
    <section
      aria-label="Painel Inteligente de Check-in Diário e Sinais de Atenção"
      className="space-y-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Como estou hoje? (Check-in Diário Rápido - 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-[#E6D4AF]/80 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FAF0F2] text-[#8D253D] border border-[#EBBEC8]">
                <Smile className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-800 leading-tight">
                  Como você está hoje, {patient?.preferredName || 'Paciente'}?
                </h3>
                <p className="text-xs text-stone-500">
                  Check-in diário de humor, hidratação, suplemento, sono e energia
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveCheckin}
              className="px-3.5 py-2 rounded-xl bg-[#5D1425] hover:bg-[#480D1B] text-[#E6D4AF] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{savedToday ? 'Check-in Salvo ✓' : 'Salvar Check-in'}</span>
            </button>
          </div>

          {/* 1. Mood Selector */}
          <div>
            <span className="text-xs font-bold text-[#480D1B] block mb-2">
              1. Humor & Disposição Emocional Hoje:
            </span>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {(
                [
                  { id: 'otima', emoji: '✨', label: 'Radiante' },
                  { id: 'bem', emoji: '😊', label: 'Tranquila' },
                  { id: 'cansada', emoji: '😴', label: 'Cansada' },
                  { id: 'ansiosa', emoji: '💭', label: 'Sensível' },
                  { id: 'desconforto', emoji: '🤕', label: 'Incomodada' },
                ] as const
              ).map((m) => {
                const active = checkin.mood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setCheckin((prev) => ({ ...prev, mood: m.id }))}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      active
                        ? 'bg-[#FAF0F2] border-[#8D253D] text-[#5D1425] font-bold shadow-2xs ring-1 ring-[#8D253D]/30'
                        : 'bg-stone-50/70 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-lg block">{m.emoji}</span>
                    <span className="text-[10px] sm:text-[11px] block mt-0.5">
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Hydration, Supplements, Sleep & Energy Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Hydration Counter */}
            <div className="p-3.5 rounded-2xl bg-[#FAF6ED]/70 border border-[#E6D4AF] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#480D1B] flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  Hidratação
                </span>
                <span className="text-xs font-bold text-sky-800">
                  {checkin.hydrationCups}/{checkin.hydrationGoal} copos
                </span>
              </div>
              <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-600 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (checkin.hydrationCups / checkin.hydrationGoal) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-1 pt-0.5">
                <button
                  type="button"
                  onClick={() =>
                    setCheckin((prev) => ({
                      ...prev,
                      hydrationCups: Math.max(0, prev.hydrationCups - 1),
                    }))
                  }
                  className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  -1
                </button>
                <span className="text-[10px] text-stone-500">
                  {(checkin.hydrationCups * 0.25).toFixed(2)}L hoje
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCheckin((prev) => ({
                      ...prev,
                      hydrationCups: Math.min(16, prev.hydrationCups + 1),
                    }))
                  }
                  className="px-2.5 py-1 rounded-lg bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 cursor-pointer"
                >
                  + Copo
                </button>
              </div>
            </div>

            {/* Sleep & Energy */}
            <div className="p-3.5 rounded-2xl bg-[#FAF6ED]/70 border border-[#E6D4AF] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#480D1B] flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  Sono & Energia
                </span>
                <span className="text-xs font-bold text-indigo-900">
                  {checkin.sleepHours}h
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={11}
                step={0.5}
                value={checkin.sleepHours}
                onChange={(e) =>
                  setCheckin((prev) => ({
                    ...prev,
                    sleepHours: Number(e.target.value),
                  }))
                }
                aria-label="Horas de sono na última noite"
                className="w-full accent-[#5D1425] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-stone-600">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-600" />
                  Energia: {checkin.energyLevel}/5
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCheckin((prev) => ({
                      ...prev,
                      energyLevel: (prev.energyLevel % 5) + 1,
                    }))
                  }
                  className="underline font-bold text-[#8D253D] cursor-pointer"
                >
                  Ajustar
                </button>
              </div>
            </div>

            {/* Supplements & Daily Habit */}
            <div className="p-3.5 rounded-2xl bg-[#FAF6ED]/70 border border-[#E6D4AF] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#480D1B] flex items-center gap-1">
                  <Pill className="w-3.5 h-3.5 text-emerald-700" />
                  Suplemento do Dia
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setCheckin((prev) => ({
                    ...prev,
                    supplementsTaken: !prev.supplementsTaken,
                  }))
                }
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  checkin.supplementsTaken
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {checkin.supplementsTaken
                    ? 'Tomado Hoje ✓'
                    : 'Marcar como Tomado'}
                </span>
              </button>
              <span className="text-[10px] text-stone-500 text-center block">
                {isPregnant
                  ? 'Ácido Fólico / Polivitamínico Materno'
                  : 'Vitamina D / Anticoncepcional'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Há algum sinal que merece atenção hoje? (Red Flag Triage - 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-[#E6D4AF]/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-800 leading-tight">
                    Sinais de Atenção Hoje
                  </h3>
                  <p className="text-xs text-stone-500">
                    Triagem educativa preventiva • Marque se sentir algum sintoma:
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              {redFlagOptions.map((flag) => {
                const isSelected = selectedRedFlags.includes(flag);
                return (
                  <button
                    key={flag}
                    type="button"
                    onClick={() => toggleRedFlag(flag)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold'
                        : 'bg-[#FDFBF7] border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{flag}</span>
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] shrink-0 ${
                        isSelected
                          ? 'bg-rose-600 border-rose-600 text-white'
                          : 'border-stone-300'
                      }`}
                    >
                      {isSelected ? '!' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedRedFlags.length > 0 ? (
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-2.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  Atenção: {selectedRedFlags.length} sinal(is) de alerta selecionado(s)
                </span>
              </div>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                Recomendamos comunicar imediatamente a equipe de enfermagem Vittacare ou acionar o plantão SOS para avaliação profissional.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {onOpenNurseChat && (
                  <button
                    type="button"
                    onClick={onOpenNurseChat}
                    className="py-2 px-3 rounded-xl bg-[#5D1425] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chamar Enfermagem</span>
                  </button>
                )}
                {onOpenSOS && (
                  <button
                    type="button"
                    onClick={onOpenSOS}
                    className="py-2 px-3 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>SOS Obstétrico</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-emerald-900 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Nenhum sinal de alerta marcado hoje. Continue seu cuidado diário!</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Educational Disclaimer Banner (Section 9 & 16) */}
      <EducationalClinicalBanner variant="patient" />
    </section>
  );
};
