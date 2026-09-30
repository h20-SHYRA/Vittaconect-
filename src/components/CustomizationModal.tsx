import React from 'react';
import { 
  X, 
  Type, 
  Eye, 
  Sun, 
  Moon, 
  Sparkles, 
  RotateCcw, 
  Check, 
  ZoomIn, 
  ZoomOut,
  Sliders,
  AlignLeft,
  Contrast
} from 'lucide-react';
import { useCustomization, FontSizeOption, VisualTheme } from '../context/CustomizationContext';

interface CustomizationModalProps {
  onClose: () => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({ onClose }) => {
  const { settings, updateSetting, resetSettings, increaseFontSize, decreaseFontSize } = useCustomization();

  const fontOptions: { id: FontSizeOption; label: string; scale: string; desc: string }[] = [
    { id: 'sm', label: 'Compacto', scale: '90%', desc: 'Ideal para ver mais itens na tela' },
    { id: 'base', label: 'Padrão', scale: '100%', desc: 'Tamanho padrão equilibrado' },
    { id: 'lg', label: 'Médio', scale: '115%', desc: 'Mais legível e confortável' },
    { id: 'xl', label: 'Grande', scale: '130%', desc: 'Recomendado para leitura fácil' },
    { id: '2xl', label: 'Extra Grande', scale: '150%', desc: 'Máxima acessibilidade visual' },
  ];

  const themeOptions: { id: VisualTheme; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: 'classic', label: 'Vittacare Clássico', icon: Sparkles, desc: 'Tons de marfim, vinho bordô e ouro nobre' },
    { id: 'warm', label: 'Luz Quente Suave', icon: Sun, desc: 'Filtro sépia relaxante para os olhos' },
    { id: 'dark', label: 'Descanso Noturno', icon: Moon, desc: 'Reduz o brilho para ambientes escuros' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#E6D4AF] shadow-2xl relative max-h-[92vh] overflow-y-auto">
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
          <div className="w-12 h-12 rounded-2xl bg-[#FAF6ED] border border-[#DEC68E] flex items-center justify-center text-[#B89243]">
            <Sliders className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#9B7731] block">
              Personalização & Conforto
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#480D1B]">
              Ajustes do Aplicativo
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
          Personalize o tamanho dos textos, o contraste e o estilo visual para deixar o <strong>Vittaconect</strong> com a leitura mais agradável para você.
        </p>

        {/* Live Typography Preview Card */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[#FAF6ED] via-[#FDFBF7] to-[#FAF0F2] border border-[#E6D4AF] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8D253D] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Prévia em Tempo Real
            </span>
            <span className="text-[10px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded-full border border-[#E6D4AF]">
              Escala Atual: {fontOptions.find((f) => f.id === settings.fontSize)?.scale}
            </span>
          </div>
          <p className="font-serif font-bold text-base text-[#480D1B] mb-1">
            Clínica Vittacare • Cuidado Materno Integrado
          </p>
          <p className="text-xs text-stone-600 leading-relaxed">
            "A distância de duas telas, a proximidade de um cuidado que abraça." Todas as letras e botões do aplicativo mudam de tamanho automaticamente.
          </p>
        </div>

        {/* Section 1: Font Size Controls */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-[#8D253D]" />
              <h3 className="font-serif font-bold text-base text-[#480D1B]">
                Tamanho das Letras
              </h3>
            </div>
            
            {/* Quick +/- Stepper */}
            <div className="flex items-center gap-1 bg-[#FAF6ED] p-1 rounded-xl border border-[#E6D4AF]">
              <button
                onClick={decreaseFontSize}
                disabled={settings.fontSize === 'sm'}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Diminuir letras"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-bold text-[#480D1B]">
                {fontOptions.find((f) => f.id === settings.fontSize)?.scale}
              </span>
              <button
                onClick={increaseFontSize}
                disabled={settings.fontSize === '2xl'}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Aumentar letras"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid of Size Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {fontOptions.map((opt) => {
              const isActive = settings.fontSize === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => updateSetting('fontSize', opt.id)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isActive
                      ? 'bg-[#5D1425] text-white border-[#5D1425] shadow-sm ring-2 ring-[#B89243]/40'
                      : 'bg-[#FAF6ED]/70 hover:bg-[#FAF6ED] text-stone-700 border-[#E6D4AF]'
                  }`}
                >
                  <span className={`font-serif font-bold ${
                    opt.id === 'sm' ? 'text-sm' :
                    opt.id === 'base' ? 'text-base' :
                    opt.id === 'lg' ? 'text-lg' :
                    opt.id === 'xl' ? 'text-xl' : 'text-2xl'
                  }`}>
                    Aa
                  </span>
                  <span className={`text-[11px] font-semibold ${isActive ? 'text-white' : 'text-[#480D1B]'}`}>
                    {opt.label}
                  </span>
                  <span className={`text-[9px] ${isActive ? 'text-[#E6D4AF]' : 'text-stone-500'}`}>
                    {opt.scale}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Reading Accessibility Switches */}
        <div className="space-y-3 mb-6 pt-4 border-t border-stone-100">
          <div className="flex items-center gap-2 mb-1">
            <Contrast className="w-4 h-4 text-[#8D253D]" />
            <h3 className="font-serif font-bold text-base text-[#480D1B]">
              Leitura & Acessibilidade
            </h3>
          </div>

          {/* Alto Contraste */}
          <label className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-[#FAF6ED]/40 flex items-center justify-between cursor-pointer transition-colors">
            <div className="pr-3">
              <span className="text-xs font-bold text-[#480D1B] block">
                Alto Contraste de Texto
              </span>
              <span className="text-[11px] text-stone-500 block">
                Aumenta a nitidez das cores e bordas para leitura sob luz forte ou baixa visão.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSetting('highContrast', e.target.checked)}
              className="w-5 h-5 accent-[#5D1425] rounded-md cursor-pointer"
            />
          </label>

          {/* Texto em Negrito Reforçado */}
          <label className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-[#FAF6ED]/40 flex items-center justify-between cursor-pointer transition-colors">
            <div className="pr-3">
              <span className="text-xs font-bold text-[#480D1B] block">
                Texto com Traço Reforçado (Negrito Leve)
              </span>
              <span className="text-[11px] text-stone-500 block">
                Engrossa os caracteres para facilitar a leitura sem forçar os olhos.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.boldText}
              onChange={(e) => updateSetting('boldText', e.target.checked)}
              className="w-5 h-5 accent-[#5D1425] rounded-md cursor-pointer"
            />
          </label>

          {/* Espaçamento entre Linhas */}
          <label className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-[#FAF6ED]/40 flex items-center justify-between cursor-pointer transition-colors">
            <div className="pr-3">
              <span className="text-xs font-bold text-[#480D1B] block flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5 text-stone-600" />
                Espaçamento de Linha Expandido
              </span>
              <span className="text-[11px] text-stone-500 block">
                Mais ar entre parágrafos para evitar cansaço visual.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.lineHeight === 'relaxed'}
              onChange={(e) => updateSetting('lineHeight', e.target.checked ? 'relaxed' : 'normal')}
              className="w-5 h-5 accent-[#5D1425] rounded-md cursor-pointer"
            />
          </label>
        </div>

        {/* Section 3: Visual Theme / Comfort Lighting */}
        <div className="space-y-3 mb-6 pt-4 border-t border-stone-100">
          <h3 className="font-serif font-bold text-base text-[#480D1B] flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#B89243]" />
            Modo de Iluminação Visual
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {themeOptions.map((t) => {
              const Icon = t.icon;
              const isActive = settings.theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => updateSetting('theme', t.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#5D1425] text-white border-[#5D1425] shadow-xs ring-2 ring-[#B89243]/30'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#E6D4AF]' : 'text-[#8D253D]'}`} />
                    <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[#480D1B]'}`}>
                      {t.label}
                    </span>
                  </div>
                  <p className={`text-[10px] leading-tight ${isActive ? 'text-[#F3EBD8]' : 'text-stone-500'}`}>
                    {t.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <button
            onClick={resetSettings}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#5D1425] hover:bg-[#480D1B] text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Salvar & Fechar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
