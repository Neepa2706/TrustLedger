import React from 'react';
import { Network, Share2, Layers, ShieldAlert, Cpu, ZoomIn, Download } from 'lucide-react';
import FraudNetworkPlaceholder from '../components/ui/FraudNetworkPlaceholder';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/common/Button';

export default function FraudNetworkPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>GRAPH INTELLIGENCE</span>
            <span>/</span>
            <span className="text-slate-400">ENTITY RESOLUTION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Fraud Syndicate Network Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify multi-application collusions, shared device fingerprints, and mule bank clusters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={Download}>
            Export Graph Topology
          </Button>
          <Button variant="danger" size="sm" icon={ShieldAlert}>
            Freeze Syndicate Cluster
          </Button>
        </div>
      </div>

      {/* Main Graph Component */}
      <FraudNetworkPlaceholder
        height={520}
        title="Interactive Syndicate Topology (PhantomApex Ring)"
        subtitle="Live graph neural net analysis clustering cross-lender entity sharing"
      />

      {/* Entity Breakdown Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="rounded-xl border border-surface-border bg-surface-card p-4">
          <div className="text-slate-400 uppercase text-[10px]">Identified Syndicate Nodes</div>
          <div className="text-xl font-bold text-red-400 mt-1">19 Correlated Entities</div>
          <div className="text-slate-500 mt-1">Device IMEI reused across 4 states</div>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-card p-4">
          <div className="text-slate-400 uppercase text-[10px]">Total Syndicate Loan Exposure</div>
          <div className="text-xl font-bold text-amber-400 mt-1">$485,000 Requested</div>
          <div className="text-slate-500 mt-1">Intercepted before disbursement</div>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-card p-4">
          <div className="text-slate-400 uppercase text-[10px]">Cluster Confidence Score</div>
          <div className="text-xl font-bold text-cyan-400 mt-1">98.7% Precision</div>
          <div className="text-slate-500 mt-1">Deterministic identity overlap</div>
        </div>
      </div>
    </div>
  );
}
