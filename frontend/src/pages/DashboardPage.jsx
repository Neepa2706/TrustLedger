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
  RefreshCw
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
            <span>COMMAND CONSOLE</span>
            <span>/</span>
            <span className="text-slate-400">EXECUTIVE OVERVIEW</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Fraud Shield Intelligence Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time entity correlation, tamper detection, and cryptographic audit proofs
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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
          >
            Export Audit Bundle
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Row 2: Selected Risk Dial + Risk Distribution Chart + Sparkline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Overall Threat Index Ring */}
        <div className="lg:col-span-4 rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">Threat Exposure Index</h3>
              <p className="text-xs text-slate-400">Current loan portfolio volatility</p>
            </div>
            <StatusBadge status="WARNING" customLabel="ELEVATED" size="sm" />
          </div>

          <div className="py-6 flex flex-col items-center justify-center">
            <RiskScoreRing
              score={selectedApp.riskScore}
              size={170}
              strokeWidth={12}
              label={`Active Focus: ${selectedApp.applicantName} (${selectedApp.id})`}
            />
          </div>

          <div className="border-t border-surface-border pt-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Velocity Threat Momentum:</span>
              <span className="text-cyan-300 font-semibold">+18% (24h)</span>
            </div>
            <MiniTrendChart
              data={mockHourlyTrend.map((h) => ({ value: h.fraud }))}
              color="#ef4444"
              height={42}
              showTooltip
            />
          </div>
        </div>

        {/* Right: Cohort Risk Distribution Chart */}
        <div className="lg:col-span-8">
          <RiskDistributionChart data={mockRiskDistribution} height={260} />
        </div>
      </div>

      {/* Row 3: Fraud Network Graph & Document Forensics */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <FraudNetworkPlaceholder height={380} />
        </div>
        <div className="xl:col-span-5">
          <DocumentAnalysisPlaceholder
            documentName="Vance_Marcus_W2_2025.pdf"
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
            blockNumber={49821}
            verified={selectedApp.status !== 'FLAGGED'}
            timestamp="2026-09-18 18:52:04 UTC"
            signer="TrustLedger Sentinel HSM #4"
          />

          {/* Quick Context Card */}
          <div className="rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm text-xs space-y-3 font-mono">
            <div className="flex items-center justify-between text-white font-semibold">
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>Active Forensic Focus</span>
              </span>
              <span className="text-cyan-300">{selectedApp.id}</span>
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Applicant:</span>
                <span>{selectedApp.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Requested Capital:</span>
                <span className="text-white font-bold">{selectedApp.loanAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Primary Anomaly:</span>
                <span className="text-red-400 truncate max-w-[200px]">{selectedApp.primaryVector}</span>
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
            <span className="text-xs font-mono text-slate-400">Total: 5</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-[11px] font-mono uppercase text-slate-400">
                <th className="pb-3 pl-2">Application ID</th>
                <th className="pb-3">Applicant</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Risk Index</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Anomaly Vector</th>
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
                        app.riskScore > 65
                          ? 'text-red-400'
                          : app.riskScore > 35
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}>
                        {app.riskScore}
                        <span className="text-[10px] text-slate-500 font-normal">/100</span>
                      </span>
                    </td>
                    <td className="py-3">
                      <StatusBadge status={app.status} size="sm" />
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
