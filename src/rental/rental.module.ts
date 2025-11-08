import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [RentalController],
  providers: [RentalService],
})
export class RentalModule {}
