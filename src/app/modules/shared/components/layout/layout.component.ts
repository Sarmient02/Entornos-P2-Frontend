import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { Router } from '@angular/router';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RippleModule, CheckboxModule, ButtonModule, MenubarModule, InputTextModule, CommonModule, AvatarGroupModule, AvatarModule, TieredMenuModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [BrowserModule, BrowserAnimationsModule]
})
export class LayoutComponent {

    constructor(private router: Router) { }

    

  items: MenuItem[] | undefined;
  items2: MenuItem[] | undefined;

  ngOnInit() {
      this.items = [
          {
              label: 'Inicio',
              icon: 'material-symbols-rounded home',
              routerLink: '/home'
          },
          {
            label: 'Inicio',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-plus',
                    items: [
                        {
                            label: 'Bookmark',
                            icon: 'pi pi-fw pi-bookmark'
                        },
                        {
                            label: 'Video',
                            icon: 'pi pi-fw pi-video'
                        }
                    ]
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-fw pi-trash'
                },
                {
                    separator: true
                },
                {
                    label: 'Export',
                    icon: 'pi pi-fw pi-external-link'
                }
            ]
        },
        {
            label: 'Documentos',
            icon: 'material-symbols-rounded content_copy'
        }
      ];

      this.items2 = [
        {
          label: 'Iniciar Sesión',
          icon: 'material-symbols-rounded login',
          routerLink: '/auth/login',
        },
        {
            label: 'Registrarse',
            icon: 'material-symbols-rounded account_box',
            routerLink: '/auth/register',
          }
      ];
  }
}
