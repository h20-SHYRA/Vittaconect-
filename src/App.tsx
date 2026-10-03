import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { EducationView } from './components/EducationView';
import { SymptomsView } from './components/SymptomsView';
import { RemindersView } from './components/RemindersView';
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
import { NursingCrest } from './components/NursingCrest';
import { MessageSquare } from 'lucide-react';
import { CustomizationProvider } from './context/CustomizationContext';
import { PatientProvider, usePatient } from './context/PatientContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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
  const [activeTelehealthId, setActiveTelehealthId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // If userMode switches, ensure tab is synchronized
  React.useEffect(() => {
    if (isWomanMode) {
      if (currentTab === 'home' || currentTab === 'prenatal_card' || currentTab === 'community' || currentTab === 'symptoms') {
        setCurrentTab('woman_home');
      }
    } else {
      if (currentTab === 'woman_home' || currentTab === 'cycle_tracker' || currentTab === 'preventive_screening' || currentTab === 'woman_education') {
        setCurrentTab('home');
      }
    }
  }, [isWomanMode]);

  // Loading state with gentle spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#5D1425] flex items-center justify-center shadow-lg animate-pulse mb-4">
          <span className="text-2xl text-white font-serif font-bold">V</span>
        </div>
        <h3 className="font-serif font-bold text-xl text-[#480D1B]">Vittaconect & Vittaprofessio</h3>
        <p className="text-xs text-stone-500 mt-1">Carregando autenticação segura...</p>
      </div>
    );
  }

  // REDIRECT 1: If role is 'profissional', strictly show the exclusive Vittaprofessio panel
  if (userRole === 'profissional') {
    return <VittaprofessioDashboard />;
  }

  // REDIRECT 2: If role is 'paciente' or logged in with a patient profile, show the Vittaconect patient app
  if (userRole === 'paciente' || (isLoggedIn && patient)) {
    // Falls through to the patient application JSX below
  } else {
    // If not logged in or profile not yet chosen, show the registration and login screen
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
        onSelectTab={setCurrentTab}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenInstall={() => setIsInstallOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenCustomization={() => setIsCustomizationOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-5 pb-24 md:pb-12 z-10">
        {/* ==================================================== */}
        {/* TABS DO MODO SAÚDE FEMININA (NÃO GESTANTE)          */}
        {/* ==================================================== */}
        {isWomanMode && (
          <>
            {currentTab === 'woman_home' && (
              <WomanDashboardView
                onNavigate={setCurrentTab}
                onOpenSOS={() => setIsSOSOpen(true)}
              />
            )}

            {currentTab === 'cycle_tracker' && <CycleTrackerView />}

            {currentTab === 'preventive_screening' && <PreventiveScreeningView />}

            {currentTab === 'woman_education' && <WomanEducationView />}
          </>
        )}

        {/* ==================================================== */}
        {/* TABS DO MODO GESTANTE (PRÉ-NATAL MATERNO)           */}
        {/* ==================================================== */}
        {!isWomanMode && (
          <>
            {currentTab === 'home' && (
              <DashboardView
                onNavigate={setCurrentTab}
                onStartTelehealth={handleStartTelehealth}
                onOpenShare={() => setIsShareOpen(true)}
              />
            )}

            {currentTab === 'prenatal_card' && <PrenatalCardView />}

            {currentTab === 'community' && <CommunityForumView />}

            {currentTab === 'symptoms' && <SymptomsView />}

            {currentTab === 'education' && <EducationView />}
          </>
        )}

        {/* ==================================================== */}
        {/* TABS COMPARTILHADAS (MURAL, AGENDA, LEMBRETES, PERFIL)*/}
        {/* ==================================================== */}
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

      {/* Footer for Desktop */}
      <footer className="hidden md:block py-6 border-t border-[#E6D4AF]/40 text-center text-xs text-stone-500 z-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-serif italic text-stone-600">
            "{CLINIC_INFO.slogan}"
          </p>
          <p className="text-[11px] text-stone-400">
            © {new Date().getFullYear()} Clínica Vittacare. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Fixed Bottom Navigation (Mobile & Tablet) */}
      <BottomNav activeTab={currentTab} onChangeTab={setCurrentTab} />

      {/* Teleconsultation Live Virtual Room Modal */}
      {activeTelehealthId && (
        <TeleconsultationModal
          onClose={handleCloseTelehealth}
          professionalName="Enfª. Stephanie"
          role="Enfermeira Especialista em Saúde Materna"
        />
      )}

      {/* Emergency SOS Modal */}
      {isSOSOpen && <SOSModal onClose={() => setIsSOSOpen(false)} />}

      {/* Install Mobile PWA App Modal */}
      {isInstallOpen && <InstallAppModal onClose={() => setIsInstallOpen(false)} />}

      {/* Share Access & Support Network Modal */}
      {isShareOpen && <ShareAccessModal onClose={() => setIsShareOpen(false)} />}

      {/* Floating Action Button: Chat ao Vivo com os Enfermeiros (Pearl Light Blue with Dark Metallic Blue Border) */}
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
      {isCustomizationOpen && <CustomizationModal onClose={() => setIsCustomizationOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PatientProvider>
        <CustomizationProvider>
          <AppContent />
        </CustomizationProvider>
      </PatientProvider>
    </AuthProvider>
  );
}
