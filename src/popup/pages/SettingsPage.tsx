import { useRef } from 'react'
import { useSettingsStore, useSubscriptionStore } from '@/popup/store'
import ToggleSwitch from '@/popup/components/ToggleSwitch'
import SelectField from '@/popup/components/SelectField'
import { CURRENCIES } from '@/shared/constants'

const currencyOptions = CURRENCIES.map((c) => ({ value: c, label: c }))

const reminderOptions = [1, 2, 3, 5, 7]

export default function SettingsPage() {
  const { settings, updateSettings } = useSettingsStore()
  const subscriptions = useSubscriptionStore((s) => s.subscriptions)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data = JSON.stringify({ subscriptions, settings }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `suber-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (data.subscriptions && Array.isArray(data.subscriptions)) {
          const store = useSubscriptionStore.getState()
          for (const sub of data.subscriptions) {
            store.addSubscription(sub)
          }
        }
        if (data.settings) {
          updateSettings(data.settings)
        }
      } catch {
        // Invalid JSON
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleClearAll = () => {
    if (!confirm('Delete all subscriptions? This cannot be undone.')) return
    const store = useSubscriptionStore.getState()
    for (const sub of [...store.subscriptions]) {
      store.deleteSubscription(sub.id)
    }
  }

  const toggleReminderDay = (day: number) => {
    const current = settings.reminderDaysBefore
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort((a, b) => a - b)
    updateSettings({ reminderDaysBefore: next })
  }

  const sectionClass = 'space-y-3'
  const sectionTitle = 'text-[10px] font-bold text-text-secondary uppercase tracking-[1px] mb-2'
  const divider = 'border-t border-border-color my-4'

  return (
    <div className="px-4 py-3 space-y-1">
      {/* Currency */}
      <div className={sectionClass}>
        <h3 className={sectionTitle}>Currency</h3>
        <SelectField
          label="Primary currency"
          value={settings.primaryCurrency}
          onChange={(v) => updateSettings({ primaryCurrency: v })}
          options={currencyOptions}
        />
      </div>

      <div className={divider} />

      {/* Notifications */}
      <div className={sectionClass}>
        <h3 className={sectionTitle}>Notifications</h3>
        <ToggleSwitch
          label="Enable notifications"
          checked={settings.enableNotifications}
          onChange={(v) => updateSettings({ enableNotifications: v })}
        />
        <div>
          <p className="text-sm text-text-primary mb-1.5">Remind me before</p>
          <div className="flex gap-1.5">
            {reminderOptions.map((day) => (
              <button
                key={day}
                onClick={() => toggleReminderDay(day)}
                className={`
                  px-2.5 py-1 text-[10px] font-medium rounded-full transition-colors cursor-pointer
                  ${
                    settings.reminderDaysBefore.includes(day)
                      ? 'bg-text-primary text-bg-primary'
                      : 'bg-bg-cell text-text-secondary hover:bg-border-color'
                  }
                `}
              >
                {day}d
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={divider} />

      {/* Data */}
      <div className={sectionClass}>
        <h3 className={sectionTitle}>Data</h3>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex-1 px-3 py-2 text-xs rounded-lg bg-bg-cell text-text-primary hover:bg-border-color transition-colors cursor-pointer"
          >
            Export JSON
          </button>
          <button
            onClick={handleImport}
            className="flex-1 px-3 py-2 text-xs rounded-lg bg-bg-cell text-text-primary hover:bg-border-color transition-colors cursor-pointer"
          >
            Import JSON
          </button>
        </div>
        <button
          onClick={handleClearAll}
          className="w-full px-3 py-2 text-xs rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors cursor-pointer"
        >
          Clear all data
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className={divider} />

      {/* About */}
      <div className={sectionClass}>
        <h3 className={sectionTitle}>About</h3>
        <p className="text-xs text-text-secondary">Suber v1.0.0</p>
        <a
          href="https://github.com/createpjf/suber"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Website
        </a>
      </div>
    </div>
  )
}
