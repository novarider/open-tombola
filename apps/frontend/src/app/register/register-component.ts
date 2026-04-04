import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { form, Field, required, SchemaPathTree, min, applyEach } from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { Ticket, TicketOrder } from '@novarider/open-tombola/models';
import { environment } from '../../environments/environment';

function TicketSchema(item: SchemaPathTree<Ticket>) {
  required(item.weight, { message: 'Gewicht ist erforderlich' });
  min(item.weight, 1, { message: 'Gewicht muss mindestens 0.001 kg sein' });
}

@Component({
  imports: [RouterModule, Field],
  selector: 'app-register-component',
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private router: Router = inject(Router);
  private httpClient: HttpClient = inject(HttpClient);

  public registerFormModel = signal<TicketOrder>({
    firstName: '',
    lastName: '',

    street: '',
    addressLine2: '',
    postalCode: '',
    city: '',
    country: '',
    phonenumber: '',

    tickets: [
      { weight: '' },
    ],
  });

  public registerForm = form(this.registerFormModel, (schemaPath) => {
    required(schemaPath.firstName, { message: 'Bitte geben Sie Ihren Vornamen ein' });
    required(schemaPath.lastName, { message: 'Bitte geben Sie Ihren Nachnamen ein' });

    required(schemaPath.street, { message: 'Bitte geben Sie Ihre Straße und Hausnummer ein' });
    required(schemaPath.postalCode, { message: 'Bitte geben Sie Ihre Postleitzahl ein' });
    required(schemaPath.city, { message: 'Bitte geben Sie Ihren Wohnort ein' });
    required(schemaPath.country, { message: 'Bitte geben Sie Ihr Heimatland ein' });
    required(schemaPath.phonenumber, { message: 'Bitte geben Sie Ihre Telefonnummer ein' });

    applyEach(schemaPath.tickets, TicketSchema);
  });

  public async onSubmit(event: Event): Promise<void> {
    // prevent default form navigation
    event.preventDefault();

    if (this.registerForm().valid()) {
      const api_url = environment.API_URL;
      this.httpClient.post<{ paymentUrl: string }>(`${api_url}/checkout/create`, this.registerForm().value()).subscribe(async (response) => {
        window.location.href = response.paymentUrl;
      });
    } else {
      // todo show error
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
