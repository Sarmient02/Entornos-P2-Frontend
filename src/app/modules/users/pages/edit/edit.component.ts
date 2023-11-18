import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { Message, MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { updateUser } from 'src/app/models/user.model';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MessagesModule, PasswordModule, InputTextModule, ButtonModule, ToastModule, MultiSelectModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [MessageService]
})
export class EditComponent {

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute
    ) { }

  idUser = this.route.snapshot.params['id'];

  selectedRoles: any[] = [];

  rolesOptions = [
    { name: 'Administrador', value: 'admin' },
    { name: 'Usuario', value: 'user' },
    { name: 'Moderador', value: 'moderator' }
  ];
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);
  private user: any;

  form = this.fb.group({
    id: [''],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: [''],
    full_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    student_code: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
    email: ['', [Validators.required, Validators.email]],
    roles: new FormControl()
  });

  ngOnInit() {
    console.log(this.route)
    this.userService.getUserById(this.route.snapshot.params['id'])
      .subscribe({
        next: (data) => {
          console.log(data)
          this.user = data;
          this.setUser(data);
          this.selectedRoles = data.roles;
        },
        error: () => {
        }
      });
    
  }

  setUser(user: updateUser) {
    
    this.form.setValue({
      id: this.user.id,
      username: this.user.username,
      password: "",
      full_name: this.user.full_name,
      student_code: this.user.student_code,
      email: this.user.email,
      roles: this.user.roles
    });
  }

  onSubmit(): void {
    if(this.form.valid) {
      const { username, full_name, student_code, email, roles } = this.form.getRawValue();
      if (!username || !full_name || !student_code || !email || !roles) {
        return;
      }
      this.user = Object.assign(this.user, this.form.value);
      console.log(this.user)
      this.userService.updateUser(this.user)
      .subscribe({
        next: () => {
          this.messageService.add({ key:'myKey', severity: 'success', summary: 'Correcto', detail: 'Usuario editado correctamente' });
          setTimeout(() => {
            this.form.reset();
            this.router.navigate(['/admin/users']);
          }, 1000);
        },
        error: () => {
          this.messageService.add({severity:'error'});
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
    }
  }
