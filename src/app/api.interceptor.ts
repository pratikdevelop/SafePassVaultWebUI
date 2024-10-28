import {
  HttpHeaders,
  HttpInterceptorFn
} from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {

    // Retrieve the token from local storage
    const token = localStorage.getItem('token');

    // Set up default headers
    let headers = req.headers.set('Access-Control-Allow-Origin', '*'); // Set '*' or specific origin if necessary

    // If a token exists, add the Authorization header
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Clone the request with the modified headers
    const authRequest = req.clone({ headers });

    // Forward the modified request
    return next(authRequest);
}
