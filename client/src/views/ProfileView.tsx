import { Pencil } from 'lucide-react'

// Inline SVG avatar matching the cartoon woman illustration in the screenshot
function AvatarIllustration() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background circle */}
      <circle cx="50" cy="50" r="50" fill="#E8D5C4" />

      {/* Hair - back layer */}
      <ellipse cx="50" cy="35" rx="28" ry="30" fill="#2D1B0E" />

      {/* Neck */}
      <rect x="43" y="62" width="14" height="14" rx="4" fill="#FBBF8A" />

      {/* Shoulders / body */}
      <ellipse cx="50" cy="92" rx="30" ry="15" fill="#1A73E8" />

      {/* Face */}
      <ellipse cx="50" cy="52" rx="18" ry="20" fill="#FBBF8A" />

      {/* Hair - front layer (sides and top) */}
      <ellipse cx="50" cy="35" rx="22" ry="22" fill="#1A0000" />
      {/* Hair bangs / top */}
      <path d="M28 42 Q30 28 50 28 Q70 28 72 42 Q65 35 50 34 Q35 35 28 42Z" fill="#1A0000" />

      {/* Eyes */}
      <ellipse cx="43" cy="50" rx="3.5" ry="3.5" fill="white" />
      <ellipse cx="57" cy="50" rx="3.5" ry="3.5" fill="white" />
      <circle cx="43.5" cy="50.5" r="2" fill="#2D1B0E" />
      <circle cx="57.5" cy="50.5" r="2" fill="#2D1B0E" />
      <circle cx="44" cy="49.8" r="0.7" fill="white" />
      <circle cx="58" cy="49.8" r="0.7" fill="white" />

      {/* Eyebrows */}
      <path d="M39 45.5 Q43 43.5 47 45" stroke="#2D1B0E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M53 45 Q57 43.5 61 45.5" stroke="#2D1B0E" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <path d="M50 53 Q48 57 50 58 Q52 57 50 53Z" fill="#E8A870" opacity="0.6" />

      {/* Mouth / smile */}
      <path d="M45 61 Q50 65 55 61" stroke="#C0785A" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Cheeks blush */}
      <ellipse cx="38" cy="57" rx="4" ry="2.5" fill="#F9A8A8" opacity="0.4" />
      <ellipse cx="62" cy="57" rx="4" ry="2.5" fill="#F9A8A8" opacity="0.4" />
    </svg>
  )
}

export default function ProfileView() {
  const currentXP = 1250
  const totalXP = 2000
  const progressPercent = (currentXP / totalXP) * 100
  const xpNeeded = totalXP - currentXP

  return (
    /* Full-height centered layout matching the screenshot */
    <div className="flex items-center justify-center min-h-full">
      <div className="flex flex-col items-center" style={{ width: 320 }}>

        {/* ── Avatar with blue ring + Level badge ── */}
        <div className="relative flex flex-col items-center">
          {/* Blue ring */}
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: 92,
              height: 92,
              background: 'white',
              boxShadow: '0 0 0 3px #1A73E8',
              overflow: 'hidden',
            }}
          >
            <AvatarIllustration />
          </div>

          {/* Level badge — sits below but overlaps the ring */}
          <div
            className="absolute -bottom-3 bg-[#1A73E8] text-white font-bold rounded-full px-4 flex items-center justify-center"
            style={{ fontSize: 11, height: 22, letterSpacing: '0.03em' }}
          >
            Level 5
          </div>
        </div>

        {/* ── Name ── */}
        <h1
          className="font-extrabold text-slate-900 tracking-widest mt-8"
          style={{ fontSize: 26, letterSpacing: '0.12em' }}
        >
          SABRY
        </h1>

        {/* ── XP Progress ── */}
        <div className="w-full mt-9">
          {/* Labels row */}
          <div className="flex items-baseline justify-between mb-1.5 px-0.5">
            <span className="text-[13px] font-semibold text-slate-800">XP Progress</span>
            <span className="text-[12px] font-bold text-[#1A73E8]">{currentXP} / {totalXP}</span>
          </div>
          {/* Bar */}
          <div className="w-full rounded-full overflow-hidden" style={{ height: 10, background: '#E5E7EB' }}>
            <div
              className="h-full rounded-full bg-[#1A73E8] transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Sub label */}
          <p className="text-center text-[11px] font-medium text-slate-400 mt-2">
            {xpNeeded} XP to next level
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div className="flex gap-4 w-full mt-7">
          {/* Total XP */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center py-5 gap-1.5">
            {/* Blue star icon */}
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="#1A73E8" style={{ width: 18, height: 18 }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <p className="text-xl font-bold text-slate-800 leading-none">1,250</p>
            <p className="text-[11px] font-medium text-slate-400">Total XP</p>
          </div>

          {/* Challenges */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center py-5 gap-1.5">
            {/* Orange check icon */}
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" style={{ width: 18, height: 18 }}>
                <circle cx="12" cy="12" r="10" fill="none" stroke="#F97316" strokeWidth="2" />
                <path d="M8 12l3 3 5-5" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <p className="text-xl font-bold text-slate-800 leading-none">15</p>
            <p className="text-[11px] font-medium text-slate-400">Challenges</p>
          </div>
        </div>

        {/* ── Edit Profile button ── */}
        <button
          className="w-full mt-6 bg-[#1A73E8] hover:bg-blue-700 active:scale-[0.98] transition-all text-white font-semibold text-sm rounded-full flex items-center justify-center gap-2 shadow-sm"
          style={{ height: 46 }}
        >
          <Pencil size={14} strokeWidth={2.5} />
          Edit Profile
        </button>

      </div>
    </div>
  )
}
