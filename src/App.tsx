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

      {/* Main Workspace: Desktop Left Sidebar (Section 7) + Content Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex z-10">
        <DesktopSidebarNav
          activeTab={currentTab}
          onSelectTab={handleSelectTab}
          onOpenNurseChat={() => setIsChatOpen(true)}
          onOpenTelehealth={() => handleStartTelehealth('apt-2')}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-24 lg:pb-12">
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

      {/* Consolidated 5-Tab Bottom Navigation */}
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
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 bg-gradient-to-r from-[#FAFCFE] via-[#F0F6FA] to-[#E2EEF5] text-[#0B192C] p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-[#0B192C] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        title="Falar em tempo real com a Equipe de Enfermagem (Letícia, Marcelo, Bianca, Stephanie)"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-[#1E3E62]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0B192C] animate-pulse" />
        </div>
        <span className="hidden sm:inline text-xs font-bold tracking-wide text-[#0B192C]">
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
