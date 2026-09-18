import React, { useState, useEffect } from 'react';
import { FileEdit, Check, Save, Clock, User, Loader2 } from 'lucide-react';
import loanService from '../../services/loanService';

export default function InvestigatorNotes({ applicationId }) {
  const storageKey = `trustledger_note_${applicationId}`;

  const [note, setNote] = useState('');
  const [notesHistory, setNotesHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load existing notes
  useEffect(() => {
    let isMounted = true;
    const loadNotes = async () => {
      try {
        const remoteNotes = await loanService.getInvestigatorNotes(applicationId);
        if (isMounted && remoteNotes && remoteNotes.length > 0) {
          setNotesHistory(remoteNotes);
        }
      } catch {
        // Use local fallback
      }
    };
    loadNotes();
    const localDraft = localStorage.getItem(storageKey) || '';
    setNote(localDraft);

    return () => {
      isMounted = false;
    };
  }, [applicationId, storageKey]);

  const handleSave = async () => {
    if (!note.trim()) return;
    setIsSaving(true);
    try {
      const added = await loanService.addInvestigatorNote(
        applicationId,
        note,
        'usr_lead_alex',
        'Alex Sterling'
      );
      setNotesHistory((prev) => [added, ...prev]);
      setNote('');
      localStorage.removeItem(storageKey);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      // Offline fallback
      localStorage.setItem(storageKey, note);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/80 p-6 backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <FileEdit className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Investigator Notes
          </h2>
        </div>
        {savedSuccess && (
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            <Check className="h-3 w-3" />
            Note saved
          </span>
        )}
      </div>

      {/* Input area */}
      <div className="space-y-2.5">
        <textarea
          rows={3}
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            localStorage.setItem(storageKey, e.target.value);
          }}
          placeholder="Add supervisory notes, bank statement cross-check notes, or fraud findings..."
          className="w-full rounded-lg border border-surface-border bg-midnight-950 p-3 text-xs text-white placeholder-slate-500 font-mono focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 leading-relaxed"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Private underwriter log • Protected from applicant
          </span>
          <button
            onClick={handleSave}
            disabled={isSaving || !note.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 px-3 py-1.5 text-xs font-mono text-cyan-300 hover:bg-cyan-950/70 hover:border-cyan-400 transition-colors disabled:opacity-40"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5 text-cyan-400" />}
            <span>Record Note</span>
          </button>
        </div>
      </div>

      {/* Notes history stream */}
      {notesHistory.length > 0 && (
        <div className="pt-2 border-t border-surface-border space-y-2">
          <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            Audit Note Trail ({notesHistory.length})
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {notesHistory.map((item, idx) => (
              <div
                key={item.note_id || idx}
                className="p-2.5 rounded-lg bg-midnight-950/70 border border-slate-800/80 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-cyan-300 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {item.author_name || 'Underwriter'}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" />
                    {item.created_at ? item.created_at.slice(0, 16).replace('T', ' ') : 'Just now'}
                  </span>
                </div>
                <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                  {item.note_text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
