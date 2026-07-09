import { OrderDBO } from "@novarider/open-tombola/models";

export interface IOrderRepository {
    saveOrder(ticketOrder: OrderDBO): Promise<OrderDBO>;
    updateOrder(updatedOrder: OrderDBO): Promise<OrderDBO>;
    getOrders(): Promise<OrderDBO[]>;
    getOrdersCount(): Promise<number>;
    getOrder(orderId: string): Promise<OrderDBO>;
}