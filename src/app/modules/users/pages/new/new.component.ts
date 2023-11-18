import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { newUser } from 'src/app/models/user.model';
import { MessagesModule } from 'primeng/messages';
import { Message, MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MessagesModule, PasswordModule, InputTextModule, ButtonModule],
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  providers: [MessageService]
})
export class NewComponent {

  constructor(private messageService: MessageService) {}

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private user = inject(UserService);
  private data: newUser = {} as newUser;

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    full_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    student_code: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    console.log("lol")
    if (this.form.valid) {
      console.log("lol2")
      const { username, password, full_name, student_code, email } = this.form.getRawValue();
      if (!username || !password || !full_name || !student_code || !email) {
        return;
      }
      this.data = Object.assign(this.data, this.form.value);
      console.log(this.data)
      this.user.newUser(this.data)
        .subscribe({
          next: (data) => {
            this.messageService.add({ severity: 'success', summary: data.message });
            this.form.reset();
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
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
