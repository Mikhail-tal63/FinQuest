import {
  Cpu,
  MoreHorizontal,
  LineChart,
  Landmark,
  ShoppingCart,
  Coffee,
  Laptop
} from 'lucide-react'

export default function WalletView() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Wallet</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium tracking-wide">Manage your cards and view spending insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* Left Column: Cards */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Physical Card */}
          <div className="relative rounded-[20px] bg-gradient-to-br from-[#12192b] to-[#0a101d] p-7 text-white shadow-xl shadow-slate-200/50 h-[240px] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              {/* Chip Icon Mock */}
              <div className="w-10 h-12 border border-slate-700/50 rounded-md flex items-center justify-center">
                <Cpu size={24} className="text-slate-400 opacity-60" strokeWidth={1} />
              </div>
              <span className="text-lg font-semibold tracking-wider opacity-90">VISA</span>
            </div>
            
            <div className="mt-6 mb-4">
              <p className="text-xl tracking-[0.25em] font-medium font-mono text-slate-100">•••• •••• •••• 4289</p>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Cardholder Name</p>
                <p className="text-sm font-medium tracking-wide">Alex Chen</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Expires</p>
                <p className="text-sm font-medium tracking-wide">12/26</p>
              </div>
            </div>
          </div>

          {/* Virtual Card */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 transition-shadow hover:shadow-md h-[140px] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-[42px] h-[42px] rounded-full bg-[#1A73E8] flex items-center justify-center shadow-md shadow-blue-500/20">
                  <div className="w-5 h-3.5 border-2 border-white rounded-[3px] opacity-90" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-[15px]">Virtual Card</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-xs font-medium text-slate-500">Active • Online only</p>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-widest text-slate-700">•••• 8821</p>
            </div>
          </div>
        </div>

        {/* Right Column: Insights & Transactions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Insights Grids */}
          <div className="grid grid-cols-2 gap-4">
            {/* Monthly Spend */}
            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 h-[140px] flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <LineChart size={14} className="text-slate-400" strokeWidth={2.5} />
                <span className="text-xs font-semibold text-slate-500">Monthly Spend</span>
              </div>
              <p className="text-3xl font-bold text-slate-800 tracking-tight mb-2">$4,289.50</p>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <span className="text-[10px]">↓</span>
                <span>12% vs last month</span>
              </div>
            </div>

            {/* Available Credit */}
            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 h-[140px] flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <Landmark size={14} className="text-slate-400" strokeWidth={2.5} />
                <span className="text-xs font-semibold text-slate-500">Available Credit</span>
              </div>
              <p className="text-3xl font-bold text-slate-800 tracking-tight mb-4">$20,710.50</p>
              {/* Progress bar */}
              <div className="w-full h-[6px] bg-slate-100 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-[#1A73E8] rounded-full" style={{ width: '18%' }} />
              </div>
            </div>
          </div>

          {/* Recent Transactions List */}
          <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5">
              <h3 className="font-semibold text-slate-800 text-[15px]">Recent Transactions</h3>
              <a href="#" className="text-[13px] font-semibold text-[#1A73E8] hover:text-blue-700 transition-colors">View All</a>
            </div>
            <div className="pb-2">
              {/* Row 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-[38px] h-[38px] rounded-[10px] border border-slate-200/60 bg-white flex items-center justify-center shadow-sm text-slate-500 group-hover:border-slate-300 transition-colors">
                    <ShoppingCart size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-medium text-slate-800">Whole Foods Market</h4>
                    <p className="text-[12px] font-medium text-slate-500 mt-0.5">Today, 2:45 PM • Groceries</p>
                  </div>
                </div>
                <div className="text-[14px] font-semibold text-slate-800 text-right sm:text-left pl-14 sm:pl-0">
                  -$142.80
                </div>
              </div>
              {/* Row 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-[38px] h-[38px] rounded-[10px] border border-slate-200/60 bg-white flex items-center justify-center shadow-sm text-slate-500 group-hover:border-slate-300 transition-colors">
                    <Coffee size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-medium text-slate-800">Blue Bottle Coffee</h4>
                    <p className="text-[12px] font-medium text-slate-500 mt-0.5">Yesterday, 8:30 AM • Dining</p>
                  </div>
                </div>
                <div className="text-[14px] font-semibold text-slate-800 text-right sm:text-left pl-14 sm:pl-0">
                  -$12.50
                </div>
              </div>
              {/* Row 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-[38px] h-[38px] rounded-[10px] border border-slate-200/60 bg-white flex items-center justify-center shadow-sm text-slate-500 group-hover:border-slate-300 transition-colors">
                    <Laptop size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-medium text-slate-800">Apple Store</h4>
                    <p className="text-[12px] font-medium text-slate-500 mt-0.5">Oct 24, 4:15 PM • Electronics</p>
                  </div>
                </div>
                <div className="text-[14px] font-semibold text-slate-800 text-right sm:text-left pl-14 sm:pl-0">
                  -$1,299.00
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
