import { Component, inject } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventBusService } from 'src/app/services/event-bus.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RippleModule, CheckboxModule, ButtonModule, MenubarModule, InputTextModule, CommonModule, AvatarGroupModule, AvatarModule, TieredMenuModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [BrowserModule, BrowserAnimationsModule]
})
export class LayoutComponent {

  private roles: string[] = [];
  isAdmin = false;
  username?: string;

  eventBusSub?: Subscription;

  roleSub?: Subscription;

  constructor(
    private router: Router,
    public storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService
    ) { }

  private messageService = inject(MessageService);

  menu: MenuItem[] | undefined;
  options: MenuItem[] | undefined;

  ngOnInit() {
      this.menu = [
        {
            label: 'Inicio',
            icon: 'material-symbols-rounded home',
            routerLink: '/home'
        },
        {
            label: 'Publicaciones',
            icon: 'material-symbols-rounded content_copy',
            routerLink: '/posts'
        }
      ];

      this.eventBusSub = this.eventBusService.on('logout', () => {
        this.logout();
        
      });

      this.roleSub = this.eventBusService.on('roleChange', () => {
        this.ngOnInit();
      });

      if (this.storageService.isLoggedIn()) {
        
        const user = this.storageService.getUser();
        this.roles = user.roles;
        this.isAdmin = this.roles.includes('admin');
        this.username = user.username;

        this.options = [
          {
            label: 'Mi Perfil',
            icon: 'material-symbols-rounded account_circle',
            routerLink: '/profile',
          },
          {
            label: 'Cerrar Sesión',
            icon: 'material-symbols-rounded logout',
            command: () => this.logout(),
          }
        ];
        if (this.isAdmin){
          this.menu.push({
            label: 'Administrar',
            icon: 'material-symbols-rounded admin_panel_settings',
            routerLink: '/admin',
          });
        }
      } else {
        this.options = [
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

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        this.messageService.add({ key: 'br', severity: 'success', summary: '¡Hasta luego!', detail: 'Has cerrado sesión correctamente.' });
        console.log(res);
        this.storageService.clean();
        this.router.navigate(['/home']);
        this.ngOnInit();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
