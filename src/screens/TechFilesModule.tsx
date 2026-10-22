import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TechnicalFile } from '../types';
import {
  FolderGit2,
  Download,
  Search,
  Filter,
  FileCode,
  Layers,
  FileText,
  Tag,
  CheckCircle,
} from 'lucide-react';

export const TechFilesModule: React.FC = () => {
  const { technicalFiles } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const categories: TechnicalFile['category'][] = [
    'DWG Base',
    'Blocos CAD & 3D',
    'Especificações',
    'CTB & Penas',
    'Templates & Detalhes',
  ];

  const filteredFiles = technicalFiles.filter((f) => {
    if (categoryFilter !== 'todos' && f.category !== categoryFilter) return false;
    if (
      searchTerm &&
      !f.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !f.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !f.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const handleSimulatedDownload = (file: TechnicalFile) => {
    // Generates a mock download file with metadata
    const element = document.createElement('a');
    const mockContent = `ARQUIVO TÉCNICO PÁPRICA ARQUITETURA
Título: ${file.title}
Categoria: ${file.category}
Extensão: .${file.fileType.toLowerCase()}
Descrição: ${file.description}
Tags: ${file.tags.join(', ')}
Escritório: Páprica Arquitetura & Interiores - Copacabana, Rio de Janeiro`;

    const blob = new Blob([mockContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(blob);
    element.download = `${file.title.replace(/\s+/g, '_')}.${file.fileType.toLowerCase()}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloadSuccessId(file.id);
    setTimeout(() => setDownloadSuccessId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-lg border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-stone-900" />
            <h1 className="text-xl font-bold text-stone-900 font-sans tracking-tight">
              Arquivos Técnicos e Biblioteca CAD / 3D
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Templates DWG oficiais, arquivos CTB calibrados, especificações Portobello e blocos de sanitários Deca/Docol.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nome, tag (ex: Deca, CTB, Layers)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs outline-none bg-transparent"
          />
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs p-1.5 border border-stone-200 rounded bg-stone-50 text-stone-800 outline-none font-medium"
          >
            <option value="todos">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="bg-white rounded-lg border border-stone-200 p-5 shadow-2xs hover:border-stone-400 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-stone-900 text-white">
                    {file.fileType}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {file.fileSize}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  {file.category}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-stone-900 leading-snug">
                  {file.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {file.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {file.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] text-stone-500 bg-stone-50 border border-stone-200 px-1.5 py-0.5 rounded"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => handleSimulatedDownload(file)}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                {downloadSuccessId === file.id ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Baixado!
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" /> Baixar Arquivo
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
