import { Inject, Service } from "typedi";
import { IOrderRepository } from "../DAL/IOrderRepository";
import { OrderRepository } from "../DAL/OrderRepository";
import { OrderDBO, TicketOrder } from "@novarider/open-tombola/models";
import { ITicketRepository } from "../DAL/ITicketOrder";
import { v7 as uuid } from "uuid";
import { TicketRepository } from "../DAL/TicketRepository";

@Service()
export class OrderService {
    @Inject(() => OrderRepository)
    private orderRepository: IOrderRepository;

    @Inject(() => TicketRepository)
    private ticketRepository: ITicketRepository;

    public async saveOrder(ticktetOrder: TicketOrder): Promise<OrderDBO> {
        const order = await this.orderRepository.saveOrder(ticktetOrder)
        this.ticketRepository.saveTickets(ticktetOrder.tickets.map(t => ({ fk_orderId: order.orderId, ticketId: uuid(), weight: Number.parseFloat(t.weight) })));
        return order;
    }

    public async updateOrdersPaymentStatus(orderId: string, isPaid: boolean): Promise<OrderDBO> {
        const order = await this.orderRepository.getOrder(orderId);
        return this.orderRepository.updateOrder({
            ...order,
            payedAt: isPaid ? new Date(Date.now()) : null
        })
    }
}