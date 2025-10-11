import { Injectable } from '@nestjs/common';
import { HttpAdapter } from '../interface/http-adapter.interface';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;

  async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url, { headers });
      return data;
    } catch (error: any) {
      const message = error.response
        ? `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`
        : error.message;
      throw new Error(`Error en GET ${url}: ${message}`);
    }
  }
}
