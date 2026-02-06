interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
        &#x1F50D;
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search subscriptions..."
        className="w-full pl-9 pr-3 py-2 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-1 focus:ring-text-secondary"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary text-xs cursor-pointer"
        >
          &times;
        </button>
      )}
    </div>
  )
}
