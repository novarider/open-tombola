import { TicketOrder, OrderDBO } from "@novarider/open-tombola/models";
import { IOrderRepository } from "./IOrderRepository";
import { Inject, Service } from "typedi";
import { DBConnection } from "./DBConnection";

@Service()
export class OrderRepository implements IOrderRepository {
    @Inject(() => DBConnection)
    private dbConnection: DBConnection;

    public async saveOrder(ticketOrder: OrderDBO): Promise<OrderDBO> {
        try {
            return await this.dbConnection.dbOpenTombola.query(`INSERT INTO orders (
                    orderId, 
                    firstName, 
                    lastName, 
                    street, 
                    addressLine2, 
                    postalCode, 
                    city, 
                    country, 
                    createdAt, 
                    payedAt
                ) VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10
                )`, [
                ticketOrder.orderId,
                ticketOrder.firstName,
                ticketOrder.lastName,
                ticketOrder.street,
                ticketOrder.addressLine2,
                ticketOrder.postalCode,
                ticketOrder.city,
                ticketOrder.country,
                ticketOrder.createdAt,
                ticketOrder.payedAt,
            ]);
        } catch (error) {
            console.error("Error saving order:", error);
        }
    }

    public async updateOrder(updatedOrder: OrderDBO): Promise<OrderDBO> {
        throw new Error("Method not implemented.");
    }

    public async getOrders(): Promise<OrderDBO[]> {
        throw new Error("Method not implemented.");
    }

    public async getOrder(orderId: string): Promise<OrderDBO> {
        return await this.dbConnection.dbOpenTombola.query("SELECT * FROM `order` WHERE orderId = ?", [orderId]);
    }
}