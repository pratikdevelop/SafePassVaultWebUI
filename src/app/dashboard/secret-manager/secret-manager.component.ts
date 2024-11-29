import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SecretService } from '../../services/secret.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-secret-manager',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatTableModule, MatInputModule, MatFormFieldModule],
  templateUrl: './secret-manager.component.html',
  styleUrl: './secret-manager.component.css'
})
export class SecretManagerComponent implements OnInit {

  secrets: any[] = [];
  newSecret: FormGroup;
  displayedColumns: string[] = ['name', 'type', 'value', 'description']; // Columns to display in the table

  constructor(private secretService: SecretService, private formBuilder: FormBuilder, private chageDetectorRef: ChangeDetectorRef) {
    this.newSecret = this.formBuilder.group({
      name: new FormControl(''),
      type: new FormControl(''),
      value: new FormControl(''),
      description: new FormControl('')
    });

  }

  ngOnInit(): void {
    this.loadSecrets();
  }

  loadSecrets() {
    this.secretService.getSecrets().subscribe({
      next: (data: any) => {
        this.secrets = data.decryptedSecrets;
        this.chageDetectorRef.detectChanges();
      },
      error: (error: any) => {
        console.error(error);
      }

    })
  }

  addSecret() {
    this.secretService.createSecret(this.newSecret.value).subscribe(response => {
      this.loadSecrets();  // Reload secrets
    });
  }

}
