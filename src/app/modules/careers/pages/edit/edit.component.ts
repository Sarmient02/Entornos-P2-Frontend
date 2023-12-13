import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { Message, MessageService } from 'primeng/api';
import { CareerService } from 'src/app/services/career.service';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Career } from 'src/app/models/career.model';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MessagesModule, PasswordModule, InputTextModule, ButtonModule, ToastModule, MultiSelectModule, ProgressSpinnerModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {

  constructor(
    private route: ActivatedRoute
    ) { }

  idCareer = this.route.snapshot.params['id'];
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private careerService = inject(CareerService);
  private career: any;
  private messageService = inject(MessageService);

  form = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(3)]],
    careerCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
  });

  ngOnInit() {
    console.log(this.route)
    this.careerService.getCareerById(this.route.snapshot.params['id'])
      .subscribe({
        next: (data) => {
          console.log(data)
          this.career = data;
          this.setCareer(data);
        },
        error: () => {
        }
      });
    
  }

  setCareer(career: Career) {
    
    this.form.setValue({
      id: this.career.id,
      name: this.career.name,
      careerCode: this.career.careerCode
    });
  }

  onSubmit(): void {
    if(this.form.valid) {
      const { name, careerCode } = this.form.getRawValue();
      if (!name || !careerCode) {
        return;
      }
      this.career = Object.assign(this.career, this.form.value);
      console.log(this.career)
      this.careerService.updateCareer(this.career)
      .subscribe({
        next: () => {
          this.messageService.add({ key:'br', severity: 'info', summary: 'Correcto', detail: 'Carrera editada correctamente' });
          setTimeout(() => {
            this.form.reset();
            this.router.navigate(['/admin/careers']);
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

