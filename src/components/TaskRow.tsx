import React, { useState } from 'react';
import { TaskItem } from '../types';
import { useApp, TODAY } from '../context/AppContext';
import {
  Calendar,
  User,
  Paperclip,
  Check,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface TaskRowProps {
  task: TaskItem;
  onToggle: () => void;
  onUpdate?: (updates: Partial<TaskItem>) => void;
  compact?: boolean;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onToggle,
  onUpdate,
  compact = false,
}) => {
  const { getTaskStatus } = useApp();
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState(task.notes || '');

  const status = getTaskStatus(task.dueDate, task.completed);

  // Status visual indicator
  const getStatusBadge = () => {
    if (task.completed) {
      return (
        <span className="text-emerald-700 font-medium text-xs flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
          Concluído
        </span>
      );
    }
    if (status === 'overdue') {
      return (
        <span className="text-red-700 font-semibold text-xs flex items-center gap-1 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
          Atrasado
        </span>
      );
    }
    if (status === 'attention') {
      return (
        <span className="text-amber-800 font-semibold text-xs flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          Atenção (≤ 3d)
        </span>
      );
    }
    return (
      <span className="text-stone-500 text-xs flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        Em dia
      </span>
    );
  };

  const handleNotesSave = () => {
    if (onUpdate) {
      onUpdate({ notes: notesDraft });
    }
    setIsNotesOpen(false);
  };

  return (
    <div
      className={`border border-stone-200 rounded-md transition-all ${
        task.completed
          ? 'bg-stone-50/70 opacity-80'
          : status === 'overdue'
          ? 'bg-red-50/20 border-red-200'
          : status === 'attention'
          ? 'bg-amber-50/20 border-amber-200'
          : 'bg-white hover:border-stone-300'
      } ${compact ? 'p-2' : 'p-3'}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox + Title */}
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <button
            type="button"
            onClick={onToggle}
            className={`mt-0.5 w-5 h-5 rounded border transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
              task.completed
                ? 'bg-red-800 border-red-800 text-white'
                : 'border-stone-300 bg-white hover:border-red-700'
            }`}
            title={task.completed ? 'Desmarcar tarefa' : 'Marcar como concluída'}
            aria-label={task.completed ? 'Desmarcar' : 'Concluir'}
          >
            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-sm font-medium leading-snug break-words ${
                  task.completed ? 'line-through text-stone-400' : 'text-stone-800'
                }`}
              >
                {task.title}
              </span>
              {getStatusBadge()}
            </div>

            {/* Metadata unboxed line */}
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-1 flex-wrap font-sans">
              {/* Assignee */}
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-stone-400" />
                <span className="font-medium text-stone-700">{task.assignee || 'A definir'}</span>
              </div>

              <span aria-hidden="true" className="text-stone-300">·</span>

              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  <span
                    className={
                      status === 'overdue' && !task.completed
                        ? 'text-red-700 font-bold'
                        : status === 'attention' && !task.completed
                        ? 'text-amber-700 font-semibold'
                        : 'text-stone-600'
                    }
                  >
                    {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {/* Audit trail */}
              {task.completed && task.completedBy && (
                <>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-[11px] text-stone-400 italic">
                    Concluído por {task.completedBy} {task.completedAt ? `em ${task.completedAt}` : ''}
                  </span>
                </>
              )}

              {/* Attachments count */}
              {task.attachments && task.attachments.length > 0 && (
                <>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="inline-flex items-center gap-0.5 text-stone-500">
                    <Paperclip className="w-3 h-3" />
                    {task.attachments.length}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action button to open notes / observations */}
        <button
          type="button"
          onClick={() => setIsNotesOpen(!isNotesOpen)}
          className={`shrink-0 p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors flex items-center gap-1 text-xs ${
            task.notes ? 'text-stone-700' : ''
          }`}
          title="Observações e anotações"
        >
          <FileText className={`w-3.5 h-3.5 ${task.notes ? 'text-red-700' : ''}`} />
          {task.notes && <span className="hidden sm:inline text-[11px]">Obs</span>}
          {isNotesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expandable Notes Box */}
      {isNotesOpen && (
        <div className="mt-2.5 pt-2 border-t border-stone-100 flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
            Observações e Anotações do Processo
          </label>
          <textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            rows={2}
            placeholder="Anotações de obra, especificações, dúvidas ou alinhamentos com clientes/fornecedores..."
            className="w-full text-xs p-2 rounded border border-stone-200 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none bg-stone-50/50"
          />
          <div className="flex items-center justify-between">
            {task.dueDate && onUpdate && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-stone-500 text-[11px]">Prazo:</span>
                <input
                  type="date"
                  value={task.dueDate}
                  onChange={(e) => onUpdate({ dueDate: e.target.value })}
                  className="border border-stone-200 rounded px-1.5 py-0.5 text-xs text-stone-700 bg-white"
                />
              </div>
            )}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={() => setIsNotesOpen(false)}
                className="px-2 py-1 text-xs text-stone-500 hover:text-stone-700 rounded"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={handleNotesSave}
                className="px-2.5 py-1 text-xs font-medium text-white bg-red-800 hover:bg-red-700 rounded transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
