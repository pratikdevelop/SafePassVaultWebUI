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
          import('./password/password.component').then(
            (m) => m.PasswordComponent
          ),
      },
      {
        path: 'notes',
        canActivate: [authGuard], // Protect the admin route
        loadComponent: () =>
          import('./notes/notes.component').then((m) => m.NotesComponent),
      },
      {
        path: 'card',
        canActivate: [authGuard], // Protect the admin route
        loadComponent: () =>
          import('./card/card.component').then((m) => m.CardComponent),
      },
      {
        path: 'Proof',
        canActivate: [authGuard], // Protect the admin route
        loadComponent: () =>
          import('./id-proof/id-proof.component').then(
            (m) => m.IdProofComponent
          ),
      },

      {
        path: 'file',
        canActivate: [authGuard], // Protect the admin route
        loadComponent: () =>
          import('./file-explorer/file-explorer.component').then(
            (m) => m.FileExplorerComponent
          ),
      },
      {
        path: 'profile',
        canActivate: [authGuard], // Protect the admin route
        loadChildren: () =>
          import('./profile/profile-route').then((m) => m.profileRoutes)
      },
    ],
  },
];
