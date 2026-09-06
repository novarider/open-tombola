import { Component, inject, input, linkedSignal, ResourceRef, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { TombolaResult } from '@novarider/open-tombola/models';
import { JsonPipe } from '@angular/common';
import { Field, form } from '@angular/forms/signals';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

interface WeightFormDto {
  weight: string;
}

@Component({
  selector: 'app-tombola-result',
  imports: [RouterModule, JsonPipe, Field],
  templateUrl: './tombola-result.html',
  styleUrl: './tombola-result.css',
})
export class TombolaResultComponent {
  private dashboardService = inject(DashboardService);

  public password = input<string>('');

  public weightFormModel = signal<WeightFormDto>({
    weight: '',
  });

  public weightForm = form<WeightFormDto>(this.weightFormModel);

  private weight = linkedSignal<number>(() => Number.parseFloat(this.weightForm().value().weight));

  private weightDebounced = toSignal(toObservable(this.weight).pipe(debounceTime(500)), {
    initialValue: 0,
  });

  public tombolaResult: ResourceRef<TombolaResult | undefined> =
    this.dashboardService.tombolaResultResource(this.password, this.weightDebounced);
}
