import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class CountriesService {
  constructor(private readonly httpService: AxiosAdapter) {}

  async getAllCountries(): Promise<any> {
    const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/countries';

    const headers = {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
    };

    const limit = 10;
    let offset = 0;
    let allCountries: any[] = [];
    let totalCount = 0;

    try {
      do {
        const urlData = `${url}?offset=${offset}&limit=${limit}`;
        const response = await this.httpService.get<any>(urlData, headers);

        if (response?.data?.length > 0) {
          allCountries = allCountries.concat(response.data);
        }

        totalCount = response?.metadata?.totalCount ?? 0;
        offset += limit;
        await this.delay(1500);
      } while (offset < totalCount);

      return allCountries;
    } catch (error) {
      throw new HttpException(
        `Error al obtener los países: ${error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getCities(): Promise<any> {
    //* Aquí aplicas el servicio  las ciudades por país
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
