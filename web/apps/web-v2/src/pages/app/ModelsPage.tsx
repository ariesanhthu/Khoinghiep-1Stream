import { useRef, useState } from 'react'
import { ImageIcon, Plus, Users } from 'lucide-react'
import type { ModelAsset, ModelKind } from '@/types'
import { useModelStore } from '@/store/modelStore'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { MediaCard } from '@/components/common/MediaCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { toast } from '@/components/ui/sonner'

interface FormState {
  name: string
  kind: ModelKind
  url: string
  thumbnail: string
}

const emptyForm: FormState = { name: '', kind: 'image', url: '', thumbnail: '' }

function cover(m: ModelAsset): string {
  if (m.kind === 'video') return m.thumbnail || m.url || '/images/education/teacher-laptop.webp'
  return m.url || m.thumbnail || '/images/education/teacher-laptop.webp'
}

export function ModelsPage() {
  const { models, add, update, remove } = useModelStore()
  const [tab, setTab] = useState<ModelKind>('image')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ModelAsset | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = models.filter((m) => m.kind === tab)

  function openCreate() {
    setEditing(null)
    setForm({ ...emptyForm, kind: tab })
    setDialogOpen(true)
  }

  function openEdit(m: ModelAsset) {
    setEditing(m)
    setForm({ name: m.name, kind: m.kind, url: m.url, thumbnail: m.thumbnail })
    setDialogOpen(true)
  }

  function handleFile(files: FileList | null) {
    if (!files || files.length === 0) return
    const url = URL.createObjectURL(files[0])
    setForm((f) => ({ ...f, url, thumbnail: f.kind === 'image' ? url : f.thumbnail }))
  }

  function handleSubmit() {
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên người mẫu')
      return
    }
    const thumbnail = form.kind === 'image' ? form.url || form.thumbnail : form.thumbnail || form.url
    const payload = {
      name: form.name.trim(),
      kind: form.kind,
      url: form.url.trim(),
      thumbnail: thumbnail.trim(),
    }
    if (editing) {
      update(editing.id, payload)
      toast.success('Đã cập nhật người mẫu')
    } else {
      add(payload)
      toast.success('Đã thêm người mẫu')
      setTab(form.kind)
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    if (!deleteId) return
    remove(deleteId)
    toast.success('Đã xoá người mẫu')
    setDeleteId(null)
  }

  function renderGrid() {
    if (filtered.length === 0) {
      return (
        <EmptyState
          icon={tab === 'image' ? ImageIcon : Users}
          title={tab === 'image' ? 'Chưa có người mẫu hình ảnh' : 'Chưa có người mẫu video'}
          description="Thêm người mẫu AI để dùng làm gương mặt đại diện khi livestream."
          actionLabel="Thêm người mẫu"
          onAction={openCreate}
        />
      )
    }
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((m) => (
          <MediaCard
            key={m.id}
            title={m.name}
            image={cover(m)}
            kind={m.kind}
            onEdit={() => openEdit(m)}
            onDelete={() => setDeleteId(m.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Người mẫu"
        description="Thư viện gương mặt AI dạng hình ảnh và video"
        actions={
          <Button variant="brand" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Thêm mới
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(val) => setTab(val as ModelKind)}>
        <TabsList>
          <TabsTrigger value="image">Hình ảnh</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
        </TabsList>
        <TabsContent value="image" className="mt-6">
          {renderGrid()}
        </TabsContent>
        <TabsContent value="video" className="mt-6">
          {renderGrid()}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Sửa người mẫu' : 'Thêm người mẫu'}</DialogTitle>
            <DialogDescription>Nhập thông tin người mẫu AI.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="m-name">Tên</Label>
              <Input
                id="m-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="VD: Người mẫu Mai Anh"
              />
            </div>
            <div className="grid gap-2">
              <Label>Loại</Label>
              <Select value={form.kind} onValueChange={(val) => setForm((f) => ({ ...f, kind: val as ModelKind }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Hình ảnh</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="m-url">URL {form.kind === 'video' ? 'video' : 'ảnh'}</Label>
              <Input
                id="m-url"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://..."
              />
              <input
                ref={fileInputRef}
                type="file"
                accept={form.kind === 'video' ? 'video/*' : 'image/*'}
                className="hidden"
                onChange={(e) => {
                  handleFile(e.target.files)
                  e.target.value = ''
                }}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                Tải file từ máy
              </Button>
            </div>
            {form.kind === 'video' && (
              <div className="grid gap-2">
                <Label htmlFor="m-thumb">URL ảnh thumbnail (tuỳ chọn)</Label>
                <Input
                  id="m-thumb"
                  value={form.thumbnail}
                  onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            )}
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
        title="Xoá người mẫu?"
        description="Hành động này không thể hoàn tác."
        confirmLabel="Xoá"
        onConfirm={handleDelete}
      />
    </div>
  )
}
