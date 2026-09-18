import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  DownloadCloud,
  RefreshCw,
  Gauge
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import RiskScoreRing from '../components/ui/RiskScoreRing';
import StatusBadge from '../components/ui/StatusBadge';
import MiniTrendChart from '../components/ui/MiniTrendChart';
import RiskDistributionChart from '../components/ui/RiskDistributionChart';
import ActivityTimeline from '../components/ui/ActivityTimeline';
import FraudNetworkPlaceholder from '../components/ui/FraudNetworkPlaceholder';
import DocumentAnalysisPlaceholder from '../components/ui/DocumentAnalysisPlaceholder';
import EvidenceIntegrityIndicator from '../components/ui/EvidenceIntegrityIndicator';
import TrustAssessmentGraphic from '../components/ui/TrustAssessmentGraphic';
import Button from '../components/common/Button';
import {
  mockOverviewStats,
  mockRiskDistribution,
  mockHourlyTrend,
  mockApplications,
  mockTimelineEvents
} from '../data/mockDesignData';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState(mockApplications[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>FRAUD INTELLIGENCE DASHBOARD</span>
            <span>/</span>
            <span className="text-slate-400">COMMAND CONSOLE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Underwriter Risk Intelligence Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-assisted risk fusion, entity clustering, and cryptographic evidence verification
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AI ANALYSIS ENGINE ONLINE</span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            icon={RefreshCw}
            className={isRefreshing ? 'animate-spin' : ''}
          >
            Sync Telemetry
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={DownloadCloud}
            onClick={() => navigate('/applications')}
          >
            Review Applications Queue
          </Button>
        </div>
      </div>

      {/* Portfolio Risk Banner + 4 KPI Cards (Section 24) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Portfolio Risk Hero Card */}
        <div className="sm:col-span-2 lg:col-span-1 rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-surface-card to-surface-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Portfolio Risk</span>
            <Gauge className="h-4 w-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-amber-400 font-mono tracking-tight">68%</div>
            <div className="text-xs font-bold text-amber-300 font-mono tracking-wider mt-0.5">MEDIUM RISK</div>
          </div>
          <div className="text-[10px] text-slate-400 border-t border-surface-border/60 pt-2">
            Balanced underwriting appetite
          </div>
        </div>

        {/* 4 Section 24 KPI Cards */}
        {mockOverviewStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            change={stat.change}
            trend={stat.trend}
            isPositiveTrend={stat.isPositiveTrend}
            description={stat.description}
            badge={stat.badge}
            category={stat.category}
          />
        ))}
      </div>

      {/* Section 25: Trust Assessment Graphic */}
      <TrustAssessmentGraphic score={68} />

      {/* Row 2: Selected Risk Dial + Risk Distribution Chart + Sparkline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Overall Threat Index Ring */}
        <div className="lg:col-span-4 rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">Focused Application Risk</h3>
              <p className="text-xs text-slate-400">{selectedApp.applicantName} ({selectedApp.id})</p>
            </div>
            <StatusBadge status={selectedApp.riskLevel === 'HIGH' ? 'CRITICAL' : selectedApp.riskLevel === 'MEDIUM' ? 'WARNING' : 'SAFE'} size="sm" />
          </div>

          <div className="py-6 flex flex-col items-center justify-center">
            <RiskScoreRing
              score={selectedApp.riskScore}
              size={170}
              strokeWidth={12}
              label={`${selectedApp.applicantName} (${selectedApp.id})`}
            />
          </div>

          <div className="border-t border-surface-border pt-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Cohort Risk Momentum:</span>
              <span className="text-amber-400 font-semibold">Moderate Velocity</span>
            </div>
            <MiniTrendChart
              data={mockHourlyTrend.map((h) => ({ value: h.fraud }))}
              color="#f59e0b"
              height={42}
              showTooltip
            />
          </div>
        </div>

        {/* Right: Cohort Risk Distribution Chart (Recharts) */}
        <div className="lg:col-span-8">
          <RiskDistributionChart data={mockRiskDistribution} height={260} />
        </div>
      </div>

      {/* Row 3: Fraud Network Graph & Document Forensics Previews */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <FraudNetworkPlaceholder height={380} />
        </div>
        <div className="xl:col-span-5">
          <DocumentAnalysisPlaceholder
            documentName="Bank_Statement_ArjunKumar_Apr2026.pdf"
            applicant={selectedApp.applicantName}
          />
        </div>
      </div>

      {/* Row 4: Evidence Integrity Seal & Live Timeline Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cryptographic Evidence Ledger Seal */}
        <div className="lg:col-span-5 space-y-6">
          <EvidenceIntegrityIndicator
            hash={selectedApp.ledgerHash}
            blockNumber={105}
            verified={selectedApp.riskLevel !== 'HIGH'}
            timestamp="2026-09-18 10:30:00 UTC"
            signer="TrustLedger SHA-256 Audit Anchor"
          />

          {/* Quick Context Card */}
          <div className="rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm text-xs space-y-3 font-mono">
            <div className="flex items-center justify-between text-white font-semibold">
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>Active Underwriting Target</span>
              </span>
              <span className="text-cyan-300">{selectedApp.id}</span>
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Applicant:</span>
                <span className="text-white font-medium">{selectedApp.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Requested Loan:</span>
                <span className="text-white font-bold">{selectedApp.loanAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Primary Signal:</span>
                <span className="text-amber-400 truncate max-w-[200px]" title={selectedApp.primaryVector}>
                  {selectedApp.primaryVector}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Activity Timeline */}
        <div className="lg:col-span-7">
          <ActivityTimeline events={mockTimelineEvents} />
        </div>
      </div>

      {/* Row 5: Recent Applications Screened Table with Selection */}
      <div className="rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-surface-border">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Recent Screened Applications
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any application record to update the live forensic focus above
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Active Records: {mockApplications.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-[11px] font-mono uppercase text-slate-400">
                <th className="pb-3 pl-2">Application ID</th>
                <th className="pb-3">Applicant</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Risk Score</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Primary Signal</th>
                <th className="pb-3 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {mockApplications.map((app) => {
                const isSelected = selectedApp.id === app.id;
                return (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/10 border-l-2 border-l-cyan-400 text-white'
                        : 'hover:bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <td className="py-3 pl-2 font-semibold text-cyan-300">
                      {app.id}
                    </td>
                    <td className="py-3 font-sans font-medium text-white">
                      {app.applicantName}
                    </td>
                    <td className="py-3 text-slate-200">
                      {app.loanAmount}
                    </td>
                    <td className="py-3">
                      <span className={`font-bold ${
                        app.riskScore >= 70
                          ? 'text-red-400'
                          : app.riskScore >= 30
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}>
                        {app.riskScore}%
                        <span className="text-[10px] text-slate-500 font-normal ml-1">
                          {app.riskLevel}
                        </span>
                      </span>
                    </td>
                    <td className="py-3">
                      <StatusBadge
                        status={
                          app.status === 'FLAGGED'
                            ? 'CRITICAL'
                            : app.status === 'NEEDS REVIEW' || app.status === 'UNDER REVIEW'
                            ? 'WARNING'
                            : 'SAFE'
                        }
                        customLabel={app.status}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 text-slate-400 max-w-xs truncate" title={app.primaryVector}>
                      {app.primaryVector}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/applications/${app.id}`);
                        }}
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Investigate</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
