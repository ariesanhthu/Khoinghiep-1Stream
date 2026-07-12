import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { label: 'Giải pháp', id: 'solutions' },
  { label: 'Quy trình', id: 'workflow' },
  { label: 'Kịch bản', id: 'scenarios' },
  { label: 'Phù hợp với ai', id: 'audience' },
  { label: 'Gói pilot', id: 'pricing' },
]

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      return
    }
    navigate('/')
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#07172f]/90 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="1Stream - Trang chủ">
            <img src="/images/1stream-mark.png" alt="" className="h-10 w-10 rounded-xl bg-white object-cover" />
            <div>
              <span className="block text-lg font-black leading-none tracking-[.08em]">1STREAM</span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[.2em] text-amber-400">AI for education</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Điều hướng chính">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} type="button" onClick={() => scrollToSection(item.id)} className="text-sm font-semibold text-slate-300 transition hover:text-white">
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/login"><Button variant="ghost" className="text-slate-200 hover:bg-white/10 hover:text-white">Đăng nhập</Button></Link>
            <Button className="bg-amber-400 font-bold text-slate-950 hover:bg-amber-300" onClick={() => scrollToSection('contact')}>Đăng ký phiên mẫu</Button>
          </div>

          <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 lg:hidden" aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-white/10 bg-[#07172f] px-6 py-5 lg:hidden">
            <nav className="flex flex-col" aria-label="Điều hướng di động">
              {NAV_ITEMS.map((item) => <button key={item.id} type="button" onClick={() => scrollToSection(item.id)} className="border-b border-white/10 py-3 text-left text-sm font-semibold text-slate-200">{item.label}</button>)}
            </nav>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}><Button variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">Đăng nhập</Button></Link>
              <Button className="bg-amber-400 font-bold text-slate-950 hover:bg-amber-300" onClick={() => scrollToSection('contact')}>Đăng ký mẫu</Button>
            </div>
          </div>
        ) : null}
      </header>
      <main className="min-h-screen"><Outlet /></main>
    </div>
  )
}
