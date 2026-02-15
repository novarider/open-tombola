import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-successfull',
  imports: [],
  templateUrl: './payment-successfull.html',
  styleUrl: './payment-successfull.css',
})
export class PaymentSuccessfull implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const orderId = params['orderId'];

      this.httpClient.post<void>('http://localhost:3333/checkout/confirmPayment', { orderId: orderId }).subscribe(() => {
        // nothing to do here
      });
    });
  }
}
