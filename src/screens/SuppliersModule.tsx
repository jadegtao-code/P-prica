import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Supplier } from '../types';
import {
  Truck,
  Phone,
  Mail,
  Star,
  Plus,
  Search,
  Filter,
  ExternalLink,
  MessageCircle,
  MapPin,
  X,
} from 'lucide-react';

export const SuppliersModule: React.FC = () => {
  const { suppliers, addSupplier } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewSupplierModalOpen, setIsNewSupplierModalOpen] = useState(false);

  // New Supplier Form
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [specialty, setSpecialty] = useState<Supplier['specialty']>('Marcenaria');
  const [phone, setPhone] = useState('5521999990000');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(5);

  const specialties: Supplier['specialty'][] = [
    'Marcenaria',
    'Marmoraria',
    'Blindex & Vidros',
    'Serralheria',
    'Luminotécnica',
    'Elétrica',
    'Pintura',
    'Revestimentos',
    'Gesso',
    'Automação',
    'Climatização',
  ];

  const filteredSuppliers = suppliers.filter((s) => {
    if (categoryFilter !== 'todos' && s.specialty !== categoryFilter) return false;
    if (
      searchTerm &&
      !s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addSupplier({
      name,
      contactPerson,
      specialty,
      phone,
      email,
      address,
      rating,
      notes,
    });
    setIsNewSupplierModalOpen(false);
    setName('');
    setContactPerson('');
    setEmail('');
    setAddress('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-lg border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-stone-900" />
            <h1 className="text-xl font-bold text-stone-900 font-sans tracking-tight">
              Catálogo de Fornecedores & Parceiros Homologados
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Marcenaria, marmoraria, blindex, elétrica, serralheria e serviços no Rio de Janeiro com WhatsApp direto em 1 clique.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewSupplierModalOpen(true)}
          className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Cadastrar Fornecedor
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-lg border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nome do fornecedor ou contato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs outline-none bg-transparent"
          />
        </div>

        {/* Categories selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs p-1.5 border border-stone-200 rounded bg-stone-50 text-stone-800 outline-none font-medium"
          >
            <option value="todos">Todas as Especialidades</option>
            {specialties.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suppliers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSuppliers.map((sup) => {
          const cleanPhone = sup.phone.replace(/\D/g, '');
          const waLink = `https://wa.me/${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(
            sup.contactPerson || sup.name
          )}%2C%20aqui%20%C3%A9%20do%20escrit%C3%B3rio%20P%C3%A1prica%20Arquitetura%20%2F%20Urbano.s!`;

          return (
            <div
              key={sup.id}
              className="bg-white rounded-lg border border-stone-200 p-5 shadow-2xs hover:border-stone-400 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 leading-snug">
                      {sup.name}
                    </h3>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      Contato: <strong className="text-stone-700">{sup.contactPerson}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                    {sup.specialty}
                  </span>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < sup.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-stone-400 font-mono ml-1">
                    {sup.rating}.0
                  </span>
                </div>

                {/* Notes */}
                {sup.notes && (
                  <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded border border-stone-100 leading-relaxed">
                    {sup.notes}
                  </p>
                )}

                {/* Address */}
                {sup.address && (
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{sup.address}</span>
                  </div>
                )}
              </div>

              {/* Contact actions */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <a
                  href={`mailto:${sup.email}`}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white/20" /> WhatsApp Direto
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW SUPPLIER MODAL */}
      {isNewSupplierModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">Cadastrar Novo Fornecedor</h3>
              <button
                type="button"
                onClick={() => setIsNewSupplierModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-stone-700 block mb-1">Nome da Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Marmoraria Carioca Design"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Nome do Contato</label>
                  <input
                    type="text"
                    placeholder="Ex: Seu Mário"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Especialidade</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value as any)}
                    className="w-full p-2 border border-stone-200 rounded outline-none bg-white"
                  >
                    {specialties.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">WhatsApp (com DDD)</label>
                  <input
                    type="text"
                    required
                    placeholder="5521999990000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="contato@empresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Endereço no Rio</label>
                <input
                  type="text"
                  placeholder="Ex: Rua São Cristóvão, 120"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Avaliação (1 a 5 estrelas)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full p-2 border border-stone-200 rounded outline-none bg-white"
                >
                  <option value={5}>5 estrelas (Excelente)</option>
                  <option value={4}>4 estrelas (Muito bom)</option>
                  <option value={3}>3 estrelas (Regular)</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Observações Técnicas</label>
                <textarea
                  rows={2}
                  placeholder="Ponto forte de acabamento, cumprimento de prazos..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSupplierModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium"
                >
                  Cadastrar Parceiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
