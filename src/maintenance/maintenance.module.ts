import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
})
export class MaintenanceModule {}
