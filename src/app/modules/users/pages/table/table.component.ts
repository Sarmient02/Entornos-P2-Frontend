import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { UserService } from 'src/app/services/user.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, RouterModule],
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
}
