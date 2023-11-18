import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { UserService } from 'src/app/services/user.service';
import { Router, RouterModule } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { User } from 'src/app/models/user.model';
import { ConfirmationService, MessageService, ConfirmEventType} from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CapitalizePipe } from 'src/app/pipes/capitalize.pipe';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, RouterModule, MessagesModule, ConfirmDialogModule, ToastModule, CapitalizePipe],
  providers: [ConfirmationService, MessageService],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  users!: any[];

  private userService = inject(UserService);
  private router = inject(Router);

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getUsers();

  }

  getUsers() {
    this.userService.getAllUsers()
      .subscribe({
        next: (data) => {
          console.log(data)
          this.users = data;
        },
        error: () => {
        }
      });
  }

  deleteUser(user: any) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar este usuario?',
      header: 'Eliminar a '+user.fullName,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(user).subscribe((response) => {
          this.getUsers();
          this.messageService.add({severity:'error', summary: 'Usuario eliminado', detail: 'El usuario ha sido eliminado correctamente'});
        });
      }
    });
  }

  see_update(user: User) {
    sessionStorage.setItem("username", user.username);
    sessionStorage.setItem("email", user.email);
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
