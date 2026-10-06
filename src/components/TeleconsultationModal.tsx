import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Wifi,
  Send,
  Info,
  Loader2,
  Clock,
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { sendRealtimeChatMessage } from '../services/realtimeChat';
import { useFeedback } from '../context/FeedbackContext';

interface TeleconsultationModalProps {
  isOpen?: boolean;
  onClose: () => void;
  doctorName?: string;
  professionalName?: string;
  specialty?: string;
  role?: string;
}

export type TelehealthSessionState =
  | 'AGUARDANDO'
  | 'CONECTANDO'
  | 'EM_ATENDIMENTO'
  | 'FINALIZADO';

export const TeleconsultationModal: React.FC<TeleconsultationModalProps> = ({
  isOpen = true,
  onClose,
  doctorName,
  professionalName,
  specialty,
  role,
}) => {
  const { patient } = usePatient();
  const { showToast } = useFeedback();

  const activeDoctor =
    doctorName ||
    professionalName ||
    patient?.doctorName ||
    'Enf. Marcelo & Enfª. Stephanie (Enfermagem Vittacare)';
  const activeSpecialty =
    specialty || role || 'Enfermagem Obstétrica & Teleorientação';

  // Section 12: Explicit 4 states (AGUARDANDO, CONECTANDO, EM_ATENDIMENTO, FINALIZADO)
  const [sessionState, setSessionState] =
    useState<TelehealthSessionState>('AGUARDANDO');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [hardwareTested, setHardwareTested] = useState(false);
  const [activeTab, setActiveTab] = useState<'checklist' | 'notes' | 'summary'>(
    'checklist'
  );

  const [preChecklist, setPreChecklist] = useState({
    camera: true,
    microphone: true,
    connection: true,
    mainSymptoms: false,
    recentExams: false,
  });

  const [mainComplaint, setMainComplaint] = useState(
    patient?.userMode === 'gestante'
      ? `Revisão da ${patient?.currentWeek || 18}ª semana gestacional, avaliação de movimentos fetais e exames laboratoriais.`
      : 'Acompanhamento do ciclo menstrual, revisão de exames preventivos e orientações.'
  );

  const [sessionNotes, setSessionNotes] = useState(
    '• Pressão arterial aferida em repouso: 110/70 mmHg\n• Hidratação oral recomendada: 2,5L/dia\n• Suplementação mantida conforme prescrição'
  );

  const [callSeconds, setCallSeconds] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSessionState('AGUARDANDO');
      setCallSeconds(0);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (sessionState !== 'CONECTANDO') return;
    const timer = setTimeout(() => {
      setSessionState('EM_ATENDIMENTO');
      setActiveTab('notes');
    }, 1200);
    return () => clearTimeout(timer);
  }, [sessionState]);

  useEffect(() => {
    if (sessionState !== 'EM_ATENDIMENTO') return;
    const interval = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionState]);

  if (!isOpen) return null;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const remSecs = (secs % 60).toString().padStart(2, '0');
    return `${mins}:${remSecs}`;
  };

  const handleTestHardware = async () => {
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        mediaStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
      setHardwareTested(true);
      setPreChecklist((prev) => ({
        ...prev,
        camera: true,
        microphone: true,
        connection: true,
      }));
      showToast({
        title: 'Dispositivos Verificados',
        description:
          'Permissões locais de áudio e vídeo validadas para o ambiente de teleatendimento.',
        tone: 'success',
      });
    } catch {
      setHardwareTested(true);
      showToast({
        title: 'Modo de Áudio/Texto Ativo',
        description:
          'Permissão de câmera opcional não concedida. Você pode prosseguir com áudio e anotações.',
        tone: 'info',
      });
    }
  };

  const handleSendSummaryToChat = async () => {
    const summaryPayload = `📄 [Resumo de Teleorientação Vittacare — FINALIZADO]\nProfissional: ${activeDoctor}\nPaciente: ${patient?.name || 'Paciente'}\nQueixa/Foco: ${mainComplaint}\nAnotações e Conduta:\n${sessionNotes}`;

    await sendRealtimeChatMessage({
      channelId: 'prof-marcelo',
      senderRole: 'paciente',
      senderId: patient?.id || 'paciente-ativa',
      senderName: patient?.name || 'Paciente',
      recipientId: 'prof-marcelo',
      recipientName: activeDoctor,
      patientName: patient?.name || 'Paciente',
      text: summaryPayload,
      category: 'orientacao',
    });

    showToast({
      title: 'Resumo Enviado ao Prontuário & Chat',
      description:
        'As anotações e orientações da teleorientação foram salvas no histórico clínico.',
      tone: 'success',
    });
  };

  const stateSteps: { id: TelehealthSessionState; label: string }[] = [
    { id: 'AGUARDANDO', label: 'AGUARDANDO' },
    { id: 'CONECTANDO', label: 'CONECTANDO' },
    { id: 'EM_ATENDIMENTO', label: 'EM ATENDIMENTO' },
    { id: 'FINALIZADO', label: 'FINALIZADO' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Módulo de Teleatendimento Vittacare"
    >
      <div className="bg-stone-900 border border-[#B89243]/40 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Bar + 4 State Indicator (Section 12) */}
        <div className="bg-stone-950 px-4 sm:px-6 py-3.5 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Teleatendimento Vittaconect 2.0</span>
            </div>
            <span className="text-stone-400 text-xs hidden md:inline">
              · {activeDoctor} ({activeSpecialty})
            </span>
          </div>

          {/* Interactive 4-State Bar: AGUARDANDO | CONECTANDO | EM ATENDIMENTO | FINALIZADO */}
          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 overflow-x-auto">
            {stateSteps.map((st) => {
              const isCurrent = sessionState === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setSessionState(st.id);
                    if (st.id === 'FINALIZADO') setActiveTab('summary');
                    if (st.id === 'AGUARDANDO') setActiveTab('checklist');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                    isCurrent
                      ? st.id === 'EM_ATENDIMENTO'
                        ? 'bg-emerald-600 text-white'
                        : st.id === 'CONECTANDO'
                        ? 'bg-amber-600 text-white'
                        : st.id === 'FINALIZADO'
                        ? 'bg-[#B89243] text-stone-950'
                        : 'bg-[#5D1425] text-[#E6D4AF]'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {sessionState === 'EM_ATENDIMENTO' && (
              <div className="px-3 py-1 rounded-lg bg-stone-800 text-[#E6D4AF] font-mono text-xs font-bold">
                ⏱ {formatDuration(callSeconds)}
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-stone-300 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>

        {/* Transparent Integration Notice (Section 12 compliance: Do NOT fake video) */}
        <div className="bg-stone-900/90 border-b border-stone-800 px-4 sm:px-6 py-2 flex items-center justify-between gap-2 text-stone-300 text-xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#E6D4AF] shrink-0" />
            <span>
              <strong>Infraestrutura de Teleatendimento:</strong> Interface preparada para integração com provedor externo de vídeo (WebRTC / Daily / Twilio). Utilize o checklist pré-consulta e o registro estruturado de orientações.
            </span>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* Left Column: Stage View (7 cols) */}
          <div className="lg:col-span-7 bg-gradient-to-b from-stone-900 via-[#2a0810] to-stone-950 p-5 flex flex-col justify-between relative min-h-[350px]">
            {sessionState === 'AGUARDANDO' && (
              <div className="my-auto text-center max-w-md mx-auto space-y-4 animate-fadeIn">
                <div className="w-18 h-18 rounded-2xl bg-[#5D1425] border border-[#E6D4AF]/40 mx-auto flex items-center justify-center shadow-lg">
                  <Clock className="w-8 h-8 text-[#E6D4AF]" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E6D4AF]">
                    Estado Atual: AGUARDANDO
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Sala de Espera & Preparação
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Preencha o checklist pré-consulta ao lado e valide seus dispositivos antes de iniciar a conexão com <strong>{activeDoctor}</strong>.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleTestHardware}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-[#E6D4AF] border border-[#B89243]/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Wifi className="w-4 h-4 text-emerald-400" />
                    <span>
                      {hardwareTested
                        ? '✓ Dispositivos Validados'
                        : 'Testar Áudio & Câmera Local'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSessionState('CONECTANDO')}
                    className="px-5 py-2.5 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2 border border-[#E6D4AF]/30"
                  >
                    <Video className="w-4 h-4 text-[#E6D4AF]" />
                    <span>Iniciar Conexão</span>
                  </button>
                </div>
              </div>
            )}

            {sessionState === 'CONECTANDO' && (
              <div className="my-auto text-center max-w-md mx-auto space-y-4 animate-fadeIn">
                <div className="w-18 h-18 rounded-2xl bg-amber-500/20 border border-amber-400/50 mx-auto flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-amber-300 animate-spin" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                    Estado Atual: CONECTANDO
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Sincronizando Prontuário & Sala...
                  </h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Preparando o resumo clínico de {patient?.name || 'Paciente'} e preparando o canal seguro com {activeDoctor}.
                </p>
              </div>
            )}

            {sessionState === 'EM_ATENDIMENTO' && (
              <div className="my-auto text-center space-y-4 animate-fadeIn">
                <div className="w-20 h-20 rounded-2xl bg-[#5D1425] border-2 border-[#E6D4AF]/50 mx-auto flex items-center justify-center text-xl font-serif font-bold text-[#E6D4AF] shadow-xl">
                  {activeDoctor.split(' ')[0]?.[0] || 'E'}
                  {activeDoctor.split(' ')[1]?.[0] || 'M'}
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 block">
                    Estado Atual: EM ATENDIMENTO
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    {activeDoctor}
                  </h3>
                  <p className="text-xs text-[#E6D4AF]/80">{activeSpecialty}</p>
                </div>

                <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-stone-950/90 border border-stone-800 text-left space-y-1.5">
                  <span className="text-[10px] font-bold text-[#E6D4AF] uppercase tracking-wider block">
                    Foco Clínico Registrado para este Atendimento:
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {mainComplaint}
                  </p>
                  <p className="text-[11px] text-stone-400 pt-1 border-t border-stone-800">
                    Módulo de vídeo pronto para conexão WebRTC. Utilize o painel ao lado para registrar orientações em tempo real.
                  </p>
                </div>
              </div>
            )}

            {sessionState === 'FINALIZADO' && (
              <div className="my-auto text-center max-w-md mx-auto space-y-4 animate-fadeIn">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E6D4AF] block">
                    Estado Atual: FINALIZADO
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Atendimento Finalizado
                  </h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  O resumo do atendimento e suas anotações estão prontos. Envie para o canal da equipe de enfermagem para arquivamento em prontuário.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleSendSummaryToChat}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Resumo ao Chat da Enfermagem</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionState('AGUARDANDO')}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer"
                  >
                    Reabrir Preparação
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="mt-6 pt-4 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-stone-800 border border-[#E6D4AF]/30 flex items-center justify-center text-xs font-bold text-[#E6D4AF]">
                  {isCamOff ? (
                    <VideoOff className="w-4 h-4 text-stone-500" />
                  ) : (
                    patient?.preferredName?.[0] || 'M'
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {patient?.preferredName || 'Paciente'} (Paciente)
                  </span>
                  <span className="text-[11px] text-stone-400 block">
                    {patient?.userMode === 'gestante'
                      ? `${patient?.currentWeek || 18}ª Semana Gestacional`
                      : 'Saúde Integral da Mulher'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  aria-label={
                    isMicMuted ? 'Ativar microfone' : 'Silenciar microfone'
                  }
                  className={`p-3 rounded-xl transition-all cursor-pointer ${
                    isMicMuted
                      ? 'bg-rose-600 text-white'
                      : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                  }`}
                >
                  {isMicMuted ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCamOff(!isCamOff)}
                  aria-label={isCamOff ? 'Ativar câmera' : 'Desativar câmera'}
                  className={`p-3 rounded-xl transition-all cursor-pointer ${
                    isCamOff
                      ? 'bg-rose-600 text-white'
                      : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                  }`}
                >
                  {isCamOff ? (
                    <VideoOff className="w-4 h-4" />
                  ) : (
                    <Video className="w-4 h-4" />
                  )}
                </button>

                {sessionState === 'EM_ATENDIMENTO' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSessionState('FINALIZADO');
                      setActiveTab('summary');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>Finalizar Atendimento</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Checklist, Notes & Summary (5 cols) */}
          <div className="lg:col-span-5 bg-[#FDFBF7] text-stone-800 flex flex-col border-t lg:border-t-0 lg:border-l border-stone-800">
            <div className="grid grid-cols-3 bg-[#FAF0F2] p-1.5 border-b border-[#EBBEC8]">
              <button
                type="button"
                onClick={() => setActiveTab('checklist')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  activeTab === 'checklist'
                    ? 'bg-[#5D1425] text-white shadow-xs'
                    : 'text-[#5D1425] hover:bg-white/60'
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Pré-Consulta</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  activeTab === 'notes'
                    ? 'bg-[#5D1425] text-white shadow-xs'
                    : 'text-[#5D1425] hover:bg-white/60'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Anotações</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  activeTab === 'summary'
                    ? 'bg-[#5D1425] text-white shadow-xs'
                    : 'text-[#5D1425] hover:bg-white/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resumo Final</span>
              </button>
            </div>

            <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
              {activeTab === 'checklist' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#480D1B] mb-1">
                      Checklist Pré-Atendimento
                    </h4>
                    <p className="text-xs text-stone-600">
                      Confirme os itens abaixo para agilizar sua avaliação clínica:
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        key: 'camera' as const,
                        label: 'Ambiente silencioso e iluminado preparado',
                      },
                      {
                        key: 'microphone' as const,
                        label: 'Áudio e microfone verificados',
                      },
                      {
                        key: 'connection' as const,
                        label: 'Conexão de internet estável',
                      },
                      {
                        key: 'mainSymptoms' as const,
                        label: 'Sintomas principais e dúvidas registrados',
                      },
                      {
                        key: 'recentExams' as const,
                        label: 'Exames recentes e Cartão Pré-Natal em mãos',
                      },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E6D4AF] text-xs font-semibold text-stone-800 cursor-pointer hover:bg-[#FAF6ED]"
                      >
                        <input
                          type="checkbox"
                          checked={preChecklist[item.key]}
                          onChange={(e) =>
                            setPreChecklist((prev) => ({
                              ...prev,
                              [item.key]: e.target.checked,
                            }))
                          }
                          className="rounded accent-[#5D1425]"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#480D1B] block mb-1">
                      Sintomas Principais / Dúvidas para a Consulta:
                    </label>
                    <textarea
                      rows={3}
                      value={mainComplaint}
                      onChange={(e) => setMainComplaint(e.target.value)}
                      className="w-full p-3 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#5D1425]"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-3 animate-fadeIn">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#480D1B] mb-1">
                      Anotações Durante o Atendimento
                    </h4>
                    <p className="text-xs text-stone-600">
                      Registre orientações da enfermagem, valores de pressão ou ajustes de rotina:
                    </p>
                  </div>

                  <textarea
                    rows={8}
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-[#E6D4AF] text-xs sm:text-sm bg-white focus:outline-none focus:border-[#5D1425] leading-relaxed"
                  />
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3.5 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF] space-y-2">
                    <span className="text-xs font-bold text-[#480D1B] uppercase tracking-wider block">
                      Resumo Pós-Atendimento & Conduta
                    </span>
                    <div className="text-xs text-stone-700 space-y-1">
                      <p>
                        <strong>Paciente:</strong> {patient?.name || 'Paciente'}
                      </p>
                      <p>
                        <strong>Profissional:</strong> {activeDoctor}
                      </p>
                      <p>
                        <strong>Motivo Principal:</strong> {mainComplaint}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#E6D4AF] text-xs text-stone-800 whitespace-pre-wrap">
                      <strong>Conduta e Orientações:</strong>
                      {'\n'}
                      {sessionNotes}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendSummaryToChat}
                    className="w-full py-3 px-4 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Salvar e Enviar Orientações para o Chat</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
