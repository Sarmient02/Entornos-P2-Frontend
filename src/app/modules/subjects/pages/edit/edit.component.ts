import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MessagesModule, PasswordModule, InputTextModule, ButtonModule, DropdownModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  data: any;

  constructor(
    private route: ActivatedRoute
  ) { }

  idSubject = this.route.snapshot.params['id'];

  careers!: Career[];

  careerId!: Career;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private subjectService = inject(SubjectService);
  private careerService = inject(CareerService);
  private subject: any;
  private messageService = inject(MessageService);

  form = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(3)]],
    careerId: new FormControl()
  });

  ngOnInit() {
    this.getCareers();
    this.subjectService.getSubjectById(this.route.snapshot.params['id'])
      .subscribe({
        next: (data) => {
          console.log(data)
          this.subject = data;
          this.setSubject(data);
        },
        error: () => {
        }
      });
  }

  setSubject(subject: Subject) {

    this.form.setValue({
      id: this.subject.id,
      name: this.subject.name,
      careerId: this.subject.careerId
    });
  }

  getCareers() {
    this.careerService.getCareers()
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
      this.subject = Object.assign(this.subject, this.form.value);
      console.log(this.subject)
      this.subjectService.updateSubject(this.subject)
        .subscribe({
          next: () => {
            this.messageService.add({ key: 'br', severity: 'info', summary: 'Correcto', detail: 'Materia editada correctamente' });
            setTimeout(() => {
              this.form.reset();
              this.router.navigate(['/admin/subjects']);
            }, 1000);
          },
          error: () => {
            this.messageService.add({ severity: 'error' });
          }
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}

