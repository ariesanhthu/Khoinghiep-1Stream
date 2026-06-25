import { Radio, MessageSquareCode, Send } from 'lucide-react'
import { PLATFORM_META } from '@/types'
import type { PlatformId } from '@/types'
import type { ChatItem } from '../live-preview.lib'
import { MANUAL_QUESTIONS } from '../live-preview.lib'
import { CommentBubble } from './CommentBubble'
import { AddPlatformButton } from './AddPlatformButton'
import type { Platform } from '@/types'
import { ProBadge } from './ProBadge'
import { ProTooltip } from './ProTooltip'
import type { ProFeatureId } from './ProTooltip'

interface LiveChatPanelProps {
  platforms: Platform[]
  liveChannelIds: PlatformId[]
  onToggleChannel: (id: PlatformId) => void
  comments: ChatItem[]
  chatListRef: React.RefObject<HTMLDivElement | null>
  question: string
  onQuestionChange: (v: string) => void
  onSubmitQuestion: (text?: string) => void
  isPro: boolean
  onOpenProModal: (feature: ProFeatureId) => void
}

export function LiveChatPanel({
  platforms,
  liveChannelIds,
  onToggleChannel,
  comments,
  chatListRef,
  question,
  onQuestionChange,
  onSubmitQuestion,
  isPro,
  onOpenProModal,
}: LiveChatPanelProps) {
  return (
    <aside className="hidden lg:flex flex-col h-full min-h-0 w-[340px] select-none shrink-0 border-l border-border">

      <div className="shrink-0 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {platforms.map((p) => {
            const isLiveOn = liveChannelIds.includes(p.id)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onToggleChannel(p.id)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition cursor-pointer shrink-0 ${isLiveOn ? 'border-primary bg-primary/5' : 'border-border bg-card opacity-60 hover:opacity-100'}`}
              >
                <div className={`grid h-5 w-5 place-items-center rounded-full shrink-0 ${isLiveOn ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                  <Radio className="h-2.5 w-2.5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-bold text-foreground leading-none">{PLATFORM_META[p.id].name}</p>
                  <p className={`text-[9px] font-semibold truncate ${isLiveOn ? 'text-rose-500' : 'text-muted-foreground'}`}>
                    {isLiveOn ? 'Live' : p.connected ? 'Ready' : 'Offline'}
                  </p>
                </div>
              </button>
            )
          })}
          <AddPlatformButton />
        </div>
      </div>

      <div className="flex flex-col min-h-0 flex-1 px-4 py-3">
        <div className="mb-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <MessageSquareCode className="h-4 w-4 text-primary" />
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Bình luận trực tiếp</h2>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold">
            {isPro ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-600">AI Online</span>
              </>
            ) : (
              <ProTooltip feature="auto-reply" onOpenModal={onOpenProModal}>
                <span className="flex items-center gap-1.5 cursor-pointer">
                  <span className="text-muted-foreground">AI Offline</span>
                  <ProBadge size="sm" onClick={() => onOpenProModal('auto-reply')} />
                </span>
              </ProTooltip>
            )}
          </span>
        </div>

        <div ref={chatListRef} className="flex-1 min-h-0 space-y-4 overflow-y-auto pr-0.5 mb-3 scrollbar-thin">
          {comments.map((item) => (
            <CommentBubble key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-auto pt-3 shrink-0 border-t border-border">
          <div className="flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MANUAL_QUESTIONS.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => onSubmitQuestion(item)}
                className="shrink-0 whitespace-nowrap rounded-full border border-border bg-secondary hover:border-primary px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-primary transition"
              >
                {item}
              </button>
            ))}
          </div>

          <form
            className="flex gap-2"
            onSubmit={(e) => { e.preventDefault(); onSubmitQuestion() }}
          >
            <input
              value={question}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="Nhập câu hỏi mô phỏng..."
              className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-secondary px-3.5 text-sm outline-none transition focus:border-primary/50 text-foreground placeholder-muted-foreground"
            />
            <button type="submit" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary hover:opacity-90 text-white shadow-sm" aria-label="Gửi câu hỏi">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
