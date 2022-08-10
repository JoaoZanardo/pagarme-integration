import { Payment } from "./payment"
import { Status } from "./status";

export class Transaction {
    cartId: string;
    total: number;
    paymentType: Payment;
    installments: number;
    status: Status;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    customerDocument: string;
    billingAddress: string;
    billingNumber: string;
    billingNeighborhood: string;
    billingCity: string
    billingState: string;
    billingZipCode: string;
    processorResponse: string
}