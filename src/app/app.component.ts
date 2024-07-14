import { NavigationStart, RouterModule, RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderComponent } from './pages/header/header.component';
import { Router, Event, NavigationEnd } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';

import { IStaticMethods } from 'preline/preline';
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule,MatButtonModule, MatIconModule, MatMenuModule,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AppComponent implements OnInit {
  token = localStorage.getItem("token");
  hideHeader: boolean = false;
  router = inject(Router);
  
  ngOnInit(): void {
    this.router.events.subscribe((event:  any) => {   
      this.hideHeader = event.url?.includes("/auth")
      console.log("ebe",  this.hideHeader);
      
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 100);
      }
    });
  }
}
