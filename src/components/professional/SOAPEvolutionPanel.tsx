import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Printer,
  Send,
  ShieldCheck,
  Stethoscope,
  Clock,
  Lock,
  ClipboardCheck,
  Activity,
  AlertTriangle,
  Pill,
  FolderOpen,
} from 'lucide-react';
import { SOAPEvolutionEntry } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../context/FeedbackContext';
import { sendRealtimeChatMessage } from '../../services/realtimeChat';
import { logSensitiveOperation } from '../../services/security/authGateway';

interface ExtendedSOAPEntry extends SOAPEvolutionEntry {
  recordStatus?: 'rascunho' | 'finalizado';
}

const INITIAL_SOAP_RECORDS: ExtendedSOAPEntry[] = [
  {
    id: 'soap-1',
    patientId: 'pat-mariana',
    patientName: 'Mariana Silva Santos (18ª Sem • G1P0)',
    createdAt: 'Hoje, 09:20',
    authorName: 'Enf. Marcelo',
    authorCouncil: 'COREN-SP 000.002 (Homologado)',
    subjective:
      'Gestante comparece para acompanhamento de 18ª semana. Relata movimentos fetais percebidos diariamente após as refeições, nega perdas vaginais, nega escotomas ou epigastralgia. Refere leve azia noturna.',
    objective:
      'BEG, corada, hidratada, afebril. PA: 110/70 mmHg (sentada em repouso). Peso: 65,0 kg (+900g em 15 dias). AU: 17 cm. BCF: 148 bpm rítmico em QIE. Edema: ausente (-/-).',
    assessment:
      'Gestação tópica de 18 semanas evoluindo dentro dos parâmetros fisiológicos (Risco Habitual). Refluxo gastroesofágico gestacional leve.',
    plan: '1. Manter Sulfato Ferroso 40mg 30min antes do almoço com cítrico.\n2. Orientado fracionamento alimentar e elevação da cabeceira à noite.\n3. Solicitar USG Morfológico de 2º Trimestre (entre 20-24 sem).\n4. Retorno agendado em 3 semanas ou imediato se sinais de alarme.',
    riskClassification: 'habitual',
    recordStatus: 'finalizado',
  },
  {
    id: 'soap-2',
    patientId: 'pat-juliana',
    patientName: 'Juliana Mendes Rocha (31ª Sem • G2P1)',
    createdAt: 'Hoje, 08:40',
    authorName: 'Enfª. Letícia',
    authorCouncil: 'COREN-SP 000.001 (Homologado)',
    subjective:
      'Paciente em monitoramento pressórico do 3º trimestre. Relata cefaleia occipital leve ontem à noite após estresse no trabalho, remitida após repouso. Movimentação fetal ativa (>10 mov/2h).',
    objective:
      'PA em consultório após 15 min em DLE: 128/84 mmHg. BCF: 142 bpm. AU: 29 cm. Edema maleolar discreto (+/4+). Proteinúria de fita: negativa.',
    assessment:
      'Gestação de 31 semanas com necessidade de vigilância pressórica intensificada (Risco Intermediário). Sem critérios atuais para pré-eclâmpsia grave.',
    plan: '1. Mapa residencial de PA 2x/dia registrado no Vittaconect.\n2. Repouso relativo e redução de sódio.\n3. Exames laboratoriais de rotina hipertensiva solicitados.\n4. Teleorientação de reavaliação em 48h com Enfª. Stephanie.',
    riskClassification: 'intermediario',
    recordStatus: 'finalizado',
  },
];

const CLINICAL_SCALES_CATALOG = [
  {
    id: 'scale-epds',
    name: 'Escala de Edimburgo (EPDS)',
    purpose: 'Rastreio de depressão gestacional e pós-parto (puerpério)',
    questions: [
      '1. Tenho sido capaz de rir e achar graça das coisas?',
      '2. Tenho olhado para o futuro com alegria e expectativa?',
      '3. Tenho me culpado sem necessidade quando as coisas saem erradas?',
      '4. Tenho ficado ansiosa ou preocupada sem motivo aparente?',
      '5. Tenho tido dificuldade para dormir por tristeza ou tensão?',
    ],
    score: '4 / 30 pontos',
    interpretation: 'Baixo risco para transtorno depressivo perinatal (Escore < 10). Manter acolhimento.',
    date: '05/10/2026 às 09:15',
    professional: 'Enfª. Stephanie (COREN-SP 000.004)',
    tone: 'normal' as const,
  },
  {
    id: 'scale-meows',
    name: 'Escore de Alerta Obstétrico Precoce (MEOWS)',
    purpose: 'Detecção precoce de deterioração hemodinâmica, pré-eclâmpsia ou sepse materna',
    questions: [
      '1. Pressão Arterial Sistólica (90–139 mmHg = 0 pts)',
      '2. Pressão Arterial Diastólica (60–89 mmHg = 0 pts)',
      '3. Frequência Cardíaca Materna (60–100 bpm = 0 pts)',
      '4. Frequência Respiratória e Saturação O2 (≥ 96% = 0 pts)',
      '5. Temperatura Axilar e Nível de Consciência (Alerta = 0 pts)',
    ],
    score: '0 pontos (Verde)',
    interpretation: 'Estabilidade fisiológica materna preservada. Seguir rotina habitual.',
    date: '05/10/2026 às 09:20',
    professional: 'Enf. Marcelo (COREN-SP 000.002)',
    tone: 'normal' as const,
  },
  {
    id: 'scale-eva',
    name: 'Escala Visual Analógica de Dor & Conforto (EVA)',
    purpose: 'Mensuração objetiva de dor lombar, pélvica ou contrações uterinas',
    questions: [
      '1. Intensidade da dor em repouso (0 a 10)',
      '2. Intensidade da dor à deambulação (0 a 10)',
      '3. Resposta a medidas não farmacológicas (calor local, bola suíça, respiração)',
    ],
    score: '2 / 10 (Dor Leve)',
    interpretation: 'Desconforto lombar postural leve com boa resposta ao alongamento pélvico.',
    date: '04/10/2026 às 16:40',
    professional: 'Enfª. Letícia (COREN-SP 000.001)',
    tone: 'attention' as const,
  },
];

export const SOAPEvolutionPanel: React.FC = () => {
  const { professionalProfile, userRole } = useAuth();
  const { showToast } = useFeedback();

  // Sub-navigation for Prontuário Hierarchy (Sections 19, 20, 21)
  const [activeSubTab, setActiveSubTab] = useState<
    'resumo_prontuario' | 'evolucao_soap' | 'escalas_clinicas'
  >('evolucao_soap');

  // Inside 'resumo_prontuario', allow switching between the 8 structured areas (Section 19)
  const [recordSection, setRecordSection] = useState<
    | 'resumo'
    | 'historico'
    | 'alergias'
    | 'medicamentos'
    | 'exames'
    | 'consultas'
    | 'documentos'
  >('resumo');

  const [records, setRecords] = useState<ExtendedSOAPEntry[]>(INITIAL_SOAP_RECORDS);
  const [selectedPatient, setSelectedPatient] = useState(
    'Mariana Silva Santos (18ª Sem • G1P0)'
  );
  const [riskClassification, setRiskClassification] = useState<
    'habitual' | 'intermediario' | 'alto_risco'
  >('habitual');
  const [saveMode, setSaveMode] = useState<'finalizado' | 'rascunho'>('finalizado');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState(
    'PA: 110/70 mmHg | BCF: 146 bpm | AU: 18 cm | Peso: 65,0 kg | Edema: ausente'
  );
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');

  const handleSaveSOAP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjective.trim() || !assessment.trim() || !plan.trim()) {
      showToast({
        title: 'Campos obrigatórios do SOAP',
        description:
          'Preencha Subjetivo (S), Avaliação (A) e Plano de Cuidado (P) para registrar a evolução.',
        tone: 'warning',
      });
      return;
    }

    const newEntry: ExtendedSOAPEntry = {
      id: `soap-${Date.now()}`,
      patientId: selectedPatient.toLowerCase().includes('mariana')
        ? 'pat-mariana'
        : 'pat-juliana',
      patientName: selectedPatient,
      createdAt: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      authorName: professionalProfile?.displayName || 'Enf. Marcelo',
      authorCouncil:
        professionalProfile?.councilNumber || 'COREN-SP 000.002 (Homologado)',
      subjective: subjective.trim(),
      objective: objective.trim(),
      assessment: assessment.trim(),
      plan: plan.trim(),
      riskClassification,
      recordStatus: saveMode,
    };

    setRecords((prev) => [newEntry, ...prev]);
    setSubjective('');
    setAssessment('');
    setPlan('');

    await logSensitiveOperation({
      action: `evolucao_soap_${saveMode}_${newEntry.patientId}`,
      userRole: userRole || 'profissional',
      userEmail: professionalProfile?.email,
    });

    showToast({
      title:
        saveMode === 'finalizado'
          ? 'Evolução SOAP Finalizada e Bloqueada'
          : 'Rascunho de Evolução Salvo',
      description:
        saveMode === 'finalizado'
          ? `Registro assinado digitalmente e tornado imutável no prontuário de ${selectedPatient}.`
          : 'Você pode revisar e finalizar este rascunho antes de encerrar o plantão.',
      tone: 'success',
    });
  };

  const handleLockDraft = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, recordStatus: 'finalizado' } : r))
    );
    showToast({
      title: 'Registro Finalizado com Sucesso',
      description:
        'A evolução foi assinada e bloqueada contra alterações silenciosas (Conformidade COFEN).',
      tone: 'success',
    });
  };

  const handleSendPlanToPatient = async (entry: ExtendedSOAPEntry) => {
    await sendRealtimeChatMessage({
      channelId: 'prof-marcelo',
      senderRole: 'profissional',
      senderId: professionalProfile?.uid || 'prof-marcelo',
      senderName: entry.authorName,
      senderSpecialty: professionalProfile?.specialty,
      recipientId: entry.patientId,
      recipientName: entry.patientName,
      patientName: entry.patientName.split(' (')[0],
      text: `📋 [Plano de Cuidado Pós-Evolução • ${entry.authorName}]\nAvaliação: ${entry.assessment}\nConduta e Orientações:\n${entry.plan}`,
      category: 'orientacao',
      isPinned: true,
    });

    showToast({
      title: 'Plano Enviado para a Paciente',
      description: 'As orientações do Plano (P) foram fixadas no chat 1:1 da paciente.',
      tone: 'success',
    });
  };

  return (
    <section
      aria-label="Prontuário Estruturado, Evolução SOAP e Escalas"
      className="vitta-pearl-white-card rounded-3xl p-5 sm:p-6 space-y-6"
    >
      {/* Top Bar with Sub-Navigation (Sections 19, 20, 21) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-[#144272]/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl vitta-metallic-blue-badge text-white">
            <FileText className="w-5 h-5 text-[#93C5FD]" />
          </div>
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0A2647]">
              Prontuário Eletrônico, Evolução SOAP & Escalas
            </h3>
            <p className="text-xs text-[#144272] font-medium">
              Hierarquia clínica organizada com bloqueio de registros finalizados e rastreabilidade COFEN
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'resumo_prontuario' as const, label: '1. Prontuário por Seções' },
            { id: 'evolucao_soap' as const, label: '2. Evolução de Enfermagem (SOAP)' },
            { id: 'escalas_clinicas' as const, label: '3. Escalas Clínicas' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === tab.id
                  ? 'vitta-metallic-blue-badge text-white shadow-xs'
                  : 'bg-white text-[#0A2647] border-2 border-[#144272]/40 hover:bg-sky-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
          VIEW 1: PRONTUÁRIO ORGANIZADO EM SEÇÕES (Seção 19)
         ===================================================================== */}
      {activeSubTab === 'resumo_prontuario' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl vitta-pearl-blue-subbar border-2 border-[#144272]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#144272] block">
                Prontuário Individual Selecionado
              </span>
              <strong className="text-base font-serif text-[#0A2647]">
                {selectedPatient}
              </strong>
            </div>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="px-3 py-2 rounded-xl border-2 border-[#144272] bg-white text-xs font-bold text-[#0A2647]"
            >
              <option value="Mariana Silva Santos (18ª Sem • G1P0)">
                Mariana Silva Santos (18ª Sem • G1P0)
              </option>
              <option value="Juliana Mendes Rocha (31ª Sem • G2P1)">
                Juliana Mendes Rocha (31ª Sem • G2P1)
              </option>
              <option value="Camila Ferreira Lima (Saúde Feminina)">
                Camila Ferreira Lima (Saúde Feminina)
              </option>
            </select>
          </div>

          {/* 7 Section Pills so we never show all information at once */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(
              [
                { id: 'resumo', label: 'Resumo' },
                { id: 'historico', label: 'Histórico' },
                { id: 'alergias', label: 'Alergias' },
                { id: 'medicamentos', label: 'Medicamentos' },
                { id: 'exames', label: 'Exames' },
                { id: 'consultas', label: 'Consultas' },
                { id: 'documentos', label: 'Documentos' },
              ] as const
            ).map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setRecordSection(sec.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  recordSection === sec.id
                    ? 'bg-[#0A2647] text-white'
                    : 'bg-slate-100 text-[#0A2647] hover:bg-slate-200'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-[#144272]/30 text-xs space-y-3">
            {recordSection === 'resumo' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200">
                  <span className="text-[11px] font-bold text-[#144272] block">
                    Quadro Clínico Atual
                  </span>
                  <strong className="text-sm text-[#0A2647] block mt-0.5">
                    Gestação 18ª Semana • Risco Habitual
                  </strong>
                  <p className="text-slate-600 mt-1">
                    PA basal 110/70 mmHg, BCF 148 bpm, ganho ponderal adequado (+3,0 kg).
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
                  <span className="text-[11px] font-bold text-rose-800 block">
                    Alerta de Alergia Ativo
                  </span>
                  <strong className="text-sm text-rose-950 block mt-0.5">
                    Dipirona Sódica (Prurido Cutâneo)
                  </strong>
                  <p className="text-rose-800 mt-1">
                    Preferir Paracetamol se analgesia necessária sob prescrição.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 block">
                    Plano de Parto & Acompanhante
                  </span>
                  <strong className="text-sm text-emerald-950 block mt-0.5">
                    Lucas Santos (Esposo)
                  </strong>
                  <p className="text-emerald-800 mt-1">
                    Preferência por parto humanizado com liberdade de posição.
                  </p>
                </div>
              </div>
            )}

            {recordSection === 'historico' && (
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#0A2647]">
                  Antecedentes Obstétricos, Familiares e Pessoais
                </h4>
                <p className="text-slate-700">
                  • Primigesta (G1P0A0), sem cirurgias pélvicas prévias. Nega hipertensão crônica ou diabetes prévio.
                </p>
                <p className="text-slate-700">
                  • Histórico familiar: mãe com hipertensão arterial sistêmica após os 55 anos.
                </p>
              </div>
            )}

            {recordSection === 'alergias' && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <strong className="block text-sm">
                    Alergia Medicamentosa Confirmada: Dipirona
                  </strong>
                  <p className="mt-1">
                    Reação relatada: urticária leve e prurido em membros superiores. Nega alergia a látex ou contrastes iodados.
                  </p>
                </div>
              </div>
            )}

            {recordSection === 'medicamentos' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#0A2647]">
                  <Pill className="w-4 h-4 text-[#144272]" />
                  <span>Prescrições Ativas em Uso Contínuo</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>Metilfolato 400 mcg + DHA — 1 cápsula/dia após o almoço</li>
                  <li>Sulfato Ferroso / Ferro Quelato 40 mg — 1 cápsula 30 min antes do jantar</li>
                  <li>Vitamina D3 2.000 UI — 1 cápsula/dia pela manhã</li>
                </ul>
              </div>
            )}

            {recordSection === 'exames' && (
              <div className="space-y-2">
                <strong className="block text-sm text-[#0A2647]">
                  Últimos Exames Laboratoriais & Ultrassonográficos
                </strong>
                <p className="text-slate-700">
                  • 28/09/2026 — USG Morfológico 1º Trimestre: TN 1,4 mm, osso nasal presente, BCF 152 bpm.
                </p>
                <p className="text-slate-700">
                  • 15/09/2026 — Hemograma (Hb 12,6 g/dL), Glicemia de jejum 81 mg/dL, Sorologias (HIV, VDRL, HBsAg, Toxoplasmose IgM) não reagentes, Urocultura negativa.
                </p>
              </div>
            )}

            {recordSection === 'consultas' && (
              <div className="space-y-2">
                <strong className="block text-sm text-[#0A2647]">
                  Cronograma de Consultas Realizadas e Agendadas
                </strong>
                <p className="text-slate-700">
                  • 12/10/2026 às 09:30 — Consulta Pré-Natal de 2º Trimestre (Confirmada)
                </p>
                <p className="text-slate-700">
                  • 15/10/2026 às 16:00 — Teleorientação de Enfermagem com Enfª. Stephanie
                </p>
              </div>
            )}

            {recordSection === 'documentos' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FolderOpen className="w-5 h-5 text-[#144272]" />
                  <div>
                    <strong className="block text-sm text-[#0A2647]">
                      5 Documentos Homologados no Dossiê da Paciente
                    </strong>
                    <span className="text-slate-500">
                      Receitas assinadas, laudos de USG, plano de parto e termo LGPD.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl vitta-pearl-button font-bold cursor-pointer"
                >
                  Imprimir Dossiê
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 2: EVOLUÇÃO DE ENFERMAGEM SOAP (Seção 20 — Rascunho vs Finalizado)
         ===================================================================== */}
      {activeSubTab === 'evolucao_soap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Left: New SOAP Evolution Form (5 cols) */}
          <form
            onSubmit={handleSaveSOAP}
            className="lg:col-span-5 p-4 sm:p-5 rounded-2xl vitta-pearl-blue-subbar border-2 border-[#144272] space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0A2647] flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-[#144272]" />
                Nova Evolução de Enfermagem
              </span>
              <span className="text-[10px] font-bold text-[#144272]">
                {professionalProfile?.displayName || 'Enf. Marcelo'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-[#0A2647] block mb-1">
                  Paciente em Atendimento
                </label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#144272] bg-white text-xs font-semibold text-[#0A2647]"
                >
                  <option value="Mariana Silva Santos (18ª Sem • G1P0)">
                    Mariana Silva Santos (18ª Sem)
                  </option>
                  <option value="Juliana Mendes Rocha (31ª Sem • G2P1)">
                    Juliana Mendes Rocha (31ª Sem)
                  </option>
                  <option value="Camila Ferreira Lima (Saúde Feminina)">
                    Camila Ferreira Lima (Ginecologia)
                  </option>
                  <option value="Larissa Alencar (26ª Sem • TOTG)">
                    Larissa Alencar (26ª Sem)
                  </option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0A2647] block mb-1">
                  Estratificação de Risco
                </label>
                <select
                  value={riskClassification}
                  onChange={(e) => setRiskClassification(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#144272] bg-white text-xs font-semibold text-[#0A2647]"
                >
                  <option value="habitual">🟢 Risco Habitual</option>
                  <option value="intermediario">🟡 Risco Intermediário</option>
                  <option value="alto_risco">🔴 Alto Risco Obstétrico</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#0A2647] block mb-1">
                S — Subjetivo (Relato da paciente, queixas e sintomas) *
              </label>
              <textarea
                rows={2}
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                placeholder="Ex: Gestante refere boa movimentação fetal, nega perda de líquido ou cefaleia..."
                className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-xs text-[#0A2647]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#0A2647] block mb-1">
                O — Objetivo (Exame físico, PA, BCF, AU, peso e exames) *
              </label>
              <textarea
                rows={2}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-xs text-[#0A2647] font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#0A2647] block mb-1">
                A — Avaliação (Diagnóstico / Análise clínica de enfermagem) *
              </label>
              <textarea
                rows={2}
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="Ex: Evolução gestacional fisiológica compatível com a 18ª semana..."
                className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-xs text-[#0A2647]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#0A2647] block mb-1">
                P — Plano de Cuidado (Condutas, prescrições e orientações) *
              </label>
              <textarea
                rows={2}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="1. Manter suplementação...\n2. Solicitar exames...\n3. Agendar retorno..."
                className="w-full p-2.5 rounded-xl border-2 border-[#144272] bg-white text-xs text-[#0A2647]"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <label className="text-[11px] font-bold text-[#0A2647]">
                Modo de Gravação:
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSaveMode('rascunho')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                    saveMode === 'rascunho'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-[#0A2647] border border-[#144272]/40'
                  }`}
                >
                  Rascunho
                </button>
                <button
                  type="button"
                  onClick={() => setSaveMode('finalizado')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                    saveMode === 'finalizado'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white text-[#0A2647] border border-[#144272]/40'
                  }`}
                >
                  Finalizar & Bloquear
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl vitta-metallic-blue-badge text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>
                {saveMode === 'finalizado'
                  ? 'Assinar & Finalizar Evolução SOAP'
                  : 'Salvar Rascunho de Evolução'}
              </span>
            </button>
          </form>

          {/* Right: Chronological SOAP History (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
            {records.map((entry) => {
              const isLocked = entry.recordStatus !== 'rascunho';
              const riskLabel =
                entry.riskClassification === 'alto_risco'
                  ? '🔴 Alto Risco'
                  : entry.riskClassification === 'intermediario'
                  ? '🟡 Risco Intermediário'
                  : '🟢 Risco Habitual';

              return (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-white border-2 border-[#144272]/40 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#0A2647]">
                        {entry.patientName}
                      </h4>
                      <span className="text-[11px] text-[#144272] font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {entry.authorName} • {entry.authorCouncil}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="font-bold text-[#0A2647]">{riskLabel}</span>
                      <span>·</span>
                      {isLocked ? (
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Finalizado (Imutável)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleLockDraft(entry.id)}
                          className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold cursor-pointer"
                        >
                          Rascunho — Clique p/ Assinar
                        </button>
                      )}
                      <span>·</span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {entry.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <strong className="text-[#0A2647] block mb-0.5">
                        [S] Subjetivo:
                      </strong>
                      <p className="text-slate-700 leading-relaxed">{entry.subjective}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <strong className="text-[#0A2647] block mb-0.5">
                        [O] Objetivo:
                      </strong>
                      <p className="text-slate-700 font-mono text-[11px] leading-relaxed">
                        {entry.objective}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-200">
                      <strong className="text-[#0A2647] block mb-0.5">
                        [A] Avaliação Clínica:
                      </strong>
                      <p className="text-slate-800 leading-relaxed">{entry.assessment}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <strong className="text-emerald-950 block mb-0.5">
                        [P] Plano de Cuidado:
                      </strong>
                      <p className="text-emerald-900 whitespace-pre-wrap leading-relaxed">
                        {entry.plan}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[10px] text-slate-500">
                      {isLocked
                        ? 'Registro protegido contra edições silenciosas (Auditoria ativa)'
                        : 'Em edição pelo profissional responsável'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSendPlanToPatient(entry)}
                      className="px-3 py-1.5 rounded-xl vitta-metallic-blue-badge text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer hover:brightness-110"
                    >
                      <Send className="w-3 h-3" />
                      <span>Enviar Conduta ao Chat 1:1</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 3: ESCALAS CLÍNICAS PADRONIZADAS (Seção 21)
         ===================================================================== */}
      {activeSubTab === 'escalas_clinicas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
          {CLINICAL_SCALES_CATALOG.map((scale) => (
            <div
              key={scale.id}
              className="p-5 rounded-2xl bg-white border-2 border-[#144272]/40 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#144272] flex items-center gap-1">
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    Escala Validada
                  </span>
                  <span className="text-[11px] text-slate-500">{scale.date}</span>
                </div>

                <h4 className="font-serif font-bold text-base text-[#0A2647]">
                  {scale.name}
                </h4>

                <p className="text-xs text-[#144272] font-medium">
                  <strong>Finalidade:</strong> {scale.purpose}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11px] text-slate-700">
                  <strong className="block text-[#0A2647]">
                    Itens / Perguntas Avaliadas:
                  </strong>
                  {scale.questions.map((q, idx) => (
                    <span key={idx} className="block">
                      {q}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">Resultado Obtido:</span>
                  <strong className="text-sm font-serif text-[#0A2647]">
                    {scale.score}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-[#0A2647]">
                  <strong>Interpretação Clínica:</strong> {scale.interpretation}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Profissional: {scale.professional}</span>
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
