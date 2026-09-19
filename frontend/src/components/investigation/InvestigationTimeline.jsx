import React from 'react';
import {
  Clock,
  FileCheck2,
  FileUp,
  UserCheck,
  Share2,
  Database,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export default function InvestigationTimeline({ timeline = [] }) {
  const defaultEvents = [
    { time: '21:21', event: 'Application submitted', type: 'submission' },
    { time: '21:23', event: 'Documents uploaded', type: 'upload' },
    { time: '21:27', event: 'Document forensics completed', type: 'doc' },
    { time: '21:32', event: 'KYC analysis completed', type: 'kyc' },
    { time: '21:36', event: 'Fraud network analysis completed', type: 'network' },
    { time: '21:40', event: 'Evidence hash verified', type: 'ledger' },
    { time: '21:42', event: 'Risk assessment generated', type: 'risk' }
  ];

  const events = timeline.length > 0 ? timeline : defaultEvents;

  const iconMap = {
    submission: FileUp,
    upload: FileUp,
    doc: FileCheck2,
    kyc: UserCheck,
    network: Share2,
    ledger: Database,
    risk: ShieldAlert
  };

  return (
    <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-coffee-100 mb-5">
        <div>
          <h2 className="text-sm font-semibold text-espresso tracking-wide">
            Investigation Timeline
          </h2>
          <p className="text-xs text-stone-500">
            Chronological audit of incoming telemetry and automated screening gates
          </p>
        </div>
        <Clock className="h-4 w-4 text-coffee-700" />
      </div>

      <div className="relative pl-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-coffee-200">
        <div className="space-y-4">
          {events.map((evt, idx) => {
            const Icon = iconMap[evt.type] || CheckCircle2;
            const isLatest = idx === events.length - 1;

            return (
              <div key={idx} className="relative flex items-center justify-between group">
                {/* Timeline node marker */}
                <div className={`absolute -left-[19px] flex h-5 w-5 items-center justify-center rounded-full border shadow-xs ${
                  isLatest
                    ? 'border-coffee-600 bg-coffee-600 text-white'
                    : 'border-coffee-300 bg-white text-stone-500'
                }`}>
                  <Icon className="h-2.5 w-2.5" />
                </div>

                <div className="flex-1 ml-2 flex items-center justify-between text-xs font-mono">
                  <span className={`font-medium ${isLatest ? 'text-coffee-800 font-bold' : 'text-stone-700'}`}>
                    {evt.event}
                  </span>
                  <span className="text-stone-500 text-[11px] shrink-0 pl-2">
                    {evt.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
