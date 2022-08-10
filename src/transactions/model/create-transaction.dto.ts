import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Payment } from "./payment";

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsString()
    cartId: string;
    @IsNotEmpty()
    paymentType: Payment;
    @IsNotEmpty()
    @IsString()
    installments: string;
    @IsNotEmpty()
    @IsEmail()
    customerEmail: string;
    @IsNotEmpty()
    @IsString()
    customerName: string;
    @IsNotEmpty()
    @IsString()
    customerMobile: string;
    @IsNotEmpty()
    @IsString()
    customerDocument: string;
    @IsNotEmpty()
    @IsString()
    billingAddress: string;
    @IsNotEmpty()
    @IsString()
    billingNumber: string;
    @IsNotEmpty()
    @IsString()
    billingNeighborhood: string;
    @IsNotEmpty()
    @IsString()
    billingCity: string;
    @IsNotEmpty()
    @IsString()
    billingState: string;
    @IsNotEmpty()
    @IsString()
    billingZipCode: string;

    creditCardNumber: string
    creditCardExpiration: string;
    creditCardHolderName: string;
    creditCardCvv: string;
}