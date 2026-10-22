import React, { useState } from 'react';
import { useApp, TODAY } from '../context/AppContext';
import { UrbanoApartment, UrbanoReservation } from '../types';
import { UrbanoLogo } from '../components/Logos';
import {
  Building2,
  Calendar,
  Key,
  Wifi,
  Sparkles,
  Coffee,
  Wrench,
  BarChart3,
  ExternalLink,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Phone,
  Shield,
  Layers,
  Check,
  X,
  Instagram,
  Globe,
  Trash2,
} from 'lucide-react';

export const UrbanoModule: React.FC = () => {
  const {
    urbanoApartments,
    selectedUrbanoAptId,
    setSelectedUrbanoAptId,
    urbanoInfo,
    addUrbanoReservation,
    toggleUrbanoCleaning,
    addUrbanoCleaning,
    toggleUrbanoPantry,
    updateUrbanoPantry,
    updateUrbanoApartment,
  } = useApp();

  // Active Apartment
  const currentAptId = selectedUrbanoAptId || urbanoApartments[0].id;
  const activeApt = urbanoApartments.find((a) => a.id === currentAptId) || urbanoApartments[0];

  // Internal tab in apartment view
  const [activeTab, setActiveTab] = useState<
    'ficha' | 'reservas' | 'limpezas' | 'reposicao' | 'inventario' | 'manutencao' | 'relatorios' | 'conteudo'
  >('ficha');

  // New Reservation modal state
  const [isNewResModalOpen, setIsNewResModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [checkIn, setCheckIn] = useState('2026-10-25');
  const [checkOut, setCheckOut] = useState('2026-10-30');
  const [guestCount, setGuestCount] = useState(2);
  const [channel, setChannel] = useState<'airbnb' | 'booking' | 'direto' | 'site'>('airbnb');
  const [totalAmount, setTotalAmount] = useState(2400);
  const [screeningNotes, setScreeningNotes] = useState('');

  // New Cleaning state
  const [newCleanerName, setNewCleanerName] = useState(activeApt.defaultCleaner);
  const [newCleaningDate, setNewCleaningDate] = useState(TODAY);
  const [newCleaningNotes, setNewCleaningNotes] = useState('');

  // Helper calculation for diárias (nights)
  const calculateNights = (inDate: string, outDate: string) => {
    const d1 = new Date(inDate);
    const d2 = new Date(outDate);
    return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !checkIn || !checkOut) return;

    addUrbanoReservation(activeApt.id, {
      apartmentId: activeApt.id,
      guestName,
      guestPhone,
      guestEmail,
      checkIn,
      checkOut,
      guestCount: Number(guestCount),
      channel,
      totalAmount: Number(totalAmount),
      cleaningFee: 200,
      screeningStatus: 'aprovado',
      screeningNotes,
      conversationNotes: 'Reserva cadastrada via sistema.',
      reviewedBy: 'André',
    });

    setIsNewResModalOpen(false);
    setGuestName('');
    setGuestPhone('');
    setGuestEmail('');
  };

  const handleAddManualCleaning = () => {
    if (!newCleaningDate || !newCleanerName) return;
    addUrbanoCleaning(activeApt.id, newCleanerName, newCleaningDate, newCleaningNotes);
    setNewCleaningNotes('');
  };

  // Metrics for active apartment
  const totalRevenue = activeApt.reservations.reduce((acc, r) => acc + r.totalAmount, 0);
  const totalNights = activeApt.reservations.reduce((acc, r) => acc + r.nights, 0);

  return (
    <div className="space-y-6">
      {/* Brand Header Banner: Charcoal and Lime Green */}
      <div className="bg-[#18181B] text-white rounded-xl p-5 shadow-sm border border-stone-800 relative overflow-hidden">
        {/* Dotted texture background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#84CC16 0.8px, transparent 0.8px)',
            backgroundSize: '4px 4px',
          }}
        />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <UrbanoLogo size="lg" variant="badge" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#84CC16] bg-[#84CC16]/10 px-2 py-0.5 rounded border border-[#84CC16]/30">
                  Módulo Urbano.s · Apartamentos por Temporada
                </span>
                <a
                  href="https://instagram.com/urbanos.apts"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-stone-300 hover:text-[#84CC16] font-medium flex items-center gap-1 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" /> @urbanos.apts
                </a>
              </div>

              <h1 className="text-xl font-bold font-sans tracking-tight text-white mt-1">
                URBANO.S Gestão de Imóveis por Temporada
              </h1>

              <p className="text-xs text-stone-300 mt-0.5">
                {urbanoInfo.razaoSocial} · CNPJ: {urbanoInfo.cnpj} · {urbanoInfo.location}
              </p>

              <div className="flex items-center gap-3 text-xs text-stone-400 mt-2 flex-wrap">
                <span className="flex items-center gap-1 text-[#84CC16] font-semibold">
                  <Phone className="w-3.5 h-3.5" /> {urbanoInfo.phone}
                </span>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span>{urbanoInfo.email}</span>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <a
                  href={`https://${urbanoInfo.site}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 underline"
                >
                  <Globe className="w-3 h-3" /> {urbanoInfo.site}
                </a>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsNewResModalOpen(true)}
            className="px-4 py-2 bg-[#84CC16] hover:bg-[#65A30D] text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Registrar Nova Reserva
          </button>
        </div>
      </div>

      {/* 8. Painel dos 10 apartamentos lado a lado */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-[#84CC16]" />
            Seleção dos 10 Apartamentos (Clique para alternar)
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            {urbanoApartments.filter((a) => a.statusToday === 'ocupado').length} ocupados hoje
          </span>
        </div>

        {/* 10 Apartments Horizontal Tabs / Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {urbanoApartments.map((apt) => {
            const isSelected = apt.id === activeApt.id;
            return (
              <button
                key={apt.id}
                type="button"
                onClick={() => setSelectedUrbanoAptId(apt.id)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#84CC16] bg-stone-900 text-white shadow-md ring-2 ring-[#84CC16]/30'
                    : 'border-stone-200 bg-white hover:border-stone-400 text-stone-800'
                }`}
              >
                <div className={`font-bold text-xs truncate ${isSelected ? 'text-[#84CC16]' : 'text-stone-900'}`}>
                  {apt.code}
                </div>
                <div
                  className={`text-[10px] truncate ${
                    isSelected ? 'text-stone-300' : 'text-stone-500'
                  }`}
                >
                  {apt.neighborhood}
                </div>
                <div className="mt-1.5 flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      apt.statusToday === 'ocupado'
                        ? 'bg-emerald-500'
                        : apt.statusToday === 'limpeza_hoje'
                        ? 'bg-amber-400'
                        : 'bg-stone-300'
                    }`}
                  />
                  <span
                    className={`text-[9px] uppercase font-semibold ${
                      isSelected
                        ? 'text-stone-200'
                        : apt.statusToday === 'ocupado'
                        ? 'text-emerald-700'
                        : apt.statusToday === 'limpeza_hoje'
                        ? 'text-amber-800'
                        : 'text-stone-500'
                    }`}
                  >
                    {apt.statusToday === 'ocupado'
                      ? 'Ocupado'
                      : apt.statusToday === 'limpeza_hoje'
                      ? 'Faxina'
                      : 'Livre'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED APARTMENT CONTAINER */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-6">
        {/* Apartment Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-stone-900 font-sans tracking-tight">
                {activeApt.code}
              </h2>
              <span
                className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                  activeApt.statusToday === 'ocupado'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : activeApt.statusToday === 'limpeza_hoje'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {activeApt.statusToday === 'ocupado'
                  ? `Ocupado: ${activeApt.currentGuestName || 'Hóspede'}`
                  : activeApt.statusToday === 'limpeza_hoje'
                  ? 'Limpeza Hoje'
                  : 'Livre / Disponível'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-2 flex-wrap">
              <span>{activeApt.address}</span>
              <span aria-hidden="true">·</span>
              <span>Capacidade: {activeApt.capacity} hóspedes</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-700 font-semibold">Faxineira Padrão: {activeApt.defaultCleaner}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsNewResModalOpen(true)}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#84CC16]" /> Nova Reserva
            </button>
            <a
              href={activeApt.listingUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg text-xs flex items-center gap-1 hover:bg-stone-50"
              title="Abrir Anúncio Airbnb / Site"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Sub-Navigation Styled for Urbano.s */}
        <div className="flex items-center space-x-1 overflow-x-auto border-b border-stone-200 pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('ficha')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'ficha' ? 'bg-stone-900 text-[#84CC16] shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Ficha do Imóvel & Senhas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reservas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeTab === 'reservas' ? 'bg-stone-900 text-[#84CC16] shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>Reservas & Hóspedes</span>
            <span className="font-mono text-[10px] px-1 bg-stone-200 text-stone-800 rounded">
              {activeApt.reservations.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('limpezas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeTab === 'limpezas' ? 'bg-stone-900 text-[#84CC16] shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>Limpeza & Faxineiras</span>
            {activeApt.cleanings.filter((c) => !c.completed).length > 0 && (
              <span className="font-mono text-[10px] px-1.5 bg-amber-500 text-white rounded-full font-bold">
                {activeApt.cleanings.filter((c) => !c.completed).length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reposicao')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'reposicao' ? 'bg-stone-900 text-[#84CC16] shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Reposição de Alimentos & Bebidas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inventario')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'inventario' ? 'bg-stone-900 text-[#84CC16] shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Inventário & Vistoria
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manutencao')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'manutencao' ? 'bg-stone-900 text-[#84CC16] shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Manutenção & Visitas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('relatorios')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'relatorios' ? 'bg-stone-900 text-[#84CC16] shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Relatórios & Receita
          </button>
        </div>

        {/* SUBTAB 1: FICHA DO IMÓVEL & SENHAS */}
        {activeTab === 'ficha' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-stone-800" /> Senhas e Acessos
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-stone-200">
                    <span className="text-stone-500 flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5 text-stone-600" /> Wi-Fi:
                    </span>
                    <span className="font-mono font-bold text-stone-800">
                      {activeApt.passwords.wifiNetwork} / {activeApt.passwords.wifiPassword}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-stone-200">
                    <span className="text-stone-500 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-stone-600" /> Fechadura Eletrônica:
                    </span>
                    <span className="font-mono font-bold text-[#84CC16] bg-stone-900 px-2.5 py-1 rounded">
                      {activeApt.passwords.electronicDoorLock}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-stone-200">
                    <span className="text-stone-500">Portaria / Acesso Prédio:</span>
                    <span className="font-medium text-stone-800 text-right">
                      {activeApt.passwords.buildingAccessCode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700">
                  Observações Gerais do Imóvel
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {activeApt.notes || 'Sem observações cadastradas.'}
                </p>
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700">
                Fotos do Apartamento
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {activeApt.photos.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`${activeApt.code} foto`}
                    referrerPolicy="no-referrer"
                    className="w-full h-36 object-cover rounded-lg border border-stone-200"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: RESERVAS & HÓSPEDES */}
        {activeTab === 'reservas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Histórico e Próximas Reservas
                </h3>
                <p className="text-xs text-stone-500">
                  Diárias calculadas automaticamente; gera limpeza após o check-out.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewResModalOpen(true)}
                className="px-3.5 py-2 bg-stone-900 text-[#84CC16] font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer hover:bg-stone-800"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" /> Adicionar Reserva
              </button>
            </div>

            <div className="space-y-3">
              {activeApt.reservations.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 transition-colors bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-stone-900 text-sm">
                        {res.guestName}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-mono">
                        {res.channel}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {res.screeningStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-stone-500 mt-1">
                      <span>{res.guestPhone}</span>
                      <span aria-hidden="true">·</span>
                      <span>{res.guestEmail}</span>
                      <span aria-hidden="true">·</span>
                      <span>{res.guestCount} hóspede(s)</span>
                    </div>

                    {res.conversationNotes && (
                      <p className="text-stone-600 italic mt-1 bg-stone-50 p-2 rounded-md">
                        "{res.conversationNotes}"
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-stone-700">
                      {res.checkIn} → {res.checkOut}
                    </div>
                    <div className="text-stone-500 font-semibold mt-0.5">
                      {res.nights} diárias
                    </div>
                    <div className="font-bold font-mono text-base text-stone-900 mt-1">
                      R$ {res.totalAmount.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: LIMPEZA & FAXINEIRAS */}
        {activeTab === 'limpezas' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">
                Escala de Limpeza & Faxineiras
              </h3>
              <p className="text-xs text-stone-500">
                Geradas automaticamente a partir do check-out de cada hóspede.
              </p>
            </div>

            {/* Quick manual cleaning schedule */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-stone-700">Agendar Limpeza Extra:</span>
              <input
                type="date"
                value={newCleaningDate}
                onChange={(e) => setNewCleaningDate(e.target.value)}
                className="px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Nome da Faxineira"
                value={newCleanerName}
                onChange={(e) => setNewCleanerName(e.target.value)}
                className="px-2 py-1.5 bg-white border border-stone-200 rounded-lg w-44 text-xs"
              />
              <input
                type="text"
                placeholder="Observações (ex: troca de toalhas)"
                value={newCleaningNotes}
                onChange={(e) => setNewCleaningNotes(e.target.value)}
                className="px-2 py-1.5 bg-white border border-stone-200 rounded-lg flex-1 min-w-[200px] text-xs"
              />
              <button
                type="button"
                onClick={handleAddManualCleaning}
                className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800"
              >
                Adicionar
              </button>
            </div>

            {/* Cleanings list */}
            <div className="space-y-2.5">
              {activeApt.cleanings.map((cln) => (
                <div
                  key={cln.id}
                  className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between gap-3 text-xs ${
                    cln.completed
                      ? 'bg-stone-50/60 border-stone-200 opacity-80'
                      : 'bg-white border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleUrbanoCleaning(activeApt.id, cln.id)}
                      className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 cursor-pointer ${
                        cln.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 bg-white hover:border-emerald-600'
                      }`}
                      title={cln.completed ? 'Desmarcar' : 'Marcar limpeza concluída'}
                    >
                      {cln.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-stone-900 ${cln.completed ? 'line-through text-stone-400' : ''}`}>
                          {cln.cleanerName}
                        </span>
                        <span className="font-mono text-stone-500">
                          {cln.date}
                        </span>
                        {cln.fromReservationGuest && (
                          <span className="text-[10px] text-stone-400">
                            (Saída: {cln.fromReservationGuest})
                          </span>
                        )}
                      </div>
                      <p className="text-stone-500 mt-0.5">{cln.notes}</p>
                      {cln.completed && cln.completedAt && (
                        <span className="text-[10px] text-emerald-700 italic">
                          Concluído em {cln.completedAt}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                      cln.completed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {cln.completed ? 'Realizada' : 'Pendente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 4: REPOSIÇÃO DE ALIMENTOS & BEBIDAS */}
        {activeTab === 'reposicao' && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">
                Reposição de Alimentos, Bebidas e Amenities
              </h3>
              <p className="text-xs text-stone-500">
                Controle de cápsulas Nespresso, água, amenities Granado e snacks para hóspedes.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              {activeApt.pantry.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-stone-200 bg-white flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleUrbanoPantry(activeApt.id, item.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 cursor-pointer ${
                        item.restocked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 bg-white hover:border-emerald-600'
                      }`}
                      title="Marcar como reposto"
                    >
                      {item.restocked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <div>
                      <span className="font-semibold text-stone-900 block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-stone-400 capitalize">
                        Categoria: {item.category} · Resp: {item.responsible} · Atualizado: {item.lastRestockedDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-stone-500">Qtd Atual:</span>
                    <input
                      type="number"
                      min={0}
                      value={item.currentQuantity}
                      onChange={(e) =>
                        updateUrbanoPantry(activeApt.id, item.id, Number(e.target.value))
                      }
                      className="w-14 px-1.5 py-0.5 border border-stone-200 rounded text-center font-mono font-bold"
                    />
                    <span className="text-stone-400">/ meta {item.targetQuantity} {item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 5: INVENTÁRIO & VISTORIAS */}
        {activeTab === 'inventario' && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">
                Inventário Físico & Vistoria de Danos/Faltas
              </h3>
              <p className="text-xs text-stone-500">
                Aparelhos, enxoval de cama/banho, louças e itens com verificação em cada saída.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              {activeApt.inventory.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-xl border border-stone-200 bg-white flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-semibold text-stone-900 block">{inv.name}</span>
                    <span className="text-[11px] text-stone-400 capitalize">
                      {inv.category} · Conferido em {inv.lastCheckedDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-stone-700">
                      Qtd: {inv.currentQuantity} / {inv.standardQuantity}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        inv.damaged
                          ? 'bg-red-100 text-red-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {inv.damaged ? 'Danificado / Falta' : 'Em perfeito estado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 6: MANUTENÇÃO & VISITAS */}
        {activeTab === 'manutencao' && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">
                Manutenção Preventiva & Visitas Técnicas
              </h3>
              <p className="text-xs text-stone-500">
                Ar condicionado, desentupimentos, fechaduras, reparos elétricos e vistorias.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              {activeApt.maintenances.length > 0 ? (
                activeApt.maintenances.map((mnt) => (
                  <div
                    key={mnt.id}
                    className="p-3.5 rounded-xl border border-stone-200 bg-white flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-bold text-stone-900 block">{mnt.title}</span>
                      <span className="text-stone-500">
                        Resp: {mnt.responsible} · Agendado: {mnt.scheduledDate} · Custo: R$ {mnt.cost}
                      </span>
                      {mnt.notes && <p className="text-stone-600 mt-1 italic">{mnt.notes}</p>}
                    </div>
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                        mnt.status === 'concluido'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {mnt.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-500 py-3">
                  Nenhuma ordem de manutenção aberta para este imóvel.
                </p>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 7: RELATÓRIOS & RECEITA */}
        {activeTab === 'relatorios' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">
                Relatórios de Desempenho do {activeApt.code}
              </h3>
              <p className="text-xs text-stone-500">
                Ocupação, receita gerada e avaliações dos hóspedes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-xs text-stone-500">Receita Total de Reservas</span>
                <div className="text-xl font-bold font-mono text-stone-900 mt-1">
                  R$ {totalRevenue.toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-xs text-stone-500">Diárias Vendidas</span>
                <div className="text-xl font-bold font-mono text-stone-900 mt-1">
                  {totalNights} noites
                </div>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-xs text-stone-500">Avaliação Média Airbnb</span>
                <div className="text-xl font-bold font-mono text-emerald-800 mt-1">
                  4.95 ★
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NEW RESERVATION MODAL */}
      {isNewResModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Nova Reserva · {activeApt.code}
                </h3>
                <p className="text-[11px] text-stone-400">
                  Gera automaticamente a limpeza com a faxineira padrão ({activeApt.defaultCleaner}).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewResModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-stone-700 block mb-1">Nome do Hóspede</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João & Maria Fonseca"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-lg outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(21) 99999-9999"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-lg outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="hospede@email.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-lg outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Check-in</label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Check-out</label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 flex justify-between items-center text-xs">
                <span className="text-stone-600 font-medium">Diárias Calculadas Automaticamente:</span>
                <span className="font-bold font-mono text-stone-900">
                  {calculateNights(checkIn, checkOut)} noites
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Hóspedes</label>
                  <input
                    type="number"
                    min={1}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full p-2 border border-stone-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Canal</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full p-2 border border-stone-200 rounded-lg outline-none bg-white"
                  >
                    <option value="airbnb">Airbnb</option>
                    <option value="booking">Booking</option>
                    <option value="direto">Direto</option>
                    <option value="site">Site Urbano.s</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Valor Total (R$)</label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full p-2 border border-stone-200 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">
                  Notas de Filtragem / Conversa com Hóspede
                </label>
                <textarea
                  rows={2}
                  placeholder="Avaliações anteriores no Airbnb, motivo da viagem, pedidos especiais..."
                  value={screeningNotes}
                  onChange={(e) => setScreeningNotes(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-lg outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewResModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#84CC16] hover:bg-[#65A30D] text-stone-950 font-bold rounded-lg"
                >
                  Confirmar Reserva & Agendar Limpeza
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
