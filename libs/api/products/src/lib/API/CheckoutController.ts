import { Request, Application } from 'express';
import { Inject, Service } from 'typedi';
import { TicketOrder } from '@novarider/open-tombola/models';
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

    public registerRoutes() {
        this.app.post('/checkout/create', async (req: CheckoutCreateRequest, res) => {
            try {
                const order = await this.orderService.saveOrder(req.body);

                const quantity = req.body.tickets.length;

                const session = await this.orderService.createPaymentSession(quantity, order.orderid);

                await this.orderService.saveOrderPaymentReference(order.orderid, session.id);

                return res.json({
                    paymentUrl: session.url
                });
            } catch (error) {
                console.error("Error creating checkout session:", error);
                res.status(500).send(error);
            }
        });

        this.app.post('/checkout/confirmPayment', async (req: ConfirmPaymentRequest, res) => {
            try {
                console.debug(JSON.stringify(req.body));
                await this.orderService.checkCheckoutStatusForOrder(req.body.orderId);
                res.status(200).send();
            } catch (error) {
                console.error("Error confirming payment:", error);
                res.status(500).send();
            }
        });
    }
}