import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'src/app/models/subject.model';
import { Career } from 'src/app/models/career.model';
import { MessagesModule } from 'primeng/messages';
import { Message, MessageService } from 'primeng/api';
import { SubjectService } from 'src/app/services/subject.service';
import { CareerService } from 'src/app/services/career.service';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MessagesModule, PasswordModule, InputTextModule, ButtonModule, DropdownModule],
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  constructor() { }

  careers!: Career[];

  careerId!: Career;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private subject = inject(SubjectService);
  private career = inject(CareerService);
  private data: Subject = {} as Subject;
  private messageService = inject(MessageService);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    careerId: new FormControl()
  });

  ngOnInit() {
    this.getCareers();
  }

  getCareers() {
    this.career.getCareers()
      .subscribe({
        next: (data) => {
          console.log(data)
          this.careers = data;
        },
        error: () => {
        }
      });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { name, careerId } = this.form.getRawValue();
      if (!name || !careerId) {
        return;
      }
      this.data = Object.assign(this.data, this.form.value);
      console.log(this.data)
      this.subject.newSubject(this.data)
        .subscribe({
          next: (data) => {
            this.router.navigate(['/admin/subjects']);
            this.messageService.add({ severity: 'success', summary: data.message });
            this.form.reset();
            setTimeout(() => {
              this.router.navigate(['/admin/subjects']);
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

