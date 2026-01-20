import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {path: '', component: HomeComponent, title: 'Cafecito_Feliz'},
  {
    path: 'products',
    loadComponent:()=>
      import('../app/pages/products/products.component').then(
        (c)=> c.ProductsComponent
      ),
    title: 'Products',
  },
  {
    path: 'login',
    loadComponent:()=>
      import('../app/pages/login/login.component').then(
        (c)=> c.LoginComponent
      ),
    title: 'Login',
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
      import('../app/pages/ventas/ventas.component').then(
        (c)=> c.VentasComponent
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
