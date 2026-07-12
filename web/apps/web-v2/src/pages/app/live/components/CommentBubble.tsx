import { Bot } from 'lucide-react'
import type { ChatItem } from '../live-preview.lib'

export function CommentBubble({ item }: { item: ChatItem }) {
  const badge =
    item.sentiment === 'hot'
      ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-100'
      : item.sentiment === 'warm'
        ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
        : 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'

  return (
    <article className="text-sm select-text">
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-[10px] font-black text-slate-600">
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
          <p className="rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5 text-[12px] leading-5 text-slate-700">{item.text}</p>
          <div className="mt-2 flex items-start gap-2 rounded-2xl rounded-tr-sm border border-blue-100 bg-blue-50/70 px-3.5 py-2.5">
            <Bot className="mt-px h-3.5 w-3.5 shrink-0 text-blue-600" />
            <div><p className="mb-1 text-[9px] font-black uppercase tracking-wide text-blue-600">1Stream AI · Theo dữ liệu đã duyệt</p><p className="text-[11px] leading-5 text-slate-700">{item.answer}</p></div>
          </div>
        </div>
      </div>
    </article>
  )
}
