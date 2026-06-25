import type { ReactNode } from 'react'
import { Pencil, Trash2, Video } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface MediaCardProps {
  title: string
  image: string
  kind?: 'image' | 'video'
  subtitle?: string
  onEdit?: () => void
  onDelete?: () => void
  footer?: ReactNode
}

export function MediaCard({ title, image, kind = 'image', subtitle, onEdit, onDelete, footer }: MediaCardProps) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-video bg-secondary overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        {kind === 'video' && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="gap-1">
              <Video className="h-3 w-3" /> Video
            </Badge>
          </div>
        )}
        {(onEdit || onDelete) && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button size="icon" variant="secondary" className="h-8 w-8" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button size="icon" variant="secondary" className="h-8 w-8 hover:bg-destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-medium truncate">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        {footer && <div className="mt-2">{footer}</div>}
      </div>
    </Card>
  )
}
