import { useRef, useState } from 'react'
import { Package, Plus, X } from 'lucide-react'
import type { Product } from '@/types'
import { useProductStore } from '@/store/productStore'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { MediaCard } from '@/components/common/MediaCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/sonner'
import { formatVND } from '@/lib/utils'

interface FormState {
  name: string
  description: string
  price: string
  images: string[]
}

const emptyForm: FormState = { name: '', description: '', price: '', images: [] }

function coverImage(p: Product): string {
  return p.images[0] || `https://picsum.photos/seed/${p.id}/600/400`
}

export function ProductsPage() {
  const { products, add, update, remove } = useProductStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [imageUrl, setImageUrl] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setImageUrl('')
    setDialogOpen(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({ name: p.name, description: p.description, price: String(p.price), images: [...p.images] })
    setImageUrl('')
    setDialogOpen(true)
  }

  function addImageUrl() {
    const url = imageUrl.trim()
    if (!url) return
    setForm((f) => ({ ...f, images: [...f.images, url] }))
    setImageUrl('')
  }

  function handleFiles(files: FileList | null) {
    if (!files) return
    const urls = Array.from(files).map((file) => URL.createObjectURL(file))
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }))
  }

  function removeImage(idx: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  function handleSubmit() {
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm')
      return
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      images: form.images,
    }
    if (editing) {
      update(editing.id, payload)
      toast.success('Đã cập nhật sản phẩm')
    } else {
      add(payload)
      toast.success('Đã thêm sản phẩm')
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    if (!deleteId) return
    remove(deleteId)
    toast.success('Đã xoá sản phẩm')
    setDeleteId(null)
  }

  return (
    <div>
      <PageHeader
        title="Sản phẩm"
        description="Quản lý danh mục sản phẩm dùng cho phiên livestream"
        actions={
          <Button variant="brand" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Thêm mới
          </Button>
        }
      />

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Chưa có sản phẩm nào"
          description="Thêm sản phẩm để bắt đầu tạo phiên livestream bán hàng bằng AI."
          actionLabel="Thêm sản phẩm"
          onAction={openCreate}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <MediaCard
              key={p.id}
              title={p.name}
              image={coverImage(p)}
              subtitle={formatVND(p.price)}
              onEdit={() => openEdit(p)}
              onDelete={() => setDeleteId(p.id)}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
            <DialogDescription>Nhập thông tin sản phẩm bên dưới.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="p-name">Tên</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="VD: Son dưỡng môi"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="p-desc">Mô tả</Label>
              <Textarea
                id="p-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Mô tả ngắn về sản phẩm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="p-price">Giá (VND)</Label>
              <Input
                id="p-price"
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="199000"
              />
            </div>

            <div className="grid gap-2">
              <Label>Ảnh</Label>
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addImageUrl()
                    }
                  }}
                  placeholder="Dán URL ảnh..."
                />
                <Button type="button" variant="secondary" onClick={addImageUrl}>
                  Thêm
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleFiles(e.target.files)
                  e.target.value = ''
                }}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                Tải ảnh từ máy
              </Button>

              {form.images.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.images.map((src, idx) => (
                    <div key={idx} className="relative h-16 w-16 overflow-hidden rounded-md border border-border">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl-md bg-destructive text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
        title="Xoá sản phẩm?"
        description="Hành động này không thể hoàn tác."
        confirmLabel="Xoá"
        onConfirm={handleDelete}
      />
    </div>
  )
}
