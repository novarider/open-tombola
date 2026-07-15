import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { form, Field, applyEach, apply } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { Ticket, TicketOrder, TicketOrderBase } from '@novarider/open-tombola/models';
import { CheckoutService } from '../checkout.service';
import { PersonalDataFormComponent, personalDataSchema } from '../personal-data-form/personal-data-form';
import { TicketFormComponent, ticketSchema } from "../tickets-form/tickets-form";

interface FormDto {
  personalData: TicketOrderBase;
  tickets: Ticket[];
}

@Component({
  imports: [RouterModule, Field, PersonalDataFormComponent, TicketFormComponent],
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
    apply(schemaPath.personalData, personalDataSchema);
    applyEach(schemaPath.tickets, ticketSchema);
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

  public addEmptyTickets(amount: number) {
    this.registerForm.tickets().value.update((value) =>
      value = [
        ...value,
        ...Array.from({ length: amount }).map(() => ({ weight: '' }))
      ]
    );
  }

  public focusInput(event: Event): void {
    (event.target as HTMLElement).querySelector('input')?.focus();
  }
}
