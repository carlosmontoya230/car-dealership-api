import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
