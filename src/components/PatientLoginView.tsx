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
  Scale,
  Accessibility,
  Volume2,
  Eye,
  Ear,
  HandHeart,
  Type
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePatient, calculateDueDateFromWeeks } from '../context/PatientContext';
import { useCustomization } from '../context/CustomizationContext';
import { VittacareLogo } from './VittacareLogo';
import { NursingCrest } from './NursingCrest';
import { UserRole, UserMode } from '../types';
import { verifyProfessionalCredential, isDemoAllowedInEnvironment } from '../services/security/authGateway';

export const PatientLoginView: React.FC = () => {
  const { 
    currentUser, 
    signInWithGoogle, 
    registerUserProfile,
    loginAsDemo,
    appEnvironment,
    loading: authLoading 
  } = useAuth();
  const { registerOrUpdatePatient } = usePatient();
  const { settings, updateSetting, increaseFontSize, decreaseFontSize } = useCustomization();

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

  // Accessibility & Assisted Access (PCD / Acesso com Ajuda) States
  const [hasDisability, setHasDisability] = useState<boolean>(false);
  const [disabilityTypes, setDisabilityTypes] = useState<string[]>([]);
  const [needsAssistedAccess, setNeedsAssistedAccess] = useState<boolean>(false);
  const [helperName, setHelperName] = useState<string>('');
  const [helperRelationship, setHelperRelationship] = useState<string>('Familiar / Acompanhante');
  const [needsLibrasInterpreter, setNeedsLibrasInterpreter] = useState<boolean>(false);
  const [accessibilityNotes, setAccessibilityNotes] = useState<string>('');
  const [isSpeakingGuide, setIsSpeakingGuide] = useState<boolean>(false);

  // UI states & Guided Onboarding Consents (Vittaconect 2.0)
  const [consentDataLgpd, setConsentDataLgpd] = useState<boolean>(true);
  const [consentMedicalDisclaimer, setConsentMedicalDisclaimer] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimatedDueDate = calculateDueDateFromWeeks(currentWeek);

  const toggleDisabilityType = (typeId: string) => {
    setHasDisability(true);
    setDisabilityTypes((prev) => {
      const exists = prev.includes(typeId);
      const next = exists ? prev.filter((item) => item !== typeId) : [...prev, typeId];
      // Automatically adapt interface for visual or motor disability
      if (next.includes('Visual / Baixa Visão')) {
        updateSetting('fontSize', 'lg');
        updateSetting('boldText', true);
      }
      if (next.includes('Auditiva / Surdez')) {
        setNeedsLibrasInterpreter(true);
      }
      if (next.includes('Motora / Mobilidade Reduzida') || next.includes('Cognitiva / Intelectual')) {
        updateSetting('lineHeight', 'relaxed');
        setNeedsAssistedAccess(true);
      }
      return next;
    });
  };

  const speakAccessibilityGuide = (customText?: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeakingGuide && !customText) {
      setIsSpeakingGuide(false);
      return;
    }
    const textToRead =
      customText ||
      'Bem-vinda à Clínica Vittacare. Você está na tela de cadastro e acesso assistido. Se você possui alguma deficiência ou está acessando com a ajuda de um familiar ou acompanhante, ative a opção de Acessibilidade logo abaixo para ampliar as letras, ativar o alto contraste, solicitar intérprete de Libras e cadastrar seu acompanhante de apoio.';
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeakingGuide(false);
    setIsSpeakingGuide(true);
    window.speechSynthesis.speak(utterance);
  };

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
      const verification = await verifyProfessionalCredential(trimmedCode, councilNumber);
      if (!verification.authorized) {
        setErrorMessage(
          verification.message ||
            'Credencial institucional inválida ou não reconhecida. O acesso ao Vittaprofessio é restrito à equipe autorizada da Clínica Vittacare.'
        );
        return;
      }

      const finalSpecialty = specialty === 'Outra Especialidade' ? customSpecialty.trim() : specialty;
      if (!finalSpecialty) {
        setErrorMessage('Por favor, informe a sua especialidade de enfermagem.');
        return;
      }
    }

    if (!consentDataLgpd || !consentMedicalDisclaimer) {
      setErrorMessage(
        'Para concluir o cadastro no Vittaconect 2.0, confirme o consentimento de proteção de dados (LGPD) e o termo de orientação educativa/clínica.'
      );
      return;
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
        emergencyContact: emergencyContact.trim() || helperName.trim() || 'Contato da Família',
        allergies: allergies.trim() || 'Nenhuma alergia conhecida',
        doctorName: selectedPatientMode === 'gestante' ? 'Enf. Marcelo & Enfª. Letícia (Enfermagem Obstétrica)' : 'Enfª. Bianca (Enfermagem em Saúde da Mulher)',
        doctorCrm: 'COREN-SP 000.002 (Fictício)',
        // Accessibility & Assisted Access (PCD) Data
        hasDisability: Boolean(hasDisability || disabilityTypes.length > 0 || needsAssistedAccess),
        disabilityTypes: disabilityTypes.length > 0 ? disabilityTypes : [],
        needsAssistedAccess: Boolean(needsAssistedAccess),
        helperName: helperName.trim() || '',
        helperRelationship: helperRelationship || 'Familiar / Acompanhante',
        needsLibrasInterpreter: Boolean(needsLibrasInterpreter),
        accessibilityNotes: accessibilityNotes.trim() || '',
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
          emergencyContact: emergencyContact.trim() || helperName.trim() || 'Contato da Família',
          allergies: allergies.trim() || 'Nenhuma alergia conhecida',
          doctorName: selectedPatientMode === 'gestante' ? 'Enf. Marcelo & Enfª. Letícia (Enfermagem Obstétrica)' : 'Enfª. Bianca (Enfermagem em Saúde da Mulher)',
          doctorCrm: 'COREN-SP 000.002 (Fictício)',
          lastPeriodDate,
          cycleDurationDays: Number(cycleDurationDays) || 28,
          periodDurationDays: Number(periodDurationDays) || 5,
          contraceptiveMethod: contraceptiveMethod || '',
          pregnancyGoal: pregnancyGoal || 'awareness',
          lifeStage,
          hasDisability: Boolean(hasDisability || disabilityTypes.length > 0 || needsAssistedAccess),
          disabilityTypes: disabilityTypes.length > 0 ? disabilityTypes : [],
          needsAssistedAccess: Boolean(needsAssistedAccess),
          helperName: helperName.trim() || '',
          helperRelationship: helperRelationship || 'Familiar / Acompanhante',
          needsLibrasInterpreter: Boolean(needsLibrasInterpreter),
          accessibilityNotes: accessibilityNotes.trim() || '',
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

        {/* ========================================================================= */}
        {/* BARRA DE ACESSIBILIDADE E ACESSO ASSISTIDO COM AJUDA (PCD)                */}
        {/* ========================================================================= */}
        <div className="bg-[#FAF6ED] border-b border-[#E6D4AF] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#5D1425] text-[#E6D4AF] flex items-center justify-center shrink-0">
              <Accessibility className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#480D1B] block leading-tight">
                Central de Acessibilidade & Acesso com Ajuda (PCD)
              </span>
              <span className="text-[11px] text-stone-600 block">
                Recursos assistivos para pessoas com deficiência ou acompanhantes
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Voice Guide Reader */}
            <button
              type="button"
              onClick={() => speakAccessibilityGuide()}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                isSpeakingGuide
                  ? 'bg-[#5D1425] text-white border-[#5D1425]'
                  : 'bg-white text-[#480D1B] border-[#E6D4AF] hover:bg-[#FAF0F2]'
              }`}
              title="Ouvir instruções faladas da tela de cadastro"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isSpeakingGuide ? 'Ouvindo Guia...' : 'Ouvir Ajuda'}</span>
            </button>

            {/* Font Size Controls */}
            <button
              type="button"
              onClick={decreaseFontSize}
              className="px-2 py-1.5 rounded-xl bg-white border border-[#E6D4AF] text-[11px] font-bold text-[#480D1B] hover:bg-[#FAF0F2] cursor-pointer"
              title="Diminuir tamanho da letra"
            >
              A-
            </button>
            <button
              type="button"
              onClick={increaseFontSize}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E6D4AF] text-[11px] font-bold text-[#480D1B] hover:bg-[#FAF0F2] cursor-pointer flex items-center gap-0.5"
              title="Aumentar tamanho da letra (Baixa Visão)"
            >
              <Type className="w-3 h-3" />
              <span>A+</span>
            </button>

            {/* High Contrast Toggle */}
            <button
              type="button"
              onClick={() => updateSetting('highContrast', !settings.highContrast)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                settings.highContrast
                  ? 'bg-[#480D1B] text-white border-[#480D1B]'
                  : 'bg-white text-[#480D1B] border-[#E6D4AF] hover:bg-[#FAF0F2]'
              }`}
              title="Alternar Alto Contraste Visual"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Contraste</span>
            </button>

            {/* Quick Activate Assisted Access */}
            <button
              type="button"
              onClick={() => {
                const next = !hasDisability;
                setHasDisability(next);
                setNeedsAssistedAccess(next);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                hasDisability
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-[#5D1425] border-[#8D253D]/40 hover:bg-[#FAF0F2]'
              }`}
            >
              <HandHeart className="w-3.5 h-3.5" />
              <span>{hasDisability ? 'Modo PCD Ativo' : 'Acesso c/ Ajuda'}</span>
            </button>
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
                        ? 'vitta-pearl-blue-subbar border-[#144272] text-[#0A2647] shadow-md ring-2 ring-[#2563EB]/30'
                        : 'bg-white border-stone-200 hover:border-[#144272]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <NursingCrest size="sm" variant="silver" />
                        <span className="text-xs font-bold text-[#0A2647]">Vittaprofessio</span>
                      </div>
                      {selectedRole === 'profissional' && (
                        <span className="w-5 h-5 rounded-full vitta-metallic-blue-badge text-white flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#0A2647]">
                        Corpo de Enfermagem
                      </h3>
                      <p className="text-xs text-[#144272] font-medium mt-0.5">
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
                  <div className="p-5 sm:p-6 rounded-2xl vitta-pearl-blue-subbar text-[#0A2647] border-2 border-[#144272] shadow-md space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b-2 border-[#144272]/30 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-xl vitta-metallic-blue-badge text-white">
                          <Stethoscope className="w-4 h-4 text-[#93C5FD]" />
                        </div>
                        <span className="text-xs font-extrabold text-[#0A2647] uppercase tracking-wider">
                          Cadastro de Enfermagem • Vittaprofessio Premium
                        </span>
                      </div>
                      <NursingCrest size="sm" variant="silver" />
                    </div>

                    {/* MANDATORY PROFESSIONAL EMAIL ENDING IN vittaprofessio@gmail.com */}
                    <div className="p-3.5 rounded-2xl vitta-pearl-white-card">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-[#0A2647]">
                          E-mail Profissional Obrigatório *
                        </label>
                        <span className="text-[10px] text-white vitta-metallic-blue-badge px-2.5 py-0.5 rounded-lg font-bold">
                          Terminação: vittaprofessio@gmail.com
                        </span>
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="Ex: enf.seunomevittaprofessio@gmail.com"
                        value={professionalEmail}
                        onChange={(e) => setProfessionalEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#144272] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 bg-white text-[#0A2647] font-medium"
                      />
                      <span className="text-[10px] text-[#144272] font-medium block mt-1">
                        O e-mail deve obrigatoriamente terminar com <strong>vittaprofessio@gmail.com</strong> para homologação.
                      </span>
                    </div>

                    {/* Nome Completo do Enfermeiro */}
                    <div className="p-3.5 rounded-2xl vitta-pearl-white-card">
                      <label className="text-xs font-bold text-[#0A2647] block mb-1">
                        Nome Completo do(a) Enfermeiro(a) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Enf. Marcelo da Silva ou Enfª. Letícia Santos"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#144272] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 bg-white text-[#0A2647] font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-2xl vitta-pearl-white-card">
                        <label className="text-xs font-bold text-[#0A2647] block mb-1">
                          Especialidade de Atuação *
                        </label>
                        <select
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#144272] text-xs sm:text-sm focus:outline-none bg-white text-[#0A2647] font-medium"
                        >
                          <option value="Enfermagem Obstétrica, Pré-Natal & Neonatologia">Enfermagem Obstétrica, Pré-Natal & Neonatologia</option>
                          <option value="Enfermagem Obstétrica & Pré-Natal">Enfermagem Obstétrica & Pré-Natal</option>
                          <option value="Enfermagem em Saúde da Mulher & Prevenção">Enfermagem em Saúde da Mulher & Prevenção</option>
                          <option value="Enfermagem Obstétrica, Puerpério & Teleorientação">Enfermagem Obstétrica, Puerpério & Teleorientação</option>
                          <option value="Outra Especialidade">Outra Especialidade...</option>
                        </select>
                      </div>

                      <div className="p-3.5 rounded-2xl vitta-pearl-white-card">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-[#0A2647]">
                            Registro COREN
                          </label>
                          <span className="text-[10px] text-[#144272] font-bold">
                            Fictício aceito
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Ex: COREN-SP 000.002"
                            value={councilNumber}
                            onChange={(e) => setCouncilNumber(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#144272] text-xs sm:text-sm focus:outline-none bg-white text-[#0A2647] font-medium pr-24"
                          />
                          <button
                            type="button"
                            onClick={() => setCouncilNumber('COREN-SP 000.002 (Fictício)')}
                            className="absolute right-2 top-2 px-2 py-1 rounded-lg vitta-metallic-blue-badge text-[10px] font-bold text-white transition-colors cursor-pointer"
                          >
                            Fictício
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Institutional Access Credential (Validated via AuthGateway) */}
                    <div className="p-4 rounded-2xl vitta-pearl-white-card space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <KeyRound className="w-4 h-4 text-[#144272]" />
                          <label className="text-xs font-bold text-[#0A2647] uppercase tracking-wider">
                            Credencial Institucional / Convite COREN *
                          </label>
                        </div>
                        {isDemoAllowedInEnvironment() && (
                          <button
                            type="button"
                            onClick={() => setProfessionalCode('COREN-HOMOLOGADO-2026')}
                            className="text-[10px] text-white vitta-metallic-blue-badge px-2.5 py-1 rounded-lg font-bold cursor-pointer"
                          >
                            Preencher Token de Homologação
                          </button>
                        )}
                      </div>

                      <input
                        type="password"
                        placeholder="Informe o token institucional fornecido pela coordenação"
                        required
                        value={professionalCode}
                        onChange={(e) => setProfessionalCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#144272] font-mono text-xs sm:text-sm focus:outline-none bg-white text-[#0A2647]"
                      />
                      <span className="text-[10px] text-[#144272] font-medium block">
                        Validação criptográfica de segurança (Ambiente: {appEnvironment.toUpperCase()}). Nenhum código sensível é exposto publicamente.
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

                    {/* =================================================================== */}
                    {/* OPÇÃO DE ACESSIBILIDADE & ACESSO COM AJUDA (PCD / INCLUSÃO)         */}
                    {/* =================================================================== */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6ED] border-2 border-[#B89243]/60 space-y-4 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#5D1425] text-[#E6D4AF] flex items-center justify-center shrink-0 mt-0.5">
                            <Accessibility className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-[#480D1B]">
                              Opção de Acessibilidade & Acesso com Ajuda (PCD)
                            </h4>
                            <p className="text-[11px] text-stone-600 leading-relaxed">
                              Possui algum tipo de deficiência ou precisa acessar o aplicativo com a ajuda de um familiar, cuidador ou intérprete?
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const nextState = !hasDisability;
                            setHasDisability(nextState);
                            if (nextState) {
                              setNeedsAssistedAccess(true);
                              speakAccessibilityGuide(
                                'Opção de acessibilidade e acesso com ajuda ativada. Selecione o tipo de deficiência e informe os dados da pessoa que está ajudando você a acessar o aplicativo.'
                              );
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                            hasDisability
                              ? 'bg-[#5D1425] text-white border-[#5D1425] shadow-xs'
                              : 'bg-white text-[#480D1B] border-[#B89243] hover:bg-[#FAF0F2]'
                          }`}
                        >
                          <Accessibility className="w-4 h-4" />
                          <span>
                            {hasDisability ? '✓ Acessibilidade Ativada' : 'Ativar Acessibilidade / Ajuda'}
                          </span>
                        </button>
                      </div>

                      {hasDisability && (
                        <div className="pt-3 border-t border-[#E6D4AF] space-y-4 animate-fadeIn">
                          {/* 1. Seleção do Tipo de Deficiência / Necessidade */}
                          <div>
                            <label className="text-xs font-bold text-[#480D1B] block mb-2">
                              1. Qual tipo de acessibilidade ou suporte você necessita? (Pode marcar mais de uma)
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {[
                                {
                                  id: 'Visual / Baixa Visão',
                                  label: '👁️ Deficiência Visual / Baixa Visão',
                                  desc: 'Amplia letras automaticamente e ativa leitura por voz',
                                },
                                {
                                  id: 'Auditiva / Surdez',
                                  label: '🤟 Deficiência Auditiva / Surdez',
                                  desc: 'Ativa suporte com Intérprete de Libras e alertas visuais',
                                },
                                {
                                  id: 'Motora / Mobilidade Reduzida',
                                  label: '♿ Deficiência Física / Motora',
                                  desc: 'Botões espaçados e atendimento prioritário adaptado',
                                },
                                {
                                  id: 'Cognitiva / Intelectual',
                                  label: '🤝 Cognitiva / Intelectual / Neurodivergente',
                                  desc: 'Navegação assistida com apoio de acompanhante',
                                },
                              ].map((item) => {
                                const selected = disabilityTypes.includes(item.id);
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => toggleDisabilityType(item.id)}
                                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                      selected
                                        ? 'bg-[#FAF0F2] border-[#8D253D] text-[#5D1425] ring-1 ring-[#8D253D]'
                                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold">{item.label}</span>
                                      {selected && (
                                        <span className="text-xs font-bold text-[#8D253D]">✓</span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-stone-500 block mt-0.5">
                                      {item.desc}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* 2. Acesso Assistido com Acompanhante / Cuidador */}
                          <div className="p-3.5 rounded-xl bg-white border border-[#E6D4AF] space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <HandHeart className="w-4 h-4 text-[#8D253D]" />
                                <span className="text-xs font-bold text-[#480D1B]">
                                  2. Acesso com Ajuda (Acompanhante / Familiar / Cuidador)
                                </span>
                              </div>
                              <label className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5D1425] cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={needsAssistedAccess}
                                  onChange={(e) => setNeedsAssistedAccess(e.target.checked)}
                                  className="rounded accent-[#5D1425]"
                                />
                                <span>Acesso com ajuda</span>
                              </label>
                            </div>

                            {needsAssistedAccess && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div>
                                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                                    Nome de quem ajuda no acesso (Acompanhante)
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Ex: Maria Silva (Mãe) ou Carlos (Esposo)"
                                    value={helperName}
                                    onChange={(e) => setHelperName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-[#FDFBF7]"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                                    Vínculo / Parentesco do Acompanhante
                                  </label>
                                  <select
                                    value={helperRelationship}
                                    onChange={(e) => setHelperRelationship(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-[#FDFBF7]"
                                  >
                                    <option value="Familiar / Acompanhante">Familiar / Acompanhante</option>
                                    <option value="Esposo(a) / Parceiro(a)">Esposo(a) / Parceiro(a)</option>
                                    <option value="Mãe / Pai">Mãe / Pai</option>
                                    <option value="Cuidador(a) Profissional">Cuidador(a) Profissional</option>
                                    <option value="Intérprete de Libras">Intérprete de Libras</option>
                                  </select>
                                </div>
                              </div>
                            )}

                            {/* Solicitação de Intérprete de Libras & Observações */}
                            <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <label className="inline-flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={needsLibrasInterpreter}
                                  onChange={(e) => setNeedsLibrasInterpreter(e.target.checked)}
                                  className="rounded accent-[#5D1425]"
                                />
                                <Ear className="w-3.5 h-3.5 text-[#8D253D]" />
                                <span className="font-semibold">
                                  Solicitar Intérprete de Libras nas teleconsultas e chat
                                </span>
                              </label>
                            </div>

                            <div>
                              <label className="text-xs font-bold text-[#480D1B] block mb-1">
                                Observações de Acessibilidade para a Equipe de Enfermagem
                              </label>
                              <input
                                type="text"
                                placeholder="Ex: Preciso de orientações por áudio no chat ou auxílio do acompanhante nas consultas..."
                                value={accessibilityNotes}
                                onChange={(e) => setAccessibilityNotes(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-[#FDFBF7]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* GUIDED ONBOARDING: LGPD DATA CONSENT & CLINICAL DISCLAIMER */}
                <div className="p-4 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF] space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#480D1B]">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Termo de Privacidade (LGPD) & Responsabilidade Clínica</span>
                  </div>
                  <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer leading-relaxed">
                    <input
                      type="checkbox"
                      checked={consentDataLgpd}
                      onChange={(e) => setConsentDataLgpd(e.target.checked)}
                      className="mt-0.5 rounded accent-[#5D1425]"
                    />
                    <span>
                      Autorizo o tratamento seguro e criptografado dos meus dados de saúde exclusivamente para acompanhamento pela equipe da Clínica Vittacare (LGPD).
                    </span>
                  </label>
                  <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer leading-relaxed">
                    <input
                      type="checkbox"
                      checked={consentMedicalDisclaimer}
                      onChange={(e) => setConsentMedicalDisclaimer(e.target.checked)}
                      className="mt-0.5 rounded accent-[#5D1425]"
                    />
                    <span>
                      Estou ciente de que os conteúdos educativos e alertas do Vittaconect têm caráter informativo de apoio e <strong>não substituem avaliação médica ou de enfermagem presencial</strong>.
                    </span>
                  </label>
                </div>

                {/* SUBMIT BUTTON: METALLIC SAPPHIRE BLUE FOR PROFISSIONAL OR BOUTIQUE MARSALA FOR PACIENTE */}
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || authLoading}
                    className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                      selectedRole === 'profissional'
                        ? 'vitta-metallic-blue-badge text-white hover:brightness-110'
                        : 'bg-gradient-to-r from-[#5D1425] to-[#8D253D] hover:from-[#480D1B] hover:to-[#5D1425] text-white'
                    }`}
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

                  {/* EXPLICITLY IDENTIFIED DEMO MODE ACCESS (Only when allowed in environment) */}
                  {isDemoAllowedInEnvironment() && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                          Modo Demonstração — Dados Fictícios
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-900">
                          Ambiente {appEnvironment.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Explore rapidamente as jornadas completas do Vittaconect 2.0 com dados clínicos simulados:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => loginAsDemo('paciente', 'gestante')}
                          className="py-2 px-3 rounded-xl bg-white hover:bg-[#FAF0F2] text-[#5D1425] border border-[#EBBEC8] text-xs font-bold transition-all cursor-pointer"
                        >
                          🤰 Demo Gestante
                        </button>
                        <button
                          type="button"
                          onClick={() => loginAsDemo('paciente', 'saude_feminina')}
                          className="py-2 px-3 rounded-xl bg-white hover:bg-[#FAF6ED] text-[#480D1B] border border-[#E6D4AF] text-xs font-bold transition-all cursor-pointer"
                        >
                          🌸 Demo Saúde Mulher
                        </button>
                        <button
                          type="button"
                          onClick={() => loginAsDemo('profissional', 'gestante', 'Enf. Marcelo')}
                          className="py-2 px-3 rounded-xl vitta-metallic-blue-badge text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          🩺 Demo Vittaprofessio
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
