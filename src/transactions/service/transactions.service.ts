import { Injectable } from '@nestjs/common';
import { Transaction as TransactionPrisma}  from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Billing } from '../model/billing.type';
import { CreditCard } from '../model/creditCard.type';
import { Customer } from '../model/customer.type';
import { Payment } from '../model/payment';
import { Transaction } from '../model/transaction.entity';
import { PagarMeProvider } from '../providers/pagarMe.provider';

@Injectable()
export class TransactionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly paymentProvider: PagarMeProvider
    ) { }

    async process(
        cartId: string,
        paymentType: Payment,
        installments: number,
        customer: Customer,
        billing: Billing,
        creditCard: CreditCard
    ): Promise<any> {
        const cart = await this.prisma.cart.findFirst({ where: { id: cartId } });
        if (!cart) return null;

        const data: Transaction = {
            cartId,
            total: cart.price,
            paymentType,
            installments,
            status: 'started',

            customerName: customer.name,
            customerEmail: customer.email,
            customerMobile: customer.mobile,
            customerDocument: customer.document,

            billingAddress: billing.address,
            billingNumber: billing.number,
            billingNeighborhood: billing.neighborhood,
            billingCity: billing.city,
            billingState: billing.state,
            billingZipCode: billing.zipCode,

            processorResponse: 'dsd'
        };

        const transaction = await this.prisma.transaction.create({ data });

        const items = null;

        const date = new Date();
        date.setDate(date.getDate() + 3) //3 dias úteis
        const boleto_expiration_date = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

        try {
            return await this.paymentProvider.process(
                transaction.id,
                transaction.total,
                paymentType,
                transaction.installments,
                creditCard,
                customer,
                billing,
                items,
                boleto_expiration_date
            );
        } catch (e) {
            await this.remove(transaction.id);
            return e.response;
        }
    }

    async getTransactionsFromProvider() {
        return await this.paymentProvider.findAll()
    }

    async find(id?: string): Promise<TransactionPrisma[] | TransactionPrisma> {
        if (id) return await this.prisma.transaction.findFirst({ where: { id } });
        return await this.prisma.transaction.findMany();
    }

    async remove(id: string): Promise<void | ErrorConstructor> {
        const transaction = await this.find(id);
        if (!transaction) return Error;

        await this.prisma.transaction.delete({ where: { id } });
    }

}


