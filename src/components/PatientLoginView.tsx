import React, { useState } from 'react';
import { 
  Heart, 
  Baby, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  Phone, 
  AlertCircle,
  Stethoscope,
  Smile,
  Compass,
  Layers,
  BookOpen,
  Check
} from 'lucide-react';
import { usePatient, calculateDueDateFromWeeks } from '../context/PatientContext';
import { VittacareLogo } from './VittacareLogo';
import { UserMode } from '../types';

export const PatientLoginView: React.FC = () => {
  const { registerOrUpdatePatient, loadDemoPatient, loadDemoWoman } = usePatient();

  // Mode Selection: 'gestante' vs 'saude_feminina'
  const [selectedMode, setSelectedMode] = useState<UserMode>('gestante');

  // Common Form Fields
  const [name, setName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [age, setAge] = useState<number>(28);
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [allergies, setAllergies] = useState('');

  // Pregnant Form Fields
  const [babyNickname, setBabyNickname] = useState('');
  const [babyGender, setBabyGender] = useState<'boy' | 'girl' | 'surprise'>('surprise');
  const [currentWeek, setCurrentWeek] = useState<number>(16);
  const [bloodType, setBloodType] = useState('O+');
  const [isFirstPregnancy, setIsFirstPregnancy] = useState(true);

  // Woman (Non-Pregnant) Form Fields
  const [lastPeriodDate, setLastPeriodDate] = useState('2026-09-18');
  const [cycleDurationDays, setCycleDurationDays] = useState<number>(28);
  const [periodDurationDays, setPeriodDurationDays] = useState<number>(5);
  const [contraceptiveMethod, setContraceptiveMethod] = useState('Preservativo');
  const [pregnancyGoal, setPregnancyGoal] = useState<'prevent' | 'try_conceive' | 'awareness'>('awareness');

  const estimatedDueDate = calculateDueDateFromWeeks(currentWeek);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (selectedMode === 'gestante') {
      registerOrUpdatePatient({
        userMode: 'gestante',
        name: name.trim(),
        preferredName: preferredName.trim() || name.trim().split(' ')[0],
        age: Number(age) || 28,
        phone: phone.trim() || undefined,
        babyNickname: babyNickname.trim() || 'Meu Bebê',
        babyGender,
        currentWeek,
        dueDate: estimatedDueDate,
        bloodType,
        isFirstPregnancy,
        emergencyContact: emergencyContact.trim() || 'Acompanhante da Família',
        allergies: allergies.trim() || 'Nenhuma alergia conhecida',
        doctorName: 'Dr. Roberto Silva (Obstetra)',
        doctorCrm: 'CRM-SP 142.890',
      });
    } else {
      registerOrUpdatePatient({
        userMode: 'saude_feminina',
        name: name.trim(),
        preferredName: preferredName.trim() || name.trim().split(' ')[0],
        age: Number(age) || 28,
        phone: phone.trim() || undefined,
        lastPeriodDate,
        cycleDurationDays: Number(cycleDurationDays) || 28,
        periodDurationDays: Number(periodDurationDays) || 5,
        contraceptiveMethod,
        pregnancyGoal,
        emergencyContact: emergencyContact.trim() || 'Contato de Confiança',
        allergies: allergies.trim() || 'Nenhuma alergia conhecida',
        doctorName: 'Dra. Beatriz Lins (Ginecologista)',
        doctorCrm: 'CRM-SP 156.412',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6ED] via-[#FDFBF7] to-[#FAF0F2] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#E6D4AF]/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#EBBEC8]/30 blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full bg-white rounded-3xl border border-[#E6D4AF] shadow-2xl overflow-hidden relative z-10 animate-fadeIn my-6">
        {/* Brand Banner Top */}
        <div className="bg-gradient-to-r from-[#5D1425] via-[#741C30] to-[#480D1B] p-6 sm:p-8 text-white text-center relative">
          <div className="flex justify-center mb-3">
            <VittacareLogo size="lg" inverted />
          </div>
          <p className="text-[#E6D4AF] text-xs sm:text-sm font-serif italic mt-1">
            "A distância de duas telas, a proximidade de um cuidado que abraça."
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] text-[#FAF6ED] border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-[#E6D4AF]" />
            <span>Aplicativo Integrado de Saúde da Mulher & Materna • Clínica Vittacare</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#480D1B] transition-all">
              {selectedMode === 'gestante' ? 'Boas-vindas, Mãezinha!' : 'Que bom ter você aqui, Querida!'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
              {selectedMode === 'gestante'
                ? 'Seja muito bem-vinda ao seu espaço de cuidado materno da Clínica Vittacare. Cadastre seus dados e do seu bebê para personalizar toda a sua jornada pré-natal:'
                : 'Este é o seu cantinho de autocuidado, saúde e conexão com o seu corpo. Cadastre seus dados para acompanhar cada fase do seu ciclo e receber o carinho da equipe Vittacare:'}
            </p>
          </div>

          {/* DUAL MODE SELECTOR BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {/* Mode 1: Gestante */}
            <button
              type="button"
              onClick={() => setSelectedMode('gestante')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                selectedMode === 'gestante'
                  ? 'bg-gradient-to-br from-[#FAF0F2] via-white to-[#FAF6ED] border-[#8D253D] shadow-md ring-1 ring-[#8D253D]'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🤰</span>
                {selectedMode === 'gestante' && (
                  <span className="w-5 h-5 rounded-full bg-[#8D253D] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                )}
              </div>
              <div>
                <strong className="text-sm font-serif text-[#480D1B] block">
                  Estou Gestante / Pré-Natal
                </strong>
                <span className="text-[11px] text-stone-500 block mt-1 leading-snug">
                  Abas de carteira de gestante, curva de peso, feto, vacinas maternas e fórum de mães.
                </span>
              </div>
            </button>

            {/* Mode 2: Saúde da Mulher (Sem gravidez) */}
            <button
              type="button"
              onClick={() => setSelectedMode('saude_feminina')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                selectedMode === 'saude_feminina'
                  ? 'bg-gradient-to-br from-[#FAF6ED] via-white to-[#FAF0F2] border-[#B89243] shadow-md ring-1 ring-[#B89243]'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🌸</span>
                {selectedMode === 'saude_feminina' && (
                  <span className="w-5 h-5 rounded-full bg-[#B89243] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                )}
              </div>
              <div>
                <strong className="text-sm font-serif text-[#480D1B] block">
                  Saúde Feminina & Prevenção
                </strong>
                <span className="text-[11px] text-stone-500 block mt-1 leading-snug">
                  Sem envolver gestação. Abas de ciclo menstrual, ovulação, Papanicolau, mamografia e exames.
                </span>
              </div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Common: Name and Preferred Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Camila Alencar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Como prefere ser chamada?
                </label>
                <input
                  type="text"
                  placeholder="Ex: Camila"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425]"
                />
              </div>
            </div>

            {/* Common: Age and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Idade (anos) *
                </label>
                <input
                  type="number"
                  min={14}
                  max={70}
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  WhatsApp / Celular
                </label>
                <input
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425]"
                />
              </div>
            </div>

            {/* CONDITIONAL SECTION 1: IF GESTANTE */}
            {selectedMode === 'gestante' && (
              <div className="p-4 rounded-2xl bg-[#FAF0F2]/50 border border-[#EBBEC8] space-y-4 animate-fadeIn">
                <span className="text-[10px] font-bold text-[#8D253D] uppercase tracking-wider block">
                  Dados da Gestação
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#480D1B] block mb-1">
                      Apelido do Bebê (ou nome escolhido)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Theo, Clara, Pipoca..."
                      value={babyNickname}
                      onChange={(e) => setBabyNickname(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#480D1B] block mb-1">
                      Tipo Sanguíneo & Fator Rh
                    </label>
                    <select
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] bg-white"
                    >
                      <option value="O+">O Positivo (O+)</option>
                      <option value="O-">O Negativo (O-)</option>
                      <option value="A+">A Positivo (A+)</option>
                      <option value="A-">A Negativo (A-)</option>
                      <option value="B+">B Positivo (B+)</option>
                      <option value="B-">B Negativo (B-)</option>
                      <option value="AB+">AB Positivo (AB+)</option>
                      <option value="AB-">AB Negativo (AB-)</option>
                    </select>
                  </div>
                </div>

                {/* Baby Gender Selection */}
                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    Já sabe o sexo do bebê?
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setBabyGender('boy')}
                      className={`py-2 px-2 rounded-xl border font-semibold text-center transition-all cursor-pointer ${
                        babyGender === 'boy'
                          ? 'bg-sky-50 border-sky-400 text-sky-800 shadow-2xs'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50 bg-white'
                      }`}
                    >
                      👦 Menino
                    </button>
                    <button
                      type="button"
                      onClick={() => setBabyGender('girl')}
                      className={`py-2 px-2 rounded-xl border font-semibold text-center transition-all cursor-pointer ${
                        babyGender === 'girl'
                          ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-2xs'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50 bg-white'
                      }`}
                    >
                      👧 Menina
                    </button>
                    <button
                      type="button"
                      onClick={() => setBabyGender('surprise')}
                      className={`py-2 px-2 rounded-xl border font-semibold text-center transition-all cursor-pointer ${
                        babyGender === 'surprise'
                          ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-2xs'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50 bg-white'
                      }`}
                    >
                      💛 Surpresa
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#480D1B]">
                      Idade Gestacional Atual:
                    </label>
                    <span className="text-xs font-bold text-[#8D253D] bg-white px-2 py-0.5 rounded-md border border-[#EBBEC8]">
                      {currentWeek}ª Semana
                    </span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={41}
                    value={currentWeek}
                    onChange={(e) => setCurrentWeek(Number(e.target.value))}
                    className="w-full accent-[#5D1425] cursor-pointer mt-1"
                  />
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    Previsão estimada de parto: <strong>{estimatedDueDate}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* CONDITIONAL SECTION 2: IF SAÚDE DA MULHER (SEM GESTAÇÃO) */}
            {selectedMode === 'saude_feminina' && (
              <div className="p-4 rounded-2xl bg-[#FAF6ED]/70 border border-[#E6D4AF] space-y-4 animate-fadeIn">
                <span className="text-[10px] font-bold text-[#9B7731] uppercase tracking-wider block">
                  Parâmetros do Ciclo Menstrual & Prevenção
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#480D1B] block mb-1">
                      Data da Última Menstruação
                    </label>
                    <input
                      type="date"
                      value={lastPeriodDate}
                      onChange={(e) => setLastPeriodDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425] bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#480D1B] block mb-1">
                      Duração Média do Ciclo
                    </label>
                    <input
                      type="number"
                      min={20}
                      max={45}
                      value={cycleDurationDays}
                      onChange={(e) => setCycleDurationDays(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425] bg-white"
                    />
                    <span className="text-[10px] text-stone-500">Média: 28 dias</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#480D1B] block mb-1">
                      Dias de Menstruação
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={10}
                      value={periodDurationDays}
                      onChange={(e) => setPeriodDurationDays(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425] bg-white"
                    />
                    <span className="text-[10px] text-stone-500">Média: 5 dias</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#480D1B] block mb-1">
                      Método Contraceptivo Atual
                    </label>
                    <select
                      value={contraceptiveMethod}
                      onChange={(e) => setContraceptiveMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425] bg-white"
                    >
                      <option value="Preservativo">Preservativo</option>
                      <option value="Pílula anticoncepcional">Pílula Anticoncepcional Oral</option>
                      <option value="DIU Hormonal (Mirena/Kyleena)">DIU Hormonal (Mirena/Kyleena)</option>
                      <option value="DIU de Cobre / Prata">DIU de Cobre / Prata (Não hormonal)</option>
                      <option value="Implante Subdérmico">Implante Subdérmico (Implanon)</option>
                      <option value="Injeção trimestral / mensal">Injeção Contraceptiva</option>
                      <option value="Nenhum / Tentando engravidar">Nenhum / Tentando Engravidar</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#480D1B] block mb-1">
                      Objetivo Principal no App
                    </label>
                    <select
                      value={pregnancyGoal}
                      onChange={(e) => setPregnancyGoal(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425] bg-white"
                    >
                      <option value="awareness">Autoconhecimento & Prevenção Geral</option>
                      <option value="try_conceive">Planejando Engravidar (Identificar Ovulação)</option>
                      <option value="prevent">Controle de Ciclo & Evitar Gravidez</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1">
                Contato de Apoio ou Emergência
              </label>
              <input
                type="text"
                placeholder="Ex: Carlos (Esposo/Familiar) - (11) 98765-4321"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#5D1425] via-[#741C30] to-[#480D1B] hover:brightness-110 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>
                {selectedMode === 'gestante' ? 'Concluir Cadastro no Modo Gestante' : 'Concluir Cadastro no Modo Saúde da Mulher'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Preload Buttons */}
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <span className="text-xs font-bold text-stone-500 block text-center">
              Ou acesse instantaneamente com dados prontos de exemplo:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={loadDemoWoman}
                className="py-2.5 px-3 rounded-xl bg-[#FAF6ED] border border-[#DEC68E] text-[#9B7731] hover:bg-[#FAF0F2] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>🌸 Entrar como Camila (Saúde Feminina)</span>
              </button>

              <button
                type="button"
                onClick={loadDemoPatient}
                className="py-2.5 px-3 rounded-xl bg-[#FAF0F2] border border-[#EBBEC8] text-[#8D253D] hover:bg-[#FAF6ED] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>🤰 Entrar como Mariana (Gestante)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
