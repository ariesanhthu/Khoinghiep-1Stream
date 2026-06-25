import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, LinkIcon } from 'lucide-react'
import type { PlatformId } from '@/types'
import { PLATFORM_META } from '@/types'
import { usePlatformStore } from '@/store/platformStore'
import { PageHeader } from '@/components/common/PageHeader'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/components/ui/sonner'

export function PlatformsPage() {
  const { platforms, disconnect } = usePlatformStore()
  const navigate = useNavigate()
  const [disconnectId, setDisconnectId] = useState<PlatformId | null>(null)

  function handleConnect(id: PlatformId) {
    navigate(`/connect/${id}/callback`)
  }

  function handleDisconnect() {
    if (!disconnectId) return
    const meta = PLATFORM_META[disconnectId]
    disconnect(disconnectId)
    toast.success(`Đã ngắt kết nối ${meta.name}`)
    setDisconnectId(null)
  }

  return (
    <div>
      <PageHeader
        title="Nền tảng"
        description="Kết nối các nền tảng để phát livestream đa kênh"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {platforms.map((p) => {
          const meta = PLATFORM_META[p.id]
          return (
            <Card key={p.id} className="overflow-hidden">
              <div className="h-1 w-full" style={{ backgroundColor: meta.color }} />
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-white"
                  style={{ backgroundColor: meta.color }}
                >
                  {meta.short}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{meta.name}</p>
                    {p.connected && (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Đã kết nối
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {p.connected ? p.account : 'Chưa kết nối'}
                  </p>
                </div>
                {p.connected ? (
                  <Button variant="outline" onClick={() => setDisconnectId(p.id)}>
                    Ngắt kết nối
                  </Button>
                ) : (
                  <Button variant="brand" onClick={() => handleConnect(p.id)}>
                    <LinkIcon className="h-4 w-4" /> Kết nối
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <ConfirmDialog
        open={disconnectId !== null}
        onOpenChange={(o) => !o && setDisconnectId(null)}
        title="Ngắt kết nối nền tảng?"
        description="Bạn sẽ cần cấp quyền lại nếu muốn kết nối sau này."
        confirmLabel="Ngắt kết nối"
        onConfirm={handleDisconnect}
      />
    </div>
  )
}
