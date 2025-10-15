import { Module } from '@nestjs/common';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';

@Module({
  imports: [],
  controllers: [CountriesController],
  providers: [CountriesService, AxiosAdapter],
})
export class CountriesModule {}
