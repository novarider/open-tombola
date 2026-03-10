import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-payment-successfull',
  imports: [],
  templateUrl: './payment-successfull.html',
  styleUrl: './payment-successfull.css',
})
export class PaymentSuccessfull implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private httpClient: HttpClient = inject(HttpClient);

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const orderId = params['orderId'];

      const api_url = environment.API_URL;
      this.httpClient.post<void>(`${api_url}/checkout/confirmPayment`, { orderId: orderId }).subscribe(() => {
        // nothing to do here
      });
    });
  }
}
