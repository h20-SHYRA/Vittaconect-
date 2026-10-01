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
import { CustomizationProvider } from './context/CustomizationContext';
import { PatientProvider, usePatient } from './context/PatientContext';
import { NavTab } from './types';
import { CLINIC_INFO } from './data/mockData';

function AppContent() {
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

  // If no mother or woman is registered yet, show the friendly Onboarding / Login screen
  if (!isLoggedIn || !patient) {
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
          professionalName="Enf. Carla Soares"
          role="Enfermeira Especialista em Saúde Materna"
        />
      )}

      {/* Emergency SOS Modal */}
      {isSOSOpen && <SOSModal onClose={() => setIsSOSOpen(false)} />}

      {/* Install Mobile PWA App Modal */}
      {isInstallOpen && <InstallAppModal onClose={() => setIsInstallOpen(false)} />}

      {/* Share Access & Support Network Modal */}
      {isShareOpen && <ShareAccessModal onClose={() => setIsShareOpen(false)} />}

      {/* Personalization & Font Size Customization Modal */}
      {isCustomizationOpen && <CustomizationModal onClose={() => setIsCustomizationOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <PatientProvider>
      <CustomizationProvider>
        <AppContent />
      </CustomizationProvider>
    </PatientProvider>
  );
}
