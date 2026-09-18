import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileX2, ArrowLeft, Loader2 } from 'lucide-react';
import { getApplicationById } from '../data/applicationsData';
import InvestigationHeader from '../components/investigation/InvestigationHeader';
import InvestigationStatusStrip from '../components/investigation/InvestigationStatusStrip';
import VerificationSummaryCard from '../components/investigation/VerificationSummaryCard';
import UnderwriterDecisionPanel from '../components/investigation/UnderwriterDecisionPanel';
import RiskBreakdown from '../components/investigation/RiskBreakdown';
import AttentionReasonsCard from '../components/investigation/AttentionReasonsCard';
import InvestigationTimeline from '../components/investigation/InvestigationTimeline';
import EvidenceSummaryGrid from '../components/investigation/EvidenceSummaryGrid';
import ConnectedSignalsGrid from '../components/investigation/ConnectedSignalsGrid';
import InvestigationActions from '../components/investigation/InvestigationActions';
import InvestigatorNotes from '../components/investigation/InvestigatorNotes';
import loanService from '../services/loanService';

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInvestigating, setIsInvestigating] = useState(false);

  const fetchApplication = useCallback(async () => {
    try {
      // 1. Try to fetch live investigation dossier from backend
      const liveData = await loanService.getLenderApplicationInvestigation(id);
      if (liveData) {
        setApplication(liveData);
        setLoading(false);
        return;
      }
    } catch {
      // Backend not reached
    }

    // 2. Fallback to mock data catalog
    const mock = getApplicationById(id);
    if (mock) {
      setApplication(mock);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-slate-400 font-mono">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mb-3" />
        <span>Loading loan investigation dossier...</span>
      </div>
    );
  }

  // 404 Not Found State
  if (!application) {
    return (
      <div className="rounded-2xl border border-surface-border bg-surface-card/90 p-12 text-center max-w-lg mx-auto my-12 backdrop-blur-xl">
        <div className="h-12 w-12 rounded-full bg-red-950/40 border border-red-500/40 flex items-center justify-center mx-auto text-red-400 mb-4">
          <FileX2 className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-white font-mono">
          Application Not Found
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          No loan application record corresponds to identifier <span className="text-cyan-300 font-mono font-semibold">"{id}"</span>. Return to the applications queue.
        </p>
        <button
          onClick={() => navigate('/applications')}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-950/70 px-4 py-2 text-xs font-mono text-cyan-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Applications</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Investigation Workspace Header */}
      <InvestigationHeader
        application={application}
        isInvestigating={isInvestigating}
        onToggleInvestigate={() => setIsInvestigating(!isInvestigating)}
      />

      {/* 2. Investigation Status Strip */}
      <InvestigationStatusStrip application={application} />

      {/* 3. 5-Pillar Digital Underwriting Verification & Governance Card */}
      <VerificationSummaryCard application={application} />

      {/* 4. Human Underwriter Decisioning Authority Panel */}
      <UnderwriterDecisionPanel
        application={application}
        onDecisionComplete={() => {
          fetchApplication();
        }}
      />

      {/* 5. Comprehensive Risk Assessment Breakdown */}
      <RiskBreakdown application={application} />

      {/* 6. Attention Triggers & Audit Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AttentionReasonsCard reasons={application.reasons} />
        </div>
        <div className="lg:col-span-5">
          <InvestigationTimeline timeline={application.timeline} />
        </div>
      </div>

      {/* 7. Evidence Summary & Connected Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <EvidenceSummaryGrid evidence={application.evidence} applicationId={application.id} />
        </div>
        <div className="lg:col-span-6">
          <ConnectedSignalsGrid signals={application.digitalSignals} />
        </div>
      </div>

      {/* 8. Investigation Actions & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <InvestigationActions application={application} />
        </div>
        <div className="lg:col-span-5">
          <InvestigatorNotes applicationId={application.id} />
        </div>
      </div>
    </div>
  );
}
