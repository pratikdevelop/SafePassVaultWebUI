
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-passwordless-options',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './passwordless-options.component.html',
  styleUrls: ['./passwordless-options.component.scss']
})
export class PasswordlessOptionsComponent {

  setup(option: string): void {
    switch (option) {
      case 'authenticator':
        alert('Setting up LastPass Authenticator...');
        // Add logic to redirect or open a setup modal
        break;
      case 'windowsHello':
        alert('Setting up Windows Hello...');
        // Add logic to handle Windows Hello setup
        break;
      case 'usbKey':
        alert('Setting up USB Security Key...');
        // Add logic for USB key setup
        break;
      default:
        console.error('Invalid option selected.');
    }
  }
}
