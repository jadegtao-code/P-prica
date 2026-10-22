import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CalmariaDrawer } from './components/CalmariaDrawer';
import { GeneralDashboard } from './screens/GeneralDashboard';
import { PapricaModule } from './screens/PapricaModule';
import { ConsultoriasModule } from './screens/ConsultoriasModule';
import { UrbanoModule } from './screens/UrbanoModule';
import { FinanceModule } from './screens/FinanceModule';
import { DeadlinesModule } from './screens/DeadlinesModule';
import { SuppliersModule } from './screens/SuppliersModule';
import { SuggestedSitesModule } from './screens/SuggestedSitesModule';
import { OfficeDocsModule } from './screens/OfficeDocsModule';
import { TechFilesModule } from './screens/TechFilesModule';
import { MessagesModule } from './screens/MessagesModule';
import { TeamMoodPerformanceModule } from './screens/TeamMoodPerformanceModule';
import { MapPin, Phone, Instagram, Globe } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, papricaInfo, urbanoInfo } = useApp();

  return (
    <div className="min-h-screen flex bg-[#F5F2EB] font-sans text-[#1C1917] antialiased selection:bg-[#722F37] selection:text-white">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header with Breadcrumb and Calmaria Gauge */}
        <Header />

        {/* Global Calmaria Drawer */}
        <CalmariaDrawer />

        {/* Viewport Screen Router */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
          {activeTab === 'dashboard' && <GeneralDashboard />}
          {activeTab === 'team_mood' && <TeamMoodPerformanceModule />}
          {activeTab === 'paprica' && <PapricaModule />}
          {activeTab === 'consultorias' && <ConsultoriasModule />}
          {activeTab === 'urbano' && <UrbanoModule />}
          {activeTab === 'finance' && <FinanceModule />}
          {activeTab === 'deadlines' && <DeadlinesModule />}
          {activeTab === 'suppliers' && <SuppliersModule />}
          {activeTab === 'sites' && <SuggestedSitesModule />}
          {activeTab === 'docs' && <OfficeDocsModule />}
          {activeTab === 'tech' && <TechFilesModule />}
          {activeTab === 'messages' && <MessagesModule />}
        </main>

        {/* Unified Sectorized Footer: Clean, Elegant Architectural Beige */}
        <footer className="bg-[#ECE8DF] border-t border-[#DDD6C8] mt-12 py-8 text-xs text-[#634832]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Páprica footer column */}
            <div className="space-y-2 p-5 rounded-2xl border border-[#E5D7D9] bg-white shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#722F37]" />
                <span className="font-bold text-[#722F37] text-sm tracking-tight">
                  Páprica Arquitetura e Interiores
                </span>
                <span className="text-[10px] text-[#8C6D58] font-mono">
                  CNPJ: {papricaInfo.cnpj}
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-[#634832]">
                <MapPin className="w-3.5 h-3.5 text-[#722F37] shrink-0" />
                {papricaInfo.address}
              </p>
              <div className="flex items-center gap-4 pt-1">
                <span className="flex items-center gap-1 text-[#1C1917] font-semibold">
                  <Phone className="w-3 h-3 text-[#722F37]" /> {papricaInfo.phone}
                </span>
                <a
                  href="https://instagram.com/paprica.arquitetura"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#722F37] hover:text-[#50131B] flex items-center gap-1 font-semibold transition-colors underline decoration-[#722F37]/30"
                >
                  <Instagram className="w-3 h-3" /> @paprica.arquitetura
                </a>
              </div>
            </div>

            {/* Urbano.s footer column */}
            <div className="space-y-2 p-5 rounded-2xl border border-[#3D2D24] bg-[#221A17] text-white shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#84CC16]" />
                <span className="font-bold text-white text-sm tracking-tight">
                  Urbano.s Apartamentos por Temporada
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  CNPJ: {urbanoInfo.cnpj}
                </span>
              </div>
              <p className="text-stone-300">
                {urbanoInfo.razaoSocial} · Rio de Janeiro – RJ
              </p>
              <div className="flex items-center gap-4 pt-1">
                <span className="flex items-center gap-1 text-[#84CC16] font-semibold">
                  <Phone className="w-3 h-3" /> {urbanoInfo.phone}
                </span>
                <a
                  href={`https://${urbanoInfo.site}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-stone-200 hover:text-white flex items-center gap-1 transition-colors underline"
                >
                  <Globe className="w-3 h-3" /> {urbanoInfo.site}
                </a>
                <a
                  href="https://instagram.com/urbanos.apts"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#84CC16] flex items-center gap-1 transition-colors text-stone-300"
                >
                  <Instagram className="w-3 h-3" /> @urbanos.apts
                </a>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 mt-5 border-t border-[#DDD6C8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#7A604D]">
            <span>
              Sistema de Gestão Interna Integrada · Copacabana & Ipanema, Rio de Janeiro
            </span>
            <span className="font-medium text-[#634832]">
              Arquitetura de Interiores & Aluguel por Temporada
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
