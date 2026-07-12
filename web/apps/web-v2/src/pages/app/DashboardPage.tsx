import { useNavigate } from 'react-router-dom'
import {
  Crown,
  Clock,
  Link2,
  BookOpen,
  Mic,
  Users,
  Radio,
  Play,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { QuotaBar } from '@/components/common/QuotaBar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSubscriptionStore } from '@/store/subscriptionStore'
import { useProductStore } from '@/store/productStore'
import { useVoiceStore } from '@/store/voiceStore'
import { useModelStore } from '@/store/modelStore'
import { usePlatformStore } from '@/store/platformStore'

interface RecentVideo {
  id: string
  title: string
  status: string
  image: string
}

const RECENT_VIDEOS: RecentVideo[] = [
  { id: 'recent1', title: 'Live tuyển sinh — IELTS Foundation 5.5', status: 'Đã duyệt', image: '/images/education/teacher-laptop.webp' },
  { id: 'recent2', title: 'Hỏi đáp đầu vào — TOPIK I', status: 'Hoàn tất', image: '/images/education/language-classroom.webp' },
  { id: 'recent3', title: 'Mời đăng ký học thử giao tiếp', status: 'Đã duyệt', image: '/images/education/teacher-laptop.webp' },
  { id: 'recent4', title: 'Nhắc lịch khai giảng tháng 8', status: 'Bản nháp', image: '/images/education/language-classroom.webp' },
]

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string | number
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-violet-400">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()

  const subscription = useSubscriptionStore((s) => s.subscription)
  const currentPlan = useSubscriptionStore((s) => s.currentPlan())
  const daysLeft = useSubscriptionStore((s) => s.trialDaysLeft())

  const products = useProductStore((s) => s.products)
  const voices = useVoiceStore((s) => s.voices)
  const models = useModelStore((s) => s.models)
  const platforms = usePlatformStore((s) => s.platforms)
  const connectedPlatforms = platforms.filter((p) => p.connected)

  return (
    <div>
      <PageHeader title="Tổng quan" description="Tình trạng tài khoản và hoạt động gần đây." />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Crown}
          label="Gói hiện tại"
          value={currentPlan?.name ?? 'Chưa kích hoạt'}
        />
        <StatCard icon={Clock} label="Ngày dùng thử còn lại" value={daysLeft} />
        <StatCard
          icon={Link2}
          label="Kênh demo đã kết nối"
          value={`${connectedPlatforms.length}/4`}
        />
        <StatCard icon={BookOpen} label="Khóa học" value={products.length} />
        <StatCard icon={Mic} label="Giọng nói" value={voices.length} />
        <StatCard icon={Users} label="Người mẫu" value={models.length} />
      </div>

      {/* Quota */}
      {subscription && currentPlan && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Hạn mức video tháng này</CardTitle>
          </CardHeader>
          <CardContent>
            <QuotaBar
              label="Video đã dùng tháng này"
              used={subscription.videosUsed}
              total={currentPlan.maxVideosPerMonth}
            />
          </CardContent>
        </Card>
      )}

      {/* Quick start live */}
      <Card className="mt-6 overflow-hidden border-brand-from/40">
        <div className="flex flex-col items-start justify-between gap-4 bg-brand-gradient p-6 text-white sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Bắt đầu live nhanh</h2>
              <p className="text-sm text-white/80">
                Chọn khóa học, giọng và người dẫn để tạo bản live tuyển sinh mẫu.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="lg"
            className="shrink-0"
            onClick={() => navigate('/live/setup')}
          >
            <Play className="h-4 w-4" /> Bắt đầu Live
          </Button>
        </div>
      </Card>

      {/* Recent videos */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Video gần đây</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RECENT_VIDEOS.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={video.image}
                  alt={video.title}
                  className="h-full w-full object-cover"
                />
                <Badge variant="success" className="absolute right-2 top-2">
                  {video.status}
                </Badge>
              </div>
              <CardContent className="p-4">
                <p className="line-clamp-2 text-sm font-medium">{video.title}</p>
                <CardDescription className="mt-1">1STREAM AI</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
