import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Field, form, required } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { DashboardOrders } from '../dashboard-orders/dashboard-orders';
import { DashboardTickets } from '../dashboard-tickets/dashboard-tickets';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, FormsModule, Field, DashboardOrders, DashboardTickets],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  public passwordForm = signal<{ password: string }>({
    password: ''
  });

  public form = form(this.passwordForm, (schemaPath) => {
    required(schemaPath.password, { message: 'Bitte geben Sie das Passwort ein' });
  });

  public async onSubmit(event: Event): Promise<void> {
    // prevent default form navigation
    event.preventDefault();
    console.log('submit')
    this.cachedPassword.set(this.passwordForm().password);
  }

  public cachedPassword = signal<string>('');
}
