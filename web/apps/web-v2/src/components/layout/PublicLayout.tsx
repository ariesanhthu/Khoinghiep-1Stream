import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Sparkles, Menu, X, ChevronDown, MessageSquare, GraduationCap, DollarSign, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const navigate = useNavigate()

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    setSolutionsOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-brand-gradient shadow-md shadow-primary/20 transition group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">1STREAM</span>
              <span className="text-[9px] -mt-1 font-medium tracking-widest text-muted-foreground uppercase">AI Livestream</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Trang chủ
            </button>

            {/* Dropdown Solutions */}
            <div className="relative">
              <button
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                onMouseEnter={() => setSolutionsOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Giải pháp A.I
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {solutionsOpen && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 rounded-xl border border-border/50 bg-card p-2 shadow-xl ring-1 ring-black/5 backdrop-blur-lg"
                  onMouseLeave={() => setSolutionsOpen(false)}
                >
                  <div className="space-y-1">
                    <button
                      onClick={() => scrollToSection('ai-livestream')}
                      className="flex items-start gap-3 w-full rounded-lg p-2.5 text-left hover:bg-muted/60 transition-colors"
                    >
                      <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-foreground">A.I Livestream</div>
                        <div className="text-[10px] text-muted-foreground">Livestream tự động bằng nhân vật ảo</div>
                      </div>
                    </button>
                    <button
                      onClick={() => scrollToSection('digital-human')}
                      className="flex items-start gap-3 w-full rounded-lg p-2.5 text-left hover:bg-muted/60 transition-colors"
                    >
                      <Users className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-foreground">Digital Human A.I</div>
                        <div className="text-[10px] text-muted-foreground">Tạo bản sao số của thương hiệu</div>
                      </div>
                    </button>
                    <button
                      onClick={() => scrollToSection('ai-video')}
                      className="flex items-start gap-3 w-full rounded-lg p-2.5 text-left hover:bg-muted/60 transition-colors"
                    >
                      <Award className="h-5 w-5 text-fuchsia-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-foreground">A.I Video</div>
                        <div className="text-[10px] text-muted-foreground">Giải pháp sản xuất video viral tự động</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => scrollToSection('course')} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Khóa học A.I
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Bảng giá
            </button>
            <button 
              onClick={() => scrollToSection('benefits')} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Về chúng tôi
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Liên hệ
            </button>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-foreground">
                Đăng nhập
              </Button>
            </Link>
            <Button 
              variant="brand" 
              size="sm" 
              className="font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
              onClick={() => scrollToSection('contact')}
            >
              Tư vấn miễn phí
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center h-10 w-10 rounded-lg border border-border/40 hover:bg-muted/40 transition-colors md:hidden text-foreground"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-border/40 bg-background/95 backdrop-blur-lg md:hidden animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-4 px-6 py-6">
              <button
                onClick={() => scrollToSection('hero')}
                className="flex items-center gap-2 text-left text-sm font-semibold py-1.5 border-b border-border/20 text-foreground"
              >
                Trang chủ
              </button>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Giải pháp A.I</span>
                <button
                  onClick={() => scrollToSection('ai-livestream')}
                  className="flex items-center gap-2.5 text-left text-sm pl-2 py-1 hover:text-primary"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  A.I Livestream
                </button>
                <button
                  onClick={() => scrollToSection('digital-human')}
                  className="flex items-center gap-2.5 text-left text-sm pl-2 py-1 hover:text-sky-500"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  Digital Human A.I
                </button>
                <button
                  onClick={() => scrollToSection('ai-video')}
                  className="flex items-center gap-2.5 text-left text-sm pl-2 py-1 hover:text-fuchsia-500"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
                  A.I Video
                </button>
              </div>

              <button
                onClick={() => scrollToSection('course')}
                className="flex items-center gap-2 text-left text-sm font-semibold py-1.5 border-b border-border/20 text-foreground"
              >
                Khóa học A.I
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="flex items-center gap-2 text-left text-sm font-semibold py-1.5 border-b border-border/20 text-foreground"
              >
                Bảng giá
              </button>
              <button
                onClick={() => scrollToSection('benefits')}
                className="flex items-center gap-2 text-left text-sm font-semibold py-1.5 border-b border-border/20 text-foreground"
              >
                Về chúng tôi
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="flex items-center gap-2 text-left text-sm font-semibold py-1.5 border-b border-border/20 text-foreground"
              >
                Liên hệ
              </button>

              <div className="flex flex-col gap-2.5 pt-4">
                <Link to="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Đăng nhập
                  </Button>
                </Link>
                <Button 
                  variant="brand" 
                  className="w-full justify-center"
                  onClick={() => scrollToSection('contact')}
                >
                  Tư vấn miễn phí
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
