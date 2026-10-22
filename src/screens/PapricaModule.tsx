import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PapricaClient, TaskItem } from '../types';
import { TaskRow } from '../components/TaskRow';
import { PapricaLogo } from '../components/Logos';
import {
  Plus,
  ArrowLeft,
  CheckCircle,
  FileText,
  Clock,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Upload,
  AlertCircle,
  Check,
  X,
  Instagram,
  ShoppingBag,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  Unlock,
  Edit2,
  Save,
  Compass,
} from 'lucide-react';

export const PapricaModule: React.FC = () => {
  const {
    papricaClients,
    selectedPapricaClientId,
    setSelectedPapricaClientId,
    togglePapricaTask,
    updatePapricaTask,
    setPapricaApprovalDecision,
    addRevisionTopic,
    updatePapricaClient,
    addNewPapricaClient,
    papricaInfo,
    setPapricaInfo,
    suppliers,
  } = useApp();

  // Internal client navigation
  const [activeSubTab, setActiveSubTab] = useState<
    | 'geral'
    | 'briefing'
    | 'estudo'
    | 'aprovacao'
    | 'executivo'
    | 'fornecedores'
    | 'entregas'
    | 'conteudo'
  >('geral');

  // Search/filter
  const [searchFilter, setSearchFilter] = useState('');
  const [isEditingBrandInfo, setIsEditingBrandInfo] = useState(false);
  const [brandInfoDraft, setBrandInfoDraft] = useState({
    cnpj: papricaInfo.cnpj,
    email: papricaInfo.email,
  });

  // Modal for new client
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientContractVal, setNewClientContractVal] = useState(38000);

  // Modal for editing existing client
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [editClientDraft, setEditClientDraft] = useState({
    name: '',
    address: '',
    neighborhood: '',
    phone: '',
    email: '',
    description: '',
    contractValue: 0,
    paidAmount: 0,
    contractStatus: 'assinado' as 'rascunho' | 'enviado' | 'assinado',
    startDate: '',
    estimatedDeliveryDate: '',
    excelSpreadsheetUrl: '',
  });

  // New revision topic state
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicAssignee, setNewTopicAssignee] = useState('Nath');
  const [newTopicDate, setNewTopicDate] = useState('2026-10-25');

  // Active client
  const activeClient = papricaClients.find((c) => c.id === selectedPapricaClientId);

  const openEditClientModal = () => {
    if (!activeClient) return;
    setEditClientDraft({
      name: activeClient.name,
      address: activeClient.address,
      neighborhood: activeClient.neighborhood,
      phone: activeClient.phone,
      email: activeClient.email,
      description: activeClient.description,
      contractValue: activeClient.contractValue,
      paidAmount: activeClient.paidAmount,
      contractStatus: activeClient.contractStatus,
      startDate: activeClient.startDate,
      estimatedDeliveryDate: activeClient.estimatedDeliveryDate,
      excelSpreadsheetUrl: activeClient.excelSpreadsheetUrl,
    });
    setIsEditClientModalOpen(true);
  };

  const handleSaveEditClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClient) return;
    updatePapricaClient(activeClient.id, editClientDraft);
    setIsEditClientModalOpen(false);
  };

  const handleSaveBrandInfo = () => {
    setPapricaInfo({
      ...papricaInfo,
      cnpj: brandInfoDraft.cnpj,
      email: brandInfoDraft.email,
    });
    setIsEditingBrandInfo(false);
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;
    addNewPapricaClient({
      name: newClientName,
      address: newClientAddress,
      phone: newClientPhone,
      contractValue: Number(newClientContractVal),
    });
    setIsNewClientModalOpen(false);
    setNewClientName('');
    setNewClientAddress('');
    setNewClientPhone('');
  };

  // Calculate client progress %
  const calculateClientProgress = (client: PapricaClient): number => {
    let total = 0;
    let completed = 0;

    // Briefing
    client.briefing.tasks.forEach((t) => {
      total++;
      if (t.completed) completed++;
    });

    // Prelim
    Object.values(client.preliminaryStudy.tasks).forEach((t) => {
      total++;
      if (t.completed) completed++;
    });

    // Revisions
    client.revisions.forEach((rev) => {
      rev.topics.forEach((t) => {
        total++;
        if (t.completed) completed++;
      });
    });

    // Executive
    Object.values(client.executive).forEach((t) => {
      total++;
      if (t.completed) completed++;
    });

    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  // LIST VIEW (if no client selected)
  if (!activeClient) {
    const filteredClients = papricaClients.filter((c) =>
      c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.address.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.code.toLowerCase().includes(searchFilter.toLowerCase())
    );

    return (
      <div className="space-y-6">
        {/* Module Sector Banner: Distinct Burgundy / Red Theme */}
        <div className="bg-gradient-to-r from-[#881337] to-[#991B1B] text-white rounded-xl p-5 shadow-sm border border-red-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <PapricaLogo size="lg" variant="badge" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-300 bg-red-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Módulo de Arquitetura & Interiores
                </span>
                <a
                  href="https://instagram.com/paprica.arquitetura"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-red-100 hover:text-white font-medium flex items-center gap-1 underline"
                >
                  <Instagram className="w-3.5 h-3.5" /> @paprica.arquitetura
                </a>
              </div>

              <h1 className="text-xl font-bold font-sans tracking-tight text-white mt-1">
                Páprica Arquitetura e Interiores
              </h1>

              <p className="text-xs text-red-100/90 mt-0.5">
                {papricaInfo.address} · WhatsApp: {papricaInfo.phone}
              </p>

              {/* Editable CNPJ & Email */}
              <div className="flex items-center gap-3 text-xs text-red-100/90 mt-2 flex-wrap">
                {isEditingBrandInfo ? (
                  <div className="flex items-center gap-2 bg-red-950/80 p-2 rounded border border-red-700">
                    <input
                      type="text"
                      placeholder="CNPJ Páprica"
                      value={brandInfoDraft.cnpj}
                      onChange={(e) => setBrandInfoDraft({ ...brandInfoDraft, cnpj: e.target.value })}
                      className="px-2 py-1 text-xs border border-red-600 rounded bg-white text-stone-900 w-40"
                    />
                    <input
                      type="email"
                      placeholder="E-mail Páprica"
                      value={brandInfoDraft.email}
                      onChange={(e) => setBrandInfoDraft({ ...brandInfoDraft, email: e.target.value })}
                      className="px-2 py-1 text-xs border border-red-600 rounded bg-white text-stone-900 w-52"
                    />
                    <button
                      type="button"
                      onClick={handleSaveBrandInfo}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" /> Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingBrandInfo(false)}
                      className="px-2 py-1 text-xs text-red-200 hover:text-white"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-mono">CNPJ: {papricaInfo.cnpj}</span>
                    <span aria-hidden="true" className="text-red-300">·</span>
                    <span>{papricaInfo.email}</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingBrandInfo(true)}
                      className="text-red-200 hover:text-white p-1"
                      title="Editar CNPJ e E-mail da Páprica"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsNewClientModalOpen(true)}
            className="px-4 py-2 bg-white hover:bg-stone-100 text-red-900 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-red-800" /> Cadastrar Novo Projeto
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Buscar por cliente, código (PAP-01) ou endereço..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full max-w-md px-3 py-2 text-xs border border-red-200 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800"
          />
          <span className="text-xs text-stone-500 font-medium shrink-0">
            {filteredClients.length} projeto(s) ativo(s)
          </span>
        </div>

        {/* Clients Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => {
            const progress = calculateClientProgress(client);
            return (
              <div
                key={client.id}
                className="bg-white rounded-xl border border-stone-200 hover:border-red-700 transition-all shadow-xs hover:shadow-md p-5 flex flex-col justify-between cursor-pointer group"
                onClick={() => setSelectedPapricaClientId(client.id)}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      {client.code}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                        client.currentStage === 'executivo'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : client.currentStage === 'estudo_preliminar'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : client.currentStage === 'entregas'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {client.currentStage.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 group-hover:text-red-900 transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                    {client.address}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-medium text-stone-700">Contrato:</span>
                    <span className="font-mono font-semibold text-stone-800">
                      R$ {client.contractValue.toLocaleString('pt-BR')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{client.contractStatus}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-stone-500 font-medium">Progresso Geral</span>
                    <span className="font-bold font-mono text-red-900">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-800 to-red-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* New Client Modal */}
        {isNewClientModalOpen && (
          <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-red-700" />
                  <h3 className="font-bold text-stone-900 text-sm">Cadastrar Novo Projeto Páprica</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewClientModalOpen(false)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Nome dos Clientes</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Beatriz & Felipe Carvalho"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-lg focus:border-red-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Endereço do Imóvel no Rio</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Av. Atlântica, 1200 - Copacabana, RJ"
                    value={newClientAddress}
                    onChange={(e) => setNewClientAddress(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-lg focus:border-red-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(21) 99999-0000"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-lg focus:border-red-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Valor do Contrato (R$)</label>
                  <input
                    type="number"
                    value={newClientContractVal}
                    onChange={(e) => setNewClientContractVal(Number(e.target.value))}
                    className="w-full p-2 border border-stone-200 rounded-lg focus:border-red-800 outline-none font-mono"
                  />
                </div>
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewClientModalOpen(false)}
                    className="px-3 py-1.5 text-stone-600 hover:text-stone-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg font-medium"
                  >
                    Criar Pasta do Projeto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // CLIENT DETAIL VIEW
  const clientProgress = calculateClientProgress(activeClient);
  const isLayoutApproved = activeClient.approvalDecision === 'aprovado';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back button & Color-Coded Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setSelectedPapricaClientId(null)}
          className="text-xs text-red-900 hover:text-red-950 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-800" /> Voltar aos Clientes Páprica
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded border border-red-200">
            {activeClient.code}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500">Progresso:</span>
            <span className="text-xs font-bold font-mono text-red-900 tabular-nums">
              {clientProgress}%
            </span>
          </div>
        </div>
      </div>

      {/* 6.1 Cabeçalho do Cliente com Visual Páprica */}
      <div className="bg-white rounded-xl border border-red-200 p-5 shadow-xs relative overflow-hidden">
        {/* Subtle accent border at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-800 via-red-600 to-emerald-600" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-red-700 shrink-0" />
                <h2 className="text-xl font-bold text-stone-900 font-sans tracking-tight">
                  {activeClient.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={openEditClientModal}
                className="text-[11px] font-semibold text-red-900 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-md flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                title="Editar informações cadastrais do cliente"
              >
                <Edit2 className="w-3 h-3 text-red-700" />
                <span>Editar Dados do Cliente</span>
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-700" />
                {activeClient.address}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-red-700" />
                {activeClient.phone}
              </span>
              {activeClient.email && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-red-700" />
                    {activeClient.email}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-stone-600 mt-2 max-w-3xl leading-relaxed">
              {activeClient.description}
            </p>
          </div>

          {/* Contract summary */}
          <div className="bg-red-50/50 p-3 rounded-lg border border-red-200 text-xs shrink-0 space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-stone-600 font-medium">Contrato:</span>
              <span className="font-bold font-mono text-red-900">
                R$ {activeClient.contractValue.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-stone-600 font-medium">Status:</span>
              <span className="font-medium text-emerald-800 capitalize bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {activeClient.contractStatus}
              </span>
            </div>
            {activeClient.excelSpreadsheetUrl && (
              <a
                href={activeClient.excelSpreadsheetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-red-800 hover:text-red-950 font-semibold flex items-center gap-1 underline pt-1"
              >
                Planilha Excel de Gastos <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-800 to-red-600 transition-all duration-300"
              style={{ width: `${clientProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Internal Subtabs Styled for Páprica */}
      <div className="flex items-center space-x-1 overflow-x-auto border-b border-stone-200 pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubTab('geral')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'geral' ? 'bg-red-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Visão Geral & Dados
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('briefing')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'briefing' ? 'bg-red-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          6.2 Briefing
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('estudo')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'estudo' ? 'bg-red-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          6.3 Estudo Preliminar & 3D
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('aprovacao')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'aprovacao' ? 'bg-red-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>6.4 Aprovação & Revisões</span>
          {isLayoutApproved && <CheckCircle className="w-3 h-3 text-emerald-400" />}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('executivo')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'executivo'
              ? 'bg-red-900 text-white shadow-xs'
              : !isLayoutApproved
              ? 'text-stone-400 bg-stone-50'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>6.5 Executivo (02-09)</span>
          {!isLayoutApproved ? (
            <Lock className="w-3 h-3 text-stone-400" />
          ) : (
            <Unlock className="w-3 h-3 text-emerald-600" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('fornecedores')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'fornecedores' ? 'bg-red-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          6.7 Fornecedores do Projeto
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('entregas')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'entregas' ? 'bg-red-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          6.8 Controle de Entregas
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('conteudo')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'conteudo' ? 'bg-red-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          6.10 Mídia @paprica.arquitetura
        </button>
      </div>

      {/* SUBTAB 1: VISÃO GERAL */}
      {activeSubTab === 'geral' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-800" /> Serviços Contratados
            </h3>
            <div className="space-y-1 text-xs">
              {activeClient.services.map((srv) => (
                <div key={srv} className="p-2 bg-stone-50 rounded-md border border-stone-100 capitalize font-medium text-stone-700">
                  <span className="text-red-700 font-bold mr-1.5">✓</span>
                  {srv.replace('_', ' ')}
                </div>
              ))}
            </div>
            <div className="pt-2">
              <label className="text-xs text-stone-500 block mb-1">
                Link da Planilha de Gastos (Google Sheets / Excel):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activeClient.excelSpreadsheetUrl}
                  onChange={(e) =>
                    updatePapricaClient(activeClient.id, { excelSpreadsheetUrl: e.target.value })
                  }
                  placeholder="https://docs.google.com/spreadsheets/..."
                  className="flex-1 text-xs p-2 border border-stone-200 rounded-lg outline-none focus:border-red-800"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-800" /> Cronograma de Prazos
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-md bg-stone-50 border border-stone-100">
                <span className="text-stone-500">Data de Início:</span>
                <span className="font-mono font-medium">{activeClient.startDate}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-md bg-stone-50 border border-stone-100">
                <span className="text-stone-500">Previsão Entrega Executivo:</span>
                <span className="font-mono font-bold text-red-800">
                  {activeClient.executiveDelivery.deliveryDate || 'A definir'}
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-md bg-stone-50 border border-stone-100">
                <span className="text-stone-500">Entrega Final da Obra:</span>
                <span className="font-mono font-medium">{activeClient.estimatedDeliveryDate}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6.2 BRIEFING */}
      {activeSubTab === 'briefing' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Formulário de Briefing</h3>
              <p className="text-xs text-stone-500">
                Perfil da família, hábitos de rotina e preferências de acabamentos.
              </p>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                activeClient.briefing.formCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {activeClient.briefing.formCompleted ? 'Preenchido' : 'Em preenchimento'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
              <span className="font-semibold text-stone-700 block mb-1">Perfil da Família & Moradores:</span>
              <p className="text-stone-600 leading-relaxed">{activeClient.briefing.familyProfile || 'Não preenchido.'}</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
              <span className="font-semibold text-stone-700 block mb-1">Investimento / Budget Estimado:</span>
              <p className="text-stone-600 font-mono font-semibold">{activeClient.briefing.budget || 'Não informado.'}</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 md:col-span-2">
              <span className="font-semibold text-stone-700 block mb-1">Preferências de Estilo & Materiais:</span>
              <p className="text-stone-600 leading-relaxed">{activeClient.briefing.stylePreferences || 'Não preenchido.'}</p>
            </div>
          </div>

          {/* Briefing Tasks */}
          <div className="space-y-3 pt-3">
            <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-red-700" /> Tarefas do Briefing
            </h4>
            <div className="space-y-2">
              {activeClient.briefing.tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={() => togglePapricaTask(activeClient.id, 'briefing', task.id)}
                  onUpdate={(updates) =>
                    updatePapricaTask(activeClient.id, 'briefing', task.id, updates)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6.3 ESTUDO PRELIMINAR */}
      {activeSubTab === 'estudo' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-900">
              Estudo Preliminar, Moodboard e 3D
            </h3>
            <p className="text-xs text-stone-500">
              00 Levantamento cadastral, 01 Layout Opção 1, 01 Layout Opção 2 e modelagem 3D fotorrealista.
            </p>
          </div>

          <div className="space-y-3">
            <TaskRow
              task={activeClient.preliminaryStudy.tasks.levantamento}
              onToggle={() =>
                togglePapricaTask(activeClient.id, 'preliminaryStudy', activeClient.preliminaryStudy.tasks.levantamento.id)
              }
              onUpdate={(updates) =>
                updatePapricaTask(activeClient.id, 'preliminaryStudy', activeClient.preliminaryStudy.tasks.levantamento.id, updates)
              }
            />
            <TaskRow
              task={activeClient.preliminaryStudy.tasks.layoutOpcao1}
              onToggle={() =>
                togglePapricaTask(activeClient.id, 'preliminaryStudy', activeClient.preliminaryStudy.tasks.layoutOpcao1.id)
              }
              onUpdate={(updates) =>
                updatePapricaTask(activeClient.id, 'preliminaryStudy', activeClient.preliminaryStudy.tasks.layoutOpcao1.id, updates)
              }
            />
            <TaskRow
              task={activeClient.preliminaryStudy.tasks.layoutOpcao2}
              onToggle={() =>
                togglePapricaTask(activeClient.id, 'preliminaryStudy', activeClient.preliminaryStudy.tasks.layoutOpcao2.id)
              }
              onUpdate={(updates) =>
                updatePapricaTask(activeClient.id, 'preliminaryStudy', activeClient.preliminaryStudy.tasks.layoutOpcao2.id, updates)
              }
            />
            <TaskRow
              task={activeClient.preliminaryStudy.tasks.renders3D}
              onToggle={() =>
                togglePapricaTask(activeClient.id, 'preliminaryStudy', activeClient.preliminaryStudy.tasks.renders3D.id)
              }
              onUpdate={(updates) =>
                updatePapricaTask(activeClient.id, 'preliminaryStudy', activeClient.preliminaryStudy.tasks.renders3D.id, updates)
              }
            />
          </div>
        </div>
      )}

      {/* 6.4 APROVAÇÃO E ALTERAÇÕES */}
      {activeSubTab === 'aprovacao' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-6">
          <div className="border-b border-stone-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Aprovação e Rodadas de Alterações
              </h3>
              <p className="text-xs text-stone-500">
                Ao selecionar "Aprovado", o módulo Executivo (02-09) é liberado automaticamente.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPapricaApprovalDecision(activeClient.id, 'aprovado')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeClient.approvalDecision === 'aprovado'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" /> ✅ APROVADO (Libera Executivo)
              </button>
              <button
                type="button"
                onClick={() => {
                  const reason = prompt('Descreva resumidamente as alterações solicitadas pelo cliente:');
                  if (reason !== null) {
                    setPapricaApprovalDecision(activeClient.id, 'alteracoes', reason);
                  }
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeClient.approvalDecision === 'alteracoes'
                    ? 'bg-red-800 text-white shadow-xs'
                    : 'bg-red-50 text-red-800 border border-red-300 hover:bg-red-100'
                }`}
              >
                <X className="w-4 h-4 stroke-[3]" /> ❌ Mudanças a Executar
              </button>
            </div>
          </div>

          {/* Histórico de rodadas de revisão */}
          {activeClient.revisions.length > 0 ? (
            <div className="space-y-4">
              {activeClient.revisions.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl border border-red-200 bg-red-50/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-red-950">
                      Rodada de Revisão {rev.roundNumber} ({rev.date})
                    </span>
                    <span className="text-[10px] text-stone-500 uppercase font-semibold">
                      {rev.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 italic bg-white p-2.5 rounded-lg border border-red-100">
                    "{rev.clientFeedbackNotes}"
                  </p>

                  <div className="space-y-2">
                    {rev.topics.map((topic) => (
                      <TaskRow
                        key={topic.id}
                        task={topic}
                        onToggle={() =>
                          togglePapricaTask(activeClient.id, 'revisions', topic.id, rev.id)
                        }
                        onUpdate={(updates) =>
                          updatePapricaTask(activeClient.id, 'revisions', topic.id, updates, rev.id)
                        }
                      />
                    ))}
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Novo tópico de alteração..."
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                      className="flex-1 text-xs p-2 border border-stone-200 rounded-lg bg-white outline-none focus:border-red-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTopicTitle) {
                          addRevisionTopic(
                            activeClient.id,
                            rev.roundNumber,
                            newTopicTitle,
                            newTopicAssignee,
                            newTopicDate
                          );
                          setNewTopicTitle('');
                        }
                      }}
                      className="px-3 py-2 bg-red-900 text-white text-xs rounded-lg hover:bg-red-800 font-semibold cursor-pointer"
                    >
                      Adicionar Tópico
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-3">
              Nenhuma rodada de revisão aberta. Projeto aprovado diretamente ou ainda sem revisões pendentes.
            </p>
          )}
        </div>
      )}

      {/* 6.5 EXECUTIVO (02 a 09) */}
      {activeSubTab === 'executivo' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-6">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900">
                  Projeto Executivo Técnico Completo
                </h3>
                {isLayoutApproved ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1 border border-emerald-300">
                    <Unlock className="w-2.5 h-2.5" /> Liberado por aprovação de layout
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-semibold flex items-center gap-1 border border-amber-300">
                    <Lock className="w-2.5 h-2.5" /> Bloqueado até aprovação do layout
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                02 Demolir a 09 Luminotécnica. Cada caderno detalhado com responsável e data.
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="text-stone-400 block text-[10px]">Data de Entrega ao Cliente:</span>
              <span className="font-mono font-bold text-red-800">
                {activeClient.executiveDelivery.deliveryDate || 'A definir'}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <TaskRow
              task={activeClient.executive.demolirConstruir}
              onToggle={() =>
                togglePapricaTask(activeClient.id, 'executive', activeClient.executive.demolirConstruir.id)
              }
              onUpdate={(updates) =>
                updatePapricaTask(activeClient.id, 'executive', activeClient.executive.demolirConstruir.id, updates)
              }
            />
            <TaskRow
              task={activeClient.executive.marcenaria}
              onToggle={() =>
                togglePapricaTask(activeClient.id, 'executive', activeClient.executive.marcenaria.id)
              }
              onUpdate={(updates) =>
                updatePapricaTask(activeClient.id, 'executive', activeClient.executive.marcenaria.id, updates)
              }
            />
            <TaskRow
              task={activeClient.executive.paginacaoRevestimentos}
              onToggle={() =>
                togglePapricaTask(activeClient.id, 'executive', activeClient.executive.paginacaoRevestimentos.id)
              }
              onUpdate={(updates) =>
                updatePapricaTask(activeClient.id, 'executive', activeClient.executive.paginacaoRevestimentos.id, updates)
              }
            />
            <TaskRow
              task={activeClient.executive.marmoraria}
              onToggle={() =>
                togglePapricaTask(activeClient.id, 'executive', activeClient.executive.marmoraria.id)
              }
              onUpdate={(updates) =>
                updatePapricaTask(activeClient.id, 'executive', activeClient.executive.marmoraria.id, updates)
              }
            />
            <TaskRow
              task={activeClient.executive.blindex}
              onToggle={() =>
                togglePapricaTask(activeClient.id, 'executive', activeClient.executive.blindex.id)
              }
              onUpdate={(updates) =>
                updatePapricaTask(activeClient.id, 'executive', activeClient.executive.blindex.id, updates)
              }
            />
            <TaskRow
              task={activeClient.executive.hidraulico}
              onToggle={() =>
                togglePapricaTask(activeClient.id, 'executive', activeClient.executive.hidraulico.id)
              }
              onUpdate={(updates) =>
                updatePapricaTask(activeClient.id, 'executive', activeClient.executive.hidraulico.id, updates)
              }
            />
            <TaskRow
              task={activeClient.executive.eletrico}
              onToggle={() =>
                togglePapricaTask(activeClient.id, 'executive', activeClient.executive.eletrico.id)
              }
              onUpdate={(updates) =>
                updatePapricaTask(activeClient.id, 'executive', activeClient.executive.eletrico.id, updates)
              }
            />
            <TaskRow
              task={activeClient.executive.luminotecnico}
              onToggle={() =>
                togglePapricaTask(activeClient.id, 'executive', activeClient.executive.luminotecnico.id)
              }
              onUpdate={(updates) =>
                updatePapricaTask(activeClient.id, 'executive', activeClient.executive.luminotecnico.id, updates)
              }
            />
          </div>
        </div>
      )}

      {/* 6.7 FORNECEDORES DO PROJETO */}
      {activeSubTab === 'fornecedores' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Fornecedores Vinculados a este Cliente
              </h3>
              <p className="text-xs text-stone-500">
                Cotações, contratos e orçamentos em andamento com parceiros homologados.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {activeClient.suppliers.length > 0 ? (
              activeClient.suppliers.map((sup) => (
                <div
                  key={sup.id}
                  className="p-3 rounded-lg border border-stone-200 hover:border-red-400 transition-colors flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-bold text-stone-900 text-sm block">
                      {sup.supplierName}
                    </span>
                    <span className="text-stone-500">{sup.serviceCategory}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-stone-900 block">
                      R$ {sup.amount.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {sup.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500 py-3">
                Nenhum fornecedor vinculado ainda a este projeto.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 6.8 CONTROLE DE ENTREGAS */}
      {activeSubTab === 'entregas' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Controle de Entregas</h3>
              <p className="text-xs text-stone-500">
                O que foi comprado, fornecedor, prazos de frete, conferência na obra e status.
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            {activeClient.deliveries.length > 0 ? (
              activeClient.deliveries.map((del) => (
                <div
                  key={del.id}
                  className="p-3.5 rounded-lg border border-stone-200 hover:border-red-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <span className="font-bold text-stone-900 text-sm block">
                      {del.item}
                    </span>
                    <span className="text-stone-500">
                      Fornecedor: {del.supplierName} ({del.storeOrBrand})
                    </span>
                    {del.notes && <p className="text-stone-600 mt-1 italic">{del.notes}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-stone-500 text-[11px]">
                      Previsão: <span className="font-mono font-medium text-stone-800">{del.expectedDate}</span>
                    </div>
                    {del.actualDate && (
                      <div className="text-emerald-700 font-semibold text-[11px]">
                        Entregue em: {del.actualDate}
                      </div>
                    )}
                    <span className="mt-1 inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {del.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500 py-3">
                Nenhuma compra em rota de entrega cadastrada.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 6.10 CONTEÚDO DIGITAL INSTAGRAM */}
      {activeSubTab === 'conteudo' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-red-800" />
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Conteúdo Digital @paprica.arquitetura
                </h3>
                <p className="text-xs text-stone-500">
                  Fotos da obra/entrega, antes e depois, material para Instagram e status de publicação.
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-900 font-semibold uppercase font-mono border border-red-200">
              Status: {activeClient.digitalContent.instagramPostStatus}
            </span>
          </div>

          <p className="text-xs text-stone-600">
            {activeClient.digitalContent.notes || 'Carrossel planejado com fotos da marcenaria finalizada.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {activeClient.digitalContent.photos.map((ph) => (
              <div key={ph.id} className="group relative rounded-lg overflow-hidden border border-stone-200 shadow-2xs">
                <img
                  src={ph.url}
                  alt={ph.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover"
                />
                <div className="p-2 bg-white text-[11px] text-stone-600 truncate">
                  {ph.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: EDITAR CLIENTE */}
      {isEditClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-red-900 text-white">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-emerald-300" />
                <h3 className="text-sm font-bold">Editar Dados do Cliente ({activeClient.code})</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditClientModalOpen(false)}
                className="text-red-200 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditClient} className="p-5 flex-1 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={editClientDraft.name}
                  onChange={(e) => setEditClientDraft({ ...editClientDraft, name: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-red-800 bg-stone-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    value={editClientDraft.address}
                    onChange={(e) => setEditClientDraft({ ...editClientDraft, address: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-red-800 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Bairro (Rio de Janeiro)
                  </label>
                  <input
                    type="text"
                    value={editClientDraft.neighborhood}
                    onChange={(e) => setEditClientDraft({ ...editClientDraft, neighborhood: e.target.value })}
                    placeholder="Ex: Copacabana, Ipanema, Leblon"
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-red-800 bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editClientDraft.phone}
                    onChange={(e) => setEditClientDraft({ ...editClientDraft, phone: e.target.value })}
                    placeholder="(21) 9...."
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-red-800 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={editClientDraft.email}
                    onChange={(e) => setEditClientDraft({ ...editClientDraft, email: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-red-800 bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Breve Descrição do Projeto / Escopo
                </label>
                <textarea
                  rows={2}
                  value={editClientDraft.description}
                  onChange={(e) => setEditClientDraft({ ...editClientDraft, description: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-red-800 bg-stone-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Valor Contrato (R$)
                  </label>
                  <input
                    type="number"
                    value={editClientDraft.contractValue}
                    onChange={(e) => setEditClientDraft({ ...editClientDraft, contractValue: Number(e.target.value) })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-red-800 bg-stone-50 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Valor Pago (R$)
                  </label>
                  <input
                    type="number"
                    value={editClientDraft.paidAmount}
                    onChange={(e) => setEditClientDraft({ ...editClientDraft, paidAmount: Number(e.target.value) })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-red-800 bg-stone-50 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Status Contrato
                  </label>
                  <select
                    value={editClientDraft.contractStatus}
                    onChange={(e) => setEditClientDraft({ ...editClientDraft, contractStatus: e.target.value as any })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-red-800 bg-stone-50 focus:bg-white capitalize"
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="enviado">Enviado</option>
                    <option value="assinado">Assinado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={editClientDraft.startDate}
                    onChange={(e) => setEditClientDraft({ ...editClientDraft, startDate: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-red-800 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Previsão Entrega Final
                  </label>
                  <input
                    type="date"
                    value={editClientDraft.estimatedDeliveryDate}
                    onChange={(e) => setEditClientDraft({ ...editClientDraft, estimatedDeliveryDate: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-red-800 bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Planilha de Gastos (Google Sheets / Excel)
                </label>
                <input
                  type="text"
                  value={editClientDraft.excelSpreadsheetUrl}
                  onChange={(e) => setEditClientDraft({ ...editClientDraft, excelSpreadsheetUrl: e.target.value })}
                  placeholder="https://docs.google.com/spreadsheets/..."
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-red-800 bg-stone-50 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditClientModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-900 hover:bg-red-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
