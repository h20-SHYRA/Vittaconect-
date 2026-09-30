import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  MoreVertical, 
  Check, 
  Copy, 
  X, 
  QrCode, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { VittacareLogo } from './VittacareLogo';

interface InstallAppModalProps {
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeDeviceTab, setActiveDeviceTab] = useState<'android' | 'ios' | 'qr'>('android');
  const [copied, setCopied] = useState(false);

  const appUrl = window.location.origin;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
          <div className="w-12 h-12 rounded-2xl bg-[#FAF0F2] border border-[#EBBEC8] flex items-center justify-center text-[#5D1425]">
            <Smartphone className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#8D253D] block">
              Instalação no Celular
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#480D1B]">
              Como Acessar como Aplicativo
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
          Você não precisa acessar o navegador toda vez! O <strong>Vittaconect</strong> funciona como um aplicativo nativo no seu celular (PWA), abrindo em tela cheia com ícone próprio na sua tela inicial.
        </p>

        {/* Native 1-Click Install Button if supported by current browser */}
        {isInstallable && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="font-serif font-bold text-sm text-[#480D1B]">
                Seu navegador suporta instalação direta!
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Toque no botão abaixo para adicionar o Vittaconect agora mesmo.
              </p>
            </div>
            <button
              onClick={install}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-[#E6D4AF]" />
              <span>Instalar Agora</span>
            </button>
          </div>
        )}

        {/* Device Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#FAF6ED] rounded-2xl border border-[#E6D4AF] mb-5 text-xs font-semibold">
          <button
            onClick={() => setActiveDeviceTab('android')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer ${
              activeDeviceTab === 'android'
                ? 'bg-[#5D1425] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#5D1425]'
            }`}
          >
            Android (Samsung, Xiaomi, Motorola...)
          </button>
          <button
            onClick={() => setActiveDeviceTab('ios')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer ${
              activeDeviceTab === 'ios'
                ? 'bg-[#5D1425] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#5D1425]'
            }`}
          >
            iPhone & iPad (Apple iOS)
          </button>
          <button
            onClick={() => setActiveDeviceTab('qr')}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeDeviceTab === 'qr'
                ? 'bg-[#5D1425] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#5D1425]'
            }`}
            title="Abrir no celular pelo QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">QR Code</span>
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        {activeDeviceTab === 'android' && (
          <div className="space-y-3.5">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF0F2]/50 border border-[#EBBEC8]">
              <span className="w-6 h-6 rounded-full bg-[#5D1425] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </span>
              <div className="text-xs text-stone-700">
                <strong className="text-[#480D1B] block">Abra no Google Chrome do seu celular</strong>
                Acesse o endereço do app no navegador do celular (você pode copiar o link abaixo ou escanear o QR Code).
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF0F2]/50 border border-[#EBBEC8]">
              <span className="w-6 h-6 rounded-full bg-[#5D1425] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </span>
              <div className="text-xs text-stone-700">
                <strong className="text-[#480D1B] flex items-center gap-1">
                  Toque nos 3 pontinhos <MoreVertical className="w-3.5 h-3.5 inline text-stone-600" />
                </strong>
                No canto superior direito da tela do Google Chrome, toque no menu de três pontinhos verticais.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF0F2]/50 border border-[#EBBEC8]">
              <span className="w-6 h-6 rounded-full bg-[#5D1425] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </span>
              <div className="text-xs text-stone-700">
                <strong className="text-[#480D1B] block">Toque em "Instalar aplicativo" ou "Adicionar à tela inicial"</strong>
                O Chrome baixará o atalho e o aplicativo será instalado com o ícone oficial da Clínica Vittacare.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F2F7F3] border border-[#DFEDE2]">
              <span className="w-6 h-6 rounded-full bg-[#3B744C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                ✓
              </span>
              <div className="text-xs text-stone-700">
                <strong className="text-[#254B32] block">Pronto! Abra direto pelo ícone</strong>
                Ele abrirá sem barra de endereços, exatamente como os aplicativos baixados pela Play Store!
              </div>
            </div>
          </div>
        )}

        {activeDeviceTab === 'ios' && (
          <div className="space-y-3.5">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF0F2]/50 border border-[#EBBEC8]">
              <span className="w-6 h-6 rounded-full bg-[#5D1425] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </span>
              <div className="text-xs text-stone-700">
                <strong className="text-[#480D1B] block">Abra no Safari do iPhone</strong>
                No iPhone, certifique-se de abrir o link no navegador <strong>Safari</strong> (não abra dentro do navegador embutido do Instagram ou WhatsApp).
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF0F2]/50 border border-[#EBBEC8]">
              <span className="w-6 h-6 rounded-full bg-[#5D1425] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </span>
              <div className="text-xs text-stone-700">
                <strong className="text-[#480D1B] flex items-center gap-1">
                  Toque no botão Compartilhar <Share className="w-3.5 h-3.5 inline text-[#B89243]" />
                </strong>
                É o botão do quadrado com a setinha apontando para cima na barra inferior do Safari.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF0F2]/50 border border-[#EBBEC8]">
              <span className="w-6 h-6 rounded-full bg-[#5D1425] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </span>
              <div className="text-xs text-stone-700">
                <strong className="text-[#480D1B] flex items-center gap-1">
                  Selecione "Adicionar à Tela de Início" <PlusSquare className="w-3.5 h-3.5 inline text-stone-600" />
                </strong>
                Role a folha de opções para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>. Depois toque em <strong>"Adicionar"</strong> no canto superior direito.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F2F7F3] border border-[#DFEDE2]">
              <span className="w-6 h-6 rounded-full bg-[#3B744C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                ✓
              </span>
              <div className="text-xs text-stone-700">
                <strong className="text-[#254B32] block">Aplicativo no seu iPhone</strong>
                O ícone do Vittaconect ficará na sua tela principal como qualquer app da App Store!
              </div>
            </div>
          </div>
        )}

        {activeDeviceTab === 'qr' && (
          <div className="flex flex-col items-center text-center p-4 bg-[#FAF6ED] rounded-2xl border border-[#E6D4AF]">
            <p className="text-xs text-stone-700 font-semibold mb-3">
              Aponte a câmera do seu celular para este código na tela:
            </p>
            {/* Clean SVG QR code representation that links directly to current app url */}
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#E6D4AF]">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(appUrl)}&color=5D1425&bgcolor=FFFFFF`}
                alt="QR Code para abrir Vittaconect no celular"
                className="w-40 h-40 rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[11px] text-stone-500 mt-2">
              Ao abrir a página no celular, siga os passos de Android ou iPhone acima para fixar na tela inicial!
            </span>
          </div>
        )}

        {/* Copy Link Strip */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:flex-1 truncate">
            <span className="text-[10px] text-stone-400 font-semibold block uppercase tracking-wider">
              Link direto do app:
            </span>
            <span className="text-xs text-stone-700 font-mono select-all truncate block">
              {appUrl}
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              copied
                ? 'bg-[#3B744C] text-white'
                : 'bg-[#FAF0F2] text-[#5D1425] hover:bg-[#F5DFE4] border border-[#EBBEC8]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Link Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
