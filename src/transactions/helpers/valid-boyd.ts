import { parsePhoneNumber } from 'libphonenumber-js';
import * as Yup from 'yup';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { Payment } from '../model/payment';
import { CreateTransactionDto } from '../model/create-transaction.dto';
import * as Correios from 'node-correios';

export const validBody = async (body: CreateTransactionDto): Promise<boolean> => {
    const {
        cartId,
        paymentType,
        installments,
        customerName,
        customerMobile,
        customerDocument,
        creditCardNumber,
        creditCardExpiration,
        creditCardHolderName,
        creditCardCvv,
        billingZipCode
    } = body;

    try {
        const correios = new Correios();
        const cep = await correios.consultaCEP({ cep: billingZipCode.replace(/[^?0-9]/g, '') });
    } catch (error) {
        return false;
    }


    const schema = Yup.object({
        cartId: Yup.string().min(24).max(24).required(),
        paymentType: Yup.mixed().oneOf(['credit_card', 'billet']).required(),
        installments: Yup.number()
            .required()
            .min(1)
            .when('paymentType', (paymentType: Payment, schema: any) =>
                paymentType === 'credit_card' ? schema.max(12) : schema.max(1)),
        customerName: Yup.string().min(3).required(),
        customerMobile: Yup.string()
            .required()
            .test('is-valid-mobile', '${path} is not a mobile number', value =>
                parsePhoneNumber(value, 'BR').isValid()
            ),
        customerDocument: Yup.string()
            .required()
            .test('is-valid-document', '${path} is not a valid CPF / CNPJ', value =>
                cpf.isValid(value) || cnpj.isValid(value)
            ),
        creditCardNumber: Yup.string()
            .when('paymentType', (paymentType: Payment, schema: any) => {
                return paymentType === 'credit_card' ? schema.required() : schema
            }
            ),
        creditCardExpiration: Yup.string()
            .when('paymentType', (paymentType: Payment, schema: any) => {
                return paymentType === 'credit_card' ? schema.required() : schema
            }
            ),
        creditCardHolderName: Yup.string()
            .when('paymentType', (paymentType: Payment, schema: any) => {
                return paymentType === 'credit_card' ? schema.required() : schema
            }
            ),
        creditCardCvv: Yup.string()
            .when('paymentType', (paymentType: Payment, schema: any) => {
                return paymentType === 'credit_card' ? schema.required() : schema
            }
            ),
    });

   return await schema.isValid(body);
}