import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Video, 
  Star, 
  Clock, 
  MapPin, 
  FileText, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import { Appointment } from '../types';
import { INITIAL_APPOINTMENTS } from '../data/mockData';

interface CalendarViewProps {
  onStartTelehealth: (appointmentId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onStartTelehealth }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'prenatal' | 'telehealth'>('prenatal');
  const [currentMonth, setCurrentMonth] = useState('Outubro 2026');
  const [selectedDay, setSelectedDay] = useState<number | null>(12);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  // Month days setup for October 2026 (Starts on Thursday Oct 1st)
  // We mark days that have events: 12 (Dr. Silva), 15 (Enf. Carla Telehealth), 22 (Ultrassom)
  const eventDays: Record<number, { type: 'prenatal' | 'telehealth' | 'ultrasound' | 'exam'; title: string }> = {
    12: { type: 'prenatal', title: 'Consulta Pré-natal - Dr. Marcelo' },
    15: { type: 'telehealth', title: 'Teleorientação - Enfª. Stephanie' },
    22: { type: 'ultrasound', title: 'Ultrassom Morfológico 2º Trimestre - Dra. Letícia' },
    28: { type: 'telehealth', title: 'Teleconsulta Nutricional' },
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'prenatal') return apt.type === 'prenatal' || apt.type === 'ultrasound' || apt.type === 'exam';
    if (activeTab === 'telehealth') return apt.type === 'telehealth';
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8D253D] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#B89243]" />
            Clínica Vittacare Integrada
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
            Minha Agenda de Saúde
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Acompanhe suas consultas presenciais, ultrassons e videochamadas em um só lugar.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#E6D4AF]" />
          <span>Agendar Nova Consulta</span>
        </button>
      </div>

      {/* Tabs Selector: Foco Pré-natal, Foco Teleatendimento, Todos */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#FAF6ED] rounded-2xl border border-[#E6D4AF] text-xs font-medium w-full sm:w-auto">
        <button
          onClick={() => setActiveTab('prenatal')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'prenatal'
              ? 'bg-[#5D1425] text-white font-semibold shadow-xs'
              : 'text-stone-600 hover:text-[#5D1425]'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Foco Pré-natal & Exames</span>
        </button>

        <button
          onClick={() => setActiveTab('telehealth')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'telehealth'
              ? 'bg-[#5D1425] text-white font-semibold shadow-xs'
              : 'text-stone-600 hover:text-[#5D1425]'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Foco Teleatendimento (Vídeo)</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#5D1425] text-white font-semibold shadow-xs'
              : 'text-stone-600 hover:text-[#5D1425]'
          }`}
        >
          <span>Todos</span>
        </button>
      </div>

      {/* Section 1: Monthly Interactive Calendar (Calendário 1 - Foco Pré-natal) */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E6D4AF]/80 shadow-[0_4px_20px_rgba(184,146,67,0.06)]">
        {/* Calendar Nav Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#B89243]" />
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#480D1B]">
              {currentMonth}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 mr-2">
              <Star className="w-3.5 h-3.5 text-[#B89243] fill-[#B89243]" />
              Data com agendamento
            </span>
            <button
              onClick={() => {}}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-[#FAF6ED] text-stone-600 transition-colors cursor-pointer"
              title="Mês Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {}}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-[#FAF6ED] text-stone-600 transition-colors cursor-pointer"
              title="Próximo Mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-stone-400 py-3 border-b border-stone-50">
          <span>DOM</span>
          <span>SEG</span>
          <span>TER</span>
          <span>QUA</span>
          <span>QUI</span>
          <span>SEX</span>
          <span>SÁB</span>
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2">
          {/* Days from previous month (e.g. 4 days offset for Oct 2026 which starts on Thursday) */}
          {[27, 28, 29, 30].map((d) => (
            <div
              key={`prev-${d}`}
              className="h-12 sm:h-14 p-1 rounded-xl text-stone-300 text-xs flex flex-col items-center justify-center opacity-40"
            >
              <span>{d}</span>
            </div>
          ))}

          {/* Days of current month (1 to 31) */}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
            const hasEvent = eventDays[day];
            const isSelected = selectedDay === day;
            const isTelehealth = hasEvent?.type === 'telehealth';

            return (
              <button
                key={`oct-${day}`}
                onClick={() => setSelectedDay(day)}
                className={`h-12 sm:h-14 p-1 rounded-xl text-xs flex flex-col items-center justify-between transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#5D1425] text-white shadow-md font-bold'
                    : hasEvent
                    ? 'bg-[#FAF6ED] text-[#480D1B] font-semibold border border-[#E6D4AF]'
                    : 'text-stone-700 hover:bg-[#FAF0F2]/50'
                }`}
              >
                <span className="tabular-nums">{day}</span>

                {/* Golden Star / Marker for scheduled days */}
                {hasEvent && (
                  <div className="flex items-center gap-0.5 mb-1">
                    {isTelehealth ? (
                      <span className="flex items-center">
                        <Video className={`w-3 h-3 ${isSelected ? 'text-[#E6D4AF]' : 'text-[#8D253D]'}`} />
                      </span>
                    ) : (
                      <Star
                        className={`w-3 h-3 ${
                          isSelected ? 'text-[#DEC68E] fill-[#DEC68E]' : 'text-[#B89243] fill-[#B89243]'
                        }`}
                      />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Info Strip */}
        {selectedDay && eventDays[selectedDay] && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#B89243] fill-[#B89243]" />
              <span className="font-semibold text-[#5D1425]">
                {selectedDay}/10: {eventDays[selectedDay].title}
              </span>
            </div>
            <span className="text-stone-500 font-medium">Veja os detalhes logo abaixo</span>
          </div>
        )}
      </section>

      {/* Prominent Videochamada Banner & Active Teleatendimento Section (Calendário 2 - Foco Teleatendimento) */}
      {(activeTab === 'telehealth' || activeTab === 'all') && (
        <section className="bg-gradient-to-br from-[#FAF0F2] via-white to-[#FAF6ED] rounded-3xl p-6 sm:p-7 border border-[#EBBEC8] shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B744C] animate-ping" />
                <span className="text-xs uppercase font-bold tracking-wider text-[#8D253D]">
                  Teleatendimento Vittaconect Disponível
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#480D1B]">
                Teleorientação Materna - Enfª. Stephanie
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
                Sua sala de videochamada criptografada está aberta. Tire dúvidas sobre sinais de trabalho de parto, contrações de treinamento, aleitamento e orientações de rotina.
              </p>
              <div className="flex items-center gap-4 text-xs text-stone-500 pt-1">
                <span className="flex items-center gap-1 font-semibold text-stone-700">
                  <Clock className="w-3.5 h-3.5 text-[#B89243]" />
                  15/10 às 16:00
                </span>
                <span>·</span>
                <span>Duração: 45 min</span>
                <span>·</span>
                <span className="text-[#3B744C] font-semibold">Profissional Conectada</span>
              </div>
            </div>

            {/* Prominent Gold Action Button (Prompt Requirement) */}
            <div className="shrink-0">
              <button
                onClick={() => onStartTelehealth('apt-2')}
                className="w-full md:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-[#D8BD83] via-[#B89243] to-[#CAA55C] hover:from-[#E6D4AF] hover:to-[#B89243] text-[#2C0610] font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <Video className="w-5 h-5 text-[#2C0610]" />
                <span>Entrar na Videochamada</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Listagem de Consultas e Exames (Prompt Requirement: "12/10 - Consulta Pré-natal - Dr. Silva", etc.) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-[#480D1B]">
            {activeTab === 'telehealth'
              ? 'Próximas Videochamadas Agendadas'
              : activeTab === 'prenatal'
              ? 'Próximas Consultas Presenciais & Exames'
              : 'Todos os Agendamentos'}
          </h2>
          <span className="text-xs text-stone-500">{filteredAppointments.length} agendamento(s)</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredAppointments.map((apt) => {
            const isTelehealth = apt.type === 'telehealth';
            const isLive = apt.status === 'live_now';

            return (
              <div
                key={apt.id}
                className={`p-5 sm:p-6 rounded-2xl bg-white border transition-all ${
                  isLive
                    ? 'border-[#B89243] shadow-[0_4px_16px_rgba(184,146,67,0.12)]'
                    : 'border-[#E6D4AF]/70 hover:border-[#B89243] hover:shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Professional & Date */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        isTelehealth
                          ? 'bg-[#FAF0F2] text-[#8D253D]'
                          : 'bg-[#FAF6ED] text-[#9B7731]'
                      }`}
                    >
                      {isTelehealth ? (
                        <Video className="w-6 h-6 stroke-[2]" />
                      ) : (
                        <Stethoscope className="w-6 h-6 stroke-[2]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#480D1B]">
                          {apt.date.split('-').reverse().join('/')} às {apt.time}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isTelehealth
                              ? 'bg-[#FAF0F2] text-[#8D253D]'
                              : 'bg-[#FAF6ED] text-[#9B7731]'
                          }`}
                        >
                          {apt.type === 'telehealth'
                            ? 'Teleatendimento'
                            : apt.type === 'ultrasound'
                            ? 'Ultrassom'
                            : apt.type === 'exam'
                            ? 'Exame Laboratorial'
                            : 'Consulta Pré-natal'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[#480D1B] mt-1">
                        {apt.title}
                      </h3>

                      <p className="text-xs text-stone-600 font-medium">
                        {apt.professional} · {apt.role}
                      </p>

                      <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#B89243]" />
                        {apt.location}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    {isTelehealth ? (
                      <button
                        onClick={() => onStartTelehealth(apt.id)}
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isLive
                            ? 'bg-[#5D1425] hover:bg-[#741C30] text-white shadow-sm'
                            : 'bg-[#FAF6ED] text-[#480D1B] hover:bg-[#F3EBD8]'
                        }`}
                      >
                        <Video className="w-4 h-4 text-[#D8BD83]" />
                        <span>Entrar na Videochamada</span>
                      </button>
                    ) : (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3B744C] bg-[#F2F7F3] px-2.5 py-1 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Confirmado na Vittacare
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructions / Preparation Footnote */}
                {apt.instructions && (
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-start gap-2 text-xs text-stone-600 bg-stone-50/60 p-2.5 rounded-xl">
                    <FileText className="w-3.5 h-3.5 text-[#B89243] shrink-0 mt-0.5" />
                    <span>
                      <strong>Instruções & Preparo:</strong> {apt.instructions}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Schedule Appointment Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E6D4AF] shadow-2xl relative">
            <h3 className="font-serif font-bold text-2xl text-[#480D1B] mb-2">
              Solicitar Agendamento
            </h3>
            <p className="text-xs text-stone-600 mb-6">
              Escolha a modalidade desejada na Clínica Vittacare. Nossa recepção confirmará o horário em até 30 minutos via aplicativo.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Solicitação de agendamento enviada à equipe da Clínica Vittacare com sucesso!');
                setShowScheduleModal(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Tipo de Atendimento
                </label>
                <select className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF6ED]/40 focus:ring-2 focus:ring-[#B89243] focus:outline-none">
                  <option>Consulta Pré-natal Presencial (Dr. Marcelo)</option>
                  <option>Teleorientação de Enfermagem Obstétrica (Enfª. Stephanie)</option>
                  <option>Ultrassonografia Morfológica / 4D (Dra. Letícia)</option>
                  <option>Consulta Ginecológica Preventiva (Dra. Bianca)</option>
                  <option>Teleconsulta Nutricional Materna</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Data de Preferência
                </label>
                <input
                  type="date"
                  defaultValue="2026-10-20"
                  className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF6ED]/40 focus:ring-2 focus:ring-[#B89243] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Período Preferencial
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center justify-center p-2.5 rounded-xl border border-stone-200 cursor-pointer hover:bg-[#FAF6ED]">
                    <input type="radio" name="period" defaultChecked className="mr-1.5 accent-[#5D1425]" />
                    Manhã
                  </label>
                  <label className="flex items-center justify-center p-2.5 rounded-xl border border-stone-200 cursor-pointer hover:bg-[#FAF6ED]">
                    <input type="radio" name="period" className="mr-1.5 accent-[#5D1425]" />
                    Tarde
                  </label>
                  <label className="flex items-center justify-center p-2.5 rounded-xl border border-stone-200 cursor-pointer hover:bg-[#FAF6ED]">
                    <input type="radio" name="period" className="mr-1.5 accent-[#5D1425]" />
                    Noite
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white font-bold tracking-wide shadow-sm cursor-pointer"
                >
                  Confirmar Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
