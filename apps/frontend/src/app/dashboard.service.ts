import { Injectable, ResourceRef, Signal } from "@angular/core";
import { environment } from "../environments/environment";
import { httpResource } from "@angular/common/http";
import { OrderDBO, TicketDBO } from "@novarider/open-tombola/models";

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private API_URL: string = environment.API_URL;

    public orderResource: (authorization: Signal<string>) => ResourceRef<OrderDBO[] | undefined> =
        (authorization: Signal<string>) => httpResource(() => ({
            url: `${this.API_URL}/tombola/orders`,
            method: 'GET',
            headers: {
                Authorization: btoa(authorization())
            }
        }));

    public orderCountResource: (authorization: Signal<string>) => ResourceRef<{ count: number } | undefined> =
        (authorization: Signal<string>) => httpResource(() => ({
            url: `${this.API_URL}/tombola/orders/count`,
            method: 'GET',
            headers: {
                Authorization: btoa(authorization())
            }
        }));

    public ticketResource: (authorization: Signal<string>) => ResourceRef<TicketDBO[] | undefined> =
        (authorization: Signal<string>) => httpResource(() => ({
            url: `${this.API_URL}/tombola/tickets`,
            method: 'GET',
            headers: {
                Authorization: btoa(authorization())
            }
        }));

    public ticketCountResource: (authorization: Signal<string>) => ResourceRef<{ count: number } | undefined> =
        (authorization: Signal<string>) => httpResource(() => ({
            url: `${this.API_URL}/tombola/tickets/count`,
            method: 'GET',
            headers: {
                Authorization: btoa(authorization())
            }
        }));
}