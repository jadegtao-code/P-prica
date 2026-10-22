import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  TeamMember,
  UserProfile,
  PapricaClient,
  ConsultoriaClient,
  UrbanoApartment,
  Supplier,
  SuggestedSite,
  OfficeDocument,
  TechnicalFile,
  TeamMessage,
  OfficeFinancialEntry,
  TaskItem,
  TaskStatus,
  UrbanoReservation,
  ClientRTItem,
  MemberDailyMood,
} from '../types';
import {
  TEAM_MEMBERS,
  INITIAL_PAPRICA_INFO,
  INITIAL_URBANO_INFO,
  INITIAL_PAPRICA_CLIENTS,
  INITIAL_CONSULTORIAS,
  INITIAL_URBANO_APARTMENTS,
  INITIAL_SUPPLIERS,
  INITIAL_SUGGESTED_SITES,
  INITIAL_OFFICE_DOCUMENTS,
  INITIAL_TECHNICAL_FILES,
  INITIAL_MESSAGES,
  INITIAL_FINANCIAL_ENTRIES,
  INITIAL_TEAM_MOODS,
} from '../data/initialData';

export type NavTab =
  | 'dashboard'
  | 'paprica'
  | 'consultorias'
  | 'urbano'
  | 'finance'
  | 'deadlines'
  | 'suppliers'
  | 'sites'
  | 'docs'
  | 'tech'
  | 'messages'
  | 'team_mood';

export interface CriticalItem {
  id: string;
  title: string;
  origin: string; // e.g. "Páprica: Cláudia & Roberto" or "Urbano 505"
  originType: 'paprica' | 'consultoria' | 'urbano';
  originId: string;
  assignee: string;
  dueDate: string;
  status: 'overdue' | 'attention';
  daysDiff: number;
}

interface AppContextType {
  currentUser: TeamMember;
  setCurrentUser: (user: TeamMember) => void;
  currentUserProfile: UserProfile;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  
  // Drill-down selection
  selectedPapricaClientId: string | null;
  setSelectedPapricaClientId: (id: string | null) => void;
  selectedUrbanoAptId: string | null;
  setSelectedUrbanoAptId: (id: string | null) => void;
  selectedConsultoriaId: string | null;
  setSelectedConsultoriaId: (id: string | null) => void;

  // Calmaria Drawer
  isCalmariaDrawerOpen: boolean;
  setIsCalmariaDrawerOpen: (open: boolean) => void;
  calmariaIndex: number;
  criticalItems: CriticalItem[];

  // Mobile Sidebar
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;

  // Entities
  papricaClients: PapricaClient[];
  consultoriaClients: ConsultoriaClient[];
  urbanoApartments: UrbanoApartment[];
  suppliers: Supplier[];
  suggestedSites: SuggestedSite[];
  officeDocuments: OfficeDocument[];
  technicalFiles: TechnicalFile[];
  messages: TeamMessage[];
  financialEntries: OfficeFinancialEntry[];
  
  // Info
  papricaInfo: typeof INITIAL_PAPRICA_INFO;
  setPapricaInfo: (info: typeof INITIAL_PAPRICA_INFO) => void;
  urbanoInfo: typeof INITIAL_URBANO_INFO;
  setUrbanoInfo: (info: typeof INITIAL_URBANO_INFO) => void;

  // Universal Task handlers
  togglePapricaTask: (clientId: string, section: 'briefing' | 'preliminaryStudy' | 'executive' | 'revisions', taskId: string, revisionId?: string) => void;
  updatePapricaTask: (clientId: string, section: 'briefing' | 'preliminaryStudy' | 'executive' | 'revisions', taskId: string, updates: Partial<TaskItem>, revisionId?: string) => void;
  toggleConsultoriaTask: (clientId: string, taskId: string) => void;
  updateConsultoriaTask: (clientId: string, taskId: string, updates: Partial<TaskItem>) => void;
  
  // Project Stage & Approval
  setPapricaApprovalDecision: (clientId: string, decision: 'aprovado' | 'alteracoes' | 'pendente', revisionNotes?: string) => void;
  addRevisionTopic: (clientId: string, roundNumber: number, title: string, assignee: string, dueDate: string) => void;
  addPapricaClientPurchaseRT: (clientId: string, item: Omit<ClientRTItem, 'id' | 'rtCalculatedValue'>) => void;
  updatePapricaClient: (clientId: string, updates: Partial<PapricaClient>) => void;
  addNewPapricaClient: (clientData: Partial<PapricaClient>) => void;

  // Urbano handlers
  addUrbanoReservation: (apartmentId: string, reservation: Omit<UrbanoReservation, 'id' | 'nights'>) => void;
  toggleUrbanoCleaning: (apartmentId: string, cleaningId: string) => void;
  addUrbanoCleaning: (apartmentId: string, cleanerName: string, date: string, notes: string) => void;
  toggleUrbanoPantry: (apartmentId: string, pantryItemId: string) => void;
  updateUrbanoPantry: (apartmentId: string, pantryItemId: string, currentQty: number) => void;
  updateUrbanoApartment: (apartmentId: string, updates: Partial<UrbanoApartment>) => void;

  // Suppliers & Sites
  addSupplier: (supplier: Omit<Supplier, 'id' | 'activeProjectsCount'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  addSuggestedSite: (site: Omit<SuggestedSite, 'id'>) => void;

  // Messages
  sendMessage: (text: string, mentions?: TeamMember[], relatedTo?: TeamMessage['relatedTo']) => void;
  markMessageRead: (messageId: string) => void;

  // Documents & Tech
  updateDocumentContent: (id: string, content: string) => void;
  addOfficeDocument: (doc: Omit<OfficeDocument, 'id' | 'lastUpdated'>) => OfficeDocument;
  updateOfficeDocument: (id: string, updates: Partial<OfficeDocument>) => void;
  deleteOfficeDocument: (id: string) => void;

  // Team Mood & Wellbeing
  teamMoods: MemberDailyMood[];
  updateMemberMood: (member: TeamMember, updates: Partial<MemberDailyMood>) => void;

  // Reset demo
  resetToDefaultData: () => void;
  
  // Helper
  getTaskStatus: (dueDate: string, completed: boolean) => TaskStatus;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Reference current date for the app
export const TODAY = '2026-10-21';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current active user
  const [currentUser, setCurrentUser] = useState<TeamMember>(() => {
    return (localStorage.getItem('paprica_user') as TeamMember) || 'André';
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedPapricaClientId, setSelectedPapricaClientId] = useState<string | null>(null);
  const [selectedUrbanoAptId, setSelectedUrbanoAptId] = useState<string | null>(null);
  const [selectedConsultoriaId, setSelectedConsultoriaId] = useState<string | null>(null);
  const [isCalmariaDrawerOpen, setIsCalmariaDrawerOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Office brand info
  const [papricaInfo, setPapricaInfo] = useState(() => {
    const saved = localStorage.getItem('paprica_info');
    return saved ? JSON.parse(saved) : INITIAL_PAPRICA_INFO;
  });

  const [urbanoInfo, setUrbanoInfo] = useState(() => {
    const saved = localStorage.getItem('urbano_info');
    return saved ? JSON.parse(saved) : INITIAL_URBANO_INFO;
  });

  // Entities state
  const [papricaClients, setPapricaClients] = useState<PapricaClient[]>(() => {
    const saved = localStorage.getItem('paprica_clients');
    if (saved) {
      try {
        const parsed: PapricaClient[] = JSON.parse(saved);
        const hasObsoleteDemo = parsed.some(
          (c) => c.name?.includes('Cláudia & Roberto') || c.name?.includes('Fernando Silveira') || c.name?.includes('Valente')
        );
        if (hasObsoleteDemo) {
          localStorage.setItem('paprica_clients', JSON.stringify(INITIAL_PAPRICA_CLIENTS));
          return INITIAL_PAPRICA_CLIENTS;
        }
        return parsed;
      } catch {
        return INITIAL_PAPRICA_CLIENTS;
      }
    }
    return INITIAL_PAPRICA_CLIENTS;
  });

  const [consultoriaClients, setConsultoriaClients] = useState<ConsultoriaClient[]>(() => {
    const saved = localStorage.getItem('paprica_consultorias');
    return saved ? JSON.parse(saved) : INITIAL_CONSULTORIAS;
  });

  const [urbanoApartments, setUrbanoApartments] = useState<UrbanoApartment[]>(() => {
    const saved = localStorage.getItem('urbano_apartments');
    return saved ? JSON.parse(saved) : INITIAL_URBANO_APARTMENTS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('paprica_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [suggestedSites, setSuggestedSites] = useState<SuggestedSite[]>(() => {
    const saved = localStorage.getItem('paprica_sites');
    return saved ? JSON.parse(saved) : INITIAL_SUGGESTED_SITES;
  });

  const [officeDocuments, setOfficeDocuments] = useState<OfficeDocument[]>(() => {
    const saved = localStorage.getItem('paprica_docs');
    return saved ? JSON.parse(saved) : INITIAL_OFFICE_DOCUMENTS;
  });

  const [technicalFiles] = useState<TechnicalFile[]>(INITIAL_TECHNICAL_FILES);

  const [messages, setMessages] = useState<TeamMessage[]>(() => {
    const saved = localStorage.getItem('paprica_messages');
    if (saved) {
      try {
        const parsed: TeamMessage[] = JSON.parse(saved);
        const hasObsolete = parsed.some(
          (m) => m.text?.includes('Cláudia & Roberto') || m.text?.includes('Vieira Souto')
        );
        if (hasObsolete) {
          localStorage.setItem('paprica_messages', JSON.stringify(INITIAL_MESSAGES));
          return INITIAL_MESSAGES;
        }
        return parsed;
      } catch {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  const [financialEntries, setFinancialEntries] = useState<OfficeFinancialEntry[]>(() => {
    const saved = localStorage.getItem('paprica_finances');
    if (saved) {
      try {
        const parsed: OfficeFinancialEntry[] = JSON.parse(saved);
        const hasObsolete = parsed.some((f) => f.clientOrApartmentName?.includes('Cláudia & Roberto'));
        if (hasObsolete) {
          localStorage.setItem('paprica_finances', JSON.stringify(INITIAL_FINANCIAL_ENTRIES));
          return INITIAL_FINANCIAL_ENTRIES;
        }
        return parsed;
      } catch {
        return INITIAL_FINANCIAL_ENTRIES;
      }
    }
    return INITIAL_FINANCIAL_ENTRIES;
  });

  const [teamMoods, setTeamMoods] = useState<MemberDailyMood[]>(() => {
    const saved = localStorage.getItem('paprica_team_moods');
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MOODS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('paprica_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('paprica_team_moods', JSON.stringify(teamMoods));
  }, [teamMoods]);

  useEffect(() => {
    localStorage.setItem('paprica_info', JSON.stringify(papricaInfo));
  }, [papricaInfo]);

  useEffect(() => {
    localStorage.setItem('urbano_info', JSON.stringify(urbanoInfo));
  }, [urbanoInfo]);

  useEffect(() => {
    localStorage.setItem('paprica_clients', JSON.stringify(papricaClients));
  }, [papricaClients]);

  useEffect(() => {
    localStorage.setItem('paprica_consultorias', JSON.stringify(consultoriaClients));
  }, [consultoriaClients]);

  useEffect(() => {
    localStorage.setItem('urbano_apartments', JSON.stringify(urbanoApartments));
  }, [urbanoApartments]);

  useEffect(() => {
    localStorage.setItem('paprica_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('paprica_sites', JSON.stringify(suggestedSites));
  }, [suggestedSites]);

  useEffect(() => {
    localStorage.setItem('paprica_docs', JSON.stringify(officeDocuments));
  }, [officeDocuments]);

  useEffect(() => {
    localStorage.setItem('paprica_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('paprica_finances', JSON.stringify(financialEntries));
  }, [financialEntries]);

  // Current user profile
  const currentUserProfile = useMemo(() => {
    return TEAM_MEMBERS.find((u) => u.id === currentUser) || TEAM_MEMBERS[0];
  }, [currentUser]);

  // Task Status helper
  const getTaskStatus = (dueDate: string, completed: boolean): TaskStatus => {
    if (completed) return 'completed';
    if (!dueDate) return 'on_time';
    
    const today = new Date(TODAY).getTime();
    const due = new Date(dueDate).getTime();
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays <= 3) return 'attention';
    return 'on_time';
  };

  // Calmaria Index calculation & Critical tasks list
  const { calmariaIndex, criticalItems } = useMemo(() => {
    const items: CriticalItem[] = [];

    // Helper to evaluate a task
    const evaluate = (
      task: TaskItem,
      origin: string,
      originType: 'paprica' | 'consultoria' | 'urbano',
      originId: string
    ) => {
      if (task.completed || !task.dueDate) return;
      const today = new Date(TODAY).getTime();
      const due = new Date(task.dueDate).getTime();
      const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        items.push({
          id: task.id,
          title: task.title,
          origin,
          originType,
          originId,
          assignee: task.assignee,
          dueDate: task.dueDate,
          status: 'overdue',
          daysDiff: diffDays,
        });
      } else if (diffDays <= 3) {
        items.push({
          id: task.id,
          title: task.title,
          origin,
          originType,
          originId,
          assignee: task.assignee,
          dueDate: task.dueDate,
          status: 'attention',
          daysDiff: diffDays,
        });
      }
    };

    // 1. Check all Páprica tasks
    papricaClients.forEach((client) => {
      // Briefing
      client.briefing.tasks.forEach((t) =>
        evaluate(t, `Páprica: ${client.name}`, 'paprica', client.id)
      );
      // Prelim study
      Object.values(client.preliminaryStudy.tasks).forEach((t) =>
        evaluate(t, `Páprica: ${client.name}`, 'paprica', client.id)
      );
      // Revisions
      client.revisions.forEach((rev) => {
        rev.topics.forEach((t) =>
          evaluate(t, `Páprica: ${client.name} (Rev ${rev.roundNumber})`, 'paprica', client.id)
        );
      });
      // Executive
      Object.values(client.executive).forEach((t) =>
        evaluate(t, `Páprica: ${client.name} (Executivo)`, 'paprica', client.id)
      );
    });

    // 2. Check Consultorias
    consultoriaClients.forEach((client) => {
      client.tasks.forEach((t) =>
        evaluate(t, `Consultoria: ${client.name}`, 'consultoria', client.id)
      );
    });

    // 3. Check Urbano cleanings & maintenances
    urbanoApartments.forEach((apt) => {
      apt.cleanings.forEach((c) => {
        if (!c.completed) {
          evaluate(
            {
              id: c.id,
              title: `Limpeza: ${c.cleanerName} (${c.notes || 'Preparação de hóspedes'})`,
              completed: false,
              assignee: c.cleanerName,
              dueDate: c.date,
              notes: c.notes,
            },
            `Urbano: ${apt.code}`,
            'urbano',
            apt.id
          );
        }
      });
      apt.maintenances.forEach((m) => {
        if (m.status !== 'concluido') {
          evaluate(
            {
              id: m.id,
              title: `Manutenção: ${m.title}`,
              completed: false,
              assignee: m.responsible,
              dueDate: m.scheduledDate,
              notes: m.notes,
            },
            `Urbano: ${apt.code}`,
            'urbano',
            apt.id
          );
        }
      });
    });

    // Sort: overdue first (most negative diff), then attention
    items.sort((a, b) => a.daysDiff - b.daysDiff);

    const overdueCount = items.filter((i) => i.status === 'overdue').length;
    const attentionCount = items.filter((i) => i.status === 'attention').length;

    // Formula: Calmaria = max(0, 100 - (15 * overdue + 5 * attention))
    const index = Math.max(0, 100 - (overdueCount * 15 + attentionCount * 5));

    return { calmariaIndex: index, criticalItems: items };
  }, [papricaClients, consultoriaClients, urbanoApartments]);

  // Universal Task handlers
  const togglePapricaTask = (
    clientId: string,
    section: 'briefing' | 'preliminaryStudy' | 'executive' | 'revisions',
    taskId: string,
    revisionId?: string
  ) => {
    setPapricaClients((prev) =>
      prev.map((client) => {
        if (client.id !== clientId) return client;
        const updated = { ...client };
        const nowStr = `${TODAY} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

        if (section === 'briefing') {
          updated.briefing.tasks = updated.briefing.tasks.map((t) => {
            if (t.id === taskId) {
              const nextState = !t.completed;
              return {
                ...t,
                completed: nextState,
                completedBy: nextState ? currentUser : undefined,
                completedAt: nextState ? nowStr : undefined,
              };
            }
            return t;
          });
        } else if (section === 'preliminaryStudy') {
          const tasks = { ...updated.preliminaryStudy.tasks };
          Object.keys(tasks).forEach((k) => {
            const key = k as keyof typeof tasks;
            if (tasks[key].id === taskId) {
              const nextState = !tasks[key].completed;
              tasks[key] = {
                ...tasks[key],
                completed: nextState,
                completedBy: nextState ? currentUser : undefined,
                completedAt: nextState ? nowStr : undefined,
              };
            }
          });
          updated.preliminaryStudy.tasks = tasks;
        } else if (section === 'executive') {
          const exec = { ...updated.executive };
          Object.keys(exec).forEach((k) => {
            const key = k as keyof typeof exec;
            if (exec[key].id === taskId) {
              const nextState = !exec[key].completed;
              exec[key] = {
                ...exec[key],
                completed: nextState,
                completedBy: nextState ? currentUser : undefined,
                completedAt: nextState ? nowStr : undefined,
              };
            }
          });
          updated.executive = exec;
        } else if (section === 'revisions' && revisionId) {
          updated.revisions = updated.revisions.map((rev) => {
            if (rev.id !== revisionId) return rev;
            return {
              ...rev,
              topics: rev.topics.map((t) => {
                if (t.id === taskId) {
                  const nextState = !t.completed;
                  return {
                    ...t,
                    completed: nextState,
                    completedBy: nextState ? currentUser : undefined,
                    completedAt: nextState ? nowStr : undefined,
                  };
                }
                return t;
              }),
            };
          });
        }

        // Automatic stage advancement
        const allPrelimDone = Object.values(updated.preliminaryStudy.tasks).every((t) => t.completed);
        if (allPrelimDone && updated.currentStage === 'estudo_preliminar') {
          updated.currentStage = 'aprovacao';
        }

        const allExecDone = Object.values(updated.executive).every((t) => t.completed);
        if (allExecDone && updated.currentStage === 'executivo') {
          updated.currentStage = 'fornecedores';
        }

        return updated;
      })
    );
  };

  const updatePapricaTask = (
    clientId: string,
    section: 'briefing' | 'preliminaryStudy' | 'executive' | 'revisions',
    taskId: string,
    updates: Partial<TaskItem>,
    revisionId?: string
  ) => {
    setPapricaClients((prev) =>
      prev.map((client) => {
        if (client.id !== clientId) return client;
        const updated = { ...client };

        if (section === 'briefing') {
          updated.briefing.tasks = updated.briefing.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
        } else if (section === 'preliminaryStudy') {
          const tasks = { ...updated.preliminaryStudy.tasks };
          Object.keys(tasks).forEach((k) => {
            const key = k as keyof typeof tasks;
            if (tasks[key].id === taskId) {
              tasks[key] = { ...tasks[key], ...updates };
            }
          });
          updated.preliminaryStudy.tasks = tasks;
        } else if (section === 'executive') {
          const exec = { ...updated.executive };
          Object.keys(exec).forEach((k) => {
            const key = k as keyof typeof exec;
            if (exec[key].id === taskId) {
              exec[key] = { ...exec[key], ...updates };
            }
          });
          updated.executive = exec;
        } else if (section === 'revisions' && revisionId) {
          updated.revisions = updated.revisions.map((rev) => {
            if (rev.id !== revisionId) return rev;
            return {
              ...rev,
              topics: rev.topics.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
            };
          });
        }
        return updated;
      })
    );
  };

  const toggleConsultoriaTask = (clientId: string, taskId: string) => {
    setConsultoriaClients((prev) =>
      prev.map((client) => {
        if (client.id !== clientId) return client;
        const nowStr = `${TODAY} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        return {
          ...client,
          tasks: client.tasks.map((t) => {
            if (t.id === taskId) {
              const nextState = !t.completed;
              return {
                ...t,
                completed: nextState,
                completedBy: nextState ? currentUser : undefined,
                completedAt: nextState ? nowStr : undefined,
              };
            }
            return t;
          }),
        };
      })
    );
  };

  const updateConsultoriaTask = (clientId: string, taskId: string, updates: Partial<TaskItem>) => {
    setConsultoriaClients((prev) =>
      prev.map((client) => {
        if (client.id !== clientId) return client;
        return {
          ...client,
          tasks: client.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
        };
      })
    );
  };

  const setPapricaApprovalDecision = (
    clientId: string,
    decision: 'aprovado' | 'alteracoes' | 'pendente',
    revisionNotes?: string
  ) => {
    setPapricaClients((prev) =>
      prev.map((client) => {
        if (client.id !== clientId) return client;
        const updated = { ...client, approvalDecision: decision };

        if (decision === 'aprovado') {
          // Unlocks Executivo automatically!
          updated.currentStage = 'executivo';
        } else if (decision === 'alteracoes') {
          // Creates a new revision round
          const nextRound = client.revisions.length + 1;
          const newRev = {
            id: `rev-${Date.now()}`,
            roundNumber: nextRound,
            date: TODAY,
            status: 'em_andamento' as const,
            clientFeedbackNotes: revisionNotes || 'Alterações solicitadas pelo cliente.',
            topics: [
              {
                id: `rev-topic-${Date.now()}`,
                title: 'Revisar apontamentos do cliente e alinhar alterações',
                completed: false,
                assignee: 'Nath',
                dueDate: TODAY,
                notes: revisionNotes || '',
              },
            ],
          };
          updated.revisions = [...client.revisions, newRev];
        }
        return updated;
      })
    );
  };

  const addRevisionTopic = (
    clientId: string,
    roundNumber: number,
    title: string,
    assignee: string,
    dueDate: string
  ) => {
    setPapricaClients((prev) =>
      prev.map((client) => {
        if (client.id !== clientId) return client;
        return {
          ...client,
          revisions: client.revisions.map((rev) => {
            if (rev.roundNumber !== roundNumber) return rev;
            const newTopic: TaskItem = {
              id: `rev-t-${Date.now()}`,
              title,
              completed: false,
              assignee,
              dueDate,
              notes: '',
            };
            return {
              ...rev,
              topics: [...rev.topics, newTopic],
            };
          }),
        };
      })
    );
  };

  const addPapricaClientPurchaseRT = (
    clientId: string,
    item: Omit<ClientRTItem, 'id' | 'rtCalculatedValue'>
  ) => {
    const calcValue = item.purchaseAmount * (item.rtPercentage / 100);
    const newItem: ClientRTItem = {
      ...item,
      id: `rt-${Date.now()}`,
      rtCalculatedValue: calcValue,
    };

    setPapricaClients((prev) =>
      prev.map((client) => {
        if (client.id !== clientId) return client;
        return {
          ...client,
          clientPurchasesRT: [...client.clientPurchasesRT, newItem],
        };
      })
    );

    // Also register in office finances
    const newEntry: OfficeFinancialEntry = {
      id: `fin-rt-${Date.now()}`,
      company: 'paprica',
      type: 'rt_comissao',
      category: 'Reserva Técnica (RT)',
      description: `Comissão ${item.rtPercentage}% sobre ${item.item} (${item.store})`,
      clientOrApartmentName: papricaClients.find((c) => c.id === clientId)?.name || 'Cliente Páprica',
      amount: calcValue,
      date: item.paymentDate || TODAY,
      status: item.status === 'recebido' ? 'recebido' : 'a_receber',
    };
    setFinancialEntries((prev) => [newEntry, ...prev]);
  };

  const updatePapricaClient = (clientId: string, updates: Partial<PapricaClient>) => {
    setPapricaClients((prev) =>
      prev.map((client) => (client.id === clientId ? { ...client, ...updates } : client))
    );
  };

  const addNewPapricaClient = (clientData: Partial<PapricaClient>) => {
    const nextCodeNum = papricaClients.length + 1;
    const code = `PAP-0${nextCodeNum}`;
    const newClient: PapricaClient = {
      id: `pap-cli-${Date.now()}`,
      code,
      name: clientData.name || 'Novo Cliente',
      address: clientData.address || 'Copacabana, Rio de Janeiro - RJ',
      neighborhood: clientData.neighborhood || 'Copacabana',
      phone: clientData.phone || '(21) 99999-0000',
      email: clientData.email || '',
      description: clientData.description || 'Projeto de Arquitetura e Interiores',
      services: clientData.services || ['arquitetura_completa', 'layout_3d', 'executivo'],
      contractStatus: clientData.contractStatus || 'rascunho',
      contractValue: clientData.contractValue || 35000,
      paidAmount: 0,
      excelSpreadsheetUrl: clientData.excelSpreadsheetUrl || '',
      startDate: TODAY,
      estimatedDeliveryDate: '2026-12-20',
      currentStage: 'briefing',
      approvalDecision: 'pendente',
      briefing: {
        formCompleted: false,
        familyProfile: '',
        budget: '',
        stylePreferences: '',
        notes: '',
        tasks: [
          {
            id: `tsk-br-${Date.now()}`,
            title: 'Reunião de alinhamento e briefing com os clientes',
            completed: false,
            assignee: 'Nath',
            dueDate: TODAY,
            notes: '',
          },
        ],
      },
      preliminaryStudy: {
        moodboardUrls: [],
        caseStudiesNotes: '',
        tasks: {
          levantamento: { id: `tsk-lev-${Date.now()}`, title: '00 Levantamento métrico e fotográfico', completed: false, assignee: 'Jade', dueDate: TODAY, notes: '' },
          layoutOpcao1: { id: `tsk-lay1-${Date.now()}`, title: '01 Layout Opção 1', completed: false, assignee: 'Nath', dueDate: TODAY, notes: '' },
          layoutOpcao2: { id: `tsk-lay2-${Date.now()}`, title: '01 Layout Opção 2', completed: false, assignee: 'Nath', dueDate: TODAY, notes: '' },
          renders3D: { id: `tsk-ren-${Date.now()}`, title: 'Modelagem 3D e Renders', completed: false, assignee: 'Jade', dueDate: TODAY, notes: '' },
        },
      },
      revisions: [],
      executive: {
        demolirConstruir: { id: `ex-02-${Date.now()}`, title: '02 Planta Demolir/Construir', completed: false, assignee: 'Jade', dueDate: TODAY, notes: '' },
        marcenaria: { id: `ex-03-${Date.now()}`, title: '03 Caderno de Marcenaria', completed: false, assignee: 'Nath', dueDate: TODAY, notes: '' },
        paginacaoRevestimentos: { id: `ex-04-${Date.now()}`, title: '04 Paginação de Revestimentos', completed: false, assignee: 'Jade', dueDate: TODAY, notes: '' },
        marmoraria: { id: `ex-05-${Date.now()}`, title: '05 Caderno de Marmoraria', completed: false, assignee: 'Jade', dueDate: TODAY, notes: '' },
        blindex: { id: `ex-06-${Date.now()}`, title: '06 Blindex e Vidros', completed: false, assignee: 'Nath', dueDate: TODAY, notes: '' },
        hidraulico: { id: `ex-07-${Date.now()}`, title: '07 Pontos Hidráulicos', completed: false, assignee: 'André', dueDate: TODAY, notes: '' },
        eletrico: { id: `ex-08-${Date.now()}`, title: '08 Pontos Elétricos', completed: false, assignee: 'André', dueDate: TODAY, notes: '' },
        luminotecnico: { id: `ex-09-${Date.now()}`, title: '09 Luminotécnico e Circuitos', completed: false, assignee: 'Nath', dueDate: TODAY, notes: '' },
      },
      executiveDelivery: {
        deliveryDate: '2026-12-15',
        clientApproved: false,
        notes: '',
      },
      suppliers: [],
      deliveries: [],
      clientPurchasesRT: [],
      digitalContent: {
        photos: [],
        instagramPostStatus: 'planejado',
        notes: '',
      },
    };

    setPapricaClients((prev) => [newClient, ...prev]);
    setSelectedPapricaClientId(newClient.id);
  };

  // Urbano handlers
  const addUrbanoReservation = (
    apartmentId: string,
    reservation: Omit<UrbanoReservation, 'id' | 'nights'>
  ) => {
    const checkInDate = new Date(reservation.checkIn);
    const checkOutDate = new Date(reservation.checkOut);
    const nights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));

    const newRes: UrbanoReservation = {
      ...reservation,
      id: `res-${Date.now()}`,
      nights,
      reviewedBy: currentUser,
    };

    setUrbanoApartments((prev) =>
      prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;
        // Automatic check-out cleaning generated!
        const cleaningDate = reservation.checkOut;
        const autoCleaning = {
          id: `cln-auto-${Date.now()}`,
          apartmentId,
          date: cleaningDate,
          cleanerName: apt.defaultCleaner,
          completed: false,
          notes: `Limpeza automática pós-checkout de ${reservation.guestName} (${nights} noites).`,
          fromReservationGuest: reservation.guestName,
          checkInTime: '11:00 às 14:00',
        };

        return {
          ...apt,
          reservations: [newRes, ...apt.reservations],
          cleanings: [autoCleaning, ...apt.cleanings],
        };
      })
    );

    // Register revenue in finance
    const newEntry: OfficeFinancialEntry = {
      id: `fin-urb-${Date.now()}`,
      company: 'urbano',
      type: 'receita',
      category: 'Diárias de Hospedagem',
      description: `Reserva ${reservation.guestName} (${nights} noites)`,
      clientOrApartmentName: urbanoApartments.find((a) => a.id === apartmentId)?.code || 'Apartamento Urbano.s',
      amount: reservation.totalAmount,
      date: reservation.checkIn,
      status: 'recebido',
    };
    setFinancialEntries((prev) => [newEntry, ...prev]);
  };

  const toggleUrbanoCleaning = (apartmentId: string, cleaningId: string) => {
    setUrbanoApartments((prev) =>
      prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;
        const nowStr = `${TODAY} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        return {
          ...apt,
          cleanings: apt.cleanings.map((c) => {
            if (c.id === cleaningId) {
              const next = !c.completed;
              return {
                ...c,
                completed: next,
                completedAt: next ? nowStr : undefined,
              };
            }
            return c;
          }),
        };
      })
    );
  };

  const addUrbanoCleaning = (
    apartmentId: string,
    cleanerName: string,
    date: string,
    notes: string
  ) => {
    setUrbanoApartments((prev) =>
      prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;
        const newCleaning = {
          id: `cln-${Date.now()}`,
          apartmentId,
          date,
          cleanerName,
          completed: false,
          notes,
        };
        return {
          ...apt,
          cleanings: [newCleaning, ...apt.cleanings],
        };
      })
    );
  };

  const toggleUrbanoPantry = (apartmentId: string, pantryItemId: string) => {
    setUrbanoApartments((prev) =>
      prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;
        return {
          ...apt,
          pantry: apt.pantry.map((p) => {
            if (p.id === pantryItemId) {
              const next = !p.restocked;
              return {
                ...p,
                restocked: next,
                responsible: currentUser,
                lastRestockedDate: TODAY,
                currentQuantity: next ? p.targetQuantity : p.currentQuantity,
              };
            }
            return p;
          }),
        };
      })
    );
  };

  const updateUrbanoPantry = (apartmentId: string, pantryItemId: string, currentQty: number) => {
    setUrbanoApartments((prev) =>
      prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;
        return {
          ...apt,
          pantry: apt.pantry.map((p) => {
            if (p.id === pantryItemId) {
              return {
                ...p,
                currentQuantity: currentQty,
                restocked: currentQty >= p.targetQuantity,
                responsible: currentUser,
                lastRestockedDate: TODAY,
              };
            }
            return p;
          }),
        };
      })
    );
  };

  const updateUrbanoApartment = (apartmentId: string, updates: Partial<UrbanoApartment>) => {
    setUrbanoApartments((prev) =>
      prev.map((apt) => (apt.id === apartmentId ? { ...apt, ...updates } : apt))
    );
  };

  // Suppliers & Sites
  const addSupplier = (supplier: Omit<Supplier, 'id' | 'activeProjectsCount'>) => {
    const newSup: Supplier = {
      ...supplier,
      id: `sup-${Date.now()}`,
      activeProjectsCount: 0,
    };
    setSuppliers((prev) => [newSup, ...prev]);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const addSuggestedSite = (site: Omit<SuggestedSite, 'id'>) => {
    const newSite: SuggestedSite = {
      ...site,
      id: `site-${Date.now()}`,
    };
    setSuggestedSites((prev) => [newSite, ...prev]);
  };

  // Messages
  const sendMessage = (text: string, mentions: TeamMember[] = [], relatedTo?: TeamMessage['relatedTo']) => {
    const newMsg: TeamMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser,
      timestamp: new Date().toISOString(),
      text,
      mentions,
      relatedTo,
      isRead: false,
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const markMessageRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m))
    );
  };

  // Documents
  const updateDocumentContent = (id: string, content: string) => {
    setOfficeDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, content, lastUpdated: TODAY } : doc))
    );
  };

  const addOfficeDocument = (doc: Omit<OfficeDocument, 'id' | 'lastUpdated'>): OfficeDocument => {
    const newDoc: OfficeDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      lastUpdated: TODAY,
      isImported: doc.isImported ?? true,
    };
    setOfficeDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const updateOfficeDocument = (id: string, updates: Partial<OfficeDocument>) => {
    setOfficeDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, ...updates, lastUpdated: TODAY } : doc
      )
    );
  };

  const deleteOfficeDocument = (id: string) => {
    setOfficeDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  // Team Mood
  const updateMemberMood = (member: TeamMember, updates: Partial<MemberDailyMood>) => {
    setTeamMoods((prev) =>
      prev.map((m) =>
        m.member === member
          ? {
              ...m,
              ...updates,
              updatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            }
          : m
      )
    );
  };

  // Reset to default
  const resetToDefaultData = () => {
    localStorage.clear();
    setPapricaClients(INITIAL_PAPRICA_CLIENTS);
    setConsultoriaClients(INITIAL_CONSULTORIAS);
    setUrbanoApartments(INITIAL_URBANO_APARTMENTS);
    setSuppliers(INITIAL_SUPPLIERS);
    setSuggestedSites(INITIAL_SUGGESTED_SITES);
    setOfficeDocuments(INITIAL_OFFICE_DOCUMENTS);
    setMessages(INITIAL_MESSAGES);
    setFinancialEntries(INITIAL_FINANCIAL_ENTRIES);
    setTeamMoods(INITIAL_TEAM_MOODS);
    setPapricaInfo(INITIAL_PAPRICA_INFO);
    setUrbanoInfo(INITIAL_URBANO_INFO);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentUserProfile,
        activeTab,
        setActiveTab,
        selectedPapricaClientId,
        setSelectedPapricaClientId,
        selectedUrbanoAptId,
        setSelectedUrbanoAptId,
        selectedConsultoriaId,
        setSelectedConsultoriaId,
        isCalmariaDrawerOpen,
        setIsCalmariaDrawerOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        calmariaIndex,
        criticalItems,
        papricaClients,
        consultoriaClients,
        urbanoApartments,
        suppliers,
        suggestedSites,
        officeDocuments,
        technicalFiles,
        messages,
        financialEntries,
        papricaInfo,
        setPapricaInfo,
        urbanoInfo,
        setUrbanoInfo,
        togglePapricaTask,
        updatePapricaTask,
        toggleConsultoriaTask,
        updateConsultoriaTask,
        setPapricaApprovalDecision,
        addRevisionTopic,
        addPapricaClientPurchaseRT,
        updatePapricaClient,
        addNewPapricaClient,
        addUrbanoReservation,
        toggleUrbanoCleaning,
        addUrbanoCleaning,
        toggleUrbanoPantry,
        updateUrbanoPantry,
        updateUrbanoApartment,
        addSupplier,
        updateSupplier,
        addSuggestedSite,
        sendMessage,
        markMessageRead,
        updateDocumentContent,
        addOfficeDocument,
        updateOfficeDocument,
        deleteOfficeDocument,
        teamMoods,
        updateMemberMood,
        resetToDefaultData,
        getTaskStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
