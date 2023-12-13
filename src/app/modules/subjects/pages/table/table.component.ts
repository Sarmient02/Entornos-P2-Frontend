import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SubjectService } from 'src/app/services/subject.service';
import { Router, RouterModule } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { Subject } from 'src/app/models/subject.model';
import { ConfirmationService, MessageService, ConfirmEventType} from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CapitalizePipe } from 'src/app/pipes/capitalize.pipe';
import { SkeletonModule } from 'primeng/skeleton';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, RouterModule, MessagesModule, ConfirmDialogModule, ToastModule, CapitalizePipe, SkeletonModule],
  providers: [ConfirmationService],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  loading: boolean = true;

  subjects!: any[];

  private subjectService = inject(SubjectService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  constructor(
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getSubjects();
  }

  //Wait for get subject to success ad show the message
  refresh() {
    this.subjectService.getAllSubjects()
      .subscribe({
        next: (data) => {
          console.log(data)
          this.subjects = data;
          this.messageService.add({severity:'info', summary: 'Materias cargadas', detail: 'Las materias se han refrescado correctamente'});
        },
        error: () => {
        }
      });
    
  }

  getSubjects() {
    this.subjectService.getAllSubjects()
      .subscribe({
        next: (data) => {
          console.log(data)
          this.subjects = data;
          this.loading = false;
        },
        error: () => {
        }
      });
  }

  deleteSubject(subject: any) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar esta materia?',
      header: 'Eliminar a '+subject.name,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subjectService.deleteSubject(subject.id).subscribe((response) => {
          this.getSubjects();
          this.messageService.add({severity:'error', summary: 'Materia eliminada', detail: 'La materia ha sido eliminada correctamente'});
        });
      }
    });
  }


  getSeverity(status: string) {
    if (status === 'LOWSTOCK') {
      return 'warning';
    }
    if (status === 'INSTOCK') {
      return 'success';
    }
    if (status === 'OUTOFSTOCK') {
      return 'danger';
    }
    return "success"
  }
}