import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountriesService } from './countries.service';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get('/getAll/')
  async getCountries() {
    return await this.countriesService.getAllCountries();
  }

  @Get('/cities/:countryId')
  @ApiOperation({
    summary: 'Obtener ciudades por código de país (ISO 3166-1 alpha-2)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ciudades obtenida exitosamente.',
  })
  async getCitiesByCountry(@Param('countryId') countryId: string) {
    return await this.countriesService.getCitiesByCountry(countryId);
  }

  // 🔥 NUEVO ENDPOINT — solicitado por tu profesor
  @Get('/country/:countryId')
  @ApiOperation({
    summary: 'Obtener información detallada de un país (ISO 3166-1 alpha-2)',
  })
  @ApiResponse({
    status: 200,
    description: 'Información del país obtenida exitosamente.',
  })
  async getCountryById(@Param('countryId') countryId: string) {
    return await this.countriesService.getCountryById(countryId);
  }
}
