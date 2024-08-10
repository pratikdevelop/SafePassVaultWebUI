import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatFormFieldModule, MatButtonModule, MatSelectModule, CommonModule, MatOptionModule, MatInputModule, ReactiveFormsModule, FormsModule, MatCheckboxModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  notificationForm = new FormGroup({
    notificationType: new FormControl('all'),
    notificationEnable: new FormControl(true),
    notificationFrequency: new FormControl("daily")
  })

}
