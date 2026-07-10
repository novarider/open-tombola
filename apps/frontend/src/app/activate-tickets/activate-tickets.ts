import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { QrScanner } from "../qr-scanner/qr-scanner";
import { QrService } from '../qr-service';
import { PersonalDataFormComponent } from "../personal-data-form/personal-data-form";
import { ActivationOrder, TicketOrderBase } from '@novarider/open-tombola/models';
import { form, Field } from '@angular/forms/signals';
import { CheckoutService } from '../checkout.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { validate as isValidUUID } from 'uuid';

/**
 * scanning works so far, also with url validation
 * 
 * todo
 * - add opening page with a ticket id in query parameter must add this id as well
 * - add multiple tickets to page with one scan
 * - add error handling + message for users which deny camera access (fix button possible button switching without message)
 */

interface FormDto {
  personalData: TicketOrderBase;
}

@Component({
  selector: 'app-activate-tickets',
  imports: [Field, QrScanner, PersonalDataFormComponent],
  templateUrl: './activate-tickets.html',
  styleUrl: './activate-tickets.css',
})
export class ActivateTickets implements OnInit {
  public showScanner: WritableSignal<boolean> = signal(false);
  public showScanningError: WritableSignal<boolean> = signal(false);
  private qrService: QrService = inject(QrService);
  private checkoutService = inject(CheckoutService);
  private route = inject(ActivatedRoute);

  public ticketIds: Set<string> = new Set<string>();

  public startScanning() {
    this.showScanningError.set(false);
    this.showScanner.set(true);
  }

  public ngOnInit(): void {
    const initialTicketId = this.route.snapshot.queryParamMap.get('ticketId');
    if (initialTicketId && isValidUUID(initialTicketId)) {
      this.ticketIds.add(initialTicketId);
    }

    this.qrService.onSuccessfullScan.subscribe((qrCode?: string) => {
      if (qrCode) {
        this.showScanner.set(false);
        this.ticketIds.add(qrCode);
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
  });

  public activateForm = form<FormDto>(this.activateFormModel);

  public submitTickets() {
    if (this.activateForm().valid()) {
      const personalData = this.activateForm().value().personalData;
      const data: ActivationOrder = {
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        street: personalData.street,
        addressLine2: personalData.addressLine2,
        postalCode: personalData.postalCode,
        city: personalData.city,
        country: personalData.city,
        phonenumber: personalData.phonenumber,

        offlineTickets: Array.from(this.ticketIds).map(t => ({ ticketId: t, weight: '0' })), // todo add weight to submitted information
      };

      console.log(data);

      const result = this.checkoutService.createOfflineCheckout(data);

      if (result.error()) {
        // todo show information to user why order could not be saved (without leaking data)
      } else {
        // todo navigate to success page
      }
    }
  }
}
