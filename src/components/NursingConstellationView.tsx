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
  ShieldCheck, 
  Send, 
  Copy, 
  ExternalLink,
  Brain,
  HeartHandshake,
  Orbit,
  Users
} from 'lucide-react';
import { NursingCrest } from './NursingCrest';
import { useAuth } from '../context/AuthContext';
import { 
  useRealtimeChat, 
  useChatDirectory, 
  buildIndividualChatChannelId 
} from '../services/realtimeChat';

type ConstellationNode = 'prontuario' | 'evolucao' | 'escalas' | 'anamnese' | 'meet' | null;
type ScaleType = 'glasgow' | 'gds' | 'braden' | 'morse' | 'meows' | 'eva';

interface GDSQuestion {
  id: number;
  question: string;
  depressiveAnswer: 'sim' | 'nao';
}

const GDS_15_QUESTIONS: GDSQuestion[] = [
  { id: 1, question: '1. Você está basicamente satisfeita com sua vida?', depressiveAnswer: 'nao' },
  { id: 2, question: '2. Você deixou muitos de seus interesses e atividades?', depressiveAnswer: 'sim' },
  { id: 3, question: '3. Você sente que sua vida está vazia?', depressiveAnswer: 'sim' },
  { id: 4, question: '4. Você se aborrece com frequência?', depressiveAnswer: 'sim' },
  { id: 5, question: '5. Você se sente de bom humor a maior parte do tempo?', depressiveAnswer: 'nao' },
  { id: 6, question: '6. Você tem medo de que algum mal vá lhe acontecer?', depressiveAnswer: 'sim' },
  { id: 7, question: '7. Você se sente feliz a maior parte do tempo?', depressiveAnswer: 'nao' },
  { id: 8, question: '8. Você sente que sua situação não tem saída / desamparo?', depressiveAnswer: 'sim' },
  { id: 9, question: '9. Você prefere ficar em casa a sair e fazer coisas novas?', depressiveAnswer: 'sim' },
  { id: 10, question: '10. Você se sente com mais problemas de memória do que a maioria?', depressiveAnswer: 'sim' },
  { id: 11, question: '11. Você acha maravilhoso estar viva agora?', depressiveAnswer: 'nao' },
  { id: 12, question: '12. Você se sente inútil nas atuais circunstâncias?', depressiveAnswer: 'sim' },
  { id: 13, question: '13. Você se sente cheia de energia?', depressiveAnswer: 'nao' },
  { id: 14, question: '14. Você acha que sua situação é sem esperança?', depressiveAnswer: 'sim' },
  { id: 15, question: '15. Você sente que a maioria das pessoas está melhor do que você?', depressiveAnswer: 'sim' },
];

export const NursingConstellationView: React.FC = () => {
  const { professionalProfile } = useAuth();
  const { patients } = useChatDirectory();

  const [activeModal, setActiveModal] = useState<ConstellationNode>(null);

  // Selected patient for digital clinical actions & individual chat
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'pat-mariana');
  const activePatientObj = patients.find((p) => p.id === selectedPatientId) || patients[0] || {
    id: 'pat-mariana',
    name: 'Mariana Silva Santos',
    email: 'mariana.silva@email.com',
    mode: 'gestante' as const,
    clinicalSummary: '18ª Semana • Gestante (G1P0)',
  };

  const selectedPatientLabel = `${activePatientObj.name} (${activePatientObj.clinicalSummary})`;

  // Individual 1-on-1 chat channel for this nurse and this selected patient
  const profIdentifier = professionalProfile?.email || professionalProfile?.uid || 'prof-marcelo';
  const patIdentifier = activePatientObj.email || activePatientObj.id;
  const individualChannelId = buildIndividualChatChannelId(profIdentifier, patIdentifier);

  const { sendMessage: sendRealtimeMessage } = useRealtimeChat(individualChannelId, {
    professionalId: profIdentifier,
    professionalName: professionalProfile?.displayName || 'Enf. Marcelo',
    professionalSpecialty: professionalProfile?.specialty || 'Enfermagem Obstétrica',
    patientId: patIdentifier,
    patientName: activePatientObj.name,
    patientSummary: activePatientObj.clinicalSummary,
  });

  // Dynamic Clinical History Records
  const [clinicalHistory, setClinicalHistory] = useState([
    {
      id: 'rec-1',
      title: 'Consulta de 16 Semanas • Enfermagem Obstétrica',
      date: 'Ontem às 16:40',
      summary: 'Avaliação da curva de ganho ponderal (+2.1 kg desde o início). Solicitado ultrassom morfológico de 2º trimestre. Orientada quanto à vacinação com dTpa para a 20ª semana.',
      author: `${professionalProfile?.displayName || 'Enf. Marcelo'} • ${professionalProfile?.councilNumber || 'COREN-SP 000.002'}`,
    },
    {
      id: 'rec-2',
      title: 'Consulta Inicial de Pré-Natal • Enfermagem Obstétrica',
      date: '14 de Setembro',
      summary: 'Abertura do Cartão da Gestante digital. Prescrição de polivitamínico pré-natal e sulfato ferroso profilático. Coleta de triagem sorológica do 1º trimestre.',
      author: 'Enfª. Letícia • COREN-SP 000.001',
    },
  ]);

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
  const [anamneseExame, setAnamneseExame] = useState('Corada, hidratada, eupneica, afebril. Mamas simétricas sem nódulos. Abdome gravídico indolor à palpação.');
  const [anamneseSaved, setAnamneseSaved] = useState(false);

  // Digital Nursing Scales states
  const [activeScale, setActiveScale] = useState<ScaleType>('glasgow');

  // 1. Escala de Coma de Glasgow (ECG-P)
  const [glasgowEye, setGlasgowEye] = useState<number>(4);
  const [glasgowVerbal, setGlasgowVerbal] = useState<number>(5);
  const [glasgowMotor, setGlasgowMotor] = useState<number>(6);
  const [glasgowPupil, setGlasgowPupil] = useState<number>(0);

  // 2. Escala de Depressão Geriátrica (GDS-15)
  const [gdsAnswers, setGdsAnswers] = useState<Record<number, 'sim' | 'nao'>>({
    1: 'sim',
    2: 'nao',
    3: 'nao',
    4: 'nao',
    5: 'sim',
    6: 'nao',
    7: 'sim',
    8: 'nao',
    9: 'nao',
    10: 'nao',
    11: 'sim',
    12: 'nao',
    13: 'sim',
    14: 'nao',
    15: 'nao',
  });

  // 3. Escala de Braden
  const [bradenSensory, setBradenSensory] = useState(4);
  const [bradenMoisture, setBradenMoisture] = useState(4);
  const [bradenActivity, setBradenActivity] = useState(3);
  const [bradenMobility, setBradenMobility] = useState(4);
  const [bradenNutrition, setBradenNutrition] = useState(3);
  const [bradenFriction, setBradenFriction] = useState(3);

  // 4. Escala de Morse
  const [morseFalls, setMorseFalls] = useState(0);
  const [morseSecondary, setMorseSecondary] = useState(0);
  const [morseAmbulation, setMorseAmbulation] = useState(0);
  const [morseIV, setMorseIV] = useState(0);
  const [morseGait, setMorseGait] = useState(0);
  const [morseMental, setMorseMental] = useState(0);

  // 5. Escala EVA
  const [evaPainScore, setEvaPainScore] = useState(1);
  const [scaleSaved, setScaleSaved] = useState(false);

  // Google Meet states
  const [meetLink] = useState('https://meet.google.com/vit-care-obst');
  const [copiedLink, setCopiedLink] = useState(false);
  const [meetSharedChat, setMeetSharedChat] = useState(false);

  // Calculate Glasgow Score
  const glasgowTotal = Math.max(1, glasgowEye + glasgowVerbal + glasgowMotor - glasgowPupil);
  const getGlasgowClassification = (score: number) => {
    if (score >= 13) {
      return {
        label: 'Consciência Preservada / TCE Leve (13–15)',
        color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
        conduct: 'Manter vigilância neurológica de rotina e reavaliação periódica dos sinais vitais.',
      };
    }
    if (score >= 9) {
      return {
        label: 'Rebaixamento Moderado (9–12)',
        color: 'text-amber-800 bg-amber-50 border-amber-300',
        conduct: 'Monitorização contínua, cabeceira elevada a 30°, avaliação médica imediata e suporte de O2.',
      };
    }
    return {
      label: 'Estado Grave / Coma (≤ 8)',
      color: 'text-rose-800 bg-rose-50 border-rose-300',
      conduct: 'Emergência neurológica: proteção imediata de vias aéreas (IOT se GCS ≤ 8) e estabilização hemodinâmica.',
    };
  };

  // Calculate GDS-15 (Escala de Depressão Geriátrica) Score
  const gdsScore = GDS_15_QUESTIONS.reduce((acc, q) => {
    const ans = gdsAnswers[q.id];
    return acc + (ans === q.depressiveAnswer ? 1 : 0);
  }, 0);

  const getGdsClassification = (score: number) => {
    if (score <= 5) {
      return {
        label: 'Normal / Sem Indícios de Depressão (0–5 pts)',
        color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
        conduct: 'Estimular convívio social, atividade física regular e acompanhamento preventivo anual.',
      };
    }
    if (score <= 10) {
      return {
        label: 'Depressão Leve a Moderada (6–10 pts)',
        color: 'text-amber-800 bg-amber-50 border-amber-300',
        conduct: 'Indicado acolhimento em saúde mental, escuta qualificada e avaliação psicológica/geriátrica.',
      };
    }
    return {
      label: 'Depressão Grave / Severa (11–15 pts)',
      color: 'text-rose-800 bg-rose-50 border-rose-300',
      conduct: 'Encaminhamento prioritário para avaliação médica psiquiátrica/geriátrica e suporte familiar assistido.',
    };
  };

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
      `📹 Olá, ${activePatientObj.name.split(' ')[0]}! Sala de Videochamada Individual no Google Meet iniciada por ${professionalProfile?.displayName || 'Enfermeiro(a)'}: ${meetLink} - Toque para entrar na teleconsulta.`,
      'profissional',
      professionalProfile?.displayName || 'Enf. Marcelo',
      profIdentifier,
      patIdentifier,
      activePatientObj.name
    );
    setMeetSharedChat(true);
    setTimeout(() => setMeetSharedChat(false), 2500);
  };

  const handleSaveEvolution = () => {
    const newRecord = {
      id: `rec-${Date.now()}`,
      title: `Evolução SOAP Digital • ${activePatientObj.name}`,
      date: 'Agora mesmo',
      summary: `S: ${soapS} | O: ${soapO} | A: ${soapA} | P: ${soapP}`,
      author: `${professionalProfile?.displayName || 'Enf. Marcelo'} • ${professionalProfile?.councilNumber || 'COREN-SP 000.002'}`,
    };
    setClinicalHistory((prev) => [newRecord, ...prev]);
    setEvolutionSaved(true);
    setTimeout(() => {
      setEvolutionSaved(false);
      setActiveModal(null);
    }, 1400);
  };

  const handleSaveAnamnese = () => {
    const newRecord = {
      id: `rec-${Date.now()}`,
      title: `Anamnese Digital de Enfermagem • ${activePatientObj.name}`,
      date: 'Agora mesmo',
      summary: `Antecedentes: ${anamneseGpa} | Alergias: ${anamneseAllergies} | Queixa: ${anamneseQueixa} | Exame Físico: ${anamneseExame}`,
      author: `${professionalProfile?.displayName || 'Enf. Marcelo'} • ${professionalProfile?.councilNumber || 'COREN-SP 000.002'}`,
    };
    setClinicalHistory((prev) => [newRecord, ...prev]);
    setAnamneseSaved(true);
    setTimeout(() => {
      setAnamneseSaved(false);
      setActiveModal(null);
    }, 1400);
  };

  const handleSaveScale = () => {
    let scaleSummary = '';
    if (activeScale === 'glasgow') {
      scaleSummary = `Escala de Coma de Glasgow (ECG-P): ${glasgowTotal}/15 pontos (AO:${glasgowEye} RV:${glasgowVerbal} RM:${glasgowMotor} P:-${glasgowPupil}) — ${getGlasgowClassification(glasgowTotal).label}`;
    } else if (activeScale === 'gds') {
      scaleSummary = `Escala de Depressão Geriátrica (GDS-15): ${gdsScore}/15 pontos — ${getGdsClassification(gdsScore).label}`;
    } else if (activeScale === 'braden') {
      scaleSummary = `Escala de Braden: ${bradenScore} pontos — ${getBradenRisk(bradenScore).label}`;
    } else if (activeScale === 'morse') {
      scaleSummary = `Escala de Queda de Morse: ${morseScore} pontos — ${getMorseRisk(morseScore).label}`;
    } else if (activeScale === 'eva') {
      scaleSummary = `Escala Visual Analógica de Dor (EVA): Grau ${evaPainScore}/10`;
    } else {
      scaleSummary = 'Escala MEOWS Obstétrica: Sinais Vitais Estáveis (Alerta Verde)';
    }

    const newRecord = {
      id: `rec-${Date.now()}`,
      title: `Avaliação por Escala Clínica • ${activePatientObj.name}`,
      date: 'Agora mesmo',
      summary: scaleSummary,
      author: `${professionalProfile?.displayName || 'Enf. Marcelo'} • ${professionalProfile?.councilNumber || 'COREN-SP 000.002'}`,
    };
    setClinicalHistory((prev) => [newRecord, ...prev]);
    setScaleSaved(true);
    setTimeout(() => {
      setScaleSaved(false);
      setActiveModal(null);
    }, 1400);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Card - Pearly White Surface with Metallic Sapphire Blue Border & Silver Accents */}
      <div className="p-6 sm:p-7 rounded-3xl vitta-pearl-white-card relative overflow-hidden">
        <div className="absolute -right-14 -top-14 w-52 h-52 rounded-full bg-gradient-to-br from-[#B8DCFA]/70 via-[#93C5FD]/35 to-transparent blur-xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0A2647] vitta-pearl-blue-subbar px-3.5 py-1 rounded-full border-2 border-[#144272] uppercase tracking-wider mb-1.5 shadow-2xs">
              <Orbit className="w-4 h-4 text-[#144272]" />
              <span>Observatório Clínico Estelar • Vittaprofessio Premium</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A2647] tracking-wide">
              Constelação de Enfermagem Digital
            </h2>
            <p className="text-xs sm:text-sm text-[#144272] font-medium mt-1 max-w-2xl leading-relaxed">
              Navegue pelos astros clínicos para acessar o <strong>Prontuário Digital</strong>, registrar a <strong>Evolução SOAP</strong>, aplicar as <strong>Escalas Clínicas (Glasgow, Depressão Geriátrica GDS-15, Braden, Morse, MEOWS e EVA)</strong>, preencher a <strong>Anamnese</strong> ou abrir o <strong>Google Meet</strong>.
            </p>
          </div>

          {/* Patient Selector & Quick Meet Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <div className="vitta-pearl-blue-subbar px-3.5 py-2 rounded-2xl border-2 border-[#144272] flex items-center gap-2 shadow-xs">
              <Users className="w-4 h-4 text-[#0A2647] shrink-0" />
              <div className="text-left">
                <label className="text-[10px] uppercase font-bold text-[#144272] block leading-none">
                  Cliente / Paciente Ativa:
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="text-xs font-bold text-[#0A2647] bg-transparent focus:outline-none cursor-pointer pr-2 mt-0.5"
                >
                  {patients.map((pat) => (
                    <option key={pat.id} value={pat.id}>
                      {pat.name} ({pat.mode === 'gestante' ? 'Gestante' : 'Saúde Mulher'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('meet')}
              className="px-4 py-3 rounded-2xl vitta-metallic-blue-badge hover:brightness-110 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <Video className="w-4 h-4 text-[#93C5FD]" />
              <span>Google Meet Individual</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THE CELESTIAL SPACE CONSTELLATION MAP                                     */}
      {/* Palette: Space-Inspired Metallic Sapphire Dark Blue + Pearl Blue + Silver */}
      {/* ========================================================================= */}
      <div
        className="p-6 sm:p-10 rounded-3xl vitta-space-constellation-dome relative overflow-hidden min-h-[520px] sm:min-h-[580px] flex flex-col justify-between"
      >
        {/* Cosmic Silver & Pearl Stardust Layer */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Outer Space Silver Stars */}
          <div className="absolute top-8 left-12 w-2.5 h-2.5 rounded-full bg-[#FFFFFF] shadow-[0_0_12px_#FFFFFF] animate-pulse" />
          <div className="absolute top-16 left-1/3 w-2 h-2 rounded-full bg-[#E2E8F0] shadow-[0_0_10px_#93C5FD]" />
          <div className="absolute top-12 right-16 w-2.5 h-2.5 rounded-full bg-[#EBF4FA] shadow-[0_0_14px_#FFFFFF] animate-ping" />
          <div className="absolute top-28 right-1/4 w-2 h-2 rounded-full bg-[#E2E8F0] shadow-[0_0_8px_#FFFFFF]" />
          <div className="absolute bottom-24 left-10 w-2.5 h-2.5 rounded-full bg-[#E2EEF5] shadow-[0_0_12px_#93C5FD] animate-pulse" />
          <div className="absolute bottom-16 right-14 w-2.5 h-2.5 rounded-full bg-[#FFFFFF] shadow-[0_0_12px_#FFFFFF]" />
          <div className="absolute top-1/2 left-8 w-2 h-2 rounded-full bg-[#E2E8F0] animate-ping" />
          <div className="absolute top-1/2 right-8 w-2.5 h-2.5 rounded-full bg-[#FFFFFF] shadow-[0_0_10px_#93C5FD]" />
        </div>

        {/* Space Header & Coordinates Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3 vitta-metallic-blue-badge px-4 py-2.5 rounded-2xl text-white shadow-lg">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-[#E2E8F0] via-[#FFFFFF] to-[#93C5FD] border border-white">
              <NursingCrest size="sm" variant="silver" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#BAE6FD] block">
                COSMOS CLÍNICO • NEBULOSA PRATA, PÉROLA & SAFIRA
              </span>
              <span className="text-sm font-serif font-bold text-[#FFFFFF]">
                Constelação Assistencial Vittaprofessio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 vitta-pearl-white-card px-4 py-2 rounded-2xl text-xs text-[#0A2647] shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">Paciente em Órbita: {activePatientObj.name}</span>
            {activePatientObj.hasDisability && (
              <span className="ml-1 px-2 py-0.5 rounded-md vitta-metallic-blue-badge text-white text-[10px] font-bold">
                ♿ PCD Assistida
              </span>
            )}
          </div>
        </div>

        {/* SVG Space Orbital Rings & Metallic Silver/Blue Constellation Vectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <defs>
            <linearGradient id="silverMetallicLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0A2647" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#144272" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="pearlOrbitRing" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.65" />
            </linearGradient>
          </defs>

          {/* Celestial Orbital Ellipses */}
          <ellipse cx="500" cy="310" rx="410" ry="210" fill="none" stroke="url(#pearlOrbitRing)" strokeWidth="2.2" strokeDasharray="8 6" />
          <ellipse cx="500" cy="310" rx="270" ry="135" fill="none" stroke="url(#pearlOrbitRing)" strokeWidth="1.8" />

          {/* Outer Silver Glow Constellation Lines */}
          <line x1="200" y1="210" x2="500" y2="140" stroke="#FFFFFF" strokeWidth="6" strokeOpacity="0.55" />
          <line x1="500" y1="140" x2="800" y2="210" stroke="#FFFFFF" strokeWidth="6" strokeOpacity="0.55" />
          <line x1="200" y1="210" x2="320" y2="430" stroke="#FFFFFF" strokeWidth="6" strokeOpacity="0.55" />
          <line x1="800" y1="210" x2="680" y2="430" stroke="#FFFFFF" strokeWidth="6" strokeOpacity="0.55" />
          <line x1="320" y1="430" x2="680" y2="430" stroke="#FFFFFF" strokeWidth="6" strokeOpacity="0.55" />

          {/* Core Metallic Dark Blue & Silver Constellation Vectors */}
          <line x1="200" y1="210" x2="500" y2="140" stroke="#0A2647" strokeWidth="2.5" strokeDasharray="7 4" />
          <line x1="500" y1="140" x2="800" y2="210" stroke="#0A2647" strokeWidth="2.5" strokeDasharray="7 4" />
          <line x1="200" y1="210" x2="320" y2="430" stroke="#0A2647" strokeWidth="2.5" strokeDasharray="7 4" />
          <line x1="800" y1="210" x2="680" y2="430" stroke="#0A2647" strokeWidth="2.5" strokeDasharray="7 4" />
          <line x1="320" y1="430" x2="680" y2="430" stroke="#0A2647" strokeWidth="2.5" strokeDasharray="7 4" />
          <line x1="200" y1="210" x2="800" y2="210" stroke="url(#silverMetallicLine)" strokeWidth="2" />
          <line x1="500" y1="140" x2="320" y2="430" stroke="url(#silverMetallicLine)" strokeWidth="2" />
          <line x1="500" y1="140" x2="680" y2="430" stroke="url(#silverMetallicLine)" strokeWidth="2" />
        </svg>

        {/* 5 STELLAR CONSTELLATION INTERACTIVE NODES (Pearl Light Blue, Metallic Sapphire Dark Blue & Brushed Silver) */}
        <div className="relative z-10 w-full my-auto py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* NODE 1: PRONTUÁRIO DIGITAL (Left Upper Star) */}
            <div className="flex flex-col items-center text-center">
              <button
                onClick={() => setActiveModal('prontuario')}
                className="group w-full max-w-[250px] relative p-4 rounded-3xl vitta-pearl-white-card hover:scale-105 transition-all cursor-pointer ring-2 ring-[#E2E8F0] shadow-[0_0_28px_rgba(255,255,255,0.8)] flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl vitta-metallic-blue-badge text-white flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform">
                  <FileText className="w-7 h-7 text-[#BAE6FD]" />
                </div>
                <div className="mt-2.5">
                  <span className="text-[10px] font-mono uppercase text-[#144272] font-extrabold tracking-wider block">
                    ✦ ESTRELA ALPHA • PRATA
                  </span>
                  <span className="text-sm font-serif font-bold text-[#0A2647] block mt-0.5">
                    Prontuário Digital
                  </span>
                  <span className="text-[11px] text-[#144272] font-medium block mt-0.5">
                    Histórico Clínico & Prescrições
                  </span>
                </div>
              </button>
            </div>

            {/* NODE 2 (CENTER TOP): ANAMNESE DIGITAL */}
            <div className="flex flex-col items-center text-center md:-mt-8">
              <button
                onClick={() => setActiveModal('anamnese')}
                className="group w-full max-w-[250px] relative p-4 rounded-3xl vitta-pearl-white-card hover:scale-105 transition-all cursor-pointer ring-2 ring-[#E2E8F0] shadow-[0_0_32px_rgba(255,255,255,0.9)] flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl vitta-metallic-blue-badge text-white flex items-center justify-center shadow-md group-hover:-rotate-6 transition-transform">
                  <UserCheck className="w-7 h-7 text-[#BAE6FD]" />
                </div>
                <div className="mt-2.5">
                  <span className="text-[10px] font-mono uppercase text-[#144272] font-extrabold tracking-wider block">
                    ✦ ESTRELA BETA • PÉROLA
                  </span>
                  <span className="text-sm font-serif font-bold text-[#0A2647] block mt-0.5">
                    Anamnese Digital
                  </span>
                  <span className="text-[11px] text-[#144272] font-medium block mt-0.5">
                    Coleta Clínica & Exame Físico
                  </span>
                </div>
              </button>
            </div>

            {/* NODE 3: EVOLUÇÃO DO PACIENTE (Right Upper Star) */}
            <div className="flex flex-col items-center text-center">
              <button
                onClick={() => setActiveModal('evolucao')}
                className="group w-full max-w-[250px] relative p-4 rounded-3xl vitta-pearl-white-card hover:scale-105 transition-all cursor-pointer ring-2 ring-[#E2E8F0] shadow-[0_0_28px_rgba(255,255,255,0.8)] flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl vitta-metallic-blue-badge text-white flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform">
                  <Activity className="w-7 h-7 text-[#BAE6FD]" />
                </div>
                <div className="mt-2.5">
                  <span className="text-[10px] font-mono uppercase text-[#144272] font-extrabold tracking-wider block">
                    ✦ ESTRELA GAMMA • SAFIRA
                  </span>
                  <span className="text-sm font-serif font-bold text-[#0A2647] block mt-0.5">
                    Evolução do Paciente
                  </span>
                  <span className="text-[11px] text-[#144272] font-medium block mt-0.5">
                    Sistematização SAE / SOAP
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* LOWER ROW: ESCALAS CLÍNICAS (WITH GLASGOW & GDS-15) & GOOGLE MEET HUB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mt-8 max-w-2xl mx-auto">
            {/* NODE 4: ESCALAS CLÍNICAS DE ENFERMAGEM */}
            <div className="flex flex-col items-center text-center">
              <button
                onClick={() => setActiveModal('escalas')}
                className="group w-full relative p-4 rounded-3xl vitta-pearl-white-card hover:scale-105 transition-all cursor-pointer ring-2 ring-[#E2E8F0] shadow-[0_0_32px_rgba(255,255,255,0.85)] flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl vitta-metallic-blue-badge text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-7 h-7 text-[#BAE6FD]" />
                </div>
                <div className="mt-2.5">
                  <span className="text-[10px] font-mono uppercase text-[#144272] font-extrabold tracking-wider block">
                    ✦ ESTRELA DELTA • ESCALAS DIGITAIS
                  </span>
                  <span className="text-sm font-serif font-bold text-[#0A2647] block mt-0.5">
                    Escalas de Avaliação Clínica
                  </span>
                  <span className="text-[11px] text-[#144272] font-bold block mt-0.5">
                    Glasgow • Depressão Geriátrica • Braden • Morse • EVA
                  </span>
                </div>
              </button>
            </div>

            {/* NODE 5: GOOGLE MEET TELECONSULTA */}
            <div className="flex flex-col items-center text-center">
              <button
                onClick={() => setActiveModal('meet')}
                className="group w-full relative p-4 rounded-3xl vitta-pearl-white-card hover:scale-105 transition-all cursor-pointer ring-2 ring-[#E2E8F0] shadow-[0_0_32px_rgba(255,255,255,0.85)] flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl vitta-metallic-blue-badge text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Video className="w-7 h-7 text-[#BAE6FD]" />
                </div>
                <div className="mt-2.5">
                  <span className="text-[10px] font-mono uppercase text-[#144272] font-extrabold tracking-wider block">
                    ✦ PONTO ORBITAL • TELEMEDICINA
                  </span>
                  <span className="text-sm font-serif font-bold text-[#0A2647] block mt-0.5">
                    Google Meet Teleconsulta
                  </span>
                  <span className="text-[11px] text-[#144272] font-medium block mt-0.5">
                    Videochamada Individual ao Vivo
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Space Footer Bar */}
        <div className="border-t-2 border-[#144272] pt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-[#0A2647] relative z-10 gap-2 vitta-pearl-blue-header -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 px-6 sm:px-10 py-3.5 rounded-b-3xl">
          <span className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#144272]" />
            Toque em qualquer astro da constelação para operar os módulos clínicos de <strong>{activePatientObj.name}</strong>.
          </span>
          <span className="font-mono text-[#0A2647] font-bold">
            Enfermeiro(a): {professionalProfile?.displayName || 'Enf. Marcelo'}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: PRONTUÁRIO DIGITAL */}
      {/* ========================================================================= */}
      {activeModal === 'prontuario' && (
        <div className="fixed inset-0 z-50 bg-[#0A2647]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl vitta-pearl-blue-bg rounded-3xl border-2 border-[#144272] shadow-2xl p-6 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#144272]/30 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl vitta-metallic-blue-badge text-white">
                  <FileText className="w-5 h-5 text-[#93C5FD]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#0A2647]">
                    Prontuário Digital de Enfermagem
                  </h3>
                  <span className="text-[11px] text-[#144272] font-medium">
                    Registro Clínico Eletrônico Individual • Assinatura COREN
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full bg-white/80 hover:bg-white text-[#0A2647] border border-[#144272] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient Header Card */}
            <div className="p-4 rounded-2xl vitta-pearl-white-card space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#0A2647]">
                  {selectedPatientLabel}
                </span>
                <span className="text-[11px] text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg font-bold border border-emerald-400">
                  Prontuário Sincronizado
                </span>
              </div>
              {activePatientObj.hasDisability && (
                <div className="p-2.5 rounded-xl vitta-pearl-blue-subbar border border-[#144272] text-xs text-[#0A2647] flex items-center justify-between">
                  <span>
                    <strong>♿ Atenção de Acessibilidade (PCD):</strong> Paciente com suporte assistido ({activePatientObj.disabilityTypes?.join(', ') || 'Adaptado'}).
                    {activePatientObj.helperName ? ` Acompanhante: ${activePatientObj.helperName}.` : ''}
                  </span>
                  {activePatientObj.needsLibrasInterpreter && (
                    <span className="font-bold text-[#0A2647]">🤟 Intérprete de Libras Solicitado</span>
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#144272] font-medium pt-1">
                <div><strong className="text-[#0A2647]">E-mail:</strong> {activePatientObj.email}</div>
                <div><strong className="text-[#0A2647]">Tipo Sang.:</strong> O+</div>
                <div><strong className="text-[#0A2647]">Alergias:</strong> {anamneseAllergies}</div>
                <div><strong className="text-[#0A2647]">Status:</strong> Acompanhamento Ativo</div>
              </div>
            </div>

            {/* Clinical Summary & Timeline */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-[#0A2647] uppercase tracking-wider block">
                Histórico de Evoluções, Anamneses & Escalas Aplicadas ({clinicalHistory.length})
              </span>

              {clinicalHistory.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl vitta-pearl-white-card text-xs space-y-1">
                  <div className="flex items-center justify-between text-[#0A2647] font-bold">
                    <span>{item.title}</span>
                    <span className="text-[11px] text-[#144272] font-medium">{item.date}</span>
                  </div>
                  <p className="text-[#144272] font-medium text-[11px] leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="text-[10px] text-[#0A2647] font-bold pt-1">
                    Assinado digitalmente por: {item.author}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap justify-end gap-2 border-t border-[#144272]/25">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#0A2647] hover:bg-white/70 cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => setActiveModal('escalas')}
                className="px-4 py-2 rounded-xl vitta-pearl-button text-xs font-bold cursor-pointer"
              >
                Aplicar Escala Clínica
              </button>
              <button
                onClick={() => setActiveModal('evolucao')}
                className="px-4 py-2 rounded-xl vitta-metallic-blue-badge text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <span>Nova Evolução (SOAP)</span>
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
        <div className="fixed inset-0 z-50 bg-[#0A2647]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl vitta-pearl-blue-bg rounded-3xl border-2 border-[#144272] shadow-2xl p-6 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#144272]/30 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl vitta-metallic-blue-badge text-white">
                  <Activity className="w-5 h-5 text-[#93C5FD]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#0A2647]">
                    Evolução do Paciente Digital (Metodologia SOAP)
                  </h3>
                  <span className="text-[11px] text-[#144272] font-medium">
                    Paciente: <strong>{activePatientObj.name}</strong> • Sistematização da Assistência (SAE)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full bg-white/80 hover:bg-white text-[#0A2647] border border-[#144272] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {evolutionSaved && (
              <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Evolução SOAP registrada com sucesso no prontuário de {activePatientObj.name}!</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#0A2647] block mb-1">
                  S — Subjetivo (Queixas e Relato da Paciente)
                </label>
                <textarea
                  rows={2}
                  value={soapS}
                  onChange={(e) => setSoapS(e.target.value)}
                  className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-xs text-[#0A2647] font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0A2647] block mb-1">
                  O — Objetivo (Sinais Vitais, Exame Físico & Dados Mensuráveis)
                </label>
                <textarea
                  rows={2}
                  value={soapO}
                  onChange={(e) => setSoapO(e.target.value)}
                  className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-xs text-[#0A2647] font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0A2647] block mb-1">
                  A — Avaliação (Diagnóstico de Enfermagem & Julgamento Clínico)
                </label>
                <textarea
                  rows={2}
                  value={soapA}
                  onChange={(e) => setSoapA(e.target.value)}
                  className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-xs text-[#0A2647] font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0A2647] block mb-1">
                  P — Plano (Intervenções, Cuidados, Prescrição & Conduta)
                </label>
                <textarea
                  rows={2}
                  value={soapP}
                  onChange={(e) => setSoapP(e.target.value)}
                  className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-xs text-[#0A2647] font-medium focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-2xl vitta-pearl-white-card text-xs flex items-center justify-between text-[#0A2647]">
                <span className="font-mono text-[11px] font-bold">
                  Carimbo Digital: {professionalProfile?.displayName || 'Enf. Marcelo'} • {professionalProfile?.councilNumber || 'COREN-SP 000.002'}
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-[#144272]/25">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#0A2647] hover:bg-white/70 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEvolution}
                className="px-5 py-2 rounded-xl vitta-metallic-blue-badge text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Salvar Evolução Digital</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ESCALAS CLÍNICAS DE ENFERMAGEM (INCLUINDO GLASGOW E GDS-15)      */}
      {/* ========================================================================= */}
      {activeModal === 'escalas' && (
        <div className="fixed inset-0 z-50 bg-[#0A2647]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl vitta-pearl-blue-bg rounded-3xl border-2 border-[#144272] shadow-2xl p-6 space-y-4 animate-scaleUp max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#144272]/30 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl vitta-metallic-blue-badge text-white">
                  <ClipboardList className="w-5 h-5 text-[#93C5FD]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#0A2647]">
                    Escalas de Avaliação Clínicas de Enfermagem
                  </h3>
                  <span className="text-[11px] text-[#144272] font-medium">
                    Paciente: <strong>{activePatientObj.name}</strong> • Cálculo Automatizado & Estratificação Clínica
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full bg-white/80 hover:bg-white text-[#0A2647] border border-[#144272] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {scaleSaved && (
              <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Avaliação clínica anexada com sucesso ao prontuário de {activePatientObj.name}!</span>
              </div>
            )}

            {/* Scale Tab Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
              {[
                { id: 'glasgow', label: '🧠 Escala de Glasgow (ECG-P)' },
                { id: 'gds', label: '🤍 Depressão Geriátrica (GDS-15)' },
                { id: 'braden', label: 'Escala de Braden (Lesão)' },
                { id: 'morse', label: 'Escala de Morse (Quedas)' },
                { id: 'meows', label: 'Escala MEOWS (Obstétrica)' },
                { id: 'eva', label: 'Escala EVA (Dor)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveScale(s.id as ScaleType)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeScale === s.id
                      ? 'vitta-metallic-blue-badge text-white'
                      : 'vitta-pearl-button text-[#0A2647]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* =================================================================== */}
            {/* SCALE 1: ESCALA DE COMA DE GLASGOW (ECG-P)                          */}
            {/* =================================================================== */}
            {activeScale === 'glasgow' && (
              <div className="p-5 rounded-2xl vitta-pearl-white-card space-y-4 animate-fadeIn text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#144272]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#144272]" />
                    <div>
                      <span className="font-serif font-bold text-sm text-[#0A2647] block">
                        Escala de Coma de Glasgow com Resposta Pupilar (ECG-P)
                      </span>
                      <span className="text-[11px] text-[#144272] font-medium">
                        Avaliação neurológica do nível de consciência (Pontuação de 1 a 15)
                      </span>
                    </div>
                  </div>
                  <div className={`px-3.5 py-1.5 rounded-xl font-bold border ${getGlasgowClassification(glasgowTotal).color}`}>
                    Escore Total: {glasgowTotal}/15 — {getGlasgowClassification(glasgowTotal).label}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Abertura Ocular */}
                  <div className="p-3.5 rounded-xl vitta-pearl-blue-subbar border border-[#144272]">
                    <label className="font-bold text-[#0A2647] block mb-1.5">
                      1. Abertura Ocular (AO) — Máx: 4 pts
                    </label>
                    <select
                      value={glasgowEye}
                      onChange={(e) => setGlasgowEye(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-xs font-bold text-[#0A2647]"
                    >
                      <option value={4}>4 — Espontânea (olhos abertos espontaneamente)</option>
                      <option value={3}>3 — Ao estímulo verbal / sonoro</option>
                      <option value={2}>2 — Ao estímulo de pressão (leito ungueal/trapézio)</option>
                      <option value={1}>1 — Ausente (não abre os olhos)</option>
                    </select>
                  </div>

                  {/* Resposta Verbal */}
                  <div className="p-3.5 rounded-xl vitta-pearl-blue-subbar border border-[#144272]">
                    <label className="font-bold text-[#0A2647] block mb-1.5">
                      2. Resposta Verbal (RV) — Máx: 5 pts
                    </label>
                    <select
                      value={glasgowVerbal}
                      onChange={(e) => setGlasgowVerbal(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-xs font-bold text-[#0A2647]"
                    >
                      <option value={5}>5 — Orientada (tempo, espaço e pessoa)</option>
                      <option value={4}>4 — Confusa (desorientada, mas mantém diálogo)</option>
                      <option value={3}>3 — Palavras inapropriadas / desconexas</option>
                      <option value={2}>2 — Sons incompreensíveis (gemidos)</option>
                      <option value={1}>1 — Ausente (sem emissão vocal)</option>
                    </select>
                  </div>

                  {/* Resposta Motora */}
                  <div className="p-3.5 rounded-xl vitta-pearl-blue-subbar border border-[#144272]">
                    <label className="font-bold text-[#0A2647] block mb-1.5">
                      3. Resposta Motora (RM) — Máx: 6 pts
                    </label>
                    <select
                      value={glasgowMotor}
                      onChange={(e) => setGlasgowMotor(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-xs font-bold text-[#0A2647]"
                    >
                      <option value={6}>6 — Obedece a comandos verbais simples</option>
                      <option value={5}>5 — Localiza o estímulo álgico / pressão</option>
                      <option value={4}>4 — Flexão normal (retirada inespecífica)</option>
                      <option value={3}>3 — Flexão anormal (decorticação)</option>
                      <option value={2}>2 — Extensão anormal (descerebração)</option>
                      <option value={1}>1 — Ausente (flacidez / sem resposta)</option>
                    </select>
                  </div>

                  {/* Reatividade Pupilar */}
                  <div className="p-3.5 rounded-xl vitta-pearl-blue-subbar border border-[#144272]">
                    <label className="font-bold text-[#0A2647] block mb-1.5">
                      4. Reatividade Pupilar à Luz (P) — Subtração
                    </label>
                    <select
                      value={glasgowPupil}
                      onChange={(e) => setGlasgowPupil(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-xs font-bold text-[#0A2647]"
                    >
                      <option value={0}>0 — Ambas as pupilas fotorreagentes (Subtrai 0)</option>
                      <option value={1}>1 — Apenas uma pupila não reage à luz (Subtrai 1)</option>
                      <option value={2}>2 — Nenhuma pupila reage à luz (Subtrai 2)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl vitta-pearl-blue-subbar border-2 border-[#144272] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-[#0A2647] block">
                      Fórmula Aplicada: AO ({glasgowEye}) + RV ({glasgowVerbal}) + RM ({glasgowMotor}) - Pupilas ({glasgowPupil}) = {glasgowTotal} pontos
                    </span>
                    <span className="text-[11px] text-[#144272] font-medium">
                      <strong>Conduta de Enfermagem Sugerida:</strong> {getGlasgowClassification(glasgowTotal).conduct}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* SCALE 2: ESCALA DE DEPRESSÃO GERIÁTRICA (GDS-15 / YESAVAGE)         */}
            {/* =================================================================== */}
            {activeScale === 'gds' && (
              <div className="p-5 rounded-2xl vitta-pearl-white-card space-y-4 animate-fadeIn text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#144272]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-[#144272]" />
                    <div>
                      <span className="font-serif font-bold text-sm text-[#0A2647] block">
                        Escala de Depressão Geriátrica de Yesavage (GDS-15)
                      </span>
                      <span className="text-[11px] text-[#144272] font-medium">
                        Rastreamento de humor e sintomas depressivos (0 a 15 pontos)
                      </span>
                    </div>
                  </div>
                  <div className={`px-3.5 py-1.5 rounded-xl font-bold border ${getGdsClassification(gdsScore).color}`}>
                    Pontuação GDS-15: {gdsScore}/15 — {getGdsClassification(gdsScore).label}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {GDS_15_QUESTIONS.map((item) => {
                    const currentVal = gdsAnswers[item.id] || 'nao';
                    const scoresPoint = currentVal === item.depressiveAnswer;
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${
                          scoresPoint
                            ? 'bg-amber-50 border-amber-400'
                            : 'bg-white border-[#144272]/35'
                        }`}
                      >
                        <span className="text-[11px] font-bold text-[#0A2647] leading-snug">
                          {item.question}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setGdsAnswers((prev) => ({ ...prev, [item.id]: 'sim' }))}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                              currentVal === 'sim'
                                ? 'vitta-metallic-blue-badge text-white'
                                : 'bg-white text-[#0A2647] border-[#144272]/40 hover:bg-slate-100'
                            }`}
                          >
                            Sim
                          </button>
                          <button
                            type="button"
                            onClick={() => setGdsAnswers((prev) => ({ ...prev, [item.id]: 'nao' }))}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                              currentVal === 'nao'
                                ? 'vitta-metallic-blue-badge text-white'
                                : 'bg-white text-[#0A2647] border-[#144272]/40 hover:bg-slate-100'
                            }`}
                          >
                            Não
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl vitta-pearl-blue-subbar border-2 border-[#144272] space-y-1">
                  <span className="font-bold text-[#0A2647] block">
                    Interpretação GDS-15 ({gdsScore} pontos de 15): {getGdsClassification(gdsScore).label}
                  </span>
                  <span className="text-[11px] text-[#144272] font-medium block">
                    <strong>Plano de Cuidado Sugerido:</strong> {getGdsClassification(gdsScore).conduct}
                  </span>
                </div>
              </div>
            )}

            {/* SCALE 3: BRADEN */}
            {activeScale === 'braden' && (
              <div className="p-4 rounded-2xl vitta-pearl-white-card space-y-3 animate-fadeIn text-xs">
                <div className="flex items-center justify-between border-b border-[#144272]/20 pb-2">
                  <span className="font-bold text-[#0A2647]">Escore de Braden Atual:</span>
                  <span className={`px-2.5 py-1 rounded-full font-bold border ${getBradenRisk(bradenScore).color}`}>
                    {bradenScore} Pontos — {getBradenRisk(bradenScore).label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#0A2647] block mb-1">Percepção Sensorial:</label>
                    <select
                      value={bradenSensory}
                      onChange={(e) => setBradenSensory(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border-2 border-[#144272]/40 bg-white text-xs text-[#0A2647] font-medium"
                    >
                      <option value={4}>4 — Nenhuma limitação</option>
                      <option value={3}>3 — Levemente limitada</option>
                      <option value={2}>2 — Muito limitada</option>
                      <option value={1}>1 — Totalmente limitada</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#0A2647] block mb-1">Umidade da Pele:</label>
                    <select
                      value={bradenMoisture}
                      onChange={(e) => setBradenMoisture(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border-2 border-[#144272]/40 bg-white text-xs text-[#0A2647] font-medium"
                    >
                      <option value={4}>4 — Raramente úmida</option>
                      <option value={3}>3 — Ocasionalmente úmida</option>
                      <option value={2}>2 — Muito úmida</option>
                      <option value={1}>1 — Constantemente úmida</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#0A2647] block mb-1">Atividade:</label>
                    <select
                      value={bradenActivity}
                      onChange={(e) => setBradenActivity(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border-2 border-[#144272]/40 bg-white text-xs text-[#0A2647] font-medium"
                    >
                      <option value={4}>4 — Deambula frequentemente</option>
                      <option value={3}>3 — Deambula ocasionalmente</option>
                      <option value={2}>2 — Confinado à cadeira</option>
                      <option value={1}>1 — Confinado ao leito</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#0A2647] block mb-1">Mobilidade:</label>
                    <select
                      value={bradenMobility}
                      onChange={(e) => setBradenMobility(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border-2 border-[#144272]/40 bg-white text-xs text-[#0A2647] font-medium"
                    >
                      <option value={4}>4 — Sem limitações</option>
                      <option value={3}>3 — Levemente limitada</option>
                      <option value={2}>2 — Muito limitada</option>
                      <option value={1}>1 — Totalmente imóvel</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#0A2647] block mb-1">Nutrição:</label>
                    <select
                      value={bradenNutrition}
                      onChange={(e) => setBradenNutrition(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border-2 border-[#144272]/40 bg-white text-xs text-[#0A2647] font-medium"
                    >
                      <option value={4}>4 — Excelente</option>
                      <option value={3}>3 — Adequada</option>
                      <option value={2}>2 — Provavelmente inadequada</option>
                      <option value={1}>1 — Muito pobre</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#0A2647] block mb-1">Fricção e Cisalhamento:</label>
                    <select
                      value={bradenFriction}
                      onChange={(e) => setBradenFriction(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border-2 border-[#144272]/40 bg-white text-xs text-[#0A2647] font-medium"
                    >
                      <option value={3}>3 — Sem problema aparente</option>
                      <option value={2}>2 — Problema em potencial</option>
                      <option value={1}>1 — Problema manifesto</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* SCALE 4: MORSE */}
            {activeScale === 'morse' && (
              <div className="p-4 rounded-2xl vitta-pearl-white-card space-y-3 animate-fadeIn text-xs">
                <div className="flex items-center justify-between border-b border-[#144272]/20 pb-2">
                  <span className="font-bold text-[#0A2647]">Escore de Queda Morse:</span>
                  <span className={`px-2.5 py-1 rounded-full font-bold border ${getMorseRisk(morseScore).color}`}>
                    {morseScore} Pontos — {getMorseRisk(morseScore).label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#0A2647] block mb-1">Histórico de Quedas Recentes:</label>
                    <select
                      value={morseFalls}
                      onChange={(e) => setMorseFalls(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border-2 border-[#144272]/40 bg-white text-xs text-[#0A2647] font-medium"
                    >
                      <option value={0}>Não (0 pontos)</option>
                      <option value={25}>Sim nos últimos 3 meses (25 pontos)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#0A2647] block mb-1">Diagnóstico Secundário:</label>
                    <select
                      value={morseSecondary}
                      onChange={(e) => setMorseSecondary(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border-2 border-[#144272]/40 bg-white text-xs text-[#0A2647] font-medium"
                    >
                      <option value={0}>Não (0 pontos)</option>
                      <option value={15}>Sim (15 pontos)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#0A2647] block mb-1">Auxílio na Deambulação:</label>
                    <select
                      value={morseAmbulation}
                      onChange={(e) => setMorseAmbulation(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border-2 border-[#144272]/40 bg-white text-xs text-[#0A2647] font-medium"
                    >
                      <option value={0}>Nenhum / Repouso no leito (0 pontos)</option>
                      <option value={15}>Muleta / Bengala / Andador (15 pontos)</option>
                      <option value={30}>Apoio em móveis / paredes (30 pontos)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#0A2647] block mb-1">Terapia Endovenosa / Dispositivo:</label>
                    <select
                      value={morseIV}
                      onChange={(e) => setMorseIV(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border-2 border-[#144272]/40 bg-white text-xs text-[#0A2647] font-medium"
                    >
                      <option value={0}>Não (0 pontos)</option>
                      <option value={20}>Sim (20 pontos)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#0A2647] block mb-1">Marcha / Equilíbrio:</label>
                    <select
                      value={morseGait}
                      onChange={(e) => setMorseGait(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border-2 border-[#144272]/40 bg-white text-xs text-[#0A2647] font-medium"
                    >
                      <option value={0}>Normal / Imóvel (0 pontos)</option>
                      <option value={10}>Fraca (10 pontos)</option>
                      <option value={20}>Comprometida / Cambaleante (20 pontos)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#0A2647] block mb-1">Estado Mental:</label>
                    <select
                      value={morseMental}
                      onChange={(e) => setMorseMental(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border-2 border-[#144272]/40 bg-white text-xs text-[#0A2647] font-medium"
                    >
                      <option value={0}>Consciente das suas limitações (0 pontos)</option>
                      <option value={15}>Superestima capacidade / Esquece limitações (15 pontos)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* SCALE 5: MEOWS */}
            {activeScale === 'meows' && (
              <div className="p-4 rounded-2xl vitta-pearl-white-card space-y-3 animate-fadeIn text-xs">
                <div className="flex items-center justify-between border-b border-[#144272]/20 pb-2">
                  <span className="font-bold text-[#0A2647]">Escore MEOWS (Modified Early Obstetric Warning):</span>
                  <span className="px-2.5 py-1 rounded-full font-bold border text-emerald-700 bg-emerald-50 border-emerald-200">
                    Sinais Vitais Estáveis (Alerta Verde)
                  </span>
                </div>
                <div className="p-3 rounded-xl vitta-pearl-blue-subbar border border-[#144272] text-[11px] text-[#0A2647] font-medium space-y-1">
                  <p><strong>Parâmetros Avaliados:</strong> PAS 110 mmHg, PAD 70 mmHg, FC 78 bpm, FR 18 rpm, Temperatura 36.4°C, Nível de Consciência Alerta, Lóquios/Sangramento Fisiológico.</p>
                  <p className="text-emerald-800 font-bold">Conduta: Manter rotina normal de pré-natal de baixo risco.</p>
                </div>
              </div>
            )}

            {/* SCALE 6: EVA (PAIN SCALE) */}
            {activeScale === 'eva' && (
              <div className="p-4 rounded-2xl vitta-pearl-white-card space-y-4 animate-fadeIn text-xs">
                <div className="flex items-center justify-between border-b border-[#144272]/20 pb-2">
                  <span className="font-bold text-[#0A2647]">Escala Visual Analógica de Dor (EVA):</span>
                  <span className="px-3 py-1 rounded-full font-bold vitta-metallic-blue-badge text-white">
                    Grau {evaPainScore} — {evaPainScore === 0 ? 'Sem Dor' : evaPainScore <= 3 ? 'Dor Leve' : evaPainScore <= 7 ? 'Dor Moderada' : 'Dor Intensa'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-base font-bold text-[#0A2647]">
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
                    className="w-full accent-[#144272] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#144272] font-bold font-mono">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <span key={num}>{num}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2 border-t border-[#144272]/25">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#0A2647] hover:bg-white/70 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveScale}
                className="px-5 py-2 rounded-xl vitta-metallic-blue-badge text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Salvar e Anexar Escala ao Prontuário</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ANAMNESE DIGITAL */}
      {/* ========================================================================= */}
      {activeModal === 'anamnese' && (
        <div className="fixed inset-0 z-50 bg-[#0A2647]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl vitta-pearl-blue-bg rounded-3xl border-2 border-[#144272] shadow-2xl p-6 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#144272]/30 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl vitta-metallic-blue-badge text-white">
                  <UserCheck className="w-5 h-5 text-[#93C5FD]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#0A2647]">
                    Anamnese Digital de Enfermagem
                  </h3>
                  <span className="text-[11px] text-[#144272] font-medium">
                    Paciente: <strong>{activePatientObj.name}</strong> • Coleta de História Clínica & Exame Físico
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full bg-white/80 hover:bg-white text-[#0A2647] border border-[#144272] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {anamneseSaved && (
              <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Anamnese Digital gravada e vinculada ao prontuário de {activePatientObj.name}!</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0A2647] block mb-1">
                    Histórico Obstétrico / Ginecológico (GPA):
                  </label>
                  <input
                    type="text"
                    value={anamneseGpa}
                    onChange={(e) => setAnamneseGpa(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-[#0A2647] font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0A2647] block mb-1">
                    Alergias Medicamentosas / Alimentares:
                  </label>
                  <input
                    type="text"
                    value={anamneseAllergies}
                    onChange={(e) => setAnamneseAllergies(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-[#0A2647] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0A2647] block mb-1">
                  Queixa Principal e História da Moléstia Atual (HMA):
                </label>
                <textarea
                  rows={2}
                  value={anamneseQueixa}
                  onChange={(e) => setAnamneseQueixa(e.target.value)}
                  className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-[#0A2647] font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-[#0A2647] block mb-1">
                  Exame Físico Céfalo-Podálico & Obstétrico/Ginecológico:
                </label>
                <textarea
                  rows={3}
                  value={anamneseExame}
                  onChange={(e) => setAnamneseExame(e.target.value)}
                  className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-[#0A2647] font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-[#144272]/25">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#0A2647] hover:bg-white/70 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAnamnese}
                className="px-5 py-2 rounded-xl vitta-metallic-blue-badge text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
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
        <div className="fixed inset-0 z-50 bg-[#0A2647]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl vitta-pearl-blue-bg rounded-3xl border-2 border-[#144272] shadow-2xl p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b-2 border-[#144272]/30 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl vitta-metallic-blue-badge text-white">
                  <Video className="w-5 h-5 text-[#93C5FD]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#0A2647]">
                    Videochamada Individual Google Meet
                  </h3>
                  <span className="text-[11px] text-[#144272] font-medium">
                    Paciente Selecionada: <strong>{activePatientObj.name}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full bg-white/80 hover:bg-white text-[#0A2647] border border-[#144272] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl vitta-pearl-white-card space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl vitta-metallic-blue-badge text-white flex items-center justify-center shadow-sm">
                  <Video className="w-6 h-6 text-[#93C5FD]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0A2647] block">
                    Sala Individual de Teleconsulta • {activePatientObj.name}
                  </span>
                  <span className="text-[11px] text-[#144272] font-medium">
                    Conexão exclusiva entre {professionalProfile?.displayName || 'Enfermeiro(a)'} e {activePatientObj.name}
                  </span>
                </div>
              </div>

              {/* Link Box */}
              <div className="p-3 rounded-xl vitta-pearl-blue-subbar border border-[#144272] flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-[#0A2647] truncate font-bold">
                  {meetLink}
                </span>
                <button
                  onClick={handleCopyMeetLink}
                  className="px-3 py-1.5 rounded-lg vitta-pearl-button text-[#0A2647] text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* Share to Individual Real-time Chat Button */}
              <button
                onClick={handleShareMeetToChat}
                className="w-full py-2.5 px-4 rounded-xl vitta-pearl-button text-[#0A2647] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#144272]" />
                <span>
                  {meetSharedChat
                    ? `Link Enviado no Chat Individual de ${activePatientObj.name.split(' ')[0]}!`
                    : `Enviar Convite no Chat Individual de ${activePatientObj.name.split(' ')[0]}`}
                </span>
              </button>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-[#144272]/25">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#0A2647] hover:bg-white/70 cursor-pointer"
              >
                Fechar
              </button>
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-xl vitta-metallic-blue-badge text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Entrar na Sala Google Meet</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
