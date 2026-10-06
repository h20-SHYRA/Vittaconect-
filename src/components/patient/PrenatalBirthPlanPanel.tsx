import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Heart,
  Sparkles,
  Printer,
  Send,
  Baby,
  CheckCircle2,
} from 'lucide-react';
import { BirthPlanPreferences } from '../../types';
import { usePatient } from '../../context/PatientContext';
import { useFeedback } from '../../context/FeedbackContext';
import { sendRealtimeChatMessage } from '../../services/realtimeChat';

const TRIMESTER_CHECKLISTS: Record<
  1 | 2 | 3,
  { id: string; label: string; defaultDone: boolean }[]
> = {
  1: [
    {
      id: 't1-1',
      label: 'Iniciar suplementação de Ácido Fólico / Metilfolato diariamente',
      defaultDone: true,
    },
    {
      id: 't1-2',
      label: 'Realizar exames laboratoriais de 1º trimestre (Tipagem, Sorologias, Urina)',
      defaultDone: true,
    },
    {
      id: 't1-3',
      label: 'Ultrassom Morfológico de 1º Trimestre (Translucência Nucal 11-14 sem)',
      defaultDone: true,
    },
    {
      id: 't1-4',
      label: 'Atualizar carteira de vacinação (Influenza, Hepatite B e Covid-19)',
      defaultDone: true,
    },
  ],
  2: [
    {
      id: 't2-1',
      label: 'Ultrassom Morfológico de 2º Trimestre com Doppler (20 a 24 semanas)',
      defaultDone: false,
    },
    {
      id: 't2-2',
      label: 'Curva Glicêmica (TOTG 75g) para rastreio de diabetes gestacional (24-28 sem)',
      defaultDone: false,
    },
    {
      id: 't2-3',
      label: 'Aplicar vacina dTpa (Tríplice Bacteriana Acelular) a partir da 20ª semana',
      defaultDone: false,
    },
    {
      id: 't2-4',
      label: 'Iniciar exercícios suaves de fortalecimento do assoalho pélvico',
      defaultDone: true,
    },
  ],
  3: [
    {
      id: 't3-1',
      label: 'Coleta de Pesquisa de Streptococcus agalactiae (Swab 35 a 37 semanas)',
      defaultDone: false,
    },
    {
      id: 't3-2',
      label: 'Imunização contra Vírus Sincicial Respiratório (VSR - 32 a 36 semanas)',
      defaultDone: false,
    },
    {
      id: 't3-3',
      label: 'Finalizar e revisar o Plano de Parto Humanizado com a equipe Vittacare',
      defaultDone: false,
    },
    {
      id: 't3-4',
      label: 'Organizar mala da maternidade e documentos do casal / acompanhante',
      defaultDone: false,
    },
  ],
};

export const PrenatalBirthPlanPanel: React.FC = () => {
  const { patient } = usePatient();
  const { showToast } = useFeedback();

  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(2);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('vittaconect_trimester_checklist_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      't1-1': true,
      't1-2': true,
      't1-3': true,
      't1-4': true,
      't2-4': true,
    };
  });

  const [birthPlan, setBirthPlan] = useState<BirthPlanPreferences>(() => {
    try {
      const saved = localStorage.getItem('vittaconect_birth_plan_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      preferredBirthType: 'normal_humanizado',
      companionName: patient?.emergencyContact || 'Lucas Santos (Esposo)',
      painReliefMethods: [
        'Banho morno de aspersão (chuveiro)',
        'Bola suíça e liberdade de movimentação',
        'Massagem lombar e respiração guiada',
      ],
      environmentPreferences: [
        'Penumbra / iluminação suave',
        'Música instrumental acolhedora',
        'Equipe reduzida e silêncio respeitoso',
      ],
      goldenHourSkinToSkin: true,
      delayedCordClamping: true,
      breastfeedingFirstHour: true,
      specialNotes:
        'Desejo ser informada antes de qualquer procedimento e priorizar posições verticalizadas.',
      updatedAt: new Date().toISOString(),
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        'vittaconect_trimester_checklist_v2',
        JSON.stringify(completedItems)
      );
    } catch {}
  }, [completedItems]);

  useEffect(() => {
    try {
      localStorage.setItem('vittaconect_birth_plan_v2', JSON.stringify(birthPlan));
    } catch {}
  }, [birthPlan]);

  const toggleChecklist = (id: string) => {
    setCompletedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleArrayPref = (
    field: 'painReliefMethods' | 'environmentPreferences',
    val: string
  ) => {
    setBirthPlan((prev) => {
      const exists = prev[field].includes(val);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((item) => item !== val)
          : [...prev[field], val],
      };
    });
  };

  const handleShareBirthPlanWithTeam = async () => {
    await sendRealtimeChatMessage({
      channelId: 'prof-marcelo',
      senderRole: 'paciente',
      senderId: patient?.id || 'paciente-ativa',
      senderName: patient?.name || 'Paciente',
      recipientId: 'prof-marcelo',
      recipientName: 'Equipe de Enfermagem Vittacare',
      patientName: patient?.name || 'Paciente',
      text: `🌸 [Plano de Parto Atualizado • ${patient?.name || 'Paciente'}]\nVia de preferência: ${birthPlan.preferredBirthType}\nAcompanhante: ${birthPlan.companionName}\nAlívio da dor: ${birthPlan.painReliefMethods.join(', ')}\nGolden Hour pele a pele: ${birthPlan.goldenHourSkinToSkin ? 'Sim' : 'Não'} | Clampeamento oportuno: ${birthPlan.delayedCordClamping ? 'Sim' : 'Não'}\nObservações: ${birthPlan.specialNotes}`,
      category: 'orientacao',
    });

    showToast({
      title: 'Plano de Parto Compartilhado',
      description:
        'Suas preferências de parto foram salvas e enviadas para a equipe de enfermagem obstétrica.',
      tone: 'success',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
      {/* Left 5 cols: Checklist por Trimestre */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-[#E6D4AF] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FAF0F2] text-[#8D253D]">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#480D1B]">
                Checklist por Trimestre
              </h3>
              <p className="text-xs text-stone-500">
                Marcos clínicos essenciais da sua gestação
              </p>
            </div>
          </div>
        </div>

        {/* Trimester Switcher */}
        <div className="grid grid-cols-3 gap-1.5 bg-[#FAF6ED] p-1 rounded-2xl border border-[#E6D4AF]">
          {([1, 2, 3] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTrimester(t)}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTrimester === t
                  ? 'bg-[#5D1425] text-[#E6D4AF] shadow-xs'
                  : 'text-[#480D1B] hover:bg-white/70'
              }`}
            >
              {t}º Trimestre
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {TRIMESTER_CHECKLISTS[selectedTrimester].map((item) => {
            const done = Boolean(completedItems[item.id]);
            return (
              <label
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`flex items-start gap-2.5 p-3 rounded-2xl border text-xs transition-all cursor-pointer ${
                  done
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-[#FDFBF7] border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => {}}
                  className="mt-0.5 rounded accent-[#5D1425]"
                />
                <span className={done ? 'line-through opacity-80' : 'font-medium'}>
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Right 7 cols: Plano de Parto Humanizado */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-[#E6D4AF] shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FAF6ED] text-[#B89243] border border-[#E6D4AF]">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#480D1B]">
                Meu Plano de Parto Humanizado
              </h3>
              <p className="text-xs text-stone-500">
                Preferências de nascimento para alinhamento com a equipe Vittacare
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-[#FAF6ED] hover:bg-[#F3EBD8] text-[#480D1B] border border-[#E6D4AF] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              type="button"
              onClick={handleShareBirthPlanWithTeam}
              className="px-3.5 py-1.5 rounded-xl bg-[#5D1425] hover:bg-[#480D1B] text-[#E6D4AF] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar à Enfermagem</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-[#480D1B] block mb-1">
              Modalidade de Parto Desejada
            </label>
            <select
              value={birthPlan.preferredBirthType}
              onChange={(e) =>
                setBirthPlan((prev) => ({
                  ...prev,
                  preferredBirthType: e.target.value as any,
                }))
              }
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-[#FDFBF7]"
            >
              <option value="normal_humanizado">
                Parto Normal Humanizado com Respeito Fisiológico
              </option>
              <option value="cesarea_agendada">
                Cesárea Humanizada com Golden Hour
              </option>
              <option value="sem_preferencia">
                Em construção / Avaliar com a equipe
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#480D1B] block mb-1">
              Acompanhante Escolhido (Lei 11.108)
            </label>
            <input
              type="text"
              value={birthPlan.companionName}
              onChange={(e) =>
                setBirthPlan((prev) => ({
                  ...prev,
                  companionName: e.target.value,
                }))
              }
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-[#FDFBF7]"
            />
          </div>
        </div>

        {/* Non-pharmacological pain relief */}
        <div>
          <span className="text-xs font-bold text-[#480D1B] block mb-1.5">
            Métodos de Alívio da Dor & Conforto Desejados:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Banho morno de aspersão (chuveiro)',
              'Bola suíça e liberdade de movimentação',
              'Massagem lombar e respiração guiada',
              'Aromaterapia suave',
              'Analgesia peridural se solicitada',
            ].map((method) => {
              const active = birthPlan.painReliefMethods.includes(method);
              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => toggleArrayPref('painReliefMethods', method)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                    active
                      ? 'bg-[#FAF0F2] border-[#8D253D] text-[#5D1425]'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {method}
                </button>
              );
            })}
          </div>
        </div>

        {/* Golden Hour & Neonatal Care */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            {
              key: 'goldenHourSkinToSkin' as const,
              label: 'Contato pele a pele imediato (Golden Hour)',
            },
            {
              key: 'delayedCordClamping' as const,
              label: 'Clampeamento oportuno do cordão (após parar de pulsar)',
            },
            {
              key: 'breastfeedingFirstHour' as const,
              label: 'Estímulo à amamentação na 1ª hora de vida',
            },
          ].map((item) => (
            <label
              key={item.key}
              className="p-2.5 rounded-xl bg-[#FAF6ED] border border-[#E6D4AF] flex items-start gap-2 text-[11px] font-semibold text-[#480D1B] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={birthPlan[item.key]}
                onChange={(e) =>
                  setBirthPlan((prev) => ({
                    ...prev,
                    [item.key]: e.target.checked,
                  }))
                }
                className="mt-0.5 rounded accent-[#5D1425]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
