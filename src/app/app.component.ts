import { RouterModule, RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { HeaderComponent } from './dashboard/pages/header/header.component';
import { Router, NavigationEnd } from '@angular/router';

import { IStaticMethods } from 'preline/preline';
import { AuthService } from './services/auth.service';
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule,HeaderComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AppComponent implements OnInit {
  token = localStorage.getItem("token");
  authService= inject(AuthService)
  hideHeader: boolean = false;
  router = inject(Router);
  
  ngOnInit(): void {
    this.router.events.subscribe((event:  any) => {   
      this.hideHeader = event.url?.includes("/auth")
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 100);
      }
    });
    if (this.token) {
      this.authService.getProfile().subscribe((res) => {
        console.log(res);
      })
    }
  }
}
