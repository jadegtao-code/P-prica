import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { OfficeDocument } from '../types';
import {
  FileText,
  Copy,
  Check,
  Download,
  Edit2,
  Save,
  Filter,
  X,
  Plus,
  UploadCloud,
  Trash2,
  Search,
  FileUp,
  Sparkles,
  FileCode,
  Tag,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export const OfficeDocsModule: React.FC = () => {
  const {
    officeDocuments,
    addOfficeDocument,
    updateOfficeDocument,
    deleteOfficeDocument,
    papricaInfo,
    urbanoInfo,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDocId, setSelectedDocId] = useState<string>(officeDocuments[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit mode in the viewer
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [contentDraft, setContentDraft] = useState('');
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Modal for importing or creating from scratch
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importMode, setImportMode] = useState<'upload' | 'paste'>('upload');
  const [importedFileName, setImportedFileName] = useState('');
  const [importedFileSize, setImportedFileSize] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<string>('Contratos');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Categories list
  const standardCategories = [
    'Contratos',
    'Propostas',
    'Briefings',
    'Termos de Aprovação',
    'Checklists de Vistoria',
    'Importados',
  ];

  // Derive unique categories from existing documents
  const allCategories = Array.from(
    new Set([...standardCategories, ...officeDocuments.map((d) => d.category)])
  );

  const selectedDoc =
    officeDocuments.find((d) => d.id === selectedDocId) || officeDocuments[0] || null;

  // Filtered documents
  const filteredDocs = officeDocuments.filter((d) => {
    if (categoryFilter !== 'todos' && d.category !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchDesc = d.description.toLowerCase().includes(q);
      const matchCat = d.category.toLowerCase().includes(q);
      const matchContent = d.content.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat && !matchContent) return false;
    }
    return true;
  });

  const handleCopy = (doc: OfficeDocument) => {
    navigator.clipboard.writeText(doc.content);
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = (doc: OfficeDocument) => {
    const element = document.createElement('a');
    const file = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.title.replace(/[^\w\d-_]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadDoc = (doc: OfficeDocument) => {
    // Word-compatible HTML format with styling
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${doc.title}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #222; }
        h1 { font-size: 16pt; color: #881337; margin-bottom: 8px; }
        .meta { color: #666; font-size: 9pt; margin-bottom: 24px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
        p { margin-bottom: 12px; }
      </style>
      </head><body>
      <h1>${doc.title}</h1>
      <div class="meta">${doc.category} | Atualizado: ${doc.lastUpdated} | Páprica Arquitetura & Urbano.s</div>
      <div>${doc.content.replace(/\n/g, '<br/>')}</div>
      </body></html>`;

    const blob = new Blob(['\ufeff', header], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = url;
    element.download = `${doc.title.replace(/[^\w\d-_]/g, '_')}.doc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleStartEdit = () => {
    if (!selectedDoc) return;
    setEditTitle(selectedDoc.title);
    setEditCategory(selectedDoc.category);
    setEditDescription(selectedDoc.description);
    setContentDraft(selectedDoc.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!selectedDoc) return;
    updateOfficeDocument(selectedDoc.id, {
      title: editTitle.trim() || selectedDoc.title,
      category: editCategory.trim() || selectedDoc.category,
      description: editDescription.trim() || selectedDoc.description,
      content: contentDraft,
    });
    setIsEditing(false);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const handleDuplicate = (doc: OfficeDocument) => {
    const duplicated = addOfficeDocument({
      title: `${doc.title} (Cópia)`,
      category: doc.category,
      description: `Cópia personalizada criada a partir de ${doc.title}`,
      content: doc.content,
      isImported: doc.isImported,
      sourceFileName: doc.sourceFileName,
    });
    setSelectedDocId(duplicated.id);
    setIsEditing(true);
    setEditTitle(`${doc.title} (Cópia)`);
    setEditCategory(doc.category);
    setEditDescription(`Cópia personalizada criada a partir de ${doc.title}`);
    setContentDraft(doc.content);
  };

  const handleDelete = (doc: OfficeDocument) => {
    if (
      window.confirm(
        `Tem certeza que deseja remover o documento "${doc.title}" dos modelos do escritório?`
      )
    ) {
      deleteOfficeDocument(doc.id);
      const remaining = officeDocuments.filter((d) => d.id !== doc.id);
      if (remaining.length > 0) {
        setSelectedDocId(remaining[0].id);
      }
      setIsEditing(false);
    }
  };

  // Insert variable into active editor (either modal or in-place edit)
  const insertVariable = (variableKey: string) => {
    const targetText = isEditing ? contentDraft : newContent;
    const setText = isEditing ? setContentDraft : setNewContent;

    // Insert at end or cursor position if available
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const updated = targetText.substring(0, start) + variableKey + targetText.substring(end);
      setText(updated);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variableKey.length, start + variableKey.length);
      }, 50);
    } else {
      setText((prev) => prev + (prev.endsWith('\n') || !prev ? '' : '\n') + variableKey);
    }
  };

  // File parser helper
  const processUploadedFile = (file: File) => {
    setImportError(null);
    const fileName = file.name;
    const sizeKb = (file.size / 1024).toFixed(1) + ' KB';
    setImportedFileName(fileName);
    setImportedFileSize(sizeKb);

    // Auto title: strip extension and snake/kebab cases
    const cleanTitle = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .trim();
    if (!newTitle) {
      setNewTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
    }
    if (!newDescription) {
      setNewDescription(`Arquivo externo importado (${fileName}) pronto para edição e uso.`);
    }

    const reader = new FileReader();

    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      // Binary docx/doc: extract plain readable ASCII/UTF strings
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result;
          if (buffer instanceof ArrayBuffer) {
            // For docx/doc without heavy external zip dependencies, extract text XML nodes or clean strings
            const decoder = new TextDecoder('utf-8', { fatal: false });
            const textContent = decoder.decode(buffer);
            // Search for XML paragraphs <w:t>
            const xmlMatch = textContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
            if (xmlMatch && xmlMatch.length > 0) {
              const parsedText = xmlMatch
                .map((m) => m.replace(/<[^>]+>/g, ''))
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
              setNewContent(parsedText);
            } else {
              // Strip non-printable chars
              const cleanText = textContent
                .replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, ' ')
                .replace(/\s{2,}/g, '\n\n')
                .trim();
              setNewContent(
                cleanText ||
                  `[Conteúdo de ${fileName}]\n\n(Texto importado. Ajuste os termos e cláusulas conforme necessário.)`
              );
            }
          }
        } catch {
          setNewContent(
            `[Documento importado: ${fileName}]\n\nCole ou edite as cláusulas contratuais aqui.`
          );
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Plain text, markdown, html, csv, rtf
      reader.onload = (e) => {
        const text = (e.target?.result as string) || '';
        // If HTML, strip basic tags or keep clean text
        if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
          const tmp = document.createElement('div');
          tmp.innerHTML = text;
          setNewContent(tmp.innerText || tmp.textContent || text);
        } else {
          setNewContent(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Replace content of existing document from a file
  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDoc) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = (evt.target?.result as string) || '';
      setContentDraft(text);
      if (!isEditing) {
        updateOfficeDocument(selectedDoc.id, {
          content: text,
          sourceFileName: file.name,
          fileSize: (file.size / 1024).toFixed(1) + ' KB',
        });
        setSaveFeedback(true);
        setTimeout(() => setSaveFeedback(false), 2000);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleSaveImportModal = () => {
    const finalCategory =
      newCategory === 'Outra' ? customCategoryInput.trim() || 'Importados' : newCategory;
    const finalTitle = newTitle.trim() || importedFileName || 'Novo Documento';

    if (!newContent.trim()) {
      setImportError('Por favor, carregue um arquivo com conteúdo ou cole o texto do documento.');
      return;
    }

    const created = addOfficeDocument({
      title: finalTitle,
      category: finalCategory,
      description:
        newDescription.trim() ||
        (importedFileName ? `Importado de ${importedFileName}` : 'Modelo pronto para edição.'),
      content: newContent,
      isImported: Boolean(importedFileName),
      sourceFileName: importedFileName || undefined,
      fileSize: importedFileSize || undefined,
    });

    // Reset and open newly created doc
    setIsImportModalOpen(false);
    setSelectedDocId(created.id);
    setNewTitle('');
    setNewDescription('');
    setNewContent('');
    setImportedFileName('');
    setImportedFileSize('');
    setCustomCategoryInput('');
    setImportError(null);

    // Open directly in edit mode for immediate tweaking
    setTimeout(() => {
      setSelectedDocId(created.id);
      setEditTitle(created.title);
      setEditCategory(created.category);
      setEditDescription(created.description);
      setContentDraft(created.content);
      setIsEditing(true);
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-stone-900 text-white rounded-lg">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-stone-900 font-sans tracking-tight">
                  Documentos Base do Escritório
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Modelos jurídicos e operacionais da Páprica e Urbano.s. Importe arquivos externos
                  (.txt, .docx, .md, .rtf) ou crie modelos prontos para editar, personalizar e
                  baixar.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setImportMode('upload');
                setIsImportModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>Importar Arquivo de Fora</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setImportMode('paste');
                setNewTitle('Novo Modelo em Branco');
                setNewCategory('Contratos');
                setNewDescription('Modelo criado internamente pronto para edição.');
                setNewContent('');
                setIsImportModalOpen(true);
              }}
              className="px-3 py-2 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-stone-500" />
              <span>Criar do Zero</span>
            </button>
          </div>
        </div>

        {/* Success Feedback banner if just saved */}
        {saveFeedback && (
          <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">
                Documento atualizado e salvo com sucesso no sistema!
              </span>
            </div>
            <span className="text-[11px] text-emerald-600">Disponível para toda a equipe</span>
          </div>
        )}
      </div>

      {/* 2-Column Split: List on Left, Document Viewer/Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Search, Filter & Document List */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-xs space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por título, cláusula ou palavra..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-200 rounded-md bg-stone-50 focus:bg-white focus:border-stone-400 outline-none text-stone-800 placeholder-stone-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full text-xs py-1.5 px-2 border border-stone-200 rounded-md bg-stone-50 text-stone-700 outline-none cursor-pointer"
              >
                <option value="todos">Todas as Categorias ({officeDocuments.length})</option>
                {allCategories.map((c) => {
                  const count = officeDocuments.filter((d) => d.category === c).length;
                  return (
                    <option key={c} value={c}>
                      {c} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Docs list */}
          <div className="space-y-2 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
            {filteredDocs.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-stone-200 text-stone-500">
                <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-stone-700">Nenhum documento encontrado</p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Altere os filtros ou clique em "Importar Arquivo de Fora".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setImportMode('upload');
                    setIsImportModalOpen(true);
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-md text-xs font-medium hover:bg-stone-800"
                >
                  <UploadCloud className="w-3.5 h-3.5" /> Importar Agora
                </button>
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const isSelected = selectedDoc && doc.id === selectedDoc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setIsEditing(false);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative group ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/70 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-stone-800 text-stone-200 border border-stone-700'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {doc.category}
                        </span>

                        {doc.isImported && (
                          <span
                            className={`text-[9px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1 ${
                              isSelected
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            <FileUp className="w-2.5 h-2.5" />
                            Arquivo Externo
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-mono shrink-0 ${
                          isSelected ? 'text-stone-400' : 'text-stone-400'
                        }`}
                      >
                        {doc.lastUpdated}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs leading-snug line-clamp-1">{doc.title}</h3>

                    <p
                      className={`text-[11px] line-clamp-2 mt-1 leading-relaxed ${
                        isSelected ? 'text-stone-300' : 'text-stone-500'
                      }`}
                    >
                      {doc.description}
                    </p>

                    {doc.sourceFileName && (
                      <div
                        className={`text-[10px] mt-2 flex items-center gap-1 ${
                          isSelected ? 'text-stone-400' : 'text-stone-400'
                        }`}
                      >
                        <FileCode className="w-3 h-3" />
                        <span className="truncate">Origem: {doc.sourceFileName}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (8 cols): Document Viewer & In-Place Editor */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between overflow-hidden">
          {selectedDoc ? (
            <>
              {/* Header of Viewer/Editor */}
              <div className="p-4 border-b border-stone-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-stone-50/70">
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                          Editando Título:
                        </span>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Nome do documento base..."
                          className="flex-1 text-sm font-bold text-stone-900 border border-stone-300 bg-white px-2 py-1 rounded outline-none focus:border-stone-800"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-stone-400 shrink-0" />
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="text-xs border border-stone-300 rounded px-2 py-1 bg-white text-stone-800 outline-none w-full"
                          >
                            {allCategories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Descrição do modelo..."
                          className="text-xs border border-stone-300 rounded px-2 py-1 bg-white text-stone-700 outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-stone-600 bg-stone-200/70 px-2 py-0.5 rounded uppercase tracking-wider">
                          {selectedDoc.category}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          Última revisão em {selectedDoc.lastUpdated}
                        </span>
                        {selectedDoc.isImported && (
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <FileUp className="w-3 h-3" />
                            Arquivo externo pronto para edição
                          </span>
                        )}
                      </div>
                      <h2 className="text-base font-bold text-stone-900 mt-1 truncate">
                        {selectedDoc.title}
                      </h2>
                      <p className="text-xs text-stone-600 mt-0.5">{selectedDoc.description}</p>
                    </div>
                  )}
                </div>

                {/* Top Action Toolbar */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  {!isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedDoc)}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        title="Copiar texto para área de transferência"
                      >
                        {copiedId === selectedDoc.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-stone-500" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>

                      <div className="relative group inline-block">
                        <button
                          type="button"
                          onClick={() => handleDownloadDoc(selectedDoc)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                          title="Baixar em formato Word (.doc)"
                        >
                          <Download className="w-3.5 h-3.5 text-stone-500" />
                          <span>Baixar (.doc)</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadTxt(selectedDoc)}
                        className="px-2 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-xs text-stone-500 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        title="Baixar em texto puro (.txt)"
                      >
                        .TXT
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicate(selectedDoc)}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-xs font-medium text-stone-600 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        title="Criar cópia deste modelo"
                      >
                        <Copy className="w-3 h-3 text-stone-400" />
                        <span>Duplicar</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleStartEdit}
                        className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Editar Documento</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-medium text-stone-700 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw className="w-3 h-3 text-stone-400" />
                        <span>Cancelar</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Salvar Alterações</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Sub-toolbar during Edit Mode: Fast Variables & Replace File option */}
              {isEditing && (
                <div className="px-4 py-2 bg-stone-100/90 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 mr-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Inserir Variável:
                    </span>
                    <button
                      type="button"
                      onClick={() => insertVariable('{{NOME_CLIENTE}}')}
                      className="px-1.5 py-0.5 bg-white border border-stone-200 hover:border-stone-400 text-[11px] font-mono text-stone-800 rounded cursor-pointer"
                    >
                      [Nome Cliente]
                    </button>
                    <button
                      type="button"
                      onClick={() => insertVariable('{{ENDERECO_IMOVEL}}')}
                      className="px-1.5 py-0.5 bg-white border border-stone-200 hover:border-stone-400 text-[11px] font-mono text-stone-800 rounded cursor-pointer"
                    >
                      [Endereço]
                    </button>
                    <button
                      type="button"
                      onClick={() => insertVariable('{{VALOR_PROJETO}}')}
                      className="px-1.5 py-0.5 bg-white border border-stone-200 hover:border-stone-400 text-[11px] font-mono text-stone-800 rounded cursor-pointer"
                    >
                      [Valor]
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertVariable(
                          papricaInfo.cnpj ? `CNPJ: ${papricaInfo.cnpj}` : '{{CNPJ_PAPRICA}}'
                        )
                      }
                      className="px-1.5 py-0.5 bg-rose-50 border border-rose-200 hover:border-rose-400 text-[11px] font-mono text-rose-800 rounded cursor-pointer"
                    >
                      [CNPJ Páprica]
                    </button>
                    <button
                      type="button"
                      onClick={() => insertVariable(`CNPJ: ${urbanoInfo.cnpj}`)}
                      className="px-1.5 py-0.5 bg-lime-50 border border-lime-200 hover:border-lime-400 text-[11px] font-mono text-stone-800 rounded cursor-pointer"
                    >
                      [CNPJ Urbano.s]
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertVariable(
                          new Date().toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        )
                      }
                      className="px-1.5 py-0.5 bg-white border border-stone-200 hover:border-stone-400 text-[11px] font-mono text-stone-800 rounded cursor-pointer"
                    >
                      [Data de Hoje]
                    </button>
                  </div>

                  {/* Replace content by uploading another file */}
                  <div>
                    <input
                      ref={replaceFileInputRef}
                      type="file"
                      accept=".txt,.md,.doc,.docx,.rtf,.html,.csv"
                      onChange={handleReplaceFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => replaceFileInputRef.current?.click()}
                      className="text-[11px] text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
                      title="Substituir o texto deste documento importando um novo arquivo do computador"
                    >
                      <UploadCloud className="w-3 h-3 text-stone-500" />
                      Substituir por arquivo externo
                    </button>
                  </div>
                </div>
              )}

              {/* Content Body: Editor or Viewer */}
              <div className="p-5 flex-1 min-h-[460px] flex flex-col">
                {isEditing ? (
                  <div className="flex-1 flex flex-col">
                    <textarea
                      ref={textareaRef}
                      value={contentDraft}
                      onChange={(e) => setContentDraft(e.target.value)}
                      placeholder="Digite ou cole aqui o conteúdo do documento, cláusulas, contratos ou termos..."
                      className="w-full flex-1 min-h-[440px] p-4 text-xs font-mono bg-stone-50 border border-stone-300 rounded-lg outline-none focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800 leading-relaxed text-stone-800 resize-y"
                    />
                    <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
                      <span>
                        {contentDraft.length} caracteres ·{' '}
                        {contentDraft.trim() ? contentDraft.trim().split(/\s+/).length : 0} palavras
                      </span>
                      <span className="text-stone-400">
                        Pressione "Salvar Alterações" para aplicar as mudanças ao sistema
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-50/50 rounded-lg p-5 border border-stone-100 flex-1 overflow-y-auto max-h-[580px]">
                    <pre className="text-xs text-stone-800 font-sans whitespace-pre-wrap leading-relaxed select-text">
                      {selectedDoc.content}
                    </pre>
                  </div>
                )}
              </div>

              {/* Footer status & deletion action */}
              <div className="p-3.5 border-t border-stone-200 bg-stone-50 text-[11px] text-stone-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span>Páprica Arquitetura e Interiores · Urbano.s</span>
                  {selectedDoc.sourceFileName && (
                    <span className="text-stone-400">
                      (Arquivo importado: {selectedDoc.sourceFileName}
                      {selectedDoc.fileSize ? ` · ${selectedDoc.fileSize}` : ''})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedDoc)}
                    className="text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Excluir este documento
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-stone-400 flex flex-col items-center justify-center min-h-[400px]">
              <FileText className="w-12 h-12 text-stone-300 mb-3" />
              <p className="text-sm font-semibold text-stone-700">Nenhum documento selecionado</p>
              <p className="text-xs text-stone-500 mt-1 max-w-sm">
                Selecione um documento da lista ao lado ou importe um arquivo externo para começar a
                editar.
              </p>
              <button
                type="button"
                onClick={() => {
                  setImportMode('upload');
                  setIsImportModalOpen(true);
                }}
                className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                Importar Arquivo de Fora
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Import External File or Create Template */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-stone-900 text-white rounded-lg">
                  <UploadCloud className="w-4 h-4 text-emerald-400" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">
                    Importar Arquivo de Fora para Editar
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    Traga contratos, briefings, propostas e termos já prontos para editar no sistema.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs: Upload or Direct Paste */}
            <div className="flex border-b border-stone-200 bg-stone-100/60 px-4 pt-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setImportMode('upload')}
                className={`pb-2 px-3 font-semibold transition-colors border-b-2 cursor-pointer ${
                  importMode === 'upload'
                    ? 'border-stone-900 text-stone-900'
                    : 'border-transparent text-stone-500 hover:text-stone-700'
                }`}
              >
                1. Carregar Arquivo (.docx, .doc, .txt, .md, .rtf)
              </button>
              <button
                type="button"
                onClick={() => setImportMode('paste')}
                className={`pb-2 px-3 font-semibold transition-colors border-b-2 cursor-pointer ${
                  importMode === 'paste'
                    ? 'border-stone-900 text-stone-900'
                    : 'border-transparent text-stone-500 hover:text-stone-700'
                }`}
              >
                2. Colar Texto / Criar do Zero
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {importError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {importMode === 'upload' && (
                <>
                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-stone-900 bg-stone-100 scale-[0.99]'
                        : importedFileName
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-stone-300 bg-stone-50 hover:bg-stone-100/80 hover:border-stone-400'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.md,.doc,.docx,.rtf,.html,.csv,.json"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {importedFileName ? (
                      <div className="flex flex-col items-center">
                        <span className="p-3 bg-emerald-100 text-emerald-700 rounded-full mb-2">
                          <Check className="w-6 h-6" />
                        </span>
                        <p className="text-xs font-bold text-stone-900">{importedFileName}</p>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Tamanho: {importedFileSize} · Clique para escolher outro arquivo
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <UploadCloud className="w-8 h-8 text-stone-400 mb-2" />
                        <p className="text-xs font-bold text-stone-800">
                          Arraste o arquivo para cá ou clique para selecionar
                        </p>
                        <p className="text-[11px] text-stone-500 mt-1">
                          Suporta Word (.docx, .doc), Texto (.txt), Markdown (.md), RTF e HTML
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Título do Documento *
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Contrato de Prestação de Serviços 2026"
                    className="w-full text-xs p-2 border border-stone-200 rounded-lg outline-none focus:border-stone-800 bg-stone-50 focus:bg-white text-stone-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Categoria *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-200 rounded-lg outline-none focus:border-stone-800 bg-stone-50 text-stone-800"
                  >
                    {standardCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Outra">+ Adicionar Nova Categoria</option>
                  </select>

                  {newCategory === 'Outra' && (
                    <input
                      type="text"
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      placeholder="Nome da nova categoria..."
                      className="w-full text-xs p-1.5 border border-stone-300 rounded mt-1.5 bg-white text-stone-800 outline-none"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Breve Descrição / Finalidade
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Ex: Modelo de contrato para reformas completas em Copacabana e Ipanema..."
                  className="w-full text-xs p-2 border border-stone-200 rounded-lg outline-none focus:border-stone-800 bg-stone-50 focus:bg-white text-stone-800"
                />
              </div>

              {/* Content preview / text input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Conteúdo Pronto para Editar *
                  </label>
                  <span className="text-[10px] text-stone-400">
                    Você poderá editar qualquer linha a qualquer momento
                  </span>
                </div>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="O texto do arquivo aparecerá aqui. Você também pode colar ou editar diretamente antes de salvar..."
                  rows={8}
                  className="w-full p-3 text-xs font-mono border border-stone-200 rounded-lg outline-none focus:border-stone-800 bg-stone-50 focus:bg-white text-stone-800 leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveImportModal}
                disabled={!newContent.trim()}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
                  newContent.trim()
                    ? 'bg-stone-900 hover:bg-stone-800 text-white'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Salvar e Abrir para Editar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
