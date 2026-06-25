import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      toastOptions={{
        style: {
          background: 'hsl(230 30% 12%)',
          border: '1px solid hsl(230 20% 22%)',
          color: 'hsl(220 20% 96%)',
        },
      }}
    />
  )
}

export { toast } from 'sonner'
