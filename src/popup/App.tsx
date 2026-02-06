import { useState } from 'react'
import Layout from '@/popup/components/Layout'
import TopBar from '@/popup/components/TopBar'
import Modal from '@/popup/components/Modal'
import SubscriptionForm from '@/popup/components/SubscriptionForm'
import CalendarView from '@/popup/components/CalendarView'
import ListView from '@/popup/components/ListView'
import SettingsPage from '@/popup/pages/SettingsPage'
import type { Subscription } from '@/shared/types'

type View = 'calendar' | 'list' | 'settings'

export default function App() {
  const [view, setView] = useState<View>('calendar')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSub, setEditingSub] = useState<Subscription | null>(null)

  const handleEdit = (sub: Subscription) => {
    setEditingSub(sub)
  }

  const handleCloseEdit = () => {
    setEditingSub(null)
  }

  return (
    <Layout>
      <TopBar
        onAdd={() => setShowAddForm(true)}
        onToggleList={() => setView(view === 'list' ? 'calendar' : 'list')}
        onSettings={() => setView(view === 'settings' ? 'calendar' : 'settings')}
        view={view}
      />
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {view === 'calendar' && <CalendarView onEdit={handleEdit} />}
        {view === 'list' && <ListView onEdit={handleEdit} />}
        {view === 'settings' && <SettingsPage />}
      </main>

      <Modal open={showAddForm} onClose={() => setShowAddForm(false)} title="Add Subscription">
        <SubscriptionForm mode="add" onClose={() => setShowAddForm(false)} />
      </Modal>

      <Modal open={!!editingSub} onClose={handleCloseEdit} title="Edit Subscription">
        {editingSub && (
          <SubscriptionForm mode="edit" subscription={editingSub} onClose={handleCloseEdit} />
        )}
      </Modal>
    </Layout>
  )
}
