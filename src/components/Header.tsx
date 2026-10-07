import React, { useState, useRef, useEffect } from 'react';
import {
  PhoneCall,
  Video,
  Share2,
  Sliders,
  Baby,
  Flower2,
  Stethoscope,
  LogOut,
  Download,
  MessageSquare,
  Search,
  Bell,
  Sparkles,
  User,
  ChevronDown,
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { VittacareLogo } from './VittacareLogo';
import { NursingCrest } from './NursingCrest';
import { NavTab } from '../types';

interface HeaderProps {
  activeTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
  onOpenSOS: () => void;
  onOpenTelehealth?: () => void;
  onOpenShare: () => void;
  onOpenCustomization: () => void;
  onOpenProfile?: () => void;
  onOpenInstall?: () => void;
  onOpenInstallApp?: () => void;
  onOpenNurseChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTab,
  onOpenSOS,
  onOpenTelehealth,
  onOpenShare,
  onOpenCustomization,
  onOpenProfile,
  onOpenInstall,
  onOpenInstallApp,
  onOpenNurseChat,
}) => {
  const { patient, switchMode, logout: patientLogout } = usePatient();
  const { userRole, logout: authLogout, loginAsDemo, isDemoSession } = useAuth();
  const { unreadNotificationsCount, setIsSearchOpen, setIsNotificationsOpen } =
    useFeedback();

  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isPregnant = patient?.userMode !== 'saude_feminina';
  const handleInstallClick = onOpenInstall || onOpenInstallApp;
  const handleProfileClick =
    onOpenProfile || (() => onSelectTab && onSelectTab('profile'));

  const preferredName =
    patient?.preferredName || patient?.name?.split(' ')[0] || 'Paciente';
  const userInitial = (
    patient?.preferredName?.[0] ||
    patient?.name?.[0] ||
    'M'
  ).toUpperCase();

  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsQuickMenuOpen(false);
      }
    };
    if (isQuickMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isQuickMenuOpen]);

  const handleFullLogout = async () => {
    setIsQuickMenuOpen(false);
    patientLogout();
    await authLogout();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E6D4AF]/60 shadow-2xs">
      {/* Demo Mode Strip */}
      {isDemoSession && (
        <div className="bg-amber-100/95 border-b border-amber-300 px-4 py-1 text-center flex items-center justify-center gap-2 text-[11px] font-bold text-amber-950">
          <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Modo Demonstração — Dados Fictícios</span>
          <span className="hidden sm:inline font-normal text-amber-800">
            • Simulação interativa para exploração das jornadas clínicas
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* LEFT: Brand Logo + Mode Switcher */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() =>
              onSelectTab && onSelectTab(isPregnant ? 'home' : 'woman_home')
            }
            className="cursor-pointer group transition-opacity hover:opacity-95 shrink-0 flex items-center gap-2.5 text-left focus:outline-none"
            title="Ir para o Início"
          >
            <VittacareLogo size="sm" />
            <div className="hidden xl:flex items-center gap-1.5 pl-2.5 border-l border-[#E6D4AF]">
              <NursingCrest size="sm" variant="gold" />
            </div>
          </button>

          {/* Clean Mode Switcher Pill (Gestante vs Mulher) */}
          <div
            className="flex items-center bg-[#FAF0F2] p-0.5 rounded-full border border-[#EBBEC8] shrink-0"
            role="group"
            aria-label="Alternar modo de acompanhamento"
          >
            <button
              type="button"
              onClick={() => switchMode('gestante')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                isPregnant
                  ? 'bg-[#5D1425] text-[#E6D4AF] shadow-2xs'
                  : 'text-[#731C31] hover:bg-white/60'
              }`}
              title="Modo Gestante (Pré-Natal)"
            >
              <Baby className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gestante</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('saude_feminina')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                !isPregnant
                  ? 'bg-[#5D1425] text-[#E6D4AF] shadow-2xs'
                  : 'text-[#731C31] hover:bg-white/60'
              }`}
              title="Modo Saúde da Mulher (Ciclo & Prevenção)"
            >
              <Flower2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mulher</span>
            </button>
          </div>
        </div>

        {/* RIGHT: Search, Notifications, Primary Quick Actions & User Profile + Menu */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 1. Global Search */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Busca Global no Vittaconect"
            title="Busca Rápida (Ctrl+K)"
            className="min-h-[40px] min-w-[40px] sm:px-3 py-2 rounded-xl bg-white hover:bg-[#FAF6ED] text-stone-700 border border-[#E6D4AF] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Search className="w-4 h-4 text-[#8D253D]" />
            <span className="hidden md:inline">Buscar</span>
          </button>

          {/* 2. Notifications */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            aria-label={`Notificações (${unreadNotificationsCount} não lidas)`}
            title="Central de Notificações e Alertas"
            className="relative min-h-[40px] min-w-[40px] p-2 rounded-xl bg-white hover:bg-[#FAF6ED] text-stone-700 border border-[#E6D4AF] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
          >
            <Bell className="w-4 h-4 text-[#8D253D]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* 3. Quick Action: Accessibility / Font Size (Desktop/Tablet) */}
          <button
            type="button"
            onClick={onOpenCustomization}
            aria-label="Acessibilidade e Personalização"
            title="Personalizar Tema e Tamanho da Fonte"
            className="hidden sm:flex min-h-[40px] min-w-[40px] p-2 rounded-xl bg-[#FAF6ED] hover:bg-[#F3EBD8] text-[#785B23] border border-[#E6D4AF] items-center justify-center transition-all cursor-pointer shadow-2xs"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* 4. Quick Action: SOS Emergency */}
          <button
            type="button"
            onClick={onOpenSOS}
            aria-label="Acionar SOS Obstétrico de Emergência"
            title="SOS Obstétrico e Ginecológico 24h"
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>SOS</span>
          </button>

          {/* 5. Greeting + User Name + Avatar + Quick Actions Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsQuickMenuOpen((prev) => !prev)}
              aria-expanded={isQuickMenuOpen}
              aria-label="Menu do perfil e ações rápidas"
              className="min-h-[40px] flex items-center gap-2 pl-2 pr-2 sm:pr-2.5 py-1 rounded-xl bg-white hover:bg-[#FAF6ED] border border-[#E6D4AF] transition-all cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5DADF] to-[#F3EBD8] border border-[#E6D4AF] flex items-center justify-center text-[#5D1425] font-serif font-bold text-sm shrink-0">
                {userInitial}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="text-[10px] text-stone-500 block">
                  {timeGreeting},
                </span>
                <span className="text-xs font-bold text-[#480D1B] block max-w-[110px] truncate">
                  {preferredName}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            </button>

            {/* Quick Actions & User Profile Popover */}
            {isQuickMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#E6D4AF] shadow-xl py-2 z-50 animate-fadeIn">
                {/* User Summary Header */}
                <div className="px-4 py-3 border-b border-stone-100 bg-[#FDFBF7]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#5D1425] text-[#E6D4AF] border border-[#B89243] flex items-center justify-center font-serif font-bold text-base shrink-0">
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#480D1B] truncate">
                        {patient?.name || preferredName}
                      </p>
                      <p className="text-[11px] text-[#8D253D] font-medium">
                        {isPregnant
                          ? `${patient?.currentWeek || 18}ª Semana de Gestação`
                          : 'Saúde Integral da Mulher'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions List */}
                <div className="py-1.5 px-2 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuickMenuOpen(false);
                      handleProfileClick();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-[#FAF0F2] hover:text-[#5D1425] transition-colors cursor-pointer text-left"
                  >
                    <User className="w-4 h-4 text-[#8D253D]" />
                    <span>Meu Perfil, Dados & LGPD</span>
                  </button>

                  {onOpenNurseChat && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsQuickMenuOpen(false);
                        onOpenNurseChat();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-[#FAF0F2] hover:text-[#5D1425] transition-colors cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-[#8D253D]" />
                        <span>Chat com a Enfermagem</span>
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </button>
                  )}

                  {onOpenTelehealth && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsQuickMenuOpen(false);
                        onOpenTelehealth();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-[#FAF0F2] hover:text-[#5D1425] transition-colors cursor-pointer text-left"
                    >
                      <Video className="w-4 h-4 text-[#9B7731]" />
                      <span>Sala de Teleatendimento</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsQuickMenuOpen(false);
                      onOpenCustomization();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-[#FAF6ED] hover:text-[#480D1B] transition-colors cursor-pointer text-left"
                  >
                    <Sliders className="w-4 h-4 text-[#9B7731]" />
                    <span>Acessibilidade & Tamanho da Fonte</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsQuickMenuOpen(false);
                      onOpenShare();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-[#FAF6ED] hover:text-[#480D1B] transition-colors cursor-pointer text-left"
                  >
                    <Share2 className="w-4 h-4 text-[#9B7731]" />
                    <span>Compartilhar com Acompanhante</span>
                  </button>

                  {handleInstallClick && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsQuickMenuOpen(false);
                        handleInstallClick();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-[#FAF6ED] hover:text-[#480D1B] transition-colors cursor-pointer text-left"
                    >
                      <Download className="w-4 h-4 text-[#8D253D]" />
                      <span>Instalar Aplicativo no Celular</span>
                    </button>
                  )}

                  {(isDemoSession ||
                    userRole === 'profissional' ||
                    userRole === 'administrador') && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsQuickMenuOpen(false);
                        loginAsDemo(
                          'profissional',
                          'gestante',
                          'Enf. Marcelo'
                        );
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#0A2647] bg-[#EBF6FF] hover:bg-[#DCEFFE] transition-colors cursor-pointer text-left mt-1"
                    >
                      <Stethoscope className="w-4 h-4 text-[#144272]" />
                      <span>Alternar para Vittaprofessio</span>
                    </button>
                  )}
                </div>

                {/* Logout Footer */}
                <div className="pt-1.5 mt-1 border-t border-stone-100 px-2">
                  <button
                    type="button"
                    onClick={handleFullLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da Conta</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Direct Logout Button on Desktop for 1-click access */}
          <button
            type="button"
            onClick={handleFullLogout}
            aria-label="Sair da conta"
            title="Sair / Trocar Conta"
            className="hidden xl:flex min-h-[40px] items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF0F2] hover:bg-rose-100 text-[#8D253D] border border-[#EBBEC8] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};
