import { RouterModule, RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IStaticMethods } from 'preline/preline';
import { AuthService } from './services/auth.service';
import { FooterComponent } from './common/footer/footer.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './common/header/header.component';
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule,HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AppComponent implements OnInit {
  readonly token = localStorage.getItem("token");
  readonly authService= inject(AuthService);
  readonly router = inject(Router);;
  readonly translate = inject(TranslateService);
  hideHeader: boolean = false;
  
  ngOnInit(): void {
    this.translate.addLangs(['en', 'klingon']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
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

      })
    }
  }
}
