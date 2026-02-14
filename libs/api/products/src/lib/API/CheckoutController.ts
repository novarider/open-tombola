import { Stripe } from 'stripe';
import { Request, Application } from 'express';
import Container, { Inject, Service } from 'typedi';
import { OrderRepository } from '../DAL/OrderRepository';
import { Ticket, TicketOrder } from '@novarider/open-tombola/models';
import { OrderService } from '../BL/OrderService';

interface CheckoutCreateRequest extends Request {
    body: TicketOrder
}

interface ConfirmPaymentRequest extends Request {
    body: {
        orderId: string;
    }
}

@Service()
export class CheckoutController {
    @Inject('app')
    private app: Application;

    @Inject(() => OrderService)
    private orderService: OrderService;

    private stripe = new Stripe(Container.get('stripe-api-key'));

    public registerRoutes() {
        this.app.post('/checkout/create', async (req: CheckoutCreateRequest, res) => {
            try {
                const order = await this.orderService.saveOrder(req.body);

                const quantity = req.body.tickets.length;

                const session = await this.createPaymentSession(quantity, order.orderId);

                return res.json({
                    paymentUrl: session.url
                });
            } catch (error) {
                res.status(500).send();
            }
        });

        this.app.post('/checkout/confirmPayment', async (req: ConfirmPaymentRequest, res) => {
            try {
                await this.orderService.updateOrdersPaymentStatus(req.body.orderId, true);
                res.status(200).send();
            } catch (error) {
                res.status(500).send();
            }
        });
    }

    private async createPaymentSession(amount: number, orderId: string): Promise<Stripe.Response<Stripe.Checkout.Session>> {
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