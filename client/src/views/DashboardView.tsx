import { TrendingUp, TrendingDown, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

const transactions = [
  { id: 1, details: 'Electric Company',  category: 'UTILITIES',  date: 'Oct 24, 2023', amount: 142.30,   status: 'PAID'    },
  { id: 2, details: 'Telecom Provider',  category: 'TELECOM',    date: 'Oct 21, 2023', amount: 89.99,    status: 'PAID'    },
  { id: 3, details: 'Monthly Rent',      category: 'RENT',       date: 'Oct 01, 2023', amount: 2400.00,  status: 'PAID'    },
  { id: 4, details: 'Health Insurance',  category: 'INSURANCE',  date: 'Sep 28, 2023', amount: 215.00,   status: 'PAID'    },
  { id: 5, details: 'Grocery Store',     category: 'FOOD',       date: 'Sep 25, 2023', amount: 320.50,   status: 'PAID'    },
  { id: 6, details: 'Internet Service',  category: 'TELECOM',    date: 'Sep 22, 2023', amount: 59.99,    status: 'PAID'    },
  { id: 7, details: 'Gym Membership',    category: 'LIFESTYLE',  date: 'Sep 20, 2023', amount: 49.99,    status: 'PENDING' },
  { id: 8, details: 'Car Insurance',     category: 'INSURANCE',  date: 'Sep 15, 2023', amount: 180.00,   status: 'PENDING' },
]

const CATEGORY_COLORS: Record<string, string> = {
  UTILITIES:  'text-blue-500',
  TELECOM:    'text-purple-500',
  RENT:       'text-rose-500',
  INSURANCE:  'text-orange-500',
  FOOD:       'text-teal-500',
  LIFESTYLE:  'text-pink-500',
}

const PAGE_SIZE = 4

export default function DashboardView() {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE)
  const visibleRows = transactions.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const totalSpent = transactions.filter(t => t.status === 'PAID').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Overview</h1>
        <p className="text-sm text-slate-400 mt-0.5">Your financial snapshot for October 2023</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Spent */}
        <div className="fin-card bg-gradient-to-br from-brand-blue to-brand-blue-light text-white relative overflow-hidden">
          {/* Decorative circle */}
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white opacity-10" />
          <div className="absolute -right-2 bottom-2 w-16 h-16 rounded-full bg-white opacity-5" />
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-100 mb-2">Total Spent (Monthly)</p>
          <p className="text-3xl font-extrabold tracking-tight">${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center gap-1 mt-3">
            <TrendingUp size={13} className="text-blue-200" />
            <span className="text-xs text-blue-100 font-medium">12% from last month</span>
          </div>
        </div>

        {/* Monthly Salary */}
        <div className="fin-card flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Monthly Salary</p>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <DollarSign size={18} className="text-emerald-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight">$5,000</p>
          </div>
          <div className="flex items-center gap-1 mt-3">
            <TrendingDown size={13} className="text-slate-300" />
            <span className="text-xs text-slate-400 font-medium">Remaining: ${(5000 - totalSpent).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] border-b border-slate-100">
          <span className="table-header">Details</span>
          <span className="table-header">Category</span>
          <span className="table-header">Date</span>
          <span className="table-header">Amount</span>
          <span className="table-header pr-5">Status</span>
        </div>

        {/* Rows */}
        {visibleRows.map((tx, idx) => (
          <div
            key={tx.id}
            className={`grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] items-center transition-colors duration-150 hover:bg-slate-50 ${idx !== visibleRows.length - 1 ? 'border-b border-slate-50' : ''}`}
          >
            <span className="table-cell font-medium text-slate-700">{tx.details}</span>
            <span className={`table-cell text-xs font-bold tracking-wider ${CATEGORY_COLORS[tx.category] ?? 'text-slate-500'}`}>{tx.category}</span>
            <span className="table-cell text-slate-500">{tx.date}</span>
            <span className="table-cell font-semibold text-slate-800">${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span className="table-cell pr-5">
              {tx.status === 'PAID' ? (
                <span className="badge-paid">
                  <CheckCircle2 size={11} /> PAID
                </span>
              ) : (
                <span className="badge-pending">⏳ PENDING</span>
              )}
            </span>
          </div>
        ))}

        {/* Footer pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-400">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, transactions.length)} of {transactions.length} transactions
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-blue hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-6 h-6 rounded-md text-xs font-semibold transition-all ${i === page ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-blue-50'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-blue hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
