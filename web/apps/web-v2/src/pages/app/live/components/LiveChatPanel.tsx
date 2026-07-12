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
    <aside className="hidden h-full min-h-0 w-[380px] shrink-0 select-none flex-col border-l border-slate-200 bg-white xl:flex">

      <div className="shrink-0 border-b border-slate-200 px-4 py-3.5">
        <div className="mb-2.5 flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-[.16em] text-slate-500">Kênh phát</span><span className="text-[10px] font-semibold text-slate-400">Chọn để bật mô phỏng</span></div>
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {platforms.map((p) => {
            const isLiveOn = liveChannelIds.includes(p.id)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onToggleChannel(p.id)}
                className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-2 transition ${isLiveOn ? 'border-blue-300 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white opacity-70 hover:opacity-100'}`}
              >
                <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${isLiveOn ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Radio className="h-2.5 w-2.5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-bold leading-none text-slate-800">{PLATFORM_META[p.id].name}</p>
                  <p className={`truncate text-[9px] font-semibold ${isLiveOn ? 'text-rose-500' : 'text-slate-400'}`}>
                    {isLiveOn ? 'Đang phát' : p.connected ? 'Sẵn sàng' : 'Chưa kết nối'}
                  </p>
                </div>
              </button>
            )
          })}
          <AddPlatformButton />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-4">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MessageSquareCode className="h-4 w-4 text-primary" />
            <div><h2 className="text-xs font-black text-slate-900">Bình luận trực tiếp</h2><p className="mt-0.5 text-[10px] text-slate-400">AI phản hồi từ dữ liệu đã duyệt</p></div>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold">
            {isPro ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-600">AI đang hỗ trợ</span>
              </>
            ) : (
              <ProTooltip feature="auto-reply" onOpenModal={onOpenProModal}>
                <span className="flex items-center gap-1.5 cursor-pointer">
                  <span className="text-slate-400">AI chưa bật</span>
                  <ProBadge size="sm" onClick={() => onOpenProModal('auto-reply')} />
                </span>
              </ProTooltip>
            )}
          </span>
        </div>

        <div ref={chatListRef} className="mb-3 min-h-0 flex-1 space-y-5 overflow-y-auto pr-1 scrollbar-thin">
          {comments.map((item) => (
            <CommentBubble key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-auto shrink-0 border-t border-slate-200 pt-3">
          <div className="flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MANUAL_QUESTIONS.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => onSubmitQuestion(item)}
                className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
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
              placeholder="Nhập bình luận để thử AI..."
              className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
            />
            <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-700" aria-label="Gửi câu hỏi">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
