import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Eye, 
  Heart, 
  FileText, 
  Printer, 
  Sparkles, 
  Info, 
  ChevronRight,
  Syringe,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { INITIAL_PREVENTIVE_EXAMS, CLINIC_INFO } from '../data/mockData';
import { PreventiveExam } from '../types';
import { usePatient } from '../context/PatientContext';

export const PreventiveScreeningView: React.FC = () => {
  const { patient } = usePatient();

  const [exams, setExams] = useState<PreventiveExam[]>(() => {
    try {
      const saved = localStorage.getItem('vittaconect_preventive_exams_v1');
      return saved ? JSON.parse(saved) : INITIAL_PREVENTIVE_EXAMS;
    } catch {
      return INITIAL_PREVENTIVE_EXAMS;
    }
  });

  useEffect(() => {
    localStorage.setItem('vittaconect_preventive_exams_v1', JSON.stringify(exams));
  }, [exams]);

  const [activeTab, setActiveTab] = useState<'carteira' | 'autoexame' | 'hpv'>('carteira');
  const [selectedExamForModal, setSelectedExamForModal] = useState<PreventiveExam | null>(null);

  // Edit / Update exam form state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string>('');
  const [newLastDate, setNewLastDate] = useState<string>('');
  const [newNextDate, setNewNextDate] = useState<string>('');
  const [newResult, setNewResult] = useState<string>('');
  const [newStatus, setNewStatus] = useState<'em_dia' | 'proximo_vencer' | 'atrasado' | 'agendado'>('em_dia');

  const handleOpenUpdate = (exam: PreventiveExam) => {
    setEditingExamId(exam.id);
    setNewLastDate(exam.lastDate || new Date().toISOString().split('T')[0]);
    setNewNextDate(exam.nextDueDate);
    setNewResult(exam.lastResult || '');
    setNewStatus(exam.status);
    setIsUpdateModalOpen(true);
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setExams((prev) =>
      prev.map((item) => {
        if (item.id === editingExamId) {
          return {
            ...item,
            lastDate: newLastDate,
            nextDueDate: newNextDate,
            lastResult: newResult.trim() || item.lastResult,
            status: newStatus,
          };
        }
        return item;
      })
    );
    setIsUpdateModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F2] border border-[#EBBEC8] text-[#8D253D] text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B89243]" />
            <span>Medicina Preventiva & Diagnóstico • Clínica Vittacare</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
            Carteira de Rastreio Preventivo & Exames
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Painel de controle para acompanhamento de Papanicolau, Mamografia, exames laboratoriais hormonais e guia de autoexame.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-[#E6D4AF] hover:bg-[#FAF6ED] text-[#480D1B] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#B89243]" />
            <span>Imprimir Histórico</span>
          </button>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E6D4AF]/50 no-scrollbar">
        <button
          onClick={() => setActiveTab('carteira')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'carteira'
              ? 'bg-[#5D1425] text-white shadow-xs'
              : 'text-stone-600 hover:text-[#5D1425] hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Carteira de Exames Preventivos</span>
        </button>

        <button
          onClick={() => setActiveTab('autoexame')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'autoexame'
              ? 'bg-[#5D1425] text-white shadow-xs'
              : 'text-stone-600 hover:text-[#5D1425] hover:bg-stone-100'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Guia do Autoexame das Mamas</span>
        </button>

        <button
          onClick={() => setActiveTab('hpv')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'hpv'
              ? 'bg-[#5D1425] text-white shadow-xs'
              : 'text-stone-600 hover:text-[#5D1425] hover:bg-stone-100'
          }`}
        >
          <Syringe className="w-4 h-4" />
          <span>Prevenção & Vacinação do HPV</span>
        </button>
      </div>

      {/* TAB 1: CARTEIRA DE EXAMES */}
      {activeTab === 'carteira' && (
        <div className="space-y-5">
          {/* Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E6D4AF]">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Total de Exames</span>
              <span className="text-xl font-serif font-bold text-[#480D1B]">{exams.length}</span>
              <span className="text-[10px] text-stone-500 block">No seu painel</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Exames em Dia</span>
              <span className="text-xl font-serif font-bold text-emerald-800">
                {exams.filter((e) => e.status === 'em_dia').length}
              </span>
              <span className="text-[10px] text-emerald-600 block">Prevenção ativa</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">A Vencer em Breve</span>
              <span className="text-xl font-serif font-bold text-amber-800">
                {exams.filter((e) => e.status === 'proximo_vencer').length}
              </span>
              <span className="text-[10px] text-amber-600 block">Agendar retorno</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] uppercase font-bold text-rose-800 block">Atrasados</span>
              <span className="text-xl font-serif font-bold text-rose-800">
                {exams.filter((e) => e.status === 'atrasado').length}
              </span>
              <span className="text-[10px] text-rose-600 block">Atenção preventiva</span>
            </div>
          </div>

          {/* Exams List */}
          <div className="space-y-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 hover:border-[#DEC68E] shadow-2xs space-y-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D253D] bg-[#FAF0F2] px-2.5 py-0.5 rounded-full border border-[#EBBEC8]">
                        {exam.categoryLabel}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          exam.status === 'em_dia'
                            ? 'bg-emerald-100 text-emerald-800'
                            : exam.status === 'proximo_vencer'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {exam.status === 'em_dia' ? '✓ Em Dia' : exam.status === 'proximo_vencer' ? 'Próximo a Vencer' : '⚠️ Atrasado'}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#480D1B]">
                      {exam.name}
                    </h3>

                    <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
                      {exam.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenUpdate(exam)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 hover:bg-[#FAF6ED] text-[#480D1B] text-xs font-semibold transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <span>Atualizar Registro</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Exam Dates & Result Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-stone-50/80 border border-stone-100 text-xs">
                  <div>
                    <span className="text-stone-500 text-[11px] block">Última Realização</span>
                    <strong className="text-stone-800">{exam.lastDate || 'Não registrado'}</strong>
                  </div>

                  <div>
                    <span className="text-stone-500 text-[11px] block">Próxima Coleta Sugerida</span>
                    <strong className="text-[#8D253D]">{exam.nextDueDate}</strong>
                  </div>

                  <div>
                    <span className="text-stone-500 text-[11px] block">Periodicidade Recomendada</span>
                    <strong className="text-stone-700">{exam.recommendedFrequency}</strong>
                  </div>
                </div>

                {/* Clinical Result & Importance Strip */}
                {exam.lastResult && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF6ED]/70 border border-[#E6D4AF] text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B7731] block">
                      Último Laudo / Resultado Cadastrado:
                    </span>
                    <p className="text-stone-800 font-medium">
                      "{exam.lastResult}"
                    </p>
                    {exam.laboratoryOrClinic && (
                      <span className="text-[10px] text-stone-500 block pt-0.5">
                        Local: {exam.laboratoryOrClinic}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: GUIA DO AUTOEXAME DAS MAMAS */}
      {activeTab === 'autoexame' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#FAF0F2] via-white to-[#FAF6ED] rounded-3xl p-6 sm:p-8 border border-[#EBBEC8] space-y-3">
            <span className="text-[10px] font-bold text-[#8D253D] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-[#EBBEC8] inline-block">
              Autocuidado & Prevenção Mamária
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#480D1B]">
              Guia Passo a Passo do Autoexame das Mamas
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
              O autoexame é um ato de carinho e autoconhecimento com seu corpo. Deve ser realizado mensalmente, preferencialmente entre o 7º e o 10º dia após o início da menstruação (quando as mamas estão menos doloridas e menos densas).
            </p>
          </div>

          {/* 5 Steps of Breast Self-Exam */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#E6D4AF] shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#5D1425] text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Em Frente ao Espelho (Braços ao Longo do Corpo)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Fique despida da cintura para cima e observe visualmente suas mamas: avalie o contorno, formato, simetria e textura da pele. É comum haver leve diferença de tamanho entre uma mama e outra.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E6D4AF] shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#5D1425] text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Braços Levantados Atrás da Cabeça
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Erga os braços para cima ou apoie as mãos na nuca. Observe se há alguma retração da pele, abaulamento anormal ou desvio no formato do bico do peito (mamilo).
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E6D4AF] shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#5D1425] text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Mãos Firmes na Cintura
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pressione as mãos contra os quadris inclinando o tronco levemente para a frente para contrair a musculatura peitoral. Qualquer alteração fixada na musculatura ficará mais evidente.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E6D4AF] shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#5D1425] text-white flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Palpação em Movimentos Circulares (No Banho ou Deitada)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Com o sabonete (que facilita o deslize) ou deitada com um travesseiro sob o ombro, use as polpas dos 3 dedos médios da mão esquerda para palpar a mama direita em movimentos circulares, do mamilo em direção às axilas. Depois repita no outro lado.
              </p>
            </div>
          </div>

          {/* Warning Signs Box */}
          <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 space-y-3 text-xs text-rose-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
              <strong className="text-sm font-serif">Sinais que Devem ser Avaliados pela Ginecologista:</strong>
            </div>
            <ul className="list-disc list-inside space-y-1 text-rose-800">
              <li>Nódulo ou caroço palpável firme e indolor na mama ou na axila;</li>
              <li>Pele com aspecto avermelhado, quente ou rugoso semelhante a casca de laranja;</li>
              <li>Saída espontânea de líquido claro ou sanguinolento pelo mamilo;</li>
              <li>Inversão ou retração súbita do mamilo.</li>
            </ul>
            <p className="text-[11px] text-rose-700 pt-1">
              *Lembre-se: O autoexame não substitui a mamografia digital periódica recomendada a partir dos 40 anos!
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: VACINAÇÃO HPV */}
      {activeTab === 'hpv' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#5D1425] via-[#741C30] to-[#480D1B] rounded-3xl p-6 sm:p-8 text-white space-y-3">
            <span className="text-[10px] font-bold text-[#E6D4AF] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block">
              Prevenção do Câncer de Colo Uterino
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              A Vacina do HPV é uma Blindagem para Toda a Vida
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 max-w-2xl leading-relaxed">
              O Papilomavírus Humano é responsável por mais de 98% dos casos de câncer de colo de útero. A vacina nonavalente protege contra 9 subtipos virais com altíssima taxa de eficácia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-[#8D253D] block">Idade de Aplicação</span>
              <p className="text-xs text-stone-600">
                Aprovada para mulheres até 45 anos na rede de vacinação privada da Clínica Vittacare, mesmo que já tenham iniciado a vida sexual ou tratado lesões anteriores.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-[#8D253D] block">Imunidade Cruzada</span>
              <p className="text-xs text-stone-600">
                Mesmo quem já teve contato com um tipo do vírus ganha proteção ativa contra os demais 8 subtipos oncogênicos mais perigosos presentes na vacina.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-[#8D253D] block">Disponibilidade Vittacare</span>
              <p className="text-xs text-stone-600">
                Doses da vacina HPV Nonavalente disponíveis na sala de imunizações da Clínica Vittacare com aplicação acolhedora e registro no seu aplicativo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE EXAM */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E6D4AF] shadow-2xl relative">
            <h3 className="font-serif font-bold text-xl text-[#480D1B] mb-1">
              Atualizar Exame Preventivo
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Informe a data da última coleta, resultado do laudo e próximo vencimento.
            </p>

            <form onSubmit={handleSaveUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    Data da Coleta
                  </label>
                  <input
                    type="date"
                    required
                    value={newLastDate}
                    onChange={(e) => setNewLastDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    Próximo Exame
                  </label>
                  <input
                    type="date"
                    required
                    value={newNextDate}
                    onChange={(e) => setNewNextDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Status Atual
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                >
                  <option value="em_dia">Em Dia (Realizado com Sucesso)</option>
                  <option value="proximo_vencer">Próximo a Vencer</option>
                  <option value="atrasado">Atrasado</option>
                  <option value="agendado">Já Agendado na Clínica</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Resultado / Laudo Médico
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Negativo para malignidade, BI-RADS 1, TSH normal..."
                  value={newResult}
                  onChange={(e) => setNewResult(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Salvar Exame
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
