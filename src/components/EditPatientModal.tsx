import React, { useState } from 'react';
import { X, User, Baby, Check, LogOut, ArrowRight, Heart } from 'lucide-react';
import { usePatient, calculateDueDateFromWeeks } from '../context/PatientContext';

interface EditPatientModalProps {
  onClose: () => void;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({ onClose }) => {
  const { patient, registerOrUpdatePatient, logout } = usePatient();

  const [name, setName] = useState(patient?.name || '');
  const [preferredName, setPreferredName] = useState(patient?.preferredName || '');
  const [babyNickname, setBabyNickname] = useState(patient?.babyNickname || '');
  const [currentWeek, setCurrentWeek] = useState<number>(patient?.currentWeek || 18);
  const [age, setAge] = useState<number>(patient?.age || 28);
  const [bloodType, setBloodType] = useState(patient?.bloodType || 'O+');
  const [emergencyContact, setEmergencyContact] = useState(patient?.emergencyContact || '');
  const [allergies, setAllergies] = useState(patient?.allergies || '');

  const estimatedDueDate = calculateDueDateFromWeeks(currentWeek);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !babyNickname.trim()) return;

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

    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E6D4AF] shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8] flex items-center justify-center text-[#5D1425]">
            <User className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#8D253D] block">
              Carteira Digital da Gestante
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#480D1B]">
              Atualizar Meus Dados
            </h2>
          </div>
        </div>

        <p className="text-xs text-stone-600 mb-6">
          Mantenha seus dados e do seu bebê sempre em dia no Vittaconect.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#480D1B] block mb-1">
              Nome da Mãe *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1">
                Como gosta de ser chamada
              </label>
              <input
                type="text"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1">
                Nome do Bebê *
              </label>
              <input
                type="text"
                required
                value={babyNickname}
                onChange={(e) => setBabyNickname(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#480D1B]">
                Semana Gestacional Atual
              </label>
              <span className="text-xs font-bold text-[#8D253D] bg-[#FAF0F2] px-2 py-0.5 rounded-full border border-[#EBBEC8]">
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
            <span className="text-[10px] text-stone-500 block mt-0.5">
              Data Prevista do Parto (DPP): <strong>{estimatedDueDate}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1">
                Idade da Mãe
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#480D1B] block mb-1">
                Tipo Sanguíneo
              </label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
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
            <label className="text-xs font-bold text-[#480D1B] block mb-1">
              Contato de Emergência / Acompanhante
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#480D1B] block mb-1">
              Alergias a Medicamentos
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#5D1425]"
            />
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Trocar de Mãezinha / Sair</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#5D1425] hover:bg-[#480D1B] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
