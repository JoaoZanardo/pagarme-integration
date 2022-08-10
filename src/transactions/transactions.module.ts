import { Module } from '@nestjs/common';
import { TransactionsService } from './service/transactions.service';
import { TransactionsController } from './controller/transactions.controller';
import { CartsService } from 'src/carts/service/carts.service';
import { PagarMeProvider } from './providers/pagarMe.provider';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    CartsService,
    PagarMeProvider,
  ]
})
export class TransactionsModule { }
