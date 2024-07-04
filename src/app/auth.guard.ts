import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
 const email =route.queryParams[`username`]
 const password =route.queryParams['password']
  const token = localStorage.getItem('token'); // Get token from localStorage
  
  if (token || (!token && state.url.includes("email-confirmation")) ) {
    // Token exists, user is authenticated
    return true;
  } else {
    // Token doesn't exist, user is not authenticated
    router.navigateByUrl((email && password)?`login?username=${route.queryParams[`username`]}&password=${route.queryParams['password']}`: `login`);
    return false;
  }
};
