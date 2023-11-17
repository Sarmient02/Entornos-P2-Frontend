import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  users!: any[];

  private userService = inject(UserService);

  constructor() {}

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
