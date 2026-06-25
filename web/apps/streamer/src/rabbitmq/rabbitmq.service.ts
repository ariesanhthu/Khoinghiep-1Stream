import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import * as amqp from 'amqplib'

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private channel: amqp.Channel | null = null

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:56720'
    try {
      const conn = await amqp.connect(url)
      this.channel = await conn.createChannel()

      await this.channel.assertExchange('stream.exchange', 'topic', { durable: true })
      await this.channel.assertQueue('stream.start', { durable: true })
      await this.channel.assertQueue('stream.stop', { durable: true })
      await this.channel.assertQueue('stream.status', { durable: true })

      console.log('Streamer RabbitMQ connected')
    } catch (err) {
      console.error('Streamer RabbitMQ connection failed:', err)
    }
  }

  async onModuleDestroy() {
    await this.channel?.close()
  }

  async consume(queue: string, handler: (msg: any) => Promise<void>) {
    if (!this.channel) return
    await this.channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          await handler(JSON.parse(msg.content.toString()))
          this.channel!.ack(msg)
        } catch (err) {
          console.error(`Error processing ${queue}:`, err)
          this.channel!.nack(msg, false, true)
        }
      }
    })
  }

  async publishStatus(event: any) {
    if (!this.channel) return
    this.channel.publish(
      'stream.exchange',
      'stream.status',
      Buffer.from(JSON.stringify(event)),
      { persistent: true },
    )
  }
}
