import { Routes } from "@angular/router"
import { authGuard } from "../auth.guard"

export const route : Routes =[
    {
        path: "", 
        loadComponent: ()=>import("./layout/layout.component").then(m=>m.LayoutComponent),
    },
    {
        path: "generator", 
        loadComponent: ()=>import("../pages/password-genrator/password-genrator.component").then(m=>m.PasswordGenratorComponent),
    },
    {
        path: 'passwords',
        canActivate: [authGuard], // Protect the admin route
        loadComponent:()=>import("../pages/password/password.component").then((m)=>m.PasswordComponent)
    },
    {
        path: 'profile',
        canActivate: [authGuard], // Protect the admin route
        loadComponent:()=>import("../pages/profile/profile.component").then((m)=>m.ProfileComponent)
    },
    {
        path:"plan-pricing",
        loadComponent:()=> import('../pages/pricing-page/pricing-page.component').then(m=>m.PricingPageComponent)
    }
]