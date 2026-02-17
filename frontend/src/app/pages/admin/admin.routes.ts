import { Routes } from "@angular/router";

export const ADMIN_ROUTES: Routes= [
  {
    path: 'register-employ',
    loadComponent: ()=> import('./register-user/register-user.component').then(
      c=>c.RegisterUserComponent),
    title: 'Register new User'
  }, 
  {
    path: 'inventario',
    loadComponent: ()=> import('./inventory/inventory.component').then(
      c=>c.InventoryComponent),
    title: 'Inventory'
  },
  {
    path: 'usuarios',
    loadComponent: ()=> import('./users/users.component').then(
      c=>c.UsersComponent),
    title: 'Users'
  },
  /*
  {
    path: 'salesRegister',
    loadComponent: ()=> import('./paymethods/paymethods.component').then(c=>c.PaymethodsComponent),
    title: 'Sales Register'
  },
  */
]