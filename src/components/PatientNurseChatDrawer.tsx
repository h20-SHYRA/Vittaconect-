import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Send,
  Users,
  MessageSquare,
  CheckCheck,
  Sparkles,
  Stethoscope,
  ShieldCheck,
  Search,
  Pin,
  FileText,
  AlertTriangle,
  Tag,
  Paperclip,
} from 'lucide-react';
import { useAuth, CLINICAL_PROFESSIONALS } from '../context/AuthContext';
import { usePatient } from '../context/PatientContext';
import {
  RealtimeChatMessage,
  ChatMessageCategory,
  CHAT_CATEGORY_META,
  subscribeToRealtimeChat,
  sendRealtimeChatMessage,
  togglePinRealtimeMessage,
} from '../services/realtimeChat';
import { NursingCrest } from './NursingCrest';

interface PatientNurseChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialChannel?: string;
  onOpenTelehealth?: () => void;
}

export const PatientNurseChatDrawer: React.FC<PatientNurseChatDrawerProps> = ({
  isOpen,
  onClose,
  initialChannel = 'group',
}) => {
  const { currentUser } = useAuth();
  const { patient } = usePatient();

  const [activeChannel, setActiveChannel] = useState<string>(initialChannel);
  const [messages, setMessages] = useState<RealtimeChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<ChatMessageCategory>('duvida');
  const [filterCategory, setFilterCategory] = useState<ChatMessageCategory | 'all'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showTriageHelper, setShowTriageHelper] = useState(false);
  const [showAttachmentPicker, setShowAttachmentPicker] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialChannel) {
      setActiveChannel(initialChannel);
    }
  }, [initialChannel]);

  useEffect(() => {
    const unsubscribe = subscribeToRealtimeChat((updatedMsgs) => {
      setMessages(updatedMsgs);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, activeChannel, isOpen]);

  const channelMessages = useMemo(() => {
    return messages.filter((m) => {
      if (m.channelId !== activeChannel) return false;
      if (filterCategory !== 'all' && (m.category || 'duvida') !== filterCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.text.toLowerCase().includes(q) ||
          m.senderName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [messages, activeChannel, filterCategory, searchQuery]);

  const pinnedMessages = useMemo(
    () => messages.filter((m) => m.channelId === activeChannel && m.isPinned),
    [messages, activeChannel]
  );

  if (!isOpen) return null;

  const activeNurse = CLINICAL_PROFESSIONALS.find((p) => p.uid === activeChannel);

  const handleSendMessage = async (
    e?: React.FormEvent,
    customText?: string,
    customCat?: ChatMessageCategory
  ) => {
    if (e) e.preventDefault();
    const trimmed = (customText ?? inputText).trim();
    if (!trimmed) return;

    setSending(true);
    if (!customText) setInputText('');

    const targetRecipientId = activeChannel === 'group' ? 'group' : activeChannel;
    const targetRecipientName =
      activeChannel === 'group'
        ? 'Equipe de Enfermagem Vittacare'
        : activeNurse?.displayName || 'Enfermagem';

    await sendRealtimeChatMessage({
      channelId: activeChannel,
      senderRole: 'paciente',
      senderId: currentUser?.uid || patient?.id || 'paciente-ativa',
      senderName: patient?.name || 'Mariana Silva Santos',
      recipientId: targetRecipientId,
      recipientName: targetRecipientName,
      patientName: patient?.name || 'Mariana Silva Santos',
      patientId: patient?.id,
      text: trimmed,
      category: customCat || selectedCategory,
      triagePriority:
        (customCat || selectedCategory) === 'urgente' ? 'urgent' : 'routine',
    });

    setSending(false);
    setShowTriageHelper(false);
  };

  const handleShareClinicalSummary = async () => {
    const summaryText =
      patient?.userMode === 'gestante'
        ? `📋 [Resumo Pré-Natal Compartilhado] Gestante: ${patient?.name || 'Paciente'} • ${patient?.currentWeek || 18}ª Semana (DPP: ${patient?.dueDate || 'A definir'}) • Bebê: ${patient?.babyNickname || 'Bebê'} • Tipo Sanguíneo: ${patient?.bloodType || 'O+'} • Alergias: ${patient?.allergies || 'Nenhuma'}. Solicito revisão da equipe.`
        : `📋 [Resumo Saúde da Mulher Compartilhado] Paciente: ${patient?.name || 'Paciente'} • Ciclo: ${patient?.cycleDurationDays || 28} dias (DUM: ${patient?.lastPeriodDate || 'Recente'}) • Método: ${patient?.contraceptiveMethod || 'Não informado'} • Alergias: ${patient?.allergies || 'Nenhuma'}.`;

    await handleSendMessage(undefined, summaryText, 'exame');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn font-sans"
      role="dialog"
      aria-modal="true"
      aria-label="Central de Chat Clínico com Enfermagem"
    >
      <div className="w-full max-w-2xl bg-[#FDFBF7] h-full flex flex-col shadow-2xl border-l border-[#E6D4AF] overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#5D1425] via-[#480D1B] to-[#3D0A16] p-4 sm:p-5 text-[#E6D4AF] border-b border-[#B89243]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <NursingCrest size="md" variant="gold" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-tight">
                  Central de Chat com a Enfermagem
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Tempo Real
                </span>
              </div>
              <p className="text-xs text-[#E6D4AF]/80 mt-0.5">
                Comunicação segura 1:1 ou Geral • Enf. Marcelo, Enfª. Letícia, Enfª. Bianca e Enfª. Stephanie
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar chat"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#E6D4AF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Switcher Tabs: Geral vs Individual 1:1 */}
        <div className="bg-[#FAF0F2] border-b border-[#EBBEC8] px-3 py-2.5 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5D1425] block mb-1.5 px-1">
            Escolha o Canal de Atendimento (Grupo ou 1:1 Individual):
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              type="button"
              onClick={() => setActiveChannel('group')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border ${
                activeChannel === 'group'
                  ? 'bg-[#5D1425] text-[#E6D4AF] border-[#5D1425] shadow-sm'
                  : 'bg-white text-[#480D1B] border-[#EBBEC8] hover:bg-white/80'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Chat Geral (4 Enfermeiros)</span>
            </button>

            {CLINICAL_PROFESSIONALS.map((prof) => {
              const isSelected = activeChannel === prof.uid;
              const unreadOrCount = messages.filter(
                (m) => m.channelId === prof.uid
              ).length;
              return (
                <button
                  key={prof.uid}
                  type="button"
                  onClick={() => setActiveChannel(prof.uid)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#5D1425] text-[#E6D4AF] border-[#5D1425] shadow-sm'
                      : 'bg-white text-[#480D1B] border-[#EBBEC8] hover:bg-white/80'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{prof.displayName} (1:1)</span>
                  {unreadOrCount > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-[#FAF0F2] text-[#8D253D]'
                      }`}
                    >
                      {unreadOrCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Channel Banner + Search & Category Filter */}
        <div className="bg-[#FAF6ED] border-b border-[#E6D4AF] px-4 py-2.5 space-y-2 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#8D253D]" />
              {activeChannel === 'group' ? (
                <span className="text-xs font-bold text-[#480D1B]">
                  Canal Coletivo: Todos os 4 enfermeiros recebem e respondem sua mensagem
                </span>
              ) : (
                <span className="text-xs font-bold text-[#480D1B]">
                  Chat Individual Privado (1:1) com{' '}
                  <strong className="text-[#8D253D]">
                    {activeNurse?.displayName}
                  </strong>{' '}
                  • {activeNurse?.specialty}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowAttachmentPicker(!showAttachmentPicker)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#FAF0F2] text-[#5D1425] border border-[#E6D4AF] text-[11px] font-bold transition-colors cursor-pointer"
                title="Anexar exame, receita, atestado ou documento ao chat"
              >
                <Paperclip className="w-3 h-3 text-[#8D253D]" />
                <span>Anexar Documento</span>
              </button>
              <button
                type="button"
                onClick={handleShareClinicalSummary}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#FAF0F2] text-[#5D1425] border border-[#E6D4AF] text-[11px] font-bold transition-colors cursor-pointer"
                title="Enviar resumo atualizado do seu cartão clínico para a enfermagem"
              >
                <FileText className="w-3 h-3 text-[#8D253D]" />
                <span>Cartão Clínico</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar em mensagens ou orientações..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#E6D4AF] text-xs text-stone-800 focus:outline-none focus:border-[#5D1425]"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {(
                [
                  { id: 'all', label: 'Todas' },
                  { id: 'orientacao', label: 'Orientações' },
                  { id: 'duvida', label: 'Dúvidas' },
                  { id: 'exame', label: 'Exames' },
                  { id: 'sintoma', label: 'Sintomas' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer transition-colors ${
                    filterCategory === cat.id
                      ? 'bg-[#5D1425] text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Document & Attachment Picker (Section 11) */}
          {showAttachmentPicker && (
            <div className="p-2.5 rounded-xl bg-white border border-[#E6D4AF] space-y-1.5 animate-fadeIn">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#480D1B]">
                <span>Escolha um documento ou exame para anexar na conversa:</span>
                <button
                  type="button"
                  onClick={() => setShowAttachmentPicker(false)}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  {
                    title: '📎 Exame: Hemograma, Ferritina & Glicemia (02/10)',
                    text: '📎 [Anexo de Exame Laboratorial]\nDocumento: Laudo Hemograma, Ferritina (48 ng/mL) e Glicemia de Jejum (82 mg/dL).\nSolicito revisão da equipe de enfermagem.',
                  },
                  {
                    title: '📎 Exame: Ultrassom Morfológico 2º Trimestre',
                    text: '📎 [Anexo de Exame de Imagem]\nDocumento: Guia / Laudo de Ultrassonografia Morfológica de 2º Trimestre com Doppler.',
                  },
                  {
                    title: '📎 Receita: Suplementação Materna / Ginecológica',
                    text: '📎 [Anexo de Receita Clínica]\nDocumento: Receituário de Suplementação (Ferro Quelato + Metilfolato + Vitamina D3). Gostaria de confirmar posologia.',
                  },
                  {
                    title: '📎 Documento: Plano de Parto / Atestado',
                    text: '📎 [Anexo de Documento Clínico]\nDocumento: Plano de Parto Humanizado & Declaração de Comparecimento Vittacare.',
                  },
                ].map((doc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={async () => {
                      setShowAttachmentPicker(false);
                      await handleSendMessage(undefined, doc.text, 'exame');
                    }}
                    className="text-left p-2 rounded-lg bg-[#FAF6ED]/70 hover:bg-[#FAF0F2] border border-[#E6D4AF] text-[11px] font-semibold text-[#480D1B] transition-colors cursor-pointer truncate"
                  >
                    {doc.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pinned Important Messages Banner */}
        {pinnedMessages.length > 0 && (
          <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-2 flex items-start gap-2 shrink-0">
            <Pin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                Orientação Fixada pela Enfermagem ({pinnedMessages.length})
              </span>
              <p className="text-xs text-amber-950 truncate">
                <strong>
                  {pinnedMessages[pinnedMessages.length - 1].senderName}:
                </strong>{' '}
                {pinnedMessages[pinnedMessages.length - 1].text}
              </p>
            </div>
          </div>
        )}

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FDFBF7]">
          {channelMessages.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              Nenhuma mensagem encontrada para este filtro. Envie uma dúvida abaixo!
            </div>
          ) : (
            channelMessages.map((msg) => {
              const isPatientMsg = msg.senderRole === 'paciente';
              const catMeta =
                CHAT_CATEGORY_META[msg.category || 'duvida'] ||
                CHAT_CATEGORY_META.duvida;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isPatientMsg ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs border transition-all ${
                      isPatientMsg
                        ? 'bg-[#5D1425] text-white border-[#480D1B] rounded-br-xs'
                        : 'bg-white text-stone-800 border-[#E6D4AF] rounded-bl-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <span
                        className={`text-[11px] font-bold ${
                          isPatientMsg ? 'text-[#E6D4AF]' : 'text-[#8D253D]'
                        }`}
                      >
                        {isPatientMsg
                          ? `${msg.senderName} (Você)`
                          : `🩺 ${msg.senderName}`}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-md border ${
                            isPatientMsg
                              ? 'bg-white/15 text-white border-white/20'
                              : catMeta.badgeClass
                          }`}
                        >
                          {catMeta.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = togglePinRealtimeMessage(msg.id);
                            setMessages(updated);
                          }}
                          title={
                            msg.isPinned
                              ? 'Desafixar mensagem'
                              : 'Fixar mensagem importante'
                          }
                          className={`p-0.5 rounded hover:bg-black/10 cursor-pointer ${
                            msg.isPinned
                              ? 'text-amber-400'
                              : isPatientMsg
                              ? 'text-white/50'
                              : 'text-stone-400'
                          }`}
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>

                    <div className="flex items-center justify-end gap-1.5 mt-2 opacity-80">
                      <span className="text-[10px]">{msg.createdAt}</span>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[9px]">
                        {msg.deliveryStatus === 'sent'
                          ? 'Enviado'
                          : 'Entregue'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Pre-Chat Triage Helper Drawer (Collapsible) */}
        {showTriageHelper && (
          <div className="bg-rose-50/90 border-t border-rose-200 px-4 py-3 space-y-2 shrink-0 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-700" />
                Triagem Rápida Antes do Chat — Escolha um Relato Estruturado:
              </span>
              <button
                type="button"
                onClick={() => setShowTriageHelper(false)}
                className="text-xs text-rose-700 font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {[
                {
                  cat: 'sintoma' as ChatMessageCategory,
                  label: 'Relatar sintoma não urgente (náusea, cansaço, dor leve)',
                  text: 'Olá equipe! Gostaria de relatar um sintoma leve que comecei a sentir hoje para orientação de enfermagem.',
                },
                {
                  cat: 'exame' as ChatMessageCategory,
                  label: 'Dúvida sobre resultado de exame ou ultrassom',
                  text: 'Olá! Recebi o resultado de um exame recente e gostaria de saber se devo antecipar minha revisão.',
                },
                {
                  cat: 'retorno' as ChatMessageCategory,
                  label: 'Orientação sobre preparo de consulta ou vacina',
                  text: 'Olá! Gostaria de confirmar o preparo necessário para minha próxima consulta/vacina agendada.',
                },
                {
                  cat: 'urgente' as ChatMessageCategory,
                  label: '🚨 Sinal de Alerta (Pressão alta, sangramento, febre)',
                  text: '🚨 [SINAL DE ALERTA] Estou apresentando um sintoma agudo de alerta e preciso de avaliação prioritária da enfermagem.',
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(undefined, item.text, item.cat)}
                  className="text-left p-2 rounded-xl bg-white hover:bg-rose-100/60 border border-rose-200 text-[11px] font-semibold text-stone-800 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input Bar with Category Selector */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 bg-white border-t border-[#E6D4AF] space-y-2 shrink-0"
        >
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#8D253D] shrink-0" />
              <span className="text-[10px] font-bold text-stone-500 mr-1">
                Assunto:
              </span>
              {(
                [
                  { id: 'duvida', label: 'Dúvida' },
                  { id: 'sintoma', label: 'Sintoma' },
                  { id: 'exame', label: 'Exame' },
                  { id: 'retorno', label: 'Retorno' },
                  { id: 'urgente', label: '🚨 Alerta' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#5D1425] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowTriageHelper(!showTriageHelper)}
              className="text-[10px] font-bold text-[#8D253D] hover:underline shrink-0 cursor-pointer"
            >
              {showTriageHelper ? 'Ocultar Triagem' : '+ Triagem Rápida'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeChannel === 'group'
                  ? 'Escreva para o Chat Geral da Enfermagem...'
                  : `Escreva para ${activeNurse?.displayName} (1:1)...`
              }
              className="flex-1 px-4 py-3 rounded-2xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] bg-[#FDFBF7]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || sending}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#5D1425] to-[#8D253D] hover:from-[#480D1B] hover:to-[#5D1425] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
