import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav, DesktopSidebarNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { EducationView } from './components/EducationView';
import { SymptomsView } from './components/SymptomsView';
import { RemindersView } from './components/RemindersView';
import { DocumentsView } from './components/DocumentsView';
import { ProfileView } from './components/ProfileView';
import { PrenatalCardView } from './components/PrenatalCardView';
import { CommunityForumView } from './components/CommunityForumView';
import { ClinicNewsView } from './components/ClinicNewsView';
import { WomanDashboardView } from './components/WomanDashboardView';
import { CycleTrackerView } from './components/CycleTrackerView';
import { PreventiveScreeningView } from './components/PreventiveScreeningView';
import { WomanEducationView } from './components/WomanEducationView';
import { TeleconsultationModal } from './components/TeleconsultationModal';
import { SOSModal } from './components/SOSModal';
import { InstallAppModal } from './components/InstallAppModal';
import { ShareAccessModal } from './components/ShareAccessModal';
import { CustomizationModal } from './components/CustomizationModal';
import { PatientLoginView } from './components/PatientLoginView';
import { VittaprofessioDashboard } from './components/VittaprofessioDashboard';
import { PatientNurseChatDrawer } from './components/PatientNurseChatDrawer';
import { GlobalSearchModal } from './components/feedback/GlobalSearchModal';
import { NotificationsDrawer } from './components/feedback/NotificationsDrawer';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';
import { MessageSquare } from 'lucide-react';
import { CustomizationProvider } from './context/CustomizationContext';
import { PatientProvider, usePatient } from './context/PatientContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FeedbackProvider } from './context/FeedbackContext';
import { NavTab } from './types';
import { CLINIC_INFO } from './data/mockData';

function AppContent() {
  const { userRole, loading: authLoading } = useAuth();
  const { patient, isLoggedIn } = usePatient();
  const isWomanMode = patient?.userMode === 'saude_feminina';

  const [currentTab, setCurrentTab] = useState<NavTab>(() => {
    return isWomanMode ? 'woman_home' : 'home';
  });

  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isInstallOpen, setIsInstallOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState<boolean>(false);
  const [activeTelehealthId, setActiveTelehealthId] = useState<string | null>(
    null
  );
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Normalize tab names across modules
  const handleSelectTab = (tab: NavTab) => {
    if (tab === 'dashboard') {
      setCurrentTab(isWomanMode ? 'woman_home' : 'home');
      return;
    }
    if (tab === 'CycleTracker') {
      setCurrentTab('cycle_tracker');
      return;
    }
    if (tab === 'PreventiveScreening') {
      setCurrentTab('preventive_screening');
      return;
    }
    setCurrentTab(tab);
  };

  // Synchronize default home tab when userMode switches
  React.useEffect(() => {
    if (isWomanMode) {
      if (
        currentTab === 'home' ||
        currentTab === 'dashboard' ||
        currentTab === 'prenatal_card'
      ) {
        setCurrentTab('woman_home');
      }
    } else {
      if (
        currentTab === 'woman_home' ||
        currentTab === 'cycle_tracker' ||
        currentTab === 'CycleTracker' ||
        currentTab === 'preventive_screening' ||
        currentTab === 'PreventiveScreening' ||
        currentTab === 'woman_education'
      ) {
        setCurrentTab('home');
      }
    }
  }, [isWomanMode]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#5D1425] flex items-center justify-center shadow-lg animate-pulse mb-4">
          <span className="text-2xl text-white font-serif font-bold">V</span>
        </div>
        <h3 className="font-serif font-bold text-xl text-[#480D1B]">
          Vittaconect 2.0 & Vittaprofessio
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Verificando sessão criptografada e permissões de acesso...
        </p>
      </div>
    );
  }

  // REDIRECT 1: If role is 'profissional' or 'administrador', show the exclusive Vittaprofessio panel
  if (userRole === 'profissional' || userRole === 'administrador') {
    return (
      <>
        <VittaprofessioDashboard />
        <GlobalSearchModal />
        <NotificationsDrawer />
      </>
    );
  }

  // REDIRECT 2: If not logged in or profile not yet chosen, show the registration and login screen
  if (!patient || !(userRole === 'paciente' || isLoggedIn)) {
    return <PatientLoginView />;
  }

  const handleStartTelehealth = (appointmentId: string) => {
    setActiveTelehealthId(appointmentId);
  };

  const handleCloseTelehealth = () => {
    setActiveTelehealthId(null);
  };

  const isHomeTab =
    currentTab === 'home' ||
    currentTab === 'woman_home' ||
    currentTab === 'dashboard';

  const internalTabMeta: Record<
    string,
    { category: string; title: string; subtitle: string }
  > = {
    prenatal_card: {
      category: 'Acompanhamento Gestacional',
      title: 'Cartão Pré-Natal Digital',
      subtitle: 'Histórico obstétrico, consultas, exames, vacinas e plano de parto',
    },
    cycle_tracker: {
      category: 'Saúde Integral da Mulher',
      title: 'Calendário do Ciclo & Ovulação',
      subtitle: 'Registro de fluxo menstrual, janela fértil estimada, sintomas e humor',
    },
    preventive_screening: {
      category: 'Medicina Preventiva',
      title: 'Carteira Preventiva & Rastreio',
      subtitle: 'Acompanhamento de Papanicolaou, mamografia, ultrassom e sorologias',
    },
    calendar: {
      category: 'Agenda Clínica',
      title: 'Agenda de Consultas & Exames',
      subtitle: 'Visualize compromissos por período, confirme presença ou acesse teleconsultas',
    },
    documents: {
      category: 'Prontuário da Paciente',
      title: 'Central de Documentos, Exames & Receitas',
      subtitle: 'Pedidos médicos, prescrições, atestados, termos e laudos laboratoriais',
    },
    symptoms: {
      category: 'Monitoramento Diário',
      title: 'Diário Clínico de Sintomas & Sinais',
      subtitle: 'Registre sinais vitais, intensidade de sintomas e movimentação fetal',
    },
    reminders: {
      category: 'Rotina & Autocuidado',
      title: 'Lembretes & Orientações da Equipe',
      subtitle: 'Suplementos, medicações, preparo de exames e cuidados pós-consulta',
    },
    education: {
      category: 'Educação em Saúde',
      title: 'Biblioteca de Educação Materno-Infantil',
      subtitle: 'Guias clínicos por trimestre, amamentação, nutrição e preparo para o parto',
    },
    woman_education: {
      category: 'Educação em Saúde Feminina',
      title: 'Guias de Saúde da Mulher & Bem-Estar',
      subtitle: 'Artigos educativos sobre prevenção, ciclo hormonal, fertilidade e autocuidado',
    },
    community: {
      category: 'Rede de Acolhimento',
      title: 'Comunidade Moderada Vittacare',
      subtitle: 'Espaço seguro de troca entre pacientes com moderação da equipe de enfermagem',
    },
    news: {
      category: 'Comunicação Institucional',
      title: 'Mural & Novidades da Clínica Vittacare',
      subtitle: 'Cursos presenciais, oficinas de gestantes, comunicados e atualizações',
    },
    profile: {
      category: 'Conta & Privacidade',
      title: 'Meu Perfil, Acessibilidade & LGPD',
      subtitle: 'Gerencie seus dados pessoais, preferências visuais, notificações e privacidade',
    },
  };

  const activeInternalMeta = internalTabMeta[currentTab];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2123] flex flex-col font-sans selection:bg-[#E6D4AF] selection:text-[#5D1425] relative transition-colors duration-200">
      {/* Subtle Luxury Botanical Leaf Background Watermark */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-0"
        style={{
          backgroundImage: `radial-gradient(#B89243 1px, transparent 1px), radial-gradient(#5D1425 1px, #FDFBF7 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      {/* Top App Header */}
      <Header
        activeTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenTelehealth={() => handleStartTelehealth('apt-2')}
        onOpenInstall={() => setIsInstallOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenCustomization={() => setIsCustomizationOpen(true)}
        onOpenProfile={() => handleSelectTab('profile')}
        onOpenNurseChat={() => setIsChatOpen(true)}
      />

      {/* Main Workspace: Desktop Left Sidebar (Section 4 & 7) + Content Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex z-10">
        <DesktopSidebarNav
          activeTab={currentTab}
          onSelectTab={handleSelectTab}
          onOpenNurseChat={() => setIsChatOpen(true)}
          onOpenTelehealth={() => handleStartTelehealth('apt-2')}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-28 lg:pb-14">
          {/* Standardized Internal Screen Navigation & Context Bar (Section 6) */}
          {!isHomeTab && activeInternalMeta && (
            <div className="mb-5 p-3.5 sm:px-5 sm:py-3.5 rounded-2xl bg-white border border-[#E6D4AF]/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectTab(isWomanMode ? 'woman_home' : 'home')
                  }
                  className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#FAF0F2] hover:bg-[#F5DADF] text-[#5D1425] border border-[#EBBEC8] text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <span>← Início</span>
                </button>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D253D] block">
                    {activeInternalMeta.category}
                  </span>
                  <span className="text-xs sm:text-sm font-serif font-bold text-[#480D1B] truncate block">
                    {activeInternalMeta.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#FAF6ED] hover:bg-[#F3EBD8] text-[#480D1B] border border-[#E6D4AF] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#8D253D]" />
                  <span className="hidden sm:inline">Dúvidas com Enfermagem</span>
                  <span className="sm:hidden">Chat</span>
                </button>
              </div>
            </div>
          )}

          {/* TABS DO MODO SAÚDE FEMININA (NÃO GESTANTE) */}
          {isWomanMode && (
            <>
              {(currentTab === 'woman_home' || currentTab === 'dashboard') && (
                <WomanDashboardView
                  onNavigate={handleSelectTab}
                  onOpenSOS={() => setIsSOSOpen(true)}
                  onOpenNurseChat={() => setIsChatOpen(true)}
                />
              )}

              {(currentTab === 'cycle_tracker' || currentTab === 'CycleTracker') && (
                <CycleTrackerView />
              )}

              {(currentTab === 'preventive_screening' ||
                currentTab === 'PreventiveScreening') && <PreventiveScreeningView />}

              {currentTab === 'woman_education' && <WomanEducationView />}
            </>
          )}

          {/* TABS DO MODO GESTANTE (PRÉ-NATAL MATERNO) */}
          {!isWomanMode && (
            <>
              {(currentTab === 'home' || currentTab === 'dashboard') && (
                <DashboardView
                  onNavigate={handleSelectTab}
                  onStartTelehealth={handleStartTelehealth}
                  onOpenShare={() => setIsShareOpen(true)}
                  onOpenNurseChat={() => setIsChatOpen(true)}
                  onOpenSOS={() => setIsSOSOpen(true)}
                />
              )}

              {currentTab === 'prenatal_card' && <PrenatalCardView />}

              {currentTab === 'education' && <EducationView />}
            </>
          )}

          {/* TABS COMPARTILHADAS */}
          {currentTab === 'documents' && <DocumentsView />}

          {currentTab === 'community' && <CommunityForumView />}

          {currentTab === 'symptoms' && <SymptomsView />}

          {currentTab === 'news' && <ClinicNewsView />}

          {currentTab === 'calendar' && (
            <CalendarView onStartTelehealth={handleStartTelehealth} />
          )}

          {currentTab === 'reminders' && <RemindersView />}

          {currentTab === 'profile' && (
            <ProfileView
              onOpenSOS={() => setIsSOSOpen(true)}
              onOpenInstall={() => setIsInstallOpen(true)}
              onOpenShare={() => setIsShareOpen(true)}
              onOpenCustomization={() => setIsCustomizationOpen(true)}
            />
          )}

          {/* Standardized Internal Screen Return Footer (Section 6) */}
          {!isHomeTab && (
            <div className="mt-8 pt-5 border-t border-[#E6D4AF]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  handleSelectTab(isWomanMode ? 'woman_home' : 'home')
                }
                className="w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl bg-white hover:bg-[#FAF0F2] text-[#5D1425] border border-[#E6D4AF] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>← Voltar para o Painel Principal</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <button
                  type="button"
                  onClick={() => handleSelectTab('calendar')}
                  className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[#FAF6ED] hover:bg-[#F3EBD8] text-[#480D1B] border border-[#E6D4AF] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Ver Agenda
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTab('documents')}
                  className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[#FAF6ED] hover:bg-[#F3EBD8] text-[#480D1B] border border-[#E6D4AF] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Meus Documentos
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer for Desktop */}
      <footer className="hidden md:block py-6 border-t border-[#E6D4AF]/40 text-center text-xs text-stone-500 z-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-serif italic text-stone-600">
            "{CLINIC_INFO.slogan}"
          </p>
          <p className="text-[11px] text-stone-400">
            © {new Date().getFullYear()} Clínica Vittacare • Vittaconect 2.0. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Consolidated Bottom Navigation */}
      <BottomNav activeTab={currentTab} onChangeTab={handleSelectTab} />

      {/* Global Search & Smart Notifications Drawers */}
      <GlobalSearchModal
        onNavigatePatientTab={handleSelectTab}
        onOpenChat={() => setIsChatOpen(true)}
      />
      <NotificationsDrawer onNavigateTab={handleSelectTab} />

      {/* Teleconsultation Room Modal */}
      {activeTelehealthId && (
        <TeleconsultationModal
          isOpen={true}
          onClose={handleCloseTelehealth}
          professionalName="Enfª. Stephanie"
          role="Enfermeira Especialista em Saúde Materna"
        />
      )}

      {/* Emergency SOS Modal */}
      {isSOSOpen && <SOSModal onClose={() => setIsSOSOpen(false)} />}

      {/* Install Mobile PWA App Modal */}
      {isInstallOpen && (
        <InstallAppModal onClose={() => setIsInstallOpen(false)} />
      )}

      {/* Share Access & Support Network Modal */}
      {isShareOpen && <ShareAccessModal onClose={() => setIsShareOpen(false)} />}

      {/* Floating Action Button: Chat ao Vivo com os Enfermeiros */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 bg-[#5D1425] hover:bg-[#480D1B] text-[#E6D4AF] p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl flex items-center gap-2 border border-[#B89243] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        title="Falar em tempo real com a Equipe de Enfermagem (Letícia, Marcelo, Bianca, Stephanie)"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-[#E6D4AF]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#5D1425] animate-pulse" />
        </div>
        <span className="hidden sm:inline text-xs font-bold tracking-wide text-white">
          Plantão Enfermagem
        </span>
      </button>

      {/* Real-time Patient-Nurse Chat Drawer */}
      <PatientNurseChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenTelehealth={() => handleStartTelehealth('apt-2')}
      />

      {/* Personalization & Font Size Customization Modal */}
      {isCustomizationOpen && (
        <CustomizationModal onClose={() => setIsCustomizationOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PatientProvider>
          <CustomizationProvider>
            <FeedbackProvider>
              <AppContent />
            </FeedbackProvider>
          </CustomizationProvider>
        </PatientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
