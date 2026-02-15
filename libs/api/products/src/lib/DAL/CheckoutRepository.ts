import { CheckoutDBO } from "@novarider/open-tombola/models";
import { Inject, Service } from "typedi";
import { DBConnection } from "./DBConnection";
import { ICheckoutsRepository } from "./ICheckoutsRepository";
import Stripe from "stripe";

@Service()
export class CheckoutRepository implements ICheckoutsRepository {
    @Inject(() => DBConnection)
    private dbConnection: DBConnection;

    public async saveCheckout(orderId: string, paymentReference: string): Promise<CheckoutDBO> {
        try {
            return await this.dbConnection.dbOpenTombola.one<CheckoutDBO>(`INSERT INTO checkouts (
                    fk_orderid, 
                    paymentreference
                ) VALUES (
                    $1, $2
                ) RETURNING *`, [orderId, paymentReference]);
        } catch (error) {
            console.error("Error saving checkout:", error);
        }
    }

    public async updateCheckoutStatus(orderId: string, status: Stripe.Checkout.Session.Status): Promise<CheckoutDBO> {
        try {
            return await this.dbConnection.dbOpenTombola.one<CheckoutDBO>(`UPDATE checkouts SET 
                checkoutstatus = $2
            WHERE fk_orderid = $1 RETURNING *`, [
                orderId,
                status
            ]);
        } catch (error) {
            console.error("Error updating checkout status:", error);
        }
    }

    public async markCheckoutComplete(orderId: string): Promise<CheckoutDBO> {
        try {
            return await this.dbConnection.dbOpenTombola.one<CheckoutDBO>(`UPDATE checkouts SET 
                checkoutdoneat = $2
            WHERE fk_orderid = $1 RETURNING *`, [
                orderId,
                new Date(Date.now())
            ]);
        } catch (error) {
            console.error("Error updating checkoutdoneat:", error);
        }
    }

    public async getCheckoutForOrder(orderId: string): Promise<CheckoutDBO> {
        return await this.dbConnection.dbOpenTombola.one<CheckoutDBO>("SELECT * FROM checkouts WHERE fk_orderid = $1", [orderId]);
    }

}