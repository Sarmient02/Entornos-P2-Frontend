import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Career } from 'src/app/models/career.model';
import { MessagesModule } from 'primeng/messages';
import { Message, MessageService } from 'primeng/api';
import { CareerService } from 'src/app/services/career.service';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MessagesModule, PasswordModule, InputTextModule, ButtonModule],
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent {

  constructor() { }

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private careerService = inject(CareerService);
  private data: Career = {} as Career;
  private messageService = inject(MessageService);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    careerCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
  });

  onSubmit(): void {
    if (this.form.valid) {
      const { name, careerCode } = this.form.getRawValue();
      if (!name || !careerCode) {
        return;
      }
      this.data = Object.assign(this.data, this.form.value);
      console.log(this.data)
      this.careerService.newCareer(this.data)
        .subscribe({
          next: (data) => {
            this.router.navigate(['/admin/careers']);
            this.messageService.add({ severity: 'success', summary: data.message });
            this.form.reset();
            setTimeout(() => {
              this.router.navigate(['/admin/careers']);
            }, 3000);
          },
          error: (data) => {
            this.messageService.add({ severity: 'error', summary: data.message });
          }
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}