import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CareerService } from 'src/app/services/career.service';
import { Router, RouterModule } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { Career } from 'src/app/models/career.model';
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

  careers!: any[];

  private careerService = inject(CareerService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  constructor(
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getCareers();
  }

  //Wait for get subject to success ad show the message
  refresh() {
    this.careerService.getCareers()
      .subscribe({
        next: (data) => {
          console.log(data)
          this.careers = data;
          this.messageService.add({severity:'info', summary: 'Materias cargadas', detail: 'Las materias se han refrescado correctamente'});
        },
        error: () => {
        }
      });
    
  }

  getCareers() {
    this.careerService.getCareers()
      .subscribe({
        next: (data) => {
          console.log(data)
          this.careers = data;
          this.loading = false;
        },
        error: () => {
        }
      });
  }

  deleteCareer(career: any) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar esta carrera?',
      header: 'Eliminar a '+career.name,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.careerService.deleteCareer(career.id).subscribe((response) => {
          this.getCareers();
          this.messageService.add({severity:'error', summary: 'Carrera eliminada', detail: 'La carrera ha sido eliminada correctamente'});
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