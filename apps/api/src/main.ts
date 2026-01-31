import express from 'express';
import { ProductsService } from '@org/api/products';
import { Stripe } from 'stripe';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;
const stripeApiKey = process.env.API_KEY_STRIPE ? process.env.API_KEY_STRIPE : '';

const app = express();
const stripe = new Stripe(stripeApiKey);
const productsService = new ProductsService();

// Middleware
app.use(express.json());

// CORS configuration for Angular app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.send({ message: 'open-tombola v0.0.1' });
});

interface CheckoutCreateRequest extends express.Request {
  body: {
    tickets: { weight: number }[];
  };
}

app.post('/checkout/create', async (req: CheckoutCreateRequest, res) => {
  // todo pre save created tickets and a order id

  const quantity = req.body.tickets.length;

  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price: 'price_1Svi0kA2DLsR0rymvypQGdBZ',
      quantity: quantity,
    }],
    mode: 'payment',
    success_url: 'http://localhost:4200/checkout/success',
    cancel_url: 'http://localhost:4200/checkout/cancel',
  });

  return res.json({
    paymentUrl: session.url
  });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
