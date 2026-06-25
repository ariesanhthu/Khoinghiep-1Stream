import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:43100',
    credentials: true,
  })
  const port = parseInt(process.env.API_PORT ?? '43101', 10)
  await app.listen(port)
  console.log(`API running on port ${port}`)
}
bootstrap()
