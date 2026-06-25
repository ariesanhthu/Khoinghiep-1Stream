import { Bot } from 'lucide-react'
import type { ChatItem } from '../live-preview.lib'

export function CommentBubble({ item }: { item: ChatItem }) {
  const badge =
    item.sentiment === 'hot'
      ? 'bg-rose-100 text-rose-600'
      : item.sentiment === 'warm'
        ? 'bg-amber-100 text-amber-600'
        : 'bg-primary/10 text-primary'

  return (
    <article className="text-sm select-text">
      <div className="flex items-start gap-2.5">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary mt-0.5">
          {item.name
            .split(' ')
            .map((part) => part[0])
            .slice(-2)
            .join('')
            .toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">{item.name}</span>
            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${badge}`}>{item.intent}</span>
          </div>
          <p className="rounded-xl rounded-tl-sm bg-secondary px-3 py-2 text-[12px] leading-relaxed text-foreground">{item.text}</p>
          <div className="mt-1.5 flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/10 px-3 py-2">
            <Bot className="mt-px h-3.5 w-3.5 shrink-0 text-primary" />
            <p className="text-[11px] leading-relaxed text-foreground/80">{item.answer}</p>
          </div>
        </div>
      </div>
    </article>
  )
}
