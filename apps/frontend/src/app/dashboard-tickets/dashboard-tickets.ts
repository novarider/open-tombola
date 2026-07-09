import { JsonPipe } from '@angular/common';
import { Component, inject, input, ResourceRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TicketDBO } from '@novarider/open-tombola/models';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard-tickets',
  imports: [RouterModule, FormsModule, JsonPipe],
  templateUrl: './dashboard-tickets.html',
  styleUrl: './dashboard-tickets.css',
})
export class DashboardTickets {
  private dashboardService = inject(DashboardService);
  public password = input<string>('');

  public ticketResource: ResourceRef<TicketDBO[] | undefined> =
    this.dashboardService.ticketResource(this.password);

  public ticketCountResource: ResourceRef<{ count: number } | undefined> =
    this.dashboardService.ticketCountResource(this.password);
}
