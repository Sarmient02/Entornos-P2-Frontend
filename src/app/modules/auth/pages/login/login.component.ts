import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';

import { Router } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, CheckboxModule, InputTextModule, ButtonModule, CardModule, ReactiveFormsModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.valid) {
      const { username, password } = this.form.getRawValue();
      if (!username || !password) {
        return;
      }
      this.auth.login(username, password)
        .subscribe({
          next: (data) => {
            this.storageService.saveUser(data);
            this.isLoginFailed = false;
            this.isLoggedIn = true;
            this.roles = this.storageService.getUser().roles;
            this.router.navigate(['/home']);
          },
          error: () => {
          }
        });
    } else {
      this.form.markAllAsTouched();
    }
  }


}
