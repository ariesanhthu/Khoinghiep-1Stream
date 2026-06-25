import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:43100',
    credentials: true,
  },
})
export class SessionGateway {
  @WebSocketServer()
  server!: Server

  @SubscribeMessage('join:session')
  handleJoin(@MessageBody() sessionId: string, @ConnectedSocket() client: Socket) {
    client.join(`session:${sessionId}`)
  }

  @SubscribeMessage('leave:session')
  handleLeave(@MessageBody() sessionId: string, @ConnectedSocket() client: Socket) {
    client.leave(`session:${sessionId}`)
  }

  broadcastToSession(sessionId: string, event: string, data: any) {
    this.server.to(`session:${sessionId}`).emit(event, data)
  }
}
