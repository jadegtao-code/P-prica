import React, { useState } from 'react';
import { useApp, NavTab } from '../context/AppContext';
import { TEAM_MEMBERS } from '../data/initialData';
import { PapricaLogo, UrbanoLogo } from './Logos';
import { getCalmariaNuance } from '../utils/calmaria';
import {
  LayoutDashboard,
  CalendarClock,
  MessageSquare,
  Compass,
  FileSpreadsheet,
  Building2,
  DollarSign,
  Truck,
  Bookmark,
  FileText,
  FolderGit2,
  Lock,
  ChevronRight,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  X,
  Users,
  Shield,
  Circle,
  Smile,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setCurrentUser,
    currentUserProfile,
    selectedPapricaClientId,
    setSelectedPapricaClientId,
    selectedUrbanoAptId,
    setSelectedUrbanoAptId,
    selectedConsultoriaId,
    setSelectedConsultoriaId,
    calmariaIndex,
    criticalItems,
    setIsCalmariaDrawerOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    papricaClients,
    consultoriaClients,
    urbanoApartments,
    messages,
  } = useApp();

  const [isPapricaExpanded, setIsPapricaExpanded] = useState(true);
  const [isUrbanoExpanded, setIsUrbanoExpanded] = useState(true);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;
  const nuance = getCalmariaNuance(calmariaIndex);

  const navigateToTab = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  const handleSelectPapricaClient = (clientId: string) => {
    setActiveTab('paprica');
    setSelectedPapricaClientId(clientId);
    setIsMobileSidebarOpen(false);
  };

  const handleSelectUrbanoApt = (aptId: string) => {
    setActiveTab('urbano');
    setSelectedUrbanoAptId(aptId);
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#1E1715] text-[#E6DED8] border-r border-[#362924] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Scrollable Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#362924] p-4 space-y-5">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#362924]">
            <button
              type="button"
              onClick={() => navigateToTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="flex items-center gap-1.5">
                <PapricaLogo size="sm" variant="icon" />
                <span className="text-[#8C6D58] font-light text-xs">/</span>
                <UrbanoLogo size="sm" variant="icon" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tracking-tight leading-none group-hover:text-[#D4A373] transition-colors">
                  Páprica + Urbano.s
                </span>
                <span className="text-[10px] text-[#BFA89B] font-medium leading-tight">
                  Sistema Integrado Rio
                </span>
              </div>
            </button>

            {/* Close button on mobile */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1 text-[#BFA89B] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MARCADOR DE CALMARIA COM NUANCES DE CORES & MOOD DA EQUIPE */}
          <div className="space-y-1.5">
            <div
              onClick={() => setIsCalmariaDrawerOpen(true)}
              className={`p-3 rounded-xl border transition-all cursor-pointer shadow-xs ${nuance.bgColor} ${nuance.borderColor} bg-opacity-15 hover:bg-opacity-25`}
              title="Clique para abrir a gaveta de urgências do escritório"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${nuance.dotColor} shrink-0 animate-pulse`} />
                  <span className={`text-xs font-bold ${nuance.textColor} tracking-tight`}>
                    {nuance.label}
                  </span>
                </div>
                <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${nuance.badgeBg}`}>
                  {calmariaIndex}%
                </span>
              </div>

              {/* Visual Progress Bar with Nuance Color */}
              <div className="w-full h-1.5 bg-[#120E0D] rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${nuance.progressBg} transition-all duration-300`}
                  style={{ width: `${calmariaIndex}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#A8988F] mt-1.5">
                <span className="truncate">{nuance.sublabel}</span>
                {criticalItems.length > 0 && (
                  <span className="text-red-400 font-semibold font-mono shrink-0">
                    {criticalItems.length} alerta(s)
                  </span>
                )}
              </div>
            </div>

            {/* ABA AO LADO DE CALMARIA: MOOD DO DIA & DESEMPENHO */}
            <button
              type="button"
              onClick={() => navigateToTab('team_mood')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                activeTab === 'team_mood'
                  ? 'bg-[#722F37] border-[#8A2B37] text-white font-semibold shadow-xs'
                  : 'bg-[#271E1B] border-[#3D2F29] text-[#D8CCC4] hover:text-white hover:bg-[#332723]'
              }`}
              title="Ver Mood do Dia dos Integrantes e Relatório de Desempenho"
            >
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-[#E8B896]" />
                <span className="text-xs">Mood do Dia & Progresso</span>
              </div>
              <div className="flex items-center -space-x-1 text-xs">
                <span title="André">⚡</span>
                <span title="Nath">🎨</span>
                <span title="Manu">🚀</span>
                <span title="Jade">✨</span>
              </div>
            </button>
          </div>

          {/* SETOR 1: VISÃO GERAL */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#B3927A] px-2 py-1">
              Visão Geral
            </div>

            <button
              type="button"
              onClick={() => navigateToTab('dashboard')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#722F37] text-white font-semibold shadow-xs'
                  : 'text-[#C7B7AC] hover:text-white hover:bg-[#2C211D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-[#D8CCC4]" />
                <span>Painel Geral 360°</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigateToTab('deadlines')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'deadlines'
                  ? 'bg-[#722F37] text-white font-semibold shadow-xs'
                  : 'text-[#C7B7AC] hover:text-white hover:bg-[#2C211D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarClock className="w-4 h-4 text-[#D8CCC4]" />
                <span>Prazos e Urgências</span>
              </div>
              {criticalItems.length > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#722F37] text-white font-bold border border-[#8A2B37]">
                  {criticalItems.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigateToTab('messages')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-[#722F37] text-white font-semibold shadow-xs'
                  : 'text-[#C7B7AC] hover:text-white hover:bg-[#2C211D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#D8CCC4]" />
                <span>Mensagens da Equipe</span>
              </div>
              {unreadMessagesCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#722F37] text-white font-bold">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          </div>

          {/* SETOR 2: PÁPRICA ARQUITETURA (Identidade Bordô e Linho) */}
          <div className="pt-2 border-t border-[#362924] space-y-1">
            <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E29B9B]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#963744] inline-block" />
                <span>Páprica Arquitetura</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPapricaExpanded(!isPapricaExpanded)}
                className="text-[#A8988F] hover:text-white p-0.5"
              >
                {isPapricaExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedPapricaClientId(null);
                navigateToTab('paprica');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'paprica' && !selectedPapricaClientId
                  ? 'bg-[#722F37] text-white font-semibold shadow-xs'
                  : 'text-[#D8CCC4] hover:text-white hover:bg-[#2C211D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-[#E29B9B]" />
                <span>Clientes & Projetos</span>
              </div>
              <span className="text-[10px] font-mono text-[#B3927A]">
                {papricaClients.length}
              </span>
            </button>

            {/* Sub-list of active Paprica Clients */}
            {isPapricaExpanded && (
              <div className="pl-6 pr-1 space-y-0.5 border-l border-[#4A2D2A] ml-4 py-1">
                {papricaClients.map((client) => {
                  const isSelected = activeTab === 'paprica' && selectedPapricaClientId === client.id;
                  return (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => handleSelectPapricaClient(client.id)}
                      className={`w-full text-left px-2 py-1.5 rounded text-[11px] truncate flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-[#722F37] text-white font-semibold shadow-xs'
                          : 'text-[#C7B7AC] hover:text-white hover:bg-[#2C211D]'
                      }`}
                      title={`${client.code} - ${client.name}`}
                    >
                      <span className="truncate">{client.name.split(' ')[0]} ({client.code})</span>
                      <span className="text-[9px] font-mono text-[#B3927A] uppercase shrink-0">
                        {client.currentStage === 'executivo' ? 'Exec' : client.currentStage === 'estudo_preliminar' ? '3D' : 'Brief'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setSelectedConsultoriaId(null);
                navigateToTab('consultorias');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'consultorias'
                  ? 'bg-[#722F37] text-white font-semibold shadow-xs'
                  : 'text-[#D8CCC4] hover:text-white hover:bg-[#2C211D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-[#E29B9B]" />
                <span>Consultorias de Ambientes</span>
              </div>
              <span className="text-[10px] font-mono text-[#B3927A]">
                {consultoriaClients.length}
              </span>
            </button>
          </div>

          {/* SETOR 3: URBANO.S TEMPORADA (Identidade Grafite e Verde-Limão) */}
          <div className="pt-2 border-t border-[#362924] space-y-1">
            <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A3E635]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#84CC16] inline-block" />
                <span>Urbano.s Temporada</span>
              </div>
              <button
                type="button"
                onClick={() => setIsUrbanoExpanded(!isUrbanoExpanded)}
                className="text-[#A8988F] hover:text-white p-0.5"
              >
                {isUrbanoExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedUrbanoAptId(null);
                navigateToTab('urbano');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'urbano'
                  ? 'bg-[#2A2318] text-[#A3E635] border border-[#84CC16]/50 font-semibold'
                  : 'text-[#D8CCC4] hover:text-white hover:bg-[#2C211D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-[#A3E635]" />
                <span>Os 10 Apartamentos</span>
              </div>
              <span className="text-[10px] font-mono text-[#A3E635] bg-[#84CC16]/15 px-1.5 py-0.5 rounded">
                10 apts
              </span>
            </button>

            {/* Quick 10 Apartments Sub-list */}
            {isUrbanoExpanded && (
              <div className="pl-6 pr-1 space-y-0.5 border-l border-[#362924] ml-4 py-1">
                {urbanoApartments.map((apt) => {
                  const isSelected = activeTab === 'urbano' && selectedUrbanoAptId === apt.id;
                  return (
                    <button
                      key={apt.id}
                      type="button"
                      onClick={() => handleSelectUrbanoApt(apt.id)}
                      className={`w-full text-left px-2 py-1 rounded text-[11px] truncate flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-[#2A2318] text-[#A3E635] font-semibold'
                          : 'text-[#C7B7AC] hover:text-white hover:bg-[#2C211D]'
                      }`}
                      title={`${apt.code} - ${apt.neighborhood}`}
                    >
                      <span className="truncate">{apt.code}</span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          apt.statusToday === 'ocupado'
                            ? 'bg-emerald-500'
                            : apt.statusToday === 'limpeza_hoje'
                            ? 'bg-amber-400'
                            : 'bg-stone-600'
                        }`}
                        title={apt.statusToday}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* SETOR 4: ADMINISTRAÇÃO & RECURSOS COMPARTILHADOS */}
          <div className="pt-2 border-t border-[#362924] space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#B3927A] px-2 py-1">
              Administração & Base
            </div>

            {/* Financeiro */}
            <button
              type="button"
              onClick={() => navigateToTab('finance')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'finance'
                  ? 'bg-[#722F37] text-white font-semibold shadow-xs'
                  : currentUser !== 'André'
                  ? 'text-[#8A796F] hover:text-[#B3927A] hover:bg-[#2C211D]/40'
                  : 'text-[#D8CCC4] hover:text-white hover:bg-[#2C211D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4 text-[#D8CCC4]" />
                <span>Financeiro & RT</span>
              </div>
              {currentUser !== 'André' && (
                <span title="Acesso exclusivo André">
                  <Lock className="w-3 h-3 text-[#8A796F] shrink-0" />
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigateToTab('suppliers')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'suppliers'
                  ? 'bg-[#722F37] text-white font-semibold shadow-xs'
                  : 'text-[#D8CCC4] hover:text-white hover:bg-[#2C211D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#D8CCC4]" />
                <span>Fornecedores</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigateToTab('sites')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'sites'
                  ? 'bg-[#722F37] text-white font-semibold shadow-xs'
                  : 'text-[#D8CCC4] hover:text-white hover:bg-[#2C211D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-[#D8CCC4]" />
                <span>Sites Sugeridos</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigateToTab('docs')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'docs'
                  ? 'bg-[#722F37] text-white font-semibold shadow-xs'
                  : 'text-[#D8CCC4] hover:text-white hover:bg-[#2C211D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#D8CCC4]" />
                <span>Documentos Base</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigateToTab('tech')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'tech'
                  ? 'bg-[#722F37] text-white font-semibold shadow-xs'
                  : 'text-[#D8CCC4] hover:text-white hover:bg-[#2C211D]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-4 h-4 text-[#D8CCC4]" />
                <span>Arquivos Técnicos (DWG)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-3 border-t border-[#362924] bg-[#16110F] relative">
          <button
            type="button"
            onClick={() => setIsUserSwitcherOpen(!isUserSwitcherOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#2C211D] transition-colors text-left"
            title="Clique para alternar o usuário logado"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                style={{ backgroundColor: currentUserProfile.color }}
              >
                {currentUserProfile.avatarInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                  {currentUser}
                  {currentUser === 'André' && (
                    <Shield className="w-2.5 h-2.5 text-[#B3927A]" />
                  )}
                </div>
                <div className="text-[10px] text-[#A8988F] truncate">
                  {currentUserProfile.role.split('&')[0]}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A8988F] shrink-0" />
          </button>

          {/* User Switcher Popover */}
          {isUserSwitcherOpen && (
            <div
              className="absolute bottom-full left-3 right-3 mb-2 bg-[#221A17] border border-[#44332D] rounded-xl shadow-2xl p-2 z-50 text-xs animate-fadeIn"
              onMouseLeave={() => setIsUserSwitcherOpen(false)}
            >
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#B3927A] border-b border-[#362924] mb-1">
                Alternar Membro da Equipe
              </div>
              {TEAM_MEMBERS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setCurrentUser(m.id);
                    setIsUserSwitcherOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                    currentUser === m.id
                      ? 'bg-[#722F37] text-white font-semibold'
                      : 'text-[#D8CCC4] hover:bg-[#322622]'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.avatarInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs">{m.name}</div>
                    <div className="text-[9px] text-[#A8988F] truncate">{m.focus}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
