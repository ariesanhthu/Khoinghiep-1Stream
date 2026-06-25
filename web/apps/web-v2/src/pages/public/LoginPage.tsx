import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/store/authStore'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')

  const doLogin = (value: string) => {
    login(value)
    navigate('/live/preview')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    doLogin(account)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 flex items-center justify-center gap-2 text-2xl font-bold"
        >
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-gradient">1STREAM</span>
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Đăng nhập</CardTitle>
            <CardDescription>
              Đăng nhập demo — nhập bất kỳ giá trị nào.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account">Email hoặc tài khoản</Label>
                <Input
                  id="account"
                  placeholder="ban@1stream.ai"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" variant="brand" className="w-full">
                Đăng nhập
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">HOẶC</span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => doLogin('Google')}
              >
                Tiếp tục với Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => doLogin('Facebook')}
              >
                Tiếp tục với Facebook
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
              ← Quay lại trang chủ
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
