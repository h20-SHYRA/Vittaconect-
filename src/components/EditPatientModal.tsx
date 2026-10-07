import React, { useState } from 'react';
import {
  X,
  User,
  Check,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import {
  usePatient,
  calculateDueDateFromWeeks,
} from '../context/PatientContext';
import { useFeedback } from '../context/FeedbackContext';

interface EditPatientModalProps {
  onClose: () => void;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({
  onClose,
}) => {
  const { patient, registerOrUpdatePatient, logout } = usePatient();
  const { showToast } = useFeedback();

  const [name, setName] = useState(patient?.name || '');
  const [preferredName, setPreferredName] = useState(
    patient?.preferredName || ''
  );
  const [babyNickname, setBabyNickname] = useState(
    patient?.babyNickname || ''
  );
  const [currentWeek, setCurrentWeek] = useState<number>(
    patient?.currentWeek || 18
  );
  const [age, setAge] = useState<number>(patient?.age || 28);
  const [bloodType, setBloodType] = useState(patient?.bloodType || 'O+');
  const [emergencyContact, setEmergencyContact] = useState(
    patient?.emergencyContact || ''
  );
  const [allergies, setAllergies] = useState(patient?.allergies || '');
  const [formError, setFormError] = useState<string>('');

  const estimatedDueDate = calculateDueDateFromWeeks(currentWeek);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Por favor, informe o seu nome completo.');
      return;
    }
    if (!babyNickname.trim()) {
      setFormError('Por favor, informe o nome ou apelido carinhoso do bebê.');
      return;
    }
    setFormError('');

    registerOrUpdatePatient({
      name: name.trim(),
      preferredName: preferredName.trim() || name.trim().split(' ')[0],
      babyNickname: babyNickname.trim(),
      currentWeek,
      dueDate: estimatedDueDate,
      age: Number(age) || 28,
      bloodType,
      emergencyContact: emergencyContact.trim(),
      allergies: allergies.trim(),
    });

    showToast({
      title: 'Dados Atualizados',
      description: 'Suas informações clínicas foram salvas com sucesso.',
      tone: 'success',
    });
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const inputClass =
    'w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-[#E6D4AF] bg-white text-sm text-stone-800 transition-all focus:outline-none focus:border-[#5D1425] focus:ring-2 focus:ring-[#5D1425]/20';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-patient-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FDFBF7] rounded-t-3xl sm:rounded-3xl max-w-lg w-full border-t sm:border border-[#E6D4AF] shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden"
      >
        {/* Sticky Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-white border-b border-[#E6D4AF]/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] border border-[#EBBEC8] flex items-center justify-center text-[#5D1425] shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#8D253D] block">
                Carteira Digital da Paciente
              </span>
              <h2
                id="edit-patient-modal-title"
                className="font-serif font-bold text-lg sm:text-xl text-[#480D1B]"
              >
                Atualizar Meus Dados
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          id="edit-patient-form"
          onSubmit={handleSave}
          noValidate
          className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4"
        >
          <p className="text-xs sm:text-sm text-stone-600">
            Mantenha seus dados clínicos e de acompanhamento sempre atualizados no Vittaconect.
          </p>

          {formError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-medium flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#480D1B] block mb-1.5">
              Nome Completo da Paciente <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Mariana Silva"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1.5">
                Como prefere ser chamada
              </label>
              <input
                type="text"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                placeholder="Ex: Mari"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1.5">
                Nome / Apelido do Bebê <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={babyNickname}
                onChange={(e) => setBabyNickname(e.target.value)}
                placeholder="Ex: Gabriel"
                className={inputClass}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E6D4AF]/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#480D1B]">
                Semana Gestacional Atual
              </label>
              <span className="text-xs font-bold text-[#8D253D] bg-[#FAF0F2] px-2.5 py-0.5 rounded-full border border-[#EBBEC8]">
                {currentWeek}ª Semana
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={41}
              value={currentWeek}
              onChange={(e) => setCurrentWeek(Number(e.target.value))}
              className="w-full accent-[#5D1425] cursor-pointer mt-1"
            />
            <span className="text-xs text-stone-600 block">
              Data Prevista do Parto (DPP):{' '}
              <strong className="text-[#480D1B]">{estimatedDueDate}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1.5">
                Idade
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1.5">
                Tipo Sanguíneo & Fator Rh
              </label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className={inputClass}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="Desconhecido">A realizar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#480D1B] block mb-1.5">
              Contato de Emergência / Acompanhante
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="Nome e telefone com DDD"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#480D1B] block mb-1.5">
              Alergias a Medicamentos ou Observações
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Ex: Nenhuma alergia conhecida"
              className={inputClass}
            />
          </div>
        </form>

        {/* Sticky Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-white border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className="min-h-[42px] flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair da Conta</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="edit-patient-form"
              className="min-h-[42px] px-5 py-2.5 rounded-xl bg-[#5D1425] hover:bg-[#480D1B] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
