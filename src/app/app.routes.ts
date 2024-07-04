import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'password',
        pathMatch: 'full'
    },
    {
        path: 'password',
        canActivate: [authGuard], // Protect the admin route
        loadComponent:()=>import("./password/password.component").then((m)=>m.PasswordComponent)
    },
    {
        path: 'email-confirmation',
        canActivate: [authGuard], // Protect the admin route
        loadComponent:()=>import("./auth/confirmation/confirmation.component").then((m)=>m.ConfirmationComponent)
    },
    {
        path: 'login',
        loadComponent:()=>import("./auth/login/login.component").then((m)=>m.LoginComponent)
        
    },
    {
        path: 'reset-password',
        loadComponent:()=>import("./auth/reset-password/reset-password.component").then((m)=>m.ResetPasswordComponent)
        
    },
    {
        path: 'signup',
        loadComponent:()=>import("./auth/signup/signup.component").then((m)=>m.SignupComponent)
    },
];
