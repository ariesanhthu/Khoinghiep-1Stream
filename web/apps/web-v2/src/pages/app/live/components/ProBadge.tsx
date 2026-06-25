import { Crown } from 'lucide-react'

interface ProBadgeProps {
  size?: 'sm' | 'md'
  onClick?: () => void
  className?: string
}

export function ProBadge({ size = 'sm', onClick, className = '' }: ProBadgeProps) {
  const sizeClasses = size === 'sm'
    ? 'px-1.5 py-0.5 text-[8px] gap-0.5'
    : 'px-2 py-0.5 text-[9px] gap-1'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-purple-700 text-white font-extrabold tracking-wide cursor-pointer hover:opacity-90 transition shrink-0 ${sizeClasses} ${className}`}
    >
      <Crown className={size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5'} />
      PRO
    </button>
  )
}
