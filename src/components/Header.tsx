import React from 'react';
import { useApp } from '../context/AppContext';
import { getCalmariaNuance } from '../utils/calmaria';
import {
  Menu,
  MessageSquare,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Shield,
  Compass,
  Building2,
  FileSpreadsheet,
  DollarSign,
  CalendarClock,
  Layers,
  Smile,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    selectedPapricaClientId,
    selectedUrbanoAptId,
    selectedConsultoriaId,
    papricaClients,
    urbanoApartments,
    consultoriaClients,
    calmariaIndex,
    criticalItems,
    setIsCalmariaDrawerOpen,
    setIsMobileSidebarOpen,
    messages,
    currentUser,
    currentUserProfile,
    resetToDefaultData,
    setActiveTab,
  } = useApp();

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;
  const nuance = getCalmariaNuance(calmariaIndex);

  // Active client or apartment name
  const activePapricaClient = papricaClients.find((c) => c.id === selectedPapricaClientId);
  const activeUrbanoApt = urbanoApartments.find((a) => a.id === selectedUrbanoAptId);
  const activeConsultoria = consultoriaClients.find((c) => c.id === selectedConsultoriaId);

  // Get color-coded module badge for breadcrumbs
  const getModuleBadge = () => {
    switch (activeTab) {
      case 'paprica':
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#722F37] bg-[#FAF5F5] border border-[#EAD2D6] px-3 py-1 rounded-lg shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#722F37] inline-block" />
            <span>Páprica Arquitetura</span>
            {activePapricaClient && (
              <>
                <ChevronRight className="w-3 h-3 text-[#A8727B]" />
                <span className="text-[#1C1917] font-semibold">{activePapricaClient.code} - {activePapricaClient.name}</span>
              </>
            )}
          </div>
        );
      case 'urbano':
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C1917] bg-[#F2F6EA] border border-[#CFDFB3] px-3 py-1 rounded-lg shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#65A30D] inline-block" />
            <span>Urbano.s Temporada</span>
            {activeUrbanoApt && (
              <>
                <ChevronRight className="w-3 h-3 text-[#634832]" />
                <span className="text-[#1C1917] font-mono font-bold">{activeUrbanoApt.code} ({activeUrbanoApt.neighborhood})</span>
              </>
            )}
          </div>
        );
      case 'consultorias':
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#634832] bg-[#F8F4EE] border border-[#E2D8C9] px-3 py-1 rounded-lg shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#8C6D58] inline-block" />
            <span>Consultorias Páprica</span>
            {activeConsultoria && (
              <>
                <ChevronRight className="w-3 h-3 text-[#8C6D58]" />
                <span className="text-[#1C1917] font-semibold">{activeConsultoria.name}</span>
              </>
            )}
          </div>
        );
      case 'finance':
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#722F37] bg-white border border-[#E2DCD2] px-3 py-1 rounded-lg shadow-2xs">
            <DollarSign className="w-3.5 h-3.5 text-[#722F37]" />
            <span>Financeiro Consolidado</span>
            <span className="text-[10px] text-[#8C6D58] font-mono">(Acesso André)</span>
          </div>
        );
      case 'deadlines':
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C1917] bg-white border border-[#E2DCD2] px-3 py-1 rounded-lg shadow-2xs">
            <CalendarClock className="w-3.5 h-3.5 text-[#634832]" />
            <span>Prazos & Urgências</span>
          </div>
        );
      case 'team_mood':
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#722F37] bg-[#FAF5F5] border border-[#E8CCD1] px-3 py-1 rounded-lg shadow-2xs">
            <Smile className="w-3.5 h-3.5 text-[#722F37]" />
            <span>Mood do Dia & Desempenho da Equipe</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#634832] bg-white border border-[#E2DCD2] px-3 py-1 rounded-lg shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-[#8C6D58]" />
            <span className="capitalize">{activeTab}</span>
          </div>
        );
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E2DCD2] text-[#1C1917]">
      <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left Zone: Hamburger for Mobile + Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-1.5 text-[#634832] hover:text-[#1C1917] rounded-md hover:bg-[#EFECE4]"
            title="Abrir Menu Lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb Module Indicator */}
          <div>{getModuleBadge()}</div>
        </div>

        {/* Right Zone: Mood Button + Calmaria Badge + Messages */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* ABA AO LADO DE CALMARIA: MOOD DO DIA & DESEMPENHO */}
          <button
            type="button"
            onClick={() => setActiveTab('team_mood')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
              activeTab === 'team_mood'
                ? 'bg-[#722F37] text-white border-[#581520] font-bold shadow-xs'
                : 'bg-white text-[#634832] border-[#E2DCD2] hover:border-[#722F37]/50 hover:text-[#722F37]'
            }`}
            title="Acompanhar Mood do Dia dos Integrantes e Desempenho da Equipe"
          >
            <Smile className="w-3.5 h-3.5 text-[#722F37]" />
            <span className="hidden sm:inline">Mood do Dia</span>
            <div className="flex items-center -space-x-1 ml-0.5 text-[11px]">
              <span title="André">⚡</span>
              <span title="Nath">🎨</span>
              <span title="Manu">🚀</span>
              <span title="Jade">✨</span>
            </div>
          </button>

          {/* Calmaria Interactive Trigger with Nuanced Colors */}
          <button
            type="button"
            onClick={() => setIsCalmariaDrawerOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-2xs cursor-pointer ${nuance.badgeBg}`}
            title="Clique para ver o índice de calmaria detalhado"
          >
            <span className={`w-2 h-2 rounded-full ${nuance.dotColor} shrink-0 animate-pulse`} />
            <span className="font-bold font-mono tabular-nums">
              {calmariaIndex}% Calmaria
            </span>
            <span className="hidden sm:inline text-[11px] font-normal opacity-90">
              · {nuance.label}
            </span>
            {criticalItems.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#722F37] text-white font-mono font-bold">
                {criticalItems.length}
              </span>
            )}
          </button>

          {/* Messages button */}
          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            className="relative p-2 text-[#634832] hover:text-[#722F37] hover:bg-[#EFECE4] rounded-lg transition-colors cursor-pointer"
            title="Caixa de Mensagens"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#722F37] animate-pulse" />
            )}
          </button>

          {/* Reset button (demo helper) */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Deseja recarregar os dados de exemplo padrão?')) {
                resetToDefaultData();
              }
            }}
            className="p-2 text-[#8C6D58] hover:text-[#634832] hover:bg-[#EFECE4] rounded-lg transition-colors hidden sm:block"
            title="Restaurar dados padrão de exemplo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Active User Pill in Header */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#E2DCD2]">
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold shadow-xs shrink-0"
              style={{ backgroundColor: currentUserProfile.color }}
            >
              {currentUserProfile.avatarInitials}
            </div>
            <span className="text-xs font-semibold text-[#1C1917] hidden md:inline">
              {currentUser}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
