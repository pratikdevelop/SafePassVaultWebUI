import { Component, OnInit, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../dashboard/pages/header/header.component';
import { SideNavComponent } from '../component/side-nav/side-nav.component';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MatSidenavModule, 
    HeaderComponent, 
    RouterOutlet, 
    RouterModule, 
    SideNavComponent, 
    MatButtonModule
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  router = inject(Router);
  activate = inject(ActivatedRoute);

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (this.router.url === '/' && !token && environment.isElectron) {
      // No token and user is at root, redirect to login page
      this.router.navigateByUrl("/auth/login");
    } else if (this.router.url === '/' && token) {
      // User is authenticated and at root, redirect to dashboard
      this.router.navigateByUrl("/dashboard/passwords");
    } else if (environment.isElectron && !token) {
      this.router.navigateByUrl("/auth/login");
    } else if (environment.isElectron && token) {
      // If the app is running in Electron and the user is authenticated, ensure they're on the dashboard
      this.router.navigateByUrl("/dashboard/passwords");
    }
    // If in web and not at root, do nothing, user stays on the current page
  }
}
