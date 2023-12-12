import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';



@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, PanelMenuModule, TabMenuModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    items2: MenuItem[] | undefined;
    items: MenuItem[] | undefined;

    activeItem: MenuItem | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'Usuarios',
                icon: 'material-symbols-rounded manage_accounts',
                routerLink: '/admin/users',
            },
            {
                label: 'Carreras',
                icon: 'material-symbols-rounded manage_accounts',
                routerLink: '/admin/careers',
            },
            {
                label: 'Materias',
                icon: 'material-symbols-rounded manage_accounts',
                routerLink: '/admin/subjects',
            }
        ];

        this.items2 = [
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
                label: 'Materias',
                icon: 'material-symbols-rounded manage_accounts',
                routerLink: '/admin/subjects',
                items: [
                    {
                        label: 'Crear Materia',
                        icon: 'material-symbols-rounded person_add',
                        routerLink: '/admin/subjects',
                        style: ['background-color: #f1f1f1;']
                    },
                ]
            },
            {
                label: 'Carreras',
                icon: 'material-symbols-rounded manage_accounts',
                routerLink: '/admin/careers',
                items: [
                    {
                        label: 'Crear Carrera',
                        icon: 'material-symbols-rounded person_add',
                        routerLink: '/admin/careers',
                        style: ['background-color: #f1f1f1;']
                    },
                ]
            }
        ];

        this.activeItem = this.items[0];
    }
}
