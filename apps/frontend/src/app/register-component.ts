import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { form, Field } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';

interface RegisterFormModel {
  firstName: string;
  lastName: string;

  street: string;
  addressLine2: string;
  postalCode: string;
  city: string;

  weight: number;
}

@Component({
  imports: [RouterModule, Field],
  selector: 'app-register-component',
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  public registerFormModel = signal<RegisterFormModel>({
    firstName: '',
    lastName: '',

    street: '',
    addressLine2: '',
    postalCode: '',
    city: '',

    weight: 0,
  });

  public registerForm = form(this.registerFormModel);
}
