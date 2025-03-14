import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admiiin',
  standalone: true,
  imports: [MatSidenavModule, RouterModule],
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  
}
