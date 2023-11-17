import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Message, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { RegisterForm } from 'src/app/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, CheckboxModule, InputTextModule, ButtonModule, CardModule, ReactiveFormsModule, PasswordModule, RouterModule, MessagesModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService]
})
export class RegisterComponent {
  constructor(private messageService: MessageService) {}

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  private registro: RegisterForm = {} as RegisterForm;

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
      this.registro = Object.assign(this.registro, this.form.value);
      console.log(this.registro)
      this.auth.register(this.registro)
        .subscribe({
          next: (data) => {
            this.messageService.add({severity:'success', summary: data.message});
            this.form.reset();
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 3000);
          },
          error: (data) => {
            this.messageService.add({severity:'error', summary: data.message});
          }
        });
    } else {
      this.form.markAllAsTouched();
    }
  }

}
