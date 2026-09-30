import React, { useState } from 'react';
import { 
  Activity, 
  Smile, 
  Droplet, 
  Heart, 
  Plus, 
  Check, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Share2, 
  FileText,
  Baby
} from 'lucide-react';
import { INITIAL_SYMPTOMS } from '../data/mockData';
import { SymptomEntry } from '../types';

export const SymptomsView: React.FC = () => {
  const [entries, setEntries] = useState<SymptomEntry[]>(INITIAL_SYMPTOMS);
  const [isLoggingOpen, setIsLoggingOpen] = useState(false);

  // New entry form state
  const [selectedMood, setSelectedMood] = useState<'radiant' | 'good' | 'tired' | 'uncomfortable' | 'anxious'>('good');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [waterGlasses, setWaterGlasses] = useState(6);
  const [bloodPressure, setBloodPressure] = useState('110/70');
  const [weight, setWeight] = useState('62.5');
  const [notes, setNotes] = useState('');
  const [kickCount, setKickCount] = useState(10);

  const availableSymptoms = [
    'Leve enjoo',
    'Azia / refluxo',
    'Dor lombar',
    'Inchaço nas pernas/pés',
    'Cansaço / sonolência',
    'Movimentação fetal ativa',
    'Sensibilidade nos seios',
    'Sono agitado',
  ];

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: SymptomEntry = {
      id: `sym-${Date.now()}`,
      date: 'Hoje',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      overallMood: selectedMood,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['Nenhum sintoma atípico'],
      waterGlasses,
      bloodPressure: bloodPressure ? `${bloodPressure} mmHg` : undefined,
      weight: weight ? `${weight} kg` : undefined,
      notes: notes.trim() || undefined,
    };

    setEntries([newEntry, ...entries]);
    setIsLoggingOpen(false);
    setSelectedSymptoms([]);
    setNotes('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8D253D] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#B89243]" />
            Acompanhamento Clínico Preventivo
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
            Diário de Sintomas & Bem-Estar
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-xl">
            Monitore suas sensações diárias para compartilhar com Dr. Roberto Silva e a equipe de enfermagem obstétrica.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              alert('Relatório clínico exportado! Você pode apresentá-lo em sua próxima consulta na Clínica Vittacare.');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-[#E6D4AF] hover:bg-[#FAF6ED] text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#B89243]" />
            <span>Exportar Relatório</span>
          </button>

          <button
            onClick={() => setIsLoggingOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E6D4AF]" />
            <span>Novo Registro</span>
          </button>
        </div>
      </div>

      {/* Quick Interactive Summary Cards: Fetal Kicks & Blood Pressure */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Contador de Chutes Fetais */}
        <div className="p-5 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8D253D] uppercase tracking-wider">
              Chutes Fetais Hoje
            </span>
            <Baby className="w-5 h-5 text-[#8D253D]" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-serif font-bold text-[#480D1B]">
              {kickCount}
            </span>
            <span className="text-xs text-stone-600 ml-1.5">movimentos sentidos</span>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-[#EBBEC8]/60">
            <button
              onClick={() => setKickCount((k) => k + 1)}
              className="flex-1 py-1.5 rounded-xl bg-white text-[#5D1425] font-bold text-xs border border-[#EBBEC8] hover:bg-[#FAF0F2] cursor-pointer"
            >
              +1 Chute Sentido
            </button>
          </div>
        </div>

        {/* Card 2: Última Pressão Arterial */}
        <div className="p-5 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9B7731] uppercase tracking-wider">
              Pressão Arterial
            </span>
            <Activity className="w-5 h-5 text-[#9B7731]" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-serif font-bold text-[#480D1B]">
              110/70
            </span>
            <span className="text-xs text-stone-600 ml-1.5">mmHg (Ideal)</span>
          </div>
          <p className="text-[11px] text-[#3B744C] font-semibold pt-2 border-t border-[#E6D4AF]/60 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            Parâmetro seguro para pré-eclâmpsia
          </p>
        </div>

        {/* Card 3: Hidratação e Líquido Amniótico */}
        <div className="p-5 rounded-2xl bg-white border border-[#E6D4AF] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Meta Hídrica Diária
            </span>
            <Droplet className="w-5 h-5 text-[#3B744C]" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-serif font-bold text-[#480D1B]">
              1.750
            </span>
            <span className="text-xs text-stone-600 ml-1.5">ml / 2.000 ml</span>
          </div>
          <p className="text-[11px] text-stone-500 pt-2 border-t border-stone-100">
            Falta apenas 1 copo para atingir a meta
          </p>
        </div>
      </div>

      {/* Log History */}
      <section className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-[#480D1B]">
          Histórico de Registros
        </h2>

        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-5 rounded-2xl bg-white border border-[#E6D4AF]/70 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#480D1B]">
                    {entry.date} às {entry.time}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-xs text-[#8D253D] font-semibold">
                    Humor: {entry.overallMood === 'radiant' ? '✨ Radiante' : entry.overallMood === 'good' ? '🌸 Bem e Tranquila' : '🌿 Cansada'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-stone-500">
                  {entry.bloodPressure && <span>PA: <strong className="text-stone-700">{entry.bloodPressure}</strong></span>}
                  {entry.weight && <span>Peso: <strong className="text-stone-700">{entry.weight}</strong></span>}
                  <span>Água: <strong className="text-stone-700">{entry.waterGlasses} copos</strong></span>
                </div>
              </div>

              {/* Symptoms tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {entry.symptoms.map((sym, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-[#FAF6ED] text-[#7C5D23] text-xs font-medium border border-[#E6D4AF]/60"
                  >
                    {sym}
                  </span>
                ))}
              </div>

              {/* Note */}
              {entry.notes && (
                <p className="text-xs text-stone-600 mt-3 pt-2 border-t border-stone-50 italic">
                  "{entry.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* New Entry Modal */}
      {isLoggingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E6D4AF] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-2xl text-[#480D1B] mb-1">
              Como você está hoje, Mariana?
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Registre seus sinais para um pré-natal individualizado e seguro.
            </p>

            <form onSubmit={handleSaveEntry} className="space-y-5 text-xs">
              {/* Mood */}
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

              {/* Symptoms Checklist */}
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

              {/* Metrics (PA & Peso) */}
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
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF6ED]/30 focus:outline-none focus:ring-2 focus:ring-[#B89243]"
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
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF6ED]/30 focus:outline-none focus:ring-2 focus:ring-[#B89243]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Anotações ou Dúvidas para a Próxima Consulta
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Sentir o bebê mexer mais pela manhã, dúvidas sobre cólicas..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF6ED]/30 focus:outline-none focus:ring-2 focus:ring-[#B89243]"
                />
              </div>

              {/* Actions */}
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
