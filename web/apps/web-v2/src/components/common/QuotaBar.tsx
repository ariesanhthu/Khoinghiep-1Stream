import { Progress } from '@/components/ui/progress'
import { Infinity as InfinityIcon } from 'lucide-react'

interface QuotaBarProps {
  label: string
  used: number
  total: number | null
}

export function QuotaBar({ label, used, total }: QuotaBarProps) {
  const unlimited = total === null
  const pct = unlimited ? 0 : Math.min(100, Math.round((used / Math.max(total, 1)) * 100))
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        {unlimited ? (
          <span className="flex items-center gap-1 font-medium text-emerald-400">
            <InfinityIcon className="h-4 w-4" /> Không giới hạn
          </span>
        ) : (
          <span className="font-medium">
            {used} / {total}
          </span>
        )}
      </div>
      {!unlimited && <Progress value={pct} />}
    </div>
  )
}
