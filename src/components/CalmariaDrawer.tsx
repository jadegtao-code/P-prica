import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TEAM_MEMBERS } from '../data/initialData';
import { getCalmariaNuance } from '../utils/calmaria';
import {
  X,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const CalmariaDrawer: React.FC = () => {
  const {
    isCalmariaDrawerOpen,
    setIsCalmariaDrawerOpen,
    calmariaIndex,
    criticalItems,
    setActiveTab,
    setSelectedPapricaClientId,
    setSelectedUrbanoAptId,
    setSelectedConsultoriaId,
  } = useApp();

  const [selectedPersonFilter, setSelectedPersonFilter] = useState<string>('todos');

  if (!isCalmariaDrawerOpen) return null;

  const nuance = getCalmariaNuance(calmariaIndex);

  // Filter items
  const filteredItems = criticalItems.filter((item) => {
    if (selectedPersonFilter === 'todos') return true;
    return item.assignee.toLowerCase().includes(selectedPersonFilter.toLowerCase());
  });

  const overdueItems = filteredItems.filter((i) => i.status === 'overdue');
  const attentionItems = filteredItems.filter((i) => i.status === 'attention');

  const handleNavigateToItem = (item: typeof criticalItems[0]) => {
    setIsCalmariaDrawerOpen(false);
    if (item.originType === 'paprica') {
      setActiveTab('paprica');
      setSelectedPapricaClientId(item.originId);
    } else if (item.originType === 'consultoria') {
      setActiveTab('consultorias');
      setSelectedConsultoriaId(item.originId);
    } else if (item.originType === 'urbano') {
      setActiveTab('urbano');
      setSelectedUrbanoAptId(item.originId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calmaria-drawer-title"
      >
        {/* Header with Nuanced Gradient */}
        <div className={`p-5 border-b border-stone-200 ${nuance.bgColor}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center font-bold font-mono text-xl tabular-nums shadow-xs ${nuance.textColor} ${nuance.borderColor} bg-white`}
              >
                <span>{calmariaIndex}%</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="calmaria-drawer-title" className={`text-base font-bold ${nuance.textColor} tracking-tight`}>
                    {nuance.label}
                  </h2>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  {nuance.sublabel}
                </p>
                <div className="text-[11px] text-stone-500 mt-1">
                  {criticalItems.length === 0
                    ? '100% de Calmaria: nenhuma tarefa atrasada ou pendente urgente.'
                    : `${criticalItems.length} pendência(s) afetando o ritmo do escritório.`}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCalmariaDrawerOpen(false)}
              className="p-1.5 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
              aria-label="Fechar gaveta"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scale Legend */}
          <div className="mt-4 pt-3 border-t border-stone-200/70 grid grid-cols-5 gap-1 text-[9px] font-mono text-center">
            <div className={`p-1 rounded ${calmariaIndex >= 90 ? 'bg-emerald-600 text-white font-bold' : 'text-stone-500 bg-white/60'}`}>
              90-100% Plena
            </div>
            <div className={`p-1 rounded ${calmariaIndex >= 75 && calmariaIndex < 90 ? 'bg-teal-600 text-white font-bold' : 'text-stone-500 bg-white/60'}`}>
              75-89% Boa
            </div>
            <div className={`p-1 rounded ${calmariaIndex >= 60 && calmariaIndex < 75 ? 'bg-amber-500 text-white font-bold' : 'text-stone-500 bg-white/60'}`}>
              60-74% Atenção
            </div>
            <div className={`p-1 rounded ${calmariaIndex >= 40 && calmariaIndex < 60 ? 'bg-orange-500 text-white font-bold' : 'text-stone-500 bg-white/60'}`}>
              40-59% Alerta
            </div>
            <div className={`p-1 rounded ${calmariaIndex < 40 ? 'bg-red-600 text-white font-bold' : 'text-stone-500 bg-white/60'}`}>
              &lt;40% Crítico
            </div>
          </div>
        </div>

        {/* Content & Urgencies */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Filter by person */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-[#8C6D58] flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Filtrar:
            </span>
            <button
              type="button"
              onClick={() => setSelectedPersonFilter('todos')}
              className={`px-3 py-1 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                selectedPersonFilter === 'todos'
                  ? 'bg-[#722F37] text-white shadow-2xs font-semibold'
                  : 'bg-[#FAF8F5] border border-[#E2DCD2] text-[#634832] hover:bg-white hover:text-[#1C1917]'
              }`}
            >
              Todos ({criticalItems.length})
            </button>
            {TEAM_MEMBERS.map((member) => {
              const count = criticalItems.filter((i) =>
                i.assignee.toLowerCase().includes(member.name.toLowerCase())
              ).length;
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setSelectedPersonFilter(member.name)}
                  className={`px-3 py-1 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                    selectedPersonFilter === member.name
                      ? 'bg-[#722F37] text-white shadow-2xs font-semibold'
                      : 'bg-[#FAF8F5] border border-[#E2DCD2] text-[#634832] hover:bg-white hover:text-[#1C1917]'
                  }`}
                >
                  {member.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Section: Atrasadas (Overdue) */}
          {overdueItems.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#722F37] uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-[#722F37]" />
                Tarefas Atrasadas ({overdueItems.length})
                <span className="text-[11px] font-normal text-[#8C6D58] normal-case">
                  (-15% no índice)
                </span>
              </div>
              <div className="space-y-2">
                {overdueItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#FAF5F5] border border-[#EAD2D6] rounded-2xl hover:border-[#722F37]/50 transition-colors flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#1C1917] leading-snug">
                        {item.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#634832] mt-1">
                        <span className="font-medium text-[#722F37]">{item.origin}</span>
                        <span aria-hidden="true">·</span>
                        <span>Resp: {item.assignee}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#722F37] font-bold">
                          {Math.abs(item.daysDiff)} dia(s) de atraso
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNavigateToItem(item)}
                      className="shrink-0 px-3 py-1.5 bg-[#722F37] text-white hover:bg-[#581520] rounded-xl transition-colors text-xs flex items-center gap-1 font-semibold shadow-2xs cursor-pointer"
                      title="Ir para o projeto / apartamento"
                    >
                      <span>Resolver</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Atenção (Vencendo em até 3 dias) */}
          {attentionItems.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-600" />
                Atenção: Vence em até 3 dias ({attentionItems.length})
                <span className="text-[11px] font-normal text-[#8C6D58] normal-case">
                  (-5% no índice)
                </span>
              </div>
              <div className="space-y-2">
                {attentionItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#FFFDF5] border border-[#FDE68A] rounded-2xl hover:border-amber-400 transition-colors flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#1C1917] leading-snug">
                        {item.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#634832] mt-1">
                        <span className="font-medium text-[#1C1917]">{item.origin}</span>
                        <span aria-hidden="true">·</span>
                        <span>Resp: {item.assignee}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-800 font-semibold">
                          {item.daysDiff === 0
                            ? 'Vence hoje!'
                            : item.daysDiff === 1
                            ? 'Vence amanhã'
                            : `Vence em ${item.daysDiff} dias`}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNavigateToItem(item)}
                      className="shrink-0 px-3 py-1.5 bg-[#722F37] text-white hover:bg-[#581520] rounded-xl transition-colors text-xs flex items-center gap-1 font-semibold shadow-2xs cursor-pointer"
                      title="Ir para o projeto / apartamento"
                    >
                      <span>Ver</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="p-8 text-center border border-dashed border-stone-200 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-stone-800">100% de Calmaria</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Não há nenhuma pendência urgente para o filtro selecionado. O escritório está tranquilo e em dia!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Páprica Arquitetura + Urbano.s</span>
          <button
            type="button"
            onClick={() => {
              setIsCalmariaDrawerOpen(false);
              setActiveTab('deadlines');
            }}
            className="text-stone-800 hover:text-red-800 font-medium underline flex items-center gap-1"
          >
            Abrir Agenda Completa de Prazos <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
