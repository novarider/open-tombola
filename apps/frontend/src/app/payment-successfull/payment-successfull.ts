import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-payment-successfull',
  imports: [],
  templateUrl: './payment-successfull.html',
  styleUrl: './payment-successfull.css',
})
export class PaymentSuccessfull implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private checkoutService: CheckoutService = inject(CheckoutService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  protected orderId = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.orderId.set(params['orderId']);

      const orderId = this.orderId();
      if (orderId !== undefined) {
        this.checkoutService.confirmPayment(orderId).subscribe(() => {
          // nothing to do here
        });
      }
    });
  }
}
