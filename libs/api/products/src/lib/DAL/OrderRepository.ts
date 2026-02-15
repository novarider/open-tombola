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
                    createdAt, 
                    checkoutdoneat,
                    paymentreference
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
                    $10,
                    $11
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
                ticketOrder.checkoutdoneat,
                ticketOrder.paymentreference
            ]);
        } catch (error) {
            console.error("Error saving order:", error);
        }
    }

    public async updateOrder(updatedOrder: OrderDBO): Promise<OrderDBO> {
        try {
            return await this.dbConnection.dbOpenTombola.one<OrderDBO>(`UPDATE orders SET 
                firstName = $1,
                lastName = $2,
                street = $3,
                addressLine2 = $4,
                postalCode = $5,
                city = $6,
                country = $7,
                checkoutdoneat = $8,
                paymentreference = $9
            WHERE orderId = $10 RETURNING *`, [
                updatedOrder.firstname,
                updatedOrder.lastname,
                updatedOrder.street,
                updatedOrder.addressline2,
                updatedOrder.postalcode,
                updatedOrder.city,
                updatedOrder.country,
                updatedOrder.checkoutdoneat,
                updatedOrder.paymentreference,
                updatedOrder.orderid
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