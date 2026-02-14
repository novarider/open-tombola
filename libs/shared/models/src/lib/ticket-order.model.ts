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
  orderId: string;
  createdAt: Date;
  payedAt: Date | null;

  firstName: string;
  lastName: string;

  street: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface TicketDBO {
  ticketId: string;
  fk_orderId: string;
  weight: number;
}