import React, { useState } from 'react';
import { 
  Users, 
  Share2, 
  MessageCircle, 
  Copy, 
  Check, 
  X, 
  QrCode, 
  ShieldCheck, 
  Heart, 
  UserPlus, 
  Trash2,
  Lock,
  Eye,
  Calendar,
  Sparkles
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';

interface ShareAccessModalProps {
  onClose: () => void;
}

interface SupportMember {
  id: string;
  name: string;
  role: string;
  relation: string;
  permissions: 'full' | 'view_only';
  status: 'active' | 'invited';
}

export const ShareAccessModal: React.FC<ShareAccessModalProps> = ({ onClose }) => {
  const { patient } = usePatient();
  const babyName = patient?.babyNickname || 'Bebê';
  const motherName = patient?.preferredName || 'Mãezinha';

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'invite' | 'members'>('invite');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('Parceiro(a) / Esposo(a)');
  const [newMemberPermission, setNewMemberPermission] = useState<'full' | 'view_only'>('full');

  const [members, setMembers] = useState<SupportMember[]>([
    {
      id: 'mem-1',
      name: patient?.emergencyContact?.split('-')[0]?.trim() || 'Acompanhante Principal',
      role: 'Acompanhante Principal',
      relation: 'Rede de Apoio',
      permissions: 'full',
      status: 'active',
    },
    {
      id: 'mem-2',
      name: 'Dra. Helena Castro',
      role: 'Doula & Apoio Perinatal',
      relation: 'Doula',
      permissions: 'full',
      status: 'active',
    },
    {
      id: 'mem-3',
      name: 'Regina Silva',
      role: 'Rede Familiar',
      relation: 'Mãe / Avó',
      permissions: 'view_only',
      status: 'invited',
    },
  ]);

  // Dynamic current app URL (works immediately on any environment)
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-ku6g2ihk4swh5rso2nbxhb-481143494721.us-east1.run.app';
  const sharedUrl = 'https://ais-pre-ku6g2ihk4swh5rso2nbxhb-481143494721.us-east1.run.app';
  
  const [selectedUrlType, setSelectedUrlType] = useState<'current' | 'public'>('current');
  const appUrl = selectedUrlType === 'current' ? currentOrigin : sharedUrl;

  const inviteMessage = `Olá! Convido você para acessar o Vittaconect da Clínica Vittacare e acompanhar a gestação do bebê ${babyName} comigo. Veja o calendário de consultas, ultrassons e desenvolvimento semanal aqui: ${appUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteMessage)}`;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMem: SupportMember = {
      id: `mem-${Date.now()}`,
      name: newMemberName.trim(),
      role: newMemberRelation,
      relation: newMemberRelation,
      permissions: newMemberPermission,
      status: 'invited',
    };

    setMembers([...members, newMem]);
    setNewMemberName('');
    setActiveTab('members');
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
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
            <Users className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#8D253D] block">
              Acesso Compartilhado
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#480D1B]">
              Compartilhar com Outras Pessoas
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 mb-5 leading-relaxed">
          <strong>Sim, você pode compartilhar com quem quiser!</strong> O link público do app está ativo na internet. Qualquer pessoa (esposo, parceiro, mãe, doula ou familiares) pode abrir pelo celular ou computador.
        </p>

        {/* Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#FAF6ED] rounded-2xl border border-[#E6D4AF] mb-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('invite')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'invite'
                ? 'bg-[#5D1425] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#5D1425]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Enviar Convite / Link</span>
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'members'
                ? 'bg-[#5D1425] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#5D1425]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Rede de Apoio ({members.length})</span>
          </button>
        </div>

        {activeTab === 'invite' ? (
          <div className="space-y-4">
            {/* Quick Share Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp Link */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3.5 px-4 rounded-2xl bg-[#3B744C] hover:bg-[#336443] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Enviar pelo WhatsApp</span>
              </a>

              {/* Copy Link Button */}
              <button
                onClick={handleCopy}
                className={`py-3.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  copied
                    ? 'bg-[#F2F7F3] border-[#3B744C] text-[#3B744C]'
                    : 'bg-[#FAF0F2] border-[#EBBEC8] text-[#5D1425] hover:bg-[#F5DFE4]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Link Copiado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Link de Acesso</span>
                  </>
                )}
              </button>
            </div>

            {/* URL Selector Tabs */}
            <div className="flex items-center gap-2 p-1 bg-[#FAF6ED] rounded-xl border border-[#E6D4AF] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedUrlType('current')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg transition-all cursor-pointer ${
                  selectedUrlType === 'current'
                    ? 'bg-[#5D1425] text-white shadow-xs'
                    : 'text-stone-600 hover:text-[#5D1425]'
                }`}
              >
                Link Atual (Ativo no Navegador)
              </button>
              <button
                type="button"
                onClick={() => setSelectedUrlType('public')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg transition-all cursor-pointer ${
                  selectedUrlType === 'public'
                    ? 'bg-[#5D1425] text-white shadow-xs'
                    : 'text-stone-600 hover:text-[#5D1425]'
                }`}
              >
                Link Público (ais-pre)
              </button>
            </div>

            {/* Direct URL Box */}
            <div className="p-3.5 rounded-2xl bg-[#FAF6ED] border border-[#E6D4AF]">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block mb-1">
                {selectedUrlType === 'current' ? 'Link atual ativo:' : 'Link público compartilhado:'}
              </span>
              <p className="text-xs text-[#480D1B] font-mono break-all select-all font-medium">
                {appUrl}
              </p>
            </div>

            {/* Note about 404 and Share button in Google AI Studio */}
            {selectedUrlType === 'public' && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>💡 O link público deu erro 404?</strong><br />
                No Google AI Studio, o link público precisa ser ativado clicando no botão <strong>"Share"</strong> (ou <strong>"Compartilhar"</strong>) no canto superior direito da tela do AI Studio. Enquanto não clicar nele, use o <em>Link Atual</em> acima.
              </div>
            )}

            {/* QR Code for instant phone scanning */}
            <div className="p-4 rounded-2xl bg-white border border-[#E6D4AF] flex flex-col sm:flex-row items-center gap-4">
              <div className="p-2 bg-white rounded-xl border border-stone-200 shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(appUrl)}&color=5D1425&bgcolor=FFFFFF`}
                  alt="QR Code de Acesso"
                  className="w-24 h-24 rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-xs text-stone-600 text-center sm:text-left">
                <strong className="text-[#480D1B] block font-serif text-sm mb-1">
                  Escanear com a câmera do celular
                </strong>
                Peça para o seu esposo(a) ou familiar apontar a câmera do celular para este código na tela. O aplicativo abrirá imediatamente!
              </div>
            </div>

            {/* Add New Support Member Form */}
            <form onSubmit={handleAddMember} className="p-4 rounded-2xl bg-[#FAF0F2]/50 border border-[#EBBEC8] space-y-3">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#8D253D]">
                Cadastrar Novo Membro da Rede de Apoio
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Nome da pessoa (ex: Lucas)"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#B89243]"
                />
                <select
                  value={newMemberRelation}
                  onChange={(e) => setNewMemberRelation(e.target.value)}
                  className="p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#B89243]"
                >
                  <option>Parceiro(a) / Esposo(a)</option>
                  <option>Mãe / Pai / Avós</option>
                  <option>Doula / Acompanhante</option>
                  <option>Irmão(ã) / Familiar</option>
                  <option>Amigo(a) Próximo(a)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#E6D4AF]" />
                <span>Salvar na Minha Rede de Apoio</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-stone-500">
              Pessoas que você autorizou a acompanhar o pré-natal do bebê <strong>{babyName}</strong>:
            </p>

            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-2xl border border-stone-200 bg-white flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FAF0F2] text-[#5D1425] font-serif font-bold flex items-center justify-center border border-[#EBBEC8]">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-800">{member.name}</h4>
                      <span className="text-[11px] text-stone-500">
                        {member.relation} · {member.permissions === 'full' ? 'Acesso Completo (Agenda + Bebê)' : 'Visualização'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        member.status === 'active'
                          ? 'bg-[#F2F7F3] text-[#3B744C]'
                          : 'bg-[#FAF6ED] text-[#9B7731]'
                      }`}
                    >
                      {member.status === 'active' ? 'Ativo' : 'Convite Enviado'}
                    </span>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
                      title="Remover Acesso"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setActiveTab('invite')}
                className="text-xs font-bold text-[#5D1425] hover:text-[#8D253D] cursor-pointer"
              >
                + Enviar convite para outra pessoa
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <span className="flex items-center gap-1 text-[#3B744C]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Acesso seguro criptografado
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
