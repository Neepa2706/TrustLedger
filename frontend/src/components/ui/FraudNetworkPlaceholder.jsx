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
    ? 'border-rose-300 bg-rose-50 text-rose-800 shadow-sm'
    : data.risk === 'warning'
    ? 'border-amber-300 bg-amber-50 text-amber-800 shadow-sm'
    : 'border-coffee-300 bg-white text-coffee-800 shadow-sm';

  return (
    <div className={`px-3 py-2 rounded-xl border text-xs font-mono shadow-sm transition-all ${borderClasses}`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-coffee-600" />
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 shrink-0 text-coffee-700" />
        <span className="font-semibold text-espresso tracking-wide">{data.label}</span>
      </div>
      {data.subtext && (
        <div className="text-[10px] text-stone-500 mt-1">{data.subtext}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-coffee-600" />
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
    { id: 'e1', source: 'device-node', target: 'target-loan', animated: true, style: { stroke: '#dc2626', strokeWidth: 2 } },
    { id: 'e2', source: 'phone-node', target: 'target-loan', animated: false, style: { stroke: '#d97706', strokeWidth: 1.5 } },
    { id: 'e3', source: 'target-loan', target: 'bank-node', animated: true, style: { stroke: '#dc2626', strokeWidth: 2 } },
    { id: 'e4', source: 'target-loan', target: 'syndicate-node', animated: true, style: { stroke: '#dc2626', strokeWidth: 2.5 } }
  ], []);

  return (
    <div className={`rounded-2xl border border-coffee-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-coffee-100">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
            <Share2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-espresso tracking-wide">{title}</h3>
            <p className="text-xs text-stone-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status="CRITICAL" customLabel="SYNDICATE DETECTED" pulse size="sm" />
          <span className="text-xs font-mono text-coffee-800 bg-warm-50 px-2 py-1 rounded border border-coffee-200">
            Nodes: 5 | Links: 4
          </span>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-coffee-200 bg-warm-50/50" style={{ height }}>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#E8DFD1" gap={18} size={1} />
          <Controls className="!bg-white !border-coffee-200 !fill-coffee-700 [&>button]:!border-coffee-200 [&>button]:!bg-white [&>button:hover]:!bg-warm-100" />
        </ReactFlow>

        {/* Floating Graph Legend Overlay */}
        <div className="absolute top-3 left-3 pointer-events-none rounded-xl border border-coffee-200 bg-white/95 px-3 py-2 text-[11px] font-mono text-espresso shadow-md backdrop-blur">
          <div className="flex items-center gap-2 text-coffee-800 font-semibold mb-1">
            <Layers className="h-3 w-3 text-coffee-600" /> GRAPH RESOLUTION MATRIX
          </div>
          <div className="space-y-0.5 text-stone-500 text-[10px]">
            <div>• Red edges: Multi-application collisions (&gt;10 links)</div>
            <div>• Amber edges: Disposable/VoIP carrier signals</div>
          </div>
        </div>
      </div>
    </div>
  );
}
