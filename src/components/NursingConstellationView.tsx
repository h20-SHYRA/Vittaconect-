import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Activity, 
  ClipboardList, 
  UserCheck, 
  Video, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  AlertTriangle, 
  Heart, 
  ShieldCheck, 
  Thermometer, 
  Send, 
  Copy, 
  ExternalLink,
  Info
} from 'lucide-react';
import { NursingCrest } from './NursingCrest';
import { useAuth } from '../context/AuthContext';
import { useRealtimeChat } from '../services/realtimeChat';

type ConstellationNode = 'prontuario' | 'evolucao' | 'escalas' | 'anamnese' | 'meet' | null;
type ScaleType = 'braden' | 'morse' | 'meows' | 'eva';

export const NursingConstellationView: React.FC = () => {
  const { professionalProfile } = useAuth();
  const { sendMessage: sendRealtimeMessage } = useRealtimeChat();
  const [activeModal, setActiveModal] = useState<ConstellationNode>(null);

  // Selected patient for digital actions
  const [selectedPatient, setSelectedPatient] = useState('Mariana Silva Santos (18ª Sem - Gestante)');

  // Digital Evolution (SOAP) form states
  const [soapS, setSoapS] = useState('Paciente relata melhora das náuseas matinais após fracionamento da dieta. Sem queixas de cefaleia ou sangramento.');
  const [soapO, setSoapO] = useState('PA: 110x70 mmHg | FC: 78 bpm | AU: 17 cm | BCF: 144 bpm rítmico | Sem edemas em MMII.');
  const [soapA, setSoapA] = useState('Gestação tópica de 18 semanas de evolução fisiológica satisfatória.');
  const [soapP, setSoapP] = useState('Manter suplementação com polivitamínico e ferro. Orientado hidratação e repouso. Retorno em 4 semanas.');
  const [evolutionSaved, setEvolutionSaved] = useState(false);

  // Digital Anamnesis states
  const [anamneseGpa, setAnamneseGpa] = useState('G1 P0 A0 (Primigesta)');
  const [anamneseAllergies, setAnamneseAllergies] = useState('Dipirona (leve prurido cutâneo)');
  const [anamneseQueixa, setAnamneseQueixa] = useState('Consulta de rotina de pré-natal de baixo risco.');
  const [anamneseSaved, setAnamneseSaved] = useState(false);

  // Digital Nursing Scales states
  const [activeScale, setActiveScale] = useState<ScaleType>('braden');
  const [bradenSensory, setBradenSensory] = useState(4);
  const [bradenMoisture, setBradenMoisture] = useState(4);
  const [bradenActivity, setBradenActivity] = useState(3);
  const [bradenMobility, setBradenMobility] = useState(4);
  const [bradenNutrition, setBradenNutrition] = useState(3);
  const [bradenFriction, setBradenFriction] = useState(3);

  const [morseFalls, setMorseFalls] = useState(0);
  const [morseSecondary, setMorseSecondary] = useState(0);
  const [morseAmbulation, setMorseAmbulation] = useState(0);
  const [morseIV, setMorseIV] = useState(0);
  const [morseGait, setMorseGait] = useState(0);
  const [morseMental, setMorseMental] = useState(0);

  const [evaPainScore, setEvaPainScore] = useState(1);
  const [scaleSaved, setScaleSaved] = useState(false);

  // Google Meet states
  const [meetLink] = useState('https://meet.google.com/vit-care-obst');
  const [copiedLink, setCopiedLink] = useState(false);
  const [meetSharedChat, setMeetSharedChat] = useState(false);

  // Calculate Braden Score
  const bradenScore = bradenSensory + bradenMoisture + bradenActivity + bradenMobility + bradenNutrition + bradenFriction;
  const getBradenRisk = (score: number) => {
    if (score >= 19) return { label: 'Sem Risco / Risco Muito Baixo', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 15) return { label: 'Risco Baixo', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (score >= 13) return { label: 'Risco Moderado', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Alto Risco', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  // Calculate Morse Fall Score
  const morseScore = morseFalls + morseSecondary + morseAmbulation + morseIV + morseGait + morseMental;
  const getMorseRisk = (score: number) => {
    if (score >= 45) return { label: 'Alto Risco de Queda', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    if (score >= 25) return { label: 'Médio Risco de Queda', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Baixo Risco de Queda', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const handleCopyMeetLink = () => {
    navigator.clipboard.writeText(meetLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareMeetToChat = async () => {
    await sendRealtimeMessage(
      `📹 Sala de Videochamada no Google Meet iniciada pelo ${professionalProfile?.displayName || 'Enfermeiro(a)'}: ${meetLink} - Clique para entrar na teleconsulta.`,
      'profissional',
      professionalProfile?.displayName || 'Enf. Marcelo',
      professionalProfile?.uid || 'prof-marcelo'
    );
    setMeetSharedChat(true);
    setTimeout(() => setMeetSharedChat(false), 2500);
  };

  const handleSaveEvolution = () => {
    setEvolutionSaved(true);
    setTimeout(() => {
      setEvolutionSaved(false);
      setActiveModal(null);
    }, 1500);
  };

  const handleSaveAnamnese = () => {
    setAnamneseSaved(true);
    setTimeout(() => {
      setAnamneseSaved(false);
      setActiveModal(null);
    }, 1500);
  };

  const handleSaveScale = () => {
    setScaleSaved(true);
    setTimeout(() => {
      setScaleSaved(false);
      setActiveModal(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner - Soft Pearl Blue with Dark Metallic Blue Accents */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FAFCFE] via-[#F0F6FA] to-[#E2EEF5] border-2 border-[#0B192C]/20 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border-2 border-[#0B192C] text-[#0B192C] text-xs font-bold shadow-2xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#1E3E62]" />
              <span>Mapa Estelar Clínico Vittaprofessio</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B192C] tracking-wide">
              Constelação de Enfermagem Digital
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Toque nos pontos estelares da constelação para abrir o <strong>Prontuário Digital</strong>, registrar a <strong>Evolução do Paciente</strong>, aplicar as <strong>Escalas de Avaliação Clínicas</strong>, preencher a <strong>Anamnese Digital</strong> ou iniciar a teleconsulta com <strong>Google Meet</strong>.
            </p>
          </div>

          {/* Quick Meet Launcher in Top Banner */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('meet')}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#EBF3F8] text-[#0B192C] text-xs font-bold border-2 border-[#0B192C] shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <Video className="w-4 h-4 text-[#1E3E62]" />
              <span>Google Meet ao Vivo</span>
            </button>
          </div>
        </div>
      </div>

      {/* THE CELESTIAL INTERACTIVE CONSTELLATION MAP (Light Pearlescent Sky with Dark Metallic Blue Accents) */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#FAFCFE] via-[#EDF5FA] to-[#DFECF5] border-2 border-[#0B192C] shadow-xl relative overflow-hidden min-h-[480px] sm:min-h-[560px] flex flex-col justify-between">
        {/* Soft pearlescent ambient glows & shimmering points in background */}
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <div className="absolute top-10 left-12 w-2.5 h-2.5 rounded-full bg-[#1E3E62]/40 animate-ping" />
          <div className="absolute top-24 right-20 w-3 h-3 rounded-full bg-[#38BDF8]/60 animate-pulse" />
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-[#B89243]/50 animate-pulse" />
          <div className="absolute bottom-32 right-1/3 w-2.5 h-2.5 rounded-full bg-[#0B192C]/30 animate-ping" />
          <div className="absolute top-1/2 left-10 w-3 h-3 rounded-full bg-[#93C5FD]/60 opacity-70" />
          <div className="absolute top-1/3 right-10 w-2 h-2 rounded-full bg-[#0B192C]/40 opacity-80" />
        </div>

        {/* Constellation Title & Active Coordinates */}
        <div className="flex items-center justify-between text-[#0B192C] relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-white border-2 border-[#0B192C] shadow-2xs">
              <NursingCrest size="sm" variant="gold" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#1E3E62] font-bold block">
                SISTEMA SOLAR CLÍNICO • COORDENADAS COREN
              </span>
              <span className="text-sm font-bold text-[#0B192C]">
                Vittacare Constellation Network
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-full border-2 border-[#0B192C] text-xs text-[#0B192C] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">Paciente Ativa: {selectedPatient.split(' ')[0]} {selectedPatient.split(' ')[1]}</span>
          </div>
        </div>

        {/* SVG Constellation Geometric Connecting Lines in Metallic Blue */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Subtle Outer Glow Line */}
          <line x1="25%" y1="35%" x2="50%" y2="20%" stroke="#0284C7" strokeWidth="3" strokeOpacity="0.2" />
          <line x1="50%" y1="20%" x2="75%" y2="35%" stroke="#0284C7" strokeWidth="3" strokeOpacity="0.2" />
          <line x1="25%" y1="35%" x2="35%" y2="70%" stroke="#0284C7" strokeWidth="3" strokeOpacity="0.2" />
          <line x1="75%" y1="35%" x2="65%" y2="70%" stroke="#0284C7" strokeWidth="3" strokeOpacity="0.2" />
          <line x1="35%" y1="70%" x2="65%" y2="70%" stroke="#0284C7" strokeWidth="3" strokeOpacity="0.2" />
          
          {/* Main Dark Metallic Connecting Lines */}
          <line x1="25%" y1="35%" x2="50%" y2="20%" stroke="#0B192C" strokeWidth="2" strokeDasharray="6 4" strokeOpacity="0.6" />
          <line x1="50%" y1="20%" x2="75%" y2="35%" stroke="#0B192C" strokeWidth="2" strokeDasharray="6 4" strokeOpacity="0.6" />
          <line x1="25%" y1="35%" x2="35%" y2="70%" stroke="#0B192C" strokeWidth="2" strokeDasharray="6 4" strokeOpacity="0.6" />
          <line x1="75%" y1="35%" x2="65%" y2="70%" stroke="#0B192C" strokeWidth="2" strokeDasharray="6 4" strokeOpacity="0.6" />
          <line x1="35%" y1="70%" x2="65%" y2="70%" stroke="#0B192C" strokeWidth="2" strokeDasharray="6 4" strokeOpacity="0.6" />
          <line x1="50%" y1="20%" x2="50%" y2="50%" stroke="#0B192C" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="25%" y1="35%" x2="50%" y2="50%" stroke="#0B192C" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="75%" y1="35%" x2="50%" y2="50%" stroke="#0B192C" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="35%" y1="70%" x2="50%" y2="50%" stroke="#0B192C" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="65%" y1="70%" x2="50%" y2="50%" stroke="#0B192C" strokeWidth="1.5" strokeOpacity="0.4" />
        </svg>

        {/* 5 STELLAR CONSTELLATION INTERACTIVE NODES (Pearl Cards with Dark Metallic Blue Borders) */}
        <div className="relative z-10 w-full h-full my-auto py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* NODE 1: PRONTUÁRIO DIGITAL (Left Upper Star) */}
            <div className="flex flex-col items-center text-center">
              <button
                onClick={() => setActiveModal('prontuario')}
                className="group relative p-4 rounded-3xl bg-white hover:bg-[#FAFCFE] border-2 border-[#0B192C] text-[#0B192C] shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer ring-4 ring-[#0B192C]/10 flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E2EEF5] via-[#F0F6FA] to-white text-[#0B192C] border-2 border-[#0B192C] flex items-center justify-center shadow-xs group-hover:rotate-6 transition-transform">
                  <FileText className="w-7 h-7 text-[#1E3E62]" />
                </div>
                <div className="mt-2.5">
                  <span className="text-[10px] font-mono uppercase text-[#1E3E62] font-bold block">
                    ★ ESTRELA ALPHA
                  </span>
                  <span className="text-sm font-bold text-[#0B192C] block">
                    Prontuário Digital
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    Histórico & Prescrições
                  </span>
                </div>
              </button>
            </div>

            {/* CENTER TOP: ANAMNESE DIGITAL */}
            <div className="flex flex-col items-center text-center -mt-4 md:-mt-8">
              <button
                onClick={() => setActiveModal('anamnese')}
                className="group relative p-4 rounded-3xl bg-white hover:bg-[#FAFCFE] border-2 border-[#0B192C] text-[#0B192C] shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer ring-4 ring-[#0B192C]/10 flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E2EEF5] via-[#F0F6FA] to-white text-[#0B192C] border-2 border-[#0B192C] flex items-center justify-center shadow-xs group-hover:-rotate-6 transition-transform">
                  <UserCheck className="w-7 h-7 text-[#1E3E62]" />
                </div>
                <div className="mt-2.5">
                  <span className="text-[10px] font-mono uppercase text-[#1E3E62] font-bold block">
                    ★ ESTRELA BETA
                  </span>
                  <span className="text-sm font-bold text-[#0B192C] block">
                    Anamnese Digital
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    História Clínica & Exame
                  </span>
                </div>
              </button>
            </div>

            {/* NODE 3: EVOLUÇÃO DO PACIENTE (Right Upper Star) */}
            <div className="flex flex-col items-center text-center">
              <button
                onClick={() => setActiveModal('evolucao')}
                className="group relative p-4 rounded-3xl bg-white hover:bg-[#FAFCFE] border-2 border-[#0B192C] text-[#0B192C] shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer ring-4 ring-[#0B192C]/10 flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E2EEF5] via-[#F0F6FA] to-white text-[#0B192C] border-2 border-[#0B192C] flex items-center justify-center shadow-xs group-hover:rotate-6 transition-transform">
                  <Activity className="w-7 h-7 text-[#1E3E62]" />
                </div>
                <div className="mt-2.5">
                  <span className="text-[10px] font-mono uppercase text-[#1E3E62] font-bold block">
                    ★ ESTRELA GAMMA
                  </span>
                  <span className="text-sm font-bold text-[#0B192C] block">
                    Evolução do Paciente
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    Sistematização SOAP
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* LOWER ROW: ESCALAS CLÍNICAS & GOOGLE MEET HUB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mt-8 max-w-2xl mx-auto">
            {/* NODE 4: ESCALAS CLÍNICAS DE ENFERMAGEM */}
            <div className="flex flex-col items-center text-center">
              <button
                onClick={() => setActiveModal('escalas')}
                className="group w-full relative p-4 rounded-3xl bg-white hover:bg-[#FAFCFE] border-2 border-[#0B192C] text-[#0B192C] shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer ring-4 ring-[#0B192C]/10 flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E2EEF5] via-[#F0F6FA] to-white text-[#0B192C] border-2 border-[#0B192C] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-7 h-7 text-[#1E3E62]" />
                </div>
                <div className="mt-2.5">
                  <span className="text-[10px] font-mono uppercase text-[#1E3E62] font-bold block">
                    ★ ESTRELA DELTA
                  </span>
                  <span className="text-sm font-bold text-[#0B192C] block">
                    Escalas de Avaliação Clínicas
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    Braden • Morse • MEOWS • EVA
                  </span>
                </div>
              </button>
            </div>

            {/* NODE 5: GOOGLE MEET TELECONSULTA */}
            <div className="flex flex-col items-center text-center">
              <button
                onClick={() => setActiveModal('meet')}
                className="group w-full relative p-4 rounded-3xl bg-white hover:bg-[#FAFCFE] border-2 border-[#0B192C] text-[#0B192C] shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer ring-4 ring-[#0B192C]/10 flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E2EEF5] via-[#F0F6FA] to-white text-[#0B192C] border-2 border-[#0B192C] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <Video className="w-7 h-7 text-[#1E3E62]" />
                </div>
                <div className="mt-2.5">
                  <span className="text-[10px] font-mono uppercase text-[#1E3E62] font-bold block">
                    ★ PONTO ORBITAL
                  </span>
                  <span className="text-sm font-bold text-[#0B192C] block">
                    Google Meet Teleconsulta
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    Videochamada Oficial ao Vivo
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="border-t-2 border-[#0B192C]/15 pt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 relative z-10 gap-2 bg-white/60 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 px-6 sm:px-10 py-3 rounded-b-3xl">
          <span className="font-medium">
            ✨ Toque em qualquer estrela da constelação para abrir o módulo clínico de enfermagem.
          </span>
          <span className="font-mono text-[#0B192C] font-bold">
            Enfermeiro Ativo: {professionalProfile?.displayName || 'Enf. Marcelo'}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: PRONTUÁRIO DIGITAL */}
      {/* ========================================================================= */}
      {activeModal === 'prontuario' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#F0F6FA] rounded-3xl border-2 border-[#0B192C] shadow-2xl p-6 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#0B192C]/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white border-2 border-[#0B192C] shadow-2xs">
                  <FileText className="w-5 h-5 text-[#1E3E62]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#0B192C]">
                    Prontuário Digital de Enfermagem
                  </h3>
                  <span className="text-[11px] text-slate-600">
                    Registro Clínico Eletrônico com Assinatura Digital
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient Header Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B192C]">
                  {selectedPatient}
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                  Pré-Natal Ativo
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 pt-1">
                <div><strong>Idade:</strong> 29 anos</div>
                <div><strong>Tipo Sang.:</strong> O+</div>
                <div><strong>DUM:</strong> 28/05/2026</div>
                <div><strong>DPP:</strong> 18/02/2027</div>
              </div>
            </div>

            {/* Clinical Summary & Timeline */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#0B192C] uppercase tracking-wider block">
                Histórico de Atendimentos Anteriores
              </span>

              <div className="p-3.5 rounded-xl bg-white border border-[#CBD5E1] text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-700 font-bold">
                  <span>Consulta de 16 Semanas • Enfermagem Obstétrica</span>
                  <span className="text-[11px] text-slate-400 font-normal">Ontem às 16:40</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Avaliação da curva de ganho ponderal (+2.1 kg desde o início). Solicitado ultrassom morfológico de 2º trimestre. Orientada quanto à vacinação com dTpa para a 20ª semana.
                </p>
                <div className="text-[10px] text-[#1E3E62] font-semibold pt-1">
                  Assinado digitalmente por: {professionalProfile?.displayName || 'Enf. Marcelo'} • {professionalProfile?.councilNumber || 'COREN-SP 000.002'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#CBD5E1] text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-700 font-bold">
                  <span>Consulta Inicial de Pré-Natal • Enfermagem Obstétrica</span>
                  <span className="text-[11px] text-slate-400 font-normal">14 de Setembro</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Abertura do Cartão da Gestante digital. Prescrição de polivitamínico pré-natal e sulfato ferroso profilático. Coleta de triagem sorológica do 1º trimestre.
                </p>
                <div className="text-[10px] text-[#1E3E62] font-semibold pt-1">
                  Assinado digitalmente por: Enfª. Letícia • COREN-SP 000.001
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => setActiveModal('evolucao')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#EBF3F8] text-[#0B192C] text-xs font-bold border-2 border-[#0B192C] shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Fazer Nova Evolução (SOAP)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EVOLUÇÃO DO PACIENTE (SOAP DIGITAL) */}
      {/* ========================================================================= */}
      {activeModal === 'evolucao' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#F0F6FA] rounded-3xl border-2 border-[#0B192C] shadow-2xl p-6 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#0B192C]/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white border-2 border-[#0B192C] shadow-2xs">
                  <Activity className="w-5 h-5 text-[#1E3E62]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#0B192C]">
                    Evolução do Paciente Digital (Metodologia SOAP)
                  </h3>
                  <span className="text-[11px] text-slate-600">
                    Sistematização da Assistência de Enfermagem (SAE)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {evolutionSaved && (
              <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Evolução SOAP registrada com sucesso e carimbada com seu COREN!</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#0B192C] block mb-1">
                  S — Subjetivo (Queixas e Relato da Paciente)
                </label>
                <textarea
                  rows={2}
                  value={soapS}
                  onChange={(e) => setSoapS(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs text-slate-800 focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B192C] block mb-1">
                  O — Objetivo (Sinais Vitais, Exame Físico & Dados Mensuráveis)
                </label>
                <textarea
                  rows={2}
                  value={soapO}
                  onChange={(e) => setSoapO(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs text-slate-800 focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B192C] block mb-1">
                  A — Avaliação (Diagnóstico de Enfermagem / Raciocínio Clínico)
                </label>
                <textarea
                  rows={2}
                  value={soapA}
                  onChange={(e) => setSoapA(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs text-slate-800 focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B192C] block mb-1">
                  P — Plano (Intervenções, Cuidados, Prescrição & Conduta)
                </label>
                <textarea
                  rows={2}
                  value={soapP}
                  onChange={(e) => setSoapP(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs text-slate-800 focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#CBD5E1] text-xs flex items-center justify-between text-slate-600">
                <span className="font-mono text-[11px]">
                  Carimbo Digital: {professionalProfile?.displayName || 'Enf. Marcelo'} • {professionalProfile?.councilNumber || 'COREN-SP 000.002 (Fictício)'}
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEvolution}
                className="px-5 py-2 rounded-xl bg-white hover:bg-[#EBF3F8] text-[#0B192C] text-xs font-bold border-2 border-[#0B192C] shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Salvar Evolução Digital</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ESCALAS CLÍNICAS DE ENFERMAGEM */}
      {/* ========================================================================= */}
      {activeModal === 'escalas' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#F0F6FA] rounded-3xl border-2 border-[#0B192C] shadow-2xl p-6 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#0B192C]/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white border-2 border-[#0B192C] shadow-2xs">
                  <ClipboardList className="w-5 h-5 text-[#1E3E62]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#0B192C]">
                    Escalas de Avaliação Clínicas de Enfermagem
                  </h3>
                  <span className="text-[11px] text-slate-600">
                    Cálculo Automático e Estratificação de Risco
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {scaleSaved && (
              <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Avaliação clínica anexada ao prontuário da paciente!</span>
              </div>
            )}

            {/* Scale Tab Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'braden', label: 'Escala de Braden (Lesão por Pressão)' },
                { id: 'morse', label: 'Escala de Morse (Quedas)' },
                { id: 'meows', label: 'Escala MEOWS (Alerta Obstétrico)' },
                { id: 'eva', label: 'Escala EVA (Dor)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveScale(s.id as ScaleType)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeScale === s.id
                      ? 'bg-white text-[#0B192C] border-[#0B192C] shadow-xs'
                      : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* SCALE 1: BRADEN */}
            {activeScale === 'braden' && (
              <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] space-y-3 animate-fadeIn text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-[#0B192C]">Escore de Braden Atual:</span>
                  <span className={`px-2.5 py-1 rounded-full font-bold border ${getBradenRisk(bradenScore).color}`}>
                    {bradenScore} Pontos — {getBradenRisk(bradenScore).label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Percepção Sensorial:</label>
                    <select
                      value={bradenSensory}
                      onChange={(e) => setBradenSensory(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                    >
                      <option value={4}>4 — Nenhuma limitação</option>
                      <option value={3}>3 — Levemente limitada</option>
                      <option value={2}>2 — Muito limitada</option>
                      <option value={1}>1 — Totalmente limitada</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Umidade da Pele:</label>
                    <select
                      value={bradenMoisture}
                      onChange={(e) => setBradenMoisture(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                    >
                      <option value={4}>4 — Raramente úmida</option>
                      <option value={3}>3 — Ocasionalmente úmida</option>
                      <option value={2}>2 — Muito úmida</option>
                      <option value={1}>1 — Constantemente úmida</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Atividade:</label>
                    <select
                      value={bradenActivity}
                      onChange={(e) => setBradenActivity(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                    >
                      <option value={4}>4 — Deambula frequentemente</option>
                      <option value={3}>3 — Deambula ocasionalmente</option>
                      <option value={2}>2 — Confinado à cadeira</option>
                      <option value={1}>1 — Confinado ao leito</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mobilidade:</label>
                    <select
                      value={bradenMobility}
                      onChange={(e) => setBradenMobility(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                    >
                      <option value={4}>4 — Sem limitações</option>
                      <option value={3}>3 — Levemente limitada</option>
                      <option value={2}>2 — Muito limitada</option>
                      <option value={1}>1 — Totalmente imóvel</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* SCALE 2: MORSE */}
            {activeScale === 'morse' && (
              <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] space-y-3 animate-fadeIn text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-[#0B192C]">Escore de Queda Morse:</span>
                  <span className={`px-2.5 py-1 rounded-full font-bold border ${getMorseRisk(morseScore).color}`}>
                    {morseScore} Pontos — {getMorseRisk(morseScore).label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Histórico de Quedas Recentes:</label>
                    <select
                      value={morseFalls}
                      onChange={(e) => setMorseFalls(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                    >
                      <option value={0}>Não (0 pontos)</option>
                      <option value={25}>Sim nos últimos 3 meses (25 pontos)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Diagnóstico Secundário:</label>
                    <select
                      value={morseSecondary}
                      onChange={(e) => setMorseSecondary(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                    >
                      <option value={0}>Não (0 pontos)</option>
                      <option value={15}>Sim (15 pontos)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Auxílio na Deambulação:</label>
                    <select
                      value={morseAmbulation}
                      onChange={(e) => setMorseAmbulation(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                    >
                      <option value={0}>Nenhum / Repouso no leito (0 pontos)</option>
                      <option value={15}>Muleta / Bengala / Andador (15 pontos)</option>
                      <option value={30}>Apoio em móveis / paredes (30 pontos)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Marcha / Equilíbrio:</label>
                    <select
                      value={morseGait}
                      onChange={(e) => setMorseGait(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                    >
                      <option value={0}>Normal / Imóvel (0 pontos)</option>
                      <option value={10}>Fraca (10 pontos)</option>
                      <option value={20}>Comprometida / Cambaleante (20 pontos)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* SCALE 3: MEOWS */}
            {activeScale === 'meows' && (
              <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] space-y-3 animate-fadeIn text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-[#0B192C]">Escore MEOWS (Modified Early Obstetric Warning):</span>
                  <span className="px-2.5 py-1 rounded-full font-bold border text-emerald-700 bg-emerald-50 border-emerald-200">
                    Sinais Vitais Estáveis (Alerta Verde)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#EBF3F8] text-[11px] text-slate-700 space-y-1">
                  <p><strong>Parâmetros Avaliados:</strong> PAS 110 mmHg, PAD 70 mmHg, FC 78 bpm, FR 18 rpm, Temperatura 36.4°C, Nível de Consciência Alerta, Lóquios/Sangramento Fisiológico.</p>
                  <p className="text-emerald-700 font-bold">Conduta: Manter rotina normal de pré-natal de baixo risco.</p>
                </div>
              </div>
            )}

            {/* SCALE 4: EVA (PAIN SCALE) */}
            {activeScale === 'eva' && (
              <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] space-y-4 animate-fadeIn text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-[#0B192C]">Escala Visual Analógica de Dor (EVA):</span>
                  <span className="px-3 py-1 rounded-full font-bold border text-blue-700 bg-blue-50 border-blue-200">
                    Grau {evaPainScore} — {evaPainScore === 0 ? 'Sem Dor' : evaPainScore <= 3 ? 'Dor Leve' : evaPainScore <= 7 ? 'Dor Moderada' : 'Dor Intensa'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-base">
                    <span>😊 (0 Sem dor)</span>
                    <span>😐 (5 Moderada)</span>
                    <span>😭 (10 Insuportável)</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={evaPainScore}
                    onChange={(e) => setEvaPainScore(Number(e.target.value))}
                    className="w-full accent-[#0B192C] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <span key={num}>{num}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveScale}
                className="px-5 py-2 rounded-xl bg-white hover:bg-[#EBF3F8] text-[#0B192C] text-xs font-bold border-2 border-[#0B192C] shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Salvar Avaliação no Prontuário</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ANAMNESE DIGITAL */}
      {/* ========================================================================= */}
      {activeModal === 'anamnese' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#F0F6FA] rounded-3xl border-2 border-[#0B192C] shadow-2xl p-6 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#0B192C]/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white border-2 border-[#0B192C] shadow-2xs">
                  <UserCheck className="w-5 h-5 text-[#1E3E62]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#0B192C]">
                    Anamnese Digital de Enfermagem
                  </h3>
                  <span className="text-[11px] text-slate-600">
                    Histórico Clínico e Antecedentes Obstétricos
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {anamneseSaved && (
              <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Anamnese digital salva com sucesso!</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#0B192C] block mb-1">
                  Queixa Principal & História da Moléstia Atual
                </label>
                <textarea
                  rows={2}
                  value={anamneseQueixa}
                  onChange={(e) => setAnamneseQueixa(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs text-slate-800 focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0B192C] block mb-1">
                    Histórico Obstétrico (G / P / A)
                  </label>
                  <input
                    type="text"
                    value={anamneseGpa}
                    onChange={(e) => setAnamneseGpa(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#CBD5E1] bg-white text-xs text-slate-800 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B192C] block mb-1">
                    Alergias Conhecidas
                  </label>
                  <input
                    type="text"
                    value={anamneseAllergies}
                    onChange={(e) => setAnamneseAllergies(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#CBD5E1] bg-white text-xs text-slate-800 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#CBD5E1] text-xs space-y-1 text-slate-700">
                <span className="font-bold text-[#0B192C] block">Exame Físico de Enfermagem:</span>
                <p className="text-[11px]">Normocorada, hidratada, acianótica, anictérica. Mamas simétricas com mamilos íntegros e protusos. Abdome gravídico com altura uterina compatível com a idade gestacional. Membros inferiores sem estases venosas patológicas.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAnamnese}
                className="px-5 py-2 rounded-xl bg-white hover:bg-[#EBF3F8] text-[#0B192C] text-xs font-bold border-2 border-[#0B192C] shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Finalizar e Gravar Anamnese</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: GOOGLE MEET TELECONSULTA */}
      {/* ========================================================================= */}
      {activeModal === 'meet' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#F0F6FA] rounded-3xl border-2 border-[#0B192C] shadow-2xl p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b-2 border-[#0B192C]/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white border-2 border-[#0B192C] shadow-2xs">
                  <Video className="w-5 h-5 text-[#1E3E62]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#0B192C]">
                    Videochamada Google Meet
                  </h3>
                  <span className="text-[11px] text-slate-600">
                    Teleconsulta Oficial Integrada da Clínica Vittacare
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0B192C] block">
                    Sala de Teleconsulta Google Meet Ativa
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Conexão criptografada ponta a ponta com a paciente
                  </span>
                </div>
              </div>

              {/* Link Box */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-[#0B192C] truncate font-bold">
                  {meetLink}
                </span>
                <button
                  onClick={handleCopyMeetLink}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* Share to Real-time Chat Button */}
              <button
                onClick={handleShareMeetToChat}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D0E3F0] to-[#E2EEF5] text-[#0B192C] border-2 border-[#0B192C] text-xs font-bold hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#1E3E62]" />
                <span>{meetSharedChat ? 'Link Enviado no Chat da Paciente!' : 'Enviar Convite do Meet no Chat em Tempo Real'}</span>
              </button>

              <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Câmera e microfone compatíveis com navegador ou celular da paciente.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sem necessidade de instalação prévia no Android / iOS / Desktop.</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Fechar
              </button>
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-xl bg-white hover:bg-[#EBF3F8] text-[#0B192C] text-xs font-bold border-2 border-[#0B192C] shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4 text-[#1E3E62]" />
                <span>Entrar na Sala Google Meet</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
