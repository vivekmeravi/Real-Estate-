import React from 'react';
import { Lead } from '../types/lead';
import { formatTimeAgo } from '../utils/scoring';
import { generateWhatsAppUrl, WHATSAPP_TEMPLATES, interpolateTemplate } from '../utils/whatsapp';
import { MessageCircle, ExternalLink, Calendar, Clock, Mic, CheckCheck } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  selectedLeadId: string | null;
  onSelectLead: (lead: Lead) => void;
  onQuickWhatsApp: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  selectedLeadId,
  onSelectLead,
  onQuickWhatsApp,
}) => {
  if (leads.length === 0) {
    return (
      <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <MessageCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-200 mb-1">No matching WhatsApp leads found</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
          Try loosening your filter criteria or simulate an incoming WhatsApp ad lead to view intent qualification.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/20">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-medium select-none">
              <th className="py-3 px-4 w-72">Prospect & WhatsApp Ad Attribution</th>
              <th className="py-3 px-4 w-52">Target Property & Budget</th>
              <th className="py-3 px-3 w-40 text-center">Intent Score</th>
              <th className="py-3 px-4 w-72">Latest WhatsApp Engagement</th>
              <th className="py-3 px-4 w-36">Follow-Up Due</th>
              <th className="py-3 px-4 w-36 text-right">Instant Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {leads.map((lead) => {
              const isSelected = selectedLeadId === lead.id;
              const isHigh = lead.conversionScore >= 75;
              const isWarm = lead.conversionScore >= 50 && lead.conversionScore < 75;

              return (
                <tr
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className={`transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-slate-800/80 border-l-2 border-emerald-400'
                      : 'hover:bg-slate-900/50'
                  }`}
                >
                  {/* Prospect & Ad Attribution */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-medium text-slate-100 flex items-center gap-2">
                      <span>{lead.name}</span>
                      {lead.intentSignals.voiceNoteSentByLead && (
                        <span title="Lead sent voice note (+intent)" className="text-emerald-400">
                          <Mic className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono-tabular">
                      {lead.phone}
                    </div>
                    {/* Unboxed metadata with typographic separators */}
                    <div className="text-[11px] text-slate-500 mt-1 truncate max-w-xs">
                      <span>{lead.adCreative}</span>
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      <span>{lead.adCampaign.replace('Meta WA Ad · ', '')}</span>
                    </div>
                  </td>

                  {/* Target Property & Budget */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="text-slate-200 font-medium">
                      {lead.propertyInterest.projectName}
                    </div>
                    {/* Unboxed metadata */}
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      <span>{lead.propertyInterest.unitType}</span>
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      <span>{lead.propertyInterest.timeline}</span>
                    </div>
                    <div className="text-[11px] text-emerald-400/90 font-mono-tabular mt-0.5">
                      {lead.propertyInterest.budgetRange}
                    </div>
                  </td>

                  {/* Intent Score & Factors */}
                  <td className="py-3.5 px-3 align-top text-center">
                    <div className="inline-flex flex-col items-center">
                      <div
                        className={`text-base font-semibold font-mono-tabular ${
                          isHigh
                            ? 'text-emerald-400'
                            : isWarm
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {lead.conversionScore}%
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {lead.intentTier}
                      </div>

                      {/* Micro Intent Indicators */}
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                        {lead.intentSignals.siteVisitScheduledDate ? (
                          <span className="text-sky-400 font-medium">Visit Booked</span>
                        ) : lead.intentSignals.siteVisitRequested ? (
                          <span className="text-emerald-400 font-medium">Visit Asked</span>
                        ) : lead.intentSignals.priceSheetRequested ? (
                          <span>Pricing Sent</span>
                        ) : (
                          <span>Inquired</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Latest WhatsApp Engagement */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>Replied {formatTimeAgo(lead.engagementHistory.lastMessageAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">{lead.engagementHistory.averageResponseTimeMinutes}m avg speed</span>
                    </div>
                    <p className="text-slate-300 text-[11px] line-clamp-2 italic bg-slate-900/60 p-1.5 rounded border border-slate-800/80">
                      &ldquo;{lead.engagementHistory.lastUserMessageSnippet}&rdquo;
                    </p>
                  </td>

                  {/* Follow-Up Due */}
                  <td className="py-3.5 px-4 align-top">
                    <div
                      className={`text-xs font-medium font-mono-tabular ${
                        lead.nextFollowUpDue.includes('OVERDUE')
                          ? 'text-rose-400 font-semibold'
                          : lead.nextFollowUpDue.includes('Today')
                          ? 'text-amber-300'
                          : 'text-slate-300'
                      }`}
                    >
                      {lead.nextFollowUpDue}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      <span>Agent: {lead.assignedAgent.split(' ')[0]}</span>
                      <span aria-hidden="true" className="mx-1">·</span>
                      <span>#{lead.followUpCount} touch</span>
                    </div>
                  </td>

                  {/* Instant Action */}
                  <td className="py-3.5 px-4 align-top text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickWhatsApp(lead);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 transition-colors cursor-pointer text-xs font-medium"
                        title="Open WhatsApp chat with pre-filled smart follow-up"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLead(lead);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="View Full WhatsApp History & AI Scorecard"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
