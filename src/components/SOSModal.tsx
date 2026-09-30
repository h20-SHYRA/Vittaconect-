import React from 'react';
import { ShieldAlert, PhoneCall, AlertTriangle, CheckCircle2, X, MapPin } from 'lucide-react';
import { CLINIC_INFO } from '../data/mockData';

interface SOSModalProps {
  onClose: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ onClose }) => {
  const warningSigns = [
    {
      title: 'Sangramento vaginal súbito',
      desc: 'Qualquer volume de sangramento vermelho vivo deve ser avaliado com brevidade.',
    },
    {
      title: 'Perda de líquido amniótico',
      desc: 'Sensação de líquido morno escorrendo pelas pernas que não cessa com o repouso.',
    },
    {
      title: 'Dor de cabeça intensa ou alterações visuais',
      desc: 'Cefaleia súbita, visão com pontos brilhantes (escótomos) ou dor na boca do estômago (sinais de pré-eclâmpsia).',
    },
    {
      title: 'Redução acentuada dos movimentos fetais',
      desc: 'Menos de 6 a 10 movimentos após o almoço ou jantar em período de 2 horas (a partir da 28ª semana).',
    },
    {
      title: 'Febre alta (> 38°C) ou cólicas persistentes',
      desc: 'Cólicas rítmicas com enrijecimento abdominal frequente antes da 37ª semana.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#EBBEC8] shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SOS Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8] flex items-center justify-center text-[#8D253D]">
            <ShieldAlert className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#8D253D] block">
              Pronto-Atendimento Obstétrico 24h
            </span>
            <h3 className="font-serif font-bold text-2xl text-[#480D1B]">
              Plantão Vittacare de Urgência
            </h3>
          </div>
        </div>

        <p className="text-xs text-stone-600 mb-5 leading-relaxed">
          Se você estiver vivenciando qualquer um dos sinais de alarme abaixo, mantenha a calma e contate imediatamente nossa equipe de plantão obstétrico.
        </p>

        {/* Warning Signs List */}
        <div className="space-y-2.5 mb-6">
          {warningSigns.map((sign, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#FAF0F2]/70 border border-[#EBBEC8]/80 text-xs">
              <span className="font-bold text-[#5D1425] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#8D253D] shrink-0" />
                {sign.title}
              </span>
              <p className="text-stone-600 mt-1 pl-5">{sign.desc}</p>
            </div>
          ))}
        </div>

        {/* Direct Action Buttons */}
        <div className="space-y-3 pt-2">
          <a
            href={`tel:${CLINIC_INFO.phone24h.replace(/\D/g, '')}`}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#5D1425] hover:bg-[#741C30] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98]"
          >
            <PhoneCall className="w-4 h-4 text-[#E6D4AF]" />
            <span>Ligar para Plantão 24h: {CLINIC_INFO.phone24h}</span>
          </a>

          <a
            href={`https://wa.me/5511988776655?text=Ol%C3%A1%2C%20preciso%20de%20orienta%C3%A7%C3%A3o%20urgente%20no%20plant%C3%A3o%20obst%C3%A9trico%20Vittacare.`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-[#3B744C] hover:bg-[#336443] text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <span>WhatsApp da Triagem Obstétrica (24 Horas)</span>
          </a>
        </div>

        {/* Clinic address reminder */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-[11px] text-stone-500">
          <MapPin className="w-3.5 h-3.5 text-[#B89243] shrink-0" />
          <span>Unidade Jardins: Av. Paulista, 1842 - Entrada pelo Pronto-Socorro Materno</span>
        </div>
      </div>
    </div>
  );
};
