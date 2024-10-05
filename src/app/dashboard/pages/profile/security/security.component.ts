import { Component, EventEmitter, OnInit, Output, inject, output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SecurityQuestionService } from '../../../../services/security-question.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatCardModule, MatButtonModule, MatInputModule, MatSelectModule, MatOptionModule],
  templateUrl: './security.component.html',
})
export class SecurityComponent implements OnInit {
  readonly commonService = inject(CommonService);
  securityQuestionService = inject(SecurityQuestionService);
  securityForm = new FormGroup({
    securityQuestion1: new FormControl('', Validators.required),
    securityAnswer1: new FormControl('', Validators.required),
    securityQuestion2: new FormControl('', Validators.required),
    securityAnswer2: new FormControl('', Validators.required)
  });
  constructor() {}

  ngOnInit(): void {
    this.loadSecurityQuestions();
  }

  loadSecurityQuestions(): void {
    this.securityQuestionService.getSecurityQuestions().subscribe(
      (data: any) => {
          const questions = data[0].securityQuestions
          this.securityForm.setValue({
            securityQuestion1: questions[0]?.question || '',
            securityAnswer1: questions[0]?.answer || '',
            securityQuestion2: questions[1]?.question || '',
            securityAnswer2: questions[1]?.answer || ''
          });          
      },
      (error: any) => console.error('Error loading security questions', error)
    );
  }

  onSubmit(): void {
    if (this.securityForm.valid) {
      const formValues = this.securityForm.value;

      // Prepare the securityQuestions array from form values
      const securityQuestions = [
        {
          question: formValues.securityQuestion1,
          answer: formValues.securityAnswer1
        },
        {
          question: formValues.securityQuestion2,
          answer: formValues.securityAnswer2
        }
      ];

      // Call API to update security questions and answers
      this.securityQuestionService.createSecurityQuestion(securityQuestions).subscribe(
        () => {
          console.log('Security questions updated successfully!');
        },
        (error: any) => console.error('Error updating security questions', error)
      );
    } else {
      console.log('Please fill in all required fields');
    }
  }
  toggleSideBar(): void {
    this.commonService.toggleProfileSideBar();
  }
}
