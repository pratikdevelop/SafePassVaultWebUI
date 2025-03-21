import { Route, Routes } from "@angular/router";
import { authGuard } from "../auth.guard";

export const authRoutes: Routes = [
    {
        path: 'login',
        loadComponent: () => import("./login/login.component").then((m) => m.LoginComponent)

    },
    {
        path: 'account-recovery',
        loadComponent: () => import("./account-recovery/account-recovery.component").then((m) => m.AccountRecoveryComponent)

    },
    {
        path: 'signup',
        loadComponent: () => import("./signup/signup.component").then((m) => m.SignupComponent),
    },
    {
        path: 'accept-invitation',
        loadComponent: () => import("./invitation-accept/invitation-accept.component").then((m) =>
            m.InvitationAcceptComponent),
    },
    {
        path: 'reset-password',
        loadComponent: () => import("./reset-password/reset-password.component").then((m) => m.ResetPasswordComponent)
    },
    {
        path: 'mfa-verification',
        loadComponent: () => import("./mfa-verification/mfa-verification.component").then((m
        ) => m.MfaVerificationComponent)
    },
    { path: 'magic-link', loadComponent: () => import('./magic-link-verification/magic-link-verification.component').then((m) => m.MagicLinkVerificationComponent) },
    {
        path: 'recovery-verify',
        loadComponent: () =>
            import("./recovery/recovery.component").then((m) => m.RecoveryComponent)
    }
]

