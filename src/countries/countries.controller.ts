import { Controller, Get } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get('/getAll/')
  async getCountries() {
    return await this.countriesService.getAllCountries();
  }

  @Get('/cities/')
  @ApiOperation({ summary: 'Obtener todas las ciudades' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ciudades obtenida exitosamente.',
  })
  async getCities() {
    //* Aquí aplicas el controlados de las ciudades por país
  }
}
