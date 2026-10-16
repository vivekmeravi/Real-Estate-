import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types/lead';
import { formatTimeAgo } from '../utils/scoring';
import { WHATSAPP_TEMPLATES, interpolateTemplate, generateWhatsAppUrl } from '../utils/whatsapp';
import {
  X,
  MessageCircle,
  Sparkles,
  Send,
  Calendar,
  Check,
  CheckCheck,
  Copy,
  Clock,
  MapPin,
  FileText,
  DollarSign,
  UserCheck,
  AlertCircle,
  Flame,
  ArrowRight
} from 'lucide-react';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onAddNote: (leadId: string, noteText: string) => void;
  onScheduleVisit: (leadId: string, dateIso: string) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  onClose,
  onUpdateStatus,
  onAddNote,
  onScheduleVisit,
}) => {
  if (!lead) return null;

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('site_visit_invite');
  const [customMessage, setCustomMessage] = useState<string>(() => {
    const tpl = WHATSAPP_TEMPLATES.find((t) => t.id === 'site_visit_invite');
    return tpl ? interpolateTemplate(tpl.templateText, lead) : '';
  });
  const [newNote, setNewNote] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState(lead.aiAnalysis);
  const [visitDateInput, setVisitDateInput] = useState<string>('2026-10-18T11:00');
  const [showVisitScheduler, setShowVisitScheduler] = useState<boolean>(false);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tpl = WHATSAPP_TEMPLATES.find((t) => t.id === templateId);
    if (tpl) {
      setCustomMessage(interpolateTemplate(tpl.templateText, lead));
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const url = generateWhatsAppUrl(lead.phone, customMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRunAiAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/analyze-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead }),
      });
      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(data);
        if (data.suggestedMessage) {
          setCustomMessage(data.suggestedMessage);
        }
      }
    } catch (err) {
      console.error('Failed to run AI analysis:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(lead.id, newNote.trim());
    setNewNote('');
  };

  const handleConfirmVisit = () => {
    if (!visitDateInput) return;
    onScheduleVisit(lead.id, new Date(visitDateInput).toISOString());
    setShowVisitScheduler(false);
  };

  const isHigh = lead.conversionScore >= 75;
  const isWarm = lead.conversionScore >= 50 && lead.conversionScore < 75;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-950 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-semibold text-white tracking-tight">{lead.name}</h2>
              <span className="text-xs text-slate-400 font-mono-tabular">{lead.phone}</span>
            </div>
            {/* Unboxed metadata */}
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{lead.propertyInterest.projectName}</span>
              <span aria-hidden="true">·</span>
              <span>{lead.propertyInterest.unitType}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-mono-tabular">{lead.propertyInterest.budgetRange}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Conversion Scorecard & Breakdown */}
          <div className="border border-slate-800 rounded-xl bg-slate-900/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className={`w-4 h-4 ${isHigh ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Calculated Conversion Probability
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold font-mono-tabular ${isHigh ? 'text-emerald-400' : isWarm ? 'text-amber-400' : 'text-slate-400'}`}>
                  {lead.conversionScore}%
                </span>
                <span className="text-xs text-slate-400 font-medium">({lead.intentTier})</span>
              </div>
            </div>

            {/* Score Factors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800 text-xs">
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                <div className="text-slate-500 text-[11px]">Velocity & Depth</div>
                <div className="text-white font-mono-tabular font-medium mt-0.5">
                  {lead.scoreBreakdown.engagementVelocity} <span className="text-slate-500 font-normal">/ 25</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  {lead.engagementHistory.averageResponseTimeMinutes}m reply speed
                </div>
              </div>

              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                <div className="text-slate-500 text-[11px]">Action Intent</div>
                <div className="text-white font-mono-tabular font-medium mt-0.5">
                  {lead.scoreBreakdown.actionIntent} <span className="text-slate-500 font-normal">/ 30</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  {lead.intentSignals.siteVisitRequested ? 'Site Visit Asked' : 'Layout Reviewed'}
                </div>
              </div>

              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                <div className="text-slate-500 text-[11px]">Buying Readiness</div>
                <div className="text-white font-mono-tabular font-medium mt-0.5">
                  {lead.scoreBreakdown.buyingReadiness} <span className="text-slate-500 font-normal">/ 30</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  {lead.propertyInterest.timeline}
                </div>
              </div>

              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                <div className="text-slate-500 text-[11px]">Budget Match</div>
                <div className="text-white font-mono-tabular font-medium mt-0.5">
                  {lead.scoreBreakdown.budgetFit} <span className="text-slate-500 font-normal">/ 15</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  {lead.intentSignals.budgetConfirmed ? 'Budget Verified' : 'Inquired'}
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Chat Transcript Stream */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  WhatsApp Conversation History
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                {lead.engagementHistory.chatTranscript.length} messages exchanged
              </span>
            </div>

            <div className="border border-slate-800 rounded-xl bg-slate-950 p-3.5 space-y-3 max-h-64 overflow-y-auto">
              {lead.engagementHistory.chatTranscript.map((msg) => {
                const isLead = msg.sender === 'lead';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isLead ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        isLead
                          ? 'bg-slate-900 border border-slate-800 text-slate-200'
                          : 'bg-emerald-950/60 border border-emerald-800/50 text-emerald-100'
                      }`}
                    >
                      <div className="text-[10px] font-medium text-slate-500 mb-0.5">
                        {isLead ? lead.name : 'Sales Desk (You)'}
                      </div>
                      <p>{msg.message}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-500">
                        <span>{formatTimeAgo(msg.timestamp)}</span>
                        {!isLead && <CheckCheck className="w-3 h-3 text-sky-400" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Lead Intelligence / Intent Nuance */}
          <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Gemini Intent Intelligence
                </h3>
              </div>
              <button
                type="button"
                onClick={handleRunAiAnalysis}
                disabled={isAiLoading}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer flex items-center gap-1 disabled:opacity-50"
              >
                {isAiLoading ? 'Analyzing...' : 'Refresh AI Analysis'}
              </button>
            </div>

            {aiAnalysis ? (
              <div className="space-y-2.5 text-xs">
                <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  {aiAnalysis.intentSummary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[11px] text-slate-500 font-medium block mb-1">
                      Key Hesitations / Objections
                    </span>
                    <ul className="space-y-1 text-slate-400 text-[11px]">
                      {aiAnalysis.keyObjections.map((obj, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[11px] text-slate-500 font-medium block mb-1">
                      Recommended Next Action
                    </span>
                    <p className="text-emerald-300 text-[11px] leading-relaxed">
                      {aiAnalysis.recommendedAction}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-2">
                Run AI analysis to extract deep psychological intent and objection handling.
              </div>
            )}
          </div>

          {/* WhatsApp Direct Action Center */}
          <div className="border border-slate-800 rounded-xl bg-slate-900/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Send WhatsApp Follow-Up
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono-tabular">
                To: {lead.phone}
              </span>
            </div>

            {/* Template Selector */}
            <div className="mb-3">
              <label className="text-[11px] text-slate-400 font-medium mb-1.5 block">
                Select High-Converting Real Estate WhatsApp Template:
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700 cursor-pointer"
              >
                {WHATSAPP_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.category}] {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Editable Message Box */}
            <div className="relative mb-3">
              <textarea
                rows={4}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-emerald-500/30 font-sans leading-relaxed"
                placeholder="Type or customize your WhatsApp follow-up..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Message'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Launch WhatsApp Direct Chat</span>
              </button>
            </div>
          </div>

          {/* Lead Status & Visit Scheduler */}
          <div className="border border-slate-800 rounded-xl bg-slate-900/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Lead Stage & Site Visit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVisitScheduler(!showVisitScheduler)}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
              >
                {lead.intentSignals.siteVisitScheduledDate ? 'Reschedule Visit' : '+ Schedule Site Visit'}
              </button>
            </div>

            {/* Visit status alert */}
            {lead.intentSignals.siteVisitScheduledDate ? (
              <div className="mb-3 p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/60 text-xs text-sky-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold block">VIP Site Visit Confirmed</span>
                  <span className="text-[11px] text-sky-300 font-mono-tabular">
                    {new Date(lead.intentSignals.siteVisitScheduledDate).toLocaleString([], {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateStatus(lead.id, 'Visit Completed')}
                  className="px-2.5 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded border border-sky-400/40 text-[11px] font-medium cursor-pointer"
                >
                  Mark Visit Done
                </button>
              </div>
            ) : null}

            {showVisitScheduler && (
              <div className="mb-3 p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-[11px] text-slate-400 block font-medium">
                  Select Walkthrough Slot:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="datetime-local"
                    value={visitDateInput}
                    onChange={(e) => setVisitDateInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleConfirmVisit}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium rounded text-xs cursor-pointer"
                  >
                    Confirm Slot
                  </button>
                </div>
              </div>
            )}

            {/* Status pills selector */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {(['New Inbound', 'Qualified High-Intent', 'Visit Scheduled', 'Negotiation', 'Nurturing', 'Disqualified'] as LeadStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onUpdateStatus(lead.id, st)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    lead.status === st
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Internal Agent Notes */}
          <div className="border border-slate-800 rounded-xl bg-slate-900/40 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Sales Agent Notes ({lead.notes.length})
            </h3>

            {/* Existing notes list */}
            <div className="space-y-2 mb-3">
              {lead.notes.map((note) => (
                <div key={note.id} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="font-medium text-slate-400">{note.author}</span>
                    <span>{formatTimeAgo(note.date)}</span>
                  </div>
                  <p className="text-slate-300">{note.content}</p>
                </div>
              ))}
            </div>

            {/* Add note form */}
            <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Log call outcome or customer preference..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg cursor-pointer"
              >
                Add Note
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
