import { OrderDBO, TicketOrder } from "@novarider/open-tombola/models";

export interface IOrderRepository {
    saveOrder(ticketOrder: TicketOrder): Promise<OrderDBO>;
    updateOrder(updatedOrder: OrderDBO): Promise<OrderDBO>;
    getOrders(): Promise<OrderDBO[]>;
    getOrder(orderId: string): Promise<OrderDBO>;
}