import { InsuranceController } from './insurance.controller';
import { InsuranceService } from './insurance.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [InsuranceController],
  providers: [InsuranceService],
})
export class InsuranceModule {}
