import { useState, useEffect, useRef } from 'react';
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
  text: string;
  timestamp: any;
  timeString: string;
}

export const LIVE_CHAT_CHANNEL_ID = 'live_consultation_channel';
const LOCAL_STORAGE_CHAT_KEY = 'vittacare_chat_cache_messages';

export function useRealtimeChat(channelId: string = LIVE_CHAT_CHANNEL_ID) {
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
    let unsubscribe: (() => void) | null = null;

    try {
      const messagesRef = collection(db, 'consultation_chats', channelId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));

      unsubscribe = onSnapshot(q, async (snapshot) => {
        if (snapshot.empty) {
          // Seed initial friendly clinical messages if room is brand new
          try {
            const initialMsgs = [
              {
                senderId: 'prof-marcelo',
                senderName: 'Enf. Marcelo',
                senderRole: 'profissional' as const,
                text: 'Olá! Seja bem-vinda ao canal oficial de teleorientação da Clínica Vittacare. Nossa equipe de enfermagem obstétrica e ginecológica está conectada para lhe acolher.',
                timestamp: serverTimestamp(),
                timeString: '09:00',
              },
              {
                senderId: 'pat-mariana',
                senderName: 'Mariana Silva Santos (Gestante 18ª Sem)',
                senderRole: 'paciente' as const,
                text: 'Bom dia, Enfermeiro Marcelo! Gostaria de tirar uma dúvida sobre azia e postura para dormir nessa fase.',
                timestamp: serverTimestamp(),
                timeString: '09:02',
              },
            ];

            for (const m of initialMsgs) {
              await addDoc(messagesRef, m);
            }
          } catch (e) {
            console.warn('Erro ao inicializar mensagens padrão do chat:', e);
          }
        } else {
          const loaded: ChatMessage[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              senderId: data.senderId || 'anon',
              senderName: data.senderName || 'Usuário',
              senderRole: data.senderRole || 'paciente',
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
        console.warn('Alerta na conexão do chat em tempo real:', err?.message);
        setError('Operando com sincronização local ativa.');
        setLoading(false);
      });
    } catch (e: any) {
      console.warn('Modo offline/local do chat ativado:', e?.message);
      setLoading(false);
    }

    // Cross-tab synchronization listener
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
    senderId: string
  ) => {
    if (!text.trim()) return false;
    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const tempId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

    const newMsg: ChatMessage = {
      id: tempId,
      senderId,
      senderName,
      senderRole,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      timeString: nowTime,
    };

    // Optimistic UI update immediately
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
