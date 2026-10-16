import React, { useState, useMemo, useEffect } from 'react';
import { Lead, FilterIntent, SortField, SortDirection, LeadStatus } from './types/lead';
import { INITIAL_LEADS } from './data/mockLeads';
import { Header } from './components/Header';
import { MetricOverview } from './components/MetricOverview';
import { FilterToolbar } from './components/FilterToolbar';
import { LeadTable } from './components/LeadTable';
import { LeadDetailDrawer } from './components/LeadDetailDrawer';
import { SimulateLeadModal } from './components/SimulateLeadModal';
import { CadencesView } from './components/CadencesView';
import { CampaignAttributionView } from './components/CampaignAttributionView';
import { interpolateTemplate, WHATSAPP_TEMPLATES, generateWhatsAppUrl } from './utils/whatsapp';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('estatepulse_leads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved leads', e);
      }
    }
    return INITIAL_LEADS;
  });

  const [activeView, setActiveView] = useState<'pipeline' | 'cadences' | 'campaigns'>('pipeline');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState<boolean>(false);

  // Filters & Sorting state
  const [activeIntentFilter, setActiveIntentFilter] = useState<FilterIntent>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('conversionScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Notification / Alert banner state
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('estatepulse_leads', JSON.stringify(leads));
  }, [leads]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const selectedLead = useMemo(() => {
    return leads.find((l) => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  const uniqueProjects = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => set.add(l.propertyInterest.projectName));
    return Array.from(set);
  }, [leads]);

  // Counts for segmented controls
  const counts = useMemo(() => {
    return {
      all: leads.length,
      high_intent: leads.filter((l) => l.conversionScore >= 75).length,
      visit_scheduled: leads.filter((l) => l.intentSignals.siteVisitRequested || l.intentSignals.siteVisitScheduledDate).length,
      overdue: leads.filter((l) => l.nextFollowUpDue.includes('OVERDUE')).length,
      fast_responders: leads.filter((l) => l.engagementHistory.averageResponseTimeMinutes <= 15).length,
      warm: leads.filter((l) => l.conversionScore >= 50 && l.conversionScore < 75).length,
      nurture: leads.filter((l) => l.conversionScore < 50).length,
    };
  }, [leads]);

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // 1. Intent filter tab
    if (activeIntentFilter === 'high_intent') {
      result = result.filter((l) => l.conversionScore >= 75);
    } else if (activeIntentFilter === 'visit_scheduled') {
      result = result.filter((l) => l.intentSignals.siteVisitRequested || l.intentSignals.siteVisitScheduledDate);
    } else if (activeIntentFilter === 'overdue') {
      result = result.filter((l) => l.nextFollowUpDue.includes('OVERDUE'));
    } else if (activeIntentFilter === 'fast_responders') {
      result = result.filter((l) => l.engagementHistory.averageResponseTimeMinutes <= 15);
    } else if (activeIntentFilter === 'warm') {
      result = result.filter((l) => l.conversionScore >= 50 && l.conversionScore < 75);
    } else if (activeIntentFilter === 'nurture') {
      result = result.filter((l) => l.conversionScore < 50);
    }

    // 2. Project filter
    if (projectFilter !== 'all') {
      result = result.filter((l) => l.propertyInterest.projectName === projectFilter);
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          l.propertyInterest.projectName.toLowerCase().includes(q) ||
          l.propertyInterest.unitType.toLowerCase().includes(q) ||
          l.engagementHistory.lastUserMessageSnippet.toLowerCase().includes(q) ||
          l.adCampaign.toLowerCase().includes(q)
      );
    }

    // 4. Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'conversionScore') {
        comparison = a.conversionScore - b.conversionScore;
      } else if (sortField === 'recentActivity') {
        comparison = new Date(a.engagementHistory.lastMessageAt).getTime() - new Date(b.engagementHistory.lastMessageAt).getTime();
      } else if (sortField === 'responseVelocity') {
        comparison = a.engagementHistory.averageResponseTimeMinutes - b.engagementHistory.averageResponseTimeMinutes;
      } else if (sortField === 'budget') {
        comparison = (a.propertyInterest.minBudget || 0) - (b.propertyInterest.minBudget || 0);
      } else if (sortField === 'nextFollowUp') {
        const aOverdue = a.nextFollowUpDue.includes('OVERDUE') ? 0 : 1;
        const bOverdue = b.nextFollowUpDue.includes('OVERDUE') ? 0 : 1;
        comparison = aOverdue - bOverdue;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [leads, activeIntentFilter, projectFilter, searchQuery, sortField, sortDirection]);

  // Lead update actions
  const handleUpdateStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return { ...l, status };
        }
        return l;
      })
    );
    showNotification(`Lead status updated to ${status}`);
  };

  const handleAddNote = (leadId: string, noteContent: string) => {
    const newNote = {
      id: `n-${Date.now()}`,
      author: 'Sales Desk',
      content: noteContent,
      date: new Date().toISOString(),
    };

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return { ...l, notes: [newNote, ...l.notes] };
        }
        return l;
      })
    );
    showNotification('Note added to lead file');
  };

  const handleScheduleVisit = (leadId: string, dateIso: string) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const updatedSignals = {
            ...l.intentSignals,
            siteVisitRequested: true,
            siteVisitScheduledDate: dateIso,
          };
          return {
            ...l,
            intentSignals: updatedSignals,
            status: 'Visit Scheduled',
            conversionScore: Math.min(98, l.conversionScore + 10),
          };
        }
        return l;
      })
    );
    showNotification('Site visit slot confirmed & added to calendar');
  };

  const handleLeadAdded = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
    setSelectedLeadId(newLead.id);
    showNotification(`New lead "${newLead.name}" ingested with ${newLead.conversionScore}% conversion probability`);
  };

  const handleQuickWhatsApp = (lead: Lead) => {
    const tpl = WHATSAPP_TEMPLATES.find((t) =>
      lead.intentSignals.siteVisitRequested ? t.id === 'site_visit_invite' : t.id === 'floor_plan_breakdown'
    ) || WHATSAPP_TEMPLATES[0];

    const message = interpolateTemplate(tpl.templateText, lead);
    const url = generateWhatsAppUrl(lead.phone, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleExportCsv = () => {
    const headers = [
      'Name',
      'Phone',
      'Project',
      'Unit Type',
      'Budget Range',
      'Conversion Score (%)',
      'Intent Tier',
      'Timeline',
      'Site Visit Requested',
      'Assigned Agent',
      'Last User WhatsApp Message',
    ];

    const rows = filteredLeads.map((l) => [
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.propertyInterest.projectName}"`,
      `"${l.propertyInterest.unitType}"`,
      `"${l.propertyInterest.budgetRange}"`,
      l.conversionScore,
      `"${l.intentTier}"`,
      `"${l.propertyInterest.timeline}"`,
      l.intentSignals.siteVisitRequested ? 'YES' : 'NO',
      `"${l.assignedAgent}"`,
      `"${l.engagementHistory.lastUserMessageSnippet.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `estatepulse_qualified_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`Exported ${filteredLeads.length} leads to CSV`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium animate-in fade-in slide-in-from-top-2">
          {notification}
        </div>
      )}

      {/* Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenSimulateModal={() => setIsSimulateModalOpen(true)}
        onExportCsv={handleExportCsv}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'pipeline' && (
          <div>
            {/* KPI Metric Strip */}
            <MetricOverview leads={leads} />

            {/* Filter Toolbar */}
            <FilterToolbar
              activeIntentFilter={activeIntentFilter}
              setActiveIntentFilter={setActiveIntentFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              projectFilter={projectFilter}
              setProjectFilter={setProjectFilter}
              uniqueProjects={uniqueProjects}
              sortField={sortField}
              setSortField={setSortField}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              counts={counts}
            />

            {/* Leads Table */}
            <LeadTable
              leads={filteredLeads}
              selectedLeadId={selectedLeadId}
              onSelectLead={(lead) => setSelectedLeadId(lead.id)}
              onQuickWhatsApp={handleQuickWhatsApp}
            />
          </div>
        )}

        {activeView === 'cadences' && <CadencesView />}

        {activeView === 'campaigns' && <CampaignAttributionView />}
      </main>

      {/* Slide-out Lead Detail & WhatsApp Drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        onClose={() => setSelectedLeadId(null)}
        onUpdateStatus={handleUpdateStatus}
        onAddNote={handleAddNote}
        onScheduleVisit={handleScheduleVisit}
      />

      {/* Inbound WhatsApp Lead Simulator Modal */}
      <SimulateLeadModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        onLeadAdded={handleLeadAdded}
      />
    </div>
  );
}
