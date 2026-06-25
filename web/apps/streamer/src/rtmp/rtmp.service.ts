import { Injectable } from '@nestjs/common'

@Injectable()
export class RtmpService {
  getRtmpEndpoint(): { port: number; protocol: string } {
    return {
      port: parseInt(process.env.RTMP_PORT ?? '19450', 10),
      protocol: 'rtmp',
    }
  }

  validateStreamKey(key: string): boolean {
    return key.startsWith('live_')
  }
}
