import { Ticket, TicketOptionalActivationCode } from "./ticket.model";

export interface TicketOrderBase {
  firstName: string;
  lastName: string;

  street: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;
  phonenumber: string;
}

export interface TicketOrder extends TicketOrderBase {
  tickets: Ticket[];
}

export interface ActivationOrder extends TicketOrderBase {
  offlineTickets: TicketOptionalActivationCode[]
}

export interface OrderActivationSucceeded {
  order: OrderDBO,
  ticketIds: TicketDBO[]
}

export interface OrderActivationFailed {
  unusedCodes: Set<string>,
  usedCodes: Set<string>
}

export interface OfflineTicketValidateQuery extends OrderActivationFailed {
  allCodesFound: boolean,
}

export interface OrderDBO {
  orderid: string;
  createdat: Date;

  firstname: string;
  lastname: string;

  street: string;
  addressline2: string;
  postalcode: string;
  city: string;
  country: string;
}

export interface TicketDBO {
  ticketid: string;
  fk_orderid: string;
  weight: number;
}

export interface CheckoutDBO {
  checkoutid: string;
  checkoutstatus: string;
  checkoutdoneat: Date | null;
  fk_orderid: string;
  paymentreference: string;
  paymentstatus: string;
}