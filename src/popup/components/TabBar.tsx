export type TabId = 'calendar' | 'list' | 'analytics' | 'settings'

interface TabBarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; label: string; icon: string; disabled?: boolean }[] = [
  { id: 'calendar', label: 'Calendar', icon: '\uD83D\uDCC5' },
  { id: 'list', label: 'List', icon: '\uD83D\uDCCB' },
  { id: 'analytics', label: 'Analytics', icon: '\uD83D\uDCCA', disabled: true },
  { id: 'settings', label: 'Settings', icon: '\u2699\uFE0F' },
]

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="flex items-center justify-around border-t border-border-color bg-bg-primary shrink-0 py-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={`
              flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-colors
              ${isActive ? 'text-accent' : 'text-text-secondary'}
              ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-bg-secondary cursor-pointer'}
            `}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
