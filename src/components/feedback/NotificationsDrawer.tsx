import React, { useState } from 'react';
import { Bell, ShieldAlert, Info, Check, Sliders, X } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { NavTab } from '../../types';

interface NotificationsDrawerProps {
  onNavigateTab?: (tab: NavTab) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ onNavigateTab }) => {
  const {
    isNotificationsOpen,
    closeNotifications,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    notificationPrefs,
    updateNotificationPref,
  } = useFeedback();

  const [viewMode, setViewMode] = useState<'all' | 'critica' | 'prefs'>('all');

  if (!isNotificationsOpen) return null;

  const criticalList = notifications.filter((n) => n.priority === 'critica');
  const informativeList = notifications.filter((n) => n.priority === 'informativa');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Central de notificações e alertas"
      className="fixed inset-0 z-[65] bg-black/55 backdrop-blur-xs flex justify-end animate-fadeIn"
      onClick={closeNotifications}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl border-l border-[#E6D4AF] flex flex-col"
      >
        <div className="p-4 sm:p-5 bg-white border-b border-[#E6D4AF]/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] text-[#5D1425] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Notificações & Avisos
              </h3>
              <p className="text-[11px] text-stone-500">
                Alertas clínicos prioritários e lembretes de cuidado
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeNotifications}
            aria-label="Fechar notificações"
            className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-navigation */}
        <div className="px-4 py-2.5 bg-[#FAF6ED] border-b border-[#E6D4AF]/50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                viewMode === 'all' ? 'bg-[#5D1425] text-white' : 'text-stone-600 hover:bg-white'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('critica')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                viewMode === 'critica' ? 'bg-rose-700 text-white' : 'text-stone-600 hover:bg-white'
              }`}
            >
              Críticas ({criticalList.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('prefs')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                viewMode === 'prefs' ? 'bg-[#5D1425] text-white' : 'text-stone-600 hover:bg-white'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Preferências</span>
            </button>
          </div>

          {viewMode !== 'prefs' && (
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="text-[11px] font-semibold text-[#5D1425] hover:underline cursor-pointer"
            >
              Ler todas
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {viewMode === 'prefs' ? (
            <div className="space-y-3">
              <p className="text-xs text-stone-600">
                Escolha quais categorias de avisos deseja receber no seu dispositivo:
              </p>
              {[
                {
                  key: 'criticalAlerts' as const,
                  title: 'Alertas Clínicos Prioritários',
                  desc: 'Sinais de atenção, medicações no horário e chamadas da equipe',
                },
                {
                  key: 'appointments' as const,
                  title: 'Consultas e Teleatendimento',
                  desc: 'Confirmações de horário e abertura de sala de vídeo',
                },
                {
                  key: 'reminders' as const,
                  title: 'Lembretes de Exames e Vacinas',
                  desc: 'Preparo de exames e calendário vacinal',
                },
                {
                  key: 'teamMessages' as const,
                  title: 'Mensagens da Enfermagem',
                  desc: 'Avisos quando um profissional responder no chat individual',
                },
                {
                  key: 'clinicNews' as const,
                  title: 'Comunicados da Clínica Vittacare',
                  desc: 'Novas turmas de cursos, campanhas e oficinas',
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="p-3.5 rounded-2xl bg-white border border-[#E6D4AF]/70 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div>
                    <strong className="text-xs font-bold text-[#480D1B] block">{item.title}</strong>
                    <span className="text-[11px] text-stone-500">{item.desc}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPrefs[item.key]}
                    onChange={(e) => updateNotificationPref(item.key, e.target.checked)}
                    className="w-4 h-4 accent-[#5D1425] cursor-pointer"
                  />
                </label>
              ))}
            </div>
          ) : (
            <>
              {/* Section 1: Critical Notifications */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Notificações Críticas & Prioritárias</span>
                </div>
                {criticalList.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.targetTab && onNavigateTab) {
                        onNavigateTab(n.targetTab as NavTab);
                        closeNotifications();
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      n.read
                        ? 'bg-white border-stone-200 opacity-80'
                        : 'bg-rose-50/80 border-rose-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <strong className="text-xs font-bold text-[#480D1B]">{n.title}</strong>
                      <span className="text-[10px] text-stone-500 whitespace-nowrap">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{n.description}</p>
                  </div>
                ))}
              </div>

              {/* Section 2: Informative Notifications */}
              {viewMode === 'all' && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#5D1425]">
                    <Info className="w-4 h-4" />
                    <span>Notificações Informativas</span>
                  </div>
                  {informativeList.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.targetTab && onNavigateTab) {
                          onNavigateTab(n.targetTab as NavTab);
                          closeNotifications();
                        }
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        n.read
                          ? 'bg-white border-stone-200 opacity-80'
                          : 'bg-white border-[#E6D4AF] shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <strong className="text-xs font-bold text-[#480D1B]">{n.title}</strong>
                        <span className="text-[10px] text-stone-500 whitespace-nowrap">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{n.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
