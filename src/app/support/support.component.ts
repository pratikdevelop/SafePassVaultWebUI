import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
  ],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css'],
})
export class SupportComponent {
  faqs = [
    {
      question: 'How do I reset my password?',
      answer:
        'To reset your password, click on the "Forgot Password?" link on the login page. You will receive an email with instructions to create a new password.',
    },
    {
      question: 'How secure is my data?',
      answer:
        'We employ industry-standard encryption protocols to keep your data safe. Your master password is never stored, ensuring only you have access to your information.',
    },
    {
      question: 'Can I access my passwords on multiple devices?',
      answer:
        'Yes, you can log into your account from any device using your credentials. All your data will sync across devices.',
    },
    {
      question: 'What features does this application offer?',
      answer:
        'The application supports password storage, notes, cards, file storage, activity reports, user management, and sharing capabilities for collaborative access.',
    },
    {
      question: 'How do I share passwords securely?',
      answer:
        'You can share passwords with trusted users directly through the application. Use the "Share" option on the password detail page to send a secure link.',
    },
    {
      question: 'What happens if I forget my master password?',
      answer:
        'Unfortunately, if you forget your master password, you will need to reset your account. This ensures your data remains secure and inaccessible to anyone but you.',
    },
    {
      question: 'How can I manage my notes?',
      answer:
        'You can create, edit, and delete notes in the Notes section. Simply click "Add Note" to start, and use the edit option to modify existing notes.',
    },
    {
      question: 'Is my payment card information safe?',
      answer:
        'Absolutely! We utilize secure storage methods compliant with PCI-DSS standards to keep your card details safe.',
    },
    {
      question: 'How do I upload and manage files?',
      answer:
        'In the File Storage section, you can upload files by clicking "Upload." To manage your files, simply click on any file to view, download, or delete it.',
    },
    {
      question: 'How do I view activity reports?',
      answer:
        'Access the Activity Reports section from the main menu. Here, you can filter reports by date and type of activity for detailed insights.',
    },
    {
      question: 'Can I manage users in my organization?',
      answer:
        'Yes, as an admin, you can add, edit, or remove users from your organization in the User Management section. You can also assign roles and permissions.',
    },
  ];

  contact = {
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phoneNumber: '',
    message: '',
    agreeToPolicies: false,
  };

  successMessage: string = '';
  errorMessage: string = '';

  submitContactForm() {
    if (this.contact.firstName && this.contact.email && this.contact.message) {
      this.successMessage = 'Your message has been sent successfully!';
      this.errorMessage = '';
      this.contact = {
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        phoneNumber: '',
        message: '',
        agreeToPolicies: false,
      };
    } else {
      this.errorMessage = 'Please fill in all required fields.';
      this.successMessage = '';
    }
  }
}
