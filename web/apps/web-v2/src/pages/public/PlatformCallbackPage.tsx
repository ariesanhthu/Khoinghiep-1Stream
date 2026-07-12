import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, Check, Loader2, MessageCircleMore, Radio, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/sonner'
import { usePlatformStore } from '@/store/platformStore'
import { PLATFORM_META } from '@/types'
import type { PlatformId } from '@/types'

const PERMISSIONS = [
  { icon: MessageCircleMore, title: 'Đọc và phản hồi bình luận', description: 'Nhận bình luận live để AI đối chiếu với bộ FAQ đã duyệt.' },
  { icon: Radio, title: 'Quản lý phiên phát', description: 'Kiểm tra trạng thái và hỗ trợ phát nội dung đã được phê duyệt.' },
  { icon: UserRoundCheck, title: 'Ghi nhận nhu cầu học', description: 'Phân loại nhu cầu và chuyển lead cho tư vấn viên khi người xem đồng ý.' },
]

const VALID_PLATFORMS = Object.keys(PLATFORM_META) as PlatformId[]

export function PlatformCallbackPage() {
  const navigate = useNavigate()
  const { platform } = useParams<{ platform: string }>()
  const connect = usePlatformStore((state) => state.connect)
  const [authenticating, setAuthenticating] = useState(true)

  const isValid = !!platform && VALID_PLATFORMS.includes(platform as PlatformId)
  const platformId = platform as PlatformId

  useEffect(() => {
    if (!isValid) {
      navigate('/platforms')
      return
    }
    const timer = window.setTimeout(() => setAuthenticating(false), 700)
    return () => window.clearTimeout(timer)
  }, [isValid, navigate])

  if (!isValid) return null
  const meta = PLATFORM_META[platformId]

  const handleApprove = () => {
    connect(platformId, '@1stream_demo')
    toast.success(`Đã kết nối ${meta.name} với 1Stream Studio`)
    navigate('/platforms')
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f5f8] px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[#07172f]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/30 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        <button type="button" onClick={() => navigate('/platforms')} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Quay lại quản lý kênh
        </button>

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-slate-950/15">
          <div className="grid lg:grid-cols-[.82fr_1.18fr]">
            <div className="relative overflow-hidden bg-[#0b1f3a] p-8 text-white sm:p-10">
              <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-600/25 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <img src="/images/1stream-mark.png" alt="" className="h-11 w-11 rounded-xl bg-white object-cover" />
                  <div><p className="text-sm font-black tracking-[.1em]">1STREAM</p><p className="text-[9px] font-bold uppercase tracking-[.18em] text-amber-400">Studio connection</p></div>
                </div>
                <div className="mt-14 flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl text-lg font-black text-white shadow-lg" style={{ backgroundColor: meta.color }}>{meta.short}</div>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/40 to-white/10" />
                  <div className="grid h-10 w-10 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10"><Check className="h-5 w-5 text-emerald-300" /></div>
                </div>
                <h1 className="mt-8 text-3xl font-black tracking-[-.03em]">Kết nối {meta.name} với Studio</h1>
                <p className="mt-4 text-sm leading-7 text-slate-300">Quản lý phiên live và bình luận tuyển sinh trong một không gian vận hành thống nhất.</p>
                <div className="mt-10 rounded-2xl border border-white/10 bg-white/[.06] p-4">
                  <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" /><p className="text-xs leading-6 text-slate-300">1Stream chỉ dùng quyền trong phạm vi vận hành đã mô tả. Bạn có thể ngắt kết nối bất cứ lúc nào.</p></div>
                </div>
              </div>
            </div>

            <div className="p-7 sm:p-10">
              {authenticating ? (
                <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
                  <div className="relative grid h-20 w-20 place-items-center rounded-3xl bg-blue-50"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /><span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-4 border-white bg-emerald-500" /></div>
                  <h2 className="mt-6 text-xl font-black">Đang xác minh kết nối</h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Studio đang kiểm tra tài khoản và quyền truy cập với {meta.name}.</p>
                  <div className="mt-7 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600" /></div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50"><BadgeCheck className="h-5 w-5 text-emerald-600" /></div>
                    <div><h2 className="text-xl font-black">Xác nhận quyền truy cập</h2><p className="mt-1 text-sm leading-6 text-slate-500">1Stream Studio cần các quyền sau trên {meta.name}.</p></div>
                  </div>

                  <div className="mt-8 space-y-3">
                    {PERMISSIONS.map((permission) => {
                      const Icon = permission.icon
                      return <div key={permission.title} className="flex gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-5 w-5" /></div><div><p className="text-sm font-bold text-slate-900">{permission.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{permission.description}</p></div></div>
                    })}
                  </div>

                  <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">AI không tự cam kết đầu ra học tập hoặc chốt thanh toán. Câu hỏi ngoài dữ liệu được chuyển cho tư vấn viên.</div>
                  <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button variant="ghost" onClick={() => navigate('/platforms')} className="h-11 px-5">Để sau</Button>
                    <Button onClick={handleApprove} className="h-11 bg-blue-600 px-6 font-bold hover:bg-blue-700"><ShieldCheck className="mr-2 h-4 w-4" />Cho phép và kết nối</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
        <p className="mt-5 text-center text-xs text-slate-400">Môi trường demo · Không phát sinh thay đổi trên tài khoản thật</p>
      </div>
    </main>
  )
}
