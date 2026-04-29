import {
  Mail,
  Wallet,
  Receipt,
  CheckSquare,
  Bell,
  User,
  LayoutDashboard,
} from 'lucide-react'
import type { Section } from '../App'

interface Props {
  active: Section
  onSelect: (s: Section) => void
}

const navItems: { id: Section; icon: React.ElementType; label: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'inbox',     icon: Mail,           label: 'Inbox'     },
  { id: 'wallet',    icon: Wallet,         label: 'Wallet'    },
  { id: 'bills',     icon: Receipt,        label: 'Bills'     },
  { id: 'tasks',     icon: CheckSquare,    label: 'Tasks'     },
  { id: 'notifications', icon: Bell,       label: 'Alerts'    },
  { id: 'profile',   icon: User,           label: 'Profile'   },
]

export default function SidebarDock({ active, onSelect }: Props) {
  return (
    <aside className="flex flex-col items-center py-5 px-2 gap-2 bg-white shadow-dock border-r border-slate-100 z-10 shrink-0 w-[68px]">
      {navItems.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          title={label}
          onClick={() => onSelect(id)}
          className={`dock-btn ${active === id ? 'active' : ''}`}
        >
          <Icon size={20} strokeWidth={active === id ? 2.5 : 1.8} />
        </button>
      ))}

      {/* Spacer and version */}
      <div className="flex-1" />
      <div className="w-8 h-px bg-slate-100 rounded-full mb-1" />
      <span className="text-[9px] font-medium text-slate-300 rotate-90 tracking-widest">v1.0</span>
    </aside>
  )
}
