import { Injectable, NotFoundException, Inject } from '@nestjs/common';

import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';

import { ProductsService } from './../../products/services/products.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  // Realizamos la inyeccion del motodo ProductsService
  constructor(
    private productsService: ProductsService,
    @Inject('API_KEY') private apiKey: string,
  ) {}

  private counterId = 1;
  private users: User[] = [
    {
      id: 1,
      email: 'correo@mail.com',
      password: '12345',
      role: 'admin',
    },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  create(data: CreateUserDto) {
    this.counterId = this.counterId + 1;
    const newUser = {
      id: this.counterId,
      ...data,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, changes: UpdateUserDto) {
    const user = this.findOne(id);
    const index = this.users.findIndex((item) => item.id === id);
    this.users[index] = {
      ...user,
      ...changes,
    };
    return this.users[index];
  }

  remove(id: number) {
    const index = this.users.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`User #${id} not found`);
    }
    this.users.splice(index, 1);
    return true;
  }

  getOrderByUser(id: number): Order {
    // 👈 new method
    const user = this.findOne(id);
    return {
      date: new Date(),
      user,
      products: this.productsService.findAll(),
    };
  }
}
