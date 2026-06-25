import { Outlet, useNavigate } from 'react-router-dom'
import { ChevronLeft, Radio, Settings, ShieldAlert, Sparkles, HelpCircle, Laptop } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LivePreviewLayout() {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/80 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground px-2 sm:px-3"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Quay lại Dashboard</span>
            <span className="sm:hidden">Quay lại</span>
          </Button>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient shrink-0">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-wider text-gradient uppercase">1Stream Studio</span>
            <span className="hidden md:inline-flex rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">PREVIEW MODE</span>
          </div>
        </div>

        {/* Live status bar at the top */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-600 hidden sm:inline">Hệ thống AI sẵn sàng</span>
            <span className="text-xs font-bold text-emerald-600 sm:hidden">AI Ready</span>
          </div>
          <div className="hidden md:block h-4 w-px bg-border" />
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground font-semibold">
            <Laptop className="h-3.5 w-3.5" />
            <span>FHD (1080p) • 30 FPS</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main workspace (takes full height minus topbar, 100% width, no sidebars) */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
