interface TopBarProps {
  onAdd: () => void
  onToggleList: () => void
  onSettings: () => void
  view: 'calendar' | 'list' | 'settings'
}

export default function TopBar({ onAdd, onToggleList, onSettings, view }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2.5 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onAdd}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-secondary text-text-primary transition-colors cursor-pointer"
          aria-label="Add subscription"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="9" y1="3" x2="9" y2="15" />
            <line x1="3" y1="9" x2="15" y2="9" />
          </svg>
        </button>
        <button
          onClick={onToggleList}
          className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer ${view === 'list' ? 'text-text-primary' : 'text-text-secondary'}`}
          aria-label="Toggle list view"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="3" y1="5" x2="15" y2="5" />
            <line x1="3" y1="9" x2="15" y2="9" />
            <line x1="3" y1="13" x2="15" y2="13" />
          </svg>
        </button>
      </div>

      <span className="text-sm font-semibold text-text-primary tracking-wide">SubReminder</span>

      <div className="flex items-center gap-3">
        <button
          onClick={onSettings}
          className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer ${view === 'settings' ? 'text-text-primary' : 'text-text-secondary'}`}
          aria-label="Settings"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10" cy="10" r="3" />
            <path d="M10 1.5v2M10 16.5v2M3.4 3.4l1.4 1.4M15.2 15.2l1.4 1.4M1.5 10h2M16.5 10h2M3.4 16.6l1.4-1.4M15.2 4.8l1.4-1.4" />
          </svg>
        </button>
      </div>
    </header>
  )
}
