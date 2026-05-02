import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TombolaRulesComponent } from '../tombola-rules/tombola-rules';

@Component({
  selector: 'app-home',
  imports: [RouterModule, TombolaRulesComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home { }
