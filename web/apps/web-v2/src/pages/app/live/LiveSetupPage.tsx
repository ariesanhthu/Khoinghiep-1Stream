import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Radio,
  Plug,
  Package,
  Mic,
  UserSquare,
  Video,
  AlertTriangle,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, formatVND } from '@/lib/utils'
import { PLATFORM_META } from '@/types'
import type { PlatformId } from '@/types'
import { usePlatformStore } from '@/store/platformStore'
import { useProductStore } from '@/store/productStore'
import { useVoiceStore } from '@/store/voiceStore'
import { useModelStore } from '@/store/modelStore'
import { useSubscriptionStore } from '@/store/subscriptionStore'
import { useLiveSessionStore } from '@/store/liveSessionStore'

const STEPS: { label: string; icon: LucideIcon }[] = [
  { label: 'Nền tảng', icon: Plug },
  { label: 'Sản phẩm', icon: Package },
  { label: 'Giọng & Người mẫu', icon: Mic },
  { label: 'Xác nhận', icon: Check },
]

export function LiveSetupPage() {
  const navigate = useNavigate()
  const { connectedPlatforms } = usePlatformStore()
  const { products } = useProductStore()
  const { voices } = useVoiceStore()
  const { models } = useModelStore()
  const { subscription, currentPlan, incrementVideoUsage } = useSubscriptionStore()
  const { setConfig, startLive } = useLiveSessionStore()

  const connected = connectedPlatforms()
  const plan = currentPlan()

  const [step, setStep] = useState(0)
  const [selPlatforms, setSelPlatforms] = useState<PlatformId[]>([])
  const [selProduct, setSelProduct] = useState<string>('')
  const [selVoice, setSelVoice] = useState<string>('')
  const [selModel, setSelModel] = useState<string>('')

  const maxConcurrent = plan?.maxConcurrentPlatforms ?? Infinity
  const tooManyPlatforms = selPlatforms.length > maxConcurrent

  const quotaBlocked =
    !!subscription &&
    !!plan &&
    plan.maxVideosPerMonth !== null &&
    subscription.videosUsed >= plan.maxVideosPerMonth

  const missing: { label: string; to: string }[] = []
  if (connected.length === 0) missing.push({ label: 'Kết nối nền tảng', to: '/platforms' })
  if (products.length === 0) missing.push({ label: 'Thêm sản phẩm', to: '/products' })
  if (voices.length === 0) missing.push({ label: 'Thêm giọng nói', to: '/voices' })
  if (models.length === 0) missing.push({ label: 'Thêm người mẫu', to: '/models' })

  function togglePlatform(id: PlatformId) {
    setSelPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const canNext =
    (step === 0 && selPlatforms.length >= 1 && !tooManyPlatforms) ||
    (step === 1 && !!selProduct) ||
    (step === 2 && !!selVoice && !!selModel) ||
    step === 3

  function handleStart() {
    if (quotaBlocked) return
    setConfig({
      platforms: selPlatforms,
      productId: selProduct,
      voiceId: selVoice,
      modelId: selModel,
    })
    startLive()
    incrementVideoUsage()
    navigate('/live/dashboard')
  }

  const product = products.find((p) => p.id === selProduct)
  const voice = voices.find((v) => v.id === selVoice)
  const model = models.find((m) => m.id === selModel)

  return (
    <div>
      <PageHeader
        title="Bắt đầu Live"
        description="Thiết lập phiên livestream AI qua 4 bước đơn giản."
      />

      {missing.length > 0 && (
        <Card className="mb-6 border-amber-500/40 bg-amber-500/5">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div>
                <p className="text-sm font-medium">Bạn cần hoàn tất các mục sau để bắt đầu:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {missing.map((m) => (
                    <Button
                      key={m.to}
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(m.to)}
                    >
                      {m.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stepper */}
      <div className="mb-8 flex items-center">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const active = i === step
          const done = i < step
          return (
            <div key={s.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                    active && 'border-transparent bg-brand-gradient text-white',
                    done && 'border-emerald-500 bg-emerald-500/15 text-emerald-400',
                    !active && !done && 'border-border text-muted-foreground'
                  )}
                >
                  {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium',
                    active ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1 rounded',
                    i < step ? 'bg-emerald-500' : 'bg-border'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          {/* STEP 1: Platforms */}
          {step === 0 &&
            (connected.length === 0 ? (
              <EmptyState
                icon={Plug}
                title="Chưa kết nối nền tảng nào"
                description="Bạn cần kết nối ít nhất một nền tảng để bắt đầu live."
                actionLabel="Đi tới Nền tảng"
                onAction={() => navigate('/platforms')}
              />
            ) : (
              <div>
                <h2 className="mb-1 text-lg font-semibold">Chọn nền tảng phát sóng</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Chọn một hoặc nhiều nền tảng để phát đồng thời.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {connected.map((p) => {
                    const meta = PLATFORM_META[p.id]
                    const selected = selPlatforms.includes(p.id)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePlatform(p.id)}
                        className={cn(
                          'relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all',
                          selected
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-muted-foreground/50'
                        )}
                      >
                        {selected && (
                          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                        <span
                          className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: meta.color }}
                        >
                          {meta.short}
                        </span>
                        <span className="text-sm font-medium">{meta.name}</span>
                        {p.account && (
                          <span className="text-xs text-muted-foreground">{p.account}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
                {tooManyPlatforms && (
                  <p className="mt-4 flex items-center gap-2 text-sm text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    Gói hiện tại chỉ hỗ trợ phát tối đa {maxConcurrent} nền tảng cùng lúc.
                  </p>
                )}
              </div>
            ))}

          {/* STEP 2: Product */}
          {step === 1 &&
            (products.length === 0 ? (
              <EmptyState
                icon={Package}
                title="Chưa có sản phẩm nào"
                description="Thêm sản phẩm để giới thiệu khi live."
                actionLabel="Đi tới Sản phẩm"
                onAction={() => navigate('/products')}
              />
            ) : (
              <div>
                <h2 className="mb-1 text-lg font-semibold">Chọn sản phẩm</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Chọn một sản phẩm để AI giới thiệu trong phiên live.
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {products.map((p) => {
                    const selected = selProduct === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelProduct(p.id)}
                        className={cn(
                          'group overflow-hidden rounded-xl border-2 text-left transition-all',
                          selected
                            ? 'border-primary ring-2 ring-primary/30'
                            : 'border-border hover:border-muted-foreground/50'
                        )}
                      >
                        <div className="relative aspect-square overflow-hidden bg-secondary">
                          {p.images[0] && (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                          {selected && (
                            <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Check className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
                          <p className="mt-0.5 text-sm font-semibold text-primary">
                            {formatVND(p.price)}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

          {/* STEP 3: Voice + Model */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
                  <Mic className="h-5 w-5" /> Chọn giọng nói
                </h2>
                {voices.length === 0 ? (
                  <EmptyState
                    icon={Mic}
                    title="Chưa có giọng nói"
                    description="Thêm giọng nói để AI thuyết minh."
                    actionLabel="Đi tới Giọng nói"
                    onAction={() => navigate('/voices')}
                  />
                ) : (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {voices.map((v) => {
                      const selected = selVoice === v.id
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelVoice(v.id)}
                          className={cn(
                            'flex items-center justify-between rounded-lg border-2 p-3 text-left transition-all',
                            selected
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-muted-foreground/50'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                              <Mic className="h-4 w-4" />
                            </span>
                            <div>
                              <p className="text-sm font-medium">{v.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {v.gender === 'male' ? 'Nam' : 'Nữ'} · {v.language}
                              </p>
                            </div>
                          </div>
                          {selected && <Check className="h-5 w-5 text-primary" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
                  <UserSquare className="h-5 w-5" /> Chọn người mẫu
                </h2>
                {models.length === 0 ? (
                  <EmptyState
                    icon={UserSquare}
                    title="Chưa có người mẫu"
                    description="Thêm người mẫu (ảnh hoặc video) cho AI."
                    actionLabel="Đi tới Người mẫu"
                    onAction={() => navigate('/models')}
                  />
                ) : (
                  <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {models.map((m) => {
                      const selected = selModel === m.id
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelModel(m.id)}
                          className={cn(
                            'group overflow-hidden rounded-xl border-2 text-left transition-all',
                            selected
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-border hover:border-muted-foreground/50'
                          )}
                        >
                          <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                            <img
                              src={m.thumbnail}
                              alt={m.name}
                              className="h-full w-full object-cover"
                            />
                            {m.kind === 'video' && (
                              <Badge variant="brand" className="absolute left-2 top-2 gap-1">
                                <Video className="h-3 w-3" /> Video
                              </Badge>
                            )}
                            {selected && (
                              <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="h-4 w-4" />
                              </span>
                            )}
                          </div>
                          <div className="p-2">
                            <p className="line-clamp-1 text-sm font-medium">{m.name}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Confirm */}
          {step === 3 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold">Xác nhận cấu hình</h2>
              <div className="space-y-4">
                <SummaryRow icon={Plug} label="Nền tảng">
                  <div className="flex flex-wrap gap-2">
                    {selPlatforms.map((id) => {
                      const meta = PLATFORM_META[id]
                      return (
                        <Badge
                          key={id}
                          className="text-white"
                          style={{ backgroundColor: meta.color }}
                        >
                          {meta.name}
                        </Badge>
                      )
                    })}
                  </div>
                </SummaryRow>
                <SummaryRow icon={Package} label="Sản phẩm">
                  <span className="text-sm">
                    {product ? `${product.name} — ${formatVND(product.price)}` : '—'}
                  </span>
                </SummaryRow>
                <SummaryRow icon={Mic} label="Giọng nói">
                  <span className="text-sm">{voice?.name ?? '—'}</span>
                </SummaryRow>
                <SummaryRow icon={UserSquare} label="Người mẫu">
                  <div className="flex items-center gap-2">
                    {model && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={model.thumbnail} alt={model.name} />
                        <AvatarFallback>{model.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                    )}
                    <span className="text-sm">{model?.name ?? '—'}</span>
                  </div>
                </SummaryRow>
              </div>

              {quotaBlocked && (
                <Card className="mt-6 border-destructive/40 bg-destructive/5">
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                      <div>
                        <p className="text-sm font-medium">Đã hết hạn mức video trong tháng</p>
                        <p className="text-sm text-muted-foreground">
                          Gói {plan?.name} cho phép {plan?.maxVideosPerMonth} video/tháng. Nâng cấp lên
                          Pro để live không giới hạn.
                        </p>
                      </div>
                    </div>
                    <Button variant="brand" onClick={() => navigate('/subscription')}>
                      Nâng cấp Pro
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ChevronLeft className="h-4 w-4" /> Quay lại
        </Button>
        {step < 3 ? (
          <Button variant="brand" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            Tiếp tục <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="brand" onClick={handleStart} disabled={quotaBlocked}>
            <Radio className="h-4 w-4" /> Bắt đầu Live
          </Button>
        )}
      </div>

      {step === 3 && !quotaBlocked && (
        <p className="mt-3 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> AI sẽ tự động tạo video và trả lời bình luận.
        </p>
      )}
    </div>
  )
}

function SummaryRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </span>
      <div className="flex-1">
        <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
        {children}
      </div>
    </div>
  )
}
