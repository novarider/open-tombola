import { Stripe } from 'stripe';
import { Request, Application } from 'express';
import Container, { Inject, Service } from 'typedi';

interface CheckoutCreateRequest extends Request {
    body: {
        tickets: { weight: number }[];
    };
}

@Service()
export class CheckoutController {
    @Inject('app')
    private app: Application;

    private stripe = new Stripe(Container.get('stripe-api-key'));

    public registerRoutes() {
        this.app.post('/checkout/create', async (req: CheckoutCreateRequest, res) => {
            // todo pre save created tickets and a order id

            const quantity = req.body.tickets.length;

            const session = await this.create(quantity);

            return res.json({
                paymentUrl: session.url
            });
        });
    }

    private async create(amount: number): Promise<Stripe.Response<Stripe.Checkout.Session>> {
        return await this.stripe.checkout.sessions.create({
            line_items: [{
                price: 'price_1Svi0kA2DLsR0rymvypQGdBZ',
                quantity: amount,
            }],
            mode: 'payment',
            success_url: 'http://localhost:4200/checkout/success',
            cancel_url: 'http://localhost:4200/checkout/cancel',
        });
    }
}