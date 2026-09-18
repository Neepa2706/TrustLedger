import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Network, ShieldAlert, Smartphone, Landmark, FileText, Share2, Layers } from 'lucide-react';
import StatusBadge from './StatusBadge';

// Custom Node for Fraud Entities
function EntityNode({ data }) {
  const iconMap = {
    application: FileText,
    device: Smartphone,
    phone: Smartphone,
    bank: Landmark,
    syndicate: ShieldAlert
  };

  const Icon = iconMap[data.type] || Network;

  const borderClasses = data.risk === 'critical'
    ? 'border-red-500/70 bg-red-950/40 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
    : data.risk === 'warning'
    ? 'border-amber-500/70 bg-amber-950/40 text-amber-300'
    : 'border-cyan-500/70 bg-cyan-950/40 text-cyan-300';

  return (
    <div className={`px-3 py-2 rounded-lg border text-xs font-mono shadow-md backdrop-blur-md transition-all ${borderClasses}`}>
      <Handle type="target" position={Position.Top} className="w-1.5 h-1.5 !bg-cyan-400" />
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="font-semibold text-white tracking-wide">{data.label}</span>
      </div>
      {data.subtext && (
        <div className="text-[10px] text-slate-400 mt-1">{data.subtext}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-1.5 h-1.5 !bg-cyan-400" />
    </div>
  );
}

export default function FraudNetworkPlaceholder({
  height = 360,
  title = 'Entity Resolution & Fraud Syndicate Graph',
  subtitle = 'Graph neural clustering detecting synthetic identity rings and device reuse',
  className = ''
}) {
  const nodeTypes = useMemo(() => ({ entity: EntityNode }), []);

  const initialNodes = useMemo(() => [
    {
      id: 'target-loan',
      type: 'entity',
      position: { x: 260, y: 140 },
      data: { label: 'Loan #TL-98214', type: 'application', risk: 'critical', subtext: 'Marcus Vance ($35k)' }
    },
    {
      id: 'device-node',
      type: 'entity',
      position: { x: 50, y: 30 },
      data: { label: 'Device: Apple iPhone 14 Pro', type: 'device', risk: 'critical', subtext: 'IMEI shared across 19 apps' }
    },
    {
      id: 'phone-node',
      type: 'entity',
      position: { x: 450, y: 30 },
      data: { label: 'VoIP: +1 (415) 555-0192', type: 'phone', risk: 'warning', subtext: 'Twilio Virtual Carrier' }
    },
    {
      id: 'bank-node',
      type: 'entity',
      position: { x: 80, y: 260 },
      data: { label: 'Routing: Chase #121000358', type: 'bank', risk: 'critical', subtext: 'Rapid turnover mule account' }
    },
    {
      id: 'syndicate-node',
      type: 'entity',
      position: { x: 440, y: 260 },
      data: { label: 'Cluster: PhantomApex Syndicate', type: 'syndicate', risk: 'critical', subtext: 'High-confidence coordinated ring' }
    }
  ], []);

  const initialEdges = useMemo(() => [
    { id: 'e1', source: 'device-node', target: 'target-loan', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
    { id: 'e2', source: 'phone-node', target: 'target-loan', animated: false, style: { stroke: '#f59e0b', strokeWidth: 1.5 } },
    { id: 'e3', source: 'target-loan', target: 'bank-node', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
    { id: 'e4', source: 'target-loan', target: 'syndicate-node', animated: true, style: { stroke: '#ef4444', strokeWidth: 2.5 } }
  ], []);

  return (
    <div className={`rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
            <Share2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status="CRITICAL" customLabel="SYNDICATE DETECTED" pulse size="sm" />
          <span className="text-xs font-mono text-slate-400 bg-midnight-900 px-2 py-1 rounded border border-surface-border">
            Nodes: 5 | Links: 4
          </span>
        </div>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-surface-border bg-midnight-950" style={{ height }}>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#1e293b" gap={18} size={1} />
          <Controls className="!bg-midnight-900 !border-surface-border !fill-cyan-400 [&>button]:!border-surface-border" />
        </ReactFlow>

        {/* Floating Graph Legend Overlay */}
        <div className="absolute top-3 left-3 pointer-events-none rounded border border-surface-border/80 bg-midnight-950/90 px-3 py-2 text-[11px] font-mono text-slate-300 backdrop-blur">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
            <Layers className="h-3 w-3" /> GRAPH RESOLUTION MATRIX
          </div>
          <div className="space-y-0.5 text-slate-400 text-[10px]">
            <div>• Red edges: Multi-application collisions (&gt;10 links)</div>
            <div>• Yellow edges: Disposable/VoIP carrier signals</div>
          </div>
        </div>
      </div>
    </div>
  );
}
