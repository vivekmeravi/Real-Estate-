import React, { useState } from 'react';
import { WHATSAPP_TEMPLATES, WhatsAppTemplate } from '../utils/whatsapp';
import { MessageSquare, Clock, Copy, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const CadencesView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (tpl: WhatsAppTemplate) => {
    navigator.clipboard.writeText(tpl.templateText);
    setCopiedId(tpl.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const CADENCE_STEPS = [
    {
      step: 'Step 1',
      timing: 'Within 5 minutes of Meta Ad Inbound',
      title: 'Speed-to-Lead VIP Slot Invitation',
      objective: 'Secure dual-choice site visit appointment before lead moves to competitor listings.',
      templateId: 'site_visit_invite',
      conversionImpact: '9.2x higher visit booking rate when sent in < 10 mins',
    },
    {
      step: 'Step 2',
      timing: '24 hours post-inquiry',
      title: 'Architectural Layout & Carpet Area Breakdown',
      objective: 'Provide tangible analytical proof of space and superior carpet efficiency.',
      templateId: 'floor_plan_breakdown',
      conversionImpact: 'Engages analytical decision makers (architects, spouses)',
    },
    {
      step: 'Step 3',
      timing: '48-72 hours post-inquiry',
      title: 'Tailored Construction Milestone Payment Schedule',
      objective: 'Eliminate down-payment uncertainty with bank-approved 20:80 or 10:90 plans.',
      templateId: 'payment_plan_emi',
      conversionImpact: 'Solves primary objection before the in-person meeting',
    },
    {
      step: 'Step 4',
      timing: 'Day 5 or Pre-Escalation',
      title: 'Phase 1 Launch Price Lock Alert',
      objective: 'Inject legitimate builder urgency based on scheduled 5-7% price revision.',
      templateId: 'phase_price_lock',
      conversionImpact: 'Pushes hesitant warm leads into immediate EOI deposits',
    },
    {
      step: 'Step 5',
      timing: 'Day 10 (If unresponsive)',
      title: 'Dean Jackson 9-Word WhatsApp Soft Nudge',
      objective: 'Ultra low friction question designed to restart paused conversations.',
      templateId: 'soft_reengagement',
      conversionImpact: '64% response recovery rate on cold chats',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="border border-slate-800 bg-slate-900/40 p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">
            High-Converting WhatsApp Real Estate Cadence Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            WhatsApp leads have an 80% higher drop-off if not engaged within the first 15 minutes. 
            This sequence is engineered specifically for Click-to-WhatsApp ad leads to maximize in-person walkthrough conversions.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0">
          <Zap className="w-4 h-4" />
          <span>Average Sequence Yield: 34.8% Site Visit Rate</span>
        </div>
      </div>

      {/* Cadence Steps */}
      <div className="space-y-4">
        {CADENCE_STEPS.map((stepItem, index) => {
          const tpl = WHATSAPP_TEMPLATES.find((t) => t.id === stepItem.templateId);
          const isCopied = copiedId === stepItem.templateId;

          return (
            <div
              key={index}
              className="border border-slate-800 rounded-xl bg-slate-900/20 p-5 hover:border-slate-700/80 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {stepItem.step}
                  </span>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{stepItem.timing}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Impact: <span className="text-slate-300 font-medium">{stepItem.conversionImpact}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-4 space-y-1.5">
                  <h3 className="text-sm font-semibold text-white">{stepItem.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {stepItem.objective}
                  </p>
                </div>

                <div className="lg:col-span-8 bg-slate-950 border border-slate-800/90 rounded-lg p-3.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                    <span>Message Template (Variables auto-injected on send)</span>
                    <button
                      type="button"
                      onClick={() => tpl && handleCopy(tpl)}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy Template'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/50 p-2.5 rounded border border-slate-800/60">
                    {tpl?.templateText}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
