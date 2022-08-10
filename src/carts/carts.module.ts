import { Module } from '@nestjs/common';
import { CartsService } from './service/carts.service';
import { CartsController } from './controller/carts.controller';

@Module({
  controllers: [CartsController],
  providers: [CartsService]
})
export class CartsModule {}
