export default function MacTopBar() {
  return (
    <div className="flex items-center justify-between px-5 py-3 bg-white shadow-topbar border-b border-slate-100 z-10 shrink-0">
      {/* Left: Traffic lights + App name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-800 tracking-tight">Fin Quest</span>
        </div>
      </div>

      {/* Center: breadcrumb */}
      <p className="text-xs font-medium text-slate-400 hidden md:block">Financial Literacy Workspace</p>

      {/* Right: status pill */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Session
        </span>
      </div>
    </div>
  )
}
