import { Routes } from "@angular/router";

export const ADMIN_ROUTES: Routes= [
  {
      path: 'register',
      // loadComponent: ()=> import('./paymethods/paymethods.component').then(c=>c.PaymethodsComponent),
      title: 'Register new User'
  }, 
  {
    path: 'inventario',
      // loadComponent: ()=> import('./paymethods/paymethods.component').then(c=>c.PaymethodsComponent),
    title: 'Inventory'
  }, 
  {
    path: 'salesRegister',
      // loadComponent: ()=> import('./paymethods/paymethods.component').then(c=>c.PaymethodsComponent),
    title: 'Sales Register'
  },
]