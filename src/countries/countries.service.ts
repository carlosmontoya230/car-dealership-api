import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class CountriesService {
  private readonly geoApiUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
  private readonly rapidApiHost = 'wft-geo-db.p.rapidapi.com';

  constructor(private readonly httpService: AxiosAdapter) {}

  async getAllCountries(): Promise<any> {
    const url = `${this.geoApiUrl}/countries`;
    const headers = {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com', // 🔥 igual que el de tu compañero
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

  async getCitiesByCountry(countryId: string): Promise<any> {
    const url = `${this.geoApiUrl}/cities?countryIds=${countryId}&limit=10&sort=name`;

    const headers = {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': this.rapidApiHost,
    };

    try {
      const response = await this.httpService.get<any>(url, headers);
      return response.data; // ✅ ya no hay duplicados
    } catch (error) {
      throw new HttpException(
        `Error al obtener las ciudades para ${countryId}: ${error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // 🔥 NUEVO MÉTODO — para el endpoint /country/:countryId
  async getCountryById(countryId: string): Promise<any> {
    const url = `${this.geoApiUrl}/countries/${countryId}`;
    const headers = {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com', // 🔥 igual que el de tu compañero
    };

    try {
      const response = await this.httpService.get<any>(url, headers);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error al obtener la información del país ${countryId}: ${error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
