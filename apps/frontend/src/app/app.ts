import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BRIcon } from './icon/icon';

@Component({
  imports: [RouterModule, BRIcon],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected title = '80 Jahre Bergrettung St. Gallenkirch';
}
