import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radio, Users, MessageSquare, Clock, Sparkles, Mic, UserSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/components/ui/sonner'
import { cn, uid } from '@/lib/utils'
import { PLATFORM_META } from '@/types'
import type { Comment, PlatformId } from '@/types'
import { useLiveSessionStore } from '@/store/liveSessionStore'
import { useProductStore } from '@/store/productStore'
import { useVoiceStore } from '@/store/voiceStore'
import { useModelStore } from '@/store/modelStore'

const AUTHORS = [
  'Minh Anh', 'Thuỳ Linh', 'Quốc Bảo', 'Hồng Nhung', 'Tuấn Kiệt', 'Phương Thảo',
  'Đức Huy', 'Mai Chi', 'Hoàng Long', 'Bích Ngọc', 'Văn Toàn', 'Thu Hà',
  'Gia Hân', 'Khánh Vy', 'Trọng Tín', 'Lan Phương',
]

type Topic = 'tuition' | 'schedule' | 'entry' | 'format' | 'praise' | 'trial'

const TEXT_POOL: { topic: Topic; text: string }[] = [
  { topic: 'tuition', text: 'Học phí khóa này bao nhiêu vậy trung tâm?' },
  { topic: 'tuition', text: 'Đăng ký sớm có ưu đãi không ạ?' },
  { topic: 'schedule', text: 'Lớp gần nhất khai giảng ngày nào?' },
  { topic: 'schedule', text: 'Có lớp học cuối tuần không ạ?' },
  { topic: 'entry', text: 'Em mất gốc thì có học được không?' },
  { topic: 'entry', text: 'Khóa này yêu cầu đầu vào thế nào ạ?' },
  { topic: 'format', text: 'Trung tâm có lớp online không?' },
  { topic: 'format', text: 'Lớp học ở cơ sở nào vậy ạ?' },
  { topic: 'praise', text: 'Lộ trình nghe phù hợp với mình quá!' },
  { topic: 'praise', text: 'Cảm ơn trung tâm tư vấn rõ ràng ạ ❤️' },
  { topic: 'trial', text: 'Cho mình đăng ký học thử nhé!' },
  { topic: 'trial', text: 'Đăng ký kiểm tra đầu vào như thế nào ạ?' },
]

function replyFor(topic: Topic, productName: string): string {
  switch (topic) {
    case 'tuition':
      return `Học phí "${productName}" được áp dụng theo bảng giá đã duyệt. Tư vấn viên sẽ xác nhận ưu đãi còn hiệu lực trước khi bạn đăng ký.`
    case 'schedule':
      return 'Lớp gần nhất khai giảng ngày 28/07, học thứ 3-5-7 từ 19:00 đến 20:30. Trung tâm cũng có ca cuối tuần ạ.'
    case 'entry':
      return 'Khóa phù hợp với đầu vào khoảng IELTS 3.0–3.5. Bạn có thể đăng ký kiểm tra miễn phí trước khi xếp lớp.'
    case 'format':
      return 'Hiện có lớp trực tiếp tại cơ sở Quận 3. Lịch online được mở theo từng đợt; tư vấn viên sẽ kiểm tra giúp bạn.'
    case 'praise':
      return 'Cảm ơn bạn đã quan tâm! Nếu cần lộ trình chi tiết, bạn để lại từ khóa TƯ VẤN để trung tâm hỗ trợ nhé ❤️'
    case 'trial':
      return 'Bạn để lại từ khóa HỌC THỬ để nhận biểu mẫu. Thông tin chỉ được chuyển cho tư vấn viên khi bạn đồng ý.'
    default:
      return 'Cảm ơn bạn đã quan tâm khóa học ạ!'
  }
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function fmtElapsed(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function LiveDashboardPage() {
  const navigate = useNavigate()
  const {
    config,
    isLive,
    activePlatforms,
    comments,
    aiAutoReply,
    stopLive,
    togglePlatform,
    setAiAutoReply,
  } = useLiveSessionStore()
  const { products } = useProductStore()
  const { voices } = useVoiceStore()
  const { models } = useModelStore()

  const product = products.find((p) => p.id === config?.productId)
  const voice = voices.find((v) => v.id === config?.voiceId)
  const model = models.find((m) => m.id === config?.modelId)

  const [tab, setTab] = useState<string>('all')
  const [elapsed, setElapsed] = useState(0)
  const [viewers, setViewers] = useState<Record<PlatformId, number>>(() => ({
    tiktok: 0,
    facebook: 0,
    youtube: 0,
  }))

  // Redirect if not live
  useEffect(() => {
    if (!isLive || !config) navigate('/live/setup')
  }, [isLive, config, navigate])

  // Init viewers for config platforms
  useEffect(() => {
    if (!config) return
    setViewers((prev) => {
      const next = { ...prev }
      for (const id of config.platforms) {
        if (!next[id]) next[id] = 200 + Math.floor(Math.random() * 1500)
      }
      return next
    })
  }, [config])

  // Elapsed timer
  useEffect(() => {
    if (!isLive) return
    const t = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(t)
  }, [isLive])

  // Viewer drift (only active platforms)
  useEffect(() => {
    if (!isLive) return
    const t = setInterval(() => {
      setViewers((prev) => {
        const next = { ...prev }
        const active = useLiveSessionStore.getState().activePlatforms
        for (const id of active) {
          const drift = Math.floor(Math.random() * 60) - 20
          next[id] = Math.max(0, (next[id] ?? 300) + drift)
        }
        return next
      })
    }, 3000)
    return () => clearInterval(t)
  }, [isLive])

  // Realtime comment generator
  useEffect(() => {
    if (!isLive) return
    let cancelled = false

    function schedule() {
      const delay = 2500 + Math.random() * 1500
      return window.setTimeout(() => {
        if (cancelled) return
        const store = useLiveSessionStore.getState()
        const active = store.activePlatforms
        if (active.length > 0) {
          const platform = active[Math.floor(Math.random() * active.length)]
          const author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)]
          const pick = TEXT_POOL[Math.floor(Math.random() * TEXT_POOL.length)]
          const id = uid('c')
          const comment: Comment = {
            id,
            platform,
            author,
            avatar: `https://i.pravatar.cc/80?u=${id}`,
            text: pick.text,
            createdAt: new Date().toISOString(),
            aiReplied: false,
          }
          store.pushComment(comment)

          if (store.aiAutoReply) {
            window.setTimeout(() => {
              if (cancelled) return
              const pName = product?.name ?? 'khóa học'
              useLiveSessionStore.getState().setAiReply(id, replyFor(pick.topic, pName))
            }, 1500)
          }
        }
        timer = schedule()
      }, delay)
    }

    let timer = schedule()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [isLive, product])

  const filtered = useMemo(() => {
    const list = tab === 'all' ? comments : comments.filter((c) => c.platform === tab)
    return [...list].reverse()
  }, [comments, tab])

  const totalViewers = useMemo(
    () => activePlatforms.reduce((sum, id) => sum + (viewers[id] ?? 0), 0),
    [activePlatforms, viewers]
  )

  function handleStop() {
    stopLive()
    toast.success('Đã kết thúc phiên live')
    navigate('/live/preview')
  }

  if (!isLive || !config) return null

  const previewImg = model?.kind === 'video' ? model.thumbnail : model?.url ?? model?.thumbnail

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="destructive" className="gap-1.5 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulseLive" /> LIVE
          </Badge>
          <Stat icon={Clock} value={fmtElapsed(elapsed)} label="Thời lượng" />
          <Stat icon={MessageSquare} value={String(comments.length)} label="Bình luận" />
          <Stat icon={Users} value={totalViewers.toLocaleString('vi-VN')} label="Người xem" />
        </div>
        <Button variant="destructive" onClick={handleStop}>
          Kết thúc Live
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative aspect-video w-full bg-black">
              {previewImg && (
                <img src={previewImg} alt={model?.name} className="h-full w-full object-cover opacity-90" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

              <Badge variant="destructive" className="absolute left-3 top-3 gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulseLive" /> LIVE
              </Badge>

              {/* Audio waveform */}
              <div className="absolute bottom-16 left-3 flex items-end gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-brand-gradient animate-pulseLive"
                    style={{
                      height: `${8 + Math.abs(Math.sin(i)) * 28}px`,
                      animationDelay: `${i * 80}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Product overlay */}
              {product && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-lg bg-black/60 p-2 backdrop-blur">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{product.name}</p>
                    <p className="text-xs text-white/70">Đang giới thiệu</p>
                  </div>
                </div>
              )}
            </div>
            <CardContent className="flex flex-wrap items-center gap-4 p-4 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Mic className="h-4 w-4" /> Giọng: <span className="text-foreground">{voice?.name ?? '—'}</span>
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <UserSquare className="h-4 w-4" /> Người mẫu:{' '}
                <span className="text-foreground">{model?.name ?? '—'}</span>
              </span>
            </CardContent>
          </Card>

          {/* Platform toggles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nền tảng phát sóng</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {config.platforms.map((id) => {
                const meta = PLATFORM_META[id]
                const on = activePlatforms.includes(id)
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: meta.color }}
                      >
                        {meta.short}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{meta.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {on ? `${(viewers[id] ?? 0).toLocaleString('vi-VN')} người xem` : 'Đã tắt'}
                        </p>
                      </div>
                    </div>
                    <Switch checked={on} onCheckedChange={() => togglePlatform(id)} />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Comments */}
        <div>
          <Card className="flex h-full flex-col">
            <CardHeader className="gap-3">
              <CardTitle className="text-base">Bình luận trực tiếp</CardTitle>
              <div className="flex items-center justify-between rounded-lg border border-border p-2.5">
                <span className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" /> AI tự động trả lời bình luận
                </span>
                <Switch checked={aiAutoReply} onCheckedChange={setAiAutoReply} />
              </div>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col">
              <Tabs value={tab} onValueChange={setTab} className="flex min-h-0 flex-1 flex-col">
                <TabsList className="flex w-full flex-wrap">
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  {config.platforms.map((id) => (
                    <TabsTrigger key={id} value={id}>
                      {PLATFORM_META[id].short}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value={tab} className="mt-4 max-h-[28rem] flex-1 space-y-3 overflow-y-auto pr-1">
                  {filtered.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      Đang chờ bình luận đầu tiên...
                    </p>
                  ) : (
                    filtered.map((c) => {
                      const meta = PLATFORM_META[c.platform]
                      return (
                        <div key={c.id} className="rounded-lg border border-border p-3">
                          <div className="flex items-start gap-2.5">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={c.avatar} alt={c.author} />
                              <AvatarFallback>{c.author.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="truncate text-sm font-medium">{c.author}</span>
                                <Badge
                                  className="shrink-0 text-[10px] text-white"
                                  style={{ backgroundColor: meta.color }}
                                >
                                  {meta.short}
                                </Badge>
                                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                                  {fmtTime(c.createdAt)}
                                </span>
                              </div>
                              <p className="mt-0.5 text-sm">{c.text}</p>
                            </div>
                          </div>
                          {c.aiReplied && c.aiReply && (
                            <div className="mt-2 ml-10 rounded-lg bg-primary/10 p-2.5">
                              <Badge variant="brand" className="mb-1 gap-1 text-[10px]">
                                <Sparkles className="h-3 w-3" /> AI
                              </Badge>
                              <p className="text-sm text-foreground/90">{c.aiReply}</p>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Clock
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-sm font-semibold leading-none">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
