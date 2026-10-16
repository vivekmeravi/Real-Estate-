import { Lead } from '../types/lead';

export interface WhatsAppTemplate {
  id: string;
  title: string;
  category: 'Site Visit' | 'Pricing & Plans' | 'Urgency & Offer' | 'Re-engagement';
  recommendedStage: string;
  templateText: string;
  intentBoostDescription: string;
}

export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'site_visit_invite',
    title: 'VIP Site Visit Slot Invitation',
    category: 'Site Visit',
    recommendedStage: 'Qualified / High Intent',
    intentBoostDescription: 'Yields 4.8x higher in-person attendance with specific dual-time choice.',
    templateText: `Hi {{firstName}}, thanks for checking out {{projectName}}! We have 2 VIP walkthrough slots open for the {{unitType}} show residence this weekend. Would Saturday at 11:30 AM or Sunday at 3:00 PM suit you best? I can reserve your parking and send the Google Maps pin. - {{agentName}}`
  },
  {
    id: 'floor_plan_breakdown',
    title: 'Unit Layout & Floor Plan Share',
    category: 'Pricing & Plans',
    recommendedStage: 'Brochure Inquired',
    intentBoostDescription: 'Engages analytical buyers with layout specifics and carpet area.',
    templateText: `Hi {{firstName}}, here is the exact architectural layout and carpet area plan for {{projectName}} {{unitType}}. The living balcony features unobstructed city skyline views. Have you reviewed this specific configuration, or would you like to see the corner unit variant?`
  },
  {
    id: 'payment_plan_emi',
    title: 'Payment Schedule & Pre-Approval Breakdown',
    category: 'Pricing & Plans',
    recommendedStage: 'Budget Discussed',
    intentBoostDescription: 'Reduces financial anxiety with structured 20:80 or 10:90 milestone plans.',
    templateText: `Hi {{firstName}}, here is the customized payment schedule for {{projectName}} based on your budget range of {{budgetRange}}. We have verified bank tie-ups with 0% processing fee. Would you like a 5-minute call with our home loan desk to confirm pre-approval?`
  },
  {
    id: 'phase_price_lock',
    title: 'Limited Inventory / Phase 1 Price Lock',
    category: 'Urgency & Offer',
    recommendedStage: 'Warm Prospects',
    intentBoostDescription: 'Creates genuine scarcity as developers prepare for scheduled price escalation.',
    templateText: `Hi {{firstName}}, quick heads-up on {{projectName}}: Phase 1 launch pricing closes this Sunday, after which the developer is revising rates upwards by 5-7%. If you are still considering {{unitType}}, we can lock in the initial rate with an expression of interest today. Let me know!`
  },
  {
    id: 'soft_reengagement',
    title: 'Low-Friction Nudge (Unresponsive)',
    category: 'Re-engagement',
    recommendedStage: 'Paused / Overdue',
    intentBoostDescription: '9-word style WhatsApp question with 68% reply rate.',
    templateText: `Hi {{firstName}}, are you still looking for a {{unitType}} near {{locationPreference}}, or has your timeline shifted?`
  },
  {
    id: 'video_walkthrough',
    title: 'High-Res Video Walkthrough Link',
    category: 'Site Visit',
    recommendedStage: 'Outstation / Busy Buyer',
    intentBoostDescription: 'Engages remote buyers unable to visit immediately.',
    templateText: `Hi {{firstName}}, since you are tied up this week, I recorded a 90-second 4K walkthrough video of the {{unitType}} at {{projectName}} highlighting the private foyer and natural light. Would you like me to send the video link here on WhatsApp?`
  }
];

export function interpolateTemplate(template: string, lead: Lead): string {
  const firstName = lead.name.split(' ')[0] || lead.name;
  return template
    .replace(/{{name}}/g, lead.name)
    .replace(/{{firstName}}/g, firstName)
    .replace(/{{projectName}}/g, lead.propertyInterest.projectName)
    .replace(/{{unitType}}/g, lead.propertyInterest.unitType)
    .replace(/{{budgetRange}}/g, lead.propertyInterest.budgetRange)
    .replace(/{{locationPreference}}/g, lead.propertyInterest.locationPreference || 'prime downtown')
    .replace(/{{agentName}}/g, lead.assignedAgent || 'Sales Desk');
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
