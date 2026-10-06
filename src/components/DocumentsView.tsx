import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Pill,
  FileCheck2,
  ClipboardList,
  Activity,
  Search,
  Printer,
  Send,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  ShieldCheck,
  X,
} from 'lucide-react';
import { ClinicalDocumentItem, ClinicalDocumentCategory } from '../types';
import { usePatient } from '../context/PatientContext';
import { useFeedback } from '../context/FeedbackContext';
import { sendRealtimeChatMessage } from '../services/realtimeChat';
import { EducationalClinicalBanner } from './ui';

const DOCUMENTS_STORAGE_KEY = 'vittaconect_clinical_documents_v2';

const INITIAL_CLINICAL_DOCUMENTS: ClinicalDocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Ultrassonografia Morfológica de 2º Trimestre + Doppler',
    category: 'exames',
    categoryLabel: 'Pedido & Guia de Exame',
    date: '10/10/2026',
    professional: 'Enf. Marcelo & Equipe Obstétrica Vittacare',
    professionalCouncil: 'COREN-SP 412.890 / CRM-SP 148.210',
    status: 'assinado_digitalmente',
    summary:
      'Solicitação de avaliação anatômica detalhada fetal, biometria, medida do colo uterino transvaginal e dopplervelocimetria das artérias uterinas.',
    details: [
      'Indicação clínica: Acompanhamento pré-natal de risco habitual (18ª a 22ª semana gestacional).',
      'Preparo: Bexiga levemente vazia; trazer exames anteriores de 1º trimestre.',
      'Validade da guia: 60 dias a partir da emissão.',
    ],
    recommendations:
      'Agendar preferencialmente entre a 20ª e a 22ª semana gestacional na Clínica Vittacare.',
    patientMode: 'gestante',
  },
  {
    id: 'doc-2',
    title: 'Receita de Suplementação Materna (Ferro Quelato + Metilfolato + DHA)',
    category: 'receitas',
    categoryLabel: 'Receituário Clínico',
    date: '05/10/2026',
    professional: 'Enfª. Stephanie & Dra. Helena',
    professionalCouncil: 'COREN-SP 519.302',
    status: 'assinado_digitalmente',
    summary:
      'Prescrição de suplementação contínua para manutenção de reservas de ferro, fechamento e maturação neurocognitiva fetal.',
    details: [
      '1. Bisglicinato Ferroso 30mg — Tomar 1 cápsula 30 minutos antes do almoço com suco cítrico.',
      '2. L-Metilfolato de Cálcio 400mcg + Vitamina B12 — 1 comprimido ao dia pela manhã.',
      '3. Ômega-3 (DHA 500mg TG) — 1 cápsula junto à refeição principal.',
    ],
    recommendations:
      'Evitar ingerir o suplemento de ferro junto com leite, café ou derivados lácteos para não reduzir a absorção.',
    patientMode: 'gestante',
  },
  {
    id: 'doc-3',
    title: 'Laudo Laboratorial: Hemograma, Ferritina, Glicemia e Urina Tipo I',
    category: 'resultados',
    categoryLabel: 'Resultado & Laudo',
    date: '02/10/2026',
    professional: 'Enfª. Letícia (Revisão de Enfermagem)',
    professionalCouncil: 'COREN-SP 398.114',
    status: 'revisado_enfermagem',
    summary:
      'Resultados dentro dos parâmetros fisiológicos para o segundo trimestre gestacional, sem sinais de infecção urinária.',
    details: [
      'Hemoglobina: 12,4 g/dL • Hematócrito: 37,2% (Normal para gestante)',
      'Ferritina Sérica: 48 ng/mL (Reserva adequada)',
      'Glicemia de Jejum: 82 mg/dL (Meta < 92 mg/dL)',
      'Urina Tipo I e Urocultura: Negativa para crescimento bacteriano',
    ],
    recommendations:
      'Manter hidratação oral de 2,5L de água ao dia e apresentar na próxima consulta presencial.',
    patientMode: 'ambos',
  },
  {
    id: 'doc-4',
    title: 'Atestado de Comparecimento em Consulta Pré-Natal e Exames',
    category: 'atestados',
    categoryLabel: 'Atestado & Declaração',
    date: '02/10/2026',
    professional: 'Clínica Vittacare • Atendimento Integrado',
    professionalCouncil: 'CNES 904218-SP',
    status: 'assinado_digitalmente',
    summary:
      'Declaração oficial de comparecimento para fins trabalhistas (Art. 392 § 4º CLT — dispensa de horário para consultas e exames de pré-natal).',
    details: [
      'Período: Das 08h30 às 11h30 na Unidade Jardins — Clínica Vittacare.',
      'Finalidade: Realização de consulta de enfermagem obstétrica e coleta laboratorial.',
      'Amparo Legal: Direito garantido à gestante sem prejuízo salarial.',
    ],
    patientMode: 'ambos',
  },
  {
    id: 'doc-5',
    title: 'Plano de Parto Humanizado & Consentimento Informado Vittacare',
    category: 'documentos',
    categoryLabel: 'Documento Clínico',
    date: '01/10/2026',
    professional: 'Enfª. Bianca & Equipe de Parto Humanizado',
    professionalCouncil: 'COREN-SP 482.771',
    status: 'disponivel',
    summary:
      'Termo oficial de preferências de ambiência, acompanhante de livre escolha, alívio não farmacológico da dor e Hora de Ouro.',
    details: [
      'Acompanhante indicado e cadastrado no prontuário Vittaconect.',
      'Clampeamento oportuno do cordão umbilical e contato pele a pele imediato.',
      'Liberdade de posição e estímulo à amamentação na primeira hora de vida.',
    ],
    recommendations:
      'Pode ser atualizado a qualquer momento na aba Pré-Natal e impresso na 36ª semana.',
    patientMode: 'gestante',
  },
  {
    id: 'doc-6',
    title: 'Resultado Citopatológico (Papanicolaou) & Colposcopia Preventiva',
    category: 'resultados',
    categoryLabel: 'Resultado & Laudo',
    date: '18/09/2026',
    professional: 'Enfª. Letícia • Saúde da Mulher',
    professionalCouncil: 'COREN-SP 398.114',
    status: 'revisado_enfermagem',
    summary:
      'Amostra satisfatória. Negativo para lesão intraepitelial ou malignidade (Classe II / Normal).',
    details: [
      'Epitélios representados: Escamoso, glandular e metaplásico.',
      'Microbiologia: Lactobacillus sp. predominantes (Flora fisiológica).',
      'Conclusão: Sem alterações celulares atípicas.',
    ],
    recommendations:
      'Manter rastreio preventivo conforme protocolo anual/trienal da Clínica Vittacare.',
    patientMode: 'saude_feminina',
  },
  {
    id: 'doc-7',
    title: 'Prescrição Ginecológica & Orientações de Saúde Íntima',
    category: 'receitas',
    categoryLabel: 'Receituário Clínico',
    date: '18/09/2026',
    professional: 'Enfª. Stephanie • Ginecologia Preventiva',
    professionalCouncil: 'COREN-SP 519.302',
    status: 'assinado_digitalmente',
    summary:
      'Orientações de cuidado diário, suplementação de Vitamina D3 e manejo fisiológico da fase lútea.',
    details: [
      '1. Colecalciferol (Vitamina D3) 2.000 UI — 1 cápsula ao dia após o almoço.',
      '2. Magnésio Dimalato 300mg — 1 cápsula à noite nos 7 dias que antecedem a menstruação.',
      '3. Higiene íntima com sabonete líquido de pH fisiológico apenas na região externa.',
    ],
    patientMode: 'saude_feminina',
  },
];

const CATEGORY_TABS: {
  id: 'todos' | ClinicalDocumentCategory;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: 'todos', label: 'Todos', icon: ClipboardList },
  { id: 'exames', label: 'Exames', icon: Activity },
  { id: 'receitas', label: 'Receitas', icon: Pill },
  { id: 'atestados', label: 'Atestados', icon: FileCheck2 },
  { id: 'documentos', label: 'Documentos', icon: FileText },
  { id: 'resultados', label: 'Resultados', icon: CheckCircle2 },
];

export const DocumentsView: React.FC = () => {
  const { patient } = usePatient();
  const { showToast } = useFeedback();

  const [selectedCategory, setSelectedCategory] = useState<
    'todos' | ClinicalDocumentCategory
  >('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDoc, setActiveDoc] = useState<ClinicalDocumentItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New document form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] =
    useState<ClinicalDocumentCategory>('resultados');
  const [newProfessional, setNewProfessional] = useState(
    'Laboratório Externo / Equipe Vittacare'
  );
  const [newSummary, setNewSummary] = useState('');
  const [newDetails, setNewDetails] = useState('');

  const [documents, setDocuments] = useState<ClinicalDocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CLINICAL_DOCUMENTS;
    } catch {
      return INITIAL_CLINICAL_DOCUMENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
    } catch {
      // ignore quota errors
    }
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCat =
        selectedCategory === 'todos' || doc.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        doc.professional.toLowerCase().includes(q) ||
        doc.categoryLabel.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [documents, selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    return {
      todos: documents.length,
      exames: documents.filter((d) => d.category === 'exames').length,
      receitas: documents.filter((d) => d.category === 'receitas').length,
      atestados: documents.filter((d) => d.category === 'atestados').length,
      documentos: documents.filter((d) => d.category === 'documentos').length,
      resultados: documents.filter((d) => d.category === 'resultados').length,
    };
  }, [documents]);

  const handleShareWithNursing = async (doc: ClinicalDocumentItem) => {
    try {
      await sendRealtimeChatMessage({
        channelId: 'group',
        senderRole: 'paciente',
        senderId: patient?.id || 'paciente-ativa',
        senderName: patient?.name || 'Paciente',
        recipientId: 'group',
        recipientName: 'Equipe de Enfermagem Vittacare',
        patientName: patient?.name || 'Paciente',
        text: `📎 [Documento Compartilhado: ${doc.categoryLabel}]\nTítulo: ${doc.title}\nData: ${doc.date}\nResumo: ${doc.summary}\nSolicito avaliação da equipe de enfermagem.`,
        category: 'exame',
      });
    } catch {
      // fallback local
    }

    showToast({
      title: 'Documento enviado à Enfermagem',
      description: `"${doc.title}" foi anexado ao seu canal de chat clínico para revisão.`,
      tone: 'success',
    });
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const categoryLabels: Record<ClinicalDocumentCategory, string> = {
      exames: 'Pedido & Guia de Exame',
      receitas: 'Receituário Clínico',
      atestados: 'Atestado & Declaração',
      documentos: 'Documento Clínico',
      resultados: 'Resultado & Laudo',
    };

    const created: ClinicalDocumentItem = {
      id: `doc-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory],
      date: new Date().toLocaleDateString('pt-BR'),
      professional: newProfessional.trim() || 'Registrado pela Paciente',
      professionalCouncil: 'Prontuário Vittaconect 2.0',
      status: 'pendente_analise',
      summary: newSummary.trim(),
      details: newDetails
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      patientMode: patient?.userMode || 'ambos',
    };

    setDocuments((prev) => [created, ...prev]);
    setNewTitle('');
    setNewSummary('');
    setNewDetails('');
    setIsAddModalOpen(false);

    showToast({
      title: 'Documento Arquivado com Sucesso',
      description: `"${created.title}" foi salvo na categoria ${created.categoryLabel}.`,
      tone: 'success',
    });
  };

  const getStatusMeta = (status: ClinicalDocumentItem['status']) => {
    switch (status) {
      case 'assinado_digitalmente':
        return {
          label: 'Assinado Digitalmente',
          color: 'text-emerald-800',
          icon: ShieldCheck,
        };
      case 'revisado_enfermagem':
        return {
          label: 'Revisado pela Enfermagem',
          color: 'text-[#5D1425]',
          icon: CheckCircle2,
        };
      case 'pendente_analise':
        return {
          label: 'Aguardando Revisão',
          color: 'text-amber-700',
          icon: Clock,
        };
      default:
        return {
          label: 'Disponível no Prontuário',
          color: 'text-stone-600',
          icon: FileText,
        };
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8D253D] mb-1">
            Prontuário Digital da Paciente · Clínica Vittacare
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
            Documentos, Exames & Receitas
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Acesse seus pedidos de exames, receitas médicas, atestados, termos clínicos e resultados organizados por categoria.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#E6D4AF]" />
          <span>Adicionar Resultado / Documento</span>
        </button>
      </div>

      {/* Category Filter Tabs (Section 13: exames, receitas, atestados, documentos, resultados) */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#E6D4AF] shadow-2xs space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.id;
            const count = categoryCounts[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#5D1425] text-white shadow-xs'
                    : 'bg-[#FAF6ED]/70 text-stone-700 hover:bg-[#FAF0F2] hover:text-[#5D1425]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono ${
                    isSelected ? 'text-[#E6D4AF]' : 'text-stone-400'
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome do exame, medicamento, atestado ou profissional..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E6D4AF] text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#5D1425]"
          />
        </div>
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-[#E6D4AF] space-y-2">
          <FileText className="w-8 h-8 text-[#8D253D] mx-auto opacity-60" />
          <h3 className="font-serif font-bold text-lg text-[#480D1B]">
            Nenhum documento encontrado nesta categoria
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Altere o filtro acima ou clique em "Adicionar Resultado / Documento" para registrar um novo arquivo em seu prontuário.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocuments.map((doc) => {
            const statusMeta = getStatusMeta(doc.status);
            const StatusIcon = statusMeta.icon;

            return (
              <article
                key={doc.id}
                className="bg-white rounded-2xl p-5 border border-[#E6D4AF] hover:border-[#8D253D] transition-all flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-2.5">
                  {/* Unboxed clean metadata line */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                    <div className="flex items-center gap-1.5 font-semibold text-[#8D253D]">
                      <span>{doc.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-stone-500 font-normal">{doc.date}</span>
                    </div>

                    <div
                      className={`flex items-center gap-1 text-[11px] font-semibold ${statusMeta.color}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusMeta.label}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif font-bold text-lg text-[#480D1B] leading-snug">
                    {doc.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {doc.summary}
                  </p>

                  {/* Professional attribution */}
                  <p className="text-[11px] text-stone-500 pt-1">
                    Emitido/Revisado por:{' '}
                    <strong className="text-stone-700">{doc.professional}</strong> ·{' '}
                    {doc.professionalCouncil}
                  </p>
                </div>

                {/* Action Bar */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleShareWithNursing(doc)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF0F2] hover:bg-[#F5DADF] text-[#5D1425] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#8D253D]" />
                    <span>Enviar ao Chat</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDoc(doc);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#E6D4AF]" />
                      <span>Visualizar</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Clinical Disclaimer Banner */}
      <EducationalClinicalBanner variant="patient" />

      {/* Document Viewer Modal */}
      {activeDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-[#E6D4AF] shadow-2xl">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#5D1425] to-[#480D1B] text-white flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#E6D4AF] font-semibold">
                  {activeDoc.categoryLabel} · Emitido em {activeDoc.date}
                </p>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-white mt-1">
                  {activeDoc.title}
                </h3>
                <p className="text-xs text-[#E6D4AF]/90 mt-1">
                  {activeDoc.professional} ({activeDoc.professionalCouncil})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                aria-label="Fechar visualização"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-stone-800">
              <div className="p-4 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#480D1B] block mb-1">
                  Resumo Clínico
                </span>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {activeDoc.summary}
                </p>
              </div>

              {activeDoc.details.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#480D1B]">
                    Detalhamento / Prescrição / Parâmetros
                  </h4>
                  <ul className="space-y-2">
                    {activeDoc.details.map((item, idx) => (
                      <li
                        key={idx}
                        className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm text-stone-800 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#8D253D] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeDoc.recommendations && (
                <div className="p-4 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5D1425] block mb-1">
                    Recomendações da Equipe Vittacare
                  </span>
                  <p className="text-xs text-[#480D1B] leading-relaxed">
                    {activeDoc.recommendations}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#8D253D]" />
                  <span>Imprimir / Salvar PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleShareWithNursing(activeDoc)}
                  className="px-4 py-2 rounded-xl bg-[#FAF0F2] border border-[#EBBEC8] hover:bg-[#F5DADF] text-[#5D1425] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#8D253D]" />
                  <span>Compartilhar no Chat</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                className="px-5 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New Document / Exam Result */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#E6D4AF] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#480D1B]">
                  Adicionar Documento ou Resultado
                </h3>
                <p className="text-xs text-stone-500">
                  Registre um exame, receita ou atestado para organizar seu histórico e enviar à enfermagem.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Categoria do Documento
                </label>
                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value as ClinicalDocumentCategory)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white focus:outline-none focus:border-[#5D1425]"
                >
                  <option value="resultados">Resultados & Laudos</option>
                  <option value="exames">Pedidos de Exames</option>
                  <option value="receitas">Receitas & Prescrições</option>
                  <option value="atestados">Atestados & Declarações</option>
                  <option value="documentos">Documentos Clínicos</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Título do Exame / Receita / Documento
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex.: Ultrassom Obstétrico / Hemograma Completo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#5D1425]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Profissional ou Laboratório Emissor
                </label>
                <input
                  type="text"
                  value={newProfessional}
                  onChange={(e) => setNewProfessional(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#5D1425]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Resumo Principal / Conclusão do Laudo
                </label>
                <textarea
                  rows={2}
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Descreva o resultado principal ou a orientação da receita..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#5D1425]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Itens / Valores de Referência (1 por linha, opcional)
                </label>
                <textarea
                  rows={3}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder={'Ex.: Hemoglobina: 12,5 g/dL\nGlicemia de jejum: 84 mg/dL'}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#5D1425]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold cursor-pointer"
                >
                  Salvar no Prontuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
