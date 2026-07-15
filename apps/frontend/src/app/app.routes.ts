import { Route } from '@angular/router';
import { RegisterComponent } from './register/register-component';
import { PaymentSuccessfull } from './payment-successfull/payment-successfull';
import { PaymentCancelled } from './payment-cancelled/payment-cancelled';
import { Legal } from './legal/legal';
import { ActivateTickets } from './activate-tickets/activate-tickets';
import { Home } from './home/home';
import { Dashboard } from './dashboard/dashboard';
import { ActivationSuccessfull } from './activation-successfull/activation-successfull';

export const appRoutes: Route[] = [
  {
    path: 'home',
    component: Home
  },
  {
    path: 'tickets/activate',
    component: ActivateTickets
  },
  {
    path: 'tickets/activation/successfull',
    component: ActivationSuccessfull
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
    path: 'dashboard',
    component: Dashboard
  },
  // catch all routes
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
