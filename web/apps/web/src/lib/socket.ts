import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    socket = io(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:43101', {
      autoConnect: false,
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    })
  }
  return socket
}
