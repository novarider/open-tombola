import { Route } from '@angular/router';
import { RegisterComponent } from './register/register-component';
import { PaymentSuccessfull } from './payment-successfull/payment-successfull';
import { PaymentCancelled } from './payment-cancelled/payment-cancelled';
import { Legal } from './legal/legal';
import { ActivateTickets } from './activate-tickets/activate-tickets';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'tickets/register',
    pathMatch: 'full',
  },
  {
    path: 'tickets/activate',
    component: ActivateTickets
  },
  {
    path: 'tickets/register',
    component: RegisterComponent
  },
  {
    path: 'checkout/success',
    component: PaymentSuccessfull
  },
  {
    path: 'checkout/cancel',
    component: PaymentCancelled
  },
  {
    path: 'legal',
    component: Legal
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
