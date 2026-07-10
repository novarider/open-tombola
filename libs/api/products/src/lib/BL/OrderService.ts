import { Stripe } from 'stripe';
import Container, { Inject, Service } from "typedi";
import { IOrderRepository } from "../DAL/IOrderRepository";
import { OrderRepository } from "../DAL/OrderRepository";
import { CheckoutDBO, OrderDBO, TicketOrder, TicketOrderBase } from "@novarider/open-tombola/models";
import { ITicketRepository } from "../DAL/ITicketOrder";
import { v7 as uuid } from "uuid";
import { TicketRepository } from "../DAL/TicketRepository";
import { ICheckoutsRepository } from '../DAL/ICheckoutsRepository';
import { CheckoutRepository } from '../DAL/CheckoutRepository';
import { STRIPE_API_KEY, STRIPE_PRICE_ID, FRONTEND_BASE_URL } from '../env';

@Service()
export class OrderService {
    @Inject(() => OrderRepository)
    private orderRepository!: IOrderRepository;

    @Inject(() => TicketRepository)
    private ticketRepository!: ITicketRepository;

    @Inject(() => CheckoutRepository)
    private checkoutsRepository!: ICheckoutsRepository;

    private stripe = new Stripe(Container.get(STRIPE_API_KEY));
    private ticketPriceId: string = Container.get(STRIPE_PRICE_ID);
    private baseUrl: string = Container.get(FRONTEND_BASE_URL);

    public async saveOrderWithTickets(ticktetOrder: TicketOrder): Promise<OrderDBO> {
        const order = await this.saveOrder(ticktetOrder);
        await this.ticketRepository.saveTickets(ticktetOrder.tickets.map(t => ({ fk_orderid: order.orderid, ticketid: uuid(), weight: Number.parseFloat(t.weight) })));
        console.debug(`Saved Tickets for Order ${order.orderid}...`);
        return order;
    }

    public async saveOrder(offlineOrder: TicketOrderBase): Promise<OrderDBO> {
        const order = await this.orderRepository.saveOrder({
            orderid: uuid(),
            createdat: new Date(Date.now()),
            firstname: offlineOrder.firstName,
            lastname: offlineOrder.lastName,
            street: offlineOrder.street,
            addressline2: offlineOrder.addressLine2,
            postalcode: offlineOrder.postalCode,
            city: offlineOrder.city,
            country: offlineOrder.country
        });
        console.debug(`Saved Order ${order.orderid}...`);
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
        await this.updateOrderCheckoutStatus(orderId, session.status ?? 'open');
        if (session.status !== 'complete') {
            throw new Error(`Payment for order ${orderId} not completed yet.`);
        } else {
            await this.checkoutsRepository.markCheckoutComplete(orderId);
        }
    }

    public async createPaymentSession(amount: number, orderId: string): Promise<Stripe.Response<Stripe.Checkout.Session>> {
        return await this.stripe.checkout.sessions.create({
            line_items: [{
                price: this.ticketPriceId,
                quantity: amount,
            }],
            mode: 'payment',
            success_url: `${this.baseUrl}/checkout/success?orderId=${orderId}`,
            cancel_url: `${this.baseUrl}/checkout/cancel`,
        });
    }
}