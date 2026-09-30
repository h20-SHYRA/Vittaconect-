import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Video, 
  Activity, 
  Heart, 
  Sparkles, 
  ChevronRight, 
  Droplet, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  Baby,
  Smile,
  Info,
  Users,
  Bell,
  CreditCard,
  Megaphone,
  Syringe,
  TrendingUp
} from 'lucide-react';
import { CLINIC_INFO, PREGNANCY_WEEKS_DATA, INITIAL_APPOINTMENTS } from '../data/mockData';
import { usePatient } from '../context/PatientContext';
import { NavTab } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onStartTelehealth: (appointmentId: string) => void;
  onOpenShare?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onStartTelehealth, onOpenShare }) => {
  const { patient } = usePatient();
  const motherName = patient?.preferredName || patient?.name?.split(' ')[0] || 'Mãezinha';
  const babyName = patient?.babyNickname || 'Bebê';
  const patientWeek = patient?.currentWeek || 18;

  const [selectedWeek, setSelectedWeek] = useState<number>(patientWeek);
  const [waterCups, setWaterCups] = useState<number>(5);
  const targetWater = 8;

  useEffect(() => {
    if (patient?.currentWeek) {
      setSelectedWeek(patient.currentWeek);
    }
  }, [patient?.currentWeek]);

  // Find exact or closest week in PREGNANCY_WEEKS_DATA
  const availableWeeks = [12, 16, 18, 20, 24, 28, 32, 36];
  const closestWeek = availableWeeks.reduce((prev, curr) => 
    Math.abs(curr - selectedWeek) < Math.abs(prev - selectedWeek) ? curr : prev
  , 18);

  const weekInfo = PREGNANCY_WEEKS_DATA[selectedWeek] || PREGNANCY_WEEKS_DATA[closestWeek] || PREGNANCY_WEEKS_DATA[18];
  const progressPercent = Math.min(100, Math.round((selectedWeek / 40) * 100));

  // SVG circular math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Telehealth appointment that is upcoming / ready
  const telehealthApt = INITIAL_APPOINTMENTS.find((apt) => apt.type === 'telehealth');
  const prenatalApt = INITIAL_APPOINTMENTS.find((apt) => apt.type === 'prenatal');

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Slogan & Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FAF0F2] via-[#FDFBF7] to-[#FAF6ED] border border-[#EBBEC8]/60 p-6 sm:p-8 shadow-sm">
        {/* Subtle Watermark Foliage Decorator in Gold & Burgundy */}
        <div className="absolute -top-12 -right-12 w-48 h-48 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path
              d="M50 0C50 40 10 50 10 90C60 90 90 60 90 10C90 10 60 10 50 0Z"
              fill="#5D1425"
            />
          </svg>
        </div>

        <div className="max-w-2xl">
          {/* Greeting */}
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#3B744C] animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8D253D]">
              Espaço da Gestante Vittacare
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#480D1B] leading-tight mb-3">
            Olá, {motherName}! <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#5D1425]">
              Todo cuidado começa com você.
            </span>
          </h1>

          {/* Slogan in Burgundy Serif font as requested */}
          <div className="mt-4 pt-4 border-t border-[#E6D4AF]/70">
            <p className="font-serif italic text-base sm:text-lg text-[#5D1425] leading-relaxed">
              "{CLINIC_INFO.slogan}"
            </p>
          </div>
        </div>
      </section>

      {/* Card de Destaque (Gestante) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6D4AF]/80 shadow-[0_4px_20px_rgba(184,146,67,0.06)] relative overflow-hidden">
        {/* Header of card with week selector tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FAF0F2]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9B7731] bg-[#FAF6ED] px-2.5 py-0.5 rounded-full border border-[#E6D4AF]">
                {weekInfo.trimester}º Trimestre
              </span>
              <span className="text-xs text-stone-500">
                Previsão de Parto: <strong className="text-stone-700">{patient?.dueDate || 'A definir'}</strong>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B] mt-1">
              {selectedWeek} Semanas de Gestação
            </h2>
          </div>

          {/* Quick Week Switcher to explore baby growth */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#FAF6ED] p-1 rounded-2xl border border-[#E6D4AF]/60 text-xs">
            <span className="text-[11px] font-medium text-stone-500 px-2 hidden lg:inline">Semana:</span>
            {[12, 16, 18, 20, 24, 28, 32, 36].map((wk) => (
              <button
                key={wk}
                onClick={() => setSelectedWeek(wk)}
                className={`px-2.5 py-1 rounded-xl font-medium transition-all cursor-pointer ${
                  selectedWeek === wk
                    ? 'bg-[#5D1425] text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-[#5D1425] hover:bg-white/60'
                }`}
              >
                {wk}ª
              </button>
            ))}
          </div>
        </div>

        {/* Core Highlight: Circular Progress Ring + Baby Development Quote */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center mt-6">
          {/* Progress Ring Column */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#FAF6ED]/60 to-[#FDFBF7] rounded-2xl border border-[#E6D4AF]/50">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background Track */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#FAF0F2"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#goldGradient)"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D8BD83" />
                    <stop offset="50%" stopColor="#B89243" />
                    <stop offset="100%" stopColor="#5D1425" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inside Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl">{weekInfo.fruitEmoji}</span>
                <span className="text-2xl font-serif font-bold text-[#480D1B] leading-none mt-1">
                  {selectedWeek}ª
                </span>
                <span className="text-[11px] text-stone-500 font-medium">de 40 sem</span>
                <span className="text-[10px] font-bold text-[#B89243] mt-0.5">
                  {progressPercent}% da jornada
                </span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs text-stone-500">Bebê {babyName}</span>
              <p className="text-xs font-semibold text-[#5D1425]">
                Frequência: {weekInfo.fetalHeartRateRange}
              </p>
            </div>
          </div>

          {/* Development Phrase & Metric Badges */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-4">
            {/* Developmental Quote (Prompt Requirement) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF0F2]/70 border border-[#EBBEC8] text-[#480D1B]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 text-xl shadow-xs border border-[#EBBEC8]">
                  {weekInfo.fruitEmoji}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#5D1425] leading-snug">
                    Seu bebê tem o tamanho de {weekInfo.babySizeComparison}!
                  </h3>
                  <p className="text-sm text-stone-700 mt-1.5 leading-relaxed">
                    {weekInfo.babyDevelopmentFact}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#E6D4AF]/60">
                <span className="text-[11px] text-stone-500 block">Comprimento Est.</span>
                <span className="text-base font-semibold text-[#480D1B] font-serif">
                  ~{weekInfo.estimatedLength}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#E6D4AF]/60">
                <span className="text-[11px] text-stone-500 block">Peso Estimado</span>
                <span className="text-base font-semibold text-[#480D1B] font-serif">
                  ~{weekInfo.estimatedWeight}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#E6D4AF]/60 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-stone-500 block">Dica Vittacare</span>
                <span className="text-xs font-medium text-stone-700 line-clamp-2">
                  {weekInfo.motherAdvice}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Espaços de Cuidado & Comunidade (Carteira, Fórum & Mural) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#480D1B]">
              Seus Espaços de Cuidado Vittaconect
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Carteira digitalizada, rede de apoio entre gestantes e comunicados da clínica
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Carteira de Pré-natal Digital */}
          <button
            onClick={() => onNavigate('prenatal_card')}
            className="p-5 rounded-3xl bg-gradient-to-br from-[#FAF0F2] via-white to-[#FAF6ED] border-2 border-[#EBBEC8] hover:border-[#8D253D] hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5D1425] to-[#8D253D] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <CreditCard className="w-6 h-6 text-[#E6D4AF]" />
              </div>
              <span className="text-[10px] font-bold text-[#8D253D] bg-white px-2.5 py-1 rounded-full border border-[#EBBEC8]">
                {patient?.bloodType || 'O+'} • Oficial
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-lg text-[#480D1B] group-hover:text-[#5D1425] transition-colors">
                Carteira Pré-Natal Digital
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2">
                Cartão de gestante com tipo sanguíneo, vacinas aplicadas, curva de peso e gráfico de pressão (PA).
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-[#8D253D]">
              <span>Abrir Meu Cartão Digital</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Fórum de Apoio entre Mães */}
          <button
            onClick={() => onNavigate('community')}
            className="p-5 rounded-3xl bg-gradient-to-br from-[#FAF6ED] via-white to-[#F5ECE8] border-2 border-[#DEC68E] hover:border-[#B89243] hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B89243] to-[#9B7731] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-bold text-[#9B7731] bg-white px-2.5 py-1 rounded-full border border-[#E6D4AF]">
                Moderado 24h
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-lg text-[#480D1B] group-hover:text-[#5D1425] transition-colors">
                Fórum de Apoio entre Mães
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2">
                Troca de experiências com mães do mesmo mês de parto, dúvidas sobre sintomas e acolhimento obstétrico.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-[#9B7731]">
              <span>Participar da Comunidade</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Mural de Notícias & Campanhas */}
          <button
            onClick={() => onNavigate('news')}
            className="p-5 rounded-3xl bg-gradient-to-br from-[#FDFBF7] via-white to-[#FAF0F2] border-2 border-[#E6D4AF] hover:border-[#5D1425] hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#480D1B] to-[#741C30] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Megaphone className="w-6 h-6 text-[#E6D4AF]" />
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Campanha Ativa
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-lg text-[#480D1B] group-hover:text-[#5D1425] transition-colors">
                Mural da Clínica Vittacare
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2">
                Campanhas de vacinação (VSR & Gripe), turmas do curso de gestantes e avisos de plantão obstétrico 24h.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-[#480D1B]">
              <span>Ver Comunicados Oficiais</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* Acesso Rápido (Prompt Requirement) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif font-bold text-[#480D1B]">Acesso Rápido</h2>
          <span className="text-xs text-stone-500">Cuidado integral ao seu alcance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Pré-natal e Exames */}
          <button
            onClick={() => onNavigate('calendar')}
            className="group p-5 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#B89243] hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89243]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FAF6ED] to-[#E6D4AF] flex items-center justify-center text-[#9B7731] shadow-xs group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6 stroke-[2]" />
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-[#B89243] transition-colors" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#480D1B] group-hover:text-[#5D1425] transition-colors">
                Pré-natal e Exames
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Consultas presenciais, ultrassons e preparo de exames com estrelas no calendário.
              </p>
            </div>
          </button>

          {/* Card 2: Lembretes & Orientações Médicas */}
          <button
            onClick={() => onNavigate('reminders')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-[#FAF6ED] via-white to-[#F5ECE8] border border-[#DEC68E] hover:border-[#B89243] hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89243] relative overflow-hidden"
          >
            <span className="absolute top-4 right-4 flex items-center gap-1 bg-[#8D253D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Novo
            </span>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FAF0F2] to-[#EBBEC8] flex items-center justify-center text-[#5D1425] shadow-xs group-hover:scale-105 transition-transform">
                <Bell className="w-6 h-6 stroke-[2]" />
              </div>
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#480D1B] group-hover:text-[#5D1425] transition-colors">
                Lembretes Médicos
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Instruções das consultas, remédios, receitas e recomendações da equipe.
              </p>
            </div>
          </button>

          {/* Card 3: Videochamada */}
          <button
            onClick={() => {
              if (telehealthApt) {
                onStartTelehealth(telehealthApt.id);
              } else {
                onNavigate('calendar');
              }
            }}
            className="group p-5 rounded-2xl bg-gradient-to-br from-[#FAF0F2] to-white border border-[#EBBEC8] hover:border-[#8D253D] hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D253D]"
          >
            {/* Live Indicator Badge */}
            <span className="absolute top-4 right-4 flex items-center gap-1 bg-[#3B744C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Disponível
            </span>

            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F5DFE4] to-[#EBBEC8] flex items-center justify-center text-[#5D1425] shadow-xs group-hover:scale-105 transition-transform">
                <Video className="w-6 h-6 stroke-[2]" />
              </div>
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#480D1B] group-hover:text-[#5D1425] transition-colors">
                Videochamada
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Teleorientação direta com Enfermeira Obstetra ou equipe médica Vittacare.
              </p>
            </div>
          </button>

          {/* Card 3: Diário de Sintomas */}
          <button
            onClick={() => onNavigate('symptoms')}
            className="group p-5 rounded-2xl bg-white border border-[#E6D4AF] hover:border-[#B89243] hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89243]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FAF6ED] to-[#E6D4AF] flex items-center justify-center text-[#9B7731] shadow-xs group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 stroke-[2]" />
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-[#B89243] transition-colors" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#480D1B] group-hover:text-[#5D1425] transition-colors">
                Diário de Sintomas
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Registre pressão, hidratação, sono e queixas para levar à sua consulta.
              </p>
            </div>
          </button>
        </div>

        {/* Rede de Apoio / Convite Acompanhante Strip */}
        {onOpenShare && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#FAF0F2] via-white to-[#FAF6ED] border border-[#EBBEC8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#8D253D] flex items-center justify-center border border-[#EBBEC8] shrink-0">
                <Users className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#480D1B]">
                  Acesso Compartilhado com o Acompanhante
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Convide o esposo, parceiro ou familiares para ver consultas, ultrassons e evolução do bebê no celular deles.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenShare}
              className="px-4 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0 whitespace-nowrap"
            >
              Convidar Pessoas
            </button>
          </div>
        )}
      </section>

      {/* Active Telehealth Quick Action & Upcoming Appointment Strip */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Teleconsultation Card */}
        {telehealthApt && (
          <div className="p-5 rounded-2xl bg-[#5D1425] text-white flex flex-col justify-between relative overflow-hidden shadow-md">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6D4AF] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#417C55] animate-ping" />
                  Sua Teleorientação Está Pronta
                </span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white/90">
                  {telehealthApt.time}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold mt-2">
                {telehealthApt.title}
              </h3>
              <p className="text-xs text-[#FAF0F2]/80 mt-1">
                Com {telehealthApt.professional} ({telehealthApt.role})
              </p>
            </div>

            {/* Prominent Gold Button */}
            <button
              onClick={() => onStartTelehealth(telehealthApt.id)}
              className="mt-4 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D8BD83] via-[#B89243] to-[#CAA55C] hover:from-[#E6D4AF] hover:to-[#B89243] text-[#340711] font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <Video className="w-4 h-4 text-[#340711]" />
              <span>Entrar na Videochamada Agora</span>
            </button>
          </div>
        )}

        {/* Next In-Person Appointment Card */}
        {prenatalApt && (
          <div className="p-5 rounded-2xl bg-white border border-[#E6D4AF] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9B7731] bg-[#FAF6ED] px-2 py-0.5 rounded-full">
                  Próxima Consulta Presencial
                </span>
                <span className="text-xs font-semibold text-stone-600">
                  12/10 às 09:30
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#480D1B] mt-2">
                {prenatalApt.title}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                {prenatalApt.professional} · {prenatalApt.location}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500">Preparo: Trazer exames</span>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-xs font-bold text-[#5D1425] hover:text-[#8D253D] flex items-center gap-1 cursor-pointer"
              >
                Ver Agenda Completa
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Daily Hydration & Self-Care Widget */}
      <section className="bg-[#FAF6ED] rounded-2xl p-5 border border-[#E6D4AF]/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#E6D4AF] flex items-center justify-center text-[#7C5D23]">
            <Droplet className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-[#480D1B]">
              Hidratação da Gestante: {waterCups} de {targetWater} copos ({(waterCups * 250) / 1000}L)
            </h4>
            <p className="text-xs text-stone-600 mt-0.5">
              A água é fundamental para o volume de líquido amniótico e prevenção de infecção urinária.
            </p>
          </div>
        </div>

        {/* Interactive Water Glasses */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: targetWater }).map((_, i) => {
            const isFilled = i < waterCups;
            return (
              <button
                key={i}
                onClick={() => setWaterCups(i + 1)}
                className={`w-7 h-9 rounded-md transition-all cursor-pointer flex items-center justify-center text-xs font-medium ${
                  isFilled
                    ? 'bg-[#3B744C] text-white shadow-xs scale-105'
                    : 'bg-white border border-[#E6D4AF] text-stone-400 hover:border-[#3B744C]'
                }`}
                title={`Registrar ${i + 1} copos`}
                aria-label={`Copos de água: ${i + 1}`}
              >
                <Droplet className="w-3.5 h-3.5" fill={isFilled ? 'currentColor' : 'none'} />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
