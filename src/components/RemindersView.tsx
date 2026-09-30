import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Stethoscope, 
  FileText, 
  Pill, 
  Apple, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Trash2, 
  Filter,
  UserCheck,
  Calendar,
  X,
  HeartHandshake,
  ShieldCheck,
  Info
} from 'lucide-react';
import { MedicalReminder, ReminderCategory } from '../types';
import { INITIAL_REMINDERS } from '../data/mockData';

const REMINDERS_STORAGE_KEY = 'vittaconect_medical_reminders_v1';

export const RemindersView: React.FC = () => {
  const [reminders, setReminders] = useState<MedicalReminder[]>(() => {
    try {
      const saved = localStorage.getItem(REMINDERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Erro ao carregar lembretes médicos', e);
    }
    return INITIAL_REMINDERS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State for new reminder
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ReminderCategory>('pos_consulta');
  const [formProfessionalName, setFormProfessionalName] = useState('Dr. Roberto Silva');
  const [formProfessionalRole, setFormProfessionalRole] = useState('Médico Obstetra e Ginecologista');
  const [formConsultationRef, setFormConsultationRef] = useState('Consulta Pré-Natal Recente');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formImportance, setFormImportance] = useState<'urgent' | 'important' | 'routine'>('important');
  const [formContent, setFormContent] = useState('');
  const [formMedicationSchedule, setFormMedicationSchedule] = useState('');
  const [formChecklistRaw, setFormChecklistRaw] = useState('');

  // Save to localStorage whenever reminders change
  useEffect(() => {
    try {
      localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
    } catch (e) {
      console.warn('Erro ao salvar lembretes', e);
    }
  }, [reminders]);

  // Toggle checklist item completion
  const handleToggleChecklist = (reminderId: string, itemId: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id !== reminderId) return r;
        const updatedChecklist = r.checklist?.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        return { ...r, checklist: updatedChecklist };
      })
    );
  };

  // Add new reminder
  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    // Parse checklist lines
    const checklistItems = formChecklistRaw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        text: line.replace(/^[-*•]\s*/, ''),
        completed: false,
      }));

    const categoryLabels: Record<ReminderCategory, string> = {
      pos_consulta: 'Pós-Consulta',
      preparo_exame: 'Preparo de Exame',
      medicacao: 'Medicação & Suplemento',
      sinais_alerta: 'Sinais de Alerta',
      geral: 'Estilo de Vida & Nutrição',
    };

    const newReminder: MedicalReminder = {
      id: `rem-custom-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      categoryLabel: categoryLabels[formCategory],
      professionalName: formProfessionalName.trim(),
      professionalRole: formProfessionalRole.trim(),
      date: formDate,
      consultationRef: formConsultationRef.trim() || 'Orientação da Equipe Vittacare',
      importance: formImportance,
      content: formContent.trim(),
      checklist: checklistItems.length > 0 ? checklistItems : undefined,
      medicationSchedule: formMedicationSchedule.trim() || undefined,
      isCustomUserCreated: true,
    };

    setReminders((prev) => [newReminder, ...prev]);

    // Reset Form
    setFormTitle('');
    setFormContent('');
    setFormChecklistRaw('');
    setFormMedicationSchedule('');
    setIsModalOpen(false);
  };

  // Delete custom reminder
  const handleDeleteReminder = (id: string) => {
    if (window.confirm('Deseja realmente remover esta orientação médica?')) {
      setReminders((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Copy Reminder to Clipboard / WhatsApp
  const handleCopyReminder = (reminder: MedicalReminder) => {
    const checklistText = reminder.checklist
      ? '\n\nTarefas:\n' + reminder.checklist.map((c) => (c.completed ? '✅ ' : '⬜ ') + c.text).join('\n')
      : '';
    const medText = reminder.medicationSchedule ? `\n⏰ Horário: ${reminder.medicationSchedule}` : '';

    const textToCopy = `📌 *Lembrete da Clínica Vittacare*\n*${reminder.title}*\n👨‍⚕️ ${reminder.professionalName} (${reminder.professionalRole})\n📅 Data: ${reminder.date.split('-').reverse().join('/')}\n\n*Orientações:*\n${reminder.content}${medText}${checklistText}\n\n_Acompanhe pelo app Vittaconect_`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(reminder.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Share directly via WhatsApp
  const handleShareWhatsApp = (reminder: MedicalReminder) => {
    const checklistText = reminder.checklist
      ? '\n\nTarefas:\n' + reminder.checklist.map((c) => (c.completed ? '✅ ' : '⬜ ') + c.text).join('\n')
      : '';
    const medText = reminder.medicationSchedule ? `\n⏰ Horário: ${reminder.medicationSchedule}` : '';

    const text = `📌 *Orientações da Consulta - Vittaconect*\n*${reminder.title}*\n👨‍⚕️ *Profissional:* ${reminder.professionalName}\n📅 *Data:* ${reminder.date.split('-').reverse().join('/')}\n\n${reminder.content}${medText}${checklistText}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Filter items
  const filteredReminders = reminders.filter((r) => {
    if (selectedCategory === 'all') return true;
    return r.category === selectedCategory;
  });

  // Calculate total tasks and completed tasks
  let totalTasks = 0;
  let completedTasks = 0;
  reminders.forEach((r) => {
    if (r.checklist) {
      totalTasks += r.checklist.length;
      completedTasks += r.checklist.filter((c) => c.completed).length;
    }
  });

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  const categories = [
    { id: 'all', label: 'Todos os Lembretes', icon: Filter },
    { id: 'pos_consulta', label: 'Pós-Consulta', icon: Stethoscope },
    { id: 'preparo_exame', label: 'Preparo de Exames', icon: FileText },
    { id: 'geral', label: 'Nutrição & Rotina', icon: Apple },
    { id: 'sinais_alerta', label: 'Sinais de Alerta', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner / Hero Zone */}
      <section className="bg-gradient-to-r from-[#5D1425] via-[#741C30] to-[#480D1B] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#B89243]/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-[#FAF0F2]/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#E6D4AF]">
              <Bell className="w-3.5 h-3.5 text-[#B89243]" />
              <span>Orientações & Lembretes das Consultas</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Recomendações da Sua Equipe Médica
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              Esqueceu o que o médico ou a enfermeira falaram na última consulta? Consulte aqui as instruções detalhadas, jejuns, remédios e cuidados passados especialmente para você e o bebê.
            </p>
          </div>

          {/* Quick Action Button & Task Progress Mini-Card */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#DEC68E] via-[#B89243] to-[#9B7731] text-[#2C0610] font-bold text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Anotar Nova Orientação</span>
            </button>

            {/* Checklist Completion Badge */}
            <div className="bg-black/25 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-xs w-full sm:w-auto text-center sm:text-left">
              <div className="flex items-center justify-between gap-3 text-[11px] mb-1">
                <span className="text-stone-300">Cuidados Cumpridos:</span>
                <span className="font-bold text-[#E6D4AF]">
                  {completedTasks} de {totalTasks} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#DEC68E] to-[#B89243] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter Tabs */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-[#5D1425] text-white border-[#5D1425] shadow-xs'
                  : 'bg-white hover:bg-[#FAF6ED] text-stone-600 border-[#E6D4AF]/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E6D4AF]' : 'text-stone-500'}`} />
              <span>{cat.label}</span>
              {cat.id === 'all' && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {reminders.length}
                </span>
              )}
            </button>
          );
        })}
      </section>

      {/* Reminders List */}
      <section className="space-y-4">
        {filteredReminders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#E6D4AF]/60 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF6ED] border border-[#DEC68E] text-[#B89243] flex items-center justify-center mx-auto">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#480D1B]">
              Nenhum lembrete nesta categoria
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Clique no botão "Anotar Nova Orientação" para registrar um recado da sua última consulta.
            </p>
          </div>
        ) : (
          filteredReminders.map((reminder) => {
            const isUrgent = reminder.importance === 'urgent';
            const isImportant = reminder.importance === 'important';

            return (
              <div
                key={reminder.id}
                className={`bg-white rounded-3xl p-5 sm:p-7 border transition-all shadow-xs space-y-4 relative ${
                  isUrgent
                    ? 'border-[#EBBEC8] bg-gradient-to-br from-white via-white to-[#FAF0F2]/40'
                    : 'border-[#E6D4AF]/80 hover:border-[#DEC68E]'
                }`}
              >
                {/* Header of Reminder Card */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Category Badge */}
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF6ED] text-[#8D253D] border border-[#E6D4AF]">
                        {reminder.categoryLabel}
                      </span>

                      {/* Urgency Badge */}
                      {isUrgent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Atenção Máxima
                        </span>
                      )}
                      {isImportant && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          Importante
                        </span>
                      )}

                      {reminder.consultationRef && (
                        <span className="text-[11px] text-stone-400">
                          • {reminder.consultationRef}
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif font-bold text-lg sm:text-xl text-[#480D1B]">
                      {reminder.title}
                    </h2>
                  </div>

                  {/* Professional Stamp */}
                  <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-[#FAF6ED]/70 border border-[#E6D4AF]/60 self-start shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#DEC68E] text-[#B89243] flex items-center justify-center font-bold text-xs shadow-2xs">
                      <Stethoscope className="w-4 h-4 text-[#8D253D]" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-xs font-bold text-[#480D1B] block">
                        {reminder.professionalName}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {reminder.professionalRole}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Content Body */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {reminder.content}
                </p>

                {/* Medication Schedule Strip if available */}
                {reminder.medicationSchedule && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF6ED] border border-[#DEC68E] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white text-[#B89243] flex items-center justify-center shrink-0 border border-[#E6D4AF]">
                      <Pill className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#9B7731] block">
                        Horário & Frequência de Uso
                      </span>
                      <span className="text-xs font-bold text-[#480D1B]">
                        {reminder.medicationSchedule}
                      </span>
                    </div>
                  </div>
                )}

                {/* Interactive Checklist */}
                {reminder.checklist && reminder.checklist.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500 block">
                      Passos recomendados pelo profissional:
                    </span>
                    <div className="space-y-1.5">
                      {reminder.checklist.map((item) => {
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleToggleChecklist(reminder.id, item.id)}
                            className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                              item.completed
                                ? 'bg-[#F2F7F3] border-[#DFEDE2] text-stone-500'
                                : 'bg-white hover:bg-[#FAF6ED]/40 border-stone-200 text-stone-800'
                            }`}
                          >
                            <span className="mt-0.5 shrink-0">
                              {item.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-[#3B744C] fill-[#DFEDE2]" />
                              ) : (
                                <Circle className="w-4 h-4 text-stone-400" />
                              )}
                            </span>
                            <span
                              className={`text-xs leading-normal ${
                                item.completed ? 'line-through text-stone-500' : 'font-medium'
                              }`}
                            >
                              {item.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Card Footer: Date, Actions (Copy, WhatsApp, Delete) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs text-stone-500">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Registrado em: {reminder.date.split('-').reverse().join('/')}</span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Share on WhatsApp */}
                    <button
                      onClick={() => handleShareWhatsApp(reminder)}
                      className="px-3 py-1.5 rounded-xl bg-[#F2F7F3] hover:bg-[#DFEDE2] text-[#254B32] font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1 border border-[#DFEDE2]"
                      title="Enviar orientações para o acompanhante no WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#3B744C]" />
                      <span>WhatsApp</span>
                    </button>

                    {/* Copy to Clipboard */}
                    <button
                      onClick={() => handleCopyReminder(reminder)}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                      title="Copiar texto do lembrete"
                    >
                      {copiedId === reminder.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#3B744C]" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-500" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>

                    {/* Delete button (only if custom user created) */}
                    {reminder.isCustomUserCreated && (
                      <button
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="p-1.5 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remover anotação"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Modal: Add New Reminder / Medical Instruction */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#E6D4AF] shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF6ED] border border-[#DEC68E] flex items-center justify-center text-[#B89243]">
                <Stethoscope className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#8D253D] block">
                  Registro Clínico
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#480D1B]">
                  Anotar Recomendações da Consulta
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-600 mb-6 leading-relaxed">
              Registre o que o médico ou profissional orientou (remédios, exames, repouso, dieta) para que a gestante e o acompanhante não se esqueçam.
            </p>

            <form onSubmit={handleCreateReminder} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Título da Orientação *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Orientações da Consulta de 18ª Sem / Jejum para Exame de Sangue"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425] focus:ring-1 focus:ring-[#5D1425]"
                />
              </div>

              {/* Category & Importance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    Categoria
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ReminderCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                  >
                    <option value="pos_consulta">Pós-Consulta (Orientações Gerais)</option>
                    <option value="preparo_exame">Preparo de Exame / Ultrassom</option>
                    <option value="medicacao">Medicação & Suplementação</option>
                    <option value="geral">Nutrição & Estilo de Vida</option>
                    <option value="sinais_alerta">Sinais de Alerta / Atenção</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    Nível de Prioridade
                  </label>
                  <select
                    value={formImportance}
                    onChange={(e) => setFormImportance(e.target.value as 'urgent' | 'important' | 'routine')}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                  >
                    <option value="important">Importante (Rotina Pré-Natal)</option>
                    <option value="urgent">Urgente / Atenção Máxima</option>
                    <option value="routine">Rotina / Dica Acolhedora</option>
                  </select>
                </div>
              </div>

              {/* Professional selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    Profissional que Orientou
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dr. Roberto Silva"
                    value={formProfessionalName}
                    onChange={(e) => setFormProfessionalName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    Especialidade / Cargo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Médico Obstetra / Enfermeira"
                    value={formProfessionalRole}
                    onChange={(e) => setFormProfessionalRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                  />
                </div>
              </div>

              {/* Reference consultation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    Consulta ou Procedimento Referência
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Consulta Presencial da 18ª Sem"
                    value={formConsultationRef}
                    onChange={(e) => setFormConsultationRef(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#480D1B] block mb-1">
                    Data da Orientação
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                  />
                </div>
              </div>

              {/* Medication schedule if any */}
              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Horário de Remédio / Suplemento (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sulfato ferroso 1 comprimido às 11:30 antes do almoço"
                  value={formMedicationSchedule}
                  onChange={(e) => setFormMedicationSchedule(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                />
              </div>

              {/* Detailed instructions */}
              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Instruções & Recomendações Detalhadas *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva o que foi orientado: o que fazer, o que evitar, por que é importante..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                />
              </div>

              {/* Checklist items */}
              <div>
                <label className="text-xs font-bold text-[#480D1B] block mb-1">
                  Checklist de Tarefas para a Gestante (1 por linha)
                </label>
                <textarea
                  rows={3}
                  placeholder={`Exemplo:\nFazer jejum de 8h na véspera\nNão usar creme hidratante na barriga\nTomar água 2,5L`}
                  value={formChecklistRaw}
                  onChange={(e) => setFormChecklistRaw(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Cada linha virará uma caixinha clicável para a gestante marcar como feita!
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5D1425] hover:bg-[#480D1B] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Lembrete</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
