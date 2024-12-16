import {
  HttpInterceptorFn
} from '@angular/common/http';


export const apiInterceptor: HttpInterceptorFn = (req, next) => {

  // Retrieve the token from local storage (ensure it's stored securely)
  const token = localStorage.getItem('token');

  // Set up default headers
  let headers = req.headers
    .set('Access-Control-Allow-Origin', '*') // Configure CORS if needed. It's better to specify exact origins instead of '*'
    .set('X-Content-Type-Options', 'nosniff')  // Prevent MIME type sniffing
    .set('X-XSS-Protection', '1; mode=block')  // Enable browser XSS protection
    .set('X-Frame-Options', 'DENY')  // Prevent your app from being embedded in an iframe (clickjacking protection)
    .set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')  // Enforce HTTPS (for server response, usually)
    .set('Referrer-Policy', 'no-referrer')  // Limit referrer information
    .set('Content-Security-Policy', "default-src 'self'; script-src 'self'; object-src 'none'");

  // If a token exists, add the Authorization header
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  // Optionally, add a Content Security Policy header (typically, this would be on the server)
  // Example header: 
  // headers = headers.set

  // Clone the request with the modified headers
  const authRequest = req.clone({ headers });

  // Forward the modified request
  return next(authRequest);
};
