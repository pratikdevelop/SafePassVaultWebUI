import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatExpansionModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.css']
})
export class PasswordStrengthComponent {
  password: string = '';
  passwordStrength!: { score: number, message: string } ;

  checkPassword() {
    const score = this.calculatePasswordStrength(this.password);
    this.passwordStrength = this.getStrengthMessage(score);
  }

  private calculatePasswordStrength(password: string): number {
    let score = 0;

    if (!password) {
      return score;
    }

    // Basic length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Uppercase letters
    if (/[a-z]/.test(password)) score += 1; // Lowercase letters
    if (/[0-9]/.test(password)) score += 1; // Numbers
    if (/[\W]/.test(password)) score += 1; // Special characters

    return score;
  }

  private getStrengthMessage(score: number): { score: number, message: string } {
    switch (score) {
      case 0:
      case 1:
        return { score: 20, message: 'Very Weak' };
      case 2:
        return { score: 40, message: 'Weak' };
      case 3:
        return { score: 60, message: 'Medium' };
      case 4:
        return { score: 80, message: 'Strong' };
      case 5:
        return { score: 100, message: 'Very Strong' };
      default:
        return { score: 0, message: 'Invalid' };
    }
  }
}
