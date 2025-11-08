import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Headers,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import {
  CreateMaintenanceDto,
  MaintenanceDto,
  UpdateMaintenanceDto,
} from './dto/maintenanceController.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/rolDecorator.service';
import { RolesGuard } from '../common/guards/rolesguard.service';

@ApiTags('Maintenance')
@ApiBearerAuth('access-token')
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post('start')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('mechanic')
  @ApiOperation({ summary: 'Start maintenance for a vehicle by plate' })
  @ApiBody({ type: CreateMaintenanceDto })
  @ApiResponse({
    status: 201,
    description: 'Maintenance started',
    type: MaintenanceDto,
  })
  async startMaintenance(
    @Body() body: CreateMaintenanceDto,
    @Headers('authorization') authorization: string,
  ) {
    return await this.maintenanceService.startMaintenance(body, authorization);
  }

  @Put(':id/finish')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('mechanic')
  @ApiOperation({ summary: 'Finish maintenance and set vehicle as available' })
  @ApiParam({ name: 'id', description: 'Maintenance ID' })
  @ApiResponse({
    status: 200,
    description: 'Maintenance finished',
    type: MaintenanceDto,
  })
  async finishMaintenance(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    return await this.maintenanceService.finishMaintenance(id, authorization);
  }

  @Put(':id/in-progress')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('mechanic')
  @ApiOperation({ summary: 'Set maintenance status to in_progress' })
  @ApiParam({ name: 'id', description: 'Maintenance ID' })
  @ApiResponse({
    status: 200,
    description: 'Maintenance set to in_progress',
    type: MaintenanceDto,
  })
  async setInProgress(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    return await this.maintenanceService.setInProgress(id, authorization);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('mechanic')
  @ApiOperation({ summary: 'Get all maintenances' })
  @ApiResponse({
    status: 200,
    description: 'List of maintenances',
    type: [MaintenanceDto],
  })
  async findAll() {
    return await this.maintenanceService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('mechanic')
  @ApiOperation({ summary: 'Get maintenance by ID' })
  @ApiParam({ name: 'id', description: 'Maintenance ID' })
  @ApiResponse({
    status: 200,
    description: 'Maintenance found',
    type: MaintenanceDto,
  })
  async findOne(@Param('id') id: string) {
    return await this.maintenanceService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('mechanic')
  @ApiOperation({ summary: 'Update maintenance by ID' })
  @ApiParam({ name: 'id', description: 'Maintenance ID' })
  @ApiBody({ type: UpdateMaintenanceDto })
  @ApiResponse({
    status: 200,
    description: 'Maintenance updated',
    type: MaintenanceDto,
  })
  async update(
    @Param('id') id: string,
    @Body() changes: UpdateMaintenanceDto,
    @Headers('authorization') authorization: string,
  ) {
    return await this.maintenanceService.update(id, changes, authorization);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('mechanic')
  @ApiOperation({ summary: 'Delete maintenance by ID' })
  @ApiParam({ name: 'id', description: 'Maintenance ID' })
  @ApiResponse({ status: 200, description: 'Maintenance deleted' })
  async delete(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    return await this.maintenanceService.delete(id, authorization);
  }
}
