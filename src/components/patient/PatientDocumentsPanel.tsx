import React, { useState, useEffect } from 'react';
import {
  FileText,
  Eye,
  Printer,
  Plus,
  Send,
  Search,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  X,
} from 'lucide-react';
import { usePatient } from '../../context/PatientContext';
import { useFeedback } from '../../context/FeedbackContext';
import { sendRealtimeChatMessage } from '../../services/realtimeChat';

export type ClinicalDocCategory =
  | 'exame'
  | 'receita'
  | 'atestado'
  | 'documento'
  | 'resultado';

export interface ClinicalDocumentItem {
  id: string;
  title: string;
  category: ClinicalDocCategory;
  categoryLabel: string;
  date: string;
  professional: string;
  council: string;
  status: 'verificado' | 'disponivel' | 'pendente_avaliacao';
  summary: string;
  contentDetails: string;
}

const DOCS_STORAGE_KEY = 'vittaconect_patient_documents_v2';

const INITIAL_DOCUMENTS: ClinicalDocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Receita Digital: Polivitamínico Materno & Ferro Quelato',
    category: 'receita',
    categoryLabel: 'Receita Digital',
    date: '10/10/2026',
    professional: 'Enf. Marcelo & Dra. Letícia',
    council: 'COREN-SP 000.002 (Homologado)',
    status: 'verificado',
    summary: 'Uso contínuo no 2º trimestre gestacional conforme protocolo Vittacare.',
    contentDetails:
      '1. Suplemento Pré-Natal com Metilfolato e DHA — Tomar 1 cápsula após o almoço.\n2. Ferro Quelato 30mg — Tomar 1 cápsula 30 minutos antes do jantar com suco cítrico.\nAssinado digitalmente na Clínica Vittacare.',
  },
  {
    id: 'doc-2',
    title: 'Laudo: Ultrassonografia Obstétrica com Translucência Nucal',
    category: 'resultado',
    categoryLabel: 'Resultado / Laudo',
    date: '28/09/2026',
    professional: 'Dra. Letícia',
    council: 'CRM/COREN Vittacare Imagem',
    status: 'verificado',
    summary: 'Feto único, tópico, vitalidade preservada, BCF 152 bpm, TN 1,4 mm (Normal).',
    contentDetails:
      'Biometria fetal compatível com a idade gestacional. Osso nasal presente, ducto venoso com onda A positiva. Líquido amniótico em volume normal e placenta anterior grau 0.',
  },
  {
    id: 'doc-3',
    title: 'Solicitação de Exames: Rotina Laboratorial de 2º Trimestre',
    category: 'exame',
    categoryLabel: 'Guia de Exame',
    date: '05/10/2026',
    professional: 'Enfª. Stephanie',
    council: 'COREN-SP 000.004',
    status: 'disponivel',
    summary: 'Hemograma completo, Ferritina, Urina Tipo 1, Urocultura e TOTG 75g.',
    contentDetails:
      'Solicito realização de Hemograma, Glicemia de Jejum, Curva Glicêmica (TOTG 75g entre 24-28 semanas), Urina I e Urocultura com antibiograma. Preparo: jejum de 8 horas.',
  },
  {
    id: 'doc-4',
    title: 'Atestado de Comparecimento em Consulta Pré-Natal',
    category: 'atestado',
    categoryLabel: 'Atestado / Declaração',
    date: '05/10/2026',
    professional: 'Clínica Vittacare',
    council: 'Registro Institucional Vittacare',
    status: 'verificado',
    summary: 'Declaração oficial de comparecimento para apresentação trabalhista.',
    contentDetails:
      'Declaramos para os devidos fins legais (Art. 392 § 4º da CLT) que a paciente esteve em acompanhamento clínico pré-natal na Clínica Vittacare no período da manhã.',
  },
  {
    id: 'doc-5',
    title: 'Termo de Consentimento & Guia de Acolhimento Vittacare',
    category: 'documento',
    categoryLabel: 'Documento Clínico',
    date: '15/06/2026',
    professional: 'Equipe Multidisciplinar Vittacare',
    council: 'Protocolo Assistencial 2.0',
    status: 'verificado',
    summary: 'Diretrizes de acompanhamento humanizado, plantão 24h e proteção LGPD.',
    contentDetails:
      'Documento institucional de boas-vindas com orientações de contato com os 4 enfermeiros de referência (Letícia, Marcelo, Bianca e Stephanie) e direitos da gestante e da mulher.',
  },
];

export const PatientDocumentsPanel: React.FC = () => {
  const { patient } = usePatient();
  const { showToast } = useFeedback();

  const [documents, setDocuments] = useState<ClinicalDocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(DOCS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(documents));
    } catch {
      // ignore
    }
  }, [documents]);

  const [activeCategory, setActiveCategory] = useState<'todos' | ClinicalDocCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<ClinicalDocumentItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New document form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ClinicalDocCategory>('resultado');
  const [newSummary, setNewSummary] = useState('');
  const [newDetails, setNewDetails] = useState('');

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = activeCategory === 'todos' || doc.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.professional.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const categoryLabels: Record<ClinicalDocCategory, string> = {
      exame: 'Guia de Exame',
      receita: 'Receita Digital',
      atestado: 'Atestado / Declaração',
      documento: 'Documento Clínico',
      resultado: 'Resultado / Laudo',
    };

    const created: ClinicalDocumentItem = {
      id: `doc-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory],
      date: new Date().toLocaleDateString('pt-BR'),
      professional: 'Registrado pela Paciente',
      council: 'Aguardando Visto da Enfermagem',
      status: 'pendente_avaliacao',
      summary: newSummary.trim(),
      contentDetails: newDetails.trim() || newSummary.trim(),
    };

    setDocuments((prev) => [created, ...prev]);
    setNewTitle('');
    setNewSummary('');
    setNewDetails('');
    setIsAddModalOpen(false);

    showToast({
      title: 'Documento Adicionado',
      description: `"${created.title}" foi salvo na sua central de documentos.`,
      tone: 'success',
    });
  };

  const handleSendToNurse = async (doc: ClinicalDocumentItem) => {
    await sendRealtimeChatMessage({
      channelId: 'group',
      senderId: patient?.id || 'pat-1',
      senderName: patient?.name || 'Paciente',
      senderRole: 'paciente',
      text: `📎 [Documento Compartilhado: ${doc.categoryLabel}] ${doc.title} (${doc.date}) — Resumo: ${doc.summary}`,
      category: 'exame',
    });
    showToast({
      title: 'Documento Enviado ao Chat',
      description: `A equipe de enfermagem recebeu "${doc.title}" para análise.`,
      tone: 'success',
    });
  };

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E6D4AF] shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8D253D] block">
            Arquivo Clínico Organizado • Seção 13
          </span>
          <h3 className="font-serif font-bold text-xl text-[#480D1B] mt-0.5">
            Exames, Receitas, Atestados & Resultados
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Consulte, filtre e imprima seus documentos médicos ou envie resultados para a equipe de enfermagem.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#E6D4AF]" />
          <span>Registrar Resultado / Documento</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {(
            [
              { id: 'todos', label: 'Todos' },
              { id: 'exame', label: 'Exames' },
              { id: 'receita', label: 'Receitas' },
              { id: 'resultado', label: 'Resultados' },
              { id: 'atestado', label: 'Atestados' },
              { id: 'documento', label: 'Documentos' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#5D1425] text-white shadow-2xs'
                  : 'bg-[#FAF6ED] text-stone-700 border border-[#E6D4AF] hover:bg-[#F3EBD8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar documento ou exame..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E6D4AF]/80 hover:border-[#B89243] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] border border-[#EBBEC8] text-[#8D253D] flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                  <span className="font-bold text-[#8D253D]">{doc.categoryLabel}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {doc.date}
                  </span>
                  <span>·</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {doc.status === 'verificado'
                      ? 'Assinado pela Clínica'
                      : doc.status === 'disponivel'
                      ? 'Disponível'
                      : 'Enviado p/ Revisão'}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base text-[#480D1B]">
                  {doc.title}
                </h4>
                <p className="text-xs text-stone-600">{doc.summary}</p>
                <span className="text-[11px] text-stone-400 block">
                  Responsável: {doc.professional} ({doc.council})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setSelectedDoc(doc)}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-[#480D1B] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#B89243]" />
                <span>Ver Detalhes</span>
              </button>
              <button
                type="button"
                onClick={() => handleSendToNurse(doc)}
                className="px-3 py-1.5 rounded-xl bg-[#FAF0F2] border border-[#EBBEC8] hover:bg-[#F5DFE4] text-[#5D1425] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar à Equipe</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#E6D4AF] shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-[#8D253D] uppercase tracking-wider">
                  {selectedDoc.categoryLabel} • {selectedDoc.date}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#480D1B] mt-0.5">
                  {selectedDoc.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E6D4AF] space-y-2 text-xs">
              <p className="font-semibold text-[#480D1B]">Resumo Clínico:</p>
              <p className="text-stone-700 leading-relaxed">{selectedDoc.summary}</p>
              <div className="pt-2 border-t border-stone-200/60">
                <p className="font-semibold text-[#480D1B] mb-1">Conteúdo / Prescrição / Laudo:</p>
                <p className="text-stone-700 whitespace-pre-line font-mono text-[11px] leading-relaxed">
                  {selectedDoc.contentDetails}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 bg-stone-50 p-3 rounded-xl">
              <span>
                Emitido por: <strong>{selectedDoc.professional}</strong> ({selectedDoc.council})
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Salvar PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl bg-[#5D1425] text-white text-xs font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E6D4AF] shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#480D1B]">
              Registrar Novo Documento ou Resultado
            </h3>
            <form onSubmit={handleAddDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#480D1B] mb-1">Categoria</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ClinicalDocCategory)}
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                >
                  <option value="resultado">Resultado / Laudo de Exame</option>
                  <option value="exame">Pedido / Guia de Exame</option>
                  <option value="receita">Receita / Prescrição</option>
                  <option value="atestado">Atestado / Declaração</option>
                  <option value="documento">Outro Documento Clínico</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#480D1B] mb-1">Título *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Resultado Hemograma e Ferritina"
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                />
              </div>
              <div>
                <label className="block font-bold text-[#480D1B] mb-1">Resumo Principal *</label>
                <input
                  type="text"
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Ex: Hemoglobina 12,4 g/dL, Ferritina 45 ng/mL"
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                />
              </div>
              <div>
                <label className="block font-bold text-[#480D1B] mb-1">
                  Observações / Valores Detalhados
                </label>
                <textarea
                  rows={3}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Cole ou digite aqui os detalhes do laudo..."
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5D1425] text-white font-bold cursor-pointer"
                >
                  Salvar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
