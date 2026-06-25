import { ArrowRight } from 'lucide-react'
import type { ChatItem } from '../live-preview.lib'

export function LeadCard({ lead }: { lead: ChatItem }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-2.5 py-2 hover:border-primary/40 transition">
      <div className="flex items-center gap-2 min-w-0">
        <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
          {lead.name
            .split(' ')
            .map((part) => part[0])
            .slice(-2)
            .join('')
            .toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold text-foreground leading-none">{lead.name}</p>
          <p className="truncate text-[9px] text-rose-500 mt-0.5 font-bold">{lead.intent}</p>
        </div>
      </div>
      <button
        type="button"
        className="rounded-md bg-primary hover:opacity-90 px-2 py-1 text-[9px] font-bold text-white transition flex items-center gap-0.5"
      >
        Liên hệ <ArrowRight className="h-2.5 w-2.5" />
      </button>
    </div>
  )
}
