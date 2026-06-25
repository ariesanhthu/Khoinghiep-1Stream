import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = parseInt(process.env.STREAMER_PORT ?? '43102', 10)
  await app.listen(port)
  console.log(`Streamer running on port ${port}`)
}
bootstrap()
