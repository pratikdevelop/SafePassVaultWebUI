import { Route, Routes } from "@angular/router";
import { authGuard } from "../auth.guard";

export const authRoutes: Routes = [
    {
        path: 'email-confirmation',
        canActivate: [authGuard], // Protect the admin route
        loadComponent:()=>import("./confirmation/confirmation.component").then((m)=>m.ConfirmationComponent)
    },
    {
        path: 'login',
        loadComponent:()=>import("./login/login.component").then((m)=>m.LoginComponent)
        
    },
    {
        path: 'reset-password',
        loadComponent:()=>import("./reset-password/reset-password.component").then((m)=>m.ResetPasswordComponent)
        
    },
    {
        path: 'signup',
        loadComponent:()=>import("./signup/signup.component").then((m)=>m.SignupComponent),
    },
]

