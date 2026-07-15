import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activation-successfull',
  imports: [],
  templateUrl: './activation-successfull.html',
  styleUrl: './activation-successfull.css',
})
export class ActivationSuccessfull implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private destroyRef: DestroyRef = inject(DestroyRef);

  protected orderId = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.orderId.set(params['orderId']);
    });
  }
}
