import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { ActivationOrder, OrderActivationFailed, OrderActivationSucceeded, TicketOrder } from "@novarider/open-tombola/models";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class CheckoutService {
    private httpClient: HttpClient = inject(HttpClient);
    private API_URL: string = environment.API_URL;

    public createCheckout(data: TicketOrder): Observable<{ paymentUrl: string }> {
        return this.httpClient.post<{ paymentUrl: string }>(`${this.API_URL}/checkout/create`, data);
    }

    public confirmPayment(orderId: string): Observable<void> {
        return this.httpClient.post<void>(`${this.API_URL}/checkout/confirmPayment`, { orderId: orderId });
    }

    public createOfflineCheckout(data: ActivationOrder): Observable<OrderActivationSucceeded | OrderActivationFailed | undefined> {
        return this.httpClient.post<OrderActivationSucceeded | OrderActivationFailed>(`${this.API_URL}/tickets/offline/activate`, data)
    }
}