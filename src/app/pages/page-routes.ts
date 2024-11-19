import { Route, Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./index/index.component').then((m) => m.IndexComponent)
    },
    {
        path: 'privacy-policy',
        loadComponent: () =>
            import('./privacy-policy/privacy-policy.component').then(
                (m) => m.PrivacyPolicyComponent
            ),
    },
    {
        path: 'download',
        loadComponent: () =>
            import('./download/download.component').then(
                (m) => m.DownloadComponent
            ),
    },
    {
        path: 'generator',
        loadComponent: () =>
            import('./password-genrator/password-genrator.component').then(
                (m) => m.PasswordGenratorComponent
            ),
    },
    {
        path: 'plan-pricing',
        loadComponent: () =>
            import('./pricing-page/pricing-page.component').then(
                (m) => m.PricingPageComponent
            ),
    },
    {
        path: 'password-strength',
        loadComponent: () =>
            import('./password-strength/password-strength.component').then(
                (m) => m.PasswordStrengthComponent
            ),
    },
    {
        path: 'api-docs',
        loadComponent: () =>
            import('./api-docs/api-docs.component').then(
                (m) => m.ApiDocsComponent
            ),
        children: [
            {
                path: '**',
                loadComponent: () =>
                    import('./api-docs/api-docs.component').then(
                        (m) => m.ApiDocsComponent
                    ),
            }
        ]
    },
    {
        path: 'user-guide',
        loadComponent: () =>
            import('./user-guide/user-guide.component').then(
                (m) => m.UserGuideComponent
            )
    },
    {
        path: 'support',
        loadComponent: () => import('../support/support.component').then((m) => m.SupportComponent)
    }
];
