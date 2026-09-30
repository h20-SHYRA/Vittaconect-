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
  HeartHandshake,
  Check
} from 'lucide-react';
import { usePatient, calculateDueDateFromWeeks } from '../context/PatientContext';
import { VittacareLogo } from './VittacareLogo';

export const PatientLoginView: React.FC = () => {
  const { registerOrUpdatePatient, loadDemoPatient } = usePatient();

  const [activeTab, setActiveTab] = useState<'register' | 'quick_login'>('register');

  // Form Fields
  const [name, setName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [babyNickname, setBabyNickname] = useState('');
  const [babyGender, setBabyGender] = useState<'boy' | 'girl' | 'surprise'>('surprise');
  const [currentWeek, setCurrentWeek] = useState<number>(16);
  const [age, setAge] = useState<number>(28);
  const [phone, setPhone] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [isFirstPregnancy, setIsFirstPregnancy] = useState(true);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [allergies, setAllergies] = useState('');

  // Quick login field
  const [quickName, setQuickName] = useState('');

  const estimatedDueDate = calculateDueDateFromWeeks(currentWeek);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !babyNickname.trim()) return;

    registerOrUpdatePatient({
      name: name.trim(),
      preferredName: preferredName.trim() || name.trim().split(' ')[0],
      babyNickname: babyNickname.trim(),
      babyGender,
      currentWeek,
      dueDate: estimatedDueDate,
      age: Number(age) || 28,
      phone: phone.trim() || undefined,
      bloodType,
      isFirstPregnancy,
      emergencyContact: emergencyContact.trim() || 'Acompanhante da Família',
      allergies: allergies.trim() || 'Nenhuma alergia relatada',
      doctorName: 'Dr. Roberto Silva (Obstetra)',
      doctorCrm: 'CRM-SP 142.890',
    });
  };

  const handleQuickLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;

    registerOrUpdatePatient({
      name: quickName.trim(),
      preferredName: quickName.trim().split(' ')[0],
      babyNickname: babyNickname.trim() || 'Meu Bebê',
      currentWeek: 16,
      dueDate: calculateDueDateFromWeeks(16),
      age: 28,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6ED] via-[#FDFBF7] to-[#FAF0F2] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Rings & Watermark */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#E6D4AF]/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#EBBEC8]/30 blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full bg-white rounded-3xl border border-[#E6D4AF] shadow-2xl overflow-hidden relative z-10 animate-fadeIn">
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
            <span>Portal Exclusivo da Gestante • Clínica Vittacare</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Title */}
          <div className="text-center space-y-1">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#480D1B]">
              Boas-vindas, Mãezinha!
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
              Cadastre seus dados e do seu bebê para personalizar toda a sua jornada pré-natal, exames, ultrassons e teleorientações.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Mother Full Name */}
            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1">
                Seu Nome Completo *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ex: Fernanda Lima Santos"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!preferredName) {
                      setPreferredName(e.target.value.split(' ')[0]);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] focus:ring-1 focus:ring-[#5D1425] bg-stone-50/50"
                />
                <User className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
              </div>
            </div>

            {/* Preferred Name & Baby Nickname */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Como gosta de ser chamada?
                </label>
                <input
                  type="text"
                  placeholder="Ex: Fer ou Nanda"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] bg-stone-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Nome ou Apelido do Bebê *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maya, Gael ou Meu Amor"
                    value={babyNickname}
                    onChange={(e) => setBabyNickname(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] bg-stone-50/50"
                  />
                  <Baby className="w-4 h-4 text-[#8D253D] absolute right-3.5 top-3" />
                </div>
              </div>
            </div>

            {/* Gestational Weeks & Baby Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#480D1B]">
                    Semana Gestacional Atual *
                  </label>
                  <span className="text-xs font-bold text-[#8D253D] bg-[#FAF0F2] px-2 py-0.5 rounded-full border border-[#EBBEC8]">
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

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Já sabe o sexo do bebê?
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setBabyGender('boy')}
                    className={`py-2 px-1 rounded-xl border font-semibold text-center transition-all cursor-pointer ${
                      babyGender === 'boy'
                        ? 'bg-sky-50 border-sky-400 text-sky-800 shadow-2xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    👦 Menino
                  </button>
                  <button
                    type="button"
                    onClick={() => setBabyGender('girl')}
                    className={`py-2 px-1 rounded-xl border font-semibold text-center transition-all cursor-pointer ${
                      babyGender === 'girl'
                        ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-2xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    👧 Menina
                  </button>
                  <button
                    type="button"
                    onClick={() => setBabyGender('surprise')}
                    className={`py-2 px-1 rounded-xl border font-semibold text-center transition-all cursor-pointer ${
                      babyGender === 'surprise'
                        ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-2xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    💛 Surpresa
                  </button>
                </div>
              </div>
            </div>

            {/* Mother Age & Blood Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Sua Idade
                </label>
                <input
                  type="number"
                  min={14}
                  max={60}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425] bg-stone-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Tipo Sanguíneo
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425] bg-stone-50/50"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="Desconhecido">Vou realizar o exame</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  1ª Gestação?
                </label>
                <select
                  value={isFirstPregnancy ? 'sim' : 'nao'}
                  onChange={(e) => setIsFirstPregnancy(e.target.value === 'sim')}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425] bg-stone-50/50"
                >
                  <option value="sim">Sim (Primeira viagem)</option>
                  <option value="nao">Não (Já tenho filhos)</option>
                </select>
              </div>
            </div>

            {/* Emergency Contact / Support Partner */}
            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1">
                Acompanhante / Contato de Emergência
              </label>
              <input
                type="text"
                placeholder="Ex: Carlos (Esposo) - (11) 98765-4321"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] bg-stone-50/50"
              />
            </div>

            {/* Known Allergies */}
            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1">
                Alergias a Medicamentos (se houver)
              </label>
              <input
                type="text"
                placeholder="Ex: Nenhuma alergia ou Dipirona"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] bg-stone-50/50"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#5D1425] via-[#741C30] to-[#480D1B] hover:brightness-110 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Concluir Meu Cadastro & Entrar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Button for Testing */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span className="text-xs text-stone-500">
              Quer apenas testar ou ver o aplicativo pronto?
            </span>
            <button
              type="button"
              onClick={loadDemoPatient}
              className="text-xs font-bold text-[#8D253D] hover:text-[#5D1425] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Preencher com dados de exemplo</span>
              <Sparkles className="w-3.5 h-3.5 text-[#B89243]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
