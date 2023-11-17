import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, PanelMenuModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
      this.items = [
          {
              label: 'Usuarios',
              icon: 'material-symbols-rounded manage_accounts',
              routerLink: '/admin/users',
              items: [
                  {
                      label: 'Crear Usuario',
                      icon: 'material-symbols-rounded person_add',
                      routerLink: '/admin/users',
                      style: ['background-color: #f1f1f1;']
                  },
              ]
          },
          {
            label: 'Usuaxdrios',
            icon: 'material-symbols-rounded manage_accounts',
            routerLink: '/admin/users',
            items: [
                {
                    label: 'Crear Usuario',
                    icon: 'material-symbols-rounded person_add',
                    routerLink: '/admin/users',
                    style: ['background-color: #f1f1f1;']
                },
            ]
        }
      ];
  }
}
