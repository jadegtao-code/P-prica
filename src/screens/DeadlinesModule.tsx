import React, { useState } from 'react';
import { useApp, TODAY } from '../context/AppContext';
import { TaskRow } from '../components/TaskRow';
import { TEAM_MEMBERS } from '../data/initialData';
import {
  CalendarClock,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building,
  Compass,
} from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  dueDate: string;
  assignee: string;
  completed: boolean;
  notes: string;
  company: 'paprica' | 'urbano' | 'consultoria';
  origin: string;
  originId: string;
  section?: 'briefing' | 'preliminaryStudy' | 'executive' | 'revisions';
  revisionId?: string;
  cleaningId?: string;
}

export const DeadlinesModule: React.FC = () => {
  const {
    papricaClients,
    consultoriaClients,
    urbanoApartments,
    calmariaIndex,
    criticalItems,
    togglePapricaTask,
    updatePapricaTask,
    toggleConsultoriaTask,
    updateConsultoriaTask,
    toggleUrbanoCleaning,
  } = useApp();

  const [companyFilter, setCompanyFilter] = useState<'todas' | 'paprica' | 'urbano'>('todas');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'criticos' | 'concluidos'>('todos');

  // Collect all timeline items
  const allItems: TimelineItem[] = [];

  // Páprica tasks
  papricaClients.forEach((client) => {
    client.briefing.tasks.forEach((t) => {
      allItems.push({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        assignee: t.assignee,
        completed: t.completed,
        notes: t.notes,
        company: 'paprica',
        origin: `Páprica: ${client.name} (Briefing)`,
        originId: client.id,
        section: 'briefing',
      });
    });
    Object.values(client.preliminaryStudy.tasks).forEach((t) => {
      allItems.push({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        assignee: t.assignee,
        completed: t.completed,
        notes: t.notes,
        company: 'paprica',
        origin: `Páprica: ${client.name} (Estudo Preliminar)`,
        originId: client.id,
        section: 'preliminaryStudy',
      });
    });
    client.revisions.forEach((rev) => {
      rev.topics.forEach((t) => {
        allItems.push({
          id: t.id,
          title: t.title,
          dueDate: t.dueDate,
          assignee: t.assignee,
          completed: t.completed,
          notes: t.notes,
          company: 'paprica',
          origin: `Páprica: ${client.name} (Rev ${rev.roundNumber})`,
          originId: client.id,
          section: 'revisions',
          revisionId: rev.id,
        });
      });
    });
    Object.values(client.executive).forEach((t) => {
      allItems.push({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        assignee: t.assignee,
        completed: t.completed,
        notes: t.notes,
        company: 'paprica',
        origin: `Páprica: ${client.name} (Executivo)`,
        originId: client.id,
        section: 'executive',
      });
    });
  });

  // Consultorias tasks
  consultoriaClients.forEach((client) => {
    client.tasks.forEach((t) => {
      allItems.push({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        assignee: t.assignee,
        completed: t.completed,
        notes: t.notes,
        company: 'paprica',
        origin: `Consultoria: ${client.name}`,
        originId: client.id,
      });
    });
  });

  // Urbano cleanings & maintenances
  urbanoApartments.forEach((apt) => {
    apt.cleanings.forEach((c) => {
      allItems.push({
        id: c.id,
        title: `Faxina: ${c.cleanerName} (${c.notes || 'Preparação'})`,
        dueDate: c.date,
        assignee: c.cleanerName,
        completed: c.completed,
        notes: c.notes,
        company: 'urbano',
        origin: `Urbano.s: ${apt.code}`,
        originId: apt.id,
        cleaningId: c.id,
      });
    });
    apt.maintenances.forEach((m) => {
      allItems.push({
        id: m.id,
        title: `Manutenção: ${m.title}`,
        dueDate: m.scheduledDate,
        assignee: m.responsible,
        completed: m.status === 'concluido',
        notes: m.notes,
        company: 'urbano',
        origin: `Urbano.s: ${apt.code}`,
        originId: apt.id,
      });
    });
  });

  // Filter items
  const filtered = allItems.filter((item) => {
    if (companyFilter !== 'todas' && item.company !== companyFilter) return false;
    if (assigneeFilter !== 'todos' && !item.assignee.toLowerCase().includes(assigneeFilter.toLowerCase()))
      return false;
    if (statusFilter === 'concluidos' && !item.completed) return false;
    if (statusFilter === 'criticos') {
      if (item.completed || !item.dueDate) return false;
      const today = new Date(TODAY).getTime();
      const due = new Date(item.dueDate).getTime();
      const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      if (diff > 3) return false;
    }
    return true;
  });

  // Sort by dueDate
  filtered.sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-stone-900" />
            <h1 className="text-xl font-bold text-stone-900 font-sans tracking-tight">
              Prazos, Urgências & Linha do Tempo
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Agenda completa unificada do grupo, espelhada em tempo real com todos os módulos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-bold font-mono px-3 py-1.5 rounded-full border border-stone-200 bg-stone-50 flex items-center gap-2">
            <span>Calmaria Geral:</span>
            <span className={calmariaIndex >= 85 ? 'text-emerald-700' : 'text-amber-700'}>
              {calmariaIndex}%
            </span>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-lg border border-stone-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
          <Filter className="w-3.5 h-3.5" /> Filtros Rápidos da Linha do Tempo
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Company filter */}
          <div>
            <label className="text-stone-500 block mb-1">Empresa:</label>
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value as any)}
              className="w-full p-2 border border-stone-200 rounded bg-stone-50 text-stone-800 outline-none"
            >
              <option value="todas">Todas as Empresas</option>
              <option value="paprica">Páprica Arquitetura</option>
              <option value="urbano">Urbano.s Apartamentos</option>
            </select>
          </div>

          {/* Assignee filter */}
          <div>
            <label className="text-stone-500 block mb-1">Responsável:</label>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full p-2 border border-stone-200 rounded bg-stone-50 text-stone-800 outline-none"
            >
              <option value="todos">Todos os Responsáveis</option>
              {TEAM_MEMBERS.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.role.split('&')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="text-stone-500 block mb-1">Status da Tarefa:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full p-2 border border-stone-200 rounded bg-stone-50 text-stone-800 outline-none"
            >
              <option value="todos">Todas as Tarefas</option>
              <option value="criticos">Apenas Urgentes & Atrasadas (≤ 3 dias)</option>
              <option value="concluidos">Apenas Concluídas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Items List */}
      <div className="bg-white rounded-lg border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-100 pb-2">
          <span>{filtered.length} prazos encontrados</span>
          <span>Hoje é {TODAY}</span>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="text-[11px] font-semibold text-stone-500 px-1">
                {item.origin}
              </div>
              <TaskRow
                task={{
                  id: item.id,
                  title: item.title,
                  dueDate: item.dueDate,
                  assignee: item.assignee,
                  completed: item.completed,
                  notes: item.notes,
                }}
                onToggle={() => {
                  if (item.company === 'paprica' && item.section) {
                    togglePapricaTask(item.originId, item.section, item.id, item.revisionId);
                  } else if (item.cleaningId) {
                    toggleUrbanoCleaning(item.originId, item.cleaningId);
                  }
                }}
                onUpdate={(updates) => {
                  if (item.company === 'paprica' && item.section) {
                    updatePapricaTask(item.originId, item.section, item.id, updates, item.revisionId);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
