import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartsModule } from './carts/carts.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    CartsModule,
    PrismaModule,
    TransactionsModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
