import { Route, Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'organizations',
        loadComponent: () =>
          import('./organizations/organizations.component').then(
            (m) => m.OrganizationsComponent
          ),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./roles-permissions/roles-permissions.component').then(
            (m) => m.RolesPermissionsComponent
          ),
      },
    ],
  },
];
