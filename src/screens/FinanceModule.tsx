import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PapricaLogo, UrbanoLogo } from '../components/Logos';
import {
  DollarSign,
  Lock,
  Plus,
  ExternalLink,
  TrendingUp,
  Percent,
  CheckCircle,
  FileSpreadsheet,
  ArrowUpRight,
  Shield,
  CreditCard,
  Building,
} from 'lucide-react';

export const FinanceModule: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    papricaClients,
    urbanoApartments,
    financialEntries,
    addPapricaClientPurchaseRT,
  } = useApp();

  const isAndre = currentUser === 'André';

  // Sub-tabs in Finance
  const [activeFinanceTab, setActiveFinanceTab] = useState<
    'geral' | 'paprica_rt' | 'urbano_receita' | 'extrato'
  >('geral');

  // Selected client for RT details
  const [selectedClientId, setSelectedClientId] = useState<string>(
    papricaClients[0]?.id || ''
  );

  // New RT purchase item form modal
  const [isNewRTOpen, setIsNewRTOpen] = useState(false);
  const [rtItem, setRtItem] = useState('');
  const [rtStore, setRtStore] = useState('Portobello Shop Barra');
  const [rtPurchaseAmount, setRtPurchaseAmount] = useState<number>(15000);
  const [rtPercentage, setRtPercentage] = useState<number>(10);
  const [rtStatus, setRtStatus] = useState<'pendente' | 'recebido'>('pendente');

  if (!isAndre) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-700">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-stone-900">
          Módulo Financeiro Restrito
        </h2>
        <p className="text-xs text-stone-500 leading-relaxed">
          Esta área contém contratos, faturamentos, compras com cálculo de RT e receitas de aluguel por temporada restritos ao sócio administrador (André).
        </p>
        <button
          type="button"
          onClick={() => setCurrentUser('André')}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <Shield className="w-3.5 h-3.5" /> Alternar para Perfil de André (Acesso Total)
        </button>
      </div>
    );
  }

  // Calculations
  const totalPapricaContracts = papricaClients.reduce((acc, c) => acc + c.contractValue, 0);
  const totalPapricaPaid = papricaClients.reduce((acc, c) => acc + c.paidAmount, 0);
  const totalPapricaToReceive = totalPapricaContracts - totalPapricaPaid;

  const totalRTReceived = papricaClients.reduce(
    (acc, c) =>
      acc +
      c.clientPurchasesRT
        .filter((rt) => rt.status === 'recebido')
        .reduce((sum, item) => sum + item.rtCalculatedValue, 0),
    0
  );

  const totalRTPending = papricaClients.reduce(
    (acc, c) =>
      acc +
      c.clientPurchasesRT
        .filter((rt) => rt.status === 'pendente')
        .reduce((sum, item) => sum + item.rtCalculatedValue, 0),
    0
  );

  const totalUrbanoRevenue = urbanoApartments.reduce(
    (acc, apt) =>
      acc + apt.reservations.reduce((sum, r) => sum + r.totalAmount, 0),
    0
  );

  const handleAddRT = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !rtItem) return;
    addPapricaClientPurchaseRT(selectedClientId, {
      item: rtItem,
      store: rtStore,
      purchaseAmount: Number(rtPurchaseAmount),
      rtPercentage: Number(rtPercentage),
      status: rtStatus,
    });
    setIsNewRTOpen(false);
    setRtItem('');
  };

  const activeClientForRT = papricaClients.find((c) => c.id === selectedClientId) || papricaClients[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Distinct Slate & Emerald Theme */}
      <div className="bg-gradient-to-r from-stone-900 to-slate-900 text-white rounded-xl p-5 shadow-xs border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Administração Geral & Finanças
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-medium">
              André (Sócio Administrador)
            </span>
          </div>
          <h1 className="text-xl font-bold font-sans tracking-tight text-white mt-1">
            Gestão Financeira Integrada (Páprica + Urbano.s)
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Controle de contratos, parcelas, RT/comissões calculadas automaticamente e faturamento de aluguel por temporada.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewRTOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Registrar Compra com RT
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Páprica Contratos */}
        <div className="p-4 rounded-xl bg-white border border-red-200 shadow-2xs">
          <span className="text-xs text-stone-500 flex items-center justify-between">
            <span className="font-semibold text-red-900">Páprica Contratos</span>
            <PapricaLogo size="sm" variant="icon" />
          </span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1 tabular-nums">
            R$ {totalPapricaContracts.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex justify-between">
            <span>Recebido: R$ {totalPapricaPaid.toLocaleString('pt-BR')}</span>
            <span className="text-amber-800 font-bold">A rec: R$ {totalPapricaToReceive.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        {/* RT Comissões */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 flex items-center justify-between">
            <span className="font-semibold text-stone-800">Comissões RT Páprica</span>
            <Percent className="w-3.5 h-3.5 text-red-800" />
          </span>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1 tabular-nums">
            R$ {totalRTReceived.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex justify-between">
            <span>Recebido confirmado</span>
            <span className="text-amber-700 font-semibold">Pendente: R$ {totalRTPending.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        {/* Urbano.s Receita */}
        <div className="p-4 rounded-xl bg-white border border-stone-800 shadow-2xs">
          <span className="text-xs text-stone-500 flex items-center justify-between">
            <span className="font-semibold text-stone-900">Urbano.s Receita</span>
            <UrbanoLogo size="sm" variant="icon" />
          </span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1 tabular-nums">
            R$ {totalUrbanoRevenue.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Total acumulado nos 10 apartamentos
          </div>
        </div>

        {/* Total Consolidado */}
        <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-2xs">
          <span className="text-xs text-stone-500 flex items-center justify-between">
            <span className="font-semibold text-emerald-900">Faturamento Consolidado</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </span>
          <div className="text-xl font-bold font-mono text-emerald-950 mt-1 tabular-nums">
            R$ {(totalPapricaPaid + totalRTReceived + totalUrbanoRevenue).toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Fluxo positivo e consolidado
          </div>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex items-center space-x-1 border-b border-stone-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveFinanceTab('geral')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeFinanceTab === 'geral' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Visão Geral & Setorização
        </button>
        <button
          type="button"
          onClick={() => setActiveFinanceTab('paprica_rt')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeFinanceTab === 'paprica_rt' ? 'bg-red-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded bg-red-700 inline-block" />
          Páprica: Contratos & RT por Cliente
        </button>
        <button
          type="button"
          onClick={() => setActiveFinanceTab('urbano_receita')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeFinanceTab === 'urbano_receita' ? 'bg-stone-900 text-[#84CC16] shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded bg-[#84CC16] inline-block" />
          Urbano.s: Receita por Apartamento
        </button>
        <button
          type="button"
          onClick={() => setActiveFinanceTab('extrato')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeFinanceTab === 'extrato' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Extrato Completo
        </button>
      </div>

      {/* TAB 1: VISÃO GERAL */}
      {activeFinanceTab === 'geral' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-stone-900">
              Distribuição por Empresa
            </h3>
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg border border-red-200 bg-red-50/20">
                <div className="flex justify-between text-red-950 font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded bg-red-700" /> Páprica Arquitetura & Interiores
                  </span>
                  <span className="font-mono">
                    R$ {(totalPapricaPaid + totalRTReceived).toLocaleString('pt-BR')} (68%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-800" style={{ width: '68%' }} />
                </div>
              </div>

              <div className="p-3 rounded-lg border border-stone-800 bg-[#18181B] text-white">
                <div className="flex justify-between text-white font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded bg-[#84CC16]" /> Urbano.s Apartamentos
                  </span>
                  <span className="font-mono text-[#84CC16]">
                    R$ {totalUrbanoRevenue.toLocaleString('pt-BR')} (32%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#84CC16]" style={{ width: '32%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-stone-900">
              Receita por Tipo de Serviço
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-stone-50 flex items-center justify-between border border-stone-100">
                <span className="text-stone-700">Honorários de Projeto Completo</span>
                <span className="font-mono font-bold text-stone-900">R$ 57.000</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 flex items-center justify-between border border-stone-100">
                <span className="text-stone-700">Comissões de RT / Lojas</span>
                <span className="font-mono font-bold text-emerald-800">
                  R$ {totalRTReceived.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 flex items-center justify-between border border-stone-100">
                <span className="text-stone-700">Consultorias Rápidas</span>
                <span className="font-mono font-bold text-stone-900">R$ 13.000</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 flex items-center justify-between border border-stone-100">
                <span className="text-stone-700">Diárias de Temporada Airbnb</span>
                <span className="font-mono font-bold text-stone-900">
                  R$ {totalUrbanoRevenue.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PÁPRICA CONTRATOS & RT */}
      {activeFinanceTab === 'paprica_rt' && (
        <div className="bg-white rounded-xl border border-red-200 p-5 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-red-950 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-red-700" />
                Inventário de Compras do Cliente & Cálculo de RT
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Cálculo automático da porcentagem do escritório sobre o total comprado em cada loja.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">Cliente:</span>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="text-xs p-2 border border-red-200 rounded-lg bg-red-50/50 font-semibold text-red-950 outline-none"
              >
                {papricaClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-50/40 border border-red-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-bold text-sm text-stone-900 block">
                {activeClientForRT.name}
              </span>
              <span className="text-stone-500">{activeClientForRT.address}</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-stone-500 block text-[10px]">Contrato de Projeto:</span>
                <span className="font-mono font-bold text-stone-900">
                  R$ {activeClientForRT.contractValue.toLocaleString('pt-BR')}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Valor Recebido:</span>
                <span className="font-mono font-bold text-emerald-800">
                  R$ {activeClientForRT.paidAmount.toLocaleString('pt-BR')}
                </span>
              </div>
              {activeClientForRT.excelSpreadsheetUrl && (
                <a
                  href={activeClientForRT.excelSpreadsheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white border border-red-200 rounded-lg text-red-800 hover:text-red-950 font-semibold flex items-center gap-1 shadow-2xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  Planilha Excel <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Compras Cadastradas com RT ({activeClientForRT.clientPurchasesRT.length})
            </h4>

            {activeClientForRT.clientPurchasesRT.length > 0 ? (
              <div className="space-y-2 text-xs">
                {activeClientForRT.clientPurchasesRT.map((rt) => (
                  <div
                    key={rt.id}
                    className="p-3.5 rounded-xl border border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-red-300 transition-colors"
                  >
                    <div>
                      <span className="font-bold text-stone-900 text-sm block">
                        {rt.item}
                      </span>
                      <span className="text-stone-500">
                        Loja: {rt.store} {rt.invoiceNumber ? `· NF: ${rt.invoiceNumber}` : ''}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-stone-500">
                        Valor da Compra: <span className="font-mono font-medium">R$ {rt.purchaseAmount.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="font-bold text-emerald-800 font-mono text-sm mt-0.5">
                        RT ({rt.rtPercentage}%): R$ {rt.rtCalculatedValue.toLocaleString('pt-BR')}
                      </div>
                      <span
                        className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded mt-1 inline-block ${
                          rt.status === 'recebido'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {rt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-6 text-center border border-dashed border-stone-200 rounded-xl">
                Nenhuma compra registrada para este cliente ainda. Clique em "Registrar Compra com RT" acima.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: URBANO RECEITA POR APARTAMENTO */}
      {activeFinanceTab === 'urbano_receita' && (
        <div className="bg-white rounded-xl border border-stone-800 p-5 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-[#84CC16]" />
              Receita Detalhada por Apartamento Urbano.s
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Faturamento consolidado das reservas dos 10 apartamentos.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            {urbanoApartments.map((apt) => {
              const aptRev = apt.reservations.reduce((sum, r) => sum + r.totalAmount, 0);
              const nights = apt.reservations.reduce((sum, r) => sum + r.nights, 0);

              return (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-xl border border-stone-200 hover:border-[#84CC16] transition-colors flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-bold text-stone-900 text-sm block">
                      {apt.code} ({apt.neighborhood})
                    </span>
                    <span className="text-stone-500">
                      {apt.reservations.length} reservas registradas · {nights} noites reservadas
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-stone-900 text-sm block">
                      R$ {aptRev.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Média: R$ {nights > 0 ? Math.round(aptRev / nights) : 0}/noite
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: EXTRATO COMPLETO */}
      {activeFinanceTab === 'extrato' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-sm text-stone-900">
              Extrato Geral de Movimentações
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Todas as receitas de honorários, RT, despesas de limpeza e aluguéis por temporada.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            {financialEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-3.5 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">
                      {entry.description}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        entry.company === 'paprica'
                          ? 'bg-red-100 text-red-950 border border-red-300'
                          : 'bg-stone-200 text-stone-900 border border-stone-300'
                      }`}
                    >
                      {entry.company}
                    </span>
                  </div>
                  <span className="text-stone-500 text-[11px] block mt-0.5">
                    {entry.clientOrApartmentName} · {entry.category} · {entry.date}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-bold font-mono text-sm block ${
                      entry.type === 'despesa' ? 'text-red-700' : 'text-emerald-800'
                    }`}
                  >
                    {entry.type === 'despesa' ? '-' : '+'} R$ {entry.amount.toLocaleString('pt-BR')}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded mt-0.5 inline-block ${
                      entry.status === 'recebido' || entry.status === 'pago'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {entry.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW RT PURCHASE MODAL */}
      {isNewRTOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Registrar Compra com RT / Comissão
                </h3>
                <p className="text-[11px] text-stone-400">
                  Cálculo automático de comissão para a Páprica Arquitetura.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewRTOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRT} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-stone-700 block mb-1">Cliente Páprica</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white font-medium"
                >
                  {papricaClients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Item Comprado</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Porcelanato Portobello 90x90 ou Sofá Linho"
                  value={rtItem}
                  onChange={(e) => setRtItem(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-lg outline-none focus:border-red-800"
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Loja / Fornecedor</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Portobello Shop Barra"
                  value={rtStore}
                  onChange={(e) => setRtStore(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-lg outline-none focus:border-red-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Valor da Compra (R$)</label>
                  <input
                    type="number"
                    required
                    value={rtPurchaseAmount}
                    onChange={(e) => setRtPurchaseAmount(Number(e.target.value))}
                    className="w-full p-2 border border-stone-200 rounded-lg outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Porcentagem RT (%)</label>
                  <input
                    type="number"
                    required
                    value={rtPercentage}
                    onChange={(e) => setRtPercentage(Number(e.target.value))}
                    className="w-full p-2 border border-stone-200 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex justify-between items-center text-xs">
                <span className="text-emerald-800 font-semibold">Comissão Calculada do Escritório:</span>
                <span className="font-mono font-bold text-base text-emerald-900">
                  R$ {((rtPurchaseAmount * rtPercentage) / 100).toLocaleString('pt-BR')}
                </span>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Status do Pagamento</label>
                <select
                  value={rtStatus}
                  onChange={(e) => setRtStatus(e.target.value as any)}
                  className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white font-medium"
                >
                  <option value="pendente">Pendente de Recebimento</option>
                  <option value="recebido">Recebido / Pago pela Loja</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRTOpen(false)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-medium"
                >
                  Salvar Compra & RT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
