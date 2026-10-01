import React, { useState } from 'react';
import { 
  Home, 
  CreditCard, 
  Users, 
  Megaphone, 
  Calendar, 
  MoreHorizontal, 
  Bell, 
  Activity, 
  BookOpen, 
  User, 
  X,
  Sparkles,
  Compass,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { NavTab } from '../types';
import { usePatient } from '../context/PatientContext';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const { patient, logout } = usePatient();
  const isWomanMode = patient?.userMode === 'saude_feminina';
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Tabs for Woman Mode (Non-pregnant)
  const womanPrimaryTabs = [
    { id: 'woman_home' as NavTab, label: 'Início', icon: Home },
    { id: 'cycle_tracker' as NavTab, label: 'Ciclo', icon: Compass },
    { id: 'preventive_screening' as NavTab, label: 'Prevenção', icon: ShieldCheck },
    { id: 'woman_education' as NavTab, label: 'Trilhas', icon: BookOpen },
    { id: 'news' as NavTab, label: 'Mural', icon: Megaphone },
  ];

  // Tabs for Pregnant Mode
  const pregnantPrimaryTabs = [
    { id: 'home' as NavTab, label: 'Início', icon: Home },
    { id: 'prenatal_card' as NavTab, label: 'Carteira', icon: CreditCard },
    { id: 'community' as NavTab, label: 'Fórum', icon: Users },
    { id: 'news' as NavTab, label: 'Mural', icon: Megaphone },
    { id: 'calendar' as NavTab, label: 'Agenda', icon: Calendar },
  ];

  const primaryTabs = isWomanMode ? womanPrimaryTabs : pregnantPrimaryTabs;

  const pregnantSecondaryTabs = [
    { id: 'reminders' as NavTab, label: 'Lembretes Médicos', desc: 'Preparo de exames e medicações', icon: Bell },
    { id: 'symptoms' as NavTab, label: 'Diário de Sintomas', desc: 'Humor, queixas e hidratação', icon: Activity },
    { id: 'education' as NavTab, label: 'Prevenção & Cuidados', desc: 'Artigos e guias da Febrasgo', icon: BookOpen },
    { id: 'profile' as NavTab, label: 'Meu Perfil & Ajustes', desc: 'Dados da mãe e tamanho de fonte', icon: User },
  ];

  const womanSecondaryTabs = [
    { id: 'calendar' as NavTab, label: 'Minha Agenda', desc: 'Consultas ginecológicas e exames', icon: Calendar },
    { id: 'reminders' as NavTab, label: 'Lembretes & Alertas', desc: 'Medicamentos e rotinas preventivas', icon: Bell },
    { id: 'profile' as NavTab, label: 'Meu Perfil & Ajustes', desc: 'Dados ginecológicos e tamanho de fonte', icon: User },
  ];

  const secondaryTabs = isWomanMode ? womanSecondaryTabs : pregnantSecondaryTabs;
  const isSecondaryActive = secondaryTabs.some((t) => t.id === activeTab);

  return (
    <>
      {/* Bottom Sheet Menu for "Mais" */}
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end lg:hidden animate-fadeIn"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div 
            className="bg-white rounded-t-3xl border-t border-[#E6D4AF] p-5 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B89243]" />
                <h3 className="font-serif font-bold text-base text-[#480D1B]">
                  Mais Ferramentas Vittaconect
                </h3>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sair / Logout to Registration Screen */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FAF6ED] to-[#FAF0F2] border border-[#E6D4AF] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8D253D] block">
                  Perfil em Uso
                </span>
                <strong className="font-serif text-xs text-[#480D1B]">
                  {isWomanMode ? '🌸 Modo Saúde Feminina' : '🤰 Modo Gestante'}
                </strong>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMoreMenuOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#5D1425] text-white text-xs font-bold shadow-xs hover:bg-[#741C30] cursor-pointer"
              >
                Sair / Trocar Modo
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {secondaryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onChangeTab(tab.id);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`flex items-center gap-3.5 p-3 rounded-2xl transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#FAF0F2] border border-[#EBBEC8] text-[#5D1425]'
                        : 'bg-stone-50/80 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-[#5D1425] text-white shadow-2xs'
                          : 'bg-white border border-stone-200 text-stone-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <strong className="text-xs sm:text-sm block font-serif">
                        {tab.label}
                      </strong>
                      <span className="text-[11px] text-stone-500 block truncate">
                        {tab.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#E6D4AF]/60 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
        aria-label="Navegação Principal do Aplicativo"
      >
        <div className="grid grid-cols-6 items-center h-16 max-w-lg mx-auto px-1">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all cursor-pointer relative ${
                  isActive ? 'text-[#5D1425]' : 'text-stone-500 hover:text-stone-800'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <span className="absolute top-1 w-1.5 h-1.5 rounded-full bg-[#B89243]" />
                )}
                <div
                  className={`p-1 rounded-full transition-transform ${
                    isActive ? 'scale-110 bg-[#FAF0F2]' : ''
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-[#5D1425] stroke-[2.2]' : 'text-stone-500 stroke-[1.7]'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${
                    isActive ? 'font-bold text-[#5D1425]' : 'font-medium text-stone-500'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* 6th Tab: "Mais" */}
          <button
            onClick={() => setIsMoreMenuOpen(true)}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all cursor-pointer relative ${
              isSecondaryActive ? 'text-[#5D1425]' : 'text-stone-500 hover:text-stone-800'
            }`}
            aria-label="Mais opções de menu"
          >
            {isSecondaryActive && (
              <span className="absolute top-1 w-1.5 h-1.5 rounded-full bg-[#B89243]" />
            )}
            <div
              className={`p-1 rounded-full transition-transform ${
                isSecondaryActive ? 'scale-110 bg-[#FAF0F2]' : ''
              }`}
            >
              <MoreHorizontal
                className={`w-5 h-5 transition-colors ${
                  isSecondaryActive ? 'text-[#5D1425] stroke-[2.2]' : 'text-stone-500 stroke-[1.7]'
                }`}
              />
            </div>
            <span
              className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${
                isSecondaryActive ? 'font-bold text-[#5D1425]' : 'font-medium text-stone-500'
              }`}
            >
              Mais
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
