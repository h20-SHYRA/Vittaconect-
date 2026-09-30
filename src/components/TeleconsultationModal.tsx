import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  Send, 
  Sparkles,
  Maximize2,
  Volume2
} from 'lucide-react';
import { VittacareLogo } from './VittacareLogo';
import { usePatient } from '../context/PatientContext';

interface TeleconsultationModalProps {
  onClose: () => void;
  professionalName?: string;
  role?: string;
}

export const TeleconsultationModal: React.FC<TeleconsultationModalProps> = ({
  onClose,
  professionalName = 'Enf. Carla Soares',
  role = 'Enfermeira Especialista em Saúde Materna',
}) => {
  const { patient } = usePatient();
  const motherName = patient?.preferredName || patient?.name?.split(' ')[0] || 'Mãezinha';
  const babyName = patient?.babyNickname || 'Bebê';
  const weekNumber = patient?.currentWeek || 16;

  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string; isDoctor: boolean }>>([
    {
      sender: 'Enf. Carla Soares',
      text: `Olá, ${motherName}! Seja bem-vinda à nossa sala virtual Vittaconect. Como você e o bebê ${babyName} estão se sentindo hoje na ${weekNumber}ª semana?`,
      time: '16:01',
      isDoctor: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = {
      sender: motherName,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDoctor: false,
    };

    setMessages((prev) => [...prev, userMsg]);
    setNewMessage('');

    // Simulated warm, empathetic clinical response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: professionalName,
          text: 'Compreendo perfeitamente, Mariana. É muito comum nessa fase sentir essa sensação e leve peso lombar. Vamos revisar a sua postura e o fortalecimento pélvico!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDoctor: true,
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4">
      <div className="bg-[#1C1618] text-white rounded-3xl w-full max-w-5xl h-[92vh] max-h-[800px] flex flex-col overflow-hidden border border-[#E6D4AF]/30 shadow-2xl relative">
        {/* Top Room Bar */}
        <div className="px-4 sm:px-6 py-3 bg-[#2A1D22] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VittacareLogo size="sm" inverted />
            <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#417C55] animate-ping" />
              <span className="text-xs font-semibold text-[#E6D4AF]">
                Sala Vittaconect Criptografada
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-300 bg-white/10 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E6D4AF]" />
              <span>Conexão Segura E2E</span>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white text-xs px-2.5 py-1 rounded-lg border border-white/20 transition-colors cursor-pointer"
            >
              Minimizar
            </button>
          </div>
        </div>

        {/* Video Area + Sidebar Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Main Video Stream */}
          <div className="lg:col-span-8 bg-[#120D0E] relative flex items-center justify-center p-4">
            {/* Professional Video Mockup */}
            <div className="w-full h-full rounded-2xl bg-gradient-to-b from-[#2E1820] to-[#1A0E13] flex flex-col items-center justify-center relative overflow-hidden border border-white/10">
              {/* Subtle ambient lighting */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#B89243]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Doctor / Nurse Avatar Frame */}
              <div className="flex flex-col items-center text-center p-6 z-10">
                <div className="relative mb-4">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-[#B89243] via-[#FAF0F2] to-[#FAF6ED] p-1 shadow-xl">
                    <div className="w-full h-full rounded-full bg-[#480D1B] flex items-center justify-center text-3xl font-serif font-bold text-[#E6D4AF]">
                      CS
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-[#417C55] border-2 border-[#120D0E]" />
                </div>

                <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                  {professionalName}
                </h3>
                <p className="text-xs text-[#E6D4AF] mt-0.5">{role}</p>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full mt-3">
                  <Volume2 className="w-3.5 h-3.5" />
                  Áudio da profissional conectado
                </span>
              </div>

              {/* Patient Self-View (Picture-in-Picture) */}
              <div className="absolute bottom-4 right-4 w-32 sm:w-44 h-24 sm:h-32 rounded-xl bg-stone-900 border-2 border-[#B89243]/60 shadow-xl overflow-hidden flex flex-col items-center justify-center">
                {cameraActive ? (
                  <div className="w-full h-full bg-[#3D252C] flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-xs font-semibold text-white">Mariana</span>
                    <span className="text-[10px] text-[#E6D4AF]">Câmera Ativa</span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-stone-800 flex flex-col items-center justify-center text-stone-400">
                    <VideoOff className="w-5 h-5 mb-1 text-stone-500" />
                    <span className="text-[10px]">Câmera desligada</span>
                  </div>
                )}
                <div className="absolute top-1 left-1.5 text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-white">
                  Você
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Chat & Clinical Notes */}
          <div className="hidden lg:flex lg:col-span-4 bg-[#23181C] border-l border-white/10 flex-col">
            {/* Panel Tabs */}
            <div className="flex border-b border-white/10 text-xs">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'chat'
                    ? 'text-[#E6D4AF] border-b-2 border-[#B89243] bg-white/5'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat ao Vivo
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-3 font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'notes'
                    ? 'text-[#E6D4AF] border-b-2 border-[#B89243] bg-white/5'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Orientações
              </button>
            </div>

            {/* Chat Content */}
            {activeTab === 'chat' ? (
              <div className="flex-1 flex flex-col p-4 overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${msg.isDoctor ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mb-0.5">
                        <span className="font-semibold text-[#E6D4AF]">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                          msg.isDoctor
                            ? 'bg-[#352229] text-stone-200 border border-white/10'
                            : 'bg-[#B89243] text-stone-950 font-medium'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escreva sua dúvida..."
                    className="flex-1 px-3 py-2.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-[#B89243]"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-[#B89243] hover:bg-[#CAA55C] text-[#2C0610] transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-4 space-y-4 text-xs text-stone-300 overflow-y-auto">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-[#E6D4AF] mb-1">
                    Checklist Pré-natal Vittacare
                  </h4>
                  <ul className="space-y-1.5 text-stone-300">
                    <li>✓ Idade gestacional confirmada: 18 semanas</li>
                    <li>✓ Próximo ultrassom morfológico agendado para 22/10</li>
                    <li>✓ Iniciar série de respiração diafragmática 1x ao dia</li>
                    <li>✓ Manter ingestão hídrica de 2 litros/dia</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="px-6 py-4 bg-[#23181C] border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-stone-400 hidden sm:block">
            <span>Paciente: </span>
            <strong className="text-white">{patient?.name || motherName}</strong>
          </div>

          {/* Central AV Buttons */}
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            {/* Toggle Mic */}
            <button
              onClick={() => setMicActive(!micActive)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                micActive
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-red-600 text-white shadow-lg'
              }`}
              title={micActive ? 'Silenciar Microfone' : 'Ativar Microfone'}
            >
              {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Toggle Video */}
            <button
              onClick={() => setCameraActive(!cameraActive)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                cameraActive
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-red-600 text-white shadow-lg'
              }`}
              title={cameraActive ? 'Desligar Câmera' : 'Ligar Câmera'}
            >
              {cameraActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* End Call Button */}
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer ml-2"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Encerrar Chamada</span>
            </button>
          </div>

          <div className="text-xs text-stone-400 hidden md:block">
            <span>Tempo de sessão: </span>
            <strong className="text-[#E6D4AF]">12:44</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
