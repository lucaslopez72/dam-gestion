import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'editar-producto/:id', title: 'Editar producto · DAM Gestión', canActivate: [adminGuard], runGuardsAndResolvers: 'always', loadComponent: () => import('./pages/nuevo-producto/nuevo-producto.page').then(m => m.NuevoProductoPage) },
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'login', title: 'Acceso · DAM Gestión', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'productos', title: 'Productos · DAM Gestión', canActivate: [authGuard], runGuardsAndResolvers: 'always', loadComponent: () => import('./pages/productos/productos.page').then(m => m.ProductosPage) },
  { path: 'nuevo-producto', title: 'Nuevo producto · DAM Gestión', canActivate: [adminGuard], runGuardsAndResolvers: 'always', loadComponent: () => import('./pages/nuevo-producto/nuevo-producto.page').then(m => m.NuevoProductoPage) },
  { path: 'dashboard', title: 'Dashboard · DAM Gestión', canActivate: [adminGuard], runGuardsAndResolvers: 'always', loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage) },
  { path: 'ayuda', title: 'Ayuda · DAM Gestión', canActivate: [authGuard], loadComponent: () => import('./pages/ayuda/ayuda.page').then(m => m.AyudaPage) },
  { path: '**', redirectTo: 'productos' },
];
