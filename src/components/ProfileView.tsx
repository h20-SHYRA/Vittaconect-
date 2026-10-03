import React, { useState } from 'react';
import { 
  User, 
  Heart, 
  Shield, 
  Phone, 
  MapPin, 
  Clock, 
  Award, 
  CheckCircle, 
  AlertTriangle,
  Stethoscope,
  ExternalLink,
  MessageCircle,
  Sliders,
  Type,
  ZoomIn,
  ZoomOut,
  Contrast,
  Sun,
  Eye,
  Edit3,
  LogOut
} from 'lucide-react';
import { CLINIC_INFO } from '../data/mockData';
import { VittacareLogo } from './VittacareLogo';
import { useCustomization, FontSizeOption } from '../context/CustomizationContext';
import { usePatient } from '../context/PatientContext';
import { EditPatientModal } from './EditPatientModal';

interface ProfileViewProps {
  onOpenSOS: () => void;
  onOpenInstall?: () => void;
  onOpenShare?: () => void;
  onOpenCustomization?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  onOpenSOS, 
  onOpenInstall, 
  onOpenShare, 
  onOpenCustomization 
}) => {
  const { settings, updateSetting, increaseFontSize, decreaseFontSize } = useCustomization();
  const { patient, logout, switchMode } = usePatient();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const isWomanMode = patient?.userMode === 'saude_feminina';
  const personName = patient?.name || (isWomanMode ? 'Camila Alencar' : 'Mariana Silva');
  const personInitial = patient?.preferredName ? patient.preferredName[0].toUpperCase() : 'C';
  const personAge = patient?.age || (isWomanMode ? 32 : 28);
  const currentWeek = patient?.currentWeek || 16;
  const babyName = patient?.babyNickname || 'Bebê';
  const babyGenderLabel = patient?.babyGender === 'boy' ? 'Menino' : patient?.babyGender === 'girl' ? 'Menina' : 'Surpresa';
  const trimester = currentWeek <= 13 ? 1 : currentWeek <= 26 ? 2 : 3;
  const vaccines = [
    { name: 'dTpa (Tríplice Bacteriana Acelular)', status: 'Agendada para 20ª sem', date: '2026-10-24', done: false },
    { name: 'Hepatite B (3ª Dose)', status: 'Realizada', date: '2026-08-14', done: true },
    { name: 'Influenza (Gripe)', status: 'Realizada', date: '2026-07-20', done: true },
    { name: 'Covid-19 Bivalente', status: 'Realizada', date: '2026-06-10', done: true },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8D253D] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#B89243]" />
            {isWomanMode ? 'Carteira de Saúde da Mulher' : 'Carteira Digital da Gestante'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
            Meu Perfil & Prontuário Vittacare
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            {isWomanMode
              ? 'Identificação clínica, parâmetros ginecológicos e equipe de referência.'
              : 'Identificação materna, histórico de vacinas e equipe de referência.'}
          </p>
        </div>

        {/* Edit Profile & Logout Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar Meus Dados</span>
          </button>
          <button
            onClick={() => {
              logout();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8] text-[#8D253D] hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Sair e abrir tela inicial de cadastro para alternar modo"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair / Trocar de Modo</span>
          </button>
        </div>
      </div>

      {/* Mode Information Card */}
      <div className="p-4 rounded-3xl bg-white border border-[#DEC68E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isWomanMode ? '🌸' : '🤰'}</span>
          <div>
            <strong className="text-[#480D1B] block font-serif text-sm">
              Perfil Ativo: {isWomanMode ? 'Saúde Feminina & Prevenção Ginecológica' : 'Saúde Materna & Gestação'}
            </strong>
            <span className="text-stone-500 block">
              Para alternar entre o Modo Gestante e o Modo Saúde da Mulher, clique em <strong>Sair / Trocar de Modo</strong> acima para acessar a tela de cadastro.
            </span>
          </div>
        </div>
      </div>

      {/* Health Passport Card */}
      <section className="bg-gradient-to-br from-[#FAF0F2] via-white to-[#FAF6ED] rounded-3xl p-6 sm:p-8 border border-[#E6D4AF] shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E6D4AF]/60">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#DEC68E] via-[#B89243] to-[#5D1425] p-1 shadow-md">
              <div className="w-full h-full rounded-full bg-[#480D1B] flex items-center justify-center text-white text-2xl font-serif font-bold">
                {personInitial}
              </div>
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#480D1B]">
                {personName}
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                {personAge} anos · {isWomanMode ? 'Paciente Ginecológica' : `Gestante (${currentWeek}ª semana)`}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {isWomanMode ? (
                  <>
                    <span className="text-[11px] font-bold text-[#9B7731] bg-white px-2 py-0.5 rounded-full border border-[#E6D4AF]">
                      Ciclo: {patient?.cycleDurationDays || 28} dias
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Fluxo: <strong className="text-stone-700">{patient?.periodDurationDays || 5} dias</strong>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] font-bold text-[#8D253D] bg-white px-2 py-0.5 rounded-full border border-[#EBBEC8]">
                      Tipo: {patient?.bloodType || 'A definir'}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      DPP: <strong className="text-stone-700">{patient?.dueDate || 'A calcular'}</strong>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            {isWomanMode ? (
              <>
                <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                  Método Contraceptivo
                </span>
                <span className="font-serif font-bold text-base sm:text-lg text-[#5D1425] block truncate max-w-xs">
                  {patient?.contraceptiveMethod || 'Preservativo'}
                </span>
                <span className="text-xs text-stone-500 block">Autocuidado Preventivo</span>
              </>
            ) : (
              <>
                <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                  Bebê a Caminho
                </span>
                <span className="font-serif font-bold text-xl text-[#5D1425]">
                  {babyName}
                </span>
                <span className="text-xs text-stone-500 block">{babyGenderLabel} · {trimester}º Trimestre</span>
              </>
            )}
          </div>
        </div>

        {/* Clinical Reference Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-white border border-[#E6D4AF]/60 shadow-xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              {isWomanMode ? 'Médica Ginecologista' : 'Médico Obstetra'}
            </span>
            <h4 className="font-serif font-bold text-base text-[#480D1B] mt-1">
              {patient?.doctorName || (isWomanMode ? 'Dra. Bianca' : 'Dr. Marcelo & Dra. Letícia')}
            </h4>
            <span className="text-xs text-stone-500 block mt-0.5">
              {patient?.doctorCrm || 'Corpo Clínico Vittacare'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E6D4AF]/60 shadow-xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Enfermeira de Referência
            </span>
            <h4 className="font-serif font-bold text-base text-[#480D1B] mt-1">
              Enfª. Stephanie
            </h4>
            <span className="text-xs text-stone-500 block mt-0.5">
              COREN-SP 000.004 (Saúde da Mulher & Puerpério)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E6D4AF]/60 shadow-xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Contato de Emergência
            </span>
            <h4 className="font-serif font-bold text-base text-[#480D1B] mt-1">
              {patient?.emergencyContact || 'Contato de apoio da família'}
            </h4>
            <span className="text-xs text-[#8D253D] font-semibold block mt-0.5">
              Alergia: {patient?.allergies || 'Nenhuma'}
            </span>
          </div>
        </div>
      </section>

      {/* Maternal Vaccination Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E6D4AF]/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#480D1B]">
              Imunização Gestacional Recomendada
            </h3>
            <p className="text-xs text-stone-500">
              Proteção transmitida via placenta com anticorpos maternos.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#3B744C] bg-[#F2F7F3] px-3 py-1 rounded-full">
            3 de 4 em dia
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vaccines.map((v, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 flex items-center justify-between"
            >
              <div>
                <h4 className="font-medium text-xs text-stone-800">{v.name}</h4>
                <span className="text-[11px] text-stone-500">{v.status}</span>
              </div>
              {v.done ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#3B744C] bg-white px-2 py-0.5 rounded-lg border border-[#DFEDE2]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Aplicada
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#B89243] bg-white px-2 py-0.5 rounded-lg border border-[#E6D4AF]">
                  {v.date.split('-').reverse().join('/')}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Personalização do App & Tamanho das Letras */}
      <section className="bg-gradient-to-br from-[#FAF6ED] via-white to-[#FAF0F2] rounded-3xl p-6 sm:p-7 border border-[#E6D4AF] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6D4AF]/50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9B7731] block">
              Personalização & Conforto Visual
            </span>
            <h3 className="font-serif font-bold text-lg text-[#480D1B] mt-0.5">
              Tamanho das Letras & Acessibilidade
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Adapte a leitura do app para o tamanho mais confortável aos seus olhos.
            </p>
          </div>

          {onOpenCustomization && (
            <button
              onClick={onOpenCustomization}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#DEC68E] text-[#480D1B] hover:bg-[#FAF6ED] text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Sliders className="w-3.5 h-3.5 text-[#B89243]" />
              <span>Mais Ajustes</span>
            </button>
          )}
        </div>

        {/* Live Font Size Stepper */}
        <div className="p-4 rounded-2xl bg-white border border-[#E6D4AF]/70 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6ED] border border-[#DEC68E] flex items-center justify-center text-[#B89243] shrink-0">
              <Type className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#480D1B] block">
                Tamanho da Fonte em Todo o App
              </span>
              <span className="text-[11px] text-stone-500">
                Pressione para aumentar ou diminuir as letras instantaneamente:
              </span>
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
            {(
              [
                { id: 'sm' as FontSizeOption, label: 'P', title: 'Pequeno (90%)' },
                { id: 'base' as FontSizeOption, label: 'M (Normal)', title: 'Padrão (100%)' },
                { id: 'lg' as FontSizeOption, label: 'G', title: 'Médio (115%)' },
                { id: 'xl' as FontSizeOption, label: 'GG', title: 'Grande (130%)' },
                { id: '2xl' as FontSizeOption, label: 'XG', title: 'Extra Grande (150%)' },
              ]
            ).map((opt) => {
              const isSelected = settings.fontSize === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => updateSetting('fontSize', opt.id)}
                  title={opt.title}
                  className={`h-9 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#5D1425] text-white shadow-xs ring-2 ring-[#B89243]/30 scale-105'
                      : 'bg-stone-50 hover:bg-[#FAF6ED] text-stone-700 border border-stone-200'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Toggles: Alto Contraste & Traço Reforçado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="p-3.5 rounded-2xl bg-white border border-[#E6D4AF]/70 flex items-center justify-between cursor-pointer hover:bg-[#FAF6ED]/30 transition-colors">
            <div className="flex items-center gap-2.5">
              <Contrast className="w-4 h-4 text-[#8D253D]" />
              <div>
                <span className="text-xs font-bold text-[#480D1B] block">
                  Alto Contraste
                </span>
                <span className="text-[10px] text-stone-500">
                  Mais nitidez para ler na luz do sol
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSetting('highContrast', e.target.checked)}
              className="w-4 h-4 accent-[#5D1425] rounded cursor-pointer"
            />
          </label>

          <label className="p-3.5 rounded-2xl bg-white border border-[#E6D4AF]/70 flex items-center justify-between cursor-pointer hover:bg-[#FAF6ED]/30 transition-colors">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-[#B89243]" />
              <div>
                <span className="text-xs font-bold text-[#480D1B] block">
                  Traço Reforçado (Negrito)
                </span>
                <span className="text-[10px] text-stone-500">
                  Letras mais espessas e legíveis
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.boldText}
              onChange={(e) => updateSetting('boldText', e.target.checked)}
              className="w-4 h-4 accent-[#5D1425] rounded cursor-pointer"
            />
          </label>
        </div>
      </section>

      {/* PWA Mobile Installation Card */}
      <section className="bg-gradient-to-br from-[#FAF0F2] to-white rounded-3xl p-6 sm:p-7 border border-[#EBBEC8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8D253D] block">
            Acesso no Celular
          </span>
          <h3 className="font-serif font-bold text-lg text-[#480D1B] mt-0.5">
            Instalar o Vittaconect na Tela Inicial
          </h3>
          <p className="text-xs text-stone-600 mt-1 max-w-lg">
            Abra direto pelo ícone como um aplicativo nativo no Android ou iPhone, sem precisar digitar o endereço no navegador.
          </p>
        </div>

        {onOpenInstall && (
          <button
            onClick={onOpenInstall}
            className="px-5 py-2.5 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
          >
            Ver Como Instalar
          </button>
        )}
      </section>

      {/* Rede de Apoio e Acompanhantes */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E6D4AF]/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#3B744C] block">
            Rede de Apoio Ativa
          </span>
          <h3 className="font-serif font-bold text-lg text-[#480D1B] mt-0.5">
            Acompanhantes & Familiares Conectados
          </h3>
          <p className="text-xs text-stone-600 mt-1 max-w-lg">
            Permita que o pai/acompanhante, avós ou doula acompanhem as datas de ultrassom, exames e orientações do pré-natal.
          </p>
        </div>

        {onOpenShare && (
          <button
            onClick={onOpenShare}
            className="px-5 py-2.5 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8] hover:bg-[#F5DFE4] text-[#5D1425] text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
          >
            Gerenciar Acessos
          </button>
        )}
      </section>

      {/* Clinic Contact & Direct Channels */}
      <section className="bg-[#FAF6ED] rounded-3xl p-6 sm:p-7 border border-[#E6D4AF] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6D4AF]/60">
          <div>
            <VittacareLogo size="sm" />
            <p className="text-xs text-stone-600 mt-2">
              {CLINIC_INFO.address}
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              {CLINIC_INFO.unitHours}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSOS}
              className="px-4 py-2.5 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Pronto-Atendimento 24h
            </button>
            <a
              href="https://wa.me/5511988776655"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#3B744C] hover:bg-[#336443] text-white text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Vittacare</span>
            </a>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="font-serif italic text-xs text-[#5D1425]">
            "{CLINIC_INFO.slogan}"
          </p>
        </div>
      </section>

      {/* Edit Patient Profile Modal */}
      {isEditOpen && <EditPatientModal onClose={() => setIsEditOpen(false)} />}
    </div>
  );
};
