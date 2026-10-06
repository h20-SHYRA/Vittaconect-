import React, { useState } from 'react';
import {
  Home,
  Calendar,
  Activity,
  BookOpen,
  User,
  Bell,
  Users,
  Newspaper,
  ClipboardList,
  Flower2,
  ShieldCheck,
  Grid,
  X,
  LogOut,
  FileText,
  MessageSquare,
  Video,
} from 'lucide-react';
import { NavTab } from '../types';
import { usePatient } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab?: (tab: NavTab) => void;
  onChangeTab?: (tab: NavTab) => void;
}

interface DesktopSidebarNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenNurseChat?: () => void;
  onOpenTelehealth?: () => void;
}

export const DesktopSidebarNav: React.FC<DesktopSidebarNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenNurseChat,
  onOpenTelehealth,
}) => {
  const { patient, logout: patientLogout } = usePatient();
  const { logout: authLogout } = useAuth();
  const isWomanMode = patient?.userMode === 'saude_feminina';

  const handleFullLogout = async () => {
    patientLogout();
    await authLogout();
  };

  const primaryItems: {
    id: NavTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    matches: NavTab[];
  }[] = [
    {
      id: isWomanMode ? 'woman_home' : 'home',
      label: 'Início',
      icon: Home,
      matches: ['home', 'woman_home', 'dashboard'],
    },
    {
      id: isWomanMode ? 'cycle_tracker' : 'prenatal_card',
      label: isWomanMode ? 'Ciclo & Saúde Feminina' : 'Cartão Pré-Natal',
      icon: isWomanMode ? Flower2 : ClipboardList,
      matches: ['prenatal_card', 'cycle_tracker', 'CycleTracker'],
    },
    {
      id: 'calendar',
      label: 'Agenda & Consultas',
      icon: Calendar,
      matches: ['calendar'],
    },
    {
      id: 'documents',
      label: 'Documentos & Exames',
      icon: FileText,
      matches: ['documents'],
    },
    {
      id: isWomanMode ? 'woman_education' : 'education',
      label: 'Educação em Saúde',
      icon: BookOpen,
      matches: ['education', 'woman_education'],
    },
  ];

  const secondaryItems: {
    id: NavTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    matches: NavTab[];
  }[] = [
    ...(isWomanMode
      ? [
          {
            id: 'preventive_screening' as NavTab,
            label: 'Rastreio Preventivo',
            icon: ShieldCheck,
            matches: ['preventive_screening', 'PreventiveScreening'] as NavTab[],
          },
        ]
      : []),
    {
      id: 'symptoms',
      label: 'Diário de Sintomas',
      icon: Activity,
      matches: ['symptoms'],
    },
    {
      id: 'reminders',
      label: 'Lembretes & Rotina',
      icon: Bell,
      matches: ['reminders'],
    },
    {
      id: 'community',
      label: 'Comunidade Moderada',
      icon: Users,
      matches: ['community'],
    },
    {
      id: 'news',
      label: 'Mural Vittacare',
      icon: Newspaper,
      matches: ['news'],
    },
    {
      id: 'profile',
      label: 'Meu Perfil & LGPD',
      icon: User,
      matches: ['profile'],
    },
  ];

  return (
    <aside
      aria-label="Navegação Lateral da Paciente"
      className="hidden lg:flex flex-col w-64 shrink-0 bg-white/90 border-r border-[#E6D4AF]/80 min-h-[calc(100vh-4rem)] p-4 justify-between sticky top-16 self-start z-20"
    >
      <div className="space-y-6">
        {/* Group 1: Principais por importância */}
        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#8D253D] block mb-2">
            Principais
          </span>
          <nav className="space-y-1">
            {primaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.matches.includes(activeTab);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#5D1425] text-white shadow-xs'
                      : 'text-stone-700 hover:bg-[#FAF0F2] hover:text-[#5D1425]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#E6D4AF]' : 'text-[#8D253D]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Group 2: Acompanhamento & Apoio */}
        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">
            Acompanhamento
          </span>
          <nav className="space-y-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.matches.includes(activeTab);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#FAF0F2] text-[#5D1425] font-bold border border-[#EBBEC8]'
                      : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#8D253D]' : 'text-stone-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Quick Clinical Channels & Logout */}
      <div className="pt-4 mt-6 border-t border-stone-200/80 space-y-2">
        {onOpenNurseChat && (
          <button
            type="button"
            onClick={onOpenNurseChat}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#FAF0F2] hover:bg-[#F5DADF] text-[#5D1425] border border-[#EBBEC8] text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#8D253D]" />
              <span>Chat Enfermagem</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        )}

        {onOpenTelehealth && (
          <button
            type="button"
            onClick={onOpenTelehealth}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF6ED] hover:bg-[#F3EBD8] text-[#480D1B] border border-[#E6D4AF] text-xs font-bold transition-colors cursor-pointer"
          >
            <Video className="w-4 h-4 text-[#9B7731]" />
            <span>Sala de Teleatendimento</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleFullLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-stone-500 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair da Conta</span>
        </button>
      </div>
    </aside>
  );
};

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onChangeTab,
}) => {
  const { patient, logout: patientLogout } = usePatient();
  const { logout: authLogout } = useAuth();
  const isWomanMode = patient?.userMode === 'saude_feminina';
  const [showSecondaryDrawer, setShowSecondaryDrawer] = useState(false);

  const handleFullLogout = async () => {
    setShowSecondaryDrawer(false);
    patientLogout();
    await authLogout();
  };

  const handleNavigate = (tab: NavTab) => {
    if (onSelectTab) onSelectTab(tab);
    if (onChangeTab) onChangeTab(tab);
  };

  // Mobile Bottom Bar: 5 core functions + Menu (Section 7)
  const primaryTabs: {
    id: NavTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    matches: NavTab[];
  }[] = [
    {
      id: isWomanMode ? 'woman_home' : 'home',
      label: 'Início',
      icon: Home,
      matches: ['home', 'woman_home', 'dashboard'],
    },
    {
      id: isWomanMode ? 'cycle_tracker' : 'prenatal_card',
      label: isWomanMode ? 'Ciclo' : 'Pré-Natal',
      icon: isWomanMode ? Flower2 : ClipboardList,
      matches: ['prenatal_card', 'cycle_tracker', 'CycleTracker'],
    },
    {
      id: 'calendar',
      label: 'Agenda',
      icon: Calendar,
      matches: ['calendar'],
    },
    {
      id: 'documents',
      label: 'Documentos',
      icon: FileText,
      matches: ['documents'],
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      matches: ['profile'],
    },
  ];

  const secondaryModules: {
    id: NavTab;
    label: string;
    desc: string;
    icon: React.FC<{ className?: string }>;
  }[] = isWomanMode
    ? [
        {
          id: 'cycle_tracker',
          label: 'Ciclo & Ovulação',
          desc: 'Calendário menstrual e janela fértil',
          icon: Flower2,
        },
        {
          id: 'preventive_screening',
          label: 'Exames & Prevenção',
          desc: 'Papanicolaou, mamografia e sorologias',
          icon: ShieldCheck,
        },
        {
          id: 'documents',
          label: 'Documentos & Receitas',
          desc: 'Pedidos de exames, receitas, atestados e laudos',
          icon: FileText,
        },
        {
          id: 'symptoms',
          label: 'Diário de Sintomas',
          desc: 'Registro de sinais, cólicas e bem-estar',
          icon: Activity,
        },
        {
          id: 'reminders',
          label: 'Rotina & Lembretes',
          desc: 'Anticoncepcional, água e vitaminas',
          icon: Bell,
        },
        {
          id: 'woman_education',
          label: 'Educação em Saúde',
          desc: 'Biblioteca educativa baseada em evidências',
          icon: BookOpen,
        },
        {
          id: 'news',
          label: 'Mural Vittacare',
          desc: 'Comunicados, workshops e novidades',
          icon: Newspaper,
        },
      ]
    : [
        {
          id: 'prenatal_card',
          label: 'Cartão Pré-Natal',
          desc: 'Exames, vacinas, ultrassons e plano de parto',
          icon: ClipboardList,
        },
        {
          id: 'documents',
          label: 'Documentos & Receitas',
          desc: 'Exames, receitas, atestados e resultados',
          icon: FileText,
        },
        {
          id: 'symptoms',
          label: 'Diário & Sinais',
          desc: 'Sintomas, pressão arterial e movimentos fetais',
          icon: Activity,
        },
        {
          id: 'reminders',
          label: 'Rotina & Lembretes',
          desc: 'Suplementos, hidratação e exercícios pélvicos',
          icon: Bell,
        },
        {
          id: 'education',
          label: 'Educação em Saúde',
          desc: 'Desenvolvimento fetal, amamentação e cuidados',
          icon: BookOpen,
        },
        {
          id: 'community',
          label: 'Comunidade Moderada',
          desc: 'Roda de gestantes e especialistas Vittacare',
          icon: Users,
        },
        {
          id: 'news',
          label: 'Mural Vittacare',
          desc: 'Cursos de gestantes, comunicados e eventos',
          icon: Newspaper,
        },
      ];

  return (
    <>
      {/* Secondary Modules Drawer (Mobile/Tablet) */}
      {showSecondaryDrawer && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Menu Completo de Módulos Vittaconect"
        >
          <div className="bg-[#FDFBF7] w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-[#E6D4AF] shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#5D1425] to-[#480D1B] px-5 py-4 text-[#E6D4AF] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  Mais Áreas do Vittaconect
                </h3>
                <p className="text-xs text-[#E6D4AF]/80">
                  Organizado por importância para o seu acompanhamento
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSecondaryDrawer(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[65vh] overflow-y-auto">
              {secondaryModules.map((mod) => {
                const Icon = mod.icon;
                const isCurrent = activeTab === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => {
                      handleNavigate(mod.id);
                      setShowSecondaryDrawer(false);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#FAF0F2] border-[#8D253D] text-[#5D1425]'
                        : 'bg-white border-[#E6D4AF] hover:bg-[#FAF6ED] text-stone-800'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-[#FAF0F2] text-[#8D253D] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        {mod.label}
                      </span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        {mod.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-4 py-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handleFullLogout}
                className="text-xs font-bold text-rose-700 flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da Conta</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSecondaryDrawer(false)}
                className="px-4 py-1.5 rounded-xl bg-[#5D1425] text-white text-xs font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Hidden on lg+ where DesktopSidebarNav is shown) */}
      <nav
        aria-label="Navegação Principal Mobile"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-6 py-1.5">
            {primaryTabs.map((item) => {
              const Icon = item.icon;
              const isActive = item.matches.includes(activeTab);
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center gap-1 px-1 py-1.5 rounded-xl transition-all duration-200 cursor-pointer min-h-[48px] ${
                    isActive
                      ? 'text-[#731C31] bg-[#FAF0F2] font-semibold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#8D253D]' : 'text-stone-400'
                    }`}
                  />
                  <span className="text-[10px] tracking-wide whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setShowSecondaryDrawer(true)}
              aria-label="Abrir mais módulos"
              className="flex flex-col items-center justify-center gap-1 px-1 py-1.5 rounded-xl text-stone-600 hover:text-[#5D1425] transition-all cursor-pointer min-h-[48px]"
            >
              <Grid className="w-4 h-4 text-[#B89243] shrink-0" />
              <span className="text-[10px] font-semibold tracking-wide whitespace-nowrap">
                Mais
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};
