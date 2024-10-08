import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordService } from '../../services/password.service';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CardService } from '../../services/card.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-credit-card-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatToolbarModule, MatFormFieldModule, CommonModule, MatInputModule, MatAutocompleteModule, MatDialogModule, MatCheckboxModule, MatChipsModule, MatIconModule, MatSelectModule, MatOptionModule],
  templateUrl: './credit-card-form.component.html',
  styleUrl: './credit-card-form.component.css'
})
export class CreditCardFormComponent {

  creditCardForm: FormGroup;

  constructor(private fb: FormBuilder, private creditCardService: CardService) {
    this.creditCardForm = this.fb.group({
      cardType: [''],
      cardHolderName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', Validators.required],
      CVV: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      billingAddress: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.creditCardForm.valid) {
      this.creditCardService.createCard(this.creditCardForm.value).subscribe(response => {
        console.log('Credit card created', response);
      });
    }
  }

}
