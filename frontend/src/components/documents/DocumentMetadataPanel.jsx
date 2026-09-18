import React from 'react';
import { Database, FileCode2, Layers, Calendar, Cpu, Type } from 'lucide-react';

export default function DocumentMetadataPanel({ metadata = {}, filename = 'document.pdf' }) {
  const metaItems = [
    { label: 'File Name', value: filename, icon: FileCode2 },
    { label: 'File Size', value: metadata.file_size_formatted || '470.8 KB', icon: Database },
    { label: 'Page Count', value: metadata.page_count ? `${metadata.page_count} Pages` : '1 Page', icon: Layers },
    { label: 'Page Dimensions', value: metadata.page_dimensions || '595 x 842 pt (A4)', icon: Layers },
    { label: 'PDF Producer', value: metadata.producer || 'Not available', icon: Cpu, isAlert: metadata.producer?.toLowerCase().includes('photoshop') },
    { label: 'Creator Tool', value: metadata.creator || 'Not available', icon: Cpu },
    { label: 'Creation Timestamp', value: metadata.creation_date || 'Not available', icon: Calendar },
    { label: 'Modification Timestamp', value: metadata.modification_date || 'Not available', icon: Calendar },
    { label: 'Embedded Images', value: `${metadata.image_count || 0} image stream(s)`, icon: Layers }
  ];

  const fonts = metadata.fonts || ['ArialMT', 'Helvetica-Bold'];

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Document Metadata
          </h3>
          <p className="text-xs text-slate-400">
            XMP Info Dictionary and binary header extraction
          </p>
        </div>
        <Database className="h-4 w-4 text-cyan-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
        {metaItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border bg-midnight-950/70 ${
                item.isAlert
                  ? 'border-red-500/40 text-red-200'
                  : 'border-surface-border text-slate-300'
              }`}
            >
              <div className="text-[10px] uppercase text-slate-400 flex items-center gap-1.5 mb-1">
                <Icon className="h-3 w-3 text-cyan-400" />
                <span>{item.label}</span>
              </div>
              <div className="font-semibold truncate text-xs text-white" title={item.value}>
                {item.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Fonts List */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1.5 mb-2">
          <Type className="h-3.5 w-3.5 text-cyan-400" />
          <span>Detected Embedded Font Families ({fonts.length})</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {fonts.map((f, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-midnight-950 border border-surface-border text-slate-300"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
