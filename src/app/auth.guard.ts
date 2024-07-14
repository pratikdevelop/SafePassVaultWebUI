import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const email = route.queryParams['username'];
  const password = route.queryParams['password'];
  const token = localStorage.getItem('token'); // Get token from localStorage

  const publicRoutes = ['/signup', '/reset-password', '/home', '/email-confirmation'];

  // Check if the current route is one of the public routes
  const isPublicRoute = publicRoutes.some(route => state.url.includes(route));

  if (token || isPublicRoute) {
    // Token exists, user is authenticated, or user is on a public route
    return true;
  } else {
    // Token doesn't exist, user is not authenticated
    router.navigateByUrl((email && password) ? `auth/login?username=${route.queryParams['username']}&password=${route.queryParams['password']}` : `auth/login`);
    return false;
  }
};
