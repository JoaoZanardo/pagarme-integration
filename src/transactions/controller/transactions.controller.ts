import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { parsePhoneNumber } from 'libphonenumber-js';
import { CartsService } from 'src/carts/service/carts.service';
import { validBody } from '../helpers/valid-boyd';
import { Billing } from '../model/billing.type';
import { CreateTransactionDto } from '../model/create-transaction.dto';
import { CreditCard } from '../model/creditCard.type';
import { Customer } from '../model/customer.type';
import { TransactionsService } from '../service/transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly cartService: CartsService
  ) { }

  @Post('')
  async create(@Body() body: CreateTransactionDto): Promise<any> {
    try {
      const isValid = await validBody(body);
      if (!isValid) return { statusCode: 400, message: 'Error on validate schema' };

      const cart = await this.cartService.findOne(body.cartId);
      if (!cart) return { statusCode: 404, message: 'Cart not found' };

      const customer: Customer = {
        name: body.customerName,
        email: body.customerEmail,
        mobile: parsePhoneNumber(body.customerMobile, 'BR').format('E.164'),
        document: body.customerDocument
      }

      const billing: Billing = {
        address: body.billingAddress,
        number: body.billingNumber,
        neighborhood: body.billingNeighborhood,
        city: body.billingCity,
        state: body.billingState,
        zipCode: body.billingZipCode,
      }

      const creditCard: CreditCard = {
        number: body.creditCardNumber,
        expiration: body.creditCardExpiration,
        holderName: body.creditCardHolderName,
        cvv: body.creditCardCvv
      }

      return await this.transactionsService.process(
        cart.id,
        body.paymentType,
        Number(body.installments),
        customer,
        billing,
        creditCard
      );
    } catch (e) {
      console.log(e);
    }
  }


  @Get('')
  async getFrom() {
    return await this.transactionsService.transactionsFromProvider();
  }

  // async findAll() {
  //   try {
  //     const transactions = await this.transactionsService.find();

  //     return {
  //       status: 200,
  //       transactions
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}
