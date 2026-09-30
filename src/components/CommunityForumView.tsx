import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter, 
  Pin, 
  Send, 
  Lock, 
  Baby, 
  CheckCircle, 
  Share2, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { INITIAL_FORUM_POSTS } from '../data/mockData';
import { ForumPost, ForumComment } from '../types';

export const CommunityForumView: React.FC = () => {
  const { patient } = usePatient();

  const [posts, setPosts] = useState<ForumPost[]>(() => {
    try {
      const saved = localStorage.getItem('vittaconect_forum_posts_v1');
      return saved ? JSON.parse(saved) : INITIAL_FORUM_POSTS;
    } catch {
      return INITIAL_FORUM_POSTS;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>('fp-pinned');
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});

  // New Post Modal
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<'birth_month' | 'first_trimester' | 'breastfeeding' | 'delivery' | 'nutrition' | 'mental_health'>('birth_month');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    localStorage.setItem('vittaconect_forum_posts_v1', JSON.stringify(posts));
  }, [posts]);

  // Dynamic birth month group label based on patient due date
  const birthMonthLabel = patient?.dueDate 
    ? `Grupo de ${patient.dueDate.split(' de ')[1] || 'Parto'}` 
    : 'Grupo Março & Abril / 2027';

  // Toggle Like on Post
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, likes: p.likes + 1 };
        }
        return p;
      })
    );
  };

  // Add Comment to Post
  const handleAddComment = (postId: string) => {
    const text = (newCommentText[postId] || '').trim();
    if (!text) return;

    const newComment: ForumComment = {
      id: `fc-${Date.now()}`,
      authorName: patient?.preferredName || patient?.name?.split(' ')[0] || 'Mãezinha',
      authorRole: `Gestante (${patient?.currentWeek || 18}ª sem • Bebê ${patient?.babyNickname || 'Bebê'})`,
      content: text,
      createdAt: 'Agora mesmo',
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    setNewCommentText((prev) => ({ ...prev, [postId]: '' }));
  };

  // Handle New Post Submit
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const categoryLabels: Record<string, string> = {
      birth_month: birthMonthLabel,
      first_trimester: 'Primeira Viagem & 1º Tri',
      breastfeeding: 'Amamentação Sem Segredo',
      delivery: 'Parto Humanizado & Cesárea',
      nutrition: 'Nutrição & Bem-Estar',
      mental_health: 'Saúde Mental & Puerpério',
    };

    const newPost: ForumPost = {
      id: `fp-${Date.now()}`,
      category: postCategory,
      categoryLabel: categoryLabels[postCategory] || 'Comunidade Geral',
      title: postTitle.trim(),
      content: postContent.trim(),
      authorName: isAnonymous ? 'Mãezinha Anônima' : patient?.preferredName || patient?.name?.split(' ')[0] || 'Mãezinha',
      authorBaby: isAnonymous ? undefined : `Bebê ${patient?.babyNickname || 'Bebê'} (${patient?.currentWeek || 18} sem)`,
      createdAt: 'Agora mesmo',
      likes: 1,
      commentsCount: 0,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setPostTitle('');
    setPostContent('');
    setIsNewPostOpen(false);
  };

  // Filter posts by category and search
  const filteredPosts = posts.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F2] border border-[#EBBEC8] text-[#8D253D] text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5 text-[#B89243]" />
            <span>Rede Oficial de Mães & Mulheres • Clínica Vittacare</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
            Fórum de Apoio entre Mães & Mulheres
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Espaço acolhedor para compartilhar relatos, tirar dúvidas e criar laços, com mediação ativa da nossa equipe obstétrica.
          </p>
        </div>

        {/* New Post Button */}
        <button
          onClick={() => setIsNewPostOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#5D1425] via-[#741C30] to-[#480D1B] hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Publicação</span>
        </button>
      </div>

      {/* Moderation Safety Guarantee Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#FAF6ED] via-[#FDFBF7] to-[#FAF0F2] border border-[#E6D4AF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5D1425] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#E6D4AF]" />
          </div>
          <div>
            <strong className="text-[#480D1B] block font-serif text-sm">
              Ambiente Seguro, Empático e Moderado 24h
            </strong>
            <span className="text-stone-600 block">
              Enfermeiras obstétricas e psicólogas perinatais da Vittacare acompanham este espaço para responder dúvidas técnicas e manter o respeito mútuo.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DEC68E] text-[#8D253D] font-semibold shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#B89243]" />
          <span>Selo de Moderação Vittacare</span>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por dúvidas, sintomas, parto, enxoval, amamentação..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#5D1425] shadow-2xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        </div>

        {/* Group Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#5D1425] text-white shadow-2xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            🍼 Todos os Tópicos
          </button>

          <button
            onClick={() => setSelectedCategory('birth_month')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'birth_month'
                ? 'bg-[#5D1425] text-white shadow-2xs'
                : 'bg-white border border-stone-200 text-[#8D253D] hover:bg-rose-50'
            }`}
          >
            📅 {birthMonthLabel}
          </button>

          <button
            onClick={() => setSelectedCategory('first_trimester')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'first_trimester'
                ? 'bg-[#5D1425] text-white shadow-2xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            👶 1ª Viagem & Início
          </button>

          <button
            onClick={() => setSelectedCategory('breastfeeding')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'breastfeeding'
                ? 'bg-[#5D1425] text-white shadow-2xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            🤱 Amamentação
          </button>

          <button
            onClick={() => setSelectedCategory('delivery')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'delivery'
                ? 'bg-[#5D1425] text-white shadow-2xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            🌸 Parto & Nascimento
          </button>

          <button
            onClick={() => setSelectedCategory('nutrition')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'nutrition'
                ? 'bg-[#5D1425] text-white shadow-2xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            🥗 Nutrição & Sintomas
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-6 space-y-2">
            <MessageCircle className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="font-serif font-bold text-base text-stone-700">Nenhum tópico encontrado</p>
            <p className="text-xs text-stone-500">Seja a primeira a criar uma publicação nesta categoria!</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isCommentsExpanded = expandedCommentsPostId === post.id;
            return (
              <div
                key={post.id}
                className={`bg-white rounded-3xl border transition-all shadow-2xs overflow-hidden ${
                  post.isPinned ? 'border-[#B89243] bg-gradient-to-b from-[#FDFBF7] to-white' : 'border-stone-200'
                }`}
              >
                {/* Pinned Tag */}
                {post.isPinned && (
                  <div className="px-5 py-2 bg-gradient-to-r from-[#FAF0F2] via-[#FAF6ED] to-white border-b border-[#E6D4AF]/40 flex items-center gap-1.5 text-[11px] font-bold text-[#8D253D]">
                    <Pin className="w-3.5 h-3.5 text-[#B89243]" />
                    <span>Tópico Fixado pela Equipe de Moderação Clínica Vittacare</span>
                  </div>
                )}

                <div className="p-5 sm:p-6 space-y-4">
                  {/* Post Header: Author info & Tag */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-serif font-bold text-sm text-white ${
                          post.isClinicOfficial
                            ? 'bg-gradient-to-br from-[#5D1425] to-[#8D253D] shadow-xs'
                            : 'bg-gradient-to-br from-[#DEC68E] to-[#B89243]'
                        }`}
                      >
                        {post.authorName[0]}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-[#480D1B]">
                            {post.authorName}
                          </span>
                          {post.isClinicOfficial && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              <CheckCircle className="w-3 h-3" />
                              <span>Equipe Vittacare</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          {post.authorRole && <span>{post.authorRole}</span>}
                          {post.authorBaby && <span>{post.authorBaby}</span>}
                          <span>• {post.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-[#8D253D] bg-[#FAF0F2] px-2.5 py-1 rounded-full border border-[#EBBEC8] whitespace-nowrap">
                      {post.categoryLabel}
                    </span>
                  </div>

                  {/* Post Title & Content */}
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#480D1B] leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* Actions Bar: Likes, Comments Toggle, Share */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      {/* Like button */}
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center gap-1.5 text-stone-600 hover:text-[#8D253D] transition-colors cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-[#8D253D] fill-rose-50 hover:fill-[#8D253D]" />
                        <span className="font-semibold">{post.likes}</span>
                      </button>

                      {/* Comments toggle */}
                      <button
                        onClick={() =>
                          setExpandedCommentsPostId(isCommentsExpanded ? null : post.id)
                        }
                        className="flex items-center gap-1.5 text-stone-600 hover:text-[#5D1425] transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 text-[#B89243]" />
                        <span className="font-semibold">
                          {post.comments.length} Respostas
                        </span>
                      </button>
                    </div>

                    <span className="text-[11px] text-stone-400">
                      Moderação ativa Vittacare
                    </span>
                  </div>

                  {/* Comments Section */}
                  {isCommentsExpanded && (
                    <div className="pt-4 border-t border-stone-100 space-y-3 bg-[#FAF6ED]/40 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 rounded-b-3xl">
                      {post.comments.length > 0 ? (
                        <div className="space-y-2.5">
                          {post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                                comment.isClinicOfficial
                                  ? 'bg-white border-2 border-[#DEC68E] shadow-2xs'
                                  : 'bg-white border border-stone-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <strong className="text-stone-800 font-serif">
                                    {comment.authorName}
                                  </strong>
                                  {comment.isClinicOfficial && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-[#5D1425] text-white text-[9px] font-bold">
                                      Resposta Oficial
                                    </span>
                                  )}
                                  <span className="text-stone-400 text-[10px]">
                                    • {comment.createdAt}
                                  </span>
                                </div>
                              </div>
                              {comment.authorRole && (
                                <span className="text-[10px] text-stone-500 block">
                                  {comment.authorRole}
                                </span>
                              )}
                              <p className="text-stone-700 pt-1 leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-stone-500 italic text-center py-2">
                          Nenhum comentário ainda. Deixe a primeira palavra de carinho!
                        </p>
                      )}

                      {/* Comment Input */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Escreva sua resposta ou palavra de apoio..."
                          value={newCommentText[post.id] || ''}
                          onChange={(e) =>
                            setNewCommentText((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(post.id);
                            }
                          }}
                          className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          className="p-2 rounded-xl bg-[#5D1425] text-white hover:bg-[#741C30] transition-colors cursor-pointer"
                          title="Enviar comentário"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE NEW POST MODAL */}
      {isNewPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#E6D4AF] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-xl text-[#480D1B] mb-1">
              Nova Publicação no Fórum
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Tire dúvidas, compartilhe suas conquistas ou peça acolhimento à comunidade.
            </p>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Grupo / Categoria do Tópico *
                </label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425] bg-stone-50/50"
                >
                  <option value="birth_month">📅 {birthMonthLabel}</option>
                  <option value="first_trimester">👶 Primeira Viagem & 1º Trimestre</option>
                  <option value="breastfeeding">🤱 Amamentação Sem Segredo</option>
                  <option value="delivery">🌸 Parto Humanizado & Plano de Parto</option>
                  <option value="nutrition">🥗 Nutrição, Receitas & Sintomas</option>
                  <option value="mental_health">🧘‍♀️ Saúde Mental Materna & Puerpério</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Título da Publicação *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dúvida sobre contrações de treinamento ou enxoval..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Sua Mensagem ou Pergunta *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Conte com detalhes o que está sentindo, vivenciando ou que gostaria de saber..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                />
              </div>

              {/* Anonymity Option */}
              <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="accent-[#5D1425] cursor-pointer"
                />
                <label htmlFor="anonymousCheck" className="text-stone-700 cursor-pointer">
                  Publicar como <strong>"Mãezinha Anônima"</strong> (para dúvidas mais íntimas)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewPostOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Publicar no Fórum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
