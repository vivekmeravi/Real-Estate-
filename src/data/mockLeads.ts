import { Lead } from '../types/lead';
import { calculateConversionScore } from '../utils/scoring';

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60 * 1000).toISOString();
const hoursAgo = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000).toISOString();

interface RawLeadItem extends Omit<Lead, 'conversionScore' | 'intentTier' | 'scoreBreakdown'> {}

const RAW_LEADS_DATA: RawLeadItem[] = [
  {
    id: 'lead-wa-101',
    name: 'Marcus Sterling',
    phone: '+1 (415) 890-4421',
    email: 'marcus.sterling@sterlingcap.com',
    adCampaign: 'Meta WA Ad · Skyline Penthouse Launch Q4',
    adCreative: 'Penthouse Skyline Sunset Drone Reel',
    adsetTargeting: 'HNI Luxury Upgrade Buyers (Income $400k+)',
    assignedAgent: 'Elena Rostova',
    nextFollowUpDue: 'Today, 4:00 PM',
    followUpCount: 3,
    lastFollowUpDate: hoursAgo(4),
    propertyInterest: {
      projectName: 'Skyline Residences & Towers',
      unitType: 'Penthouse' as const,
      budgetRange: '$2,200,000 - $2,800,000',
      minBudget: 2200000,
      maxBudget: 2800000,
      timeline: 'Immediate (0-30 days)' as const,
      possessionRequirement: 'Ready to Move' as const,
      locationPreference: 'Financial District North'
    },
    intentSignals: {
      siteVisitRequested: true,
      siteVisitScheduledDate: '2026-10-18T11:00:00Z',
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
      hasSharedLocationPin: true
    },
    engagementHistory: {
      firstContactAt: daysAgo(2),
      lastMessageAt: minutesAgo(18),
      totalMessagesExchanged: 14,
      inboundUserMessages: 7,
      averageResponseTimeMinutes: 4.5,
      lastUserMessageSnippet: 'Can we schedule the site visit for Unit 42B this Sunday at 11 AM? My architect is also joining.',
      lastAgentMessageSnippet: 'Absolutely Marcus, Unit 42B has the unobstructed bay terrace. I will reserve the VIP elevator slot for 11 AM.',
      chatTranscript: [
        {
          id: 'msg-1',
          sender: 'lead' as const,
          message: 'Hi, I saw your WhatsApp ad for the Skyline Residences Penthouse with the double-height ceilings. Is Unit 42B still available?',
          timestamp: daysAgo(2),
          readStatus: 'read' as const,
          type: 'text' as const
        },
        {
          id: 'msg-2',
          sender: 'agent' as const,
          message: 'Hello Marcus! Yes, Unit 42B (4,150 sq.ft duplex) is available. Here is the architectural floor plan and private elevator foyer layout.',
          timestamp: daysAgo(2),
          readStatus: 'read' as const,
          type: 'brochure_request' as const
        },
        {
          id: 'msg-3',
          sender: 'lead' as const,
          message: '🎤 Voice message (0:24) - "Just listened to the specs. Does this include the 3 dedicated EV parking spots in the basement?"',
          timestamp: daysAgo(1),
          readStatus: 'read' as const,
          type: 'voice_note' as const,
          durationSeconds: 24
        },
        {
          id: 'msg-4',
          sender: 'agent' as const,
          message: 'Yes Marcus, 3 enclosed EV bays are bundled with the title deed. All cash or financing pre-approved?',
          timestamp: daysAgo(1),
          readStatus: 'read' as const,
          type: 'text' as const
        },
        {
          id: 'msg-5',
          sender: 'lead' as const,
          message: 'Full cash buyer through my family office. Can we schedule the site visit for Unit 42B this Sunday at 11 AM? My architect is also joining.',
          timestamp: minutesAgo(18),
          readStatus: 'read' as const,
          type: 'site_visit_request' as const
        }
      ]
    },
    status: 'Visit Scheduled' as const,
    notes: [
      {
        id: 'n1',
        author: 'Elena Rostova',
        content: 'Ultra high intent cash buyer. Architect attending Sunday walkthrough. Ensure site engineer is present with structural drawings.',
        date: hoursAgo(2)
      }
    ],
    aiAnalysis: {
      intentSummary: 'Marcus is an all-cash buyer ready to close immediately upon architect inspection of Unit 42B. High conversion likelihood.',
      buyingUrgency: 'High',
      keyObjections: ['Architectural structural verification', 'EV bay allocation in deed'],
      recommendedAction: 'Send calendar invite with site engineer contact and pre-register parking.',
      suggestedMessage: 'Hi Marcus, confirming Sunday 11 AM for Unit 42B! Our Chief Project Engineer will also be on-site with full structural blue-prints for your architect. Looking forward to hosting you.'
    }
  },
  {
    id: 'lead-wa-102',
    name: 'Dr. Priya Varma',
    phone: '+1 (650) 412-9908',
    email: 'priya.varma.md@stanfordalumni.org',
    adCampaign: 'Meta WA Ad · Palm Villas Gated Community',
    adCreative: 'Private Pool Garden Walkthrough Video',
    adsetTargeting: 'Physicians & Tech Directors',
    assignedAgent: 'David Chen',
    nextFollowUpDue: 'Tomorrow, 10:30 AM',
    followUpCount: 2,
    lastFollowUpDate: hoursAgo(12),
    propertyInterest: {
      projectName: 'The Grand Palm Villas',
      unitType: 'Luxury Villa' as const,
      budgetRange: '$1,800,000 - $2,200,000',
      minBudget: 1800000,
      maxBudget: 2200000,
      timeline: '1-3 months' as const,
      possessionRequirement: 'Ready to Move' as const,
      locationPreference: 'Emerald Valley Greenbelt'
    },
    intentSignals: {
      siteVisitRequested: true,
      siteVisitScheduledDate: '2026-10-19T14:30:00Z',
      siteVisitCompleted: false,
      floorPlanDownloaded: true,
      priceSheetRequested: true,
      budgetConfirmed: true,
      mortgagePreApproved: true,
      voiceNoteSentByLead: false,
      fastResponder: true,
      askedSpecificUnitAvailability: true,
      askedPossessionDate: true,
      askedPaymentPlan: true,
      hasSharedLocationPin: false
    },
    engagementHistory: {
      firstContactAt: daysAgo(4),
      lastMessageAt: hoursAgo(3),
      totalMessagesExchanged: 11,
      inboundUserMessages: 5,
      averageResponseTimeMinutes: 8.2,
      lastUserMessageSnippet: 'I have pre-approval from Chase for $2.1M. Would love to see Villa #14 on Monday afternoon.',
      lastAgentMessageSnippet: 'Noted Dr. Varma, Villa #14 is confirmed for Monday at 2:30 PM.',
      chatTranscript: [
        {
          id: 'msg-201',
          sender: 'lead' as const,
          message: 'Hello, saw the Meta Ad for Grand Palm Villas. We need 4 bedrooms with a ground-floor suite for elderly parents.',
          timestamp: daysAgo(4),
          readStatus: 'read' as const,
          type: 'text' as const
        },
        {
          id: 'msg-202',
          sender: 'agent' as const,
          message: 'Dr. Varma, Villa layout Type-C has a dedicated 450 sq.ft ensuite suite on ground level with zero step access.',
          timestamp: daysAgo(3),
          readStatus: 'read' as const,
          type: 'brochure_request' as const
        },
        {
          id: 'msg-203',
          sender: 'lead' as const,
          message: 'I have pre-approval from Chase for $2.1M. Would love to see Villa #14 on Monday afternoon.',
          timestamp: hoursAgo(3),
          readStatus: 'read' as const,
          type: 'site_visit_request' as const
        }
      ]
    },
    status: 'Visit Scheduled' as const,
    notes: [
      {
        id: 'n2',
        author: 'David Chen',
        content: 'Chase pre-approval letter in hand. Senior-friendly ground suite is key criterion.',
        date: hoursAgo(3)
      }
    ],
    aiAnalysis: {
      intentSummary: 'Dr. Varma is highly qualified with Chase pre-approval and specific multigenerational family living requirements.',
      buyingUrgency: 'High',
      keyObjections: ['Ground floor accessibility and privacy', 'Gated community security protocols'],
      recommendedAction: 'Prepare accessibility highlights of Villa 14 and send clubhouse brochure.',
      suggestedMessage: 'Hi Dr. Varma, looking forward to Monday 2:30 PM! I have requested the landscaping team to ensure the ground floor garden path is open for your parents to view smoothly.'
    }
  },
  {
    id: 'lead-wa-103',
    name: 'Julian Vance',
    phone: '+1 (312) 674-8832',
    email: 'jvance@vanceproperties.io',
    adCampaign: 'Meta WA Ad · Emerald Bayfront Pre-Launch',
    adCreative: 'Marina View High-Yield Investment Ad',
    adsetTargeting: 'Real Estate Portfolio Investors',
    assignedAgent: 'Elena Rostova',
    nextFollowUpDue: 'Today, 2:30 PM (OVERDUE)',
    followUpCount: 4,
    lastFollowUpDate: daysAgo(1),
    propertyInterest: {
      projectName: 'Emerald Bayfront Residences',
      unitType: '3BHK' as const,
      budgetRange: '$1,300,000 - $1,600,000',
      minBudget: 1300000,
      maxBudget: 1600000,
      timeline: '1-3 months' as const,
      possessionRequirement: 'Under Construction (2026-2027)' as const,
      locationPreference: 'Bayfront Harbor'
    },
    intentSignals: {
      siteVisitRequested: true,
      siteVisitScheduledDate: undefined,
      siteVisitCompleted: false,
      floorPlanDownloaded: true,
      priceSheetRequested: true,
      budgetConfirmed: true,
      mortgagePreApproved: false,
      voiceNoteSentByLead: true,
      fastResponder: true,
      askedSpecificUnitAvailability: true,
      askedPossessionDate: true,
      askedPaymentPlan: true,
      hasSharedLocationPin: false
    },
    engagementHistory: {
      firstContactAt: daysAgo(3),
      lastMessageAt: hoursAgo(5),
      totalMessagesExchanged: 10,
      inboundUserMessages: 5,
      averageResponseTimeMinutes: 12.0,
      lastUserMessageSnippet: 'What is the projected gross rental yield on the corner 3BHK? Can you share the developer payment milestone schedule?',
      lastAgentMessageSnippet: 'Here is the payment milestone breakdown Julian. 20% down, 40% on structural slab, 40% on key handover.',
      chatTranscript: [
        {
          id: 'msg-301',
          sender: 'lead' as const,
          message: 'Hi, saw the Bayfront ad on Instagram Reels. Looking to allocate $1.5M into 3BHK units with marina view for leasing.',
          timestamp: daysAgo(3),
          readStatus: 'read' as const,
          type: 'text' as const
        },
        {
          id: 'msg-302',
          sender: 'lead' as const,
          message: '🎤 Voice message (0:41) - "Could you send the gross rental yield comp sheet for neighboring towers?"',
          timestamp: daysAgo(2),
          readStatus: 'read' as const,
          type: 'voice_note' as const,
          durationSeconds: 41
        },
        {
          id: 'msg-303',
          sender: 'lead' as const,
          message: 'What is the projected gross rental yield on the corner 3BHK? Can you share the developer payment milestone schedule?',
          timestamp: hoursAgo(5),
          readStatus: 'read' as const,
          type: 'pricing_query' as const
        }
      ]
    },
    status: 'Follow-up Due' as const,
    notes: [
      {
        id: 'n3',
        author: 'Elena Rostova',
        content: 'Investor lead comparing with neighboring Marina Gate. Needs rental yield simulation sheet.',
        date: daysAgo(1)
      }
    ],
    aiAnalysis: {
      intentSummary: 'Julian is an analytical investor seeking yield data and payment milestone flexibility. Highly responsive to data.',
      buyingUrgency: 'High',
      keyObjections: ['Rental yield benchmarking against market average', 'Escrow milestone transparency'],
      recommendedAction: 'Send rental comp sheet with 7.4% projected yield and invite to private investor briefing.',
      suggestedMessage: 'Hi Julian, sharing our latest rental audit: adjacent towers are fetching 7.2% net yield. With our waterfront premium, Bayfront 3BHK is modeled at 7.8%. Should I send the Excel model?'
    }
  },
  {
    id: 'lead-wa-104',
    name: 'Siddharth Mehta',
    phone: '+1 (206) 555-7319',
    email: 'siddharth.m@cloudcorp.com',
    adCampaign: 'Meta WA Ad · Skyline Penthouse Launch Q4',
    adCreative: 'Early Bird Pricing Teaser',
    adsetTargeting: 'Tech Executives (Seattle / Bay Area)',
    assignedAgent: 'David Chen',
    nextFollowUpDue: 'Tomorrow, 3:00 PM',
    followUpCount: 3,
    lastFollowUpDate: daysAgo(1),
    propertyInterest: {
      projectName: 'Skyline Residences & Towers',
      unitType: '3BHK' as const,
      budgetRange: '$1,400,000 - $1,750,000',
      minBudget: 1400000,
      maxBudget: 1750000,
      timeline: '1-3 months' as const,
      possessionRequirement: 'Ready to Move' as const,
      locationPreference: 'City Skyline View'
    },
    intentSignals: {
      siteVisitRequested: true,
      siteVisitScheduledDate: undefined,
      siteVisitCompleted: false,
      floorPlanDownloaded: true,
      priceSheetRequested: true,
      budgetConfirmed: true,
      mortgagePreApproved: true,
      voiceNoteSentByLead: false,
      fastResponder: true,
      askedSpecificUnitAvailability: true,
      askedPossessionDate: false,
      askedPaymentPlan: true,
      hasSharedLocationPin: false
    },
    engagementHistory: {
      firstContactAt: daysAgo(5),
      lastMessageAt: hoursAgo(9),
      totalMessagesExchanged: 9,
      inboundUserMessages: 4,
      averageResponseTimeMinutes: 14.5,
      lastUserMessageSnippet: 'Can we do a video call walkthrough first since I am in Seattle this week?',
      lastAgentMessageSnippet: 'Definitely Siddharth, I can do a live FaceTime / WhatsApp 4K video walkthrough tomorrow.',
      chatTranscript: [
        {
          id: 'msg-401',
          sender: 'lead' as const,
          message: 'Hi, does the 3BHK have a dedicated home office alcove? Checking from your Meta ad.',
          timestamp: daysAgo(5),
          readStatus: 'read' as const,
          type: 'text' as const
        },
        {
          id: 'msg-402',
          sender: 'agent' as const,
          message: 'Hi Siddharth! Yes, the 3BHK Plan-B includes an acoustic-dampened study nook overlooking the city.',
          timestamp: daysAgo(4),
          readStatus: 'read' as const,
          type: 'brochure_request' as const
        },
        {
          id: 'msg-403',
          sender: 'lead' as const,
          message: 'Can we do a video call walkthrough first since I am in Seattle this week?',
          timestamp: hoursAgo(9),
          readStatus: 'read' as const,
          type: 'site_visit_request' as const
        }
      ]
    },
    status: 'Qualified High-Intent' as const,
    notes: [
      {
        id: 'n4',
        author: 'David Chen',
        content: 'Relocating to head regional tech division. Needs video walkthrough before flying in.',
        date: hoursAgo(8)
      }
    ],
    aiAnalysis: {
      intentSummary: 'Remote buyer relocating with verified corporate budget. Video tour is the closing gateway to in-person deposit.',
      buyingUrgency: 'High',
      keyObjections: ['Remote inspection uncertainty', 'Home office acoustic isolation'],
      recommendedAction: 'Schedule 20-min WhatsApp live video walkthrough with high-speed gimbal camera.',
      suggestedMessage: 'Hi Siddharth, I have the keys to the Plan-B model apartment ready. Would tomorrow at 3 PM PST work for a live video walkthrough?'
    }
  },
  {
    id: 'lead-wa-105',
    name: 'Amina Al-Mansoor',
    phone: '+1 (713) 902-1845',
    email: 'amina.almansoor@globalenergy.ae',
    adCampaign: 'Meta WA Ad · Palm Villas Gated Community',
    adCreative: 'Private Pool Garden Walkthrough Video',
    adsetTargeting: 'HNI Luxury Upgrade Buyers',
    assignedAgent: 'Elena Rostova',
    nextFollowUpDue: 'Oct 20, 11:00 AM',
    followUpCount: 1,
    lastFollowUpDate: daysAgo(2),
    propertyInterest: {
      projectName: 'The Grand Palm Villas',
      unitType: 'Luxury Villa' as const,
      budgetRange: '$2,500,000 - $3,200,000',
      minBudget: 2500000,
      maxBudget: 3200000,
      timeline: 'Immediate (0-30 days)' as const,
      possessionRequirement: 'Ready to Move' as const,
      locationPreference: 'Lakefront Plot'
    },
    intentSignals: {
      siteVisitRequested: true,
      siteVisitScheduledDate: '2026-10-20T11:00:00Z',
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
      hasSharedLocationPin: true
    },
    engagementHistory: {
      firstContactAt: daysAgo(3),
      lastMessageAt: hoursAgo(14),
      totalMessagesExchanged: 12,
      inboundUserMessages: 6,
      averageResponseTimeMinutes: 5.8,
      lastUserMessageSnippet: 'Confirmed for Tuesday 11 AM. Please ensure the private swimming pool filtration system is demonstrated.',
      lastAgentMessageSnippet: 'Understood Amina, will have the pool specialist on site.',
      chatTranscript: [
        {
          id: 'msg-501',
          sender: 'lead' as const,
          message: 'Inquiring about Lakefront Villa #08 from the WhatsApp ad. Is the plot ready for immediate deed registration?',
          timestamp: daysAgo(3),
          readStatus: 'read' as const,
          type: 'text' as const
        },
        {
          id: 'msg-502',
          sender: 'lead' as const,
          message: '🎤 Voice message (0:32) - "We are flying in on Monday night and want to sign an EOI by Wednesday if the layout matches our expectation."',
          timestamp: daysAgo(2),
          readStatus: 'read' as const,
          type: 'voice_note' as const,
          durationSeconds: 32
        },
        {
          id: 'msg-503',
          sender: 'lead' as const,
          message: 'Confirmed for Tuesday 11 AM. Please ensure the private swimming pool filtration system is demonstrated.',
          timestamp: hoursAgo(14),
          readStatus: 'read' as const,
          type: 'site_visit_request' as const
        }
      ]
    },
    status: 'Visit Scheduled' as const,
    notes: [
      {
        id: 'n5',
        author: 'Elena Rostova',
        content: 'Flying in specifically to finalize luxury villa. Ready for immediate EOI and escrow deposit.',
        date: hoursAgo(13)
      }
    ],
    aiAnalysis: {
      intentSummary: 'Ultra-hot lead with immediate 72-hour purchase intent. All indicators green.',
      buyingUrgency: 'High',
      keyObjections: ['Deed registration immediacy', 'Pool maintenance guarantees'],
      recommendedAction: 'Prepare EOI agreement and sample title deed for Tuesday presentation.',
      suggestedMessage: 'Hi Amina, looking forward to Tuesday! I have prepared the draft deed paperwork and verified plot boundaries for Villa #08 so you have everything at hand.'
    }
  },
  {
    id: 'lead-wa-106',
    name: 'Robert & Clara Sterling',
    phone: '+1 (512) 334-9102',
    email: 'robert.sterling@austintech.net',
    adCampaign: 'Meta WA Ad · Emerald Bayfront Pre-Launch',
    adCreative: 'Marina View High-Yield Investment Ad',
    adsetTargeting: 'Homeowners Upgrading',
    assignedAgent: 'David Chen',
    nextFollowUpDue: 'Tomorrow, 5:00 PM',
    followUpCount: 2,
    lastFollowUpDate: daysAgo(2),
    propertyInterest: {
      projectName: 'Emerald Bayfront Residences',
      unitType: '2BHK' as const,
      budgetRange: '$850,000 - $950,000',
      minBudget: 850000,
      maxBudget: 950000,
      timeline: '3-6 months' as const,
      possessionRequirement: 'Under Construction (2026-2027)' as const,
      locationPreference: 'Bayfront Harbor'
    },
    intentSignals: {
      siteVisitRequested: false,
      siteVisitScheduledDate: undefined,
      siteVisitCompleted: false,
      floorPlanDownloaded: true,
      priceSheetRequested: true,
      budgetConfirmed: false,
      mortgagePreApproved: false,
      voiceNoteSentByLead: false,
      fastResponder: false,
      askedSpecificUnitAvailability: false,
      askedPossessionDate: true,
      askedPaymentPlan: true,
      hasSharedLocationPin: false
    },
    engagementHistory: {
      firstContactAt: daysAgo(7),
      lastMessageAt: daysAgo(2),
      totalMessagesExchanged: 6,
      inboundUserMessages: 3,
      averageResponseTimeMinutes: 85.0,
      lastUserMessageSnippet: 'We need to sell our existing townhouse first before committing to 2BHK.',
      lastAgentMessageSnippet: 'Understood Robert! We can assist with a valuation of your existing home.',
      chatTranscript: [
        {
          id: 'msg-601',
          sender: 'lead' as const,
          message: 'Hello, saw the Emerald Bayfront 2BHK price starting at $850k.',
          timestamp: daysAgo(7),
          readStatus: 'read' as const,
          type: 'text' as const
        },
        {
          id: 'msg-602',
          sender: 'lead' as const,
          message: 'We need to sell our existing townhouse first before committing to 2BHK.',
          timestamp: daysAgo(2),
          readStatus: 'read' as const,
          type: 'text' as const
        }
      ]
    },
    status: 'Nurturing' as const,
    notes: [
      {
        id: 'n6',
        author: 'David Chen',
        content: 'Contingent on selling current property. Add to monthly construction update list.',
        date: daysAgo(2)
      }
    ],
    aiAnalysis: {
      intentSummary: 'Warm prospect with contingent financing. Slower timeline (3-6 months).',
      buyingUrgency: 'Medium',
      keyObjections: ['Liquidity locked in current townhouse', 'Interest rate fluctuations'],
      recommendedAction: 'Offer builder home equity bridge financing consultation.',
      suggestedMessage: 'Hi Robert, did you know our lending partner offers a guaranteed 90-day equity bridge while your current townhouse is listed? Would love to share details if helpful.'
    }
  },
  {
    id: 'lead-wa-107',
    name: 'Tariq Mansoor',
    phone: '+1 (408) 789-2190',
    email: 'tmansoor@siliconcapital.com',
    adCampaign: 'Meta WA Ad · Skyline Penthouse Launch Q4',
    adCreative: 'Site Walkthrough Video',
    adsetTargeting: 'HNI Luxury Upgrade Buyers',
    assignedAgent: 'Elena Rostova',
    nextFollowUpDue: 'Today, 6:00 PM',
    followUpCount: 1,
    lastFollowUpDate: hoursAgo(6),
    propertyInterest: {
      projectName: 'Skyline Residences & Towers',
      unitType: '4BHK' as const,
      budgetRange: '$1,900,000 - $2,300,000',
      minBudget: 1900000,
      maxBudget: 2300000,
      timeline: 'Immediate (0-30 days)' as const,
      possessionRequirement: 'Ready to Move' as const,
      locationPreference: 'Upper Penthouse Levels'
    },
    intentSignals: {
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
      hasSharedLocationPin: false
    },
    engagementHistory: {
      firstContactAt: daysAgo(1),
      lastMessageAt: hoursAgo(2),
      totalMessagesExchanged: 8,
      inboundUserMessages: 4,
      averageResponseTimeMinutes: 6.2,
      lastUserMessageSnippet: 'I am ready to make an offer on the 4BHK East wing if we can finalize the parking allocations.',
      lastAgentMessageSnippet: 'Tariq, 2 covered spots are deeded, and I can confirm a third tandem spot is available.',
      chatTranscript: [
        {
          id: 'msg-701',
          sender: 'lead' as const,
          message: 'Good morning, saw the video tour of Skyline 4BHK East. Is the developer offering any launch incentives?',
          timestamp: daysAgo(1),
          readStatus: 'read' as const,
          type: 'text' as const
        },
        {
          id: 'msg-702',
          sender: 'lead' as const,
          message: '🎤 Voice message (0:19) - "We like the floor plan. We can put down 25% earnest money this Friday."',
          timestamp: hoursAgo(4),
          readStatus: 'read' as const,
          type: 'voice_note' as const,
          durationSeconds: 19
        },
        {
          id: 'msg-703',
          sender: 'lead' as const,
          message: 'I am ready to make an offer on the 4BHK East wing if we can finalize the parking allocations.',
          timestamp: hoursAgo(2),
          readStatus: 'read' as const,
          type: 'pricing_query' as const
        }
      ]
    },
    status: 'Negotiation' as const,
    notes: [
      {
        id: 'n7',
        author: 'Elena Rostova',
        content: 'Ready to place 25% deposit. Finalizing parking bay clause.',
        date: hoursAgo(1)
      }
    ],
    aiAnalysis: {
      intentSummary: 'Tariq is in late-stage buying mode with funds liquid. High urgency negotiation.',
      buyingUrgency: 'High',
      keyObjections: ['Parking allocation deed certainty'],
      recommendedAction: 'Send formal parking allocation annexure and draft reservation agreement.',
      suggestedMessage: 'Hi Tariq, I obtained written confirmation from the developer for the 3rd tandem bay at no extra cost. Sending the unit reservation link now!'
    }
  },
  {
    id: 'lead-wa-108',
    name: 'Kavita Patel',
    phone: '+1 (732) 419-8804',
    email: 'kavita.patel84@gmail.com',
    adCampaign: 'Meta WA Ad · Palm Villas Gated Community',
    adCreative: 'Early Bird Pricing Teaser',
    adsetTargeting: 'Homeowners Upgrading',
    assignedAgent: 'David Chen',
    nextFollowUpDue: 'Oct 22, 2:00 PM',
    followUpCount: 1,
    lastFollowUpDate: daysAgo(4),
    propertyInterest: {
      projectName: 'The Grand Palm Villas',
      unitType: 'Luxury Villa' as const,
      budgetRange: '$1,200,000 - $1,400,000',
      minBudget: 1200000,
      maxBudget: 1400000,
      timeline: 'Exploratory' as const,
      possessionRequirement: 'Under Construction (2026-2027)' as const,
      locationPreference: 'Greenbelt'
    },
    intentSignals: {
      siteVisitRequested: false,
      siteVisitScheduledDate: undefined,
      siteVisitCompleted: false,
      floorPlanDownloaded: false,
      priceSheetRequested: true,
      budgetConfirmed: false,
      mortgagePreApproved: false,
      voiceNoteSentByLead: false,
      fastResponder: false,
      askedSpecificUnitAvailability: false,
      askedPossessionDate: false,
      askedPaymentPlan: false,
      hasSharedLocationPin: false
    },
    engagementHistory: {
      firstContactAt: daysAgo(8),
      lastMessageAt: daysAgo(4),
      totalMessagesExchanged: 3,
      inboundUserMessages: 1,
      averageResponseTimeMinutes: 240.0,
      lastUserMessageSnippet: 'Just curious about the starting price.',
      lastAgentMessageSnippet: 'Villas start from $1.8M onwards. Happy to share our upcoming townhome project as well.',
      chatTranscript: [
        {
          id: 'msg-801',
          sender: 'lead' as const,
          message: 'Just curious about the starting price.',
          timestamp: daysAgo(4),
          readStatus: 'read' as const,
          type: 'text' as const
        }
      ]
    },
    status: 'Disqualified' as const,
    notes: [
      {
        id: 'n8',
        author: 'David Chen',
        content: 'Budget mismatch ($1.2M vs project minimum $1.8M). Redirected to entry tier project.',
        date: daysAgo(4)
      }
    ],
    aiAnalysis: {
      intentSummary: 'Casual browser with budget mismatch for Grand Palm Villas.',
      buyingUrgency: 'Low',
      keyObjections: ['Price point above stated budget'],
      recommendedAction: 'Automated newsletter nurture or redirect to partner townhome project.',
      suggestedMessage: 'Hi Kavita, we also have our Oakridge Townhomes launching next month starting at $1.15M. Would you like first access before public release?'
    }
  }
];

// Initialize computed scores
export const INITIAL_LEADS: Lead[] = RAW_LEADS_DATA.map((item) => {
  const scoreResult = calculateConversionScore(item.intentSignals, item.engagementHistory, item.propertyInterest);
  return {
    ...item,
    conversionScore: scoreResult.totalScore,
    intentTier: scoreResult.intentTier,
    scoreBreakdown: scoreResult.breakdown
  };
});
