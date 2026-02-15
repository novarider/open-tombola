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
  paymentreference: string | null;
  checkoutdoneat: Date | null;

  firstname: string;
  lastname: string;

  street: string;
  addressline2: string;
  postalcode: string;
  city: string;
  country: string;
}

export interface TicketDBO {
  ticketId: string;
  fk_orderId: string;
  weight: number;
}