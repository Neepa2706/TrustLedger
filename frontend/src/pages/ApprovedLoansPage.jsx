import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ArrowUpRight,
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Button from '../components/common/Button';
import StatusBadge from '../components/ui/StatusBadge';
import loanService from '../services/loanService';

export default function ApprovedLoansPage() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [summary, setSummary] = useState({
    total_disbursed: 4250000,
    total_repaid: 1820000,
    outstanding: 2430000,
    next_payment_amount: 145000,
    next_payment_date: '2026-10-05',
    overdue_amount: 68500,
    overdue_count: 3,
    active_loans_count: 42
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [loansRes, summaryRes] = await Promise.allSettled([
          loanService.getApprovedLoans(),
          loanService.getPaymentMonitoringSummary()
        ]);
        if (isMounted) {
          if (loansRes.status === 'fulfilled' && Array.isArray(loansRes.value)) {
            setLoans(loansRes.value);
          }
          if (summaryRes.status === 'fulfilled' && summaryRes.value) {
            setSummary(summaryRes.value);
          }
        }
      } catch (err) {
        console.error('Failed to fetch approved loans:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  const filteredLoans = loans.filter((l) => {
    const matchesStatus =
      statusFilter === 'ALL' || l.payment_status?.toUpperCase() === statusFilter.toUpperCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm.trim() ||
      l.id?.toLowerCase().includes(query) ||
      l.application_id?.toLowerCase().includes(query) ||
      l.borrower_name?.toLowerCase().includes(query) ||
      l.loan_type?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const chartData = [
    { name: 'Repaid', value: summary.total_repaid, color: '#10b981' },
    { name: 'Outstanding', value: summary.outstanding, color: '#06b6d4' },
    { name: 'Overdue', value: summary.overdue_amount, color: '#ef4444' }
  ];

  const monthlyCollections = [
    { month: 'Jun', collected: 320000, target: 350000 },
    { month: 'Jul', collected: 390000, target: 400000 },
    { month: 'Aug', collected: 440000, target: 420000 },
    { month: 'Sep', collected: 460000, target: 450000 },
    { month: 'Oct (Est)', collected: 210000, target: 480000 }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>PORTFOLIO MONITORING</span>
            <span>/</span>
            <span className="text-slate-400">SERVICING & REPAYMENTS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Approved Loans & Payment Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry tracking disbursed capital, scheduled EMIs, and repayment health
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="h-4 w-4" />
            <span>PORTFOLIO LEDGER SYNCED</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/applications')}
          >
            Go to Applications Queue
          </Button>
        </div>
      </div>

      {/* Section 28: Payment Monitoring Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
        <div className="rounded-xl border border-surface-border bg-surface-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
            <span>Total Disbursed</span>
            <DollarSign className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">
            ₹{summary.total_disbursed.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {summary.active_loans_count} active facilities sanctioned
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-surface-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
            <span>Total Repaid</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2 font-mono">
            ₹{summary.total_repaid.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-1">
            {Math.round((summary.total_repaid / summary.total_disbursed) * 100)}% recovery to date
          </div>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
            <span>Outstanding</span>
            <CreditCard className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-300 mt-2 font-mono">
            ₹{summary.outstanding.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Active portfolio principle balance
          </div>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
            <span>Next Payment</span>
            <Calendar className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 mt-2 font-mono">
            ₹{summary.next_payment_amount.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-amber-500/80 mt-1">
            Due: {summary.next_payment_date}
          </div>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
            <span>Overdue Amount</span>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 mt-2 font-mono">
            ₹{summary.overdue_amount.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-red-300/80 mt-1">
            {summary.overdue_count} accounts past grace period
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Collections Trend Chart */}
        <div className="lg:col-span-8 rounded-xl border border-surface-border bg-surface-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-semibold text-white">Monthly Servicing Collections</h3>
              <p className="text-xs text-slate-400 mt-0.5">Target vs actual capital collected across approved loans</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">H2-2026</span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCollections}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', fontSize: '11px', fontFamily: 'monospace' }}
                  formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                />
                <Bar dataKey="target" fill="#334155" name="Expected Target" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" fill="#00f0ff" name="Collected" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Balance Split */}
        <div className="lg:col-span-4 rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-surface-border">
            <h3 className="text-sm font-semibold text-white">Portfolio Exposure Ratio</h3>
            <p className="text-xs text-slate-400 mt-0.5">Amortized split of current portfolio</p>
          </div>

          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', fontSize: '11px', fontFamily: 'monospace' }}
                  formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 font-mono text-xs pt-3 border-t border-surface-border">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold">₹{item.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by loan ID, borrower, application, or loan type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-midnight-950 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Status:</span>
          {['ALL', 'CURRENT', 'OVERDUE'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                statusFilter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-midnight-950 text-slate-400 border border-surface-border hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Section 27: Approved Loans Table */}
      <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-surface-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Disbursed Facilities Ledger ({filteredLoans.length})</h3>
          <span className="text-xs text-slate-400 font-mono">Real-time payment telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-midnight-950 text-slate-400 uppercase text-[10px] border-b border-surface-border">
              <tr>
                <th className="px-4 py-3">Loan ID / App ID</th>
                <th className="px-4 py-3">Borrower</th>
                <th className="px-4 py-3">Facility</th>
                <th className="px-4 py-3">Sanctioned Amount</th>
                <th className="px-4 py-3">Terms (Tenure / Rate)</th>
                <th className="px-4 py-3">Monthly EMI</th>
                <th className="px-4 py-3">Repayment Progress</th>
                <th className="px-4 py-3">Next Due</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-8 text-center text-slate-500">
                    No approved loans match current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((l) => (
                  <tr
                    key={l.id}
                    className="hover:bg-midnight-900/60 transition-colors"
                  >
                    <td className="px-4 py-3 font-bold text-white">
                      <div>{l.id}</div>
                      <div className="text-[10px] text-cyan-400/80 mt-0.5">{l.application_id}</div>
                    </td>
                    <td className="px-4 py-3 font-sans font-medium text-slate-200">
                      {l.borrower_name}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {l.loan_type}
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      ₹{l.approved_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {l.tenure_months} mos @ {l.interest_rate}%
                    </td>
                    <td className="px-4 py-3 text-cyan-300 font-bold">
                      ₹{l.emi.toLocaleString('en-IN')}/mo
                    </td>
                    <td className="px-4 py-3 w-48">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>₹{l.total_paid.toLocaleString('en-IN')}</span>
                        <span>{l.payment_progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-midnight-950 rounded-full h-1.5 border border-slate-700/60 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            l.payment_status === 'OVERDUE' ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                          }`}
                          style={{ width: `${Math.min(100, l.payment_progress_percentage)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {l.next_payment_due_date}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          l.payment_status === 'CURRENT'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : l.payment_status === 'OVERDUE'
                            ? 'bg-red-950 text-red-300 border border-red-500/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {l.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/applications/${l.application_id}`)}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                        title="View Original Dossier"
                      >
                        <span>Dossier</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
