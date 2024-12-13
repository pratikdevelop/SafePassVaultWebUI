import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonService } from '../../services/common.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-report-issue',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatSnackBarModule

  ],
  templateUrl: './report-issue.component.html',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,

  styleUrl: './report-issue.component.css'
})
export class ReportIssueComponent {
  ticketForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private commonService: CommonService
  ) {
    this.ticketForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      categorySubtype: [''],
      priority: ['Medium', Validators.required],
      severity: ['Moderate', Validators.required],
      attachments: [''],
      fixVersionId: [''],
      issueTypeId: [''],
      reporterId: [''],
      dueDate: [new Date()],
      resolutionNotes: [''],
      labels: [''],
      projectId: [''],
      parentTicketKey: [''],
      environment: [''],
      customfield_10000: [''],
      customfield_20000: [''],
      customfield_30000: [[]], //
    });
  };


  onSubmit(): void {

    console.log(
      this.ticketForm.value
    )
    const formData = this.ticketForm.value;

    // Prepare the payload as per the given format
    const payload = {
      name: formData.name,
      email: formData.email,
      category: formData.category,
      categorySubtype: formData.categorySubtype,
      description: formData.description,
      priority: formData.priority,
      severity: formData.severity,
      attachments: formData.attachments?.split(',')?.map((item: string) => item.trim()), // Assuming attachments are entered as comma-separated values
      fixVersionId: formData.fixVersionId,
      issueTypeId: formData.issueTypeId,
      reporterId: formData.reporterId,
      dueDate: formData.dueDate,
      labels: formData.labels.split(',').map((item: string) => item.trim()), // Assuming labels are entered as comma-separated values
      projectId: formData.projectId,
      parentTicketKey: formData.parentTicketKey,
      environment: formData.environment,
      customFields: {
        customfield_10000: formData.customfield_10000,
        customfield_20000: formData.customfield_20000,
        customfield_30000: formData.customfield_30000,
      },
    };
    // Call the API to create a new ticket
    this.commonService.createTicket(payload).pipe(
      tap(() => {
        this.snackBar.open('Ticket created successfully!', 'Close', {
          duration: 3000,
        });
      }),
      catchError((error) => {
        this.snackBar.open('Error creating ticket: ' + error.message, 'Close', {
          duration: 3000,
        });
        return of(null);
      })
    ).subscribe()
  }
}
