import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';

import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { StorageService } from '../../../../services/storage.service';
import { EventBusService } from 'src/app/services/event-bus.service';
import { EventData } from 'src/app/services/event.class';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, CheckboxModule, InputTextModule, ButtonModule, CardModule, ReactiveFormsModule, PasswordModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isLoggedIn = false;
  isLoginFailed = false;
  roles: string[] = [];

  constructor(
    private storageService: StorageService,
    private eventBusService: EventBusService
  ) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

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
            this.eventBusService.emit(new EventData('roleChange', null));
            this.messageService.add({ severity: 'success', summary: '¡Bienvenido!', detail: 'Has iniciado sesión correctamente.' });
            this.router.navigate(['/home']);
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
          }
        });
    } else {
      this.form.markAllAsTouched();
    }
  }


}
