import { Component, ChangeDetectionStrategy, model, effect } from '@angular/core';
import { form, Field, FormValueControl, schema, SchemaPathTree, min, pattern, required, applyEach } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { TicketNumberFormatDirective } from '../ticket-number-format.directive';
import { TicketOptionalActivationCode } from '@novarider/open-tombola/models';

export const ticketSchema = schema<TicketOptionalActivationCode>((schemaPath: SchemaPathTree<TicketOptionalActivationCode>) => {
  required(schemaPath.weight, { message: 'Ein Tipp ist erforderlich' });
  min(schemaPath.weight, 1, { message: 'Ein Tipp muss mindestens 0.001 kg sein' });
  pattern(schemaPath.weight, /^[-]*\d*([.,]\d{0,3})?$/, { message: 'Ein Tipp muss eine Zahl mit maximal drei Nachkommastellen sein' });
});

@Component({
  imports: [RouterModule, Field, TicketNumberFormatDirective],
  selector: 'app-tickets-form',
  templateUrl: './tickets-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketFormComponent implements FormValueControl<TicketOptionalActivationCode[]> {
  public value = model<TicketOptionalActivationCode[]>([]);

  public ticketsForm = form(this.value, (schemaPath) => {
    applyEach(schemaPath, ticketSchema);
  });

  public constructor() {
    effect(() => {
      this.value.set(this.ticketsForm().value());
    });
  }

  public focusInput(event: Event): void {
    (event.target as HTMLElement).querySelector('input')?.focus();
  }

  public removeTicket(index: number, event: Event): void {
    event.stopPropagation();
    if (this.ticketsForm().value().length > 1) {
      this.value.update((value) =>
        value.filter((_, i) => i !== index),
      );
    }
  }
}
