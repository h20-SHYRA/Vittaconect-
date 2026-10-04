import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'paciente' | 'profissional';
  recipientId?: string;
  recipientName?: string;
  text: string;
  timestamp: any;
  timeString: string;
}

export interface ChatProfessionalContact {
  id: string;
  name: string;
  email: string;
  specialty: string;
  councilNumber: string;
  onDuty: boolean;
}

export interface ChatPatientContact {
  id: string;
  name: string;
  email: string;
  mode: 'gestante' | 'saude_feminina';
  clinicalSummary: string;
  hasDisability?: boolean;
  disabilityTypes?: string[];
  helperName?: string;
  needsLibrasInterpreter?: boolean;
}

export const LIVE_CHAT_CHANNEL_ID = 'live_consultation_channel';
const LOCAL_STORAGE_CHAT_KEY = 'vittacare_chat_cache_messages';

export const DEFAULT_CHAT_PROFESSIONALS: ChatProfessionalContact[] = [
  {
    id: 'prof-marcelo',
    name: 'Enf. Marcelo',
    email: 'enf.marcelovittaprofessio@gmail.com',
    specialty: 'Enfermagem Obstétrica, Pré-Natal & Neonatologia',
    councilNumber: 'COREN-SP 000.002',
    onDuty: true,
  },
  {
    id: 'prof-leticia',
    name: 'Enfª. Letícia',
    email: 'enf.leticiavittaprofessio@gmail.com',
    specialty: 'Enfermagem Obstétrica & Alto Risco',
    councilNumber: 'COREN-SP 000.001',
    onDuty: true,
  },
  {
    id: 'prof-bianca',
    name: 'Enfª. Bianca',
    email: 'enf.biancavittaprofessio@gmail.com',
    specialty: 'Enfermagem em Saúde da Mulher & Prevenção',
    councilNumber: 'COREN-SP 000.003',
    onDuty: true,
  },
  {
    id: 'prof-stephanie',
    name: 'Enfª. Stephanie',
    email: 'enf.stephanievittaprofessio@gmail.com',
    specialty: 'Enfermagem Obstétrica, Puerpério & Teleorientação',
    councilNumber: 'COREN-SP 000.004',
    onDuty: true,
  },
];

export const DEFAULT_CHAT_PATIENTS: ChatPatientContact[] = [
  {
    id: 'pat-mariana',
    name: 'Mariana Silva Santos',
    email: 'mariana.silva@email.com',
    mode: 'gestante',
    clinicalSummary: '18ª Semana • Gestante (G1P0)',
    hasDisability: false,
  },
  {
    id: 'pat-camila',
    name: 'Camila Ferreira Lima',
    email: 'camila.lima@email.com',
    mode: 'saude_feminina',
    clinicalSummary: 'Saúde da Mulher • Ciclo 28d',
    hasDisability: false,
  },
  {
    id: 'pat-juliana',
    name: 'Juliana Mendes Rocha',
    email: 'juliana.rocha@email.com',
    mode: 'gestante',
    clinicalSummary: '32ª Semana • Pré-Natal & Amamentação',
    hasDisability: true,
    disabilityTypes: ['auditiva'],
    needsLibrasInterpreter: true,
    helperName: 'Carlos Rocha (Esposo)',
  },
  {
    id: 'pat-larissa',
    name: 'Larissa Alencar',
    email: 'larissa.a@email.com',
    mode: 'gestante',
    clinicalSummary: '24ª Semana • Monitoramento Glicêmico',
    hasDisability: false,
  },
];

export function normalizeChatKey(raw: string): string {
  return (raw || 'anon')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '') || 'anon';
}

/**
 * Builds a deterministic, private 1-on-1 channel ID for a specific Professional and a specific Client/Patient.
 */
export function buildIndividualChatChannelId(professionalIdentifier: string, patientIdentifier: string): string {
  const profKey = normalizeChatKey(professionalIdentifier);
  const patKey = normalizeChatKey(patientIdentifier);
  return `chat_ind__${profKey}__${patKey}`;
}

/**
 * Real-time directory hook that returns all available Professionals and all Clients/Patients
 * from Firestore 'users' merged with the clinic's active roster.
 */
export function useChatDirectory() {
  const [professionals, setProfessionals] = useState<ChatProfessionalContact[]>(DEFAULT_CHAT_PROFESSIONALS);
  const [patients, setPatients] = useState<ChatPatientContact[]>(DEFAULT_CHAT_PATIENTS);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      const usersRef = collection(db, 'users');
      unsubscribe = onSnapshot(usersRef, (snapshot) => {
        const loadedProfs: ChatProfessionalContact[] = [...DEFAULT_CHAT_PROFESSIONALS];
        const loadedPats: ChatPatientContact[] = [...DEFAULT_CHAT_PATIENTS];

        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const uid = docSnap.id;
          const email = (data.email || '').toLowerCase();

          if (data.role === 'profissional') {
            const exists = loadedProfs.some(
              (p) => p.id === uid || (email && p.email.toLowerCase() === email) || p.name.toLowerCase() === (data.displayName || '').toLowerCase()
            );
            if (!exists) {
              loadedProfs.unshift({
                id: uid,
                name: data.displayName || 'Enfermeiro(a) Vittacare',
                email: data.email || 'vittaprofessio@gmail.com',
                specialty: data.specialty || 'Enfermagem Obstétrica & Saúde da Mulher',
                councilNumber: data.councilNumber || 'COREN Ativo',
                onDuty: data.onDuty ?? true,
              });
            }
          } else if (data.role === 'paciente') {
            const pData = data.patientData || {};
            const patName = pData.name || data.displayName || 'Paciente Vittacare';
            const exists = loadedPats.some(
              (p) => p.id === uid || (email && p.email.toLowerCase() === email) || p.name.toLowerCase() === patName.toLowerCase()
            );
            const isGest = (data.patientMode || pData.userMode) !== 'saude_feminina';
            const summary = isGest
              ? `${pData.currentWeek || 18}ª Semana • Gestante`
              : `Saúde da Mulher • Ciclo ${pData.cycleDurationDays || 28}d`;

            if (!exists) {
              loadedPats.unshift({
                id: uid,
                name: patName,
                email: data.email || '',
                mode: isGest ? 'gestante' : 'saude_feminina',
                clinicalSummary: summary,
                hasDisability: Boolean(pData.hasDisability),
                disabilityTypes: pData.disabilityTypes || [],
                helperName: pData.helperName || '',
                needsLibrasInterpreter: Boolean(pData.needsLibrasInterpreter),
              });
            }
          }
        });

        setProfessionals(loadedProfs);
        setPatients(loadedPats);
      }, () => {
        // Ignore snapshot error and keep default roster
      });
    } catch {
      // Keep default roster
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { professionals, patients };
}

export interface IndividualChatSeedContext {
  professionalId?: string;
  professionalName?: string;
  professionalSpecialty?: string;
  patientId?: string;
  patientName?: string;
  patientSummary?: string;
}

export function useRealtimeChat(
  channelId: string = LIVE_CHAT_CHANNEL_ID,
  seedContext?: IndividualChatSeedContext
) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const cached = localStorage.getItem(`${LOCAL_STORAGE_CHAT_KEY}_${channelId}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
    return [];
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Load cached messages for this specific channel immediately on switch
    try {
      const cached = localStorage.getItem(`${LOCAL_STORAGE_CHAT_KEY}_${channelId}`);
      if (cached) {
        setMessages(JSON.parse(cached));
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    }

    let unsubscribe: (() => void) | null = null;

    try {
      const messagesRef = collection(db, 'consultation_chats', channelId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));

      unsubscribe = onSnapshot(q, async (snapshot) => {
        if (snapshot.empty) {
          const profName = seedContext?.professionalName || 'Enf. Marcelo';
          const profId = seedContext?.professionalId || 'prof-marcelo';
          const profSpec = seedContext?.professionalSpecialty || 'Enfermagem Obstétrica & Ginecológica';
          const patName = seedContext?.patientName || 'Paciente';

          try {
            const welcomeMsg = {
              senderId: profId,
              senderName: profName,
              senderRole: 'profissional' as const,
              recipientId: seedContext?.patientId || 'paciente',
              recipientName: patName,
              text: `Olá, ${patName.split(' ')[0]}! Aqui é ${profName} (${profSpec}). Este é o nosso canal de chat individual e exclusivo na Clínica Vittacare. Como posso ajudar você hoje?`,
              timestamp: serverTimestamp(),
              timeString: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            };

            await addDoc(messagesRef, welcomeMsg);
          } catch (e) {
            console.warn('Erro ao inicializar mensagem individual do chat:', e);
          }
        } else {
          const loaded: ChatMessage[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              senderId: data.senderId || 'anon',
              senderName: data.senderName || 'Usuário',
              senderRole: data.senderRole || 'paciente',
              recipientId: data.recipientId || '',
              recipientName: data.recipientName || '',
              text: data.text || '',
              timestamp: data.timestamp,
              timeString: data.timeString || (data.timestamp?.toDate ? data.timestamp.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })),
            };
          });

          setMessages(loaded);
          try {
            localStorage.setItem(`${LOCAL_STORAGE_CHAT_KEY}_${channelId}`, JSON.stringify(loaded));
          } catch {}
        }
        setLoading(false);
      }, (err) => {
        console.warn('Alerta na conexão do chat individual:', err?.message);
        setError('Operando com sincronização local ativa.');
        setLoading(false);
      });
    } catch (e: any) {
      console.warn('Modo offline/local do chat ativado:', e?.message);
      setLoading(false);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `${LOCAL_STORAGE_CHAT_KEY}_${channelId}` && e.newValue) {
        try {
          setMessages(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (unsubscribe) unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [channelId]);

  const sendMessage = async (
    text: string, 
    senderRole: 'paciente' | 'profissional', 
    senderName: string, 
    senderId: string,
    recipientId?: string,
    recipientName?: string
  ) => {
    if (!text.trim()) return false;
    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const tempId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

    const newMsg: ChatMessage = {
      id: tempId,
      senderId,
      senderName,
      senderRole,
      recipientId: recipientId || '',
      recipientName: recipientName || '',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      timeString: nowTime,
    };

    setMessages(prev => {
      const updated = [...prev, newMsg];
      try {
        localStorage.setItem(`${LOCAL_STORAGE_CHAT_KEY}_${channelId}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const messagesRef = collection(db, 'consultation_chats', channelId, 'messages');
      await addDoc(messagesRef, {
        senderId,
        senderName,
        senderRole,
        recipientId: recipientId || '',
        recipientName: recipientName || '',
        text: text.trim(),
        timestamp: serverTimestamp(),
        timeString: nowTime,
      });
      return true;
    } catch (e) {
      console.warn('Mensagem armazenada localmente (Firestore indisponível):', e);
      return true;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
}
