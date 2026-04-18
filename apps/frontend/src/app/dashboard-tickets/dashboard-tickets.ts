import { JsonPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, input, ResourceRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderDBO, TicketDBO } from '@novarider/open-tombola/models';

@Component({
  selector: 'app-dashboard-tickets',
  imports: [RouterModule, FormsModule, JsonPipe],
  templateUrl: './dashboard-tickets.html',
  styleUrl: './dashboard-tickets.css',
})
export class DashboardTickets {
  public password = input<string>('');

  public ticketResource: ResourceRef<TicketDBO[] | undefined> =
    httpResource(() => ({
      url: `http://localhost:3333/tombola/tickets`,
      method: 'GET',
      headers: {
        Authorization: btoa(this.password())
      }
    }));

  public ticketCountResource: ResourceRef<{ count: number } | undefined> =
    httpResource(() => ({
      url: `http://localhost:3333/tombola/tickets/count`,
      method: 'GET',
      headers: {
        Authorization: btoa(this.password())
      }
    }));
}
