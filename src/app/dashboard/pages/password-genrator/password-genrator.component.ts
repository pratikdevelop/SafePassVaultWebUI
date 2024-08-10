import { ClipboardModule, Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import zxcvbn from 'zxcvbn';
import { MatSliderModule } from '@angular/material/slider';
import { generate, count } from "random-words";
import { MatRadioModule } from '@angular/material/radio'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-password-genrator',
  templateUrl: './password-genrator.component.html',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, ClipboardModule,MatSnackBarModule , MatSliderModule, MatInputModule, MatIconModule, FormsModule, CommonModule, MatCheckboxModule, MatButtonModule, MatRadioModule],
  styleUrls: ['./password-genrator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class PasswordGenratorComponent {
  password: string = '';
  length: number = 16;
  numbers: boolean = true;
  symbols: boolean = true;
  uppercase: boolean = true;
  lowercase: boolean = true;
  strength: number = 10;
  feedback: string = '';
  crackTimes: any;
  clipboard = inject(Clipboard)
  snackbar = inject(MatSnackBar)
  generatorType: number = 1
  passwordStrengths: any[] = [
  { level: 0, label: 'Very Weak', color: 'none' },
  { level: 1, label: 'Weak', color: 'none' },
  { level: 2, label: 'Fair', color: 'bg-yellow-500' },
  { level: 3, label: 'Strong', color: 'bg-green-500' },
  { level: 4, label: 'Very Strong', color: 'bg-blue-500' },
];

  passphraseLength = 12;
  includeSeparators = false;
  capitalizeWords = false;
  passphrase = '';
  generatePassword(): void {
    const characters = [
      this.numbers ? '0123456789' : '',
      this.uppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '',
      this.lowercase ? 'abcdefghijklmnopqrstuvwxyz' : '',
      this.symbols ? '~!@-#$(){}[];:*+^%_' : ''
    ].join('');

    if (characters.length === 0) {
      this.password = '';
      this.strength = 0;
      this.feedback = 'Select at least one character set.';
      return;
    }

    this.password = Array(this.length)
      .fill(characters)
      .map(x => x[Math.floor(Math.random() * x.length)])
      .join('');

    this.estimateStrength();
  }

  getPasswordStrengthLabel(strength: number): string {
    switch (strength) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  }



  estimateStrength() {
    const result = zxcvbn(this.password);
    this.strength = result.score;
    this.feedback = result.feedback.suggestions.join(' ');
    this.crackTimes = result.crack_times_display;
    console.log("rrr", result);

  }
  copyPassword() {
    this.clipboard.copy(this.password);
    this.snackbar.open('Password copied to clipboard!', "close", {
      duration:3000
    });
  }

  generatePassphrase() {
    const passphraseWords: string | string[] = generate(this.passphraseLength);

    // Check if passphraseWords is a string, if so convert it to an array of strings
    let passphraseArray: string[];
    if (typeof passphraseWords === 'string') {
        passphraseArray = [passphraseWords];
    } else {
        passphraseArray = passphraseWords;
    }
    
    // Join the array with the separator (if any) and convert to string
    this.passphrase = passphraseArray.map((passphrase)=>{  return this.capitalizeWords ? passphrase.toUpperCase(): passphrase }).join(this.includeSeparators ? '-' : ' ');
    
  }

  copyPassphrase() {
    this.clipboard.copy(this.passphrase);
    this.snackbar.open('Passphrase copied to clipboard!', '', {duration:3000});
  }
}
