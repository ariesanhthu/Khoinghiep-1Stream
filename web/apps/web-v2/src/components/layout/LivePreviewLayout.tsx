import { Outlet, useNavigate } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, CircleHelp, MonitorUp, Settings2, Wifi } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LivePreviewLayout() {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#f3f5f8] text-slate-950">
      <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-[0_1px_0_rgba(15,23,42,.03)] sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="h-9 gap-2 px-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden md:inline">Dashboard</span>
          </Button>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex min-w-0 items-center gap-3">
            <img src="/images/1stream-mark.png" alt="" className="h-9 w-9 rounded-xl border border-slate-200 bg-white object-cover" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-black tracking-[.08em] text-blue-700">1STREAM STUDIO</span>
                <span className="hidden rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-700 sm:inline-flex">Bản mô phỏng</span>
              </div>
              <p className="hidden truncate text-[10px] font-medium text-slate-400 sm:block">Tuyển sinh IELTS · Tháng 07/2026</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 lg:flex">
            <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative h-2 w-2 rounded-full bg-emerald-500" /></span>
            <span className="text-[11px] font-bold text-emerald-700">AI Agent sẵn sàng</span>
          </div>
          <div className="hidden h-6 w-px bg-slate-200 md:block" />
          <div className="hidden items-center gap-2 text-[11px] font-semibold text-slate-500 md:flex">
            <MonitorUp className="h-4 w-4" /> Dọc 1080 × 1920
          </div>
          <div className="hidden items-center gap-1.5 text-[11px] font-semibold text-slate-500 xl:flex"><Wifi className="h-4 w-4 text-emerald-500" /> Ổn định</div>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:bg-slate-100" aria-label="Trợ giúp"><CircleHelp className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:bg-slate-100" aria-label="Cài đặt Studio"><Settings2 className="h-4 w-4" /></Button>
        </div>
      </header>
      <main className="min-h-0 flex-1 overflow-hidden"><Outlet /></main>
    </div>
  )
}
