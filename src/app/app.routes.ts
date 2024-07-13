import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
       loadChildren:()=>import('./main-continer/routes').then(m=>m.route)
    },
    {
        path:"auth",
        loadChildren: ()=> import('./auth/auth-routes').then((m)=> m.authRoutes)
    }

];
