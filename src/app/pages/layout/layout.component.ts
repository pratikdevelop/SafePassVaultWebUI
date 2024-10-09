import { Component, OnInit, inject } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { environment } from '../../../environments/environment';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  router = inject(Router);
  activate = inject(ActivatedRoute);

  ngOnInit(): void {
    if (this.router.url === '/') {
      this.router.navigate(['/home']);
    }  }
}
