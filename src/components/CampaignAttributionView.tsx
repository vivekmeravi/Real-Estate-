import React from 'react';
import { Target, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';

interface CampaignStat {
  campaignName: string;
  adset: string;
  creative: string;
  spend: number;
  leadsCount: number;
  highIntentCount: number;
  siteVisitsBooked: number;
  costPerLead: number;
  costPerHighIntentLead: number;
  conversionYield: number; // percentage
}

const CAMPAIGN_STATS: CampaignStat[] = [
  {
    campaignName: 'Skyline Penthouse Launch Q4',
    adset: 'HNI Luxury Upgrade Buyers (Income $400k+)',
    creative: 'Penthouse Skyline Sunset Drone Reel',
    spend: 4200,
    leadsCount: 64,
    highIntentCount: 28,
    siteVisitsBooked: 14,
    costPerLead: 65.6,
    costPerHighIntentLead: 150.0,
    conversionYield: 43.8,
  },
  {
    campaignName: 'The Grand Palm Villas Gated Community',
    adset: 'Physicians, Partners & Tech Directors',
    creative: 'Private Pool Garden Walkthrough Video',
    spend: 3800,
    leadsCount: 52,
    highIntentCount: 22,
    siteVisitsBooked: 11,
    costPerLead: 73.0,
    costPerHighIntentLead: 172.7,
    conversionYield: 42.3,
  },
  {
    campaignName: 'Emerald Bayfront Pre-Launch',
    adset: 'Real Estate Portfolio Investors',
    creative: 'Marina View High-Yield Investment Ad',
    spend: 2900,
    leadsCount: 48,
    highIntentCount: 16,
    siteVisitsBooked: 7,
    costPerLead: 60.4,
    costPerHighIntentLead: 181.2,
    conversionYield: 33.3,
  },
  {
    campaignName: 'Skyline Penthouse Launch Q4',
    adset: 'Broad Interest Real Estate Enthusiasts',
    creative: 'Early Bird Pricing Teaser',
    spend: 1800,
    leadsCount: 58,
    highIntentCount: 8,
    siteVisitsBooked: 2,
    costPerLead: 31.0,
    costPerHighIntentLead: 225.0,
    conversionYield: 13.7,
  },
];

export const CampaignAttributionView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="border border-slate-800 bg-slate-900/40 p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">
            Meta WhatsApp Lead Ads Attribution & Intent Yield
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Raw cost-per-lead is often misleading: broad teaser ads bring cheap contacts with low buying intent. 
            This matrix tracks actual <span className="text-emerald-400 font-medium">Cost per High-Intent Lead</span> and site visit conversion by creative.
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg font-mono-tabular">
          Active Ad Spend: $12,700
        </div>
      </div>

      {/* Attribution Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-medium">
                <th className="py-3 px-4 w-72">Ad Campaign & Target Audience</th>
                <th className="py-3 px-4 w-60">Creative Angle</th>
                <th className="py-3 px-3 text-right">Ad Spend</th>
                <th className="py-3 px-3 text-right">WA Leads</th>
                <th className="py-3 px-3 text-right">High-Intent</th>
                <th className="py-3 px-3 text-right">Intent Yield</th>
                <th className="py-3 px-3 text-right">Cost/Lead</th>
                <th className="py-3 px-4 text-right">Cost/High-Intent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-tabular">
              {CAMPAIGN_STATS.map((stat, idx) => {
                const isTopPerformer = stat.conversionYield > 40;
                return (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-sans align-top">
                      <div className="font-medium text-slate-200">{stat.campaignName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{stat.adset}</div>
                    </td>

                    <td className="py-3 px-4 font-sans align-top text-slate-300">
                      <span>{stat.creative}</span>
                    </td>

                    <td className="py-3 px-3 text-right text-slate-300 align-top">
                      ${stat.spend.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right text-white font-medium align-top">
                      {stat.leadsCount}
                    </td>

                    <td className="py-3 px-3 text-right text-emerald-400 font-semibold align-top">
                      {stat.highIntentCount}
                    </td>

                    <td className="py-3 px-3 text-right align-top">
                      <span className={isTopPerformer ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                        {stat.conversionYield.toFixed(1)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right text-slate-400 align-top">
                      ${stat.costPerLead.toFixed(1)}
                    </td>

                    <td className="py-3 px-4 text-right align-top">
                      <span className={isTopPerformer ? 'text-emerald-300 font-semibold' : 'text-amber-400'}>
                        ${stat.costPerHighIntentLead.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-4">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Drone Sunset Reel Winner</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Architectural drone video generates 43.8% high-intent prospects who immediately ask for unit numbers and floor plans on WhatsApp.
          </p>
        </div>

        <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-4">
          <div className="flex items-center gap-2 text-sky-400 font-semibold mb-2">
            <Target className="w-4 h-4" />
            <span>Audience Quality Separation</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Targeting HNI upgrade buyers yields $150 cost per high-intent visit appointment compared to $225 on broad interest ads.
          </p>
        </div>

        <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-4">
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Teaser Ad Fatigue</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Early bird price teaser ads have cheap $31 CPL but only 13.7% intention yield. Recommended to shift budget into walkthrough creatives.
          </p>
        </div>
      </div>
    </div>
  );
};
