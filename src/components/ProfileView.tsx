import React, { useState } from 'react';
import {
  CheckCircle,
  MessageCircle,
  Sliders,
  Type,
  Contrast,
  Eye,
  Edit3,
  LogOut,
  Bell,
  Shield,
  FileText,
  User,
} from 'lucide-react';
import { CLINIC_INFO } from '../data/mockData';
import { VittacareLogo } from './VittacareLogo';
import { useCustomization, FontSizeOption } from '../context/CustomizationContext';
import { usePatient } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { EditPatientModal } from './EditPatientModal';
import { PatientDocumentsPanel } from './patient/PatientDocumentsPanel';

interface ProfileViewProps {
  onOpenSOS: () => void;
  onOpenInstall?: () => void;
  onOpenShare?: () => void;
  onOpenCustomization?: () => void;
}

type ProfileSectionTab =
  | 'dados_pessoais'
  | 'documentos'
  | 'preferencias'
  | 'notificacoes'
  | 'acessibilidade'
  | 'privacidade_sair';

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenSOS,
  onOpenInstall,
  onOpenShare,
  onOpenCustomization,
}) => {
  const { settings, updateSetting } = useCustomization();
  const { patient, logout: patientLogout } = usePatient();
  const { logout: authLogout } = useAuth();
  const { showToast, setIsNotificationsOpen } = useFeedback();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeSection, setActiveSection] =
    useState<ProfileSectionTab>('dados_pessoais');

  // Notification preferences state
  const [notifyConsultations, setNotifyConsultations] = useState(true);
  const [notifyMedications, setNotifyMedications] = useState(true);
  const [notifyHydration, setNotifyHydration] = useState(true);
  const [notifyChat, setNotifyChat] = useState(true);

  const handleFullLogout = async () => {
    patientLogout();
    await authLogout();
  };

  const handleExportLGPDData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      lgpdCompliance:
        'Clínica Vittacare • Vittaconect 2.0 (Portabilidade Art. 18 LGPD)',
      patientProfile: patient,
      accessibilityPreferences: settings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vittaconect-prontuario-${(patient?.name || 'paciente')
      .toLowerCase()
      .replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast({
      title: 'Dossiê de Dados Exportado (LGPD)',
      description:
        'O arquivo com seus dados clínicos e preferências foi baixado com segurança.',
      tone: 'success',
    });
  };

  const isWomanMode = patient?.userMode === 'saude_feminina';
  const personName =
    patient?.name || (isWomanMode ? 'Camila Alencar' : 'Mariana Silva');
  const personInitial = patient?.preferredName
    ? patient.preferredName[0].toUpperCase()
    : 'M';
  const personAge = patient?.age || (isWomanMode ? 32 : 28);
  const currentWeek = patient?.currentWeek || 16;
  const babyName = patient?.babyNickname || 'Bebê';
  const babyGenderLabel =
    patient?.babyGender === 'boy'
      ? 'Menino'
      : patient?.babyGender === 'girl'
      ? 'Menina'
      : 'Surpresa';
  const trimester = currentWeek <= 13 ? 1 : currentWeek <= 26 ? 2 : 3;

  const vaccines = [
    {
      name: 'dTpa (Tríplice Bacteriana Acelular)',
      status: 'Agendada para 20ª sem',
      date: '2026-10-24',
      done: false,
    },
    {
      name: 'Hepatite B (3ª Dose)',
      status: 'Realizada',
      date: '2026-08-14',
      done: true,
    },
    {
      name: 'Influenza (Gripe)',
      status: 'Realizada',
      date: '2026-07-20',
      done: true,
    },
    {
      name: 'Covid-19 Bivalente',
      status: 'Realizada',
      date: '2026-06-10',
      done: true,
    },
  ];

  const sectionTabs: { id: ProfileSectionTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dados_pessoais',
      label: 'Dados Pessoais',
      icon: <User className="w-3.5 h-3.5" />,
    },
    {
      id: 'documentos',
      label: 'Documentos & Exames',
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      id: 'preferencias',
      label: 'Preferências',
      icon: <Sliders className="w-3.5 h-3.5" />,
    },
    {
      id: 'notificacoes',
      label: 'Notificações',
      icon: <Bell className="w-3.5 h-3.5" />,
    },
    {
      id: 'acessibilidade',
      label: 'Acessibilidade',
      icon: <Eye className="w-3.5 h-3.5" />,
    },
    {
      id: 'privacidade_sair',
      label: 'Privacidade, Segurança & Sair',
      icon: <Shield className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8D253D] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#B89243]" />
            {isWomanMode
              ? 'Carteira de Saúde da Mulher'
              : 'Carteira Digital da Gestante'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
            Meu Perfil & Prontuário Vittacare
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Navegue pelas abas abaixo para gerenciar dados pessoais, documentos, acessibilidade, privacidade e sessão.
          </p>
        </div>

        {/* Edit Profile & Prominent Logout Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar Dados</span>
          </button>
          <button
            type="button"
            onClick={handleFullLogout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8] text-[#8D253D] hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Encerrar sessão e voltar à tela de login"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>

      {/* Section 22: Segmented Navigation separating Profile domains */}
      <div
        role="tablist"
        aria-label="Seções do Perfil"
        className="flex items-center gap-1.5 p-1.5 bg-[#FAF6ED] rounded-2xl border border-[#E6D4AF] overflow-x-auto no-scrollbar"
      >
        {sectionTabs.map((tab) => {
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#5D1425] text-white shadow-xs'
                  : 'text-stone-700 hover:text-[#5D1425] hover:bg-white/70'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          ABA 1: DADOS PESSOAIS & CARTÃO CLÍNICO
         ===================================================================== */}
      {activeSection === 'dados_pessoais' && (
        <div className="space-y-6 animate-fadeIn">
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
                    {personAge} anos ·{' '}
                    {isWomanMode
                      ? 'Paciente Ginecológica'
                      : `Gestante (${currentWeek}ª semana)`}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-stone-600">
                    {isWomanMode ? (
                      <>
                        <span>
                          Ciclo: <strong>{patient?.cycleDurationDays || 28} dias</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Fluxo: <strong>{patient?.periodDurationDays || 5} dias</strong>
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          Tipo Sanguíneo:{' '}
                          <strong className="text-[#8D253D]">
                            {patient?.bloodType || 'O+'}
                          </strong>
                        </span>
                        <span>·</span>
                        <span>
                          DPP: <strong>{patient?.dueDate || 'A calcular'}</strong>
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
                    <span className="text-xs text-stone-500 block">
                      Autocuidado Preventivo
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                      Bebê a Caminho
                    </span>
                    <span className="font-serif font-bold text-xl text-[#5D1425]">
                      {babyName}
                    </span>
                    <span className="text-xs text-stone-500 block">
                      {babyGenderLabel} · {trimester}º Trimestre
                    </span>
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
                  {patient?.doctorName ||
                    (isWomanMode ? 'Dra. Bianca' : 'Dr. Marcelo & Dra. Letícia')}
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

          {/* Vaccination Summary */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E6D4AF]/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#480D1B]">
                  Imunização Recomendada
                </h3>
                <p className="text-xs text-stone-500">
                  Esquema vacinal atualizado com a sala de imunização Vittacare.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#3B744C]">
                3 de 4 aplicadas
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
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#3B744C]">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Aplicada
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#B89243]">
                      {v.date.split('-').reverse().join('/')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          ABA 2: DOCUMENTOS, EXAMES, RECEITAS & ATESTADOS (Seção 13)
         ===================================================================== */}
      {activeSection === 'documentos' && (
        <div className="animate-fadeIn">
          <PatientDocumentsPanel />
        </div>
      )}

      {/* =====================================================================
          ABA 3: PREFERÊNCIAS, INSTALAÇÃO NO CELULAR & REDE DE APOIO
         ===================================================================== */}
      {activeSection === 'preferencias' && (
        <div className="space-y-6 animate-fadeIn">
          {/* PWA Mobile Installation Card */}
          <section className="bg-gradient-to-br from-[#FAF0F2] to-white rounded-3xl p-6 sm:p-7 border border-[#EBBEC8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8D253D] block">
                Acesso no Celular (PWA)
              </span>
              <h3 className="font-serif font-bold text-lg text-[#480D1B] mt-0.5">
                Instalar o Vittaconect na Tela Inicial
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-lg">
                Abra direto pelo ícone como um aplicativo nativo no Android ou iPhone.
              </p>
            </div>

            {onOpenInstall && (
              <button
                type="button"
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
                Permita que o acompanhante ou familiar veja datas de ultrassom e orientações autorizadas por você.
              </p>
            </div>

            {onOpenShare && (
              <button
                type="button"
                onClick={onOpenShare}
                className="px-5 py-2.5 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8] hover:bg-[#F5DFE4] text-[#5D1425] text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
              >
                Gerenciar Acessos
              </button>
            )}
          </section>
        </div>
      )}

      {/* =====================================================================
          ABA 4: NOTIFICAÇÕES & ALERTAS (Seção 22 e 23)
         ===================================================================== */}
      {activeSection === 'notificacoes' && (
        <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E6D4AF] shadow-xs space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8D253D] block">
                Central de Avisos
              </span>
              <h3 className="font-serif font-bold text-lg text-[#480D1B] mt-0.5">
                Preferências de Notificações Inteligentes
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Escolha quais alertas de consulta, mensagem, lembrete e atualização deseja receber.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsNotificationsOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#5D1425] text-white text-xs font-bold cursor-pointer self-start sm:self-auto"
            >
              Abrir Caixa de Notificações
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              {
                label: 'Lembretes de Consultas & Exames',
                desc: 'Avisos 24h e 2h antes do atendimento',
                checked: notifyConsultations,
                onChange: setNotifyConsultations,
              },
              {
                label: 'Horários de Vitaminas & Medicações',
                desc: 'Alertas diários de suplementação prescrita',
                checked: notifyMedications,
                onChange: setNotifyMedications,
              },
              {
                label: 'Mensagens da Equipe de Enfermagem',
                desc: 'Notificar novas respostas no chat 1:1',
                checked: notifyChat,
                onChange: setNotifyChat,
              },
              {
                label: 'Check-in Diário & Meta de Hidratação',
                desc: 'Lembretes gentis de água e bem-estar',
                checked: notifyHydration,
                onChange: setNotifyHydration,
              },
            ].map((item, i) => (
              <label
                key={i}
                className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E6D4AF]/80 flex items-center justify-between gap-3 cursor-pointer"
              >
                <div>
                  <strong className="text-[#480D1B] block">{item.label}</strong>
                  <span className="text-[11px] text-stone-500">{item.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => {
                    item.onChange(e.target.checked);
                    showToast({
                      title: 'Preferência de Notificação Salva',
                      description: `${item.label}: ${
                        e.target.checked ? 'Ativado' : 'Pausado'
                      }`,
                      tone: 'info',
                    });
                  }}
                  className="w-4 h-4 accent-[#5D1425] rounded cursor-pointer"
                />
              </label>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          ABA 5: ACESSIBILIDADE & CONFORTO VISUAL (Seção 22 e 24)
         ===================================================================== */}
      {activeSection === 'acessibilidade' && (
        <section className="bg-gradient-to-br from-[#FAF6ED] via-white to-[#FAF0F2] rounded-3xl p-6 sm:p-7 border border-[#E6D4AF] shadow-xs space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6D4AF]/50">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9B7731] block">
                Personalização & Conforto Visual
              </span>
              <h3 className="font-serif font-bold text-lg text-[#480D1B] mt-0.5">
                Tamanho das Letras, Contraste & Tema
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Adapte a leitura do aplicativo para o tamanho mais confortável aos seus olhos.
              </p>
            </div>

            {onOpenCustomization && (
              <button
                type="button"
                onClick={onOpenCustomization}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#DEC68E] text-[#480D1B] hover:bg-[#FAF6ED] text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Sliders className="w-3.5 h-3.5 text-[#B89243]" />
                <span>Painel Completo de Tema</span>
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
                  Pressione para ajustar as letras instantaneamente:
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
              {(
                [
                  { id: 'sm' as FontSizeOption, label: 'P', title: 'Pequeno (90%)' },
                  {
                    id: 'base' as FontSizeOption,
                    label: 'M (Normal)',
                    title: 'Padrão (100%)',
                  },
                  { id: 'lg' as FontSizeOption, label: 'G', title: 'Médio (115%)' },
                  { id: 'xl' as FontSizeOption, label: 'GG', title: 'Grande (130%)' },
                  {
                    id: '2xl' as FontSizeOption,
                    label: 'XG',
                    title: 'Extra Grande (150%)',
                  },
                ]
              ).map((opt) => {
                const isSelected = settings.fontSize === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
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

          {/* Quick Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="p-3.5 rounded-2xl bg-white border border-[#E6D4AF]/70 flex items-center justify-between cursor-pointer hover:bg-[#FAF6ED]/30 transition-colors">
              <div className="flex items-center gap-2.5">
                <Contrast className="w-4 h-4 text-[#8D253D]" />
                <div>
                  <span className="text-xs font-bold text-[#480D1B] block">
                    Alto Contraste
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Mais nitidez para leitura
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
      )}

      {/* =====================================================================
          ABA 6: PRIVACIDADE, SEGURANÇA & SAIR (Seção 22 e 27)
         ===================================================================== */}
      {activeSection === 'privacidade_sair' && (
        <div className="space-y-6 animate-fadeIn">
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E6D4AF]/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8D253D] block">
                  Segurança & Proteção de Dados de Saúde (LGPD)
                </span>
                <h3 className="font-serif font-bold text-lg text-[#480D1B] mt-0.5">
                  Privacidade, Consentimento & Portabilidade
                </h3>
                <p className="text-xs text-stone-600 mt-0.5 max-w-xl">
                  Seus dados clínicos são isolados por controle de acesso (RBAC) e acessíveis apenas por você e pela equipe de saúde autorizada da Clínica Vittacare.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportLGPDData}
                className="px-4 py-2.5 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold transition-all cursor-pointer self-start sm:self-auto shrink-0"
              >
                Exportar Meus Dados (JSON)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-stone-500 block text-[11px]">
                  Termo LGPD & Privacidade
                </span>
                <strong className="text-emerald-700 font-semibold block mt-0.5">
                  ✓ Consentimento Ativo
                </strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-stone-500 block text-[11px]">
                  Aviso de Uso Educativo/Clínico
                </span>
                <strong className="text-emerald-700 font-semibold block mt-0.5">
                  ✓ Ciente e Validado
                </strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-stone-500 block text-[11px]">
                  Isolamento de Prontuário
                </span>
                <strong className="text-[#480D1B] font-semibold block mt-0.5">
                  Criptografia & Regras Firestore v2
                </strong>
              </div>
            </div>
          </section>

          {/* Dedicated Logout / Session Termination Card */}
          <section className="bg-rose-50/70 rounded-3xl p-6 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-rose-950">
                Encerrar Sessão / Trocar de Conta
              </h3>
              <p className="text-xs text-rose-800 mt-0.5">
                Saia com segurança da sua conta ou alterne entre o perfil de Paciente e o portal Vittaprofessio.
              </p>
            </div>
            <button
              type="button"
              onClick={handleFullLogout}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da Minha Conta Agora</span>
            </button>
          </section>
        </div>
      )}

      {/* Clinic Contact & Direct Channels Footer */}
      <section className="bg-[#FAF6ED] rounded-3xl p-6 sm:p-7 border border-[#E6D4AF] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6D4AF]/60">
          <div>
            <VittacareLogo size="sm" />
            <p className="text-xs text-stone-600 mt-2">{CLINIC_INFO.address}</p>
            <p className="text-xs text-stone-500 mt-0.5">{CLINIC_INFO.unitHours}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
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
