import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-user-guide',
  standalone: true,
  imports: [MatSidenavModule, CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './user-guide.component.html',
  styleUrl: './user-guide.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class UserGuideComponent {
  readonly changeDetectorRef = inject(ChangeDetectorRef);

  title = 'User Guide';
  type?: string = 'introduction';

  toggleData(type?: string): void {
    this.type = type
    this.changeDetectorRef.detectChanges();
  }

}
