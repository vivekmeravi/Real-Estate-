import React, { useState } from 'react';
import { Lead, UnitType, TimelineType } from '../types/lead';
import { calculateConversionScore } from '../utils/scoring';
import { X, Sparkles, MessageCircle, CheckCircle, Zap } from 'lucide-react';

interface SimulateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadAdded: (newLead: Lead) => void;
}

const PRESET_SCENARIOS = [
  {
    name: 'Dr. Sarah Sterling',
    phone: '+1 (415) 772-9011',
    project: 'Skyline Residences & Towers',
    unitType: 'Penthouse' as UnitType,
    budget: '$2,400,000 - $3,000,000',
    minBudget: 2400000,
    maxBudget: 3000000,
    timeline: 'Immediate (0-30 days)' as TimelineType,
    campaign: 'Meta WA Ad · Skyline Penthouse Launch Q4',
    creative: 'Penthouse Skyline Sunset Drone Reel',
    targeting: 'HNI Luxury Upgrade Buyers',
    inboundMsg: 'Hello! I saw your WhatsApp ad for the Skyline duplex penthouse. I have pre-approval from Wells Fargo Private Bank. Can I inspect Unit 44A this Saturday morning at 10 AM?',
    signals: {
      siteVisitRequested: true,
      siteVisitScheduledDate: undefined,
      siteVisitCompleted: false,
      floorPlanDownloaded: true,
      priceSheetRequested: true,
      budgetConfirmed: true,
      mortgagePreApproved: true,
      voiceNoteSentByLead: true,
      fastResponder: true,
      askedSpecificUnitAvailability: true,
      askedPossessionDate: true,
      askedPaymentPlan: true,
    }
  },
  {
    name: 'Alexander Novak',
    phone: '+1 (310) 844-3329',
    project: 'Emerald Bayfront Residences',
    unitType: '3BHK' as UnitType,
    budget: '$1,350,000 - $1,600,000',
    minBudget: 1350000,
    maxBudget: 1600000,
    timeline: '1-3 months' as TimelineType,
    campaign: 'Meta WA Ad · Emerald Bayfront Pre-Launch',
    creative: 'Marina View High-Yield Investment Ad',
    targeting: 'Real Estate Portfolio Investors',
    inboundMsg: 'Hi there, interested in 2 units of the 3BHK layout facing the marina for rental yield. What are the current pre-launch discounts for bulk booking?',
    signals: {
      siteVisitRequested: false,
      siteVisitScheduledDate: undefined,
      siteVisitCompleted: false,
      floorPlanDownloaded: true,
      priceSheetRequested: true,
      budgetConfirmed: true,
      mortgagePreApproved: false,
      voiceNoteSentByLead: false,
      fastResponder: true,
      askedSpecificUnitAvailability: true,
      askedPossessionDate: true,
      askedPaymentPlan: true,
    }
  },
  {
    name: 'Carlos Mendez',
    phone: '+1 (786) 612-4091',
    project: 'The Grand Palm Villas',
    unitType: 'Luxury Villa' as UnitType,
    budget: '$1,900,000 - $2,300,000',
    minBudget: 1900000,
    maxBudget: 2300000,
    timeline: 'Immediate (0-30 days)' as TimelineType,
    campaign: 'Meta WA Ad · Palm Villas Gated Community',
    creative: 'Private Pool Garden Walkthrough Video',
    targeting: 'HNI Luxury Upgrade Buyers',
    inboundMsg: '🎤 Voice note received: "Looking for an immediate move-in villa with a minimum 40ft private lap pool. Ready to make a deposit before end of month."',
    signals: {
      siteVisitRequested: true,
      siteVisitScheduledDate: undefined,
      siteVisitCompleted: false,
      floorPlanDownloaded: true,
      priceSheetRequested: true,
      budgetConfirmed: true,
      mortgagePreApproved: true,
      voiceNoteSentByLead: true,
      fastResponder: true,
      askedSpecificUnitAvailability: true,
      askedPossessionDate: true,
      askedPaymentPlan: false,
    }
  }
];

export const SimulateLeadModal: React.FC<SimulateLeadModalProps> = ({
  isOpen,
  onClose,
  onLeadAdded,
}) => {
  if (!isOpen) return null;

  const [leadName, setLeadName] = useState('Daniel Rivera');
  const [phone, setPhone] = useState('+1 (415) 991-3820');
  const [project, setProject] = useState('Skyline Residences & Towers');
  const [unitType, setUnitType] = useState<UnitType>('3BHK');
  const [budgetRange, setBudgetRange] = useState('$1,400,000 - $1,750,000');
  const [timeline, setTimeline] = useState<TimelineType>('Immediate (0-30 days)');
  const [inboundMessage, setInboundMessage] = useState(
    'Hi! Saw your ad on Instagram. Looking for a 3BHK with high ceilings. Can I visit this weekend?'
  );
  const [siteVisitRequested, setSiteVisitRequested] = useState(true);
  const [preApproved, setPreApproved] = useState(true);
  const [voiceNoteSent, setVoiceNoteSent] = useState(false);

  const handleApplyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setLeadName(preset.name);
    setPhone(preset.phone);
    setProject(preset.project);
    setUnitType(preset.unitType);
    setBudgetRange(preset.budget);
    setTimeline(preset.timeline);
    setInboundMessage(preset.inboundMsg);
    setSiteVisitRequested(preset.signals.siteVisitRequested);
    setPreApproved(preset.signals.mortgagePreApproved);
    setVoiceNoteSent(preset.signals.voiceNoteSentByLead);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nowIso = new Date().toISOString();
    const signals = {
      siteVisitRequested,
      siteVisitScheduledDate: undefined,
      siteVisitCompleted: false,
      floorPlanDownloaded: true,
      priceSheetRequested: true,
      budgetConfirmed: true,
      mortgagePreApproved: preApproved,
      voiceNoteSentByLead: voiceNoteSent,
      fastResponder: true,
      askedSpecificUnitAvailability: true,
      askedPossessionDate: true,
      askedPaymentPlan: true,
      hasSharedLocationPin: false,
    };

    const engagement = {
      firstContactAt: nowIso,
      lastMessageAt: nowIso,
      totalMessagesExchanged: 2,
      inboundUserMessages: 1,
      averageResponseTimeMinutes: 2.5,
      lastUserMessageSnippet: inboundMessage,
      lastAgentMessageSnippet: 'Inbound WhatsApp lead captured via Meta Ad Webhook.',
      chatTranscript: [
        {
          id: `msg-${Date.now()}-1`,
          sender: 'lead' as const,
          message: inboundMessage,
          timestamp: nowIso,
          readStatus: 'read' as const,
          type: (siteVisitRequested ? 'site_visit_request' : 'text') as any,
        },
      ],
    };

    const property = {
      projectName: project,
      unitType,
      budgetRange,
      minBudget: 1400000,
      maxBudget: 1800000,
      timeline,
      possessionRequirement: 'Ready to Move' as const,
      locationPreference: 'Prime City View',
    };

    const scoreResult = calculateConversionScore(signals, engagement, property);

    const newLead: Lead = {
      id: `lead-wa-${Date.now()}`,
      name: leadName,
      phone,
      email: `${leadName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      adCampaign: 'Meta WA Ad · Live Webhook Simulation',
      adCreative: 'High-Intent Video Walkthrough Reel',
      adsetTargeting: 'HNI Home Upgrade Seekers',
      propertyInterest: property,
      engagementHistory: engagement,
      intentSignals: signals,
      status: siteVisitRequested ? 'Qualified High-Intent' : 'New Inbound',
      conversionScore: scoreResult.totalScore,
      intentTier: scoreResult.intentTier,
      scoreBreakdown: scoreResult.breakdown,
      assignedAgent: 'Elena Rostova',
      nextFollowUpDue: 'Today, within 15 min (HIGH PRIORITY)',
      followUpCount: 0,
      lastFollowUpDate: nowIso,
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'Webhook Gateway',
          content: 'Lead generated via Meta WhatsApp Leads Ad. Instant qualification score calculated.',
          date: nowIso,
        },
      ],
      aiAnalysis: {
        intentSummary: `New inbound from ${leadName} with initial ${scoreResult.totalScore}% qualification score. ${
          siteVisitRequested ? 'Strong walkthrough intent requested in first message.' : 'General inquiries.'
        }`,
        buyingUrgency: scoreResult.totalScore >= 75 ? 'High' : 'Medium',
        keyObjections: ['Initial slot availability', 'Floor plan configuration'],
        recommendedAction: 'Send immediate WhatsApp greeting with 2 visit slots.',
        suggestedMessage: `Hi ${leadName.split(' ')[0]}, thanks for reaching out regarding ${project}! We have 2 walkthrough slots open this weekend. Would Saturday 11 AM or Sunday 3 PM work for you?`,
      },
    };

    onLeadAdded(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Simulate Meta WhatsApp Ad Lead</h3>
              <p className="text-xs text-slate-400">Test incoming webhook payload & qualification scoring</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Instant Realistic Presets:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_SCENARIOS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {p.unitType} · {p.project.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Prospect Full Name</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">WhatsApp Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-slate-700 font-mono-tabular"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Target Project</label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-slate-700 cursor-pointer"
                >
                  <option value="Skyline Residences & Towers">Skyline Residences</option>
                  <option value="The Grand Palm Villas">Grand Palm Villas</option>
                  <option value="Emerald Bayfront Residences">Emerald Bayfront</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Unit Interest</label>
                <select
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value as UnitType)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-slate-700 cursor-pointer"
                >
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="4BHK">4BHK</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Luxury Villa">Luxury Villa</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Buying Timeline</label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value as TimelineType)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-slate-700 cursor-pointer"
                >
                  <option value="Immediate (0-30 days)">Immediate (0-30 days)</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="Exploratory">Exploratory</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Inbound WhatsApp Ad Message</label>
              <textarea
                rows={3}
                required
                value={inboundMessage}
                onChange={(e) => setInboundMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-slate-700"
              />
            </div>

            {/* Intent Signal Toggles */}
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 block">
                Detected Intent Signals:
              </label>
              <div className="flex flex-wrap gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={siteVisitRequested}
                    onChange={(e) => setSiteVisitRequested(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>Site Visit Asked in Chat (+15 pts)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={preApproved}
                    onChange={(e) => setPreApproved(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>Bank Pre-Approved / Cash (+10 pts)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={voiceNoteSent}
                    onChange={(e) => setVoiceNoteSent(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>Voice Note Sent (+4 pts)</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Ingest & Calculate Intent
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
