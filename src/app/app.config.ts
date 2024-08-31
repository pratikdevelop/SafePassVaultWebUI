import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './api.interceptor';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxStripeModule, provideNgxStripe } from 'ngx-stripe';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideHttpClient(withInterceptors([apiInterceptor])),
  importProvidersFrom([MatButtonModule, MatSnackBarModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,MatInputModule,NgxStripeModule.forRoot('pk_test_51PrEnfAE6VGXmCKJI927mwY0Ws03UDVaV19lG0UwrRG70re2SyIqxgKEsYfjsNFXnfKsVIemRpeCFDKkT3hroeCh001ivYn2hO') ]), provideAnimationsAsync(),
  provideNgxStripe()  
  ]
};
