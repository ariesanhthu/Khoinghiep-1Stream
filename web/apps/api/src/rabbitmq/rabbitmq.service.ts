import { Injectable, OnModuleInit } from '@nestjs/common'
import * as amqp from 'amqplib'

@Injectable()
export class RabbitmqService implements OnModuleInit {
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
      await this.channel.bindQueue('stream.start', 'stream.exchange', 'stream.start')
      await this.channel.bindQueue('stream.stop', 'stream.exchange', 'stream.stop')
      await this.channel.bindQueue('stream.status', 'stream.exchange', 'stream.status')
      console.log('RabbitMQ connected')
    } catch (err) {
      console.error('RabbitMQ connection failed:', err)
    }
  }

  async publish(queue: string, message: any) {
    if (!this.channel) return
    this.channel.publish(
      'stream.exchange',
      queue,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    )
  }

  async consume(queue: string, handler: (msg: any) => void) {
    if (!this.channel) return
    await this.channel.consume(queue, (msg) => {
      if (msg) {
        handler(JSON.parse(msg.content.toString()))
        this.channel!.ack(msg)
      }
    })
  }
}
