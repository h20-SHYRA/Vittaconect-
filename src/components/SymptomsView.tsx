import React, { useState, useEffect } from 'react';
import {
  Activity,
  Droplet,
  Plus,
  Check,
  Share2,
  Baby,
  AlertTriangle,
  Send,
  Printer,
  CheckCircle2,
} from 'lucide-react';
import { INITIAL_SYMPTOMS } from '../data/mockData';
import { SymptomEntry } from '../types';
import { useFeedback } from '../context/FeedbackContext';
import { usePatient } from '../context/PatientContext';
import { sendRealtimeChatMessage } from '../services/realtimeChat';
import { EducationalClinicalBanner } from './ui';

const SYMPTOMS_STORAGE_KEY = 'vittaconect_symptoms_log_v2';

export const SymptomsView: React.FC = () => {
  const { showToast } = useFeedback();
  const { patient } = usePatient();

  const [entries, setEntries] = useState<SymptomEntry[]>(() => {
    try {
      const saved = localStorage.getItem(SYMPTOMS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SYMPTOMS;
    } catch {
      return INITIAL_SYMPTOMS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SYMPTOMS_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries]);

  const [isLoggingOpen, setIsLoggingOpen] = useState(false);

  // New entry form state
  const [selectedMood, setSelectedMood] = useState<
    'radiant' | 'good' | 'tired' | 'uncomfortable' | 'anxious'
  >('good');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<'leve' | 'moderada' | 'intensa'>('leve');
  const [duration, setDuration] = useState('Iniciou hoje pela manhã');
  const [relievingFactors, setRelievingFactors] = useState('Melhora com repouso e hidratação');
  const [waterGlasses, setWaterGlasses] = useState(7);
  const [bloodPressure, setBloodPressure] = useState('110/70');
  const [weight, setWeight] = useState('62.5');
  const [notes, setNotes] = useState('');
  const [kickCount, setKickCount] = useState(12);

  const availableSymptoms = [
    'Leve enjoo',
    'Azia / refluxo',
    'Dor lombar',
    'Inchaço nas pernas/pés',
    'Cansaço / sonolência',
    'Movimentação fetal ativa',
    'Sensibilidade nos seios',
    'Sono agitado',
    'Cefaleia persistente',
    'Contrações ritmadas',
  ];

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  // Educational Clinical Triage Classification (Section 15)
  const computeClinicalClassification = (
    syms: string[],
    intens: 'leve' | 'moderada' | 'intensa',
    bp: string
  ): 'normal' | 'monitorar' | 'alerta' => {
    const sys = parseInt(bp.split('/')[0] || '110', 10);
    const dia = parseInt(bp.split('/')[1] || '70', 10);
    const hasHighRiskSymptom = syms.some(
      (s) =>
        s.toLowerCase().includes('cefaleia') || s.toLowerCase().includes('contrações')
    );

    if (intens === 'intensa' || sys >= 140 || dia >= 90 || hasHighRiskSymptom) {
      return 'alerta';
    }
    if (intens === 'moderada' || syms.length >= 3) {
      return 'monitorar';
    }
    return 'normal';
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const classification = computeClinicalClassification(
      selectedSymptoms,
      intensity,
      bloodPressure
    );

    const newEntry: SymptomEntry = {
      id: `sym-${Date.now()}`,
      date: 'Hoje',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      overallMood: selectedMood,
      symptoms:
        selectedSymptoms.length > 0 ? selectedSymptoms : ['Nenhum sintoma atípico'],
      intensity,
      duration,
      relievingFactors,
      clinicalClassification: classification,
      waterGlasses,
      bloodPressure: bloodPressure ? `${bloodPressure} mmHg` : undefined,
      weight: weight ? `${weight} kg` : undefined,
      notes: notes.trim() || undefined,
    };

    setEntries([newEntry, ...entries]);
    setIsLoggingOpen(false);
    setSelectedSymptoms([]);
    setNotes('');

    showToast({
      title: 'Registro Salvo no Diário Clínico',
      description:
        classification === 'alerta'
          ? 'Atenção: identificamos parâmetros que merecem avaliação da equipe de enfermagem.'
          : 'Seus sintomas e sinais vitais foram registrados com sucesso.',
      tone: classification === 'alerta' ? 'warning' : 'success',
    });
  };

  const handleShareWithNurse = async () => {
    const latest = entries[0];
    if (!latest) return;

    await sendRealtimeChatMessage({
      channelId: 'group',
      senderId: patient?.id || 'pat-1',
      senderName: patient?.name || 'Paciente',
      senderRole: 'paciente',
      text: `📋 Resumo do Diário de Sintomas (${latest.date} às ${latest.time}): Sintomas: ${latest.symptoms.join(', ')} | Intensidade: ${latest.intensity || 'leve'} | PA: ${latest.bloodPressure || 'N/A'} | Movimentos fetais hoje: ${kickCount}. ${latest.notes ? `Obs: ${latest.notes}` : ''}`,
      category: 'sintoma',
    });

    showToast({
      title: 'Resumo Enviado ao Plantão de Enfermagem',
      description:
        'A equipe Vittacare recebeu seu boletim de sintomas no chat em tempo real.',
      tone: 'success',
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8D253D] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#B89243]" />
            Acompanhamento Clínico Preventivo • Triagem Educativa
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
            Diário de Sintomas & Sinais de Alerta
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-xl">
            Registre sintomas com intensidade, duração e fatores de melhora para compartilhar com Enf. Marcelo, Enfª. Letícia, Enfª. Bianca e Enfª. Stephanie.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-[#E6D4AF] hover:bg-[#FAF6ED] text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#B89243]" />
            <span>Imprimir PDF</span>
          </button>

          <button
            type="button"
            onClick={handleShareWithNurse}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8] hover:bg-[#F5DFE4] text-[#5D1425] text-xs font-bold transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-[#8D253D]" />
            <span>Enviar p/ Enfermagem</span>
          </button>

          <button
            type="button"
            onClick={() => setIsLoggingOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E6D4AF]" />
            <span>Novo Registro</span>
          </button>
        </div>
      </div>

      {/* Quick Interactive Summary Cards: Fetal Kicks, Blood Pressure & Hydration */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8D253D] uppercase tracking-wider">
              Mobilograma / Chutes Hoje
            </span>
            <Baby className="w-5 h-5 text-[#8D253D]" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-serif font-bold text-[#480D1B] tabular-nums">
              {kickCount}
            </span>
            <span className="text-xs text-stone-600 ml-1.5">movimentos sentidos</span>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-[#EBBEC8]/60">
            <button
              type="button"
              onClick={() => {
                setKickCount((k) => k + 1);
                showToast({
                  title: 'Movimento Fetal Registrado',
                  description: `Total de hoje: ${kickCount + 1} movimentos sentidos.`,
                  tone: 'info',
                });
              }}
              className="flex-1 py-1.5 rounded-xl bg-white text-[#5D1425] font-bold text-xs border border-[#EBBEC8] hover:bg-[#FAF0F2] cursor-pointer"
            >
              +1 Movimento Sentido
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9B7731] uppercase tracking-wider">
              Última Pressão Arterial
            </span>
            <Activity className="w-5 h-5 text-[#9B7731]" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-serif font-bold text-[#480D1B] tabular-nums">
              {entries[0]?.bloodPressure?.replace(' mmHg', '') || '110/70'}
            </span>
            <span className="text-xs text-stone-600 ml-1.5">mmHg</span>
          </div>
          <p className="text-[11px] text-[#3B744C] font-semibold pt-2 border-t border-[#E6D4AF]/60 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            Vigilância ativa contra pré-eclâmpsia
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E6D4AF] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Meta Hídrica Diária
            </span>
            <Droplet className="w-5 h-5 text-[#3B744C]" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-serif font-bold text-[#480D1B] tabular-nums">
              {waterGlasses * 250}
            </span>
            <span className="text-xs text-stone-600 ml-1.5">ml / 2.500 ml</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <span className="text-[11px] text-stone-500">{waterGlasses} copos hoje</span>
            <button
              type="button"
              onClick={() => setWaterGlasses((w) => Math.min(14, w + 1))}
              className="text-xs font-bold text-[#3B744C] hover:underline cursor-pointer"
            >
              +1 copo (250ml)
            </button>
          </div>
        </div>
      </div>

      {/* Educational Triage Guide Strip (Section 15) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
          <strong className="text-emerald-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            1. Esperado / Fisiológico
          </strong>
          <p className="text-emerald-800 text-[11px] leading-relaxed">
            Azia leve, cansaço moderado, discreto edema vespertino que melhora com repouso.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
          <strong className="text-amber-900 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-amber-700" />
            2. Monitorar e Informar na Consulta
          </strong>
          <p className="text-amber-800 text-[11px] leading-relaxed">
            Náuseas frequentes, dor lombar persistente ou alterações no padrão de sono.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-1">
          <strong className="text-rose-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-700" />
            3. Avaliar Imediatamente (Sinal de Alerta)
          </strong>
          <p className="text-rose-800 text-[11px] leading-relaxed">
            PA ≥ 140/90 mmHg, cefaleia intensa com escotomas, sangramento, perda de líquido ou redução fetal.
          </p>
        </div>
      </div>

      {/* Log History */}
      <section className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-[#480D1B]">
          Histórico Clínico de Registros ({entries.length})
        </h2>

        <div className="space-y-3">
          {entries.map((entry) => {
            const cls = entry.clinicalClassification || 'normal';
            return (
              <div
                key={entry.id}
                className="p-5 rounded-2xl bg-white border border-[#E6D4AF]/70 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-[#480D1B]">
                      {entry.date} às {entry.time}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-[#8D253D] font-semibold">
                      Humor:{' '}
                      {entry.overallMood === 'radiant'
                        ? '✨ Radiante'
                        : entry.overallMood === 'good'
                        ? '🌸 Bem e Tranquila'
                        : '🌿 Cansada'}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span
                      className={`font-bold ${
                        cls === 'alerta'
                          ? 'text-rose-700'
                          : cls === 'monitorar'
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {cls === 'alerta'
                        ? '⚠️ Requer Avaliação de Enfermagem'
                        : cls === 'monitorar'
                        ? '🔍 Monitorar e Relatar na Consulta'
                        : '✓ Dentro do Esperado'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    {entry.bloodPressure && (
                      <span>
                        PA: <strong className="text-stone-700">{entry.bloodPressure}</strong>
                      </span>
                    )}
                    {entry.weight && (
                      <span>
                        Peso: <strong className="text-stone-700">{entry.weight}</strong>
                      </span>
                    )}
                    <span>
                      Água: <strong className="text-stone-700">{entry.waterGlasses} copos</strong>
                    </span>
                  </div>
                </div>

                {/* Symptoms list */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-stone-500 font-medium">Sintomas:</span>
                  {entry.symptoms.map((sym, idx) => (
                    <span key={idx} className="font-semibold text-[#480D1B]">
                      {sym}
                      {idx < entry.symptoms.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </div>

                {(entry.duration || entry.relievingFactors) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-600 bg-stone-50 p-3 rounded-xl">
                    {entry.duration && (
                      <span>
                        <strong>Duração / Frequência:</strong> {entry.duration}
                      </span>
                    )}
                    {entry.relievingFactors && (
                      <span>
                        <strong>Fatores de Melhora/Piora:</strong> {entry.relievingFactors}
                      </span>
                    )}
                  </div>
                )}

                {entry.notes && (
                  <p className="text-xs text-stone-600 pt-1 italic">"{entry.notes}"</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <EducationalClinicalBanner variant="patient" />

      {/* New Entry Modal */}
      {isLoggingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E6D4AF] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-2xl text-[#480D1B] mb-1">
              Novo Registro no Diário Clínico
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Detalhe intensidade, duração e fatores associados para apoiar a avaliação da equipe Vittacare.
            </p>

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-2">
                  Disposição Geral
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'radiant' as const, label: 'Radiante', emoji: '✨' },
                    { id: 'good' as const, label: 'Tranquila', emoji: '🌸' },
                    { id: 'tired' as const, label: 'Cansada', emoji: '💤' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMood(m.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedMood === m.id
                          ? 'bg-[#FAF0F2] border-[#8D253D] text-[#5D1425] font-bold'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-lg block mb-0.5">{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-2">
                  Sintomas e Sensações Físicas
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableSymptoms.map((sym) => {
                    const isSelected = selectedSymptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => toggleSymptom(sym)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FAF6ED] border-[#B89243] text-[#480D1B] font-semibold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span>{sym}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#B89243]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">
                  Intensidade Percebida
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'leve', label: 'Leve (Esperado)' },
                      { id: 'moderada', label: 'Moderada' },
                      { id: 'intensa', label: 'Intensa (Alerta)' },
                    ] as const
                  ).map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setIntensity(lvl.id)}
                      className={`py-2 px-3 rounded-xl border font-semibold cursor-pointer ${
                        intensity === lvl.id
                          ? 'bg-[#5D1425] text-white border-[#5D1425]'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Duração e Frequência
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ex: 2x ao dia após as refeições"
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    O que melhora ou piora?
                  </label>
                  <input
                    type="text"
                    value={relievingFactors}
                    onChange={(e) => setRelievingFactors(e.target.value)}
                    placeholder="Ex: Melhora ao deitar do lado esquerdo"
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Pressão Arterial (mmHg)
                  </label>
                  <input
                    type="text"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    placeholder="Ex: 110/70"
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Peso Atual (kg)
                  </label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Ex: 62.5"
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Anotações ou Dúvidas para a Equipe
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Sentir o bebê mexer mais pela manhã..."
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsLoggingOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white font-bold tracking-wide shadow-sm cursor-pointer"
                >
                  Salvar no Meu Prontuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
