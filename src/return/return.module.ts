import { ReturnController } from './return.controller';
import { ReturnService } from './return.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ReturnController],
  providers: [ReturnService],
})
export class ReturnModule {}
