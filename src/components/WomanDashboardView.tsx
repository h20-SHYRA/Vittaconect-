import React from 'react';
import { 
  Calendar, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  Activity, 
  Clock, 
  ChevronRight, 
  Droplet, 
  AlertCircle, 
  ArrowUpRight,
  Sun,
  UserCheck,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { INITIAL_PREVENTIVE_EXAMS, CLINIC_INFO } from '../data/mockData';
import { NavTab } from '../types';

interface WomanDashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenSOS?: () => void;
}

export const WomanDashboardView: React.FC<WomanDashboardViewProps> = ({ onNavigate, onOpenSOS }) => {
  const { patient, logout } = usePatient();

  const cycleDays = patient?.cycleDurationDays || 28;
  const lastPeriod = patient?.lastPeriodDate ? new Date(patient.lastPeriodDate) : new Date(Date.now() - 14 * 86400000);
  
  // Calculate current cycle day
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastPeriod.getTime());
  const currentCycleDay = Math.min(cycleDays, Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1));

  // Determine current cycle phase
  let phaseName = 'Fase Folicular';
  let phaseDescription = 'Energia e disposição em alta com elevação progressiva do estrogênio.';
  let fertilityStatus = 'Janela Fértil';
  let daysUntilPeriod = Math.max(1, cycleDays - currentCycleDay);

  if (currentCycleDay <= (patient?.periodDurationDays || 5)) {
    phaseName = 'Fase Menstrual';
    phaseDescription = 'Dias de fluxo. Priorize repouso, hidratação e alimentos quentes e reconfortantes.';
    fertilityStatus = 'Baixa probabilidade';
  } else if (currentCycleDay >= 12 && currentCycleDay <= 16) {
    phaseName = 'Janela Fértil & Ovulação';
    phaseDescription = 'Pico de estrogênio e liberação do óvulo. Momento ideal para quem planeja engravidar.';
    fertilityStatus = 'Alta Probabilidade de Gravidez';
  } else if (currentCycleDay > 16) {
    phaseName = 'Fase Lútea';
    phaseDescription = 'Aumento da progesterona. O corpo se prepara para um novo ciclo ou implantação.';
    fertilityStatus = 'Pós-ovulação';
  }

  const urgentExams = INITIAL_PREVENTIVE_EXAMS.filter((e) => e.status === 'atrasado' || e.status === 'proximo_vencer');

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F2] border border-[#EBBEC8] text-[#8D253D] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#B89243]" />
            <span>Saúde Feminina & Prevenção Ginecológica • Clínica Vittacare</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
            Olá, {patient?.preferredName || 'Camila'}!
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Seu portal de autoconhecimento, monitoramento do ciclo menstrual e exames preventivos de rotina.
          </p>
        </div>

        {/* Exit to Registration Screen */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-[#EBBEC8] hover:bg-[#FAF0F2] text-[#8D253D] text-xs font-bold shadow-2xs transition-all cursor-pointer"
            title="Sair para a tela inicial de cadastro e escolher outro modo"
          >
            <span>Sair / Trocar de Modo</span>
          </button>
        </div>
      </div>

      {/* Cycle Highlight Card */}
      <div className="bg-gradient-to-br from-[#5D1425] via-[#741C30] to-[#480D1B] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#DEC68E]/30">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border-8 border-white/5 pointer-events-none" />
        <div className="absolute right-12 bottom-[-40px] w-48 h-48 rounded-full border-4 border-[#DEC68E]/10 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Cycle Dial & Current Day */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-white/15 text-[#E6D4AF] text-xs font-bold font-mono tracking-wider border border-white/20">
                {phaseName.toUpperCase()}
              </span>
              <span className="text-xs text-[#FAF6ED]/80">
                Ciclo de {cycleDays} dias
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-serif font-bold text-white">
                  Dia {currentCycleDay}
                </span>
                <span className="text-sm text-[#E6D4AF]">do ciclo</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 mt-2 max-w-xl leading-relaxed">
                {phaseDescription}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs border border-white/10">
                <span className="text-[10px] text-stone-300 block">Previsão da Menstruação</span>
                <strong className="text-white text-sm">Em {daysUntilPeriod} dias</strong>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs border border-white/10">
                <span className="text-[10px] text-stone-300 block">Janela Fértil</span>
                <strong className="text-[#E6D4AF] text-sm">{fertilityStatus}</strong>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-stone-300 block">Contraceptivo Atual</span>
                <strong className="text-white text-xs truncate block">{patient?.contraceptiveMethod || 'Preservativo'}</strong>
              </div>
            </div>
          </div>

          {/* Action Call to Track */}
          <div className="lg:border-l lg:border-white/15 lg:pl-6 space-y-3">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
              <span className="text-[11px] font-bold text-[#E6D4AF] uppercase tracking-wider block">
                Diário do Ciclo de Hoje
              </span>
              <p className="text-xs text-stone-200">
                Registre fluxo, cólica, humor ou muco cervical para aprimorar suas previsões.
              </p>
              <button
                onClick={() => onNavigate('cycle_tracker')}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#E6D4AF] to-[#DEC68E] text-[#480D1B] font-bold text-xs hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Abrir Rastreador de Ciclo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Calendário e Monitoramento do Ciclo Menstrual */}
        <button
          onClick={() => onNavigate('cycle_tracker')}
          className="p-5 rounded-3xl bg-white border-2 border-[#E6D4AF] hover:border-[#8D253D] hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FAF0F2] to-[#EBBEC8] text-[#8D253D] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[10px] font-bold text-[#8D253D] bg-[#FAF0F2] px-2.5 py-1 rounded-full border border-[#EBBEC8]">
              Previsão Inteligente
            </span>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-serif font-bold text-lg text-[#480D1B] group-hover:text-[#5D1425] transition-colors">
              Rastreador de Ciclo & Ovulação
            </h3>
            <p className="text-xs text-stone-600 line-clamp-2">
              Acompanhe seu fluxo, identifique o período fértil e entenda as oscilações hormonais do seu corpo.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-[#8D253D]">
            <span>Acessar Monitoramento</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 2: Prevenção e Exames Ginecológicos de Rotina */}
        <button
          onClick={() => onNavigate('preventive_screening')}
          className="p-5 rounded-3xl bg-white border-2 border-[#E6D4AF] hover:border-[#B89243] hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FAF6ED] to-[#E6D4AF] text-[#9B7731] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            {urgentExams.length > 0 ? (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {urgentExams.length} exame a agendar
              </span>
            ) : (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Exames em Dia
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="font-serif font-bold text-lg text-[#480D1B] group-hover:text-[#5D1425] transition-colors">
              Carteira de Rastreio Preventivo
            </h3>
            <p className="text-xs text-stone-600 line-clamp-2">
              Papanicolau, Mamografia, Ultrassom, Autoexame das mamas e exames laboratoriais periódicos.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-[#9B7731]">
            <span>Ver Meus Exames</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 3: Biblioteca de Conteúdos e Educação em Saúde */}
        <button
          onClick={() => onNavigate('woman_education')}
          className="p-5 rounded-3xl bg-white border-2 border-[#E6D4AF] hover:border-[#5D1425] hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FAF0F2] via-white to-[#FAF6ED] text-[#480D1B] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[10px] font-bold text-[#8D253D] bg-[#FAF0F2] px-2.5 py-1 rounded-full border border-[#EBBEC8]">
              Trilhas Vittacare
            </span>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-serif font-bold text-lg text-[#480D1B] group-hover:text-[#5D1425] transition-colors">
              Educação em Saúde Feminina
            </h3>
            <p className="text-xs text-stone-600 line-clamp-2">
              Artigos, podcasts rápidos e vídeos sobre saúde íntima, fertilidade, menopausa e nutrição.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-[#480D1B]">
            <span>Explorar Trilhas</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Routine Checkup Preventive Alert Strip */}
      <div className="p-5 rounded-3xl bg-white border border-[#E6D4AF] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Próximos Cuidados Preventivos Recomendados
              </h3>
              <span className="text-xs text-stone-500">
                Acompanhamento periódico da Clínica Vittacare para sua idade ({patient?.age || 32} anos)
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('preventive_screening')}
            className="text-xs font-bold text-[#8D253D] hover:underline cursor-pointer hidden sm:block"
          >
            Ver todos ({INITIAL_PREVENTIVE_EXAMS.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INITIAL_PREVENTIVE_EXAMS.slice(0, 3).map((exam) => (
            <div
              key={exam.id}
              className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 flex flex-col justify-between space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <strong className="text-xs font-serif text-stone-800 line-clamp-1">
                  {exam.name}
                </strong>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    exam.status === 'em_dia'
                      ? 'bg-emerald-100 text-emerald-800'
                      : exam.status === 'proximo_vencer'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {exam.status === 'em_dia' ? 'Em dia' : exam.status === 'proximo_vencer' ? 'Próximo' : 'Atrasado'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-2">
                {exam.description}
              </p>
              <span className="text-[10px] text-stone-400 block pt-1 border-t border-stone-200/40">
                Próximo: {exam.nextDueDate}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
