import { Ticket } from "./ticket.model";

export interface TicketOrder {
  firstName: string;
  lastName: string;

  street: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;

  tickets: Ticket[];
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