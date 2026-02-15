import { OrderDBO } from "@novarider/open-tombola/models";
import { IOrderRepository } from "./IOrderRepository";
import { Inject, Service } from "typedi";
import { DBConnection } from "./DBConnection";

@Service()
export class OrderRepository implements IOrderRepository {
    @Inject(() => DBConnection)
    private dbConnection: DBConnection;

    public async saveOrder(ticketOrder: OrderDBO): Promise<OrderDBO> {
        try {
            return await this.dbConnection.dbOpenTombola.one<OrderDBO>(`INSERT INTO orders (
                    orderId, 
                    firstName, 
                    lastName, 
                    street, 
                    addressLine2, 
                    postalCode, 
                    city, 
                    country, 
                    createdAt
                ) VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9
                ) RETURNING *`, [
                ticketOrder.orderid,
                ticketOrder.firstname,
                ticketOrder.lastname,
                ticketOrder.street,
                ticketOrder.addressline2,
                ticketOrder.postalcode,
                ticketOrder.city,
                ticketOrder.country,
                ticketOrder.createdat,
            ]);
        } catch (error) {
            console.error("Error saving order:", error);
        }
    }

    public async updateOrder(updatedOrder: OrderDBO): Promise<OrderDBO> {
        try {
            return await this.dbConnection.dbOpenTombola.one<OrderDBO>(`UPDATE orders SET 
                firstName = $2,
                lastName = $3,
                street = $4,
                addressLine2 = $5,
                postalCode = $6,
                city = $7,
                country = $8
            WHERE orderId = $1 RETURNING *`, [
                updatedOrder.orderid,
                updatedOrder.firstname,
                updatedOrder.lastname,
                updatedOrder.street,
                updatedOrder.addressline2,
                updatedOrder.postalcode,
                updatedOrder.city,
                updatedOrder.country,
            ]);
        } catch (error) {
            console.error("Error updating order:", error);
        }
    }

    public async getOrders(): Promise<OrderDBO[]> {
        return await this.dbConnection.dbOpenTombola.manyOrNone<OrderDBO>("SELECT * FROM orders");
    }

    public async getOrder(orderId: string): Promise<OrderDBO> {
        return await this.dbConnection.dbOpenTombola.one<OrderDBO>("SELECT * FROM orders WHERE orderId = $1", [orderId]);
    }
}