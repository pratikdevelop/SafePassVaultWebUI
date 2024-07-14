import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {

    // Add your logic here to retrieve the token
    const token = localStorage.getItem('token');

    if (token) {
      // Clone the request and add the Authorization header
      const authRequest = req.clone({
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      });

      return next(authRequest);
    } else {
      // the case where there's no token (optional)
      return next(req); // Pass through the original request
    }
}
