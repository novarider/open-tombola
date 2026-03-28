import { TicketDBO } from "@novarider/open-tombola/models";
import { Inject, Service } from "typedi";
import { DBConnection } from "./DBConnection";
import { ITicketRepository } from "./ITicketOrder";

@Service()
export class TicketRepository implements ITicketRepository {
    @Inject(() => DBConnection)
    private dbConnection: DBConnection;

    public async saveTickets(tickets: TicketDBO[]): Promise<TicketDBO[]> {
        try {
            await this.dbConnection.dbOpenTombola.tx(async (tx) => {
                for (const ticket of tickets) {
                    await tx.none("INSERT INTO tickets (ticketid, fk_orderid, weight) VALUES ($1, $2, $3)", [ticket.ticketid, ticket.fk_orderid, ticket.weight]);
                }
            });
            return this.getTicketsForOrder(tickets[0].fk_orderid);
        } catch (error) {
            console.error("Error saving tickets:", error);
            return [];
        }
    }

    public async getTicketsForOrder(orderId: string): Promise<TicketDBO[]> {
        return await this.dbConnection.dbOpenTombola.manyOrNone<TicketDBO>("SELECT * FROM tickets WHERE fk_orderid = $1", [orderId]);
    }

    public async createOfflineTicketCodes(codes: string[]): Promise<void> {
        try {
            await this.dbConnection.dbOpenTombola.tx(async (tx) => {
                for (const code of codes) {
                    await tx.none("INSERT INTO offlineTicketCodes (code, used) VALUES ($1, $2)", [code, false]);
                }
            });
        } catch (error) {
            console.error("Error creating new ticket codes:", error);
        }
    }

    public async getAvailbleOfflineTicketCodes(): Promise<string[]> {
        return await this.dbConnection.dbOpenTombola.manyOrNone<string>("SELECT code FROM offlineTicketCodes WHERE used = false");
    }
}