import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: '',
       loadComponent:()=>import('./layout/layout.component').then(m=>m.LayoutComponent)
    },
    {
      path: 'generator',
      loadComponent: () =>
        import('./dashboard/pages/password-genrator/password-genrator.component').then(
          (m) => m.PasswordGenratorComponent
        ),
    },
    {
        path: 'dashboard',
        canActivate:[authGuard],
       loadChildren:()=>import('./dashboard/dashboard-route').then(m=>m.dashboardRoutes)
    },
    {
      path: 'admin',
      canActivate:[authGuard],
     loadChildren:()=>import('./admiin/admin-routes').then(m=>m.adminRoutes)
  },
    {
        path:"auth",
        loadChildren: ()=> import('./auth/auth-routes').then((m)=> m.authRoutes)
    },
    {
      path: 'profile',
      canActivate: [authGuard], // Protect the admin route
      loadComponent: () =>
        import('./dashboard/pages/profile/profile.component').then(
          (m) => m.ProfileComponent
        ),
    },
    
    {
        path: 'plan-pricing',
        loadComponent: () =>
          import('../../src/app/dashboard/pages/pricing-page/pricing-page.component').then(
            (m) => m.PricingPageComponent
          ),
    },
    {
        path: 'password-strength',
        loadComponent: () =>
          import('../../src/app/password-strength/password-strength.component').then(
            (m) => m.PasswordStrengthComponent
          ),
    },
];

