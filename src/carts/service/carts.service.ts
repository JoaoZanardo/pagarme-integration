import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDto } from '../model/create-cart.dto';
import { UpdateCartDto } from '../model/update-cart.dto';
import { Cart } from '../model/cart.entity';

@Injectable()
export class CartsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Cart) {
    return await this.prisma.cart.create({ data });
  }

  async findAll() {
    return await this.prisma.cart.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.cart.findFirst({ where: { id } });
  }

  // async update(id: string, data: UpdateCartDto) {
  //   return await this.prisma.cart.update({ where: { id }, data });
  // }

  async remove(id: string) {
    return await this.prisma.cart.delete({ where: { id } });
  }
}
