import { Route } from '@angular/router';
import { RegisterComponent } from './register-component';
import { CartComponent } from './cart/cart';
import { PaymentSuccessfull } from './payment-successfull';
import { PaymentCancelled } from './payment-cancelled';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@org/shop/feature-products').then((m) => m.featureProductsRoutes),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@org/shop/feature-product-detail').then(
        (m) => m.featureProductDetailRoutes
      ),
  },
  {
    path: 'register',
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
    path: '**',
    redirectTo: 'products',
  },
];
