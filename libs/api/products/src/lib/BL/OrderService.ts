import { Stripe } from 'stripe';
import Container, { Inject, Service } from "typedi";
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

    private stripe = new Stripe(Container.get('stripe-api-key'));

    public async saveOrder(ticktetOrder: TicketOrder): Promise<OrderDBO> {
        const order = await this.orderRepository.saveOrder({
            orderid: uuid(),
            createdat: new Date(Date.now()),
            checkoutdoneat: null,
            paymentreference: null,
            firstname: ticktetOrder.firstName,
            lastname: ticktetOrder.lastName,
            street: ticktetOrder.street,
            addressline2: ticktetOrder.addressLine2,
            postalcode: ticktetOrder.postalCode,
            city: ticktetOrder.city,
            country: ticktetOrder.country
        });
        console.debug(`Saved Order ${order.orderid}...`);
        await this.ticketRepository.saveTickets(ticktetOrder.tickets.map(t => ({ fk_orderId: order.orderid, ticketId: uuid(), weight: Number.parseFloat(t.weight) })));
        console.debug(`Saved Tickets for Order ${order.orderid}...`);
        return order;
    }

    public async updateOrdersPaymentStatus(orderId: string, checkoutDoneAt: boolean): Promise<OrderDBO> {
        const order = await this.orderRepository.getOrder(orderId);
        console.debug(`Updating Order ${order.orderid} with payment status ${checkoutDoneAt}...`);
        return this.orderRepository.updateOrder({
            ...order,
            checkoutdoneat: checkoutDoneAt ? new Date(Date.now()) : null
        })
    }

    public async saveOrderPaymentReference(orderId: string, sessionId: string): Promise<OrderDBO> {
        const order = await this.orderRepository.getOrder(orderId);
        return this.orderRepository.updateOrder({
            ...order,
            paymentreference: sessionId
        })

    }

    public async checkCheckoutStatusForOrder(orderId: string): Promise<void> {
        const order = await this.orderRepository.getOrder(orderId);
        const session = await this.stripe.checkout.sessions.retrieve(order.paymentreference);
        if (session.status !== 'complete') {
            throw new Error(`Payment for order ${orderId} not completed yet.`);
        } else {
            await this.updateOrdersPaymentStatus(orderId, true);
        }
    }

    public async createPaymentSession(amount: number, orderId: string): Promise<Stripe.Response<Stripe.Checkout.Session>> {
        return await this.stripe.checkout.sessions.create({
            line_items: [{
                price: 'price_1Svi0kA2DLsR0rymvypQGdBZ',
                quantity: amount,
            }],
            mode: 'payment',
            success_url: `http://localhost:4200/checkout/success?orderId=${orderId}`,
            cancel_url: 'http://localhost:4200/checkout/cancel',
        });
    }
}