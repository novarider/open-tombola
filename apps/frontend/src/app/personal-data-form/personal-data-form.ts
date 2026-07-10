import { Component, ChangeDetectionStrategy, signal, model, effect } from '@angular/core';
import { form, Field, required, SchemaPathTree, min, pattern, FormValueControl } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { Ticket, TicketOrderBase } from '@novarider/open-tombola/models';
import { NgTemplateOutlet } from '@angular/common';
import { CheckoutService } from '../checkout.service';

function TicketSchema(item: SchemaPathTree<Ticket>) {
  required(item.weight, { message: 'Ein Tipp ist erforderlich' });
  min(item.weight, 1, { message: 'Ein Tipp muss mindestens 0.001 kg sein' });
  pattern(item.weight, /^[-]*\d*([.,]\d{0,3})?$/, { message: 'Ein Tipp muss eine Zahl mit maximal drei Nachkommastellen sein' });
}

@Component({
  imports: [RouterModule, Field, NgTemplateOutlet],
  selector: 'app-personal-data-form',
  templateUrl: './personal-data-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalDataFormComponent implements FormValueControl<TicketOrderBase> {
  public registerFormModel = signal<TicketOrderBase>({
    firstName: '',
    lastName: '',

    street: '',
    addressLine2: '',
    postalCode: '',
    city: '',
    country: '',
    phonenumber: '',
  });

  public registerForm = form(this.registerFormModel, (schemaPath) => {
    required(schemaPath.firstName, { message: 'Bitte geben Sie Ihren Vornamen ein' });
    required(schemaPath.lastName, { message: 'Bitte geben Sie Ihren Nachnamen ein' });

    required(schemaPath.street, { message: 'Bitte geben Sie Ihre Straße und Hausnummer ein' });
    required(schemaPath.postalCode, { message: 'Bitte geben Sie Ihre Postleitzahl ein' });
    required(schemaPath.city, { message: 'Bitte geben Sie Ihren Wohnort ein' });
    required(schemaPath.country, { message: 'Bitte geben Sie Ihr Heimatland ein' });
    required(schemaPath.phonenumber, { message: 'Bitte geben Sie Ihre Telefonnummer ein' });
  });

  public value = model(this.registerForm().value());

  public constructor() {
    effect(() => {
      this.value.set(this.registerForm().value());
    });
  }

  public focusInput(event: Event): void {
    (event.target as HTMLElement).querySelector('input')?.focus();
  }
}
