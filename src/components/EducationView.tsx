import React, { useState } from 'react';
import { 
  BookOpen, 
  Heart, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Smile, 
  Wind, 
  Play, 
  Pause, 
  RotateCcw,
  Shield,
  Apple,
  Baby,
  Flower2
} from 'lucide-react';
import { EDUCATIONAL_ARTICLES } from '../data/mockData';
import { EducationalArticle } from '../types';

export const EducationView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<EducationalArticle | null>(null);
  
  // Guided Breathing State (Saúde Mental Materna)
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inspire' | 'retencao' | 'expire'>('inspire');
  const [breathingSeconds, setBreathingSeconds] = useState(4);

  const categories = [
    { id: 'all', label: 'Todos os Cuidados' },
    { id: 'saude_gestante', label: 'Saúde da Gestante' },
    { id: 'preventivos_mulher', label: 'Exames Preventivos da Mulher' },
    { id: 'saude_mental', label: 'Saúde Mental Materna' },
    { id: 'amamentacao', label: 'Amamentação' },
    { id: 'nutricao', label: 'Nutrição' },
  ];

  const filteredArticles = selectedCategory === 'all'
    ? EDUCATIONAL_ARTICLES
    : EDUCATIONAL_ARTICLES.filter((a) => a.category === selectedCategory);

  // Toggle Breathing Exercise
  const toggleBreathing = () => {
    setIsBreathingActive(!isBreathingActive);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Title & Introduction */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8D253D] uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-[#3B744C]" />
          Biblioteca Preventiva Vittacare
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
          Prevenção e Cuidados
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl">
          Informações acolhedoras, cientificamente embasadas pela equipe de obstetrícia e medicina preventiva da Clínica Vittacare.
        </p>
      </div>

      {/* Interactive Maternal Breathing Tool (Pausa de Serenidade) */}
      <section className="bg-gradient-to-br from-[#FAF0F2] via-white to-[#FAF6ED] rounded-3xl p-6 sm:p-7 border border-[#EBBEC8]/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase font-bold tracking-wider text-[#741C30] bg-white px-3 py-1 rounded-full border border-[#EBBEC8]">
              <Flower2 className="w-3.5 h-3.5 text-[#B89243]" />
              Saúde Mental Materna · Pausa Consciente
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#480D1B]">
              Exercício de Respiração Compassiva
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg">
              Reduz a liberação de cortisol, oxigena a placenta e acolhe as emoções do dia com o ritmo cardíaco do seu bebê.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Animated Breathing Circle */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-tr from-[#FAF0F2] via-[#E6D4AF]/40 to-[#FAF6ED] border-2 border-[#B89243] flex flex-col items-center justify-center transition-all duration-1000 ${
                  isBreathingActive ? 'scale-110 shadow-lg' : 'scale-95'
                }`}
              >
                <Wind className="w-6 h-6 text-[#5D1425] mb-0.5" />
                <span className="text-[10px] uppercase font-bold text-[#5D1425]">
                  {isBreathingActive ? 'Inspire suave' : 'Respire'}
                </span>
              </div>
            </div>

            <button
              onClick={toggleBreathing}
              className={`px-5 py-3 rounded-2xl text-xs font-bold tracking-wide flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isBreathingActive
                  ? 'bg-[#5D1425] text-white hover:bg-[#741C30]'
                  : 'bg-[#B89243] text-[#2C0610] hover:bg-[#CAA55C]'
              }`}
            >
              {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isBreathingActive ? 'Pausar Exercício' : 'Iniciar 3 Minutos'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#5D1425] text-white font-semibold shadow-xs'
                : 'bg-white border border-[#E6D4AF]/80 text-stone-600 hover:text-[#5D1425] hover:border-[#B89243]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles Grid (Prompt: Categorias com Cards Ilustrados) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((article) => {
          // Curated aesthetic category badges & color accents
          const getCategoryTheme = (cat: string) => {
            switch (cat) {
              case 'saude_gestante':
                return {
                  gradient: 'from-[#FAF6ED] via-[#FDFBF7] to-white',
                  border: 'border-[#E6D4AF]',
                  badgeBg: 'bg-[#FAF6ED]',
                  badgeText: 'text-[#9B7731]',
                  icon: Baby,
                };
              case 'preventivos_mulher':
                return {
                  gradient: 'from-[#F2F7F3] via-[#FDFBF7] to-white',
                  border: 'border-[#DFEDE2]',
                  badgeBg: 'bg-[#F2F7F3]',
                  badgeText: 'text-[#3B744C]',
                  icon: Shield,
                };
              case 'saude_mental':
                return {
                  gradient: 'from-[#FAF0F2] via-[#FDFBF7] to-white',
                  border: 'border-[#EBBEC8]',
                  badgeBg: 'bg-[#FAF0F2]',
                  badgeText: 'text-[#8D253D]',
                  icon: Flower2,
                };
              case 'nutricao':
                return {
                  gradient: 'from-[#FAF6ED] via-[#FDFBF7] to-white',
                  border: 'border-[#E6D4AF]',
                  badgeBg: 'bg-[#FAF6ED]',
                  badgeText: 'text-[#9B7731]',
                  icon: Apple,
                };
              default:
                return {
                  gradient: 'from-[#FAF0F2] via-[#FDFBF7] to-white',
                  border: 'border-[#EBBEC8]',
                  badgeBg: 'bg-[#FAF0F2]',
                  badgeText: 'text-[#8D253D]',
                  icon: BookOpen,
                };
            }
          };

          const theme = getCategoryTheme(article.category);
          const CategoryIcon = theme.icon;

          return (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className={`rounded-3xl p-6 bg-gradient-to-b ${theme.gradient} border ${theme.border} hover:border-[#B89243] hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group`}
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl ${theme.badgeBg} flex items-center justify-center ${theme.badgeText} shadow-xs`}>
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${theme.badgeText}`}>
                      {article.categoryLabel}
                    </span>
                  </div>

                  <span className="text-[11px] text-stone-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-lg text-[#480D1B] group-hover:text-[#5D1425] transition-colors leading-snug">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              {/* Footer with key takeaway tag */}
              <div className="mt-5 pt-4 border-t border-stone-100/80 flex items-center justify-between">
                <span className="text-[11px] font-medium text-stone-500">
                  {article.keyTakeaways.length} dicas práticas
                </span>
                <span className="text-xs font-bold text-[#5D1425] group-hover:text-[#8D253D] flex items-center gap-1">
                  Ler Guia Completo
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#E6D4AF] shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 bg-[#FAF0F2] border-b border-[#EBBEC8] flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#8D253D]">
                  {activeArticle.categoryLabel}
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#480D1B] mt-1">
                  {activeArticle.title}
                </h3>
                <span className="text-xs text-stone-500 mt-1 block">
                  Revisado pela Equipe Médica da Clínica Vittacare · Leitura de {activeArticle.readTime}
                </span>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="text-stone-400 hover:text-stone-800 p-2 rounded-full hover:bg-white/60 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-sm text-stone-700 leading-relaxed">
              {activeArticle.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}

              {/* Key Takeaways Box */}
              <div className="mt-6 p-5 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF]/80 space-y-2.5">
                <h4 className="font-serif font-bold text-[#480D1B] text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3B744C]" />
                  Pontos Principais para Lembrar
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {activeArticle.keyTakeaways.map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#B89243] font-bold">•</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500 italic">
                Tem dúvidas? Converse na sua próxima teleorientação Vittaconect.
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
