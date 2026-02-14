import { TicketOrder, OrderDBO } from "@novarider/open-tombola/models";
import { IOrderRepository } from "./IOrderRepository";
import { Inject, Service } from "typedi";
import { DBConnection } from "./DBConnection";

@Service()
export class OrderRepository implements IOrderRepository {
    @Inject(() => DBConnection)
    private dbConnection: DBConnection;

    public async saveOrder(ticketOrder: TicketOrder): Promise<OrderDBO> {
        return await this.dbConnection.db.query("INSERT INTO `order` (firstName, lastName, street, addressLine2, postalCode, city, country) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            ticketOrder.firstName,
            ticketOrder.lastName,
            ticketOrder.street,
            ticketOrder.addressLine2,
            ticketOrder.postalCode,
            ticketOrder.city,
            ticketOrder.country
        ]);
    }

    public async updateOrder(updatedOrder: OrderDBO): Promise<OrderDBO> {
        throw new Error("Method not implemented.");
    }

    public async getOrders(): Promise<OrderDBO[]> {
        throw new Error("Method not implemented.");
    }

    public async getOrder(orderId: string): Promise<OrderDBO> {
        return await this.dbConnection.db.query("SELECT * FROM `order` WHERE orderId = ?", [orderId]);
    }
}