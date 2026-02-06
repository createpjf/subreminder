interface FloatingAddButtonProps {
  onClick: () => void
}

export default function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-16 right-4 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center text-2xl shadow-lg hover:opacity-90 transition-opacity cursor-pointer z-10"
      aria-label="Add subscription"
    >
      +
    </button>
  )
}
