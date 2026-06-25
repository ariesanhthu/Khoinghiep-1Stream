import { useSubscriptionStore } from '@/store/subscriptionStore'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

export function Topbar() {
  const currentPlan = useSubscriptionStore((s) => s.currentPlan())
  const daysLeft = useSubscriptionStore((s) => s.trialDaysLeft())

  return (
    <header className="flex h-16 items-center justify-end gap-3 border-b border-border px-6 bg-background/80 backdrop-blur sticky top-0 z-30">
      {currentPlan ? (
        <>
          <Badge variant="warning">Dùng thử · còn {daysLeft} ngày</Badge>
          <Link to="/subscription">
            <Badge variant="brand">Gói {currentPlan.name}</Badge>
          </Link>
        </>
      ) : (
        <Link to="/subscription">
          <Badge variant="outline">Chưa kích hoạt · Dùng thử 7 ngày</Badge>
        </Link>
      )}
    </header>
  )
}
