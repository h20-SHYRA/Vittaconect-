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
  Check,
  Lock,
  LogIn,
  KeyRound,
  Award,
  Video,
  CheckCircle2,
  Mail,
  Flower2,
  Activity,
  Scale
} from 'lucide-react';
import { useAuth, RESTRICTED_PROFESSIONAL_CODE } from '../context/AuthContext';
import { usePatient, calculateDueDateFromWeeks } from '../context/PatientContext';
import { VittacareLogo } from './VittacareLogo';
import { NursingCrest } from './NursingCrest';
import { UserRole, UserMode } from '../types';

export const PatientLoginView: React.FC = () => {
  const { 
    currentUser, 
    signInWithGoogle, 
    registerUserProfile, 
    loading: authLoading 
  } = useAuth();
  const { registerOrUpdatePatient } = usePatient();

  // Tab: 'cadastro' vs 'login_existente'
  const [accessMode, setAccessMode] = useState<'cadastro' | 'login_existente'>('cadastro');

  // Role Selection: 'paciente' vs 'profissional'
  const [selectedRole, setSelectedRole] = useState<UserRole>('paciente');

  // Paciente Sub-mode: 'gestante' vs 'saude_feminina'
  const [selectedPatientMode, setSelectedPatientMode] = useState<UserMode>('gestante');

  // Common Form Fields
  const [patientEmail, setPatientEmail] = useState('');
  const [professionalEmail, setProfessionalEmail] = useState('');
  const [existingEmail, setExistingEmail] = useState('');
  const [name, setName] = useState(currentUser?.displayName || '');
  const [preferredName, setPreferredName] = useState(currentUser?.displayName?.split(' ')[0] || '');
  const [age, setAge] = useState<number>(28);
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [allergies, setAllergies] = useState('');

  // Physical Metrics
  const [initialWeight, setInitialWeight] = useState<number>(62.0);
  const [currentWeight, setCurrentWeight] = useState<number>(58.5);
  const [heightCm, setHeightCm] = useState<number>(165);

  // Professional Mandatory Fields
  const [specialty, setSpecialty] = useState('Enfermagem Obstétrica, Pré-Natal & Neonatologia');
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [councilNumber, setCouncilNumber] = useState('COREN-SP 000.002 (Fictício)');
  const [professionalCode, setProfessionalCode] = useState('');

  // Pregnant Form Fields (Gestante)
  const [babyNickname, setBabyNickname] = useState('');
  const [babyGender, setBabyGender] = useState<'boy' | 'girl' | 'surprise'>('surprise');
  const [currentWeek, setCurrentWeek] = useState<number>(16);
  const [bloodType, setBloodType] = useState('O+');
  const [isFirstPregnancy, setIsFirstPregnancy] = useState(true);

  // Woman (Non-Pregnant) Form Fields (Saúde da Mulher)
  const [lastPeriodDate, setLastPeriodDate] = useState('2026-09-18');
  const [cycleDurationDays, setCycleDurationDays] = useState<number>(28);
  const [periodDurationDays, setPeriodDurationDays] = useState<number>(5);
  const [contraceptiveMethod, setContraceptiveMethod] = useState('Preservativo');
  const [pregnancyGoal, setPregnancyGoal] = useState<'prevent' | 'try_conceive' | 'awareness'>('awareness');
  const [lifeStage, setLifeStage] = useState<'jovem' | 'reprodutiva' | 'perimenopausa' | 'menopausa'>('reprodutiva');

  // UI states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimatedDueDate = calculateDueDateFromWeeks(currentWeek);

  // 1. Submit for Existing Registered User (Requires prior registration)
  const handleExistingUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const emailToUse = existingEmail.trim().toLowerCase();

    if (!emailToUse) {
      setErrorMessage('Por favor, informe seu e-mail cadastrado.');
      return;
    }

    // Professional email format validation
    if (emailToUse.includes('vittaprofessio') && !emailToUse.endsWith('vittaprofessio@gmail.com')) {
      setErrorMessage(
        "O e-mail profissional deve terminar obrigatoriamente com 'vittaprofessio@gmail.com' (ex: seu_nomevittaprofessio@gmail.com)."
      );
      return;
    }

    setIsSubmitting(true);
    const result = await signInWithGoogle(emailToUse);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Não foi possível autenticar com este e-mail. Verifique os dados ou realize seu cadastro.');
      return;
    }

    if (result.isNewUser) {
      // Direct access without registration is forbidden!
      setErrorMessage('Este e-mail ainda não possui cadastro no sistema. Por favor, acesse a aba "Novo Cadastro" para cadastrar seu perfil de Paciente ou Enfermagem.');
      return;
    }
  };

  // 2. Submit for New Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation for Professional
    if (selectedRole === 'profissional') {
      const emailLower = professionalEmail.trim().toLowerCase();
      if (!emailLower) {
        setErrorMessage('Por favor, informe o seu e-mail profissional.');
        return;
      }
      if (!emailLower.endsWith('vittaprofessio@gmail.com')) {
        setErrorMessage(
          "O e-mail profissional deve obrigatoriamente terminar com 'vittaprofessio@gmail.com' (Exemplo: seu_nomevittaprofessio@gmail.com)."
        );
        return;
      }

      if (!name.trim()) {
        setErrorMessage('Por favor, informe o seu nome completo de profissional de enfermagem.');
        return;
      }

      const trimmedCode = professionalCode.trim();
      if (trimmedCode !== RESTRICTED_PROFESSIONAL_CODE) {
        setErrorMessage(
          'Código de autorização profissional incorreto ou não reconhecido. O acesso ao Vittaprofessio é restrito à equipe autorizada da Clínica Vittacare.'
        );
        return;
      }

      const finalSpecialty = specialty === 'Outra Especialidade' ? customSpecialty.trim() : specialty;
      if (!finalSpecialty) {
        setErrorMessage('Por favor, informe a sua especialidade de enfermagem.');
        return;
      }
    }

    // Validation for Patient
    if (selectedRole === 'paciente') {
      const emailLower = patientEmail.trim().toLowerCase();
      if (!emailLower) {
        setErrorMessage('Por favor, informe seu e-mail para o cadastro.');
        return;
      }
      if (!name.trim()) {
        setErrorMessage('Por favor, informe o seu nome completo.');
        return;
      }

      if (selectedPatientMode === 'gestante' && !babyNickname.trim()) {
        setErrorMessage('Por favor, informe o apelido ou nome do bebê.');
        return;
      }
    }

    setIsSubmitting(true);

    const emailToRegister = selectedRole === 'profissional' ? professionalEmail.trim().toLowerCase() : patientEmail.trim().toLowerCase();

    // Authenticate/associate user record
    const gResult = await signInWithGoogle(emailToRegister);
    if (!gResult.success) {
      setIsSubmitting(false);
      setErrorMessage(gResult.error || 'Falha ao autenticar no Firestore.');
      return;
    }

    // Save profile to Firestore
    const finalSpecialty = specialty === 'Outra Especialidade' ? customSpecialty.trim() : specialty;
    const finalCouncil = councilNumber.trim() || 'COREN-SP 000.002 (Fictício)';

    const regResult = await registerUserProfile({
      role: selectedRole,
      specialty: selectedRole === 'profissional' ? finalSpecialty : '',
      professionalCode: selectedRole === 'profissional' ? professionalCode.trim() : '',
      councilNumber: selectedRole === 'profissional' ? finalCouncil : '',
      phone: phone.trim() || '',
      patientData: selectedRole === 'paciente' ? {
        userMode: selectedPatientMode,
        name: name.trim() || 'Mariana Silva Santos',
        preferredName: preferredName.trim() || name.trim().split(' ')[0] || 'Mariana',
        age: Number(age) || 28,
        phone: phone.trim() || '',
        // Gestante Data
        babyNickname: babyNickname.trim() || 'Meu Bebê',
        babyGender,
        currentWeek: Number(currentWeek) || 16,
        dueDate: estimatedDueDate,
        bloodType,
        isFirstPregnancy,
        initialWeight: Number(initialWeight) || 62.0,
        // Saúde da Mulher Data
        lastPeriodDate,
        cycleDurationDays: Number(cycleDurationDays) || 28,
        periodDurationDays: Number(periodDurationDays) || 5,
        contraceptiveMethod: contraceptiveMethod || '',
        pregnancyGoal: pregnancyGoal || 'awareness',
        lifeStage,
        currentWeight: Number(currentWeight) || (Number(initialWeight) || 58.5),
        // Common Clinical Data
        heightCm: Number(heightCm) || 165,
        emergencyContact: emergencyContact.trim() || 'Contato da Família',
        allergies: allergies.trim() || 'Nenhuma alergia conhecida',
        doctorName: selectedPatientMode === 'gestante' ? 'Enf. Marcelo & Enfª. Letícia (Enfermagem Obstétrica)' : 'Enfª. Bianca (Enfermagem em Saúde da Mulher)',
        doctorCrm: 'COREN-SP 000.002 (Fictício)',
      } : undefined,
    });

    setIsSubmitting(false);

    if (!regResult.success) {
      setErrorMessage(regResult.error || 'Erro ao registrar no Firestore.');
    } else {
      if (selectedRole === 'paciente') {
        registerOrUpdatePatient({
          userMode: selectedPatientMode,
          name: name.trim() || 'Mariana Silva Santos',
          preferredName: preferredName.trim() || name.trim().split(' ')[0] || 'Mariana',
          age: Number(age) || 28,
          phone: phone.trim() || '',
          babyNickname: babyNickname.trim() || 'Meu Bebê',
          babyGender,
          currentWeek: Number(currentWeek) || 16,
          dueDate: estimatedDueDate,
          bloodType,
          isFirstPregnancy,
          initialWeight: Number(initialWeight) || 62.0,
          currentWeight: Number(currentWeight) || 58.5,
          heightCm: Number(heightCm) || 165,
          emergencyContact: emergencyContact.trim() || 'Contato da Família',
          allergies: allergies.trim() || 'Nenhuma alergia conhecida',
          doctorName: selectedPatientMode === 'gestante' ? 'Enf. Marcelo & Enfª. Letícia (Enfermagem Obstétrica)' : 'Enfª. Bianca (Enfermagem em Saúde da Mulher)',
          doctorCrm: 'COREN-SP 000.002 (Fictício)',
          lastPeriodDate,
          cycleDurationDays: Number(cycleDurationDays) || 28,
          periodDurationDays: Number(periodDurationDays) || 5,
          contraceptiveMethod: contraceptiveMethod || '',
          pregnancyGoal: pregnancyGoal || 'awareness',
          lifeStage,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-3 sm:p-6 relative overflow-hidden font-sans">
      {/* Warm Luxury Boutique Ambient Lights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FAF0F2]/80 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#FAF6ED]/80 blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full bg-white rounded-3xl border border-[#E6D4AF]/80 shadow-2xl overflow-hidden relative z-10 animate-fadeIn my-6">
        
        {/* Brand Banner Top - Warm Marsala & Gold Boutique Palette */}
        <div className="bg-gradient-to-r from-[#5D1425] via-[#480D1B] to-[#3D0A16] p-6 sm:p-8 text-[#E6D4AF] text-center border-b border-[#B89243]/30 relative shadow-sm">
          <div className="flex justify-center items-center gap-3 mb-2.5">
            <VittacareLogo size="lg" inverted={true} />
            <div className="w-[1px] h-8 bg-[#E6D4AF]/30 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5 p-1 px-2.5 rounded-2xl bg-white/10 border border-[#E6D4AF]/30">
              <span className="text-[10px] font-bold tracking-widest text-[#E6D4AF] uppercase">
                Saúde & Cuidado
              </span>
            </div>
          </div>

          <p className="text-stone-200 text-xs sm:text-sm font-serif italic mt-1">
            "A distância de duas telas, a proximidade de um cuidado que abraça."
          </p>

          <div className="mt-3.5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#E6D4AF]/40 text-xs font-semibold text-[#E6D4AF] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E6D4AF]" />
            <span>Acesso Exclusivo com Cadastro • Pacientes & Enfermagem</span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* MAIN ACCESS MODE TABS: CADASTRO NOVO vs ENTRAR COM CADASTRO */}
          <div className="grid grid-cols-2 gap-2 bg-[#FAF0F2] p-1.5 rounded-2xl border border-[#EBBEC8]">
            <button
              type="button"
              onClick={() => {
                setAccessMode('cadastro');
                setErrorMessage(null);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                accessMode === 'cadastro'
                  ? 'bg-[#5D1425] text-white shadow-xs'
                  : 'text-[#5D1425] hover:bg-white/80'
              }`}
            >
              Novo Cadastro
            </button>

            <button
              type="button"
              onClick={() => {
                setAccessMode('login_existente');
                setErrorMessage(null);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                accessMode === 'login_existente'
                  ? 'bg-[#5D1425] text-white shadow-xs'
                  : 'text-[#5D1425] hover:bg-white/80'
              }`}
            >
              Já Possuo Cadastro (Entrar)
            </button>
          </div>

          {/* ERROR DISPLAY */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: JÁ POSSUO CADASTRO (LOGIN COM E-MAIL CADASTRADO) */}
          {/* ========================================================================= */}
          {accessMode === 'login_existente' && (
            <form onSubmit={handleExistingUserLogin} className="space-y-4 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#FAF0F2]/50 border border-[#EBBEC8] shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-[#8D253D]" />
                  <span className="text-xs font-bold text-[#480D1B] uppercase tracking-wider">
                    Acessar com E-mail Cadastrado
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Digite o e-mail informado no seu cadastro (para profissionais, utilize seu e-mail institucional com terminação <strong>vittaprofessio@gmail.com</strong>):
                </p>

                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    E-mail Cadastrado *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: mariana.silva@gmail.com ou seu_nomevittaprofessio@gmail.com"
                    value={existingEmail}
                    onChange={(e) => setExistingEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] focus:ring-1 focus:ring-[#5D1425] bg-white text-stone-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || authLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#5D1425] to-[#8D253D] hover:from-[#480D1B] hover:to-[#5D1425] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isSubmitting ? 'Buscando cadastro...' : 'Entrar no Sistema'}</span>
                </button>
              </div>

              {/* Security & Access Notice */}
              <div className="p-4 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF] text-center space-y-1.5">
                <span className="text-xs font-bold text-[#480D1B] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Acesso Protegido por Cadastro
                </span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Para garantir a privacidade e segurança clínica dos dados, o acesso é exclusivo para usuários previamente cadastrados. Se este é o seu primeiro acesso, selecione a aba <strong>Novo Cadastro</strong> acima.
                </p>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: NOVO CADASTRO (PACIENTE OU PROFISSIONAL DE ENFERMAGEM) */}
          {/* ========================================================================= */}
          {accessMode === 'cadastro' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Profile Type Selector */}
              <div>
                <label className="text-xs font-bold text-[#480D1B] uppercase tracking-wider block mb-2 text-center">
                  1. Selecione o seu Tipo de Perfil para Cadastro
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option A: Paciente */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('paciente')}
                    className={`p-4 rounded-2xl text-left transition-all cursor-pointer border-2 ${
                      selectedRole === 'paciente'
                        ? 'bg-[#FAF0F2] border-[#8D253D] text-[#5D1425] shadow-md ring-2 ring-[#8D253D]/20'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-[#8D253D]" />
                        <span className="text-xs font-bold text-[#5D1425]">Vittaconect</span>
                      </div>
                      {selectedRole === 'paciente' && (
                        <span className="w-5 h-5 rounded-full bg-[#5D1425] text-white flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#480D1B]">
                        Paciente
                      </h3>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Gestante ou Saúde Feminina: cartão pré-natal, exames e chat com os enfermeiros.
                      </p>
                    </div>
                  </button>

                  {/* Option B: Profissional Vittaprofessio */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('profissional')}
                    className={`p-4 rounded-2xl text-left transition-all cursor-pointer border-2 ${
                      selectedRole === 'profissional'
                        ? 'bg-[#F0F6FA] border-[#0B192C] text-[#0B192C] shadow-md ring-2 ring-[#0B192C]/20'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <NursingCrest size="sm" variant="gold" />
                        <span className="text-xs font-bold text-[#0B192C]">Vittaprofessio</span>
                      </div>
                      {selectedRole === 'profissional' && (
                        <span className="w-5 h-5 rounded-full bg-[#0B192C] text-white flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#0B192C]">
                        Corpo de Enfermagem
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Acesso exclusivo para enfermeiros com Constelação Clínica, prontuário e escalas.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* DYNAMIC REGISTRATION FORM */}
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                
                {/* ---------------------------------------------------- */}
                {/* CASE A: PROFISSIONAL DE ENFERMAGEM (VITTAPROFESSIO) */}
                {/* ---------------------------------------------------- */}
                {selectedRole === 'profissional' && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#F0F6FA] text-[#0B192C] border-2 border-[#0B192C]/30 shadow-sm space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b-2 border-[#0B192C]/15 pb-2">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-[#1E3E62]" />
                        <span className="text-xs font-bold text-[#0B192C] uppercase tracking-wider">
                          Cadastro de Enfermagem (Vittaprofessio)
                        </span>
                      </div>
                      <NursingCrest size="sm" variant="gold" />
                    </div>

                    {/* MANDATORY PROFESSIONAL EMAIL ENDING IN vittaprofessio@gmail.com */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-[#0B192C]">
                          E-mail Profissional Obrigatório *
                        </label>
                        <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                          Terminação: vittaprofessio@gmail.com
                        </span>
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="Ex: enf.seunomevittaprofessio@gmail.com"
                        value={professionalEmail}
                        onChange={(e) => setProfessionalEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#0B192C]/40 text-xs sm:text-sm focus:outline-none focus:border-[#0B192C] bg-white text-slate-800"
                      />
                      <span className="text-[10px] text-slate-500 block mt-1">
                        O e-mail deve obrigatoriamente terminar com <strong>vittaprofessio@gmail.com</strong> para homologação.
                      </span>
                    </div>

                    {/* Nome Completo do Enfermeiro */}
                    <div>
                      <label className="text-xs font-bold text-[#0B192C] block mb-1">
                        Nome Completo do(a) Enfermeiro(a) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Enf. Marcelo da Silva ou Enfª. Letícia Santos"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#0B192C] bg-white text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#0B192C] block mb-1">
                          Especialidade de Atuação *
                        </label>
                        <select
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#0B192C] bg-white text-slate-800"
                        >
                          <option value="Enfermagem Obstétrica, Pré-Natal & Neonatologia">Enfermagem Obstétrica, Pré-Natal & Neonatologia</option>
                          <option value="Enfermagem Obstétrica & Pré-Natal">Enfermagem Obstétrica & Pré-Natal</option>
                          <option value="Enfermagem em Saúde da Mulher & Prevenção">Enfermagem em Saúde da Mulher & Prevenção</option>
                          <option value="Enfermagem Obstétrica, Puerpério & Teleorientação">Enfermagem Obstétrica, Puerpério & Teleorientação</option>
                          <option value="Outra Especialidade">Outra Especialidade...</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-[#0B192C]">
                            Registro COREN
                          </label>
                          <span className="text-[10px] text-slate-500 font-bold">
                            Fictício aceito
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Ex: COREN-SP 000.002"
                            value={councilNumber}
                            onChange={(e) => setCouncilNumber(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#0B192C] bg-white text-slate-800 pr-24"
                          />
                          <button
                            type="button"
                            onClick={() => setCouncilNumber('COREN-SP 000.002 (Fictício)')}
                            className="absolute right-2 top-2 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-[#0B192C] border border-slate-300 transition-colors cursor-pointer"
                          >
                            Fictício
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Restricted Access Code */}
                    <div className="p-4 rounded-xl bg-white border-2 border-[#0B192C] shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <KeyRound className="w-4 h-4 text-[#1E3E62]" />
                          <label className="text-xs font-bold text-[#0B192C] uppercase tracking-wider">
                            Código de Autorização Institucional *
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setProfessionalCode(RESTRICTED_PROFESSIONAL_CODE)}
                          className="text-[10px] text-[#1E3E62] font-bold hover:underline cursor-pointer"
                        >
                          Inserir Chave Autorizada
                        </button>
                      </div>

                      <input
                        type="password"
                        placeholder="Digite o código da equipe (vittaprofessio26/170705)"
                        required
                        value={professionalCode}
                        onChange={(e) => setProfessionalCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs sm:text-sm focus:outline-none focus:border-[#0B192C] bg-[#F8FAFC]"
                      />
                      <span className="text-[10px] text-slate-500 block">
                        Chave privativa da equipe para homologação no banco de dados.
                      </span>
                    </div>
                  </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* CASE B: PACIENTE (VITTACONECT) - PALETA ORIGINAL     */}
                {/* ---------------------------------------------------- */}
                {selectedRole === 'paciente' && (
                  <div className="space-y-4">
                    {/* SUB-MODE SELECTOR: GESTANTE vs SAÚDE DA MULHER */}
                    <div>
                      <label className="text-xs font-bold text-[#480D1B] uppercase tracking-wider block mb-2">
                        2. Escolha a sua modalidade de atendimento:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedPatientMode('gestante')}
                          className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                            selectedPatientMode === 'gestante'
                              ? 'bg-[#FAF0F2] border-[#8D253D] text-[#5D1425] font-bold shadow-xs'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <span className="text-base block mb-0.5">🤰 Estou Gestante</span>
                          <span className="text-[11px] font-normal block text-stone-500">
                            Acompanhamento de pré-natal, contador gestacional e cartão da gestante.
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedPatientMode('saude_feminina')}
                          className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                            selectedPatientMode === 'saude_feminina'
                              ? 'bg-[#FAF6ED] border-[#B89243] text-[#480D1B] font-bold shadow-xs'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <span className="text-base block mb-0.5">🌸 Saúde da Mulher</span>
                          <span className="text-[11px] font-normal block text-stone-500">
                            Rastreio do ciclo menstrual, período fértil, ovulação e exames preventivos.
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* DADOS BÁSICOS PESSOAIS E DE CONTATO */}
                    <div className="p-4 rounded-2xl bg-[#FAF0F2]/50 border border-[#EBBEC8] space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#480D1B] uppercase tracking-wider border-b border-[#EBBEC8]/60 pb-1.5">
                        <User className="w-3.5 h-3.5 text-[#8D253D]" />
                        <span>Dados Pessoais e de Acesso</span>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#480D1B] block mb-1">
                          Seu E-mail para Cadastro *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="Ex: mariana.silva@gmail.com"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] focus:ring-1 focus:ring-[#5D1425] bg-white text-stone-800"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-[#480D1B] block mb-1">
                            Nome Completo *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Mariana Silva Santos"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] focus:ring-1 focus:ring-[#5D1425] bg-white text-stone-800"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-[#480D1B] block mb-1">
                            Como prefere ser chamada?
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Mari ou Mariana"
                            value={preferredName}
                            onChange={(e) => setPreferredName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] focus:ring-1 focus:ring-[#5D1425] bg-white text-stone-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-[#480D1B] block mb-1">
                            Idade (anos) *
                          </label>
                          <input
                            type="number"
                            min={12}
                            max={65}
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] focus:ring-1 focus:ring-[#5D1425] bg-white text-stone-800"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-[#480D1B] block mb-1">
                            Telefone / WhatsApp
                          </label>
                          <input
                            type="tel"
                            placeholder="Ex: (11) 98765-4321"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] focus:ring-1 focus:ring-[#5D1425] bg-white text-stone-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ---------------------------------------------------- */}
                    {/* DADOS COMPLETOS DA GESTANTE                          */}
                    {/* ---------------------------------------------------- */}
                    {selectedPatientMode === 'gestante' && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8] space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#8D253D] uppercase tracking-wider border-b border-[#EBBEC8] pb-1.5">
                          <Baby className="w-4 h-4 text-[#8D253D]" />
                          <span>Dados Clínicos da Gestação & Pré-Natal</span>
                        </div>

                        {/* Semana Gestacional com Slider e DPP */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-bold text-[#480D1B]">
                              Semana Gestacional Atual: <strong className="text-[#8D253D] text-sm">{currentWeek}ª Semana</strong>
                            </label>
                            <span className="text-xs font-bold text-[#8D253D] bg-white px-2.5 py-0.5 rounded-full border border-[#EBBEC8]">
                              DPP: {estimatedDueDate}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={4}
                            max={42}
                            value={currentWeek}
                            onChange={(e) => setCurrentWeek(Number(e.target.value))}
                            className="w-full accent-[#8D253D] cursor-pointer mt-1"
                          />
                          <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                            <span>4ª Sem (Início)</span>
                            <span>20ª Sem (Metade)</span>
                            <span>40ª Sem (Termo)</span>
                          </div>
                        </div>

                        {/* Apelido do Bebê & Sexo do Bebê */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Nome ou Apelido do Bebê *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Ex: Theo, Helena, Pipoca..."
                              value={babyNickname}
                              onChange={(e) => setBabyNickname(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Sexo do Bebê
                            </label>
                            <select
                              value={babyGender}
                              onChange={(e) => setBabyGender(e.target.value as any)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            >
                              <option value="surprise">Surpresa / Ainda não sei 👶</option>
                              <option value="boy">Menino 👦</option>
                              <option value="girl">Menina 👧</option>
                            </select>
                          </div>
                        </div>

                        {/* Tipo Sanguíneo & Primeira Gravidez */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Tipo Sanguíneo & Fator Rh
                            </label>
                            <select
                              value={bloodType}
                              onChange={(e) => setBloodType(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            >
                              <option value="O+">O+ (Positivo)</option>
                              <option value="O-">O- (Negativo)</option>
                              <option value="A+">A+ (Positivo)</option>
                              <option value="A-">A- (Negativo)</option>
                              <option value="B+">B+ (Positivo)</option>
                              <option value="B-">B- (Negativo)</option>
                              <option value="AB+">AB+ (Positivo)</option>
                              <option value="AB-">AB- (Negativo)</option>
                              <option value="Desconhecido">A realizar exame</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              É a sua primeira gestação?
                            </label>
                            <select
                              value={isFirstPregnancy ? 'sim' : 'nao'}
                              onChange={(e) => setIsFirstPregnancy(e.target.value === 'sim')}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            >
                              <option value="sim">Sim, sou mãe de primeira viagem (Primigesta)</option>
                              <option value="nao">Não, já estive grávida antes (Multípara)</option>
                            </select>
                          </div>
                        </div>

                        {/* Peso Inicial & Altura */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Peso Inicial da Gestação (kg)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="Ex: 62.0"
                              value={initialWeight}
                              onChange={(e) => setInitialWeight(Number(e.target.value))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Altura (cm)
                            </label>
                            <input
                              type="number"
                              placeholder="Ex: 165"
                              value={heightCm}
                              onChange={(e) => setHeightCm(Number(e.target.value))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            />
                          </div>
                        </div>

                        {/* Contato de Emergência & Alergias */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Contato de Emergência / Acompanhante
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Lucas (Esposo) - (11) 99123-4567"
                              value={emergencyContact}
                              onChange={(e) => setEmergencyContact(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Alergias a Medicamentos
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Dipirona, Penicilina ou Nenhuma"
                              value={allergies}
                              onChange={(e) => setAllergies(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* DADOS COMPLETOS DE SAÚDE DA MULHER (NÃO GESTANTE)    */}
                    {/* ---------------------------------------------------- */}
                    {selectedPatientMode === 'saude_feminina' && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF] space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#B89243] uppercase tracking-wider border-b border-[#E6D4AF] pb-1.5">
                          <Flower2 className="w-4 h-4 text-[#B89243]" />
                          <span>Dados de Saúde Ginecológica & Ciclo Menstrual</span>
                        </div>

                        {/* Data da Última Menstruação (DUM) */}
                        <div>
                          <label className="text-xs font-bold text-[#480D1B] block mb-1">
                            Data de Início da Última Menstruação (DUM) *
                          </label>
                          <input
                            type="date"
                            required
                            value={lastPeriodDate}
                            onChange={(e) => setLastPeriodDate(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                          />
                          <span className="text-[10px] text-stone-500 block mt-0.5">
                            Utilizada para calcular suas fases do ciclo (folicular, ovulatória, lútea).
                          </span>
                        </div>

                        {/* Duração do Ciclo & Duração da Menstruação */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Duração Média do Ciclo (dias)
                            </label>
                            <input
                              type="number"
                              min={20}
                              max={45}
                              value={cycleDurationDays}
                              onChange={(e) => setCycleDurationDays(Number(e.target.value))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            />
                            <span className="text-[10px] text-stone-500 block mt-0.5">
                              Do 1º dia de uma menstruação ao 1º da próxima (Padrão: 28 dias).
                            </span>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Duração da Menstruação (dias)
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={12}
                              value={periodDurationDays}
                              onChange={(e) => setPeriodDurationDays(Number(e.target.value))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            />
                            <span className="text-[10px] text-stone-500 block mt-0.5">
                              Quantos dias costuma durar o fluxo (Padrão: 3 a 7 dias).
                            </span>
                          </div>
                        </div>

                        {/* Método Anticoncepcional & Objetivo de Gravidez */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Método Anticoncepcional em Uso
                            </label>
                            <select
                              value={contraceptiveMethod}
                              onChange={(e) => setContraceptiveMethod(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            >
                              <option value="Preservativo">Preservativo (Camisinha)</option>
                              <option value="Pílula anticoncepcional combinada">Pílula combinada oral</option>
                              <option value="Pílula de progestagênio (minipílula)">Minipílula (só progesterona)</option>
                              <option value="DIU hormonal (Mirena/Kyleena)">DIU hormonal (Mirena / Kyleena)</option>
                              <option value="DIU de cobre ou prata">DIU de cobre ou prata (não hormonal)</option>
                              <option value="Implante subdérmico (Implanon)">Implante subdérmico (Implanon)</option>
                              <option value="Injeção mensal ou trimestral">Injeção anticoncepcional</option>
                              <option value="Anel vaginal ou adesivo">Anel vaginal / Adesivo</option>
                              <option value="Nenhum / Planejando engravidar">Nenhum / Tentando engravidar</option>
                              <option value="Outro método">Outro método</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Objetivo Atual com o App
                            </label>
                            <select
                              value={pregnancyGoal}
                              onChange={(e) => setPregnancyGoal(e.target.value as any)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            >
                              <option value="awareness">Monitorar ciclo & Autoconhecimento 🌸</option>
                              <option value="prevent">Evitar gravidez / Anticoncepção 🛡️</option>
                              <option value="try_conceive">Planejar / Tentar engravidar 👶</option>
                            </select>
                          </div>
                        </div>

                        {/* Fase da Vida & Peso Atual */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Fase da Vida Feminina
                            </label>
                            <select
                              value={lifeStage}
                              onChange={(e) => setLifeStage(e.target.value as any)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            >
                              <option value="reprodutiva">Idade Reprodutiva Plena (20 - 39 anos)</option>
                              <option value="jovem">Adolescência / Jovem Adulta (14 - 19 anos)</option>
                              <option value="perimenopausa">Climatério / Perimenopausa (40 - 52 anos)</option>
                              <option value="menopausa">Pós-Menopausa / Maturidade (52+ anos)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Peso Atual (kg)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="Ex: 58.5"
                              value={currentWeight}
                              onChange={(e) => setCurrentWeight(Number(e.target.value))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            />
                          </div>
                        </div>

                        {/* Altura, Contato de Emergência & Alergias */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Altura (cm)
                            </label>
                            <input
                              type="number"
                              placeholder="Ex: 168"
                              value={heightCm}
                              onChange={(e) => setHeightCm(Number(e.target.value))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Contato de Emergência
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Renato (Irmão) - (11) 98888-1234"
                              value={emergencyContact}
                              onChange={(e) => setEmergencyContact(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-1">
                              Alergias a Medicamentos
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Nenhuma alergia conhecida"
                              value={allergies}
                              onChange={(e) => setAllergies(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SUBMIT BUTTON WITH BOUTIQUE MARSALA & GOLD GRADIENT */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || authLoading}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#5D1425] to-[#8D253D] hover:from-[#480D1B] hover:to-[#5D1425] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting
                        ? 'Gravando Cadastro no Firestore...'
                        : selectedRole === 'profissional'
                        ? 'Cadastrar & Acessar Vittaprofessio'
                        : 'Concluir Cadastro & Acessar Vittaconect'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
