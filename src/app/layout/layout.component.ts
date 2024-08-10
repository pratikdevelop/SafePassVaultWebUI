import { Component, OnInit, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../dashboard/pages/header/header.component';
import { SideNavComponent } from '../component/side-nav/side-nav.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MatSidenavModule, HeaderComponent, RouterOutlet, RouterModule, SideNavComponent, MatButtonModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  router = inject(Router)
  activate = inject(ActivatedRoute)
  ngOnInit(): void {
      if (this.router.url === '/' && localStorage.getItem('token')) {
        this.router.navigateByUrl("/dashboard/passwords")
      }
  }

}