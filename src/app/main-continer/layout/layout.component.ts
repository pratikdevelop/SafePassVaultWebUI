import { Component, OnInit, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../pages/header/header.component';
import { SideNavComponent } from '../../pages/side-nav/side-nav.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MatSidenavModule, HeaderComponent, RouterOutlet, RouterModule, SideNavComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  router = inject(Router)
  activate = inject(ActivatedRoute)
  ngOnInit(): void {
      if (this.router.url === '/' && localStorage.getItem('token')) {
        this.router.navigateByUrl("/passwords")
      }
  }

}
