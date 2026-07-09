import { JsonPipe } from '@angular/common';
import { Component, inject, input, ResourceRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderDBO } from '@novarider/open-tombola/models';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard-orders',
  imports: [RouterModule, FormsModule, JsonPipe],
  templateUrl: './dashboard-orders.html',
  styleUrl: './dashboard-orders.css',
})
export class DashboardOrders {
  private dashboardService = inject(DashboardService);

  public password = input<string>('');

  public orderResource: ResourceRef<OrderDBO[] | undefined> = this.dashboardService.orderResource(this.password);

  public orderCountResource: ResourceRef<{ count: number } | undefined> = this.dashboardService.orderCountResource(this.password);
}
