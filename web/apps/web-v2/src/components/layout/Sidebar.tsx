import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CreditCard,
  Package,
  Mic,
  Users,
  Share2,
  Radio,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const NAV = [
  { to: '/live/preview', label: 'Livestream Preview', icon: Radio },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/subscription', label: 'Gói dịch vụ', icon: CreditCard },
  { to: '/products', label: 'Sản phẩm', icon: Package },
  { to: '/voices', label: 'Giọng nói', icon: Mic },
  { to: '/models', label: 'Người mẫu', icon: Users },
  { to: '/platforms', label: 'Nền tảng', icon: Share2 },
]

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card/50">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">1STREAM</span>
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-gradient text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}

        <div className="pt-3">
          <NavLink
            to="/live/setup"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors border',
                isActive ? 'bg-brand-gradient text-white border-transparent' : 'border-primary/40 text-primary hover:bg-primary/10'
              )
            }
          >
            <Radio className="h-4 w-4" />
            Thiết lập Live
          </NavLink>
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{(user?.name?.[0] ?? 'U').toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name ?? 'Người dùng'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="text-muted-foreground hover:text-foreground"
            title="Đăng xuất"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
