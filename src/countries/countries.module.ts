import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [CountriesController],
  providers: [CountriesService, AxiosAdapter],
})
export class CountriesModule {}
