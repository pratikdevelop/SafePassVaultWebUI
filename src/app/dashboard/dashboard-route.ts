import { Routes } from '@angular/router';
import { authGuard } from '../auth.guard';
import { apiResolver } from '../api.resolver';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then((m) => m.DashboardComponent),
    children: [

      {
        path: 'passwords',  // New path for when folderId is not provided
        canActivate: [authGuard], // Protect the admin route
        loadComponent: () =>
          import('./password/password.component').then(
            (m) => m.PasswordComponent
          ),
      },

      {
        path: 'notes',  // New path for notes without folderId
        canActivate: [authGuard],
        loadComponent: () =>
          import('./notes/notes.component').then((m) => m.NotesComponent),
      },
      {
        path: 'cards',  // New path for cards without folderId
        canActivate: [authGuard],
        loadComponent: () =>
          import('./card/card.component').then((m) => m.CardComponent),
      },
      {
        path: 'identity',  // New path for proof without folderId
        loadComponent: () =>
          import('./id-proof/id-proof.component').then(
            (m) => m.IdProofComponent
          ),
      },
      {
        path: 'files',  // New path for file without folderId
        canActivate: [authGuard],
        loadComponent: () =>
          import('./file-explorer/file-explorer.component').then(
            (m) => m.FileExplorerComponent
          ),
      },
      {
        path: 'secrets',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./secret-manager/secret-manager.component').then((m) => m.SecretManagerComponent),
      },
      {
        path: 'profile',  // New path for profile without folderId
        canActivate: [authGuard],
        loadChildren: () =>
          import('./profile/profile-route').then((m) => m.profileRoutes),
      },
      {
        path: 'address',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./address/address.component').then((m) => m.AddressComponent),
      },
      {
        path: "log-report",
        loadComponent: () =>
          import('./log-report/log-report.component').then((m) => m.LogReportComponent),
      }

    ],
  },
];
