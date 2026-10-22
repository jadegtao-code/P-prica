import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SuggestedSite } from '../types';
import {
  Bookmark,
  ExternalLink,
  Plus,
  Tag,
  Filter,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';

export const SuggestedSitesModule: React.FC = () => {
  const { suggestedSites, addSuggestedSite } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [isNewSiteModalOpen, setIsNewSiteModalOpen] = useState(false);

  // New site form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SuggestedSite['category']>('Móveis & Design');
  const [url, setUrl] = useState('');
  const [discountCoupon, setDiscountCoupon] = useState('');
  const [notes, setNotes] = useState('');

  const categories: SuggestedSite['category'][] = [
    'Móveis & Design',
    'Iluminação',
    'Decoração & Objetos',
    'Enxoval & Airbnb',
    'Banho & Cama',
    'Revestimentos & Metais',
    'Eletros',
  ];

  const filteredSites = suggestedSites.filter((s) => {
    if (categoryFilter !== 'todos' && s.category !== categoryFilter) return false;
    return true;
  });

  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    addSuggestedSite({
      name,
      category,
      url,
      discountCoupon,
      notes,
      featured: false,
    });
    setIsNewSiteModalOpen(false);
    setName('');
    setUrl('');
    setDiscountCoupon('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-lg border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-stone-900" />
            <h1 className="text-xl font-bold text-stone-900 font-sans tracking-tight">
              Sites e Lojas Sugeridas
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Curadoria de e-commerces para especificação de projetos Páprica, consultorias e compras de enxoval para os apartamentos Urbano.s.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewSiteModalOpen(true)}
          className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Cadastrar Nova Loja
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setCategoryFilter('todos')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
            categoryFilter === 'todos'
              ? 'bg-stone-900 text-white'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
          }`}
        >
          Todas as Categorias ({suggestedSites.length})
        </button>
        {categories.map((cat) => {
          const count = suggestedSites.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid of Store Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSites.map((site) => (
          <div
            key={site.id}
            className="bg-white rounded-lg border border-stone-200 p-5 shadow-2xs hover:border-stone-400 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">{site.name}</h3>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold">
                    {site.category}
                  </span>
                </div>
                {site.featured && (
                  <span className="text-[10px] bg-red-50 text-red-800 border border-red-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Destaque
                  </span>
                )}
              </div>

              {site.notes && (
                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded border border-stone-100">
                  {site.notes}
                </p>
              )}

              {site.discountCoupon && (
                <div className="p-2 rounded bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                  <span className="text-amber-800 font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-600" /> Cupom de Parceiro:
                  </span>
                  <span className="font-mono font-bold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                    {site.discountCoupon}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-end">
              <a
                href={site.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                Visitar Loja <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* NEW SITE MODAL */}
      {isNewSiteModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">Cadastrar Novo Site / Loja</h3>
              <button
                type="button"
                onClick={() => setIsNewSiteModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSite} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-stone-700 block mb-1">Nome da Loja</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Westwing, Camicado, Zissou..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 border border-stone-200 rounded outline-none bg-white font-medium"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Link do Site (URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Cupom de Desconto (opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: PAPRICA10"
                  value={discountCoupon}
                  onChange={(e) => setDiscountCoupon(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded outline-none font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Observações de Compra</label>
                <textarea
                  rows={2}
                  placeholder="Dicas de frete no RJ, tipos de produtos indicados..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSiteModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium"
                >
                  Salvar Loja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
