import { Component, ChangeDetectionStrategy, model, effect, input } from '@angular/core';
import { form, Field, required, SchemaPathTree, FormValueControl, ValidationError, WithOptionalField, schema } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { TicketOrderBase } from '@novarider/open-tombola/models';
import { JsonPipe, NgTemplateOutlet } from '@angular/common';

export const personalDataSchema = schema<TicketOrderBase>((schemaPath: SchemaPathTree<TicketOrderBase>) => {
  required(schemaPath.firstName, { message: 'Bitte geben Sie Ihren Vornamen ein' });
  required(schemaPath.lastName, { message: 'Bitte geben Sie Ihren Nachnamen ein' });

  required(schemaPath.street, { message: 'Bitte geben Sie Ihre Straße und Hausnummer ein' });
  required(schemaPath.postalCode, { message: 'Bitte geben Sie Ihre Postleitzahl ein' });
  required(schemaPath.city, { message: 'Bitte geben Sie Ihren Wohnort ein' });
  required(schemaPath.country, { message: 'Bitte geben Sie Ihr Heimatland ein' });
  required(schemaPath.phonenumber, { message: 'Bitte geben Sie Ihre Telefonnummer ein' });
});

@Component({
  imports: [RouterModule, Field, NgTemplateOutlet],
  selector: 'app-personal-data-form',
  templateUrl: './personal-data-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalDataFormComponent implements FormValueControl<TicketOrderBase> {
  public value = model<TicketOrderBase>({
    firstName: '',
    lastName: '',

    street: '',
    addressLine2: '',
    postalCode: '',
    city: '',
    country: '',
    phonenumber: '',
  });

  public registerForm = form(this.value, personalDataSchema);

  public constructor() {
    effect(() => {
      this.value.set(this.registerForm().value());
    });
  }

  public focusInput(event: Event): void {
    (event.target as HTMLElement).querySelector('input')?.focus();
  }
}
