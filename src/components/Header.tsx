import React from 'react';
import { Plus, MessageSquare, Download } from 'lucide-react';

interface HeaderProps {
  activeView: 'pipeline' | 'cadences' | 'campaigns';
  setActiveView: (view: 'pipeline' | 'cadences' | 'campaigns') => void;
  onOpenSimulateModal: () => void;
  onExportCsv: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenSimulateModal,
  onExportCsv,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white whitespace-nowrap">
            EstatePulse <span className="text-slate-500 font-normal">· WhatsApp Intent</span>
          </span>
        </div>

        {/* Zone 2: Single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            type="button"
            onClick={() => setActiveView('pipeline')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'pipeline'
                ? 'text-white font-semibold border-b-2 border-emerald-500 pb-0.5'
                : 'hover:text-slate-200'
            }`}
          >
            Leads Pipeline
          </button>
          <button
            type="button"
            onClick={() => setActiveView('cadences')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'cadences'
                ? 'text-white font-semibold border-b-2 border-emerald-500 pb-0.5'
                : 'hover:text-slate-200'
            }`}
          >
            Follow-Up Cadences
          </button>
          <button
            type="button"
            onClick={() => setActiveView('campaigns')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'campaigns'
                ? 'text-white font-semibold border-b-2 border-emerald-500 pb-0.5'
                : 'hover:text-slate-200'
            }`}
          >
            WhatsApp Ads Attribution
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onExportCsv}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            title="Export high-intent leads to CRM CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Qualified CSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenSimulateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate Ad Inbound</span>
          </button>
        </div>
      </div>
    </header>
  );
};
