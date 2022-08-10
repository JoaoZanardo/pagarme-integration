import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartsService } from '../service/carts.service';
import { CreateCartDto } from '../model/create-cart.dto';
import { UpdateCartDto } from '../model/update-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  async create(@Body() body: CreateCartDto) {
    try {
      const data = {
        price: parseInt(body.price)
      }
      
      return await this.cartsService.create(data);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.cartsService.findAll();
    } catch (e) {
      throw new Error(e);
    }
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return await this.cartsService.findOne(id);
  // }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() body: UpdateCartDto) {
  //   return await this.cartsService.update(id, body);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.cartsService.remove(id);
    } catch (e) {
      throw new Error(e);
    }
  }
}
