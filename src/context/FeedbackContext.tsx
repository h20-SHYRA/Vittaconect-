import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X, WifiOff } from 'lucide-react';
import { ConfirmationDialog } from '../components/ui';

export type ToastTone = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

export type NotificationCategory = 'lembrete' | 'consulta' | 'mensagem' | 'clinica' | 'atualizacao';
export type NotificationPriority = 'critica' | 'informativa';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
  targetTab?: string;
}

export interface NotificationPreferences {
  criticalAlerts: boolean;
  appointments: boolean;
  reminders: boolean;
  teamMessages: boolean;
  clinicNews: boolean;
}

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: 'danger' | 'primary';
  brand?: 'patient' | 'professional';
  onConfirm: () => void;
}

interface FeedbackContextType {
  showToast: (params: {
    title: string;
    description?: string;
    message?: string;
    tone?: ToastTone;
    type?: ToastTone;
  }) => void;
  confirmAction: (params: Omit<ConfirmDialogState, 'isOpen'>) => void;
  isOnline: boolean;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;
  setIsNotificationsOpen: (open: boolean) => void;
  notifications: AppNotification[];
  unreadCount: number;
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  notificationPrefs: NotificationPreferences;
  updateNotificationPref: (key: keyof NotificationPreferences, value: boolean) => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Teleorientação com Enfª. Stephanie disponível',
    description: 'Sua sala segura de orientação materna está pronta para conexão.',
    category: 'consulta',
    priority: 'critica',
    timestamp: 'Há 10 min',
    read: false,
    targetTab: 'calendar',
  },
  {
    id: 'notif-2',
    title: 'Lembrete prioritário: Suplementação de Ferro',
    description: 'Tomar 1 cápsula 30 minutos antes do almoço com suco cítrico.',
    category: 'lembrete',
    priority: 'critica',
    timestamp: 'Hoje, 11:30',
    read: false,
    targetTab: 'reminders',
  },
  {
    id: 'notif-3',
    title: 'Mensagem da Equipe de Enfermagem',
    description: 'Enf. Marcelo enviou orientações sobre o exame morfológico no chat individual.',
    category: 'mensagem',
    priority: 'informativa',
    timestamp: 'Hoje, 09:15',
    read: false,
  },
  {
    id: 'notif-4',
    title: 'Campanha de Imunização Gestacional (dTpa e VSR)',
    description: 'Horários ampliados na Sala de Vacinas Vittacare durante esta semana.',
    category: 'clinica',
    priority: 'informativa',
    timestamp: 'Ontem',
    read: true,
    targetTab: 'news',
  },
];

const DEFAULT_PREFS: NotificationPreferences = {
  criticalAlerts: true,
  appointments: true,
  reminders: true,
  teamMessages: true,
  clinicNews: true,
};

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem('vittaconect_notification_prefs_v2');
      if (saved) return { ...DEFAULT_PREFS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_PREFS;
  });

  const [confirmState, setConfirmState] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast({
        title: 'Conexão restabelecida',
        description: 'Sincronização em tempo real ativa.',
        tone: 'success',
      });
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast({
        title: 'Modo offline ativo',
        description: 'Você pode continuar navegando. Seus dados serão sincronizados ao reconectar.',
        tone: 'warning',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global keyboard shortcut Ctrl+K / Cmd+K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = useCallback(
    ({
      title,
      description,
      message,
      tone,
      type,
    }: {
      title: string;
      description?: string;
      message?: string;
      tone?: ToastTone;
      type?: ToastTone;
    }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const resolvedTone = tone || type || 'success';
      const resolvedDesc = description || message;
      setToasts((prev) => [
        ...prev.slice(-3),
        { id, title, description: resolvedDesc, tone: resolvedTone },
      ]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  const confirmAction = useCallback((params: Omit<ConfirmDialogState, 'isOpen'>) => {
    setConfirmState({
      ...params,
      isOpen: true,
    });
  }, []);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast({ title: 'Todas as notificações foram marcadas como lidas', tone: 'info' });
  };

  const updateNotificationPref = (key: keyof NotificationPreferences, value: boolean) => {
    setNotificationPrefs((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem('vittaconect_notification_prefs_v2', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <FeedbackContext.Provider
      value={{
        showToast,
        confirmAction,
        isOnline,
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
        setIsSearchOpen,
        isNotificationsOpen,
        openNotifications: () => setIsNotificationsOpen(true),
        closeNotifications: () => setIsNotificationsOpen(false),
        setIsNotificationsOpen,
        notifications,
        unreadCount,
        unreadNotificationsCount: unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        notificationPrefs,
        updateNotificationPref,
      }}
    >
      {children}

      {/* Non-intrusive Offline Banner */}
      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 lg:bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg"
        >
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>Modo offline — Exibindo dados salvos com segurança no dispositivo</span>
        </div>
      )}

      {/* Global Toast Stack */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-[70] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2 sm:px-0"
      >
        {toasts.map((t) => {
          const styles = {
            success: {
              bg: 'bg-emerald-950 text-white border-emerald-500',
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
            },
            error: {
              bg: 'bg-rose-950 text-white border-rose-500',
              icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
            },
            warning: {
              bg: 'bg-amber-950 text-white border-amber-400',
              icon: <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />,
            },
            info: {
              bg: 'bg-slate-900 text-white border-sky-400',
              icon: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
            },
          }[t.tone];

          return (
            <div
              key={t.id}
              className={`pointer-events-auto p-3.5 rounded-2xl border shadow-xl flex items-start justify-between gap-3 animate-fadeIn ${styles.bg}`}
            >
              <div className="flex items-start gap-2.5">
                {styles.icon}
                <div>
                  <strong className="text-xs font-bold block">{t.title}</strong>
                  {t.description && (
                    <span className="text-[11px] opacity-90 block mt-0.5 leading-snug">
                      {t.description}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                aria-label="Fechar aviso"
                onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
                className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Global Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        description={confirmState.description}
        confirmLabel={confirmState.confirmLabel}
        variant={confirmState.variant}
        brand={confirmState.brand}
        onConfirm={() => {
          confirmState.onConfirm();
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback deve ser utilizado dentro de um FeedbackProvider');
  }
  return context;
};
