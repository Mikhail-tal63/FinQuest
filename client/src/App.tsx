import { useState } from 'react'
import './index.css'
import MacTopBar from './components/MacTopBar'
import SidebarDock from './components/SidebarDock'
import DashboardView from './views/DashboardView'
import WalletView from './views/WalletView'
import ProfileView from './views/ProfileView'

export type Section = 'dashboard' | 'inbox' | 'wallet' | 'bills' | 'tasks' | 'notifications' | 'profile'

function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard')

  const renderView = () => {
    switch (activeSection) {
      case 'wallet': return <WalletView />
      case 'profile': return <ProfileView />
      case 'dashboard': return <DashboardView />
      default: return <DashboardView />
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-surface">
      <MacTopBar />
      <div className="flex flex-1 overflow-hidden">
        <SidebarDock active={activeSection} onSelect={setActiveSection} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  )
}

export default App
