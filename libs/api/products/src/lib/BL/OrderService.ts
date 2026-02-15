import { Stripe } from 'stripe';
import Container, { Inject, Service } from "typedi";
import { IOrderRepository } from "../DAL/IOrderRepository";
import { OrderRepository } from "../DAL/OrderRepository";
import { CheckoutDBO, OrderDBO, TicketOrder } from "@novarider/open-tombola/models";
import { ITicketRepository } from "../DAL/ITicketOrder";
import { v7 as uuid } from "uuid";
import { TicketRepository } from "../DAL/TicketRepository";
import { ICheckoutsRepository } from '../DAL/ICheckoutsRepository';
import { CheckoutRepository } from '../DAL/CheckoutRepository';

@Service()
export class OrderService {
    @Inject(() => OrderRepository)
    private orderRepository: IOrderRepository;

    @Inject(() => TicketRepository)
    private ticketRepository: ITicketRepository;

    @Inject(() => CheckoutRepository)
    private checkoutsRepository: ICheckoutsRepository;

    private stripe = new Stripe(Container.get('stripe-api-key'));

    public async saveOrder(ticktetOrder: TicketOrder): Promise<OrderDBO> {
        const order = await this.orderRepository.saveOrder({
            orderid: uuid(),
            createdat: new Date(Date.now()),
            firstname: ticktetOrder.firstName,
            lastname: ticktetOrder.lastName,
            street: ticktetOrder.street,
            addressline2: ticktetOrder.addressLine2,
            postalcode: ticktetOrder.postalCode,
            city: ticktetOrder.city,
            country: ticktetOrder.country
        });
        console.debug(`Saved Order ${order.orderid}...`);
        await this.ticketRepository.saveTickets(ticktetOrder.tickets.map(t => ({ fk_orderid: order.orderid, ticketid: uuid(), weight: Number.parseFloat(t.weight) })));
        console.debug(`Saved Tickets for Order ${order.orderid}...`);
        return order;
    }

    public async updateOrderCheckoutStatus(orderId: string, status: Stripe.Checkout.Session.Status): Promise<CheckoutDBO> {
        const order = await this.orderRepository.getOrder(orderId);
        return this.checkoutsRepository.updateCheckoutStatus(order.orderid, status);
    }

    public async saveOrderPaymentReference(orderId: string, sessionId: string): Promise<CheckoutDBO> {
        const order = await this.orderRepository.getOrder(orderId);
        return this.checkoutsRepository.saveCheckout(order.orderid, sessionId);

    }

    public async checkCheckoutStatusForOrder(orderId: string): Promise<void> {
        const checkout = await this.checkoutsRepository.getCheckoutForOrder(orderId);
        const session = await this.stripe.checkout.sessions.retrieve(checkout.paymentreference);
        await this.updateOrderCheckoutStatus(orderId, session.status);
        if (session.status !== 'complete') {
            throw new Error(`Payment for order ${orderId} not completed yet.`);
        } else {
            await this.checkoutsRepository.markCheckoutComplete(orderId);
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