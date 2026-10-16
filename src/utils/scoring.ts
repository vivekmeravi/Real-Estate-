import { IntentSignals, EngagementHistory, PropertyInterest, ScoreBreakdown, IntentTier } from '../types/lead';

export function calculateConversionScore(
  signals: IntentSignals,
  engagement: EngagementHistory,
  property: PropertyInterest
): {
  totalScore: number;
  intentTier: IntentTier;
  breakdown: ScoreBreakdown;
} {
  // 1. Engagement Velocity & Chat Depth (Max 25 pts)
  let velocityScore = 0;
  if (engagement.averageResponseTimeMinutes <= 10) {
    velocityScore += 10;
  } else if (engagement.averageResponseTimeMinutes <= 30) {
    velocityScore += 6;
  } else if (engagement.averageResponseTimeMinutes <= 120) {
    velocityScore += 3;
  }

  if (engagement.inboundUserMessages >= 6) {
    velocityScore += 8;
  } else if (engagement.inboundUserMessages >= 3) {
    velocityScore += 5;
  } else if (engagement.inboundUserMessages >= 1) {
    velocityScore += 2;
  }

  // Recency check
  const hoursSinceLastMessage = (Date.now() - new Date(engagement.lastMessageAt).getTime()) / (1000 * 60 * 60);
  if (hoursSinceLastMessage <= 24) {
    velocityScore += 7;
  } else if (hoursSinceLastMessage <= 72) {
    velocityScore += 4;
  } else {
    velocityScore += 1;
  }
  velocityScore = Math.min(25, velocityScore);

  // 2. Action Intent Signals (Max 30 pts)
  let actionScore = 0;
  if (signals.siteVisitCompleted) {
    actionScore += 25;
  } else if (signals.siteVisitScheduledDate) {
    actionScore += 20;
  } else if (signals.siteVisitRequested) {
    actionScore += 15;
  }

  if (signals.floorPlanDownloaded) actionScore += 4;
  if (signals.priceSheetRequested) actionScore += 4;
  if (signals.voiceNoteSentByLead) actionScore += 4;
  if (signals.askedSpecificUnitAvailability) actionScore += 3;
  actionScore = Math.min(30, actionScore);

  // 3. Buying Readiness & Timeline (Max 30 pts)
  let readinessScore = 0;
  if (property.timeline === 'Immediate (0-30 days)') {
    readinessScore += 15;
  } else if (property.timeline === '1-3 months') {
    readinessScore += 10;
  } else if (property.timeline === '3-6 months') {
    readinessScore += 5;
  } else {
    readinessScore += 2;
  }

  if (signals.mortgagePreApproved) {
    readinessScore += 10;
  } else if (signals.askedPaymentPlan) {
    readinessScore += 5;
  }

  if (signals.askedPossessionDate) {
    readinessScore += 5;
  }
  readinessScore = Math.min(30, readinessScore);

  // 4. Budget Fit (Max 15 pts)
  let budgetScore = 0;
  if (signals.budgetConfirmed) {
    budgetScore += 12;
    if (property.minBudget >= 750000) {
      budgetScore += 3; // High net-worth qualification
    }
  } else {
    budgetScore += 5;
  }
  budgetScore = Math.min(15, budgetScore);

  const totalScore = Math.min(100, Math.round(velocityScore + actionScore + readinessScore + budgetScore));

  let intentTier: IntentTier = 'Low / Nurture';
  if (totalScore >= 75) {
    intentTier = 'High Intent';
  } else if (totalScore >= 50) {
    intentTier = 'Warm Prospect';
  }

  return {
    totalScore,
    intentTier,
    breakdown: {
      engagementVelocity: velocityScore,
      actionIntent: actionScore,
      buyingReadiness: readinessScore,
      budgetFit: budgetScore,
    },
  };
}

export function formatTimeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
