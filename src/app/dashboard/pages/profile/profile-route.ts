import { Routes } from '@angular/router';
import { authGuard } from '../../../auth.guard';

export const profileRoutes: Routes = [
  {
    path: '',
    canActivate:[authGuard],
    loadComponent: () =>
      import('./profile.component').then((m) => m.ProfileComponent),
    children: [ 
      {
        path: 'personal-details',
        canActivate: [authGuard], // Protect the admin route
        loadComponent: () =>
          import('./user-profile/user-profile.component').then(
            (m) => m.UserProfileComponent
          ),
      },
      {
        path:"security",
        canActivate: [authGuard],
        loadComponent: () =>
          import('./security/security.component').then((m) => m.SecurityComponent),
      },
      {
        path:"privacy",
        canActivate: [authGuard],
        loadComponent: () =>
          import('./password-change/password-change.component').then((m)=>{
            return m.PasswordChangeComponent
          })
      },
      {
        path: 'manage-notificatio',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./notification/notification.component').then((m) => m.NotificationComponent)
      },
      {
        path:'mfa-authentication',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./mfa-setting/mfa-setting.component').then((m) => m.MfaSettingComponent)
      },{
        path:'plan-details',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./billing-details/billing-details.component').then((m) => m.BillingDetailsComponent)
      }
    ],
  },
];
