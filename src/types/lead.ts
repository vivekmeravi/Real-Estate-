export type IntentTier = 'High Intent' | 'Warm Prospect' | 'Low / Nurture';

export type LeadStatus =
  | 'New Inbound'
  | 'Visit Scheduled'
  | 'Visit Completed'
  | 'Negotiation'
  | 'Follow-up Due'
  | 'Qualified High-Intent'
  | 'Nurturing'
  | 'Disqualified';

export type UnitType = '2BHK' | '3BHK' | '4BHK' | 'Penthouse' | 'Luxury Villa';

export type TimelineType = 'Immediate (0-30 days)' | '1-3 months' | '3-6 months' | 'Exploratory';

export interface ChatMessage {
  id: string;
  sender: 'lead' | 'agent' | 'bot';
  message: string;
  timestamp: string; // ISO
  readStatus: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'voice_note' | 'brochure_request' | 'site_visit_request' | 'pricing_query';
  durationSeconds?: number; // For voice notes
}

export interface PropertyInterest {
  projectName: string;
  unitType: UnitType;
  budgetRange: string;
  minBudget: number;
  maxBudget: number;
  timeline: TimelineType;
  possessionRequirement: 'Ready to Move' | 'Under Construction (2026-2027)' | 'New Launch';
  locationPreference?: string;
}

export interface IntentSignals {
  siteVisitRequested: boolean;
  siteVisitScheduledDate?: string;
  siteVisitCompleted: boolean;
  floorPlanDownloaded: boolean;
  priceSheetRequested: boolean;
  budgetConfirmed: boolean;
  mortgagePreApproved: boolean;
  voiceNoteSentByLead: boolean;
  fastResponder: boolean; // replied in < 15 mins
  askedSpecificUnitAvailability: boolean;
  askedPossessionDate: boolean;
  askedPaymentPlan: boolean;
  hasSharedLocationPin?: boolean;
}

export interface EngagementHistory {
  firstContactAt: string;
  lastMessageAt: string;
  totalMessagesExchanged: number;
  inboundUserMessages: number;
  averageResponseTimeMinutes: number;
  lastUserMessageSnippet: string;
  lastAgentMessageSnippet: string;
  chatTranscript: ChatMessage[];
}

export interface ScoreBreakdown {
  engagementVelocity: number; // max 25
  buyingReadiness: number; // max 30
  actionIntent: number; // max 30 (visit, floor plan, unit request)
  budgetFit: number; // max 15
}

export interface LeadNote {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface AIAnalysisResult {
  intentSummary: string;
  buyingUrgency: 'High' | 'Medium' | 'Low';
  keyObjections: string[];
  recommendedAction: string;
  suggestedMessage: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  adCampaign: string;
  adCreative: string;
  adsetTargeting: string;
  propertyInterest: PropertyInterest;
  engagementHistory: EngagementHistory;
  intentSignals: IntentSignals;
  status: LeadStatus;
  conversionScore: number; // 0 - 100
  intentTier: IntentTier;
  scoreBreakdown: ScoreBreakdown;
  assignedAgent: string;
  nextFollowUpDue: string;
  followUpCount: number;
  lastFollowUpDate: string;
  notes: LeadNote[];
  aiAnalysis?: AIAnalysisResult;
  isFavorite?: boolean;
}

export type FilterIntent = 'all' | 'high_intent' | 'visit_scheduled' | 'overdue' | 'fast_responders' | 'warm' | 'nurture';

export type SortField = 'conversionScore' | 'recentActivity' | 'nextFollowUp' | 'budget' | 'responseVelocity';
export type SortDirection = 'asc' | 'desc';
