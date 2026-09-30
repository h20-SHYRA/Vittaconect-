import React from 'react';
import { PhoneCall, Bell, ShieldAlert, HeartHandshake, Smartphone, Users, Sliders, Type } from 'lucide-react';
import { VittacareLogo } from './VittacareLogo';
import { CLINIC_INFO } from '../data/mockData';
import { usePatient } from '../context/PatientContext';
import { NavTab } from '../types';

interface HeaderProps {
  onOpenSOS: () => void;
  onOpenInstall: () => void;
  onOpenShare: () => void;
  onOpenCustomization: () => void;
  onSelectTab: (tab: NavTab) => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenSOS, 
  onOpenInstall, 
  onOpenShare, 
  onOpenCustomization,
  onSelectTab, 
  activeTab 
}) => {
  const { patient } = usePatient();
  const motherName = patient?.preferredName || patient?.name?.split(' ')[0] || 'Mãezinha';
  const initialLetter = motherName ? motherName[0].toUpperCase() : 'M';
  const weekLabel = patient?.currentWeek ? `${patient.currentWeek}ª Semana` : 'Pré-natal';
  return (
    <header className="sticky top-0 z-30 w-full bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E6D4AF]/50 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Zone */}
        <button
          onClick={() => onSelectTab('home')}
          className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89243] rounded-lg transition-transform active:scale-[0.99] text-left"
          aria-label="Ir para tela inicial Vittaconect"
        >
          <VittacareLogo size="md" />
        </button>

        {/* Navigation links for tablet & desktop */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs xl:text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectTab('home')}
            className={`transition-colors cursor-pointer py-1 border-b-2 whitespace-nowrap ${
              activeTab === 'home'
                ? 'text-[#5D1425] border-[#B89243] font-semibold'
                : 'text-stone-600 border-transparent hover:text-[#5D1425]'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => onSelectTab('prenatal_card')}
            className={`transition-colors cursor-pointer py-1 border-b-2 whitespace-nowrap ${
              activeTab === 'prenatal_card'
                ? 'text-[#5D1425] border-[#B89243] font-semibold'
                : 'text-stone-600 border-transparent hover:text-[#5D1425]'
            }`}
          >
            Carteira Digital
          </button>
          <button
            onClick={() => onSelectTab('community')}
            className={`transition-colors cursor-pointer py-1 border-b-2 whitespace-nowrap ${
              activeTab === 'community'
                ? 'text-[#5D1425] border-[#B89243] font-semibold'
                : 'text-stone-600 border-transparent hover:text-[#5D1425]'
            }`}
          >
            Fórum de Apoio
          </button>
          <button
            onClick={() => onSelectTab('news')}
            className={`transition-colors cursor-pointer py-1 border-b-2 whitespace-nowrap ${
              activeTab === 'news'
                ? 'text-[#5D1425] border-[#B89243] font-semibold'
                : 'text-stone-600 border-transparent hover:text-[#5D1425]'
            }`}
          >
            Mural Vittacare
          </button>
          <button
            onClick={() => onSelectTab('calendar')}
            className={`transition-colors cursor-pointer py-1 border-b-2 whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'text-[#5D1425] border-[#B89243] font-semibold'
                : 'text-stone-600 border-transparent hover:text-[#5D1425]'
            }`}
          >
            Agenda
          </button>
          <button
            onClick={() => onSelectTab('reminders')}
            className={`transition-colors cursor-pointer py-1 border-b-2 whitespace-nowrap ${
              activeTab === 'reminders'
                ? 'text-[#5D1425] border-[#B89243] font-semibold'
                : 'text-stone-600 border-transparent hover:text-[#5D1425]'
            }`}
          >
            Lembretes
          </button>
          <button
            onClick={() => onSelectTab('symptoms')}
            className={`transition-colors cursor-pointer py-1 border-b-2 whitespace-nowrap ${
              activeTab === 'symptoms'
                ? 'text-[#5D1425] border-[#B89243] font-semibold'
                : 'text-stone-600 border-transparent hover:text-[#5D1425]'
            }`}
          >
            Diário
          </button>
          <button
            onClick={() => onSelectTab('education')}
            className={`transition-colors cursor-pointer py-1 border-b-2 whitespace-nowrap ${
              activeTab === 'education'
                ? 'text-[#5D1425] border-[#B89243] font-semibold'
                : 'text-stone-600 border-transparent hover:text-[#5D1425]'
            }`}
          >
            Educação
          </button>
        </nav>

        {/* Action Zone: Share, Install App, SOS 24h & Patient Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Customization / Font Size & Accessibility */}
          <button
            onClick={onOpenCustomization}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-[#480D1B] bg-white border border-[#DEC68E] hover:bg-[#FAF6ED] transition-all cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89243]"
            title="Ajustar tamanho da letra e acessibilidade do app"
            aria-label="Ajustar tamanho da letra e acessibilidade"
          >
            <Type className="w-3.5 h-3.5 text-[#B89243]" />
            <span className="font-serif font-bold text-xs text-[#5D1425]">A±</span>
          </button>

          {/* Share Access Button */}
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#5D1425] bg-white border border-[#EBBEC8] hover:bg-[#FAF0F2] transition-all cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D253D]"
            title="Compartilhar acesso com acompanhante ou familiares"
          >
            <Users className="w-3.5 h-3.5 text-[#8D253D]" />
            <span className="hidden sm:inline">Convidar</span>
            <span className="sm:hidden">Rede</span>
          </button>

          {/* Install on Mobile Button */}
          <button
            onClick={onOpenInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#480D1B] bg-[#FAF6ED] border border-[#E6D4AF] hover:bg-[#F3EBD8] transition-all cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89243]"
            title="Como baixar o app no seu celular"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#B89243]" />
            <span className="hidden sm:inline">Baixar</span>
            <span>App</span>
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#5D1425] bg-[#FAF0F2] border border-[#EBBEC8] hover:bg-[#F5DFE4] transition-all cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D253D]"
            title="Pronto-Atendimento Obstétrico 24h Vittacare"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#8D253D]" />
            <span className="hidden sm:inline">SOS</span>
            <span>24h</span>
          </button>

          {/* Quick Call Clinic */}
          <a
            href={`tel:${CLINIC_INFO.phone24h.replace(/\D/g, '')}`}
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-[#FAF6ED] border border-[#E6D4AF] text-[#B89243] hover:bg-[#F3EBD8] transition-colors"
            title={`Ligar para Clínica Vittacare: ${CLINIC_INFO.phone24h}`}
          >
            <PhoneCall className="w-4 h-4" />
          </a>

          {/* Patient Avatar / Mini Badge */}
          <button
            onClick={() => onSelectTab('profile')}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89243]"
            title={`Ver Carteira de ${motherName}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#DEC68E] to-[#B89243] flex items-center justify-center text-white font-serif font-bold text-sm shadow-xs border border-white">
              {initialLetter}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-semibold text-[#480D1B] leading-none">
                {motherName}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">{weekLabel}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
