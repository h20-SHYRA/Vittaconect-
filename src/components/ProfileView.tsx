import React from 'react';
import { 
  User, 
  Heart, 
  Shield, 
  Phone, 
  MapPin, 
  Clock, 
  Award, 
  CheckCircle, 
  AlertTriangle,
  Stethoscope,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { CLINIC_INFO, INITIAL_PATIENT } from '../data/mockData';
import { VittacareLogo } from './VittacareLogo';

interface ProfileViewProps {
  onOpenSOS: () => void;
  onOpenInstall?: () => void;
  onOpenShare?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenSOS, onOpenInstall, onOpenShare }) => {
  const vaccines = [
    { name: 'dTpa (Tríplice Bacteriana Acelular)', status: 'Agendada para 20ª sem', date: '2026-10-24', done: false },
    { name: 'Hepatite B (3ª Dose)', status: 'Realizada', date: '2026-08-14', done: true },
    { name: 'Influenza (Gripe)', status: 'Realizada', date: '2026-07-20', done: true },
    { name: 'Covid-19 Bivalente', status: 'Realizada', date: '2026-06-10', done: true },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8D253D] uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-[#B89243]" />
          Carteira Digital da Gestante
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#480D1B]">
          Meu Perfil & Prontuário Vittacare
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Identificação materna, histórico de vacinas e equipe de referência.
        </p>
      </div>

      {/* Maternal Health Passport Card */}
      <section className="bg-gradient-to-br from-[#FAF0F2] via-white to-[#FAF6ED] rounded-3xl p-6 sm:p-8 border border-[#E6D4AF] shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E6D4AF]/60">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#DEC68E] via-[#B89243] to-[#5D1425] p-1 shadow-md">
              <div className="w-full h-full rounded-full bg-[#480D1B] flex items-center justify-center text-white text-2xl font-serif font-bold">
                M
              </div>
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#480D1B]">
                {INITIAL_PATIENT.name}
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                {INITIAL_PATIENT.age} anos · Gestante (18ª semana de gestação)
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-bold text-[#8D253D] bg-white px-2 py-0.5 rounded-full border border-[#EBBEC8]">
                  Tipo: {INITIAL_PATIENT.bloodType}
                </span>
                <span className="text-[11px] text-stone-500">
                  DPP: <strong className="text-stone-700">{INITIAL_PATIENT.dueDate}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
              Bebê a Caminho
            </span>
            <span className="font-serif font-bold text-xl text-[#5D1425]">
              {INITIAL_PATIENT.babyNickname}
            </span>
            <span className="text-xs text-stone-500 block">Menino · 2º Trimestre</span>
          </div>
        </div>

        {/* Clinical Reference Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-white border border-[#E6D4AF]/60 shadow-xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Médico Obstetra
            </span>
            <h4 className="font-serif font-bold text-base text-[#480D1B] mt-1">
              {INITIAL_PATIENT.doctorName}
            </h4>
            <span className="text-xs text-stone-500 block mt-0.5">
              {INITIAL_PATIENT.doctorCrm}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E6D4AF]/60 shadow-xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Enfermeira de Referência
            </span>
            <h4 className="font-serif font-bold text-base text-[#480D1B] mt-1">
              Enf. Carla Soares
            </h4>
            <span className="text-xs text-stone-500 block mt-0.5">
              COREN-SP 214.502 (Enfermagem Obstétrica)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E6D4AF]/60 shadow-xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Contato de Emergência
            </span>
            <h4 className="font-serif font-bold text-base text-[#480D1B] mt-1">
              {INITIAL_PATIENT.emergencyContact}
            </h4>
            <span className="text-xs text-[#8D253D] font-semibold block mt-0.5">
              Alergia: {INITIAL_PATIENT.allergies}
            </span>
          </div>
        </div>
      </section>

      {/* Maternal Vaccination Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E6D4AF]/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#480D1B]">
              Imunização Gestacional Recomendada
            </h3>
            <p className="text-xs text-stone-500">
              Proteção transmitida via placenta com anticorpos maternos.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#3B744C] bg-[#F2F7F3] px-3 py-1 rounded-full">
            3 de 4 em dia
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vaccines.map((v, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 flex items-center justify-between"
            >
              <div>
                <h4 className="font-medium text-xs text-stone-800">{v.name}</h4>
                <span className="text-[11px] text-stone-500">{v.status}</span>
              </div>
              {v.done ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#3B744C] bg-white px-2 py-0.5 rounded-lg border border-[#DFEDE2]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Aplicada
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#B89243] bg-white px-2 py-0.5 rounded-lg border border-[#E6D4AF]">
                  {v.date.split('-').reverse().join('/')}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PWA Mobile Installation Card */}
      <section className="bg-gradient-to-br from-[#FAF0F2] to-white rounded-3xl p-6 sm:p-7 border border-[#EBBEC8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8D253D] block">
            Acesso no Celular
          </span>
          <h3 className="font-serif font-bold text-lg text-[#480D1B] mt-0.5">
            Instalar o Vittaconect na Tela Inicial
          </h3>
          <p className="text-xs text-stone-600 mt-1 max-w-lg">
            Abra direto pelo ícone como um aplicativo nativo no Android ou iPhone, sem precisar digitar o endereço no navegador.
          </p>
        </div>

        {onOpenInstall && (
          <button
            onClick={onOpenInstall}
            className="px-5 py-2.5 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
          >
            Ver Como Instalar
          </button>
        )}
      </section>

      {/* Rede de Apoio e Acompanhantes */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E6D4AF]/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#3B744C] block">
            Rede de Apoio Ativa
          </span>
          <h3 className="font-serif font-bold text-lg text-[#480D1B] mt-0.5">
            Acompanhantes & Familiares Conectados
          </h3>
          <p className="text-xs text-stone-600 mt-1 max-w-lg">
            Permita que o pai/acompanhante, avós ou doula acompanhem as datas de ultrassom, exames e orientações do pré-natal.
          </p>
        </div>

        {onOpenShare && (
          <button
            onClick={onOpenShare}
            className="px-5 py-2.5 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8] hover:bg-[#F5DFE4] text-[#5D1425] text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
          >
            Gerenciar Acessos
          </button>
        )}
      </section>

      {/* Clinic Contact & Direct Channels */}
      <section className="bg-[#FAF6ED] rounded-3xl p-6 sm:p-7 border border-[#E6D4AF] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6D4AF]/60">
          <div>
            <VittacareLogo size="sm" />
            <p className="text-xs text-stone-600 mt-2">
              {CLINIC_INFO.address}
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              {CLINIC_INFO.unitHours}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSOS}
              className="px-4 py-2.5 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Pronto-Atendimento 24h
            </button>
            <a
              href="https://wa.me/5511988776655"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#3B744C] hover:bg-[#336443] text-white text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Vittacare</span>
            </a>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="font-serif italic text-xs text-[#5D1425]">
            "{CLINIC_INFO.slogan}"
          </p>
        </div>
      </section>
    </div>
  );
};
