import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const email = route.queryParams['username'];
  const password = route.queryParams['password'];
  const token = localStorage.getItem('token');
  
  if (token) { 
    const authRoutes = ['/signup', '/reset-password', '/login' ,'/home', '/email-confirmation'];
    const isAuthRoutes = authRoutes.some(route => state.url.includes(route));
    if(isAuthRoutes) {
      router.navigate(['/'])
      return false
    }
    return true;
  } else {
    const publicRoutes = ['pricing-page', 'download','password-strength', 'generator', 'privacy-policy'];
    const isPublicRoute = publicRoutes.find(route => state.url.includes(route));

    if (!token && !isPublicRoute) {
      router.navigate((email && password) ? [`auth/login?username=${route.queryParams['username']}&password=${route.queryParams['password']}`] : [`auth/login`]);
      return false;
    } 
    return true
    // Token doesn't exist, user is not authenticated
  }
};
