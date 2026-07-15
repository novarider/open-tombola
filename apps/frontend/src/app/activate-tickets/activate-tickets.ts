import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { QrScanner } from "../qr-scanner/qr-scanner";
import { QrService } from '../qr-service';
import { PersonalDataFormComponent, personalDataSchema } from "../personal-data-form/personal-data-form";
import { ActivationOrder, OrderActivationSucceeded, TicketOptionalActivationCode, TicketOrderBase } from '@novarider/open-tombola/models';
import { form, Field, applyEach, apply, minLength } from '@angular/forms/signals';
import { CheckoutService } from '../checkout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { validate as isValidUUID } from 'uuid';
import { TicketFormComponent, ticketSchema } from "../tickets-form/tickets-form";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface FormDto {
  personalData: TicketOrderBase;
  tickets: TicketOptionalActivationCode[];
}

@Component({
  selector: 'app-activate-tickets',
  imports: [Field, QrScanner, PersonalDataFormComponent, TicketFormComponent],
  templateUrl: './activate-tickets.html',
  styleUrl: './activate-tickets.css',
})
export class ActivateTickets implements OnInit {
  public showScanner: WritableSignal<boolean> = signal(false);
  public showScanningError: WritableSignal<boolean> = signal(false);
  public errorResponse: WritableSignal<boolean> = signal(false);
  private qrService: QrService = inject(QrService);
  private checkoutService = inject(CheckoutService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);


  public startScanning() {
    this.showScanningError.set(false);
    this.showScanner.set(true);
  }

  private isActivationCodeAlreadyPresent(activationCode: string): boolean {
    return this.activateForm.tickets().value().findIndex(t => t.activationCode === activationCode) !== -1;
  }

  public ngOnInit(): void {
    const initialActivationCode = this.route.snapshot.queryParamMap.get('code');
    if (initialActivationCode && initialActivationCode.length === 6) {
      this.activateForm.tickets().value.update(v =>
        [...v, { activationCode: initialActivationCode, weight: '' }]
      );
    }

    this.qrService.onSuccessfullScan.subscribe((activationCode?: string) => {
      if (activationCode) {
        this.showScanner.set(false);
        if (!this.isActivationCodeAlreadyPresent(activationCode)) {
          this.activateForm.tickets().value.update(v =>
            [...v, { activationCode: activationCode, weight: '' }]
          );
        }
      }
    });

    this.qrService.onInvalidDataIdentified.subscribe((qrCode?: string) => {
      console.log(qrCode);
      if (qrCode) {
        this.showScanner.set(false);
        this.showScanningError.set(true);
      }
    });
  }

  public activateFormModel = signal<FormDto>({
    personalData: {
      firstName: '',
      lastName: '',

      street: '',
      addressLine2: '',
      postalCode: '',
      city: '',
      country: '',
      phonenumber: '',
    },
    tickets: [],
  });

  public activateForm = form<FormDto>(this.activateFormModel, (schemaPath) => {
    apply(schemaPath.personalData, personalDataSchema);
    applyEach(schemaPath.tickets, ticketSchema);
    minLength(schemaPath.tickets, 1)
  });

  public submitTickets() {
    if (this.activateForm().valid()) {
      this.errorResponse.set(false);
      const data: ActivationOrder = {
        ...this.activateForm.personalData().value(),
        offlineTickets: Array.from(this.activateForm.tickets().value())
      };

      this.checkoutService.createOfflineCheckout(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (rsp) => {
          const response: OrderActivationSucceeded = rsp as OrderActivationSucceeded;
          this.router.navigateByUrl(`/checkout/success?orderId=${response?.order?.orderid}`);
        },
        error: (err) => this.errorResponse.set(true),
      })
    }
  }
}
