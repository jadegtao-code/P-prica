import React from 'react';
import { useApp, TODAY } from '../context/AppContext';
import { TaskRow } from '../components/TaskRow';
import { PapricaLogo, UrbanoLogo } from '../components/Logos';
import { getCalmariaNuance } from '../utils/calmaria';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Building,
  Compass,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Building2,
  Clock,
  Layers,
} from 'lucide-react';

export const GeneralDashboard: React.FC = () => {
  const {
    currentUser,
    currentUserProfile,
    calmariaIndex,
    criticalItems,
    setIsCalmariaDrawerOpen,
    papricaClients,
    urbanoApartments,
    messages,
    setActiveTab,
    setSelectedPapricaClientId,
    setSelectedUrbanoAptId,
    togglePapricaTask,
    updatePapricaTask,
    teamMoods,
  } = useApp();

  const nuance = getCalmariaNuance(calmariaIndex);

  // "Minhas Tarefas" for logged-in user
  const myTasks: {
    task: any;
    origin: string;
    clientId: string;
    section: 'briefing' | 'preliminaryStudy' | 'executive' | 'revisions';
    revisionId?: string;
  }[] = [];

  papricaClients.forEach((client) => {
    client.briefing.tasks.forEach((t) => {
      if (t.assignee.toLowerCase().includes(currentUser.toLowerCase()) && !t.completed) {
        myTasks.push({ task: t, origin: `Páprica: ${client.name}`, clientId: client.id, section: 'briefing' });
      }
    });
    Object.values(client.preliminaryStudy.tasks).forEach((t) => {
      if (t.assignee.toLowerCase().includes(currentUser.toLowerCase()) && !t.completed) {
        myTasks.push({ task: t, origin: `Páprica: ${client.name}`, clientId: client.id, section: 'preliminaryStudy' });
      }
    });
    client.revisions.forEach((rev) => {
      rev.topics.forEach((t) => {
        if (t.assignee.toLowerCase().includes(currentUser.toLowerCase()) && !t.completed) {
          myTasks.push({ task: t, origin: `Páprica: ${client.name} (Rev ${rev.roundNumber})`, clientId: client.id, section: 'revisions', revisionId: rev.id });
        }
      });
    });
    Object.values(client.executive).forEach((t) => {
      if (t.assignee.toLowerCase().includes(currentUser.toLowerCase()) && !t.completed) {
        myTasks.push({ task: t, origin: `Páprica: ${client.name} (Executivo)`, clientId: client.id, section: 'executive' });
      }
    });
  });

  // Urbano status counts
  const totalApartments = urbanoApartments.length;
  const occupiedCount = urbanoApartments.filter((a) => a.statusToday === 'ocupado').length;
  const cleaningCount = urbanoApartments.filter((a) => a.statusToday === 'limpeza_hoje').length;
  const freeCount = urbanoApartments.filter((a) => a.statusToday === 'livre').length;

  // Páprica stages count
  const stageCounts = {
    briefing: papricaClients.filter((c) => c.currentStage === 'briefing').length,
    estudo_preliminar: papricaClients.filter((c) => c.currentStage === 'estudo_preliminar').length,
    aprovacao: papricaClients.filter((c) => c.currentStage === 'aprovacao').length,
    executivo: papricaClients.filter((c) => c.currentStage === 'executivo').length,
    fornecedores: papricaClients.filter((c) => c.currentStage === 'fornecedores').length,
    entregas: papricaClients.filter((c) => c.currentStage === 'entregas').length,
  };

  // Next 7 days deadlines
  const upcomingDeadlines = criticalItems.filter((i) => i.daysDiff >= 0 && i.daysDiff <= 7);

  return (
    <div className="space-y-6">
      {/* Top Banner: User Welcome + Nuanced Calmaria Monitor + Mood do Dia */}
      <div className="bg-white rounded-2xl border border-[#E2DCD2] p-5 shadow-[0_2px_12px_rgba(45,30,24,0.03)] flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1C1917] tracking-tight">
              Olá, {currentUser}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF5F5] text-[#722F37] font-semibold border border-[#EAD2D6]">
              {currentUserProfile.focus}
            </span>
          </div>
          <p className="text-xs text-[#634832] mt-1">
            Painel Geral Unificado com operações setorizadas por empresa · Rio de Janeiro
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Nuanced Calmaria Interactive Card */}
          <button
            type="button"
            onClick={() => setIsCalmariaDrawerOpen(true)}
            className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all text-left cursor-pointer shadow-2xs ${nuance.bgColor} ${nuance.borderColor} hover:shadow-md`}
          >
            <div
              className={`w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center font-bold font-mono text-lg tabular-nums shadow-xs ${nuance.textColor} ${nuance.borderColor} bg-white`}
            >
              <span>{calmariaIndex}%</span>
            </div>
            <div>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${nuance.textColor}`}>
                <span className={`w-2 h-2 rounded-full ${nuance.dotColor} animate-pulse`} />
                {nuance.label}
              </div>
              <div className="text-[11px] text-[#634832] mt-0.5">
                {criticalItems.length === 0
                  ? 'Escritório tranquilo'
                  : `${criticalItems.length} urgência(s)`}
              </div>
              <div className="text-[10px] font-bold mt-0.5 underline text-[#722F37]">
                Ver Calmaria →
              </div>
            </div>
          </button>

          {/* Direct link to Team Mood & Performance Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('team_mood')}
            className="flex items-center gap-3 p-3 rounded-xl border border-[#E8CCD1] bg-[#FAF5F5] hover:bg-[#F5ECEE] transition-all text-left cursor-pointer shadow-2xs group"
          >
            <div className="flex -space-x-1.5">
              {teamMoods.map((m) => (
                <span
                  key={m.member}
                  title={`${m.member}: ${m.label}`}
                  className="w-7 h-7 rounded-full bg-white border border-[#E8CCD1] shadow-2xs flex items-center justify-center text-xs text-[#1C1917]"
                >
                  {m.emoji}
                </span>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#722F37] group-hover:text-[#50131B]">
                <span>Mood do Dia & Ranking</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#722F37] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] text-[#634832]">
                Desempenho: dia, semana e mês
              </div>
              <div className="text-[10px] font-semibold text-[#722F37] underline mt-0.5">
                Ver todos os integrantes
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* QUICK MOOD DO DIA CARDS (ANDRÉ, NATH, MANU, JADE) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {teamMoods.map((m) => (
          <div
            key={m.member}
            onClick={() => setActiveTab('team_mood')}
            className="bg-white rounded-xl border border-[#E2DCD2] p-3.5 shadow-2xs hover:border-[#722F37]/40 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#1C1917] group-hover:text-[#722F37] transition-colors">
                {m.member}
              </span>
              <span className="text-base px-1.5 py-0.5 rounded-lg bg-[#F5F2EB] group-hover:scale-110 transition-transform">
                {m.emoji}
              </span>
            </div>
            <div className="text-[11px] font-semibold text-[#634832] flex items-center gap-1">
              <span>{m.label}</span>
              <span className="text-[10px] text-amber-600 font-bold ml-auto">
                ⚡ {m.energyLevel}/5
              </span>
            </div>
            <p className="text-[10px] text-[#8C6D58] mt-1 line-clamp-1 italic">
              "{m.dailyFocus}"
            </p>
          </div>
        ))}
      </div>

      {/* 2 DISTINCT COMPANY SHOWCASES (PÁPRICA & URBANO.S STRICTLY SECTORIZED) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTOR 1: PÁPRICA ARQUITETURA */}
        <div className="bg-white rounded-2xl border border-[#E5D7D9] shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 bg-[#722F37] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <PapricaLogo size="sm" variant="badge" />
              <div>
                <h3 className="font-bold text-sm leading-tight text-white">
                  Páprica Arquitetura e Interiores
                </h3>
                <span className="text-[10px] text-[#F3D5D9]">
                  {papricaClients.length} projetos residenciais ativos no RJ
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('paprica')}
              className="text-xs bg-white text-[#722F37] font-bold px-3 py-1.5 rounded-lg hover:bg-[#FAF5F5] flex items-center gap-1 transition-colors shadow-2xs"
            >
              Módulo Páprica <ArrowRight className="w-3 h-3 text-[#722F37]" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#722F37] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#722F37]" /> Fases Atuais dos Clientes Páprica
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF5F5] border border-[#EAD2D6]">
                <span className="text-[#634832] block text-[11px]">01. Briefing</span>
                <span className="font-mono font-bold text-base text-[#722F37]">{stageCounts.briefing}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF5F5] border border-[#EAD2D6]">
                <span className="text-[#634832] block text-[11px]">02. Estudo & 3D</span>
                <span className="font-mono font-bold text-base text-[#722F37]">{stageCounts.estudo_preliminar}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF5F5] border border-[#EAD2D6]">
                <span className="text-[#634832] block text-[11px]">03. Em Aprovação</span>
                <span className="font-mono font-bold text-base text-[#722F37]">{stageCounts.aprovacao}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF5F5] border border-[#EAD2D6]">
                <span className="text-[#634832] block text-[11px]">04. Executivo (02-09)</span>
                <span className="font-mono font-bold text-base text-[#722F37]">{stageCounts.executivo}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF5F5] border border-[#EAD2D6] col-span-2">
                <span className="text-[#634832] block text-[11px]">05. Fornecedores & Entregas</span>
                <span className="font-mono font-bold text-base text-[#722F37]">
                  {stageCounts.fornecedores + stageCounts.entregas} em produção/obra
                </span>
              </div>
            </div>

            {/* Quick links to active clients */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[11px] font-semibold text-[#634832]">Projetos em andamento:</div>
              {papricaClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => {
                    setActiveTab('paprica');
                    setSelectedPapricaClientId(client.id);
                  }}
                  className="w-full text-left p-2 rounded-xl border border-[#E8DFD5] hover:border-[#722F37]/50 hover:bg-[#FAF5F5] flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#722F37]">{client.code}</span>
                    <span className="font-medium text-[#1C1917]">{client.name}</span>
                  </div>
                  <span className="text-[10px] text-[#634832] capitalize">{client.currentStage.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTOR 2: URBANO.S TEMPORADA */}
        <div className="bg-white rounded-2xl border border-[#3D2D24] shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 bg-[#221A17] text-white flex items-center justify-between border-b border-[#3D2D24]">
            <div className="flex items-center gap-2.5">
              <UrbanoLogo size="sm" variant="badge" />
              <div>
                <h3 className="font-bold text-sm leading-tight text-white flex items-center gap-1.5">
                  URBANO.S Apartamentos
                  <span className="text-[10px] text-[#84CC16] font-mono font-bold">10 APTS</span>
                </h3>
                <span className="text-[10px] text-stone-300">
                  Gestão de imóveis por temporada no Rio de Janeiro
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('urbano')}
              className="text-xs bg-[#84CC16] text-[#1A1917] font-bold px-3 py-1.5 rounded-lg hover:bg-[#9AE625] flex items-center gap-1 transition-colors shadow-2xs"
            >
              Módulo Urbano.s <ArrowRight className="w-3 h-3 text-[#1A1917]" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#84CC16]" /> Status dos Imóveis Hoje
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-[#F4F9EC] border border-[#D5E8B8]">
                <div className="text-lg font-bold font-mono text-[#3F6212] tabular-nums">
                  {occupiedCount}
                </div>
                <div className="text-[10px] uppercase font-semibold text-[#4D7C0F]">
                  Ocupados
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]">
                <div className="text-lg font-bold font-mono text-[#92400E] tabular-nums">
                  {cleaningCount}
                </div>
                <div className="text-[10px] uppercase font-semibold text-[#B45309]">
                  Faxina Hoje
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F2EB] border border-[#E2DCD2]">
                <div className="text-lg font-bold font-mono text-[#1C1917] tabular-nums">
                  {freeCount}
                </div>
                <div className="text-[10px] uppercase font-semibold text-[#634832]">
                  Disponíveis
                </div>
              </div>
            </div>

            {/* Quick apartment pills */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[11px] font-semibold text-[#634832]">Apartamentos em destaque:</div>
              {urbanoApartments.slice(0, 3).map((apt) => (
                <button
                  key={apt.id}
                  type="button"
                  onClick={() => {
                    setActiveTab('urbano');
                    setSelectedUrbanoAptId(apt.id);
                  }}
                  className="w-full text-left p-2 rounded-xl border border-[#E2DCD2] hover:border-[#84CC16] hover:bg-[#FBFDF8] flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1C1917]">{apt.code}</span>
                    <span className="text-[11px] text-[#634832]">({apt.neighborhood})</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      apt.statusToday === 'ocupado'
                        ? 'bg-[#EAF3DE] text-[#3F6212]'
                        : apt.statusToday === 'limpeza_hoje'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-[#EFECE4] text-[#634832]'
                    }`}
                  >
                    {apt.statusToday === 'ocupado'
                      ? 'Ocupado'
                      : apt.statusToday === 'limpeza_hoje'
                      ? 'Faxina'
                      : 'Livre'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: MY TASKS & PRÓXIMOS PRAZOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): My Tasks */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2DCD2] p-5 shadow-[0_2px_12px_rgba(45,30,24,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFECE4] pb-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#722F37]" />
              <h2 className="text-sm font-bold text-[#1C1917]">
                Minhas Tarefas Atribuídas ({currentUser})
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#722F37] bg-[#FAF5F5] border border-[#EAD2D6] px-2.5 py-0.5 rounded-full">
              {myTasks.length} pendente(s)
            </span>
          </div>

          {myTasks.length > 0 ? (
            <div className="space-y-2.5">
              {myTasks.map((item) => (
                <div key={item.task.id} className="space-y-1">
                  <div className="text-[11px] font-semibold text-[#634832] px-1">
                    {item.origin}
                  </div>
                  <TaskRow
                    task={item.task}
                    onToggle={() =>
                      togglePapricaTask(
                        item.clientId,
                        item.section,
                        item.task.id,
                        item.revisionId
                      )
                    }
                    onUpdate={(updates) =>
                      updatePapricaTask(
                        item.clientId,
                        item.section,
                        item.task.id,
                        updates,
                        item.revisionId
                      )
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center border border-dashed border-[#DDD5C7] rounded-xl bg-[#FAF8F5]">
              <CheckCircle2 className="w-8 h-8 text-[#3F6212] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#1C1917]">
                Tudo em dia para {currentUser}!
              </p>
              <p className="text-[11px] text-[#634832] mt-0.5">
                Nenhuma tarefa pendente sob sua responsabilidade neste momento.
              </p>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Deadlines next 7 days */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2DCD2] p-5 shadow-[0_2px_12px_rgba(45,30,24,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFECE4] pb-2.5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#722F37]" />
              <h2 className="text-sm font-bold text-[#1C1917]">
                Próximos 7 Dias (Grupo)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('deadlines')}
              className="text-xs text-[#722F37] hover:text-[#50131B] font-semibold flex items-center gap-1 transition-colors"
            >
              Agenda Completa <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-2">
              {upcomingDeadlines.map((dl) => (
                <div
                  key={dl.id}
                  className="p-3 rounded-xl border border-[#EFECE4] hover:border-[#722F37]/40 hover:bg-[#FAF8F5] transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#1C1917] truncate">
                      {dl.title}
                    </div>
                    <div className="text-[11px] text-[#634832] flex items-center gap-2 mt-0.5">
                      <span className="font-medium text-[#722F37]">{dl.origin}</span>
                      <span aria-hidden="true">·</span>
                      <span>Resp: {dl.assignee}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold font-mono text-[#722F37]">
                      {dl.daysDiff === 0
                        ? 'Hoje'
                        : dl.daysDiff === 1
                        ? 'Amanhã'
                        : `Em ${dl.daysDiff} dias`}
                    </span>
                    <div className="text-[10px] text-[#8C6D58]">
                      {new Date(dl.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#634832] text-center py-6">
              Nenhuma urgência crítica vencendo na próxima semana.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
