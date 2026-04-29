import { useEffect, useState } from 'react'
import { Archive, ShieldAlert, Trash2, MoreVertical, Mail, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import {
  fetchInboxScenario,
  fetchDemoUser,
  submitAnswer,
  type Scenario,
  type TimelineEvent,
} from '../api/scenarioApi'

type Stage = 'reading' | 'submitting' | 'result'

export default function InboxView() {
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [stage, setStage] = useState<Stage>('reading')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])

  useEffect(() => {
    Promise.all([fetchInboxScenario(), fetchDemoUser()])
      .then(([s, uid]) => {
        setScenario(s)
        setUserId(uid)
      })
      .catch(() => setError('Could not reach server. Is it running?'))
      .finally(() => setLoading(false))
  }, [])

  const handleChoice = async (index: number) => {
    if (!scenario || !userId) return
    setSelectedIndex(index)
    setStage('submitting')
    try {
      const result = await submitAnswer(userId, scenario._id, index)
      setTimeline(result.timeline)
      setStage('result')
    } catch {
      setError('Failed to submit.')
      setStage('reading')
      setSelectedIndex(null)
    }
  }

  const handleReset = () => {
    setStage('reading')
    setSelectedIndex(null)
    setTimeline([])
  }

  const selectedChoice = selectedIndex !== null ? scenario?.choices[selectedIndex] : null
  const isCorrect = selectedChoice?.qualityLevel === 'best'

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-[13px] text-slate-400">Loading…</p>
      </div>
    )
  }

  if (error || !scenario) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-[13px] text-red-400">{error ?? 'No scenario found.'}</p>
      </div>
    )
  }

  const meta = scenario.emailMeta

  return (
    <div className="h-full w-full p-6 lg:p-8 flex gap-6 lg:gap-10">

      {/* ── Left Column: Mail List ── */}
      <div className="w-[300px] lg:w-[340px] shrink-0 flex flex-col">
        <div className="flex items-center justify-between pl-1 mb-6">
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Inbox</h1>
          <div className="flex bg-white rounded-[10px] p-[3px] shadow-sm border border-slate-100">
            <button className="px-3 py-1 text-[11px] font-medium text-slate-800 rounded-[7px]">All mail</button>
            <button className="px-3 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-600 rounded-[7px]">Unread</button>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="bg-white rounded-[12px] p-4 shadow-sm border border-red-100 cursor-pointer ring-1 ring-red-200">
            <div className="flex items-start justify-between mb-1">
              <span className="text-[13px] font-semibold text-slate-800">{meta?.sender ?? 'Unknown'}</span>
              <span className="text-[11px] font-medium text-slate-400">1 min ago</span>
            </div>
            <p className="text-[12px] text-slate-500 truncate">{meta?.preview ?? scenario.description}</p>
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500 bg-red-50 rounded-full px-2 py-0.5">
                <AlertTriangle size={10} /> Suspicious
              </span>
            </div>
          </div>

          <div className="bg-white rounded-[12px] p-4 border border-slate-100/50 opacity-50 cursor-not-allowed">
            <div className="flex items-start justify-between">
              <span className="text-[13px] font-semibold text-slate-700">Internet Service Provider</span>
              <span className="text-[11px] font-medium text-slate-400">2 days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Column: Mail Details ── */}
      <div className="flex-1 flex flex-col pt-2 min-w-0">

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4 pr-1">
          <div className="flex items-center gap-2">
            <button className="w-[34px] h-[34px] bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 shadow-sm transition">
              <Archive size={16} strokeWidth={2} />
            </button>
            <button className="w-[34px] h-[34px] bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 shadow-sm transition">
              <ShieldAlert size={16} strokeWidth={2} />
            </button>
            <button className="w-[34px] h-[34px] bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 shadow-sm transition">
              <Trash2 size={16} strokeWidth={2} />
            </button>
          </div>
          <button className="w-[34px] h-[34px] bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 shadow-sm transition">
            <MoreVertical size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="w-full h-[1px] bg-slate-200/80 mb-5" />

        {/* From / date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 px-1 gap-2">
          <div className="flex items-center gap-3">
            <div className="text-red-400"><Mail size={16} strokeWidth={2} /></div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] font-semibold text-slate-800">{meta?.sender ?? 'Unknown'}</span>
              <span className="text-[11px] font-medium text-slate-400">1 min ago</span>
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-400 shrink-0">Apr 29, 2026, 1:15 PM</span>
        </div>

        <div className="w-full h-[1px] bg-slate-200/80 mb-6" />

        {/* Subject + body */}
        <div className="px-1 mb-4">
          <h2 className="text-[15px] font-bold text-slate-800">{meta?.subject ?? scenario.title}</h2>
        </div>
        <div className="px-1 mb-6">
          <p className="text-[14px] text-slate-700 leading-relaxed">{scenario.description}</p>
        </div>

        <div className="w-full h-[1px] bg-slate-200/80 mb-6" />

        {/* ── Choices ── */}
        {stage === 'reading' && (
          <div className="px-1">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-slate-400 mb-3">What do you do?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scenario.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(i)}
                  className="flex items-start gap-3 bg-white border border-slate-200 rounded-[12px] px-4 py-3 text-left text-[13px] font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all shadow-sm"
                >
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-500 shrink-0">
                    {i + 1}
                  </span>
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === 'submitting' && (
          <div className="px-1">
            <p className="text-[13px] text-slate-400">Submitting…</p>
          </div>
        )}

        {/* ── Result ── */}
        {stage === 'result' && selectedChoice && (
          <div className="px-1 space-y-4">
            <div className={`rounded-[14px] p-5 border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-3">
                <div className={`shrink-0 mt-0.5 ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                </div>
                <div>
                  <p className={`text-[14px] font-bold mb-1 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Great choice!' : selectedChoice.qualityLevel === 'average' ? 'Could be better.' : 'Wrong call!'}
                  </p>
                  <p className={`text-[13px] leading-relaxed ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                    {selectedChoice.feedback}
                  </p>
                </div>
              </div>
            </div>

            {timeline.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-[14px] p-4 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">What happens next</p>
                <div className="space-y-2">
                  {timeline.map((ev, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${ev.isPositive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 mr-2">Day {ev.day}</span>
                        <span className={`text-[12px] ${ev.isPositive ? 'text-emerald-700' : 'text-red-700'}`}>{ev.event}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleReset} className="text-[12px] font-medium text-slate-500 hover:text-slate-800 underline transition">
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
