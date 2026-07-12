import { Check, Clock, Sparkles, Crown, Info } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/sonner'
import { cn, formatVND } from '@/lib/utils'
import { useSubscriptionStore } from '@/store/subscriptionStore'
import type { Plan } from '@/types'

const PLAN_SUMMARY: Record<Plan['id'], Array<[string, string]>> = {
  standard: [['Số kênh', '1 kênh'], ['Phản hồi AI', 'Tối đa 200/tháng'], ['Phạm vi', 'FAQ & chuyển lead'], ['Hình thức', 'Theo tháng']],
  pro: [['Số kênh', 'Tối đa 3 kênh'], ['Phản hồi AI', 'Tối đa 1.000/tháng'], ['Phạm vi', 'Phân loại & chuyển lead'], ['Báo cáo', 'Tổng hợp đa kênh']],
  enterprise: [['Số kênh', 'Theo nhu cầu'], ['Cơ sở tri thức', 'Riêng theo đơn vị'], ['Tích hợp', 'CRM & phân quyền'], ['Hỗ trợ', 'Theo SLA']],
}

function PlanRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export function SubscriptionPage() {
  const plans = useSubscriptionStore((s) => s.plans)
  const subscription = useSubscriptionStore((s) => s.subscription)
  const currentPlan = useSubscriptionStore((s) => s.currentPlan())
  const daysLeft = useSubscriptionStore((s) => s.trialDaysLeft())
  const startTrial = useSubscriptionStore((s) => s.startTrial)
  const switchPlan = useSubscriptionStore((s) => s.switchPlan)

  const handleStartTrial = (plan: Plan) => {
    startTrial(plan.id)
    toast.success(`Đã bắt đầu dùng thử gói ${plan.name} · 7 ngày`)
  }

  const handleSwitch = (plan: Plan) => {
    switchPlan(plan.id)
    toast.success(`Đã chuyển sang gói ${plan.name}`)
  }

  return (
    <div>
      <PageHeader
        title="Gói dịch vụ"
        description="Gói AI Lead Assistant dự kiến cho giai đoạn pilot. Video AI và giờ phát được báo giá theo đầu ra."
      />

      {/* Trial status banner */}
      {subscription ? (
        <Card className="mb-6 border-amber-500/40 bg-amber-500/10">
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-amber-400" />
            <div>
              <p className="font-medium text-amber-200">
                Môi trường demo · còn {daysLeft} ngày
              </p>
              <p className="text-sm text-amber-200/70">
                Gói hiện tại: {currentPlan?.name ?? '—'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6 border-brand-from/40 bg-brand-from/10">
          <CardContent className="flex items-center gap-3 p-4">
            <Sparkles className="h-5 w-5 text-violet-400" />
            <p className="font-medium">Chọn gói Agent để mô phỏng hạn mức trong demo</p>
          </CardContent>
        </Card>
      )}

      {/* Comparison cards */}
      <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
        {plans.map((plan) => {
          const isPro = plan.id === 'pro'
          const isEnterprise = plan.id === 'enterprise'
          const isActive = subscription?.planId === plan.id

          return (
            <Card
              key={plan.id}
              className={cn(
                'relative flex flex-col',
                isPro && 'border-brand-from/60 shadow-lg shadow-brand-from/20',
                isEnterprise && 'border-violet-500/40 shadow-md shadow-violet-500/10'
              )}
            >
              {(isPro || isEnterprise) && (
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-brand-gradient" />
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {isPro && <Crown className="h-5 w-5 text-amber-400" />}
                    {isEnterprise && <Sparkles className="h-5 w-5 text-violet-400" />}
                    {plan.name}
                  </CardTitle>
                  {isActive && <Badge variant="brand">Đang dùng</Badge>}
                </div>
                <CardDescription>
                  {isEnterprise ? (
                    <span className="text-2xl font-bold text-gradient">
                      Liên hệ
                    </span>
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-foreground">
                        {formatVND(plan.priceMonthly)}
                      </span>
                      <span className="text-muted-foreground">/tháng</span>
                    </>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="space-y-2">
                  {PLAN_SUMMARY[plan.id].map(([label, value]) => <PlanRow key={label} label={label} value={value} />)}
                </div>

                <Separator />

                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {isEnterprise ? (
                  <Button
                    variant="outline"
                    className="w-full border-primary/50 text-primary hover:bg-primary/10 font-bold"
                    onClick={() => {
                      toast.info('Vui lòng liên hệ hello@1stream.ai để trao đổi phạm vi Enterprise.', { duration: 5000 })
                    }}
                  >
                    Liên hệ ngay
                  </Button>
                ) : !subscription ? (
                  <Button
                    variant={isPro ? 'brand' : 'default'}
                    className="w-full"
                    onClick={() => handleStartTrial(plan)}
                  >
                    Kích hoạt demo
                  </Button>
                ) : isActive ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Đang dùng
                  </Button>
                ) : (
                  <Button
                    variant={isPro ? 'brand' : 'outline'}
                    className="w-full"
                    onClick={() => handleSwitch(plan)}
                  >
                    {isPro ? 'Chuyển sang Growth' : `Chuyển sang ${plan.name}`}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Info className="h-4 w-4" />
        Giá trên là mức dự kiến cho pilot; hạn mức và phạm vi hỗ trợ được xác nhận trong từng hợp đồng.
      </p>
    </div>
  )
}
