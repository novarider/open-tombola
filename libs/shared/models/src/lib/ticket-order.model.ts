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
