import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConsultoriaClient, ConsultoriaProduct } from '../types';
import { TaskRow } from '../components/TaskRow';
import {
  FileSpreadsheet,
  Plus,
  ExternalLink,
  ShoppingBag,
  CheckCircle,
  X,
  ArrowLeft,
  Bookmark,
  DollarSign,
  Tag,
  Sparkles,
} from 'lucide-react';

export const ConsultoriasModule: React.FC = () => {
  const {
    consultoriaClients,
    selectedConsultoriaId,
    setSelectedConsultoriaId,
    toggleConsultoriaTask,
    updateConsultoriaTask,
    suggestedSites,
    setActiveTab,
  } = useApp();

  const activeConsultoria = consultoriaClients.find((c) => c.id === selectedConsultoriaId);

  // LIST VIEW
  if (!activeConsultoria) {
    return (
      <div className="space-y-6">
        {/* Banner with Amber / Terracotta Identity */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white rounded-xl p-5 shadow-xs border border-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-amber-200 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                Páprica Consultorias
              </span>
            </div>
            <h1 className="text-xl font-bold font-sans tracking-tight text-white mt-1">
              Consultorias de Decoração & Ambientes
            </h1>
            <p className="text-xs text-amber-100/90 mt-0.5">
              Curadoria ágil de mobiliário, iluminação, paletas e links diretos de compra sem quebra-quebra no Rio de Janeiro.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('sites')}
            className="px-3.5 py-2 bg-amber-100 hover:bg-white text-amber-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-800" /> Ver Lojas Parceiras Homologadas
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {consultoriaClients.map((client) => {
            const completedTasks = client.tasks.filter((t) => t.completed).length;
            const progress = client.tasks.length > 0 ? Math.round((completedTasks / client.tasks.length) * 100) : 0;

            return (
              <div
                key={client.id}
                onClick={() => setSelectedConsultoriaId(client.id)}
                className="bg-white rounded-xl border border-stone-200 hover:border-amber-600 transition-all shadow-xs hover:shadow-md p-5 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Consultoria Express
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {client.contractStatus}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {client.description}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-medium text-stone-700">Honorários:</span>
                    <span className="font-mono font-semibold text-stone-800">
                      R$ {client.contractValue.toLocaleString('pt-BR')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{client.suggestedProducts.length} itens curados</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-stone-500 font-medium">Progresso</span>
                    <span className="font-bold font-mono text-amber-900">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // DETAIL VIEW
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSelectedConsultoriaId(null)}
          className="text-xs text-amber-950 hover:text-stone-900 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-800" /> Voltar às Consultorias
        </button>
      </div>

      <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-700 to-amber-500" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-amber-600 shrink-0" />
              <h2 className="text-xl font-bold text-stone-900 font-sans tracking-tight">
                {activeConsultoria.name}
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {activeConsultoria.address} · {activeConsultoria.phone} · {activeConsultoria.email}
            </p>
            <p className="text-xs text-stone-600 mt-2 max-w-2xl leading-relaxed">
              {activeConsultoria.description}
            </p>
          </div>
          <div className="bg-amber-50/60 p-3.5 rounded-lg border border-amber-200 text-xs shrink-0 space-y-1">
            <div className="text-stone-500 font-medium">Honorários da Consultoria:</div>
            <div className="font-bold font-mono text-base text-amber-950">
              R$ {activeConsultoria.contractValue.toLocaleString('pt-BR')}
            </div>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase font-semibold inline-block">
              Contrato {activeConsultoria.contractStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Checklist da Consultoria */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-amber-600" />
            Checklist e Etapas da Consultoria
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Regra de ouro com responsável, prazo automático e registro indelével.
          </p>
        </div>

        <div className="space-y-2.5">
          {activeConsultoria.tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => toggleConsultoriaTask(activeConsultoria.id, task.id)}
              onUpdate={(updates) =>
                updateConsultoriaTask(activeConsultoria.id, task.id, updates)
              }
            />
          ))}
        </div>
      </div>

      {/* Lista de Produtos Sugeridos */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-amber-600" />
              Lista Curada de Produtos Sugeridos
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Links diretos das lojas parceiras homologadas com indicação de compras.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('sites')}
            className="text-xs text-amber-900 hover:text-amber-950 font-bold flex items-center gap-1 underline"
          >
            Abrir Sites Sugeridos <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5 text-xs">
          {activeConsultoria.suggestedProducts.map((prod) => (
            <div
              key={prod.id}
              className="p-3.5 rounded-xl border border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-400 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">{prod.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                    {prod.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-stone-500 mt-1">
                  <span className="font-medium text-stone-700">Loja: {prod.store}</span>
                  <span aria-hidden="true">·</span>
                  <a
                    href={prod.storeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-800 hover:text-amber-950 flex items-center gap-0.5 underline font-medium"
                  >
                    Ver produto na loja <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                {prod.notes && <p className="text-stone-500 italic mt-1">{prod.notes}</p>}
              </div>

              <div className="text-right shrink-0">
                <span className="font-bold font-mono text-stone-900 text-sm block">
                  R$ {prod.price.toLocaleString('pt-BR')}
                </span>
                <span
                  className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded mt-1 inline-block ${
                    prod.status === 'aprovado'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : prod.status === 'comprado'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {prod.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
