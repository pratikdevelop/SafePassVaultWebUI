import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
       loadComponent:()=>import('./layout/layout.component').then(m=>m.LayoutComponent)
    },
    {
        path: 'dashboard',
       loadChildren:()=>import('./dashboard/dashboard-route').then(m=>m.dashboardRoutes)
    },
    {
        path:"auth",
        loadChildren: ()=> import('./auth/auth-routes').then((m)=> m.authRoutes)
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

