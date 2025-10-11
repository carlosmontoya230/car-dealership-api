import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  private clients: Client[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+1234567890',
      address: 'Calle 123, Ciudad',
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria@example.com',
      phone: '+0987654321',
      address: 'Avenida 456, Ciudad',
    },
  ];

  @Get()
  getClients(@Query('email') email?: string) {
    if (email) {
      return this.clients.filter((client) => client.email.includes(email));
    }
    return this.clients;
  }

  @Get(':id')
  getClient(@Param('id') id: string) {
    const client = this.clients.find((client) => client.id === id);
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
    return client;
  }

  @Post()
  createClient(@Body() body: Omit<Client, 'id'>) {
    const existingClient = this.clients.find(
      (client) => client.email === body.email,
    );
    if (existingClient) {
      throw new ConflictException('Client email already exists');
    }

    if (!body.email.includes('@')) {
      throw new BadRequestException('Email is not valid');
    }

    const newClient = {
      ...body,
      id: `${new Date().getTime()}`,
    };
    this.clients.push(newClient);
    return newClient;
  }

  @Delete(':id')
  deleteClient(@Param('id') id: string) {
    const position = this.clients.findIndex((client) => client.id === id);
    if (position === -1) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
    this.clients = this.clients.filter((client) => client.id !== id);
    return {
      message: 'Client deleted',
    };
  }

  @Put(':id')
  updateClient(@Param('id') id: string, @Body() changes: Partial<Client>) {
    const position = this.clients.findIndex((client) => client.id === id);
    if (position === -1) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    if (changes.email && changes.email !== this.clients[position].email) {
      const existingClient = this.clients.find(
        (client) => client.email === changes.email,
      );
      if (existingClient) {
        throw new ConflictException('Email already exists');
      }
    }

    if (changes.email && !changes.email.includes('@')) {
      throw new BadRequestException('Email is not valid');
    }

    const currentData = this.clients[position];
    const updatedClient = {
      ...currentData,
      ...changes,
    };
    this.clients[position] = updatedClient;
    return updatedClient;
  }
}
