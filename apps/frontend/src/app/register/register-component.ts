import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { form, Field, required, SchemaPathTree, min, applyEach, pattern } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { Ticket, TicketOrder, TicketOrderBase } from '@novarider/open-tombola/models';
import { TicketNumberFormatDirective } from '../ticket-number-format.directive';
import { CheckoutService } from '../checkout.service';
import { PersonalDataFormComponent } from '../personal-data-form/personal-data-form';

function TicketSchema(item: SchemaPathTree<Ticket>) {
  required(item.weight, { message: 'Ein Tipp ist erforderlich' });
  min(item.weight, 1, { message: 'Ein Tipp muss mindestens 0.001 kg sein' });
  pattern(item.weight, /^[-]*\d*([.,]\d{0,3})?$/, { message: 'Ein Tipp muss eine Zahl mit maximal drei Nachkommastellen sein' });
}

interface FormDto {
  personalData: TicketOrderBase;
  tickets: Ticket[];
}

@Component({
  imports: [RouterModule, Field, TicketNumberFormatDirective, PersonalDataFormComponent],
  selector: 'app-register-component',
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private checkoutService: CheckoutService = inject(CheckoutService);

  public registerFormModel = signal<FormDto>({
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

    tickets: [
      { weight: '' },
    ],
  });

  public registerForm = form<FormDto>(this.registerFormModel, (schemaPath) => {
    required(schemaPath.personalData.firstName, { message: 'Bitte geben Sie Ihren Vornamen ein' });
    required(schemaPath.personalData.lastName, { message: 'Bitte geben Sie Ihren Nachnamen ein' });

    required(schemaPath.personalData.street, { message: 'Bitte geben Sie Ihre Straße und Hausnummer ein' });
    required(schemaPath.personalData.postalCode, { message: 'Bitte geben Sie Ihre Postleitzahl ein' });
    required(schemaPath.personalData.city, { message: 'Bitte geben Sie Ihren Wohnort ein' });
    required(schemaPath.personalData.country, { message: 'Bitte geben Sie Ihr Heimatland ein' });
    required(schemaPath.personalData.phonenumber, { message: 'Bitte geben Sie Ihre Telefonnummer ein' });

    applyEach(schemaPath.tickets, TicketSchema);
  });

  public async onSubmit(event: Event): Promise<void> {
    // prevent default form navigation
    event.preventDefault();

    if (this.registerForm().valid()) {
      const orderData: TicketOrder = {
        ...this.registerForm.personalData().value(),
        tickets: this.registerForm.tickets().value(),
      };

      this.checkoutService.createCheckout(orderData).subscribe(async (response) => {
        window.location.href = response.paymentUrl;
      });
    } else {
      // todo show error ???
    }
  }

  public addTickets(amount = 1): void {
    this.registerFormModel.update((value) => ({
      ...value,
      tickets: [...value.tickets, ...Array.from({ length: amount }).map(() => ({ weight: '' }))]
    }));
  }

  public removeTicket(index: number, event: Event): void {
    event.stopPropagation();
    this.registerFormModel.update((value) => ({
      ...value,
      tickets: value.tickets.filter((_, i) => i !== index),
    }));
  }

  public focusInput(event: Event): void {
    (event.target as HTMLElement).querySelector('input')?.focus();
  }
}
