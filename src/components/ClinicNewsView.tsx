import React, { useState } from 'react';
import { 
  Megaphone, 
  Syringe, 
  GraduationCap, 
  Clock, 
  Sparkles, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Check, 
  Share2, 
  Bookmark, 
  AlertCircle,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { INITIAL_CLINIC_NEWS, INITIAL_WOMAN_CLINIC_NEWS, CLINIC_INFO } from '../data/mockData';
import { ClinicNewsItem } from '../types';
import { usePatient } from '../context/PatientContext';
import { useFeedback } from '../context/FeedbackContext';

export const ClinicNewsView: React.FC = () => {
  const { patient } = usePatient();
  const { showToast } = useFeedback();
  const isWomanMode = patient?.userMode === 'saude_feminina';
  const defaultList = isWomanMode ? INITIAL_WOMAN_CLINIC_NEWS : INITIAL_CLINIC_NEWS;

  const [newsList, setNewsList] = useState<ClinicNewsItem[]>(defaultList);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [registeredEvents, setRegisteredEvents] = useState<{ [newsId: string]: boolean }>({});
  const [savedReminders, setSavedReminders] = useState<{ [newsId: string]: boolean }>({});
  const [selectedNewsDetail, setSelectedNewsDetail] = useState<ClinicNewsItem | null>(null);

  React.useEffect(() => {
    setNewsList(isWomanMode ? INITIAL_WOMAN_CLINIC_NEWS : INITIAL_CLINIC_NEWS);
    setSelectedCategory('all');
  }, [isWomanMode]);

  const handleRegisterEvent = (newsId: string) => {
    setRegisteredEvents((prev) => ({ ...prev, [newsId]: true }));
    setNewsList((prev) =>
      prev.map((item) => {
        if (item.id === newsId && item.registeredCount !== undefined) {
          return { ...item, registeredCount: item.registeredCount + 1 };
        }
        return item;
      })
    );
  };

  const handleSaveReminder = (newsId: string) => {
    setSavedReminders((prev) => ({ ...prev, [newsId]: !prev[newsId] }));
  };

  const handleShare = (item: ClinicNewsItem) => {
    const text = `*${item.title}*\n${item.summary}\nLocal: ${item.location || CLINIC_INFO.name}\nAcesse o aplicativo Vittaconect da Clínica Vittacare.`;
    if (navigator.share) {
      navigator.share({ title: item.title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast({
        title: 'Comunicado Copiado!',
        description: 'Texto copiado para compartilhar com seu acompanhante.',
        tone: 'success',
      });
    }
  };

  const filteredNews = newsList.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F2] border border-[#EBBEC8] text-[#8D253D] text-xs font-semibold uppercase tracking-wider mb-2">
            <Megaphone className="w-3.5 h-3.5 text-[#B89243]" />
            <span>
              {isWomanMode ? 'Saúde Feminina & Prevenção • Clínica Vittacare' : 'Comunicados & Eventos Oficiais • Clínica Vittacare'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
            Mural de Notícias & Campanhas
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {isWomanMode
              ? 'Campanhas preventivas, workshops de climatério/menopausa, mutirão de rastreio mamário e plantão ginecológico 24h.'
              : 'Fique por dentro de campanhas de vacinação, abertura de turmas de curso de gestantes e plantões obstétricos da clínica.'}
          </p>
        </div>

        {/* 24h Emergency On-Call Badge */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#DEC68E] shadow-2xs self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5D1425] to-[#8D253D] text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 text-[#E6D4AF]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              {isWomanMode ? 'Pronto-Atendimento Ginecológico' : 'Pronto-Atendimento Obstétrico'}
            </span>
            <span className="font-serif font-bold text-xs sm:text-sm text-[#480D1B]">
              Plantão 24h: {CLINIC_INFO.phone24h}
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#5D1425] text-white shadow-2xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          📰 Todos os Comunicados
        </button>

        {isWomanMode ? (
          <>
            <button
              onClick={() => setSelectedCategory('campaign')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'campaign'
                  ? 'bg-[#5D1425] text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8D253D]" />
              <span>Campanhas de Rastreio</span>
            </button>

            <button
              onClick={() => setSelectedCategory('workshop')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'workshop'
                  ? 'bg-[#5D1425] text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#B89243]" />
              <span>Workshops & Encontros</span>
            </button>

            <button
              onClick={() => setSelectedCategory('vaccination')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'vaccination'
                  ? 'bg-[#5D1425] text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Syringe className="w-3.5 h-3.5 text-[#8D253D]" />
              <span>Vacina HPV & Adulta</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedCategory('vaccination')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'vaccination'
                  ? 'bg-[#5D1425] text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Syringe className="w-3.5 h-3.5 text-[#8D253D]" />
              <span>Campanhas de Vacinação</span>
            </button>

            <button
              onClick={() => setSelectedCategory('course')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'course'
                  ? 'bg-[#5D1425] text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#B89243]" />
              <span>Cursos de Gestantes</span>
            </button>
          </>
        )}

        <button
          onClick={() => setSelectedCategory('oncall')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'oncall'
              ? 'bg-[#5D1425] text-white shadow-2xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-emerald-700" />
          <span>Plantões & Horários</span>
        </button>

        <button
          onClick={() => setSelectedCategory('technology')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'technology'
              ? 'bg-[#5D1425] text-white shadow-2xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Tecnologia & Serviços</span>
        </button>
      </div>

      {/* Featured Highlight Campaign Banner (Dynamic per mode with same red luxury styling) */}
      <div className="bg-gradient-to-r from-[#5D1425] via-[#741C30] to-[#480D1B] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#E6D4AF] text-[11px] font-bold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#E6D4AF]" />
            <span>
              {isWomanMode ? 'Destaque do Mês • Saúde da Mulher Vittacare' : 'Destaque do Mês na Clínica Vittacare'}
            </span>
          </div>

          <h2 className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-white leading-tight">
            {isWomanMode
              ? 'Campanha Rosa Vittacare: Mês de Rastreio das Mamas & Mamografia Digital'
              : 'Campanha de Vacinação Contra Bronquiolite Materna (VSR)'}
          </h2>

          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            {isWomanMode
              ? 'Prioridade no agendamento para mulheres a partir dos 40 anos e avaliação ecográfica com ultrassom de alta frequência para mamas jovens e densas. O rastreio precoce aumenta para mais de 95% as chances de cura.'
              : 'Gestantes a partir da 32ª semana: protejam seu bebê antes mesmo de nascer. A dose única induz a passagem de anticorpos maternos pelo cordão umbilical, conferindo imunidade nos meses mais críticos do recém-nascido.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleRegisterEvent(isWomanMode ? 'news-w1' : 'news-1')}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                registeredEvents[isWomanMode ? 'news-w1' : 'news-1']
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-[#E6D4AF] to-[#DEC68E] text-[#480D1B] hover:brightness-105 shadow-md'
              }`}
            >
              {registeredEvents[isWomanMode ? 'news-w1' : 'news-1'] ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isWomanMode ? 'Agendamento Solicitado!' : 'Horário Solicitado com Sucesso!'}</span>
                </>
              ) : (
                <>
                  <span>{isWomanMode ? 'Agendar Mamografia / USG' : 'Agendar na Sala de Vacinas'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <span className="text-xs text-[#E6D4AF]">
              {isWomanMode
                ? '• Laudos com tecnologia digital e entrega rápida pelo aplicativo'
                : '• Disponível na unidade Torre Sul (com ou sem agendamento prévio)'}
            </span>
          </div>
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredNews.map((item) => {
          const isRegistered = registeredEvents[item.id];
          const isSaved = savedReminders[item.id];

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200 hover:border-[#DEC68E] transition-all shadow-2xs hover:shadow-md flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 sm:p-6 space-y-3.5">
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      item.badgeColor === 'wine'
                        ? 'bg-[#FAF0F2] text-[#8D253D] border border-[#EBBEC8]'
                        : item.badgeColor === 'gold'
                        ? 'bg-[#FAF6ED] text-[#9B7731] border border-[#E6D4AF]'
                        : item.badgeColor === 'green'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-sky-50 text-sky-800 border border-sky-200'
                    }`}
                  >
                    {item.badgeText || item.categoryLabel}
                  </span>

                  <span className="text-[11px] text-stone-400">
                    {item.date}
                  </span>
                </div>

                {/* News Title */}
                <h3 className="font-serif font-bold text-lg text-[#480D1B] leading-snug">
                  {item.title}
                </h3>

                {/* News Summary */}
                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.summary}
                </p>

                {/* Event Location & Date Details */}
                <div className="space-y-1.5 pt-1 text-xs text-stone-500">
                  {item.eventDate && (
                    <div className="flex items-center gap-2 text-stone-700">
                      <Calendar className="w-4 h-4 text-[#8D253D] shrink-0" />
                      <span>{item.eventDate}</span>
                    </div>
                  )}

                  {item.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#B89243] shrink-0" />
                      <span>{item.location}</span>
                    </div>
                  )}

                  {/* Course Spots Progress */}
                  {item.maxSpots && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-stone-500">Vagas Preenchidas:</span>
                        <strong className="text-[#480D1B]">
                          {item.registeredCount} de {item.maxSpots} vagas
                        </strong>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full bg-[#8D253D] rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, ((item.registeredCount || 0) / item.maxSpots) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="p-4 sm:p-5 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Share button */}
                  <button
                    onClick={() => handleShare(item)}
                    className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-[#5D1425] hover:border-[#DEC68E] transition-all cursor-pointer shadow-2xs"
                    title="Compartilhar aviso com acompanhante"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* Save to reminders */}
                  <button
                    onClick={() => handleSaveReminder(item.id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                      isSaved
                        ? 'bg-[#FAF0F2] border-[#EBBEC8] text-[#8D253D]'
                        : 'bg-white border-stone-200 text-stone-600 hover:text-[#5D1425]'
                    }`}
                    title={isSaved ? 'Salvo nos meus lembretes' : 'Salvar nos meus lembretes'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#8D253D]' : ''}`} />
                  </button>
                </div>

                {/* Primary Action Button */}
                {item.actionType === 'register' && (
                  <button
                    onClick={() => handleRegisterEvent(item.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isRegistered
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#5D1425] hover:bg-[#741C30] text-white shadow-xs'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Inscrição Confirmada!</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{item.actionLabel || 'Inscrever-se'}</span>
                      </>
                    )}
                  </button>
                )}

                {item.actionType === 'reminder' && (
                  <button
                    onClick={() => handleRegisterEvent(item.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isRegistered
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#B89243] hover:brightness-110 text-white shadow-xs'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Horário Pré-Agendado!</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.actionLabel || 'Agendar'}</span>
                      </>
                    )}
                  </button>
                )}

                {item.actionType === 'info' && (
                  <button
                    onClick={() => setSelectedNewsDetail(item)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 transition-all cursor-pointer"
                  >
                    Ver Orientações
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {selectedNewsDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E6D4AF] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <span className="text-[10px] font-bold text-[#8D253D] bg-[#FAF0F2] px-2.5 py-1 rounded-full border border-[#EBBEC8]">
              {selectedNewsDetail.categoryLabel}
            </span>

            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#480D1B] mt-2 mb-3">
              {selectedNewsDetail.title}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line mb-6">
              {selectedNewsDetail.fullDescription}
            </p>

            <div className="p-4 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF] text-xs space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8D253D]" />
                <span className="font-semibold text-stone-800">{selectedNewsDetail.eventDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B89243]" />
                <span className="text-stone-700">{selectedNewsDetail.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedNewsDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-[#5D1425] text-white text-xs font-bold hover:bg-[#741C30] cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
