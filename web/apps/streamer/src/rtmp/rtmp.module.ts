import { Module } from '@nestjs/common'
import { RtmpService } from './rtmp.service'

@Module({
  providers: [RtmpService],
})
export class RtmpModule {}
