import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // Dashboard
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },

  // Clientes
  {
    path: 'clientes',
    loadComponent: () =>
      import('./features/clientes/cliente-form.component')
        .then(m => m.ClienteFormComponent),
    canActivate: [AuthGuard]
  },

  // Servicios
  {
    path: 'servicios-forms',
    loadComponent: () =>
      import('./features/servicios/servicio-form.component').then(m => m.ServicioFormComponent),
    canActivate: [AuthGuard]
  },

  {
    path: 'servicios-list',
    loadComponent: () =>
      import('./features/servicios/servicio-list.component').then(m => m.ServicioListComponent),
    canActivate: [AuthGuard]
  },

  {
    path: 'repuestos-add',
    loadComponent: () =>
      import('./features/repuestos/repuesto-add.component').then(m => m.RepuestoAddComponent),
    canActivate: [AuthGuard]
  },

  {
    path: 'usuarios',
    loadComponent: () =>
      import('./features/usuarios/usuario-list.component').then(m => m.UsuarioListComponent),
    canActivate: [AuthGuard]
  },


  // Repuestos
//   {
//     path: 'repuestos',
//     loadComponent: () =>
//       import('./features/repuestos/repuestos.component').then(m => m.RepuestosComponent),
//     canActivate: [AuthGuard]
//   },

  // Facturas
//   {
//     path: 'facturas',
//     loadComponent: () =>
//       import('./features/facturas/facturas.component').then(m => m.FacturasComponent),
//     canActivate: [AuthGuard]
//   },

  // Wildcard
  { path: '**', redirectTo: '/dashboard' }
];
