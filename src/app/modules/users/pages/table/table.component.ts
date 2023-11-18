import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { UserService } from 'src/app/services/user.service';
import { Router, RouterModule } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, RouterModule, MessagesModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  users!: any[];

  private userService = inject(UserService);
  private router = inject(Router);

  constructor() { }

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

  deleteUser(user: User) {
    console.log(user.id)
    this.userService.deleteUser(user).subscribe((response) => {
      this.getUsers();
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
