import { Injectable, OnModuleInit } from '@nestjs/common'
import { RabbitmqService } from '../rabbitmq/rabbitmq.service'
import type { StartStreamCommand, StreamStatusEvent } from '@sea/contracts'

interface ActiveProcess {
  sessionId: string
  process: any
  platforms: Map<string, { status: string }>
}

@Injectable()
export class FfmpegService implements OnModuleInit {
  private activeProcesses = new Map<string, ActiveProcess>()

  constructor(private readonly rabbitmqService: RabbitmqService) {}

  async onModuleInit() {
    await this.rabbitmqService.consume('stream.start', async (cmd: StartStreamCommand) => {
      await this.startStream(cmd)
    })
    await this.rabbitmqService.consume('stream.stop', async (cmd: { sessionId: string }) => {
      this.stopStream(cmd.sessionId)
    })
  }

  async startStream(cmd: StartStreamCommand) {
    if (this.activeProcesses.has(cmd.sessionId)) {
      console.log(`Stream ${cmd.sessionId} already active`)
      return
    }

    const rtmpPort = parseInt(process.env.RTMP_PORT ?? '19450', 10)
    const inputUrl = `rtmp://0.0.0.0:${rtmpPort}/${cmd.rtmpInputKey}`

    const args: string[] = [
      '-listen', '1',
      '-i', inputUrl,
    ]

    for (const platform of cmd.platforms) {
      const outputUrl = `${platform.rtmpUrl}/${platform.streamKey}`
      args.push('-c', 'copy', '-f', 'flv', outputUrl)
    }

    console.log(`Starting FFmpeg for session ${cmd.sessionId}`)
    console.log(`Command: ffmpeg ${args.join(' ')}`)

    try {
      const { spawn } = await import('child_process')
      const proc = spawn('ffmpeg', args)

      const platformStatuses = new Map<string, { status: string }>()
      for (const p of cmd.platforms) {
        platformStatuses.set(p.platformConnectionId, { status: 'connecting' })
      }

      this.activeProcesses.set(cmd.sessionId, {
        sessionId: cmd.sessionId,
        process: proc,
        platforms: platformStatuses,
      })

      proc.stdout?.on('data', (data: Buffer) => {
        console.log(`[ffmpeg:${cmd.sessionId}] ${data.toString().trim()}`)
      })

      proc.stderr?.on('data', (data: Buffer) => {
        const output = data.toString().trim()
        console.log(`[ffmpeg:${cmd.sessionId}] ${output}`)
        if (output.includes('FLV') || output.includes('Opening')) {
          for (const [connId] of platformStatuses) {
            if (platformStatuses.get(connId)?.status === 'connecting') {
              platformStatuses.set(connId, { status: 'live' })
              this.publishStatus(cmd.sessionId, 'live', connId)
            }
          }
        }
      })

      proc.on('close', (code) => {
        console.log(`FFmpeg exited for ${cmd.sessionId} with code ${code}`)
        this.activeProcesses.delete(cmd.sessionId)
        this.publishStatus(cmd.sessionId, code === 0 ? 'ended' : 'error')
      })

      proc.on('error', (err) => {
        console.error(`FFmpeg error for ${cmd.sessionId}:`, err)
        this.activeProcesses.delete(cmd.sessionId)
        this.publishStatus(cmd.sessionId, 'error', undefined, err.message)
      })

      for (const [connId] of platformStatuses) {
        this.publishStatus(cmd.sessionId, 'connecting', connId)
      }
    } catch (err: any) {
      console.error(`Failed to start FFmpeg:`, err)
      this.publishStatus(cmd.sessionId, 'error', undefined, err.message)
    }
  }

  stopStream(sessionId: string) {
    const active = this.activeProcesses.get(sessionId)
    if (!active) return
    active.process.kill('SIGTERM')
    this.activeProcesses.delete(sessionId)
    this.publishStatus(sessionId, 'ended')
  }

  private publishStatus(
    sessionId: string,
    status: StreamStatusEvent['status'],
    platformConnectionId?: string,
    error?: string,
  ) {
    this.rabbitmqService.publishStatus({
      sessionId,
      status,
      platformConnectionId,
      error,
    } satisfies StreamStatusEvent)
  }
}
