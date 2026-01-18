import { Route } from '@angular/router';
import { RegisterComponent } from './register-component';

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
    path: '**',
    redirectTo: 'products',
  },
];
