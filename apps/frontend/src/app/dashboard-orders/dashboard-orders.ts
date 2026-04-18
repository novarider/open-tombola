import { JsonPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, input, ResourceRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderDBO } from '@novarider/open-tombola/models';

@Component({
  selector: 'app-dashboard-orders',
  imports: [RouterModule, FormsModule, JsonPipe],
  templateUrl: './dashboard-orders.html',
  styleUrl: './dashboard-orders.css',
})
export class DashboardOrders {
  public password = input<string>('');

  public orderResource: ResourceRef<OrderDBO[] | undefined> =
    httpResource(() => ({
      url: `http://localhost:3333/tombola/orders`,
      method: 'GET',
      headers: {
        Authorization: btoa(this.password())
      }
    }));
}
