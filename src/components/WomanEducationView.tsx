import React, { useState } from 'react';
import { 
  BookOpen, 
  Headphones, 
  Video, 
  FileText, 
  Sparkles, 
  Clock, 
  Search, 
  User, 
  ChevronRight, 
  CheckCircle2, 
  Share2, 
  Bookmark, 
  Play, 
  Pause,
  ArrowRight
} from 'lucide-react';
import { WOMAN_EDUCATIONAL_ARTICLES, CLINIC_INFO } from '../data/mockData';
import { WomanEducationalArticle } from '../types';
import { useFeedback } from '../context/FeedbackContext';
import { EducationalClinicalBanner } from './ui';

export const WomanEducationView: React.FC = () => {
  const { showToast } = useFeedback();
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<WomanEducationalArticle | null>(null);

  // Audio player state simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(24);

  const filteredArticles = WOMAN_EDUCATIONAL_ARTICLES.filter((item) => {
    const matchesTrack = selectedTrack === 'all' || item.track === selectedTrack;
    const matchesFormat = selectedFormat === 'all' || item.type === selectedFormat;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesFormat && matchesSearch;
  });

  const handleShare = (art: WomanEducationalArticle) => {
    const text = `*${art.title}*\n${art.summary}\nPor: ${art.author} • Clínica Vittacare`;
    if (navigator.share) {
      navigator.share({ title: art.title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast({
        title: 'Conteúdo Copiado!',
        description: 'O resumo do conteúdo educativo foi copiado para a área de transferência.',
        tone: 'success',
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F2] border border-[#EBBEC8] text-[#8D253D] text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#B89243]" />
            <span>Biblioteca Vittacare • Educação em Saúde Feminina</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
            Trilhas de Conhecimento por Momento de Vida
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Artigos aprofundados, podcasts rápidos e vídeos educativos produzidos pelo corpo clínico da Clínica Vittacare.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por menopausa, HPV, candidíase, fertilidade, tireoide, cólica..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] shadow-2xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        </div>

        {/* Tracks Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedTrack('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedTrack === 'all'
                ? 'bg-[#5D1425] text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            🌸 Todas as Trilhas
          </button>

          <button
            onClick={() => setSelectedTrack('saude_intima')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedTrack === 'saude_intima'
                ? 'bg-[#5D1425] text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            🛡️ Saúde Íntima & ISTs
          </button>

          <button
            onClick={() => setSelectedTrack('menopausa')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedTrack === 'menopausa'
                ? 'bg-[#5D1425] text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            🍂 Perimenopausa & Menopausa
          </button>

          <button
            onClick={() => setSelectedTrack('fertilidade')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedTrack === 'fertilidade'
                ? 'bg-[#5D1425] text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            👶 Planejamento & Fertilidade
          </button>

          <button
            onClick={() => setSelectedTrack('nutricao_metabolismo')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedTrack === 'nutricao_metabolismo'
                ? 'bg-[#5D1425] text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            🥗 Nutrição & Metabolismo
          </button>
        </div>

        {/* Formats Filter (Article, Podcast, Video) */}
        <div className="flex items-center gap-2 text-xs pt-1">
          <span className="text-stone-400 text-[11px] font-semibold">Formato:</span>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'article', label: '📄 Artigos' },
            { id: 'podcast', label: '🎙️ Podcasts Rápidos' },
            { id: 'video', label: '🎥 Vídeos Curtos' },
          ].map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                selectedFormat === fmt.id
                  ? 'bg-[#B89243] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Podcast / Audio Player Bar */}
      <div className="bg-gradient-to-r from-[#FAF6ED] via-[#FDFBF7] to-[#FAF0F2] rounded-3xl p-5 sm:p-6 border border-[#E6D4AF] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5D1425] to-[#8D253D] text-white flex items-center justify-center shadow-xs shrink-0">
            <Headphones className="w-6 h-6 text-[#E6D4AF]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8D253D] tracking-wider block">
              Vittacast Mulher • Áudio Exclusivo
            </span>
            <strong className="font-serif text-sm sm:text-base text-[#480D1B] block">
              Prevenção Ativa do HPV, Tipos de Alto Risco e Vacinação no Adulto
            </strong>
            <span className="text-[11px] text-stone-500">
              Dra. Juliana Prado • 8 min de escuta rápida
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            {isPlayingAudio ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Ouvir Episódio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredArticles.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-stone-200 hover:border-[#DEC68E] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 sm:p-6 space-y-3">
              {/* Type & Track Badges */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D253D] bg-[#FAF0F2] px-2.5 py-0.5 rounded-full border border-[#EBBEC8]">
                  {item.trackLabel}
                </span>

                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.duration}</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif font-bold text-lg text-[#480D1B] leading-snug">
                {item.title}
              </h3>

              {/* Summary */}
              <p className="text-xs text-stone-600 leading-relaxed">
                {item.summary}
              </p>

              {/* Author */}
              <div className="flex items-center gap-2 pt-1 text-xs text-stone-500">
                <User className="w-3.5 h-3.5 text-[#B89243]" />
                <span className="truncate">{item.author} ({item.authorRole.split('•')[0]})</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => handleShare(item)}
                className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-[#5D1425] transition-colors cursor-pointer"
                title="Compartilhar conteúdo"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveArticle(item)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <span>{item.type === 'podcast' ? 'Ouvir Podcast' : item.type === 'video' ? 'Assistir Vídeo' : 'Ler Artigo'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Aviso Educativo — Não substitui avaliação clínica individual (Section 14) */}
      <EducationalClinicalBanner variant="patient" />

      {/* ARTICLE READER / DETAIL MODAL */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E6D4AF] shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-[#8D253D] bg-[#FAF0F2] px-2.5 py-1 rounded-full border border-[#EBBEC8]">
                  {activeArticle.trackLabel}
                </span>
                <span className="text-xs text-stone-400">
                  {activeArticle.duration}
                </span>
              </div>

              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#480D1B] leading-tight">
                {activeArticle.title}
              </h2>

              <p className="text-xs text-stone-500 mt-1">
                Por <strong>{activeArticle.author}</strong> • {activeArticle.authorRole}
              </p>
            </div>

            {/* Podcast / Video Player Box if applicable */}
            {activeArticle.type === 'podcast' && (
              <div className="p-4 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF] flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-10 h-10 rounded-xl bg-[#5D1425] text-white flex items-center justify-center shadow-xs cursor-pointer"
                >
                  {isPlayingAudio ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                </button>
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                    <span>Áudio do Especialista Vittacare</span>
                    <span>{isPlayingAudio ? '02:14 / 08:00' : '00:00 / 08:00'}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                    <div className="h-full bg-[#8D253D] rounded-full" style={{ width: `${isPlayingAudio ? 35 : 0}%` }} />
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Paragraphs */}
            <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
              {activeArticle.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Key Takeaways */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
              <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px] block">
                Pontos Essenciais para Lembrar:
              </span>
              <ul className="space-y-1 text-emerald-800">
                {activeArticle.keyTakeaways.map((k, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-[#5D1425] text-white text-xs font-bold hover:bg-[#741C30] cursor-pointer"
              >
                Fechar Artigo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
