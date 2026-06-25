import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, ShieldCheck, MessageSquare, Radio, ShoppingBag, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/sonner'
import { usePlatformStore } from '@/store/platformStore'
import { PLATFORM_META } from '@/types'
import type { PlatformId } from '@/types'

const PERMISSIONS = [
  { icon: MessageSquare, label: 'Đọc & trả lời bình luận' },
  { icon: Radio, label: 'Phát livestream' },
  { icon: ShoppingBag, label: 'Quản lý sản phẩm & đơn hàng' },
]

const VALID_PLATFORMS = Object.keys(PLATFORM_META) as PlatformId[]

export function PlatformCallbackPage() {
  const navigate = useNavigate()
  const { platform } = useParams<{ platform: string }>()
  const connect = usePlatformStore((s) => s.connect)
  const [authenticating, setAuthenticating] = useState(true)

  const isValid = !!platform && VALID_PLATFORMS.includes(platform as PlatformId)
  const platformId = platform as PlatformId

  useEffect(() => {
    if (!isValid) {
      navigate('/platforms')
      return
    }
    const t = setTimeout(() => setAuthenticating(false), 800)
    return () => clearTimeout(t)
  }, [isValid, navigate])

  if (!isValid) return null

  const meta = PLATFORM_META[platformId]

  const handleApprove = () => {
    connect(platformId, '@1stream_demo')
    toast.success(`Đã kết nối ${meta.name}`)
    navigate('/platforms')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <Card className="w-full max-w-md">
        {authenticating ? (
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Đang xác thực với {meta.name}...
            </p>
          </CardContent>
        ) : (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex items-center gap-2">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-base font-bold text-white"
                  style={{ backgroundColor: meta.color }}
                >
                  {meta.short}
                </span>
                <span className="text-muted-foreground">↔</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-xs font-bold text-white">
                  1S
                </span>
              </div>
              <CardTitle>
                1STREAM muốn truy cập tài khoản {meta.name}
              </CardTitle>
              <CardDescription>
                Cấp các quyền sau để 1STREAM hoạt động với {meta.name}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-4">
                {PERMISSIONS.map((p) => (
                  <li key={p.label} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <p.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm">{p.label}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button variant="brand" className="w-full" onClick={handleApprove}>
                <ShieldCheck className="mr-1 h-4 w-4" />
                Đồng ý & cấp quyền
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/platforms')}
              >
                <X className="mr-1 h-4 w-4" />
                Huỷ
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
