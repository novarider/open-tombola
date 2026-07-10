import { TicketDBO } from "@novarider/open-tombola/models";

export interface ITicketRepository {
    saveTickets(ticket: TicketDBO[]): Promise<TicketDBO[]>;
    getTicketsForOrder(orderId: string): Promise<TicketDBO[]>;
    createOfflineTicketCodes(codes: string[]): Promise<void>;
    getAvailbleOfflineTicketCodes(): Promise<string[]>;

    getTickets(): Promise<TicketDBO[]>;
    getTicketsById(ticketIds: string[]): Promise<TicketDBO[]>;
    getTicketsCount(): Promise<number>;
    getValidTickets(): Promise<unknown[]>;
    getUnpaidTickets(): Promise<unknown[]>;

    updateOrderIdOnTicket(ticketId: string, orderid: string): TicketDBO;
    updateWeightOnTicket(ticketId: string, weight: string): TicketDBO;
}