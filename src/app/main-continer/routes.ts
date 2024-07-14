import { Routes } from "@angular/router"
import { authGuard } from "../auth.guard"

export const route : Routes =[
    {
        path: "", 
        redirectTo:"/home",
        pathMatch:"full"
    },
    {
        path: 'home',
        loadComponent: ()=>import("./layout/layout.component").then(m=>m.LayoutComponent),
    },
    {
        path: 'passwords',
        canActivate: [authGuard], // Protect the admin route
        loadComponent:()=>import("../pages/password/password.component").then((m)=>m.PasswordComponent)
    },
    {
        path: 'profile',
        // canActivate: [authGuard], // Protect the admin route
        loadComponent:()=>import("../pages/profile/profile.component").then((m)=>m.ProfileComponent)
    },
]