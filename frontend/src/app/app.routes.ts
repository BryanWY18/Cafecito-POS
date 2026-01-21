import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  {path: '', component: LandingComponent, title: 'Cafecito_Feliz'},
  {
    path: 'login',
    loadComponent:()=>
      import('../app/pages/login/login.component').then(
        (c)=> c.LoginComponent
      ),
    title: 'Login',
  },
  {
    path: 'dashboard',
    loadComponent:()=>
      import('../app/pages/main/main.component').then(
        (c)=> c.MainComponent
      ),
    title: 'Dashboard',
  },
  {
    path: 'registerCustomer',
    loadComponent:()=>
      import('../app/pages/register/register.component').then(
        (c)=> c.RegisterComponent
      ),
    title: 'Register_Customer',
  },
  {
    path: 'customer',
    loadComponent:()=>
      import('../app/pages/clientes/clientes.component').then(
        (c)=> c.ClientesComponent
      ),
    title: 'Customer',
  },
  {
    path: 'sale',
    loadComponent:()=>
      import('../app/pages/sale/sale.component').then(
        (c)=> c.SaleComponent
      ),
    title: 'Sale',
  },
  {
    path: 'admin',
    loadComponent:()=>
      import('../app/pages/admin/admin.component').then(
        (c)=> c.AdminComponent
      ),
    loadChildren: () => import('../app/pages/admin/admin.routes').then(r=>r.ADMIN_ROUTES)
  }
];
