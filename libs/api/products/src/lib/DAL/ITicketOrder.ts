import { TicketDBO } from "@novarider/open-tombola/models";

export interface ITicketRepository {
    saveTickets(ticket: TicketDBO[]): Promise<TicketDBO[]>;
    getTicketsForOrder(orderId: string): Promise<TicketDBO[]>;
}