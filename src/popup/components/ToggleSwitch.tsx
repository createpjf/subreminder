interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export default function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-text-primary">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative w-10 h-5.5 rounded-full transition-colors cursor-pointer
          ${checked ? 'bg-text-primary' : 'bg-border-color'}
        `}
        style={{ width: 40, height: 22 }}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-bg-primary shadow transition-transform
            ${checked ? 'translate-x-[18px]' : 'translate-x-0'}
          `}
        />
      </button>
    </label>
  )
}
