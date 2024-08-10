import { Routes } from '@angular/router';
import { authGuard } from '../auth.guard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then((m) => m.DashboardComponent),
    children: [
      {
        path: 'generator',
        loadComponent: () =>
          import('./pages/password-genrator/password-genrator.component').then(
            (m) => m.PasswordGenratorComponent
          ),
      },
      {
        path: 'passwords',
        canActivate: [authGuard], // Protect the admin route
        loadComponent: () =>
          import('./pages/password/password.component').then(
            (m) => m.PasswordComponent
          ),
      },
      {
        path: 'profile',
        canActivate: [authGuard], // Protect the admin route
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
    ],
  },
];
