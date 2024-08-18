import { Routes } from '@angular/router';
import { authGuard } from '../auth.guard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then((m) => m.DashboardComponent),
    children: [
      
      {
        path: 'passwords',
        canActivate: [authGuard], // Protect the admin route
        loadComponent: () =>
          import('./pages/password/password.component').then(
            (m) => m.PasswordComponent
          ),
      },
      {
        path: 'notes',
        canActivate: [authGuard], // Protect the admin route
        loadComponent: () =>
          import('./pages/notes/notes.component').then(
            (m) => m.NotesComponent
          ),
      },
      {
        path: 'card',
        canActivate: [authGuard], // Protect the admin route
        loadComponent: () =>
          import('./pages/card/card.component').then(
            (m) => m.CardComponent
          ),
      },
      {
        path: 'Proof',
        canActivate: [authGuard], // Protect the admin route
        loadComponent: () =>
          import('./pages/id-proof/id-proof.component').then(
            (m) => m.IdProofComponent

          )

      },
      {
        path: 'profile',
        canActivate: [authGuard], // Protect the admin route
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'file',
        canActivate: [authGuard], // Protect the admin route
        loadComponent: () =>
          import('./pages/file-explorer/file-explorer.component').then(
            (m) => m.FileExplorerComponent
          ),
      },
    ],
  },
];
