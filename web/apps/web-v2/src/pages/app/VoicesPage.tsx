import { useState } from 'react'
import { Mic, Pencil, Play, Plus, Trash2 } from 'lucide-react'
import type { Voice } from '@/types'
import { useVoiceStore } from '@/store/voiceStore'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from '@/components/ui/sonner'

interface FormState {
  name: string
  gender: 'male' | 'female'
  language: string
  sampleUrl: string
  durationSec: string
}

const emptyForm: FormState = {
  name: '',
  gender: 'female',
  language: 'Tiếng Việt',
  sampleUrl: '',
  durationSec: '10',
}

export function VoicesPage() {
  const { voices, add, update, remove } = useVoiceStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Voice | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(v: Voice) {
    setEditing(v)
    setForm({
      name: v.name,
      gender: v.gender,
      language: v.language,
      sampleUrl: v.sampleUrl,
      durationSec: String(v.durationSec),
    })
    setDialogOpen(true)
  }

  function handleSubmit() {
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên giọng nói')
      return
    }
    const payload = {
      name: form.name.trim(),
      gender: form.gender,
      language: form.language.trim() || 'Tiếng Việt',
      sampleUrl: form.sampleUrl.trim(),
      durationSec: Number(form.durationSec) || 0,
    }
    if (editing) {
      update(editing.id, payload)
      toast.success('Đã cập nhật giọng nói')
    } else {
      add(payload)
      toast.success('Đã thêm giọng nói')
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    if (!deleteId) return
    remove(deleteId)
    toast.success('Đã xoá giọng nói')
    setDeleteId(null)
  }

  function playSample(v: Voice) {
    toast.info(`Đang phát thử giọng "${v.name}"`)
  }

  return (
    <div>
      <PageHeader
        title="Giọng nói"
        description="Thư viện giọng đọc AI dùng cho phiên livestream"
        actions={
          <Button variant="brand" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Thêm mới
          </Button>
        }
      />

      {voices.length === 0 ? (
        <EmptyState
          icon={Mic}
          title="Chưa có giọng nói nào"
          description="Thêm giọng đọc AI để gán cho người mẫu khi livestream."
          actionLabel="Thêm giọng nói"
          onAction={openCreate}
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Ngôn ngữ</TableHead>
                <TableHead>Thời lượng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {voices.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell>
                    <Badge variant={v.gender === 'male' ? 'default' : 'brand'}>
                      {v.gender === 'male' ? 'Nam' : 'Nữ'}
                    </Badge>
                  </TableCell>
                  <TableCell>{v.language}</TableCell>
                  <TableCell>{v.durationSec}s</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {v.sampleUrl ? (
                        <Button size="sm" variant="secondary" onClick={() => playSample(v)}>
                          <Play className="h-4 w-4" /> Nghe thử
                        </Button>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span tabIndex={0}>
                              <Button size="sm" variant="secondary" disabled>
                                <Play className="h-4 w-4" /> Nghe thử
                              </Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Mẫu demo</TooltipContent>
                        </Tooltip>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => openEdit(v)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setDeleteId(v.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Sửa giọng nói' : 'Thêm giọng nói'}</DialogTitle>
            <DialogDescription>Cấu hình giọng đọc AI.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="v-name">Tên</Label>
              <Input
                id="v-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="VD: Giọng nữ miền Nam"
              />
            </div>
            <div className="grid gap-2">
              <Label>Giới tính</Label>
              <Select value={form.gender} onValueChange={(val) => setForm((f) => ({ ...f, gender: val as 'male' | 'female' }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="male">Nam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="v-lang">Ngôn ngữ</Label>
              <Input
                id="v-lang"
                value={form.language}
                onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="v-sample">URL mẫu (tuỳ chọn)</Label>
              <Input
                id="v-sample"
                value={form.sampleUrl}
                onChange={(e) => setForm((f) => ({ ...f, sampleUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="v-dur">Thời lượng (giây)</Label>
              <Input
                id="v-dur"
                type="number"
                min={0}
                value={form.durationSec}
                onChange={(e) => setForm((f) => ({ ...f, durationSec: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Huỷ
            </Button>
            <Button variant="brand" onClick={handleSubmit}>
              {editing ? 'Lưu' : 'Thêm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Xoá giọng nói?"
        description="Hành động này không thể hoàn tác."
        confirmLabel="Xoá"
        onConfirm={handleDelete}
      />
    </div>
  )
}
