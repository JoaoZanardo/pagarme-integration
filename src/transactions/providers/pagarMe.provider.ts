import { SendGridService } from '@anchan828/nest-sendgrid';
import { Injectable } from '@nestjs/common';
import { cpf } from 'cpf-cnpj-validator';
import * as pagarme from 'pagarme';
import { Billing } from '../model/billing.type';
import { CreditCard } from '../model/creditCard.type';
import { Customer } from '../model/customer.type';
import { Payment } from '../model/payment';

@Injectable()
export class PagarMeProvider {
    constructor(private readonly sendGrid: SendGridService) { }

    async process(
        transactionId: string,
        total: number,
        paymentType: Payment,
        installments: number,
        creditCard: CreditCard,
        customer: Customer,
        billing: Billing,
        items: any,
        boleto_expiration_date: string
    ): Promise<{
        statusCode: number,
        transaction_id: string
    }> {
        let paymentParams: object;

        switch (paymentType) {
            case 'billet':
                paymentParams = {
                    payment_method: 'boleto',
                    amount: total * 100,
                    installments: 1,
                    soft_descriptor: 'BACKWARD',
                    boleto_instructions: 'Boleto válido em até 3 dias úteis',
                    boleto_expiration_date
                };
                break;
            case 'credit_card':
                paymentParams = {
                    capture: true,
                    amount: total * 100,
                    installments,
                    card_number: creditCard.number,
                    card_cvv: creditCard.cvv,
                    card_expiration_date: creditCard.expiration.replace('/', ''),
                    card_holder_name: creditCard.holderName,
                }
                break;

            default:
                throw 'Payment type not found'
        }


        const customerParams = {
            customer: {
                external_id: customer.email,
                name: customer.name,
                email: customer.email,
                type: cpf.isValid(customer.document) ? 'individual' : 'corporation',
                documents: [
                    {
                        type: cpf.isValid(customer.document) ? 'cpf' : 'cnpj',
                        number: customer.document.replace(/[^?0-9]/g, ''),
                    }
                ],
                phone_numbers: [customer.mobile],
                country: 'br'
            }
        }

        const billingParams = {
            billing: {
                name: 'Billing address',
                address: {
                    country: 'br',
                    state: billing.state,
                    city: billing.city,
                    neighborhood: billing.neighborhood,
                    street: billing.address,
                    street_number: billing.number,
                    zipcode: billing.zipCode.replace(/[^?0-9]/g, '')
                }
            }
        }

        const itemsParams = items && items.lenght > 0 ? {
            items: [items.map((item: any) => ({
                id: item.id,
                title: item.title,
                unit_price: item.price * 100,
                quantity: item.qtd || 1,
                tangible: false
            }))]
        } : {
            items: [{
                id: '1',
                title: transactionId,
                unit_price: total * 100,
                quantity: 1,
                tangible: false
            }]
        }

        const metadataParams = {
            metadata: {
                transactionId
            }
        }

        const transactionParams = {
            async: false,
            ...paymentParams,
            ...customerParams,
            ...billingParams,
            ...itemsParams,
            ...metadataParams
        }

        const client = await pagarme.client.connect({
            api_key: process.env.PAGARME_API_KEY
        });

        const response = await client.transactions.create(transactionParams);
        await this.sendEmail(customer.email, transactionId, total);

        return {
            statusCode: 201,
            transaction_id: response.id
        };
    }

    async find(): Promise<object[] | []> {
        const client = await pagarme.client.connect({
            api_key: process.env.PAGARME_API_KEY
        });

        const transactionsRaw = await client.transactions.all();

        const transactions = [];

        for (const i of transactionsRaw) {
            transactions.push({
                id: i.id,
                status: i.status
            })
        }

        return transactions;
    }

    async sendEmail(email: string, transactionId: string, total: number): Promise<void> {
        await this.sendGrid.send({
            to: email,
            from: "joaozzz0105@gmail.com",
            subject: "Successful purchase",
            text: `${transactionId}, ${total}`,
        });
    }
}