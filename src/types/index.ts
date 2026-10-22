export type TeamMember = 'André' | 'Nath' | 'Manu' | 'Jade';

export type TeamMoodType =
  | 'focado'
  | 'inspirado'
  | 'produtivo'
  | 'calmo'
  | 'cansado'
  | 'sobrecarregado';

export interface MemberDailyMood {
  member: TeamMember;
  mood: TeamMoodType;
  emoji: string;
  label: string;
  energyLevel: number; // 1 a 5
  dailyFocus: string;
  updatedAt: string;
}

export interface UserProfile {
  id: TeamMember;
  name: string;
  role: string;
  focus: string;
  access: 'total' | 'paprica_consultorias' | 'urbano_orcamentos';
  avatarInitials: string;
  color: string;
}

export type TaskStatus = 'on_time' | 'attention' | 'overdue' | 'completed';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type?: 'file' | 'link' | 'image' | 'excel';
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  assignee: string; // TeamMember | 'Fornecedor' | 'Faxineira' | custom name
  dueDate: string; // YYYY-MM-DD
  notes: string;
  attachments?: Attachment[];
  completedBy?: string;
  completedAt?: string;
  category?: string;
}

export interface RevisionRound {
  id: string;
  roundNumber: number;
  date: string;
  status: 'em_andamento' | 'concluida';
  topics: TaskItem[];
  clientFeedbackNotes: string;
}

export interface PapricaSupplierQuote {
  id: string;
  supplierId: string;
  supplierName: string;
  serviceCategory: string;
  amount: number;
  status: 'cotando' | 'fechado' | 'em_producao' | 'entregue';
  quoteDate: string;
  notes: string;
  invoiceUrl?: string;
}

export interface ProjectDelivery {
  id: string;
  item: string;
  supplierName: string;
  storeOrBrand: string;
  expectedDate: string;
  actualDate?: string;
  status: 'comprado' | 'em_producao' | 'em_transito' | 'entregue' | 'atrasado';
  notes: string;
  invoiceOrTrackingUrl?: string;
}

export interface ClientRTItem {
  id: string;
  item: string;
  store: string;
  purchaseAmount: number;
  rtPercentage: number; // e.g. 10 for 10%
  rtCalculatedValue: number; // purchaseAmount * (rtPercentage / 100)
  status: 'pendente' | 'recebido';
  paymentDate?: string;
  invoiceNumber?: string;
}

export interface PapricaClient {
  id: string;
  name: string;
  code: string; // e.g. PAP-01
  address: string;
  neighborhood: string; // Copacabana, Ipanema, etc.
  phone: string;
  email: string;
  description: string;
  services: ('arquitetura_completa' | 'reforma' | 'interiores' | 'layout_3d' | 'executivo' | 'consultoria' | 'acompanhamento')[];
  contractStatus: 'rascunho' | 'enviado' | 'assinado';
  contractValue: number;
  paidAmount: number;
  excelSpreadsheetUrl: string; // link to Google Drive / Excel sheet
  contractFileUrl?: string;
  startDate: string;
  estimatedDeliveryDate: string;
  currentStage: 'briefing' | 'estudo_preliminar' | 'aprovacao' | 'executivo' | 'fornecedores' | 'entregas' | 'concluido';
  approvalDecision: 'pendente' | 'aprovado' | 'alteracoes';
  
  // Stages:
  briefing: {
    formCompleted: boolean;
    familyProfile: string;
    budget: string;
    stylePreferences: string;
    notes: string;
    tasks: TaskItem[];
  };
  preliminaryStudy: {
    moodboardUrls: string[];
    caseStudiesNotes: string;
    tasks: {
      levantamento: TaskItem;
      layoutOpcao1: TaskItem;
      layoutOpcao2: TaskItem;
      renders3D: TaskItem;
    };
  };
  revisions: RevisionRound[];
  executive: {
    demolirConstruir: TaskItem;
    marcenaria: TaskItem;
    paginacaoRevestimentos: TaskItem;
    marmoraria: TaskItem;
    blindex: TaskItem;
    hidraulico: TaskItem;
    eletrico: TaskItem;
    luminotecnico: TaskItem;
  };
  executiveDelivery: {
    deliveryDate: string;
    clientApproved: boolean;
    notes: string;
  };
  suppliers: PapricaSupplierQuote[];
  deliveries: ProjectDelivery[];
  clientPurchasesRT: ClientRTItem[];
  digitalContent: {
    photos: { id: string; url: string; caption: string; isBeforeAfter: boolean }[];
    instagramPostStatus: 'planejado' | 'em_edicao' | 'postado' | 'stories_ativos';
    scheduledPostDate?: string;
    notes: string;
  };
}

export interface ConsultoriaProduct {
  id: string;
  name: string;
  category: string;
  store: string;
  storeUrl: string;
  price: number;
  status: 'sugerido' | 'aprovado' | 'comprado' | 'descartado';
  notes: string;
  imageUrl?: string;
}

export interface ConsultoriaClient {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  contractStatus: 'rascunho' | 'enviado' | 'assinado';
  contractValue: number;
  services: string[];
  tasks: TaskItem[];
  suggestedProducts: ConsultoriaProduct[];
  notes: string;
}

export interface UrbanoReservation {
  id: string;
  apartmentId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guestCount: number;
  channel: 'airbnb' | 'booking' | 'direto' | 'site';
  totalAmount: number;
  cleaningFee: number;
  screeningStatus: 'aprovado' | 'em_analise' | 'recusado';
  screeningNotes: string;
  conversationNotes: string;
  reviewedBy: string;
}

export interface UrbanoCleaning {
  id: string;
  apartmentId: string;
  date: string;
  cleanerName: string;
  cleanerPhone?: string;
  completed: boolean;
  notes: string;
  fromReservationGuest?: string;
  checkInTime?: string;
  completedAt?: string;
}

export interface UrbanoInventoryItem {
  id: string;
  name: string;
  category: 'cozinha' | 'sala' | 'quarto' | 'banheiro' | 'eletronicos' | 'decoracao';
  standardQuantity: number;
  currentQuantity: number;
  damaged: boolean;
  damageReport?: string;
  lastCheckedDate: string;
}

export interface UrbanoPantryItem {
  id: string;
  name: string;
  category: 'comida' | 'bebida' | 'amenities' | 'limpeza';
  targetQuantity: number;
  currentQuantity: number;
  unit: string; // un, cx, garrafa, pct
  restocked: boolean;
  responsible: string;
  lastRestockedDate: string;
}

export interface UrbanoMaintenance {
  id: string;
  title: string;
  category: 'ar_condicionado' | 'eletrica' | 'hidraulica' | 'fechadura' | 'pintura' | 'outro';
  scheduledDate: string;
  responsible: string;
  status: 'pendente' | 'em_andamento' | 'concluido';
  cost: number;
  notes: string;
  completedAt?: string;
}

export interface UrbanoApartment {
  id: string; // e.g. "urbano-304"
  code: string; // e.g. "Urbano 304"
  address: string;
  neighborhood: string;
  capacity: number; // e.g. 4 hóspedes
  bedrooms: number;
  bathrooms: number;
  listingUrl: string;
  passwords: {
    wifiNetwork: string;
    wifiPassword: string;
    electronicDoorLock: string;
    buildingAccessCode: string;
    gateNotes: string;
  };
  defaultCleaner: string;
  statusToday: 'ocupado' | 'livre' | 'limpeza_hoje';
  currentGuestName?: string;
  notes: string;
  coverImage?: string;
  photos: string[];
  reservations: UrbanoReservation[];
  cleanings: UrbanoCleaning[];
  inventory: UrbanoInventoryItem[];
  pantry: UrbanoPantryItem[];
  maintenances: UrbanoMaintenance[];
  digitalContent: {
    instagramStatus: 'planejado' | 'em_edicao' | 'postado';
    highlightUrl?: string;
  };
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  specialty: 'Marcenaria' | 'Marmoraria' | 'Blindex & Vidros' | 'Serralheria' | 'Luminotécnica' | 'Elétrica' | 'Pintura' | 'Revestimentos' | 'Gesso' | 'Automação' | 'Climatização' | 'Tapeçaria & Cortinas';
  phone: string; // for whatsapp
  email: string;
  address?: string;
  rating: number; // 1 to 5
  notes: string;
  activeProjectsCount: number;
}

export interface SuggestedSite {
  id: string;
  name: string;
  category: 'Móveis & Design' | 'Iluminação' | 'Decoração & Objetos' | 'Enxoval & Airbnb' | 'Banho & Cama' | 'Revestimentos & Metais' | 'Eletros';
  url: string;
  discountCoupon?: string;
  notes: string;
  featured: boolean;
}

export interface OfficeDocument {
  id: string;
  title: string;
  category: 'Contratos' | 'Propostas' | 'Briefings' | 'Termos de Aprovação' | 'Checklists de Vistoria' | 'Importados' | string;
  description: string;
  lastUpdated: string;
  content: string; // text template
  downloadUrl?: string;
  sourceFileName?: string;
  isImported?: boolean;
  fileSize?: string;
}

export interface TechnicalFile {
  id: string;
  title: string;
  category: 'DWG Base' | 'Blocos CAD & 3D' | 'Especificações' | 'CTB & Penas' | 'Templates & Detalhes';
  fileType: 'DWG' | 'CTB' | 'PDF' | 'SKP' | 'RVT';
  fileSize: string;
  description: string;
  downloadUrl: string;
  tags: string[];
}

export interface TeamMessage {
  id: string;
  sender: TeamMember;
  timestamp: string; // ISO
  text: string;
  mentions: TeamMember[];
  relatedTo?: {
    type: 'paprica_client' | 'urbano_apartment' | 'task';
    id: string;
    name: string;
  };
  isRead: boolean;
}

export interface OfficeFinancialEntry {
  id: string;
  company: 'paprica' | 'urbano';
  type: 'receita' | 'despesa' | 'rt_comissao';
  category: string;
  description: string;
  clientOrApartmentName: string;
  amount: number;
  date: string;
  status: 'recebido' | 'a_receber' | 'pago' | 'a_pagar';
  invoiceOrDocUrl?: string;
}
