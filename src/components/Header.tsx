import React from 'react';
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

  const isPregnant = patient?.userMode !== 'saude_feminina';
  const handleInstallClick = onOpenInstall || onOpenInstallApp;
  const handleProfileClick =
    onOpenProfile || (() => onSelectTab && onSelectTab('profile'));

  const handleFullLogout = async () => {
    patientLogout();
    await authLogout();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Explicit Demo Mode Banner when in Demo Session (Section 10 compliance) */}
      {isDemoSession && (
        <div className="bg-amber-100/95 border-b border-amber-300 px-4 py-1 text-center flex items-center justify-center gap-2 text-[11px] font-bold text-amber-950">
          <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Modo Demonstração — Dados Fictícios</span>
          <span className="hidden sm:inline font-normal text-amber-800">
            • Simulação interativa para exploração das jornadas clínicas
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Identity + Nursing Emblem + Mode Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div
            onClick={handleProfileClick}
            className="cursor-pointer group transition-opacity hover:opacity-95 shrink-0 flex items-center gap-2"
          >
            <VittacareLogo size="sm" />
            <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-[#E6D4AF]">
              <NursingCrest size="sm" variant="gold" />
            </div>
          </div>

          {/* Patient Mode Switcher: Gestante vs Saúde Feminina */}
          <div className="flex items-center bg-[#FAF0F2] p-0.5 rounded-full border border-[#EBBEC8] shadow-2xs shrink-0">
            <button
              type="button"
              onClick={() => switchMode('gestante')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                isPregnant
                  ? 'bg-[#5D1425] text-[#E6D4AF] shadow-xs'
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                !isPregnant
                  ? 'bg-[#5D1425] text-[#E6D4AF] shadow-xs'
                  : 'text-[#731C31] hover:bg-white/60'
              }`}
              title="Modo Saúde da Mulher (Ciclo & Prevenção)"
            >
              <Flower2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mulher</span>
            </button>
          </div>
        </div>

        {/* Right Actions: Global Search, Notifications, Chat, Customization, Telehealth, SOS, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Global Search Button (Ctrl+K) */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Busca Global no Vittaconect"
            title="Busca Rápida (Ctrl+K)"
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-full bg-white hover:bg-[#FAF6ED] text-stone-700 border border-[#E6D4AF] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-[#8D253D]" />
            <span className="hidden lg:inline">Buscar</span>
          </button>

          {/* Smart Notifications Center */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            aria-label={`Notificações (${unreadNotificationsCount} não lidas)`}
            title="Central de Notificações e Alertas"
            className="relative p-2 rounded-full bg-white hover:bg-[#FAF6ED] text-stone-700 border border-[#E6D4AF] transition-all cursor-pointer shadow-2xs"
          >
            <Bell className="w-4 h-4 text-[#8D253D]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Direct Real-time Chat with the 4 Nurses */}
          {onOpenNurseChat && (
            <button
              type="button"
              onClick={onOpenNurseChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5D1425] hover:bg-[#480D1B] text-[#E6D4AF] border border-[#B89243]/50 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Abrir Chat em Tempo Real com os 4 Enfermeiros"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#E6D4AF]" />
              <span className="hidden md:inline">Chat Enfermagem</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          )}

          {/* Switch to Professional View (Only when in Demo Mode or Staff Role) */}
          {(isDemoSession ||
            userRole === 'profissional' ||
            userRole === 'administrador') && (
            <button
              type="button"
              onClick={() =>
                loginAsDemo('profissional', 'gestante', 'Enf. Marcelo')
              }
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-[#E6D4AF] border border-[#B89243]/40 text-[11px] font-semibold transition-all cursor-pointer"
              title="Alternar para o Portal de Enfermagem Vittaprofessio"
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#D0B06B]" />
              <span>Vittaprofessio</span>
            </button>
          )}

          {/* Download / Install App */}
          {handleInstallClick && (
            <button
              type="button"
              onClick={handleInstallClick}
              title="Baixar Aplicativo Vittaconect"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-[#FAF0F2] to-[#FAF6ED] hover:from-[#F5DADF] hover:to-[#F3EBD8] text-[#5D1425] border border-[#E6D4AF] text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#8D253D]" />
              <span className="hidden xl:inline">App</span>
            </button>
          )}

          {/* Customization / Accessibility Button */}
          <button
            type="button"
            onClick={onOpenCustomization}
            aria-label="Acessibilidade e Personalização"
            title="Personalizar Tema, Fonte e Modo Escuro"
            className="p-2 rounded-full bg-[#FAF6ED] hover:bg-[#F3EBD8] text-[#785B23] border border-[#E6D4AF] transition-all cursor-pointer shadow-2xs"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={onOpenShare}
            aria-label="Compartilhar acesso"
            title="Convidar ou Compartilhar Acesso"
            className="hidden md:flex p-2 rounded-full bg-[#FAF6ED] hover:bg-[#F3EBD8] text-[#785B23] border border-[#E6D4AF] transition-all cursor-pointer shadow-2xs"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Telehealth Quick Action */}
          {onOpenTelehealth && (
            <button
              type="button"
              onClick={onOpenTelehealth}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF0F2] hover:bg-[#F5DADF] text-[#731C31] border border-[#EBBEC8] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <Video className="w-3.5 h-3.5 text-[#8D253D]" />
              <span className="hidden lg:inline">Teleconsulta</span>
            </button>
          )}

          {/* Emergency SOS Button */}
          <button
            type="button"
            onClick={onOpenSOS}
            aria-label="Acionar SOS Obstétrico de Emergência"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>SOS</span>
          </button>

          {/* User Profile Pill */}
          <div
            onClick={handleProfileClick}
            className="hidden lg:flex items-center gap-2 pl-2 border-l border-stone-200 cursor-pointer group"
          >
            <div className="text-right">
              <p className="text-xs font-semibold text-stone-800 leading-none group-hover:text-[#8D253D] transition-colors">
                {patient?.preferredName || patient?.name?.split(' ')[0] || 'Paciente'}
              </p>
              <p className="text-[11px] text-[#8D253D] font-medium mt-0.5">
                {isPregnant ? `${patient?.currentWeek || 18}ª Semana` : 'Saúde Feminina'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5DADF] to-[#F3EBD8] border border-[#E6D4AF] flex items-center justify-center text-[#5D1425] font-serif font-bold text-sm shadow-inner">
              {patient?.preferredName?.[0] || patient?.name?.[0] || 'M'}
            </div>
          </div>

          {/* Prominent Logout Button (Sair) */}
          <button
            type="button"
            onClick={handleFullLogout}
            aria-label="Sair da conta"
            title="Sair / Trocar Conta ou Perfil"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF0F2] hover:bg-rose-100 text-[#8D253D] border border-[#EBBEC8] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};
