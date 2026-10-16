import React from 'react';
import { Lead } from '../types/lead';
import { Target, CalendarCheck, Zap, DollarSign, Users } from 'lucide-react';

interface MetricOverviewProps {
  leads: Lead[];
}

export const MetricOverview: React.FC<MetricOverviewProps> = ({ leads }) => {
  const totalLeads = leads.length;
  const highIntentLeads = leads.filter((l) => l.conversionScore >= 75);
  const highIntentPercentage = totalLeads > 0 ? Math.round((highIntentLeads.length / totalLeads) * 100) : 0;
  
  const siteVisitsCount = leads.filter((l) => l.intentSignals.siteVisitRequested || l.intentSignals.siteVisitCompleted).length;

  const validResponseTimes = leads
    .map((l) => l.engagementHistory.averageResponseTimeMinutes)
    .filter((t) => t > 0);
  const avgResponseTime = validResponseTimes.length > 0
    ? (validResponseTimes.reduce((a, b) => a + b, 0) / validResponseTimes.length).toFixed(1)
    : '0';

  const pipelineValue = highIntentLeads.reduce((acc, lead) => acc + (lead.propertyInterest.minBudget || 0), 0);
  const formattedPipelineValue = (pipelineValue / 1000000).toFixed(1);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 border-b border-slate-800 bg-slate-900/40 p-4 rounded-xl mb-6">
      <div className="px-3 py-2 border-r border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>Total WA Ad Leads</span>
        </div>
        <div className="text-xl font-semibold text-white font-mono-tabular">
          {totalLeads}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          Meta WhatsApp Ads Inbounds
        </div>
      </div>

      <div className="px-3 py-2 border-r border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
          <Target className="w-3.5 h-3.5 text-emerald-400" />
          <span>High-Intent Yield</span>
        </div>
        <div className="text-xl font-semibold text-emerald-400 font-mono-tabular">
          {highIntentPercentage}% <span className="text-xs font-normal text-slate-400">({highIntentLeads.length})</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          Conversion Score ≥ 75%
        </div>
      </div>

      <div className="px-3 py-2 border-r border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
          <CalendarCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>Site Visits Active</span>
        </div>
        <div className="text-xl font-semibold text-white font-mono-tabular">
          {siteVisitsCount}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          Requested or Scheduled
        </div>
      </div>

      <div className="px-3 py-2 border-r border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Avg Reply Velocity</span>
        </div>
        <div className="text-xl font-semibold text-white font-mono-tabular">
          {avgResponseTime} <span className="text-xs font-normal text-slate-400">min</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          Lead-to-Agent Speed
        </div>
      </div>

      <div className="col-span-2 md:col-span-1 px-3 py-2">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hot Pipeline Value</span>
        </div>
        <div className="text-xl font-semibold text-white font-mono-tabular">
          ${formattedPipelineValue}M
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          High Intent Deal Flow
        </div>
      </div>
    </div>
  );
};
