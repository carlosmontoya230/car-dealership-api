import { ExtraController } from './extra.controller';
import { ExtraService } from './extra.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ExtraController],
  providers: [ExtraService],
})
export class ExtraModule {}
