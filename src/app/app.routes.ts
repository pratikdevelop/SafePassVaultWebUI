import { Route, Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/page-routes').then((m) => m.adminRoutes)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./dashboard/dashboard-route').then((m) => m.dashboardRoutes)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./dashboard/admin/admin-routes').then((m) => m.adminRoutes)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth-routes').then((m) => m.authRoutes)
  },
  {
    path: 'profile',
    canActivate: [authGuard], // Protect the admin route
    loadChildren: () =>
      import('./dashboard/profile/profile-route').then((m) => m.profileRoutes)
  },
];
