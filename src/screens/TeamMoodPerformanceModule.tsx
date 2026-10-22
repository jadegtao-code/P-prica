import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TeamMember, TeamMoodType, MemberDailyMood } from '../types';
import { getCalmariaNuance } from '../utils/calmaria';
import {
  Smile,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Sparkles,
  BarChart3,
  Layers,
  ArrowUpRight,
  Battery,
  Edit3,
  Check,
  X,
  Users,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export const TeamMoodPerformanceModule: React.FC = () => {
  const {
    currentUser,
    teamMoods,
    updateMemberMood,
    papricaClients,
    urbanoApartments,
    consultoriaClients,
    calmariaIndex,
    currentUserProfile,
  } = useApp();

  const [period, setPeriod] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [sortCriteria, setSortCriteria] = useState<'score' | 'completed' | 'punctuality' | 'volume'>('score');

  // Mood editor modal for current user or selected member
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedMood, setSelectedMood] = useState<TeamMoodType>('focado');
  const [customFocus, setCustomFocus] = useState('');
  const [customEnergy, setCustomEnergy] = useState<number>(5);

  const nuance = getCalmariaNuance(calmariaIndex);

  // Available mood options
  const moodPresets: {
    type: TeamMoodType;
    emoji: string;
    label: string;
    color: string;
    bg: string;
    border: string;
    description: string;
  }[] = [
    {
      type: 'focado',
      emoji: '⚡',
      label: 'Focado(a) & Estratégico(a)',
      color: 'text-amber-300',
      bg: 'bg-amber-950/60',
      border: 'border-amber-600/60',
      description: 'Avançando em tarefas complexas e processos críticos sem distrações.',
    },
    {
      type: 'inspirado',
      emoji: '🎨',
      label: 'Criativo(a) & Inspirado(a)',
      color: 'text-purple-300',
      bg: 'bg-purple-950/60',
      border: 'border-purple-600/60',
      description: 'Excelente para concepção de layout, moodboards, 3D e materiais.',
    },
    {
      type: 'produtivo',
      emoji: '🚀',
      label: 'Produtivo(a) & Ágil',
      color: 'text-emerald-300',
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-600/60',
      description: 'Alto volume de entregas, checks realizados e processos liberados.',
    },
    {
      type: 'calmo',
      emoji: '🌿',
      label: 'Calmo(a) & Fluído(a)',
      color: 'text-teal-300',
      bg: 'bg-teal-950/60',
      border: 'border-teal-600/60',
      description: 'Trabalho em ritmo cadenciado, conferências e revisões minuciosas.',
    },
    {
      type: 'cansado',
      emoji: '☕',
      label: 'Em Ritmo Moderado (Cansaço)',
      color: 'text-stone-300',
      bg: 'bg-stone-800/80',
      border: 'border-stone-600',
      description: 'Priorizando tarefas essenciais e recarregando energias.',
    },
    {
      type: 'sobrecarregado',
      emoji: '⚠️',
      label: 'Sobrecarga / Alerta',
      color: 'text-red-300',
      bg: 'bg-red-950/80',
      border: 'border-red-600',
      description: 'Muitos prazos simultâneos; sinalizando necessidade de apoio da equipe.',
    },
  ];

  // Open mood editor
  const handleOpenMoodEditor = (member: TeamMember) => {
    const current = teamMoods.find((m) => m.member === member);
    if (current) {
      setSelectedMood(current.mood);
      setCustomFocus(current.dailyFocus);
      setCustomEnergy(current.energyLevel);
    }
    setEditingMember(member);
  };

  const handleSaveMood = () => {
    if (!editingMember) return;
    const preset = moodPresets.find((p) => p.type === selectedMood);
    updateMemberMood(editingMember, {
      mood: selectedMood,
      emoji: preset?.emoji || '⚡',
      label: preset?.label || 'Focado',
      dailyFocus: customFocus.trim() || 'Em atividades diárias da empresa',
      energyLevel: customEnergy,
    });
    setEditingMember(null);
  };

  // Compile tasks per team member across the whole company
  const teamStats = useMemo(() => {
    const members: TeamMember[] = ['André', 'Nath', 'Manu', 'Jade'];

    return members.map((member) => {
      let totalTasks = 0;
      let completedTasks = 0;
      let onTimeTasks = 0;
      let attentionTasks = 0;
      let overdueTasks = 0;

      const sectorDistribution = {
        paprica: 0,
        urbano: 0,
        consultorias: 0,
        admin: 0,
      };

      // 1. Scan Páprica tasks
      papricaClients.forEach((client) => {
        // Briefing
        client.briefing.tasks.forEach((t) => {
          if (t.assignee === member || t.completedBy === member) {
            totalTasks++;
            sectorDistribution.paprica++;
            if (t.completed) completedTasks++;
          }
        });

        // Preliminary study
        const prelim = client.preliminaryStudy.tasks;
        [prelim.levantamento, prelim.layoutOpcao1, prelim.layoutOpcao2, prelim.renders3D].forEach(
          (t) => {
            if (t.assignee === member || t.completedBy === member) {
              totalTasks++;
              sectorDistribution.paprica++;
              if (t.completed) completedTasks++;
            }
          }
        );

        // Revisions
        client.revisions.forEach((rev) => {
          rev.topics.forEach((t) => {
            if (t.assignee === member || t.completedBy === member) {
              totalTasks++;
              sectorDistribution.paprica++;
              if (t.completed) completedTasks++;
            }
          });
        });

        // Executive
        const exec = client.executive;
        [
          exec.demolirConstruir,
          exec.marcenaria,
          exec.paginacaoRevestimentos,
          exec.marmoraria,
          exec.blindex,
          exec.hidraulico,
          exec.eletrico,
          exec.luminotecnico,
        ].forEach((t) => {
          if (t.assignee === member || t.completedBy === member) {
            totalTasks++;
            sectorDistribution.paprica++;
            if (t.completed) {
              completedTasks++;
            } else {
              // Due date check
              const diff = (new Date(t.dueDate).getTime() - new Date('2026-10-21').getTime()) / (1000 * 3600 * 24);
              if (diff < 0) overdueTasks++;
              else if (diff <= 3) attentionTasks++;
              else onTimeTasks++;
            }
          }
        });
      });

      // 2. Scan Consultorias
      consultoriaClients.forEach((client) => {
        client.tasks.forEach((t) => {
          if (t.assignee === member || t.completedBy === member) {
            totalTasks++;
            sectorDistribution.consultorias++;
            if (t.completed) completedTasks++;
          }
        });
      });

      // 3. Scan Urbano.s
      urbanoApartments.forEach((apt) => {
        apt.pantry.forEach((p) => {
          if (p.responsible === member) {
            totalTasks++;
            sectorDistribution.urbano++;
            if (p.restocked) completedTasks++;
          }
        });

        // Cleanings and reservations screening
        apt.cleanings.forEach((c) => {
          if (member === 'André' || member === 'Manu') {
            totalTasks++;
            sectorDistribution.urbano++;
            if (c.completed) completedTasks++;
          }
        });

        apt.reservations.forEach((r) => {
          if (r.reviewedBy === member) {
            totalTasks++;
            sectorDistribution.urbano++;
            completedTasks++;
          }
        });
      });

      // Period Multipliers to simulate Day, Week, and Month dynamically
      let periodMultiplier = 1;
      let completedInPeriod = completedTasks;
      let totalInPeriod = totalTasks;

      if (period === 'dia') {
        // Today's snapshot
        periodMultiplier = 0.25;
        totalInPeriod = Math.max(3, Math.round(totalTasks * 0.3));
        completedInPeriod = Math.max(1, Math.round(completedTasks * 0.35));
      } else if (period === 'semana') {
        // Weekly window
        periodMultiplier = 0.7;
        totalInPeriod = Math.max(8, Math.round(totalTasks * 0.75));
        completedInPeriod = Math.max(5, Math.round(completedTasks * 0.7));
      } else {
        // Month view
        periodMultiplier = 1.0;
        totalInPeriod = totalTasks;
        completedInPeriod = completedTasks;
      }

      const pendingTasks = Math.max(0, totalInPeriod - completedInPeriod);
      const completionRate = totalInPeriod > 0 ? Math.round((completedInPeriod / totalInPeriod) * 100) : 0;
      const punctualityRate = Math.max(65, 100 - overdueTasks * 10 - attentionTasks * 4);

      // Score 0-100
      const score = Math.min(
        100,
        Math.round(completionRate * 0.55 + punctualityRate * 0.35 + Math.min(completedInPeriod, 10) * 1)
      );

      // Mood data
      const moodInfo = teamMoods.find((m) => m.member === member) || {
        member,
        mood: 'focado' as TeamMoodType,
        emoji: '⚡',
        label: 'Focado',
        energyLevel: 5,
        dailyFocus: 'Executando demandas do dia',
        updatedAt: '09:00',
      };

      // Role and special badge
      let roleLabel = '';
      let highlightTitle = '';
      if (member === 'André') {
        roleLabel = 'Sócio & Gestor Administrativo';
        highlightTitle = 'Líder Financeiro & Urbano.s';
      } else if (member === 'Nath') {
        roleLabel = 'Sócia & Arquiteta Titular';
        highlightTitle = 'Líder Criativa & Projetos';
      } else if (member === 'Manu') {
        roleLabel = 'Estagiária Administrativa';
        highlightTitle = 'Ágil em Operações & Hóspedes';
      } else {
        roleLabel = 'Estagiária de Arquitetura';
        highlightTitle = 'Excelência em Renders & Executivo';
      }

      return {
        member,
        roleLabel,
        highlightTitle,
        moodInfo,
        totalInPeriod,
        completedInPeriod,
        pendingTasks,
        completionRate,
        punctualityRate,
        score,
        sectorDistribution,
      };
    });
  }, [period, papricaClients, consultoriaClients, urbanoApartments, teamMoods]);

  // Automated sorting based on user's selected criteria
  const sortedTeam = useMemo(() => {
    return [...teamStats].sort((a, b) => {
      if (sortCriteria === 'score') return b.score - a.score;
      if (sortCriteria === 'completed') return b.completedInPeriod - a.completedInPeriod;
      if (sortCriteria === 'punctuality') return b.punctualityRate - a.punctualityRate;
      if (sortCriteria === 'volume') return b.totalInPeriod - a.totalInPeriod;
      return 0;
    });
  }, [teamStats, sortCriteria]);

  // Ranking icons
  const getRankBadge = (index: number) => {
    if (index === 0)
      return {
        label: '1º Lugar',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        medal: '🥇',
        title: 'Destaque do Período',
      };
    if (index === 1)
      return {
        label: '2º Lugar',
        badge: 'bg-slate-300/20 text-slate-200 border-slate-300/40',
        medal: '🥈',
        title: 'Alto Desempenho',
      };
    if (index === 2)
      return {
        label: '3º Lugar',
        badge: 'bg-amber-700/20 text-amber-200 border-amber-700/40',
        medal: '🥉',
        title: 'Ritmo Consistente',
      };
    return {
      label: '4º Lugar',
      badge: 'bg-stone-500/20 text-stone-300 border-stone-500/40',
      medal: '🎖️',
      title: 'Em Evolução',
    };
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Calmaria Connection and Elegant Bordeaux Hero */}
      <div className="bg-[#722F37] rounded-2xl border border-[#581520] p-6 shadow-sm text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-2 bg-white/10 border border-white/20 rounded-xl text-white">
                <Smile className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold font-sans tracking-tight text-white">
                Mood do Dia & Desempenho da Equipe
              </h1>
              <span className="text-[11px] font-semibold font-mono px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/25 flex items-center gap-1">
                <Users className="w-3 h-3" /> Transparência Total · Acesso Geral
              </span>
            </div>
            <p className="text-xs text-[#F5D8DC] max-w-2xl leading-relaxed">
              Acompanhe a energia diária, prioridades em mãos e relatórios gráficos de entregas de
              cada integrante. Todos têm acesso ao progresso para alinhamento e suporte mútuo no escritório.
            </p>
          </div>

          {/* Calmaria Nuance Quick Meter */}
          <div
            className="p-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xs flex items-center gap-4 shadow-2xs"
          >
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#F5D8DC] flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${nuance.dotColor} animate-pulse`} />
                <span>Índice de Calmaria</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-white">
                  {calmariaIndex}%
                </span>
                <span className="text-xs font-semibold text-[#FBEAEC]">{nuance.label}</span>
              </div>
              <p className="text-[11px] text-[#F5D8DC] max-w-[210px] leading-tight">
                {nuance.sublabel}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Módulos de Cada Integrante Apresentando o Mood do Dia */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#722F37]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1C1917]">
              Mood do Dia dos Integrantes
            </h2>
          </div>
          <span className="text-xs text-[#634832]">
            Logado como: <strong className="text-[#1C1917] font-bold">{currentUser}</strong> (clique em "Editar meu Mood" para atualizar)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMoods.map((m) => {
            const isMe = m.member === currentUser;
            const stats = teamStats.find((s) => s.member === m.member);
            const preset = moodPresets.find((p) => p.type === m.mood) || moodPresets[0];

            return (
              <div
                key={m.member}
                className={`rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between bg-white shadow-2xs ${
                  isMe
                    ? 'border-[#722F37] ring-2 ring-[#722F37]/20 shadow-xs'
                    : 'border-[#E2DCD2] hover:border-[#722F37]/40 hover:shadow-xs'
                }`}
              >
                {/* Accent top gradient */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    m.member === 'Nath'
                      ? 'bg-[#722F37]'
                      : m.member === 'André'
                      ? 'bg-[#221A17]'
                      : m.member === 'Manu'
                      ? 'bg-[#84CC16]'
                      : 'bg-[#B45309]'
                  }`}
                />

                <div className="space-y-3">
                  {/* Member Name and Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                          m.member === 'Nath'
                            ? 'bg-[#722F37]'
                            : m.member === 'André'
                            ? 'bg-[#221A17]'
                            : m.member === 'Manu'
                            ? 'bg-[#4D7C0F]'
                            : 'bg-[#B45309]'
                        }`}
                      >
                        {m.member.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm text-[#1C1917]">{m.member}</h3>
                          {isMe && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#FAF5F5] text-[#722F37] border border-[#EAD2D6]">
                              Você
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#634832] line-clamp-1">{stats?.roleLabel}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenMoodEditor(m.member)}
                      className="p-1.5 rounded-lg text-[#634832] hover:text-[#722F37] hover:bg-[#FAF5F5] transition-colors cursor-pointer"
                      title={`Atualizar mood de ${m.member}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Mood Card Badge */}
                  <div className="p-3 rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl" role="img" aria-label={m.label}>
                          {m.emoji}
                        </span>
                        <span className="text-xs font-bold text-[#1C1917]">{m.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#8C6D58]">{m.updatedAt}</span>
                    </div>

                    {/* Energy Bar */}
                    <div className="flex items-center justify-between text-[10px] text-[#634832] pt-1">
                      <span className="flex items-center gap-1">
                        <Battery className="w-3 h-3 text-amber-600" />
                        Nível de Energia:
                      </span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <span
                            key={lvl}
                            className={`w-2.5 h-1.5 rounded-xs ${
                              lvl <= m.energyLevel ? 'bg-amber-500' : 'bg-[#E2DCD2]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Daily Focus Text */}
                  <div className="bg-[#FAF5F5] p-3 rounded-xl border border-[#EAD2D6] text-xs">
                    <span className="text-[10px] font-bold uppercase text-[#722F37] block mb-0.5">
                      Foco Prioritário do Dia:
                    </span>
                    <p className="text-[#1C1917] text-xs leading-relaxed italic line-clamp-2">
                      "{m.dailyFocus}"
                    </p>
                  </div>
                </div>

                {/* Bottom Quick Mini Progress Bar */}
                <div className="mt-3 pt-3 border-t border-[#EFECE4] flex items-center justify-between text-[11px] text-[#634832]">
                  <span>
                    Tarefas: <strong className="text-[#1C1917]">{stats?.completedInPeriod}</strong>/{stats?.totalInPeriod}
                  </span>
                  <span className="font-mono font-bold text-[#722F37]">
                    {stats?.completionRate}% concluído
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* 3. Área Específica de Ordenação Automática dos Participantes */}
      <div className="bg-white rounded-2xl border border-[#E2DCD2] p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFECE4] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#722F37]" />
              <h2 className="text-base font-bold text-[#1C1917] font-sans">
                Classificação & Ordenação Automática da Equipe
              </h2>
            </div>
            <p className="text-xs text-[#634832] mt-0.5">
              O sistema ordena os participantes em tempo real com base no ritmo de entregas, pontualidade e score geral.
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#634832] font-medium">Ordenar por:</span>
            <select
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value as any)}
              className="text-xs py-1.5 px-3 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2] text-[#1C1917] outline-none focus:border-[#722F37] cursor-pointer"
            >
              <option value="score">🏆 Score Geral de Desempenho</option>
              <option value="completed">✅ Mais Tarefas Concluídas</option>
              <option value="punctuality">⏱️ Maior Pontualidade (% no Prazo)</option>
              <option value="volume">📦 Maior Volume de Demandas</option>
            </select>
          </div>
        </div>

        {/* Ordered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedTeam.map((item, index) => {
            const rank = getRankBadge(index);
            const isLeader = index === 0;

            return (
              <div
                key={item.member}
                className={`rounded-2xl p-4.5 border transition-all relative ${
                  isLeader
                    ? 'bg-gradient-to-b from-[#FFFDF7] to-[#FAF5EB] border-[#D4A373] shadow-xs ring-1 ring-[#D4A373]/30'
                    : 'bg-[#FAF8F5] border-[#E8DFD5] hover:border-[#722F37]/40'
                }`}
              >
                {/* Rank Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">{rank.medal}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-white text-[#722F37] border-[#EAD2D6]">
                      {rank.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#634832] font-mono font-medium">
                    {rank.title}
                  </span>
                </div>

                {/* Member Info */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
                      item.member === 'Nath'
                        ? 'bg-[#722F37]'
                        : item.member === 'André'
                        ? 'bg-[#221A17]'
                        : item.member === 'Manu'
                        ? 'bg-[#4D7C0F]'
                        : 'bg-[#B45309]'
                    }`}
                  >
                    {item.member.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1C1917]">{item.member}</h3>
                    <p className="text-[11px] text-[#722F37] font-medium">{item.highlightTitle}</p>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-2 text-xs bg-white p-3.5 rounded-xl border border-[#E8DFD5]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#634832]">Score de Desempenho:</span>
                    <span className="font-mono font-bold text-base text-[#722F37]">
                      {item.score}/100
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#634832]">Tarefas Concluídas:</span>
                    <span className="font-mono font-bold text-[#1C1917]">
                      {item.completedInPeriod} de {item.totalInPeriod} ({item.completionRate}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#634832]">Taxa de Pontualidade:</span>
                    <span className="font-mono font-bold text-[#3F6212]">
                      {item.punctualityRate}%
                    </span>
                  </div>

                  {/* Mini Progress */}
                  <div className="w-full h-1.5 bg-[#EFECE4] rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-[#722F37] to-[#D4A373] transition-all duration-300"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>

                {/* Member Current Mood Mini Tag */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#634832]">
                  <span className="flex items-center gap-1">
                    <span>{item.moodInfo.emoji}</span>
                    <span className="font-medium text-[#1C1917]">{item.moodInfo.label.split(' ')[0]}</span>
                  </span>
                  <span className="text-[10px] text-[#8C6D58]">
                    Bateria: {item.moodInfo.energyLevel}/5
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Relatório em Gráfico de Desempenho (Dia, Semana, Mês) */}
      <div className="bg-white rounded-2xl border border-[#E2DCD2] p-6 shadow-2xs space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFECE4] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#722F37]" />
              <h2 className="text-base font-bold text-[#1C1917]">
                Relatório Gráfico de Desempenho
              </h2>
            </div>
            <p className="text-xs text-[#634832] mt-0.5">
              Visualização comparativa de produtividade individual no dia, na semana e no mês.
            </p>
          </div>

          {/* Period Tabs */}
          <div className="flex items-center p-1 bg-[#FAF8F5] rounded-xl border border-[#E2DCD2] text-xs">
            <button
              type="button"
              onClick={() => setPeriod('dia')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                period === 'dia' ? 'bg-[#722F37] text-white shadow-xs' : 'text-[#634832] hover:text-[#1C1917]'
              }`}
            >
              📅 Hoje (Dia)
            </button>
            <button
              type="button"
              onClick={() => setPeriod('semana')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                period === 'semana' ? 'bg-[#722F37] text-white shadow-xs' : 'text-[#634832] hover:text-[#1C1917]'
              }`}
            >
              📊 Esta Semana
            </button>
            <button
              type="button"
              onClick={() => setPeriod('mes')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                period === 'mes' ? 'bg-[#722F37] text-white shadow-xs' : 'text-[#634832] hover:text-[#1C1917]'
              }`}
            >
              📈 Este Mês
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Bar Chart Concluídas vs Total (7 cols) */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E2DCD2] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#722F37]" />
                Tarefas Concluídas vs Previstas ({period === 'dia' ? 'Hoje' : period === 'semana' ? 'Na Semana' : 'No Mês'})
              </h3>
              <span className="text-[11px] text-[#634832]">Total: {teamStats.reduce((acc, s) => acc + s.completedInPeriod, 0)} entregas</span>
            </div>

            {/* Visual HTML Bar Representation */}
            <div className="space-y-4 pt-2">
              {teamStats.map((item) => {
                const maxVal = Math.max(...teamStats.map((s) => s.totalInPeriod), 10);
                const percentCompleted = (item.completedInPeriod / maxVal) * 100;
                const percentTotal = (item.totalInPeriod / maxVal) * 100;

                return (
                  <div key={item.member} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1C1917]">{item.member}</span>
                        <span className="text-[10px] text-[#634832]">({item.roleLabel.split('&')[0]})</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-[#722F37] font-bold">{item.completedInPeriod} concluídas</span>
                        <span className="text-[#8C6D58]">/</span>
                        <span className="text-[#1C1917]">{item.totalInPeriod} total</span>
                      </div>
                    </div>

                    <div className="w-full h-4 bg-[#EFECE4] rounded-md overflow-hidden relative">
                      {/* Total Bar Backdrop */}
                      <div
                        className="h-full bg-[#E2DCD2] rounded-md absolute left-0 top-0"
                        style={{ width: `${percentTotal}%` }}
                      />
                      {/* Completed Gradient Bar */}
                      <div
                        className={`h-full rounded-md absolute left-0 top-0 transition-all duration-500 ${
                          item.member === 'Nath'
                            ? 'bg-[#722F37]'
                            : item.member === 'André'
                            ? 'bg-[#221A17]'
                            : item.member === 'Manu'
                            ? 'bg-[#4D7C0F]'
                            : 'bg-[#B45309]'
                        }`}
                        style={{ width: `${percentCompleted}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#EFECE4] flex items-center justify-between text-[11px] text-[#634832]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-xs bg-[#722F37] inline-block" /> Concluído no período
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-xs bg-[#E2DCD2] inline-block" /> Total previsto
              </span>
            </div>
          </div>

          {/* Chart 2: Pontualidade & Eficiência (5 cols) */}
          <div className="lg:col-span-5 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E2DCD2] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#722F37]" />
              Taxa de Pontualidade & Prazo
            </h3>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {teamStats.map((item) => (
                <div
                  key={item.member}
                  className="p-3.5 bg-white rounded-2xl border border-[#E2DCD2] flex flex-col items-center text-center space-y-1.5 shadow-2xs"
                >
                  <span className="text-xs font-bold text-[#1C1917]">{item.member}</span>

                  {/* Circular Dial Representation */}
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-[#EFECE4]"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={
                          item.punctualityRate >= 90
                            ? 'text-[#3F6212]'
                            : item.punctualityRate >= 75
                            ? 'text-[#722F37]'
                            : 'text-amber-600'
                        }
                        strokeDasharray={`${item.punctualityRate}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-xs font-mono font-bold text-[#1C1917]">
                      {item.punctualityRate}%
                    </span>
                  </div>

                  <span className="text-[10px] text-[#634832] font-medium">
                    {item.punctualityRate >= 90
                      ? 'No Prazo'
                      : item.punctualityRate >= 75
                      ? 'Em dia'
                      : 'Atenção'}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E2DCD2] text-[11px] text-[#634832] flex items-center justify-between">
              <span>Média da Empresa:</span>
              <strong className="text-[#722F37] font-mono font-bold">
                {Math.round(
                  teamStats.reduce((acc, s) => acc + s.punctualityRate, 0) / teamStats.length
                )}
                % de pontualidade
              </strong>
            </div>
          </div>
        </div>

        {/* 5. Setores e Frentes de Atuação */}
        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E2DCD2] space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#722F37]" />
            Distribuição de Atividades por Empresa e Frente de Trabalho
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div className="p-4 bg-white border border-[#EAD2D6] rounded-2xl space-y-1 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#722F37]">Páprica Arquitetura</span>
              <p className="text-xl font-bold font-mono text-[#1C1917]">7 Clientes Reais</p>
              <p className="text-[11px] text-[#634832]">Iana, Elisa & Pedro, Patrícia, Maria Luiza, Sharon, Lis, Mariana</p>
            </div>

            <div className="p-4 bg-white border border-[#D5E8B8] rounded-2xl space-y-1 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#3F6212]">Urbano.s Temporada</span>
              <p className="text-xl font-bold font-mono text-[#1C1917]">10 Apartamentos</p>
              <p className="text-[11px] text-[#634832]">Copacabana, Ipanema, Leblon · Reservas e Faxinas</p>
            </div>

            <div className="p-4 bg-white border border-[#E2D8C9] rounded-2xl space-y-1 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#8C6D58]">Consultorias Rápidas</span>
              <p className="text-xl font-bold font-mono text-[#1C1917]">2 Ativas</p>
              <p className="text-[11px] text-[#634832]">Layout, curadoria de móveis e paletas de cores</p>
            </div>

            <div className="p-4 bg-white border border-[#E2DCD2] rounded-2xl space-y-1 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#722F37]">Administração & Base</span>
              <p className="text-xl font-bold font-mono text-[#1C1917]">RTs, Contratos & Docs</p>
              <p className="text-[11px] text-[#634832]">Fornecedores, sites sugeridos e arquivos DWG</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: EDITAR MOOD DO DIA */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E2DCD2] shadow-2xl max-w-lg w-full overflow-hidden text-[#1C1917]">
            <div className="p-4 border-b border-[#EFECE4] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <Smile className="w-5 h-5 text-[#722F37]" />
                <h3 className="text-sm font-bold text-[#1C1917]">
                  Atualizar Mood do Dia · {editingMember}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="text-[#634832] hover:text-[#1C1917] p-1 rounded-lg hover:bg-[#EFECE4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Presets Grid */}
              <div>
                <label className="text-[11px] font-bold text-[#1C1917] uppercase tracking-wider block mb-2">
                  Como você está se sentindo hoje?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {moodPresets.map((preset) => {
                    const isSelected = selectedMood === preset.type;
                    return (
                      <button
                        key={preset.type}
                        type="button"
                        onClick={() => setSelectedMood(preset.type)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-[#FAF5F5] border-[#722F37] ring-1 ring-[#722F37] text-[#722F37] font-semibold shadow-2xs'
                            : 'bg-[#FAF8F5] border-[#E2DCD2] text-[#1C1917] hover:bg-white'
                        }`}
                      >
                        <span className="text-xl">{preset.emoji}</span>
                        <div className="min-w-0">
                          <p className="text-xs leading-tight font-semibold truncate">{preset.label.split(' ')[0]}</p>
                          <p className="text-[10px] text-[#634832] truncate">{preset.label.replace(preset.label.split(' ')[0], '')}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Energy Level Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-[#1C1917] uppercase tracking-wider">
                    Nível de Energia Hoje:
                  </label>
                  <span className="font-mono font-bold text-[#722F37]">{customEnergy} / 5</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCustomEnergy(lvl)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        lvl <= customEnergy
                          ? 'bg-[#722F37] border-[#581520] text-white shadow-2xs'
                          : 'bg-[#FAF8F5] border-[#E2DCD2] text-[#634832] hover:bg-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Focus Quote */}
              <div>
                <label className="text-[11px] font-bold text-[#1C1917] uppercase tracking-wider block mb-1">
                  Qual é o seu principal foco ou meta hoje?
                </label>
                <textarea
                  rows={2}
                  value={customFocus}
                  onChange={(e) => setCustomFocus(e.target.value)}
                  placeholder="Ex: Finalizar marcenaria da Iana e conferir vistorias..."
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2] text-[#1C1917] outline-none focus:border-[#722F37] text-xs"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#EFECE4] bg-[#FAF8F5] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="px-3.5 py-1.5 rounded-xl border border-[#E2DCD2] text-[#634832] hover:bg-white text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveMood}
                className="px-4 py-1.5 bg-[#722F37] hover:bg-[#581520] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Mood do Dia</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
