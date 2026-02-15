import { CheckoutDBO } from "@novarider/open-tombola/models";
import Stripe from "stripe";

export interface ICheckoutsRepository {
    markCheckoutComplete(orderId: string): Promise<CheckoutDBO>;
    saveCheckout(orderId: string, paymentReference: string): Promise<CheckoutDBO>;
    updateCheckoutStatus(orderId: string, status: Stripe.Checkout.Session.Status): Promise<CheckoutDBO>;
    getCheckoutForOrder(orderId: string): Promise<CheckoutDBO>;
}