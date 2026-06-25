import { Module } from '@nestjs/common'
import { RabbitmqModule } from './rabbitmq/rabbitmq.module'
import { FfmpegModule } from './ffmpeg/ffmpeg.module'
import { RtmpModule } from './rtmp/rtmp.module'

@Module({
  imports: [RabbitmqModule, FfmpegModule, RtmpModule],
})
export class AppModule {}
