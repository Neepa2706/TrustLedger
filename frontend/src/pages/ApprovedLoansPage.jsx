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
    { name: 'Outstanding', value: summary.outstanding, color: '#6F4E37' },
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
          <div className="flex items-center gap-2 text-xs font-mono text-coffee-600">
            <span>PORTFOLIO MONITORING</span>
            <span className="text-stone-400">/</span>
            <span className="text-stone-500">SERVICING & REPAYMENTS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-espresso mt-1">
            Approved Loans & Payment Monitoring
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time telemetry tracking disbursed capital, scheduled EMIs, and repayment health
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-mono font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
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
        <div className="rounded-xl border border-coffee-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-[10px] uppercase">
            <span>Total Disbursed</span>
            <DollarSign className="h-4 w-4 text-coffee-600" />
          </div>
          <div className="text-2xl font-bold text-espresso mt-2 font-mono">
            ₹{summary.total_disbursed.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-stone-500 mt-1">
            {summary.active_loans_count} active facilities sanctioned
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-[10px] uppercase">
            <span>Total Repaid</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2 font-mono">
            ₹{summary.total_repaid.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-700 mt-1">
            {Math.round((summary.total_repaid / summary.total_disbursed) * 100)}% recovery to date
          </div>
        </div>

        <div className="rounded-xl border border-coffee-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-[10px] uppercase">
            <span>Outstanding</span>
            <CreditCard className="h-4 w-4 text-coffee-600" />
          </div>
          <div className="text-2xl font-bold text-coffee-800 mt-2 font-mono">
            ₹{summary.outstanding.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-stone-500 mt-1">
            Active portfolio principal balance
          </div>
        </div>

        <div className="rounded-xl border border-coffee-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-[10px] uppercase">
            <span>Next Payment</span>
            <Calendar className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-800 mt-2 font-mono">
            ₹{summary.next_payment_amount.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-stone-500 mt-1">
            Due: {summary.next_payment_date}
          </div>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-[10px] uppercase">
            <span>Overdue Amount</span>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-700 mt-2 font-mono">
            ₹{summary.overdue_amount.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-red-700 mt-1">
            {summary.overdue_count} accounts past grace period
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Collections Trend Chart */}
        <div className="lg:col-span-8 rounded-xl border border-coffee-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-coffee-200">
            <div>
              <h3 className="text-sm font-semibold text-espresso">Monthly Servicing Collections</h3>
              <p className="text-xs text-stone-500 mt-0.5">Target vs actual capital collected across approved loans</p>
            </div>
            <span className="text-xs font-mono font-medium text-coffee-700">H2-2026</span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCollections}>
                <XAxis dataKey="month" stroke="#786B63" fontSize={11} />
                <YAxis stroke="#786B63" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FAF8F5', borderColor: '#E8DFD1', color: '#1F1610', fontSize: '11px', fontFamily: 'monospace', borderRadius: '8px' }}
                  formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                />
                <Bar dataKey="target" fill="#D4C5B9" name="Expected Target" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" fill="#6F4E37" name="Collected" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Balance Split */}
        <div className="lg:col-span-4 rounded-xl border border-coffee-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="pb-3 border-b border-coffee-200">
            <h3 className="text-sm font-semibold text-espresso">Portfolio Exposure Ratio</h3>
            <p className="text-xs text-stone-500 mt-0.5">Amortized split of current portfolio</p>
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
                  contentStyle={{ backgroundColor: '#FAF8F5', borderColor: '#E8DFD1', color: '#1F1610', fontSize: '11px', fontFamily: 'monospace', borderRadius: '8px' }}
                  formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 font-mono text-xs pt-3 border-t border-coffee-200">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-stone-700">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold text-espresso">₹{item.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl border border-coffee-200 bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by loan ID, borrower, application, or loan type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-coffee-200 bg-warm-50 py-2 pl-9 pr-4 text-xs text-espresso placeholder-stone-400 focus:border-coffee-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-mono">Status:</span>
          {['ALL', 'CURRENT', 'OVERDUE'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                statusFilter === st
                  ? 'bg-coffee-600 text-white font-semibold shadow-sm'
                  : 'bg-warm-50 text-stone-600 border border-coffee-200 hover:text-espresso hover:bg-warm-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Section 27: Approved Loans Table */}
      <div className="rounded-xl border border-coffee-200 bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-coffee-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-espresso">Disbursed Facilities Ledger ({filteredLoans.length})</h3>
          <span className="text-xs text-stone-500 font-mono">Real-time payment telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-warm-50 text-stone-600 uppercase text-[10px] border-b border-coffee-200">
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
            <tbody className="divide-y divide-coffee-200">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-8 text-center text-stone-500">
                    No approved loans match current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((l) => (
                  <tr
                    key={l.id}
                    className="hover:bg-warm-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 font-bold text-espresso">
                      <div>{l.id}</div>
                      <div className="text-[10px] text-coffee-700 font-medium mt-0.5">{l.application_id}</div>
                    </td>
                    <td className="px-4 py-3 font-sans font-medium text-stone-800">
                      {l.borrower_name}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {l.loan_type}
                    </td>
                    <td className="px-4 py-3 font-bold text-espresso">
                      ₹{l.approved_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {l.tenure_months} mos @ {l.interest_rate}%
                    </td>
                    <td className="px-4 py-3 text-coffee-800 font-bold">
                      ₹{l.emi.toLocaleString('en-IN')}/mo
                    </td>
                    <td className="px-4 py-3 w-48">
                      <div className="flex justify-between text-[10px] text-stone-500 mb-1">
                        <span>₹{l.total_paid.toLocaleString('en-IN')}</span>
                        <span>{l.payment_progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            l.payment_status === 'OVERDUE' ? 'bg-red-500' : 'bg-coffee-600'
                          }`}
                          style={{ width: `${Math.min(100, l.payment_progress_percentage)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {l.next_payment_due_date}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          l.payment_status === 'CURRENT'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : l.payment_status === 'OVERDUE'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {l.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/applications/${l.application_id}`)}
                        className="inline-flex items-center gap-1 text-coffee-700 hover:text-coffee-800 font-medium transition-colors"
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
