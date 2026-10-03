import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Activity, 
  Heart, 
  Syringe, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Check, 
  Printer, 
  Share2, 
  FileText, 
  Baby, 
  Clock, 
  User, 
  Stethoscope, 
  ChevronRight,
  Info
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { 
  INITIAL_VACCINES, 
  INITIAL_WEIGHT_RECORDS, 
  INITIAL_BP_RECORDS, 
  INITIAL_CONSULTATION_RECORDS,
  CLINIC_INFO 
} from '../data/mockData';
import { VaccineRecord, WeightRecord, BloodPressureRecord, PrenatalConsultationRecord } from '../types';

export const PrenatalCardView: React.FC = () => {
  const { patient } = usePatient();

  const [activeSection, setActiveSection] = useState<'overview' | 'weight' | 'bp' | 'vaccines' | 'consultations'>('overview');

  // Local states with LocalStorage persistence
  const [vaccines, setVaccines] = useState<VaccineRecord[]>(() => {
    try {
      const saved = localStorage.getItem('vittaconect_prenatal_vaccines_v1');
      return saved ? JSON.parse(saved) : INITIAL_VACCINES;
    } catch {
      return INITIAL_VACCINES;
    }
  });

  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() => {
    try {
      const saved = localStorage.getItem('vittaconect_prenatal_weight_v1');
      return saved ? JSON.parse(saved) : INITIAL_WEIGHT_RECORDS;
    } catch {
      return INITIAL_WEIGHT_RECORDS;
    }
  });

  const [bpRecords, setBpRecords] = useState<BloodPressureRecord[]>(() => {
    try {
      const saved = localStorage.getItem('vittaconect_prenatal_bp_v1');
      return saved ? JSON.parse(saved) : INITIAL_BP_RECORDS;
    } catch {
      return INITIAL_BP_RECORDS;
    }
  });

  const [consultations] = useState<PrenatalConsultationRecord[]>(INITIAL_CONSULTATION_RECORDS);

  useEffect(() => {
    localStorage.setItem('vittaconect_prenatal_vaccines_v1', JSON.stringify(vaccines));
  }, [vaccines]);

  useEffect(() => {
    localStorage.setItem('vittaconect_prenatal_weight_v1', JSON.stringify(weightRecords));
  }, [weightRecords]);

  useEffect(() => {
    localStorage.setItem('vittaconect_prenatal_bp_v1', JSON.stringify(bpRecords));
  }, [bpRecords]);

  // Modal states for new records
  const [isAddWeightOpen, setIsAddWeightOpen] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newWeightWeek, setNewWeightWeek] = useState(patient?.currentWeek || 18);
  const [newWeightNotes, setNewWeightNotes] = useState('');

  const [isAddBPOpen, setIsAddBPOpen] = useState(false);
  const [newSys, setNewSys] = useState('110');
  const [newDia, setNewDia] = useState('70');
  const [newPulse, setNewPulse] = useState('75');
  const [newBPNotes, setNewBPNotes] = useState('');

  // Handle weight registration
  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(newWeight);
    if (!w || isNaN(w)) return;

    const initialW = weightRecords[0]?.weightKg || 62;
    const heightM = 1.65;
    const bmi = parseFloat((w / (heightM * heightM)).toFixed(1));

    const rec: WeightRecord = {
      id: `w-${Date.now()}`,
      week: Number(newWeightWeek),
      date: new Date().toISOString().split('T')[0],
      weightKg: w,
      bmi,
      notes: newWeightNotes.trim() || undefined,
    };

    setWeightRecords((prev) => [...prev, rec].sort((a, b) => a.week - b.week));
    setNewWeight('');
    setNewWeightNotes('');
    setIsAddWeightOpen(false);
  };

  // Handle BP registration
  const handleAddBP = (e: React.FormEvent) => {
    e.preventDefault();
    const sys = parseInt(newSys, 10);
    const dia = parseInt(newDia, 10);
    if (!sys || !dia) return;

    let status: 'normal' | 'attention' | 'alert' = 'normal';
    if (sys >= 140 || dia >= 90) {
      status = 'alert';
    } else if (sys >= 120 || dia >= 80) {
      status = 'attention';
    }

    const rec: BloodPressureRecord = {
      id: `bp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      systolic: sys,
      diastolic: dia,
      pulse: parseInt(newPulse, 10) || undefined,
      status,
      notes: newBPNotes.trim() || undefined,
    };

    setBpRecords((prev) => [rec, ...prev]);
    setIsAddBPOpen(false);
    setNewBPNotes('');
  };

  // Toggle vaccine completion
  const handleToggleVaccine = (id: string) => {
    setVaccines((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const nextStatus = v.status === 'completed' ? 'pending' : 'completed';
          return {
            ...v,
            status: nextStatus,
            dateApplied: nextStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return v;
      })
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const latestBP = bpRecords[0] || { systolic: 110, diastolic: 70, status: 'normal' };
  const latestWeight = weightRecords[weightRecords.length - 1] || { weightKg: 65, week: 18 };
  const initialWeight = weightRecords[0]?.weightKg || 62.0;
  const totalWeightGain = (latestWeight.weightKg - initialWeight).toFixed(1);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F2] border border-[#EBBEC8] text-[#8D253D] text-xs font-semibold uppercase tracking-wider mb-2">
            <CreditCard className="w-3.5 h-3.5 text-[#B89243]" />
            <span>Documento Médico Oficial • Ministério da Saúde & Febrasgo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
            Carteira de Pré-Natal Digital
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Espelho digitalizado do seu cartão físico de gestante com vacinas, curvas de peso e gráficos de pressão.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-[#E6D4AF] hover:bg-[#FAF6ED] text-[#480D1B] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Imprimir ou Salvar PDF para o hospital"
          >
            <Printer className="w-4 h-4 text-[#B89243]" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Maternal Digital Identity Card (Passaporte de Saúde Materna) */}
      <div className="bg-gradient-to-br from-[#480D1B] via-[#5D1425] to-[#741C30] rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-[#DEC68E]/40">
        {/* Subtle Decorative Golden Rings */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border-8 border-white/5 pointer-events-none" />
        <div className="absolute right-12 bottom-[-60px] w-48 h-48 rounded-full border-4 border-[#DEC68E]/10 pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Card Top Strip */}
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Baby className="w-5 h-5 text-[#E6D4AF]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E6D4AF] block">
                  CLÍNICA VITTACARE • OBSTETRÍCIA
                </span>
                <span className="font-serif font-semibold text-sm sm:text-base text-white">
                  Cartão Nacional da Gestante Digital
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-[#E6D4AF]/20 border border-[#E6D4AF]/40 text-[#FAF6ED] text-xs font-bold font-mono">
                {patient?.bloodType || 'O+'} (Fator Rh +)
              </span>
            </div>
          </div>

          {/* Mother & Baby Main Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[11px] text-stone-300 block">Nome da Gestante</span>
              <strong className="text-sm sm:text-base font-serif text-white block truncate">
                {patient?.name || 'Mãezinha'}
              </strong>
              <span className="text-[10px] text-[#E6D4AF]">
                {patient?.age || 28} anos • {patient?.isFirstPregnancy ? 'Primigesta (1ª vez)' : 'Multípara'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-stone-300 block">Bebê a Caminho</span>
              <strong className="text-sm sm:text-base font-serif text-[#FAF6ED] block">
                {patient?.babyNickname || 'Bebê'}
              </strong>
              <span className="text-[10px] text-[#E6D4AF]">
                {patient?.babyGender === 'boy' ? 'Menino' : patient?.babyGender === 'girl' ? 'Menina' : 'Sexo Surpresa'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-stone-300 block">Idade Gestacional</span>
              <strong className="text-sm sm:text-base font-serif text-white block">
                {patient?.currentWeek || 18} Semanas
              </strong>
              <span className="text-[10px] text-[#E6D4AF]">
                {patient?.currentWeek && patient.currentWeek <= 13 ? '1º Trimestre' : patient?.currentWeek && patient.currentWeek <= 26 ? '2º Trimestre' : '3º Trimestre'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-stone-300 block">Previsão do Parto (DPP)</span>
              <strong className="text-sm sm:text-base font-serif text-[#FAF6ED] block truncate">
                {patient?.dueDate || 'A definir'}
              </strong>
              <span className="text-[10px] text-stone-300">Cálculo pela DUM / Eco</span>
            </div>
          </div>

          {/* Quick Vital Indicators Strip */}
          <div className="pt-3 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <span className="text-[10px] text-stone-300 block">Última Pressão (PA)</span>
              <span className="font-bold text-sm text-white">
                {latestBP.systolic}x{latestBP.diastolic} mmHg
              </span>
              <span className="text-[10px] text-emerald-300 block">Normotensa</span>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <span className="text-[10px] text-stone-300 block">Peso Atual</span>
              <span className="font-bold text-sm text-white">
                {latestWeight.weightKg} kg
              </span>
              <span className="text-[10px] text-[#E6D4AF] block">
                +{totalWeightGain} kg na gestação
              </span>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <span className="text-[10px] text-stone-300 block">Médico Obstetra</span>
              <span className="font-bold text-sm text-white truncate block">
                {patient?.doctorName || 'Dr. Marcelo'}
              </span>
              <span className="text-[10px] text-stone-300 block truncate">
                {patient?.doctorCrm || 'CRM-SP 000.002'}
              </span>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <span className="text-[10px] text-stone-300 block">Vacinas do Pré-Natal</span>
              <span className="font-bold text-sm text-white">
                {vaccines.filter((v) => v.status === 'completed').length} de {vaccines.length} Tomadas
              </span>
              <span className="text-[10px] text-[#E6D4AF] block">Em dia no cartão</span>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Subtabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E6D4AF]/50 no-scrollbar">
        <button
          onClick={() => setActiveSection('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeSection === 'overview'
              ? 'bg-[#5D1425] text-white shadow-sm'
              : 'text-stone-600 hover:text-[#5D1425] hover:bg-stone-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resumo do Cartão</span>
        </button>

        <button
          onClick={() => setActiveSection('weight')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeSection === 'weight'
              ? 'bg-[#5D1425] text-white shadow-sm'
              : 'text-stone-600 hover:text-[#5D1425] hover:bg-stone-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Curva de Peso</span>
        </button>

        <button
          onClick={() => setActiveSection('bp')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeSection === 'bp'
              ? 'bg-[#5D1425] text-white shadow-sm'
              : 'text-stone-600 hover:text-[#5D1425] hover:bg-stone-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Gráfico de Pressão (PA)</span>
        </button>

        <button
          onClick={() => setActiveSection('vaccines')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeSection === 'vaccines'
              ? 'bg-[#5D1425] text-white shadow-sm'
              : 'text-stone-600 hover:text-[#5D1425] hover:bg-stone-100'
          }`}
        >
          <Syringe className="w-4 h-4" />
          <span>Vacinas da Gestante</span>
        </button>

        <button
          onClick={() => setActiveSection('consultations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeSection === 'consultations'
              ? 'bg-[#5D1425] text-white shadow-sm'
              : 'text-stone-600 hover:text-[#5D1425] hover:bg-stone-100'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Consultas & Altura Uterina</span>
        </button>
      </div>

      {/* SECTION: OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Maternal Clinical Background */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E6D4AF] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-[#480D1B] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#8D253D]" />
                  <span>Identificação & Fatores Obstétricos</span>
                </h3>
                <span className="text-[11px] font-bold text-[#8D253D] bg-[#FAF0F2] px-2.5 py-0.5 rounded-full border border-[#EBBEC8]">
                  Sem Risco Habitual
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-500 block">Tipo Sanguíneo / Rh</span>
                  <strong className="text-stone-800 text-sm">{patient?.bloodType || 'O+'}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-500 block">Gestação Atual</span>
                  <strong className="text-stone-800 text-sm">G1 P0 A0 (1ª gravidez)</strong>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-500 block">Altura</span>
                  <strong className="text-stone-800 text-sm">1,65 m</strong>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-500 block">Peso Inicial / IMC</span>
                  <strong className="text-stone-800 text-sm">{initialWeight} kg (IMC 22.8)</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF] text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600 font-semibold">Contato de Apoio / Acompanhante:</span>
                  <strong className="text-[#480D1B]">{patient?.emergencyContact || 'Acompanhante da Família'}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600 font-semibold">Alergias Medicamentosas:</span>
                  <strong className="text-[#8D253D]">{patient?.allergies || 'Nenhuma alergia conhecida'}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600 font-semibold">Maternidade Indicada:</span>
                  <strong className="text-stone-800">Hospital e Maternidade São Luiz / Santa Joana</strong>
                </div>
              </div>
            </div>

            {/* Routine Exams Checklist */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E6D4AF] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-[#480D1B] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#336443]" />
                  <span>Exames Essenciais do Pré-Natal</span>
                </h3>
                <span className="text-[11px] font-bold text-[#336443] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Atualizados
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <div>
                    <strong className="text-stone-800 block">Hemograma Completo</strong>
                    <span className="text-stone-500 text-[11px]">Hb: 12.8 g/dL (Sem anemia)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">Normal</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <div>
                    <strong className="text-stone-800 block">Glicemia de Jejum (1º Tri)</strong>
                    <span className="text-stone-500 text-[11px]">84 mg/dL (Abaixo de 92 - Sem DMG)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">Normal</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <div>
                    <strong className="text-stone-800 block">Sorologias (HIV, VDRL, Toxoplasmose)</strong>
                    <span className="text-stone-500 text-[11px]">Todas não reagentes / IgG Toxo negativo</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">Não Reagente</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <div>
                    <strong className="text-stone-800 block">Ultrassom Morfológico 1º Trimestre</strong>
                    <span className="text-stone-500 text-[11px]">Translucência Nucal: 1.2 mm • Osso nasal presente</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">Baixo Risco</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: CURVA DE PESO */}
      {activeSection === 'weight' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E6D4AF] shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#480D1B] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#8D253D]" />
                  <span>Curva de Ganho de Peso Gestacional</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Baseado na faixa de recomendação do Ministério da Saúde & Febrasgo para peso pré-gestacional adequado.
                </p>
              </div>

              <button
                onClick={() => setIsAddWeightOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Nova Pesagem</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF]">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Peso Inicial</span>
                <span className="text-lg font-serif font-bold text-[#480D1B]">{initialWeight} kg</span>
                <span className="text-[10px] text-stone-500 block">Antes da gestação</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8]">
                <span className="text-[10px] uppercase font-bold text-[#8D253D] block">Peso Atual</span>
                <span className="text-lg font-serif font-bold text-[#8D253D]">{latestWeight.weightKg} kg</span>
                <span className="text-[10px] text-stone-500 block">Na {latestWeight.week}ª semana</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Ganho Total</span>
                <span className="text-lg font-serif font-bold text-emerald-800">+{totalWeightGain} kg</span>
                <span className="text-[10px] text-emerald-600 block">Faixa Ideal: 11 a 15 kg</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Meta Semanal (2º Tri)</span>
                <span className="text-lg font-serif font-bold text-stone-700">~400 g</span>
                <span className="text-[10px] text-stone-500 block">Ritmo saudável</span>
              </div>
            </div>

            {/* Interactive SVG Weight Curve Graph */}
            <div className="p-4 sm:p-6 bg-stone-50/70 rounded-2xl border border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-stone-700">Evolução de Peso (kg) x Semanas</span>
                <div className="flex items-center gap-4 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#8D253D]" /> Seus Registros
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-emerald-400" /> Faixa Recomendada Febrasgo
                  </span>
                </div>
              </div>

              {/* Responsive SVG Canvas */}
              <div className="w-full overflow-x-auto">
                <svg viewBox="0 0 600 240" className="w-full h-48 sm:h-60 select-none">
                  {/* Grid Lines */}
                  {[60, 64, 68, 72, 76].map((kg, i) => {
                    const y = 200 - ((kg - 58) / 20) * 170;
                    return (
                      <g key={kg}>
                        <line x1="45" y1={y} x2="580" y2={y} stroke="#e5e7eb" strokeDasharray="3 3" />
                        <text x="35" y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{kg}kg</text>
                      </g>
                    );
                  })}

                  {/* Weeks Axis */}
                  {[8, 12, 16, 20, 24, 28, 32, 36, 40].map((wk) => {
                    const x = 50 + ((wk - 8) / 32) * 520;
                    return (
                      <g key={wk}>
                        <line x1={x} y1="30" x2={x} y2="200" stroke="#f3f4f6" />
                        <text x={x} y="215" textAnchor="middle" fontSize="10" fill="#9ca3af">{wk}ª sem</text>
                      </g>
                    );
                  })}

                  {/* Febrasgo Recommended Green Zone (Shaded Area) */}
                  <polygon
                    points="
                      50,165 
                      115,160 
                      180,145 
                      245,125 
                      310,105 
                      375,85 
                      440,65 
                      505,48 
                      570,35
                      570,85 
                      505,100 
                      440,118 
                      375,135 
                      310,150 
                      245,165 
                      180,175 
                      115,180 
                      50,180
                    "
                    fill="#34d399"
                    opacity="0.15"
                  />

                  {/* Patient Line Connection */}
                  <polyline
                    fill="none"
                    stroke="#8D253D"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={weightRecords
                      .map((r) => {
                        const x = 50 + ((r.week - 8) / 32) * 520;
                        const y = 200 - ((r.weightKg - 58) / 20) * 170;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Patient Weight Points */}
                  {weightRecords.map((r) => {
                    const x = 50 + ((r.week - 8) / 32) * 520;
                    const y = 200 - ((r.weightKg - 58) / 20) * 170;
                    return (
                      <g key={r.id}>
                        <circle cx={x} cy={y} r="5" fill="#8D253D" stroke="#ffffff" strokeWidth="2" />
                        <text x={x} y={y - 9} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#5D1425">
                          {r.weightKg}kg
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="mt-3 flex items-center gap-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Excelente evolução:</strong> O ganho ponderal está exatamente dentro da faixa verde recomendada para o segundo trimestre.
                </span>
              </div>
            </div>

            {/* Weight Records Table */}
            <div>
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Histórico de Pesagens Registradas
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Semana</th>
                      <th className="py-2.5 px-4 font-semibold">Data</th>
                      <th className="py-2.5 px-4 font-semibold">Peso (kg)</th>
                      <th className="py-2.5 px-4 font-semibold">IMC</th>
                      <th className="py-2.5 px-4 font-semibold">Observações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {weightRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-stone-50/50">
                        <td className="py-2.5 px-4 font-bold text-[#8D253D]">{r.week}ª semana</td>
                        <td className="py-2.5 px-4 text-stone-600">{r.date}</td>
                        <td className="py-2.5 px-4 font-semibold text-stone-800">{r.weightKg} kg</td>
                        <td className="py-2.5 px-4 text-stone-600">{r.bmi}</td>
                        <td className="py-2.5 px-4 text-stone-500 italic">{r.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: PRESSÃO ARTERIAL (PA) */}
      {activeSection === 'bp' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E6D4AF] shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#480D1B] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#8D253D]" />
                  <span>Monitoramento e Gráfico de Pressão Arterial (PA)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Rastreio preventivo contínuo de pré-eclâmpsia e alterações hemodinâmicas.
                </p>
              </div>

              <button
                onClick={() => setIsAddBPOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Nova Medição</span>
              </button>
            </div>

            {/* Status Indicator Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-800">Normal (Alvo)</span>
                  <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">&lt; 120/80</span>
                </div>
                <p className="text-[11px] text-emerald-700">Pressão ideal sem riscos gestacionais.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-800">Atenção</span>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">120-139 / 80-89</span>
                </div>
                <p className="text-[11px] text-amber-700">Repetir medição após 20 minutos de repouso.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-rose-800">Alerta (Pré-eclâmpsia)</span>
                  <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">≥ 140/90</span>
                </div>
                <p className="text-[11px] text-rose-700">Acione imediatamente o plantão SOS 24h Vittacare.</p>
              </div>
            </div>

            {/* Interactive SVG BP Chart */}
            <div className="p-4 sm:p-6 bg-stone-50/70 rounded-2xl border border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-stone-700">Curva de Pressão Sistólica (Alta) e Diastólica (Baixa)</span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 font-semibold text-[#8D253D]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8D253D]" /> Sistólica (PAS)
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-[#B89243]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B89243]" /> Diastólica (PAD)
                  </span>
                </div>
              </div>

              {/* SVG Chart */}
              <div className="w-full overflow-x-auto">
                <svg viewBox="0 0 600 220" className="w-full h-48 select-none">
                  {/* Reference Lines */}
                  {[60, 80, 100, 120, 140].map((val) => {
                    const y = 180 - ((val - 50) / 100) * 140;
                    const isLimit = val === 140;
                    return (
                      <g key={val}>
                        <line 
                          x1="45" 
                          y1={y} 
                          x2="580" 
                          y2={y} 
                          stroke={isLimit ? '#fca5a5' : '#e5e7eb'} 
                          strokeWidth={isLimit ? '2' : '1'}
                          strokeDasharray={isLimit ? '4 4' : '2 2'} 
                        />
                        <text x="35" y={y + 4} textAnchor="end" fontSize="10" fill={isLimit ? '#dc2626' : '#9ca3af'}>
                          {val}
                        </text>
                        {isLimit && (
                          <text x="580" y={y - 4} textAnchor="end" fontSize="9" fontWeight="bold" fill="#dc2626">
                            Linha de Alerta (140)
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Sistólica Polyline */}
                  <polyline
                    fill="none"
                    stroke="#8D253D"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={bpRecords
                      .slice()
                      .reverse()
                      .map((r, i) => {
                        const x = 60 + i * (500 / Math.max(1, bpRecords.length - 1));
                        const y = 180 - ((r.systolic - 50) / 100) * 140;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Diastólica Polyline */}
                  <polyline
                    fill="none"
                    stroke="#B89243"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={bpRecords
                      .slice()
                      .reverse()
                      .map((r, i) => {
                        const x = 60 + i * (500 / Math.max(1, bpRecords.length - 1));
                        const y = 180 - ((r.diastolic - 50) / 100) * 140;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Points */}
                  {bpRecords
                    .slice()
                    .reverse()
                    .map((r, i) => {
                      const x = 60 + i * (500 / Math.max(1, bpRecords.length - 1));
                      const ySys = 180 - ((r.systolic - 50) / 100) * 140;
                      const yDia = 180 - ((r.diastolic - 50) / 100) * 140;
                      return (
                        <g key={r.id}>
                          <circle cx={x} cy={ySys} r="4.5" fill="#8D253D" stroke="#fff" strokeWidth="1.5" />
                          <text x={x} y={ySys - 7} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#8D253D">
                            {r.systolic}
                          </text>

                          <circle cx={x} cy={yDia} r="4" fill="#B89243" stroke="#fff" strokeWidth="1.5" />
                          <text x={x} y={yDia + 14} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#B89243">
                            {r.diastolic}
                          </text>

                          <text x={x} y="200" textAnchor="middle" fontSize="9" fill="#6b7280">
                            {r.date.slice(5)}
                          </text>
                        </g>
                      );
                    })}
                </svg>
              </div>
            </div>

            {/* BP Table */}
            <div>
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Últimas Medições Realizadas
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Data / Hora</th>
                      <th className="py-2.5 px-4 font-semibold">Pressão (PA)</th>
                      <th className="py-2.5 px-4 font-semibold">Pulso</th>
                      <th className="py-2.5 px-4 font-semibold">Status</th>
                      <th className="py-2.5 px-4 font-semibold">Anotações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {bpRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-stone-50/50">
                        <td className="py-2.5 px-4 text-stone-600">
                          {r.date} às {r.time}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-base text-[#480D1B]">
                          {r.systolic}x{r.diastolic} <span className="text-xs font-normal text-stone-500">mmHg</span>
                        </td>
                        <td className="py-2.5 px-4 text-stone-600">
                          {r.pulse ? `${r.pulse} bpm` : '-'}
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.status === 'normal'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.status === 'attention'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {r.status === 'normal' ? 'Normal' : r.status === 'attention' ? 'Atenção' : 'Alerta'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-stone-500 italic max-w-xs truncate">
                          {r.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: VACINAS */}
      {activeSection === 'vaccines' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E6D4AF] shadow-2xs space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-[#480D1B] flex items-center gap-2">
                  <Syringe className="w-5 h-5 text-[#8D253D]" />
                  <span>Histórico Vacinal da Gestante (PNI / Febrasgo)</span>
                </h3>
                <span className="text-xs font-bold text-[#8D253D] bg-[#FAF0F2] px-3 py-1 rounded-full border border-[#EBBEC8]">
                  {vaccines.filter((v) => v.status === 'completed').length} de {vaccines.length} Imunizações
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Todas as vacinas recomendadas protegem a mãe e conferem imunidade passiva intraútero para o bebê.
              </p>
            </div>

            {/* Vaccines List */}
            <div className="space-y-3">
              {vaccines.map((v) => {
                const isCompleted = v.status === 'completed';
                const isScheduled = v.status === 'scheduled';
                return (
                  <div
                    key={v.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : isScheduled
                        ? 'bg-amber-50/30 border-amber-200'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-base text-[#480D1B]">
                            {v.name}
                          </h4>
                          {v.isMandatory && (
                            <span className="text-[10px] font-bold text-[#8D253D] bg-[#FAF0F2] px-2 py-0.5 rounded-md border border-[#EBBEC8]">
                              Essencial
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 max-w-xl">
                          {v.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 pt-1">
                          <span>Época: <strong>{v.recommendedWeek}</strong></span>
                          <span>Dose: <strong>{v.dose}</strong></span>
                          {v.batchNumber && <span>Lote: <strong className="font-mono">{v.batchNumber}</strong></span>}
                          {v.dateApplied && <span className="text-emerald-700 font-semibold">Aplicada em: {v.dateApplied}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                        <button
                          onClick={() => handleToggleVaccine(v.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                              : isScheduled
                              ? 'bg-[#B89243] text-white hover:brightness-110'
                              : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isCompleted ? 'Tomada ✓' : isScheduled ? 'Agendada' : 'Marcar como Tomada'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: CONSULTAS & ALTURA UTERINA / BCF */}
      {activeSection === 'consultations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E6D4AF] shadow-2xs space-y-6">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#480D1B] flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#8D253D]" />
                <span>Registro das Consultas Pré-Natais</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Acompanhamento da Altura Uterina (AU), Batimentos Cardíacos Fetais (BCF) e evolução clínica.
              </p>
            </div>

            <div className="space-y-4">
              {consultations.map((c) => (
                <div key={c.id} className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-[#FAF0F2] text-[#8D253D] font-bold text-xs flex items-center justify-center border border-[#EBBEC8]">
                        {c.gestationalWeek}s
                      </span>
                      <div>
                        <strong className="text-stone-800 text-sm font-serif">{c.date}</strong>
                        <span className="text-stone-500 text-xs block">{c.doctorOrNurse}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 font-semibold text-stone-700">
                        PA: {c.bloodPressure}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 font-semibold text-stone-700">
                        Peso: {c.weightKg} kg
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-white border border-stone-100">
                      <span className="text-stone-500 text-[11px] block">Altura Uterina</span>
                      <strong className="text-stone-800">{c.uterineHeightCm ? `${c.uterineHeightCm} cm` : 'Pélvico'}</strong>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-stone-100">
                      <span className="text-stone-500 text-[11px] block">Batimentos (BCF)</span>
                      <strong className="text-[#8D253D] font-bold">{c.fetalHeartRateBpm} bpm</strong>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-stone-100">
                      <span className="text-stone-500 text-[11px] block">Movimentos Fetais</span>
                      <strong className="text-stone-800">{c.fetalMovement ? 'Presentes (+)' : 'Iniciais'}</strong>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-stone-100">
                      <span className="text-stone-500 text-[11px] block">Edema</span>
                      <strong className="text-stone-800">{c.edema}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-100 italic">
                    "{c.clinicalNotes}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD WEIGHT */}
      {isAddWeightOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E6D4AF] shadow-2xl relative">
            <h3 className="font-serif font-bold text-xl text-[#480D1B] mb-1">
              Registrar Nova Pesagem
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Acompanhe sua curva com pesagens em jejum ou na consulta médica.
            </p>

            <form onSubmit={handleAddWeight} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    Semana Gestacional
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={42}
                    value={newWeightWeek}
                    onChange={(e) => setNewWeightWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    Peso em kg (Ex: 65.4) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="65.4"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Observações (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pós-consulta do 2º trimestre"
                  value={newWeightNotes}
                  onChange={(e) => setNewWeightNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddWeightOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Salvar Pesagem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD BP */}
      {isAddBPOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E6D4AF] shadow-2xl relative">
            <h3 className="font-serif font-bold text-xl text-[#480D1B] mb-1">
              Registrar Pressão Arterial (PA)
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Informe a pressão máxima (Sistólica) e mínima (Diastólica).
            </p>

            <form onSubmit={handleAddBP} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    Sistólica (Máx)
                  </label>
                  <input
                    type="number"
                    min={70}
                    max={220}
                    required
                    value={newSys}
                    onChange={(e) => setNewSys(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    Diastólica (Mín)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={140}
                    required
                    value={newDia}
                    onChange={(e) => setNewDia(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    Pulso (bpm)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={160}
                    value={newPulse}
                    onChange={(e) => setNewPulse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Contexto da Aferição
                </label>
                <input
                  type="text"
                  placeholder="Ex: Em repouso no braço esquerdo"
                  value={newBPNotes}
                  onChange={(e) => setNewBPNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddBPOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Salvar Pressão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
