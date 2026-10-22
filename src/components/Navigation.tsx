import React from 'react';
import { useApp, NavTab } from '../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  FileSpreadsheet,
  Building2,
  DollarSign,
  CalendarClock,
  Truck,
  Bookmark,
  FileText,
  FolderGit2,
  MessageSquare,
  Lock,
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
  brandColor?: string;
  restrictedToAndre?: boolean;
}

export const Navigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setSelectedPapricaClientId,
    setSelectedUrbanoAptId,
    setSelectedConsultoriaId,
    messages,
    criticalItems,
  } = useApp();

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Painel Geral',
      icon: LayoutDashboard,
    },
    {
      id: 'paprica',
      label: 'Páprica Arquitetura',
      icon: Compass,
      brandColor: 'hover:text-red-800',
    },
    {
      id: 'consultorias',
      label: 'Consultorias',
      icon: FileSpreadsheet,
    },
    {
      id: 'urbano',
      label: 'Urbano.s',
      icon: Building2,
      brandColor: 'hover:text-lime-700',
    },
    {
      id: 'finance',
      label: 'Financeiro',
      icon: DollarSign,
      restrictedToAndre: true,
    },
    {
      id: 'deadlines',
      label: 'Prazos e Urgências',
      icon: CalendarClock,
      badge: criticalItems.length > 0 ? criticalItems.length : undefined,
      badgeColor: 'bg-red-700 text-white',
    },
    {
      id: 'suppliers',
      label: 'Fornecedores',
      icon: Truck,
    },
    {
      id: 'sites',
      label: 'Sites Sugeridos',
      icon: Bookmark,
    },
    {
      id: 'docs',
      label: 'Documentos Base',
      icon: FileText,
    },
    {
      id: 'tech',
      label: 'Arquivos Técnicos',
      icon: FolderGit2,
    },
    {
      id: 'messages',
      label: 'Mensagens',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      badgeColor: 'bg-red-700 text-white',
    },
  ];

  const handleTabClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    if (tabId === 'paprica') {
      setSelectedPapricaClientId(null);
    } else if (tabId === 'urbano') {
      setSelectedUrbanoAptId(null);
    } else if (tabId === 'consultorias') {
      setSelectedConsultoriaId(null);
    }
  };

  return (
    <div className="bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav
          className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none"
          aria-label="Abas do Sistema"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isRestricted = item.restrictedToAndre && currentUser !== 'André';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : isRestricted
                    ? 'text-stone-400 hover:text-stone-600 hover:bg-stone-100/60'
                    : `text-stone-600 hover:text-stone-900 hover:bg-stone-100 ${item.brandColor || ''}`
                }`}
                title={
                  isRestricted
                    ? 'Acesso reservado ao André (Administração e Finanças)'
                    : item.label
                }
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : ''}`} />
                <span>{item.label}</span>
                {isRestricted && (
                  <Lock className="w-2.5 h-2.5 text-stone-400 shrink-0" />
                )}
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                      isActive ? 'bg-white text-stone-900' : item.badgeColor || 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
