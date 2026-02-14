import { TicketDBO } from "@novarider/open-tombola/models";
import { Inject, Service } from "typedi";
import { DBConnection } from "./DBConnection";
import { ITicketRepository } from "./ITicketOrder";

@Service()
export class TicketRepository implements ITicketRepository {
    @Inject(() => DBConnection)
    private dbConnection: DBConnection;

    public async saveTickets(ticket: TicketDBO[]): Promise<TicketDBO[]> {
        try {
            await this.dbConnection.db.tx((tx) => {
                const insertQueries = ticket.map(t => tx.none("INSERT INTO ticket (ticketId, fk_orderId, weight) VALUES (?, ?, ?)", [t.ticketId, t.fk_orderId, t.weight]));
                tx.batch(insertQueries);
            });
            return this.getTicketsForOrder(ticket[0].fk_orderId);
        } catch (error) {
            return [];
        }
    }

    public async getTicketsForOrder(orderId: string): Promise<TicketDBO[]> {
        return await this.dbConnection.db.manyOrNone("SELECT * FROM ticket WHERE fk_orderId = ?", [orderId]);
    }

}