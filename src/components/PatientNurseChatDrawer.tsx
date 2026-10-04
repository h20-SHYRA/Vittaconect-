import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  Video,
  Volume2,
  UserCheck,
  Lock
} from 'lucide-react';
import { 
  useRealtimeChat, 
  useChatDirectory, 
  buildIndividualChatChannelId,
  ChatProfessionalContact
} from '../services/realtimeChat';
import { usePatient } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { NursingCrest } from './NursingCrest';

interface PatientNurseChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTelehealth?: () => void;
}

export const PatientNurseChatDrawer: React.FC<PatientNurseChatDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { patient } = usePatient();
  const { currentUser } = useAuth();
  const { professionals } = useChatDirectory();

  const patientName = patient?.name || currentUser?.displayName || 'Mariana Silva Santos';
  const patientShortName = patient?.preferredName || patientName.split(' ')[0] || 'Mariana';
  const isGestante = patient?.userMode !== 'saude_feminina';
  const patientIdentifier = currentUser?.email || patient?.name || patient?.id || 'mariana.silva@email.com';

  // Default to the first professional or the one matching the patient's mode
  const [selectedProf, setSelectedProf] = useState<ChatProfessionalContact>(() => {
    if (!isGestante) {
      return professionals.find((p) => p.name.includes('Bianca')) || professionals[0];
    }
    return professionals[0];
  });

  // Keep selectedProf valid if professionals list updates
  useEffect(() => {
    if (professionals.length > 0 && !professionals.some((p) => p.id === selectedProf.id)) {
      setSelectedProf(professionals[0]);
    }
  }, [professionals, selectedProf.id]);

  // Unique 1-on-1 channel ID between this specific professional and this specific patient
  const individualChannelId = buildIndividualChatChannelId(
    selectedProf.email || selectedProf.id,
    patientIdentifier
  );

  const { messages, loading, sendMessage } = useRealtimeChat(individualChannelId, {
    professionalId: selectedProf.id,
    professionalName: selectedProf.name,
    professionalSpecialty: selectedProf.specialty,
    patientId: patientIdentifier,
    patientName: patientName,
    patientSummary: isGestante ? `${patient?.currentWeek || 18}ª Semana` : 'Saúde da Mulher',
  });

  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, individualChannelId]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    const sent = await sendMessage(
      inputText.trim(),
      'paciente',
      `${patientShortName} (${isGestante ? `${patient?.currentWeek || 18}ª Sem` : 'Saúde Mulher'})`,
      patientIdentifier,
      selectedProf.id,
      selectedProf.name
    );
    if (sent) {
      setInputText('');
    }
    setSending(false);
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.98;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-[#FDFBF7] h-full flex flex-col shadow-2xl border-l-2 border-[#0B192C] relative">
        {/* TOP BAR: Pearl Light Blue Header with Dark Metallic Blue Borders */}
        <div className="bg-gradient-to-r from-[#FAFCFE] via-[#F0F6FA] to-[#E2EEF5] text-[#0B192C] p-4 sm:p-5 flex items-center justify-between border-b-2 border-[#0B192C]/20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-2xl bg-white border-2 border-[#0B192C] shadow-2xs">
              <NursingCrest size="sm" variant="gold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-base text-[#0B192C]">
                  Chat Individual • {selectedProf.name}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[11px] text-slate-600 block">
                {selectedProf.specialty} • {selectedProf.councilNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Google Meet video call button */}
            <a
              href="https://meet.google.com/vit-care-obst"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#EBF3F8] text-[#0B192C] text-xs font-bold border-2 border-[#0B192C] shadow-2xs transition-all cursor-pointer"
              title="Abrir sala individual no Google Meet"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Video className="w-3.5 h-3.5 text-[#1E3E62]" />
              <span className="hidden sm:inline">Google Meet</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Fechar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PROFESSIONAL SELECTOR FOR INDIVIDUAL 1-ON-1 CHAT */}
        <div className="bg-[#F0F6FA] px-4 py-2.5 border-b border-[#CBD5E1] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#0B192C]">
            <span className="font-bold flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-[#1E3E62]" />
              Escolha o(a) Profissional para Conversa Individual:
            </span>
            <span className="text-[10px] text-slate-600 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              Privado 1:1
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {professionals.map((prof) => {
              const isSelected = prof.id === selectedProf.id;
              return (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => setSelectedProf(prof)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border-2 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0B192C] text-white border-[#0B192C] shadow-xs'
                      : 'bg-white text-[#0B192C] border-[#0B192C]/40 hover:border-[#0B192C]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${prof.onDuty ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span>{prof.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECURITY & ACOLHIMENTO BANNER */}
        <div className="bg-[#EBF3F8] px-4 py-2 border-b border-[#CBD5E1] flex items-center justify-between text-xs text-[#0B192C]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-[11px]">
              Conversa exclusiva entre <strong>{patientShortName}</strong> e <strong>{selectedProf.name}</strong>
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold">Firestore 1:1</span>
        </div>

        {/* MESSAGES LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF6ED]/30">
          {loading && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400 space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#5D1425] border-t-transparent animate-spin" />
              <span className="text-xs">Conectando ao canal individual com {selectedProf.name}...</span>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderRole === 'paciente';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 animate-fadeIn`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-500 px-1">
                    {!isMe && (
                      <span className="font-bold text-[#0B192C] flex items-center gap-1">
                        <NursingCrest size="sm" variant="silver" />
                        {msg.senderName}
                      </span>
                    )}
                    {isMe && <span className="font-bold text-[#8D253D]">Você ({patientShortName})</span>}
                    <span>• {msg.timeString}</span>
                    <button
                      type="button"
                      onClick={() => speakMessage(`${isMe ? 'Você disse' : msg.senderName + ' disse'}: ${msg.text}`)}
                      className="p-1 rounded hover:bg-stone-200 text-stone-600 cursor-pointer"
                      title="Ouvir mensagem em voz alta (Acessibilidade)"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-[#5D1425] to-[#8D253D] text-white rounded-br-xs'
                        : 'bg-white border-2 border-[#0B192C] text-[#0B192C] rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-[#CBD5E1] flex items-center gap-2">
          <input
            type="text"
            placeholder={`Mensagem privada para ${selectedProf.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={sending}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] focus:ring-1 focus:ring-[#5D1425] bg-stone-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="p-3 rounded-2xl bg-gradient-to-r from-[#5D1425] to-[#8D253D] hover:from-[#480D1B] hover:to-[#5D1425] text-white shadow-md disabled:opacity-40 transition-all cursor-pointer"
            title="Enviar mensagem privada"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
