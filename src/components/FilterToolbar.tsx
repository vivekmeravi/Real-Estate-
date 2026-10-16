import React from 'react';
import { FilterIntent, SortField, SortDirection } from '../types/lead';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface FilterToolbarProps {
  activeIntentFilter: FilterIntent;
  setActiveIntentFilter: (filter: FilterIntent) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  projectFilter: string;
  setProjectFilter: (project: string) => void;
  uniqueProjects: string[];
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (dir: SortDirection) => void;
  counts: {
    all: number;
    high_intent: number;
    visit_scheduled: number;
    overdue: number;
    fast_responders: number;
    warm: number;
    nurture: number;
  };
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  activeIntentFilter,
  setActiveIntentFilter,
  searchQuery,
  setSearchQuery,
  projectFilter,
  setProjectFilter,
  uniqueProjects,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  counts,
}) => {
  return (
    <div className="space-y-3 mb-5">
      {/* Primary Intent Segmented Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveIntentFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeIntentFilter === 'all'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          All Leads <span className="font-mono-tabular opacity-70">({counts.all})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveIntentFilter('high_intent')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeIntentFilter === 'high_intent'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          High Intent (≥75%) <span className="font-mono-tabular opacity-70">({counts.high_intent})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveIntentFilter('visit_scheduled')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeIntentFilter === 'visit_scheduled'
              ? 'bg-sky-950/80 text-sky-300 border border-sky-600/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          Site Visits <span className="font-mono-tabular opacity-70">({counts.visit_scheduled})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveIntentFilter('overdue')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeIntentFilter === 'overdue'
              ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          Follow-Up Due <span className="font-mono-tabular opacity-70">({counts.overdue})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveIntentFilter('fast_responders')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeIntentFilter === 'fast_responders'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          Fast Responders (&lt;15m) <span className="font-mono-tabular opacity-70">({counts.fast_responders})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveIntentFilter('warm')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeIntentFilter === 'warm'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          Warm (50-74%) <span className="font-mono-tabular opacity-70">({counts.warm})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveIntentFilter('nurture')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeIntentFilter === 'nurture'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          Nurture / Low <span className="font-mono-tabular opacity-70">({counts.nurture})</span>
        </button>
      </div>

      {/* Search & Granular Filter Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search lead name, phone, or requirements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8.5 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-emerald-500/30"
          />
        </div>

        {/* Project Selector & Sort */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Project dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full sm:w-48 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-slate-700 cursor-pointer"
            >
              <option value="all">All Real Estate Projects</option>
              {uniqueProjects.map((proj) => (
                <option key={proj} value={proj}>
                  {proj}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300">
            <SlidersHorizontal className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] text-slate-400">Sort:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="conversionScore" className="bg-slate-900">Conversion Score</option>
              <option value="recentActivity" className="bg-slate-900">Recent WhatsApp Msg</option>
              <option value="nextFollowUp" className="bg-slate-900">Next Follow-Up</option>
              <option value="responseVelocity" className="bg-slate-900">Response Speed</option>
              <option value="budget" className="bg-slate-900">Budget Range</option>
            </select>

            <button
              type="button"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
