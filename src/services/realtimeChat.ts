import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export type ChatMessageCategory =
  | 'duvida'
  | 'orientacao'
  | 'exame'
  | 'sintoma'
  | 'retorno'
  | 'urgente';

export type ChatDeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error';

export interface ChatPatientContact {
  id: string;
  name: string;
  email: string;
  mode: 'gestante' | 'saude_feminina';
  clinicalSummary: string;
}

export interface RealtimeChatMessage {
  id: string;
  channelId: string;
  senderRole: 'paciente' | 'profissional';
  senderId: string;
  senderName: string;
  senderSpecialty?: string;
  recipientId: string;
  recipientName: string;
  patientName: string;
  patientId?: string;
  text: string;
  createdAt: string;
  timestampMs: number;
  category?: ChatMessageCategory;
  deliveryStatus?: ChatDeliveryStatus;
  isPinned?: boolean;
  attachmentType?: 'exam_pdf' | 'prescription' | 'prenatal_card' | 'symptom_summary';
  attachmentTitle?: string;
  triagePriority?: 'routine' | 'priority' | 'urgent';
}

export const CHAT_CATEGORY_META: Record<
  ChatMessageCategory,
  { label: string; badgeClass: string; proBadgeClass: string }
> = {
  duvida: {
    label: 'Dúvida',
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
    proBadgeClass: 'bg-sky-50 text-[#0A2647] border-sky-200',
  },
  orientacao: {
    label: 'Orientação Clínica',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    proBadgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  exame: {
    label: 'Exame / Laudo',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    proBadgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  sintoma: {
    label: 'Relato de Sintoma',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    proBadgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
  },
  retorno: {
    label: 'Retorno / Agenda',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    proBadgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  urgente: {
    label: 'Sinal de Alerta',
    badgeClass: 'bg-red-100 text-red-900 border-red-300 font-bold',
    proBadgeClass: 'bg-red-100 text-red-900 border-red-300 font-bold',
  },
};

export const QUICK_NURSE_TEMPLATES: {
  id: string;
  label: string;
  category: ChatMessageCategory;
  text: string;
}[] = [
  {
    id: 'tpl-hidra',
    label: 'Orientação de Hidratação & Repouso',
    category: 'orientacao',
    text: 'Olá! Recomendamos manter hidratação fracionada (mínimo 2,5L de água hoje) e repouso em decúbito lateral esquerdo por 30 minutos. Conte-nos como se sente após esse período.',
  },
  {
    id: 'tpl-exame',
    label: 'Preparo para Exame Laboratorial',
    category: 'exame',
    text: 'Lembrete clínico: Para a coleta laboratorial de amanhã, mantenha jejum de 8 horas (água pura é permitida em pequenos goles) e traga seu Cartão da Gestante.',
  },
  {
    id: 'tpl-pa',
    label: 'Monitoramento de Pressão Arterial',
    category: 'sintoma',
    text: 'Por favor, aferir sua pressão arterial após 15 minutos de repouso sentada e nos informar o valor. Caso apresente dor de cabeça forte, visão turva ou dor na nuca, acione o SOS Obstétrico imediatamente.',
  },
  {
    id: 'tpl-retorno',
    label: 'Confirmação de Retorno / Teleconsulta',
    category: 'retorno',
    text: 'Seu horário de acompanhamento está confirmado com a equipe Vittacare. Preencha o check-in diário antes do início para otimizarmos sua avaliação.',
  },
];

export const DEFAULT_CHAT_PROFESSIONALS = [
  {
    id: 'prof-marcelo',
    name: 'Enf. Marcelo',
    email: 'Enf.marcelovittaprofessio@gmail.com',
    specialty: 'Enfermagem Obstétrica, Pré-Natal & Neonatologia',
    councilNumber: 'COREN-SP 000.002',
  },
  {
    id: 'prof-leticia',
    name: 'Enfª. Letícia',
    email: 'Enf.leticiavittaprofessio@gmail.com',
    specialty: 'Enfermagem Obstétrica & Pré-Natal',
    councilNumber: 'COREN-SP 000.001',
  },
  {
    id: 'prof-bianca',
    name: 'Enfª. Bianca',
    email: 'Enf.biancavittaprofessio@gmail.com',
    specialty: 'Enfermagem em Ginecologia & Prevenção',
    councilNumber: 'COREN-SP 000.003',
  },
  {
    id: 'prof-stephanie',
    name: 'Enfª. Stephanie',
    email: 'Enf.stephanievittaprofessio@gmail.com',
    specialty: 'Enfermagem Obstétrica, Puerpério & Teleorientação',
    councilNumber: 'COREN-SP 000.004',
  },
];

export const DEFAULT_CHAT_PATIENTS: ChatPatientContact[] = [
  {
    id: 'pat-mariana',
    name: 'Mariana Silva Santos',
    email: 'mariana.silva@email.com',
    mode: 'gestante',
    clinicalSummary: '18ª Semana • Gestante (G1P0) • Bebê Theo',
  },
  {
    id: 'pat-camila',
    name: 'Camila Ferreira Lima',
    email: 'camila.lima@email.com',
    mode: 'saude_feminina',
    clinicalSummary: 'Saúde da Mulher • Ciclo 28d • Preventivo',
  },
  {
    id: 'pat-juliana',
    name: 'Juliana Mendes Rocha',
    email: 'juliana.rocha@email.com',
    mode: 'gestante',
    clinicalSummary: '31ª Semana • Gestante (G2P1) • Monitoramento PA',
  },
  {
    id: 'pat-larissa',
    name: 'Larissa Alencar',
    email: 'larissa.a@email.com',
    mode: 'gestante',
    clinicalSummary: '26ª Semana • Rastreio Glicêmico (TOTG)',
  },
];

export function buildIndividualChatChannelId(profId: string, patId: string): string {
  const p1 = (profId || 'prof').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const p2 = (patId || 'pat').toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `ind_${p1}__${p2}`;
}

export function useChatDirectory(): { patients: ChatPatientContact[] } {
  return { patients: DEFAULT_CHAT_PATIENTS };
}

const LOCAL_STORAGE_CHAT_KEY = 'vittacare_realtime_chat_v2';
const FIRESTORE_CHAT_COLLECTION = 'clinical_chat_messages';
const BROADCAST_CHANNEL_NAME = 'vittacare_chat_sync_channel';

const INITIAL_SEED_MESSAGES: RealtimeChatMessage[] = [
  {
    id: 'seed-group-1',
    channelId: 'group',
    senderRole: 'profissional',
    senderId: 'prof-marcelo',
    senderName: 'Enf. Marcelo',
    senderSpecialty: 'Enfermagem Obstétrica, Pré-Natal & Neonatologia',
    recipientId: 'group',
    recipientName: 'Equipe de Enfermagem Vittacare',
    patientName: 'Mariana Silva Santos',
    text: 'Olá! Bem-vinda ao Canal Geral da Equipe de Enfermagem Vittacare. Eu (Enf. Marcelo), a Enfª. Letícia, a Enfª. Bianca e a Enfª. Stephanie estamos conectados em tempo real para acompanhar você.',
    createdAt: '08:30',
    timestampMs: 1700000001000,
    category: 'orientacao',
    deliveryStatus: 'read',
    isPinned: true,
  },
  {
    id: 'seed-marcelo-1',
    channelId: 'prof-marcelo',
    senderRole: 'profissional',
    senderId: 'prof-marcelo',
    senderName: 'Enf. Marcelo',
    senderSpecialty: 'Enfermagem Obstétrica, Pré-Natal & Neonatologia',
    recipientId: 'paciente',
    recipientName: 'Paciente Vittacare',
    patientName: 'Mariana Silva Santos',
    text: 'Bom dia! Aqui é o seu canal individual 1:1 comigo (Enf. Marcelo). Como estão os movimentos do bebê e a sua hidratação hoje?',
    createdAt: '08:35',
    timestampMs: 1700000002000,
    category: 'orientacao',
    deliveryStatus: 'read',
    isPinned: true,
  },
  {
    id: 'seed-leticia-1',
    channelId: 'prof-leticia',
    senderRole: 'profissional',
    senderId: 'prof-leticia',
    senderName: 'Enfª. Letícia',
    senderSpecialty: 'Enfermagem Obstétrica & Pré-Natal',
    recipientId: 'paciente',
    recipientName: 'Paciente Vittacare',
    patientName: 'Mariana Silva Santos',
    text: 'Olá querida! Este é o nosso chat individual 1:1. Já conferi seus últimos exames no Cartão da Gestante e estão ótimos!',
    createdAt: '08:40',
    timestampMs: 1700000003000,
    category: 'exame',
    deliveryStatus: 'read',
  },
  {
    id: 'seed-bianca-1',
    channelId: 'prof-bianca',
    senderRole: 'profissional',
    senderId: 'prof-bianca',
    senderName: 'Enfª. Bianca',
    senderSpecialty: 'Enfermagem em Ginecologia & Prevenção',
    recipientId: 'paciente',
    recipientName: 'Paciente Vittacare',
    patientName: 'Mariana Silva Santos',
    text: 'Olá! Canal individual com a Enfª. Bianca disponível para dúvidas sobre exames preventivos, saúde íntima e rastreio ginecológico.',
    createdAt: '08:42',
    timestampMs: 1700000004000,
    category: 'orientacao',
    deliveryStatus: 'read',
  },
  {
    id: 'seed-stephanie-1',
    channelId: 'prof-stephanie',
    senderRole: 'profissional',
    senderId: 'prof-stephanie',
    senderName: 'Enfª. Stephanie',
    senderSpecialty: 'Enfermagem Obstétrica, Puerpério & Teleorientação',
    recipientId: 'paciente',
    recipientName: 'Paciente Vittacare',
    patientName: 'Mariana Silva Santos',
    text: 'Oi! Aqui é a Enfª. Stephanie. Sempre que precisar de teleorientação rápida ou avaliação de sintomas, pode me chamar neste chat individual.',
    createdAt: '08:45',
    timestampMs: 1700000005000,
    category: 'orientacao',
    deliveryStatus: 'read',
  },
];

let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch {
  // Ignore if unsupported
}

export function getLocalChatMessages(): RealtimeChatMessage[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CHAT_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_CHAT_KEY, JSON.stringify(INITIAL_SEED_MESSAGES));
      return INITIAL_SEED_MESSAGES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Fallback
  }
  return INITIAL_SEED_MESSAGES;
}

function saveLocalChatMessages(messages: RealtimeChatMessage[]) {
  try {
    const map = new Map<string, RealtimeChatMessage>();
    for (const m of INITIAL_SEED_MESSAGES) {
      map.set(m.id, m);
    }
    for (const m of messages) {
      map.set(m.id, m);
    }
    const merged = Array.from(map.values()).sort((a, b) => a.timestampMs - b.timestampMs);
    localStorage.setItem(LOCAL_STORAGE_CHAT_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return messages;
  }
}

export function subscribeToRealtimeChat(
  onUpdate: (messages: RealtimeChatMessage[]) => void
): () => void {
  let latestFirestoreMsgs: RealtimeChatMessage[] = [];

  let unsubscribeFirestore = () => {};
  try {
    if (auth.currentUser) {
      const q = query(
        collection(db, FIRESTORE_CHAT_COLLECTION),
        orderBy('timestampMs', 'asc'),
        limit(150)
      );

      unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          const firestoreList: RealtimeChatMessage[] = [];
          snapshot.forEach((docSnap) => {
            const d = docSnap.data();
            firestoreList.push({
              id: docSnap.id,
              channelId: d.channelId || 'group',
              senderRole: d.senderRole || 'paciente',
              senderId: d.senderId || '',
              senderName: d.senderName || 'Usuário',
              senderSpecialty: d.senderSpecialty || '',
              recipientId: d.recipientId || 'group',
              recipientName: d.recipientName || 'Equipe',
              patientName: d.patientName || 'Paciente',
              patientId: d.patientId || '',
              text: d.text || '',
              createdAt: d.createdAt || 'Agora',
              timestampMs: d.timestampMs || Date.now(),
              category: d.category || 'duvida',
              deliveryStatus: d.deliveryStatus || 'delivered',
              isPinned: Boolean(d.isPinned),
              attachmentType: d.attachmentType,
              attachmentTitle: d.attachmentTitle,
              triagePriority: d.triagePriority,
            });
          });
          latestFirestoreMsgs = firestoreList;
          const local = getLocalChatMessages();
          const merged = saveLocalChatMessages([...local, ...firestoreList]);
          onUpdate(merged);
        },
        () => {
          onUpdate(getLocalChatMessages());
        }
      );
    }
  } catch {
    // Fallback to local
  }

  onUpdate(getLocalChatMessages());

  const handleStorage = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_CHAT_KEY) {
      const local = getLocalChatMessages();
      onUpdate(saveLocalChatMessages([...local, ...latestFirestoreMsgs]));
    }
  };

  const handleCustomEvent = () => {
    const local = getLocalChatMessages();
    onUpdate(saveLocalChatMessages([...local, ...latestFirestoreMsgs]));
  };

  const handleBroadcast = (event: MessageEvent) => {
    if (event.data && event.data.type === 'NEW_CHAT_MESSAGE') {
      const local = getLocalChatMessages();
      onUpdate(saveLocalChatMessages([...local, ...latestFirestoreMsgs]));
    }
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener('vittacare-chat-updated', handleCustomEvent);
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }

  return () => {
    unsubscribeFirestore();
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('vittacare-chat-updated', handleCustomEvent);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
  };
}

export async function sendRealtimeChatMessage(
  msg: Omit<RealtimeChatMessage, 'id' | 'createdAt' | 'timestampMs'>
): Promise<RealtimeChatMessage> {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const timestampMs = Date.now();
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  const newMessage: RealtimeChatMessage = {
    ...msg,
    id: `msg-${timestampMs}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: timeStr,
    timestampMs,
    category: msg.category || (msg.senderRole === 'profissional' ? 'orientacao' : 'duvida'),
    deliveryStatus: isOnline ? 'delivered' : 'sent',
  };

  const currentLocal = getLocalChatMessages();
  saveLocalChatMessages([...currentLocal, newMessage]);

  window.dispatchEvent(new CustomEvent('vittacare-chat-updated'));
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'NEW_CHAT_MESSAGE', payload: newMessage });
    } catch {
      // ignore
    }
  }

  if (auth.currentUser) {
    try {
      await addDoc(collection(db, FIRESTORE_CHAT_COLLECTION), {
        channelId: newMessage.channelId,
        senderRole: newMessage.senderRole,
        senderId: auth.currentUser.uid || newMessage.senderId,
        senderName: newMessage.senderName,
        senderSpecialty: newMessage.senderSpecialty || '',
        recipientId: newMessage.recipientId,
        recipientName: newMessage.recipientName,
        patientName: newMessage.patientName,
        patientId: newMessage.patientId || '',
        text: newMessage.text,
        createdAt: newMessage.createdAt,
        timestampMs: newMessage.timestampMs,
        category: newMessage.category,
        deliveryStatus: 'delivered',
        isPinned: Boolean(newMessage.isPinned),
      });
    } catch {
      // Local persistence already succeeded
    }
  }

  return newMessage;
}

export function togglePinRealtimeMessage(msgId: string): RealtimeChatMessage[] {
  const current = getLocalChatMessages();
  const updated = current.map((m) =>
    m.id === msgId ? { ...m, isPinned: !m.isPinned } : m
  );
  const saved = saveLocalChatMessages(updated);
  window.dispatchEvent(new CustomEvent('vittacare-chat-updated'));
  return saved;
}

/**
 * React Hook for 1-on-1 or Group Real-time Chat (Used by VittaprofessioDashboard)
 */
export function useRealtimeChat(
  channelId: string,
  meta?: {
    professionalId?: string;
    professionalName?: string;
    professionalSpecialty?: string;
    patientId?: string;
    patientName?: string;
    patientSummary?: string;
  }
) {
  const [allMessages, setAllMessages] = useState<RealtimeChatMessage[]>(() =>
    getLocalChatMessages()
  );

  useEffect(() => {
    const unsub = subscribeToRealtimeChat((msgs) => {
      setAllMessages(msgs);
    });
    return () => unsub();
  }, []);

  const filteredMessages = allMessages.filter((m) => {
    if (m.channelId === channelId) return true;
    // Also surface messages sent to this nurse's direct channel or matching patientName
    if (
      meta?.patientName &&
      m.patientName?.toLowerCase() === meta.patientName.toLowerCase()
    ) {
      return true;
    }
    return false;
  });

  const sendMessage = useCallback(
    async (
      text: string,
      senderRole: 'paciente' | 'profissional',
      senderName: string,
      profId?: string,
      patId?: string,
      patName?: string
    ) => {
      await sendRealtimeChatMessage({
        channelId,
        senderRole,
        senderId:
          senderRole === 'profissional'
            ? profId || meta?.professionalId || 'prof-marcelo'
            : patId || meta?.patientId || 'paciente',
        senderName,
        senderSpecialty: meta?.professionalSpecialty,
        recipientId:
          senderRole === 'profissional'
            ? patId || meta?.patientId || 'paciente'
            : profId || meta?.professionalId || 'prof-marcelo',
        recipientName:
          senderRole === 'profissional'
            ? patName || meta?.patientName || 'Paciente'
            : meta?.professionalName || 'Enfermagem Vittacare',
        patientName: patName || meta?.patientName || 'Mariana Silva Santos',
        patientId: patId || meta?.patientId,
        text,
        category: senderRole === 'profissional' ? 'orientacao' : 'duvida',
      });
    },
    [channelId, meta]
  );

  return {
    messages: filteredMessages,
    sendMessage,
  };
}
