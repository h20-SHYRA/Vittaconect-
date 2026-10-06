import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  BookOpen,
  Bell,
  FileText,
  Users,
  MessageSquare,
  X,
  ArrowRight,
} from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import { useAuth } from '../../context/AuthContext';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_REMINDERS,
  EDUCATIONAL_ARTICLES,
  WOMAN_EDUCATIONAL_ARTICLES,
  INITIAL_PREVENTIVE_EXAMS,
} from '../../data/mockData';
import { DEFAULT_CHAT_PATIENTS, DEFAULT_CHAT_PROFESSIONALS } from '../../services/realtimeChat';
import { NavTab } from '../../types';

interface GlobalSearchModalProps {
  onNavigatePatientTab?: (tab: NavTab) => void;
  onOpenChat?: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  onNavigatePatientTab,
  onOpenChat,
}) => {
  const { isSearchOpen, closeSearch } = useFeedback();
  const { userRole } = useAuth();
  const [queryText, setQueryText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'consultas' | 'lembretes' | 'artigos' | 'documentos' | 'pacientes'>('all');

  const isProfessional = userRole === 'profissional';

  const results = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    const list: {
      id: string;
      title: string;
      subtitle: string;
      category: 'consultas' | 'lembretes' | 'artigos' | 'documentos' | 'pacientes' | 'mensagens';
      categoryLabel: string;
      onSelect: () => void;
    }[] = [];

    // 1. Consultas
    INITIAL_APPOINTMENTS.forEach((apt) => {
      list.push({
        id: `apt-${apt.id}`,
        title: apt.title,
        subtitle: `${apt.date} às ${apt.time} · ${apt.professional}`,
        category: 'consultas',
        categoryLabel: 'Consulta',
        onSelect: () => {
          onNavigatePatientTab?.('calendar');
          closeSearch();
        },
      });
    });

    // 2. Lembretes
    INITIAL_REMINDERS.forEach((rem) => {
      list.push({
        id: `rem-${rem.id}`,
        title: rem.title,
        subtitle: `${rem.categoryLabel} · ${rem.professionalName}`,
        category: 'lembretes',
        categoryLabel: 'Lembrete',
        onSelect: () => {
          onNavigatePatientTab?.('reminders');
          closeSearch();
        },
      });
    });

    // 3. Artigos Educativos (Gestante + Saúde Feminina)
    EDUCATIONAL_ARTICLES.forEach((art) => {
      list.push({
        id: `art-${art.id}`,
        title: art.title,
        subtitle: `${art.categoryLabel} · Leitura ${art.readTime}`,
        category: 'artigos',
        categoryLabel: 'Artigo Educativo',
        onSelect: () => {
          onNavigatePatientTab?.('education');
          closeSearch();
        },
      });
    });

    WOMAN_EDUCATIONAL_ARTICLES.forEach((art) => {
      list.push({
        id: `wart-${art.id}`,
        title: art.title,
        subtitle: `${art.trackLabel} · ${art.author}`,
        category: 'artigos',
        categoryLabel: 'Saúde Feminina',
        onSelect: () => {
          onNavigatePatientTab?.('woman_education');
          closeSearch();
        },
      });
    });

    // 4. Exames / Documentos
    INITIAL_PREVENTIVE_EXAMS.forEach((ex) => {
      list.push({
        id: `ex-${ex.id}`,
        title: ex.name,
        subtitle: `${ex.categoryLabel} · Próximo: ${ex.nextDueDate}`,
        category: 'documentos',
        categoryLabel: 'Documento / Exame',
        onSelect: () => {
          onNavigatePatientTab?.('preventive_screening');
          closeSearch();
        },
      });
    });

    // 5. Equipe de Enfermagem / Mensagens
    DEFAULT_CHAT_PROFESSIONALS.forEach((prof) => {
      list.push({
        id: `prof-${prof.id}`,
        title: `Conversar com ${prof.name}`,
        subtitle: `${prof.specialty} · ${prof.councilNumber}`,
        category: 'mensagens',
        categoryLabel: 'Mensagem / Equipe',
        onSelect: () => {
          onOpenChat?.();
          closeSearch();
        },
      });
    });

    // 6. RBAC: Somente profissionais podem buscar pacientes do prontuário
    if (isProfessional) {
      DEFAULT_CHAT_PATIENTS.forEach((pat) => {
        list.push({
          id: `pat-${pat.id}`,
          title: pat.name,
          subtitle: `${pat.clinicalSummary} · Prontuário & Chat 1:1`,
          category: 'pacientes',
          categoryLabel: 'Paciente (Acesso Profissional)',
          onSelect: () => {
            closeSearch();
          },
        });
      });
    }

    return list.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [queryText, categoryFilter, isProfessional, onNavigatePatientTab, onOpenChat, closeSearch]);

  if (!isSearchOpen) return null;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'consultas':
        return <Calendar className="w-4 h-4 text-[#5D1425]" />;
      case 'lembretes':
        return <Bell className="w-4 h-4 text-amber-700" />;
      case 'artigos':
        return <BookOpen className="w-4 h-4 text-emerald-700" />;
      case 'documentos':
        return <FileText className="w-4 h-4 text-[#144272]" />;
      case 'pacientes':
        return <Users className="w-4 h-4 text-[#0A2647]" />;
      default:
        return <MessageSquare className="w-4 h-4 text-[#8D253D]" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Busca global do aplicativo"
      className="fixed inset-0 z-[65] bg-black/60 backdrop-blur-xs flex items-start justify-center pt-10 sm:pt-20 p-3 sm:p-4 animate-fadeIn"
      onClick={closeSearch}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-3xl border border-[#E6D4AF] shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
      >
        {/* Top Search Input */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#5D1425] shrink-0" />
          <input
            type="search"
            autoFocus
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder={
              isProfessional
                ? 'Buscar pacientes, prontuários, consultas, escalas ou protocolos...'
                : 'Buscar consultas, exames, lembretes, artigos ou equipe...'
            }
            className="flex-1 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={closeSearch}
            className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-500 cursor-pointer"
            aria-label="Fechar busca"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-2.5 bg-[#FAF6ED] border-b border-[#E6D4AF]/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'Tudo' },
            ...(isProfessional ? [{ id: 'pacientes', label: 'Pacientes' }] : []),
            { id: 'consultas', label: 'Consultas' },
            { id: 'lembretes', label: 'Lembretes' },
            { id: 'documentos', label: 'Exames & Documentos' },
            { id: 'artigos', label: 'Educação em Saúde' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === tab.id
                  ? 'bg-[#5D1425] text-white'
                  : 'bg-white text-stone-600 hover:text-[#5D1425] border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {results.length === 0 ? (
            <div className="py-12 text-center space-y-1">
              <p className="text-sm font-serif font-bold text-[#480D1B]">
                Nenhum resultado encontrado
              </p>
              <p className="text-xs text-stone-500">
                Tente buscar por outro termo, exame ou especialidade.
              </p>
            </div>
          ) : (
            results.slice(0, 12).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.onSelect}
                className="w-full p-3 rounded-2xl hover:bg-[#FAF0F2]/70 transition-colors flex items-center justify-between gap-3 text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs sm:text-sm font-semibold text-stone-800 truncate">
                        {item.title}
                      </strong>
                      <span className="text-[11px] text-stone-400">· {item.categoryLabel}</span>
                    </div>
                    <p className="text-xs text-stone-500 truncate">{item.subtitle}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#5D1425] shrink-0" />
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <span>Permissões verificadas: Perfil {isProfessional ? 'Profissional' : 'Paciente'}</span>
          <span>Atalho rápido: Ctrl + K</span>
        </div>
      </div>
    </div>
  );
};
